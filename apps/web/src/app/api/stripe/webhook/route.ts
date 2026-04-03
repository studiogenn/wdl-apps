import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getDb, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { STRIPE_IDS } from "@/lib/stripe-config";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { success: false, error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { success: false, error: "Webhook secret not configured" },
      { status: 503 }
    );
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid signature" },
      { status: 400 }
    );
  }

  // Idempotency: skip if already processed
  const existing = await getDb().query.subscriptionEvents.findFirst({
    where: eq(schema.subscriptionEvents.stripeEventId, event.id),
  });
  if (existing) {
    return NextResponse.json({ success: true, data: { skipped: true } });
  }

  try {
    switch (event.type) {
      // ── Checkout ──
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode === "subscription" && session.subscription) {
          const subscription = await getStripe().subscriptions.retrieve(
            session.subscription as string,
            { expand: ["latest_invoice"] }
          );
          const customerId = await findCustomerByStripeId(
            subscription.customer as string
          );
          if (!customerId) break;

          const invoice = subscription.latest_invoice as Stripe.Invoice | null;

          await getDb().insert(schema.subscriptions).values({
            customerId,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0].price.id,
            status: subscription.status,
            currentPeriodStart: new Date(
              (invoice?.period_start ?? subscription.start_date) * 1000
            ),
            currentPeriodEnd: new Date(
              (invoice?.period_end ?? subscription.start_date) * 1000
            ),
          });
        }

        if (session.mode === "payment" && session.payment_intent) {
          const pi = await getStripe().paymentIntents.retrieve(
            session.payment_intent as string
          );
          const customerId = await findCustomerByStripeId(
            pi.customer as string
          );
          if (!customerId) break;

          await getDb()
            .insert(schema.payments)
            .values({
              customerId,
              stripePaymentIntentId: pi.id,
              amount: pi.amount,
              currency: pi.currency,
              status: pi.status,
              description: pi.description ?? null,
              metadata: pi.metadata ? JSON.parse(JSON.stringify(pi.metadata)) : null,
            })
            .onConflictDoUpdate({
              target: schema.payments.stripePaymentIntentId,
              set: { status: pi.status, updatedAt: new Date() },
            });
        }
        break;
      }

      // ── Payment Intents ──
      case "payment_intent.succeeded":
      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        if (!pi.customer) break;
        const customerId = await findCustomerByStripeId(pi.customer as string);
        if (!customerId) break;

        await getDb()
          .insert(schema.payments)
          .values({
            customerId,
            stripePaymentIntentId: pi.id,
            amount: pi.amount,
            currency: pi.currency,
            status: pi.status,
            description: pi.description ?? null,
            metadata: pi.metadata ? JSON.parse(JSON.stringify(pi.metadata)) : null,
          })
          .onConflictDoUpdate({
            target: schema.payments.stripePaymentIntentId,
            set: { status: pi.status, updatedAt: new Date() },
          });
        break;
      }

      // ── Refunds ──
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const piId = typeof charge.payment_intent === "string"
          ? charge.payment_intent
          : charge.payment_intent?.id;
        if (!piId) break;

        await getDb()
          .update(schema.payments)
          .set({ status: "refunded", updatedAt: new Date() })
          .where(eq(schema.payments.stripePaymentIntentId, piId));
        break;
      }

      // ── Invoices ──
      case "invoice.created":
      case "invoice.paid":
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        if (!invoice.customer) break;
        const customerId = await findCustomerByStripeId(invoice.customer as string);
        if (!customerId) break;

        const subId = getSubscriptionId(invoice);

        await getDb()
          .insert(schema.invoices)
          .values({
            customerId,
            stripeInvoiceId: invoice.id,
            stripeSubscriptionId: subId,
            amountDue: invoice.amount_due,
            amountPaid: invoice.amount_paid,
            currency: invoice.currency,
            status: invoice.status ?? "draft",
            invoiceUrl: invoice.hosted_invoice_url ?? null,
            invoicePdf: invoice.invoice_pdf ?? null,
          })
          .onConflictDoUpdate({
            target: schema.invoices.stripeInvoiceId,
            set: {
              amountPaid: invoice.amount_paid,
              status: invoice.status ?? "draft",
              invoiceUrl: invoice.hosted_invoice_url ?? null,
              invoicePdf: invoice.invoice_pdf ?? null,
            },
          });

        // Also update subscription period on invoice.paid
        if (event.type === "invoice.paid" && subId) {
          const subscription = await getStripe().subscriptions.retrieve(subId);
          await getDb()
            .update(schema.subscriptions)
            .set({
              status: subscription.status,
              currentPeriodStart: new Date(invoice.period_start * 1000),
              currentPeriodEnd: new Date(invoice.period_end * 1000),
              updatedAt: new Date(),
            })
            .where(
              eq(schema.subscriptions.stripeSubscriptionId, subscription.id)
            );
        }
        break;
      }

      // ── Subscriptions ──
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await getDb()
          .update(schema.subscriptions)
          .set({
            status: subscription.status,
            stripePriceId: subscription.items.data[0].price.id,
            cancelAtPeriodEnd: subscription.cancel_at_period_end ? 1 : 0,
            updatedAt: new Date(),
          })
          .where(
            eq(schema.subscriptions.stripeSubscriptionId, subscription.id)
          );
        break;
      }

      // ── SetupIntent (membership safety net) ──
      case "setup_intent.succeeded": {
        const si = event.data.object as Stripe.SetupIntent;
        const meta = si.metadata;
        if (meta?.source !== "join_funnel" || !meta.priceId) break;

        const siCustomer = typeof si.customer === "string" ? si.customer : si.customer?.id;
        if (!siCustomer) break;

        const localCustomer = await findCustomerByStripeId(siCustomer);
        if (!localCustomer) break;

        // Check if subscription already exists (activate call may have succeeded)
        const existingSub = await getDb().query.subscriptions.findFirst({
          where: eq(schema.subscriptions.customerId, localCustomer),
        });
        if (existingSub && existingSub.status !== "canceled") break;

        // Activate call missed — create subscription from webhook
        const pmId = typeof si.payment_method === "string"
          ? si.payment_method
          : si.payment_method?.id;
        if (!pmId) break;

        const { overagePriceId } = STRIPE_IDS.membership;

        await getStripe().subscriptions.create({
          customer: siCustomer,
          items: [
            { price: meta.priceId },
            { price: overagePriceId },
          ],
          default_payment_method: pmId,
          metadata: {
            tier: meta.tier ?? "",
            pickups: meta.pickups ?? "",
            includedLbs: meta.includedLbs ?? "",
            source: "join_funnel_webhook_recovery",
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await getDb()
          .update(schema.subscriptions)
          .set({
            status: "canceled",
            updatedAt: new Date(),
          })
          .where(
            eq(schema.subscriptions.stripeSubscriptionId, subscription.id)
          );
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = getSubscriptionId(invoice);
        if (!subId) break;

        await getDb()
          .update(schema.subscriptions)
          .set({
            status: "past_due",
            updatedAt: new Date(),
          })
          .where(
            eq(schema.subscriptions.stripeSubscriptionId, subId)
          );
        break;
      }
    }

    // Log the event
    await getDb().insert(schema.subscriptionEvents).values({
      stripeEventId: event.id,
      eventType: event.type,
      payload: JSON.parse(JSON.stringify(event.data.object)),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Webhook processing failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

function getSubscriptionId(invoice: Stripe.Invoice): string | null {
  if (invoice.parent?.subscription_details?.subscription) {
    const sub = invoice.parent.subscription_details.subscription;
    return typeof sub === "string" ? sub : sub.id;
  }
  return null;
}

async function findCustomerByStripeId(
  stripeCustomerId: string
): Promise<string | null> {
  const customer = await getDb().query.customers.findFirst({
    where: eq(schema.customers.stripeCustomerId, stripeCustomerId),
  });
  return customer?.id ?? null;
}
