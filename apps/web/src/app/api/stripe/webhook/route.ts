import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
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

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid signature" },
      { status: 400 }
    );
  }

  // Idempotency: skip if already processed
  const existing = await db.query.subscriptionEvents.findFirst({
    where: eq(schema.subscriptionEvents.stripeEventId, event.id),
  });
  if (existing) {
    return NextResponse.json({ success: true, data: { skipped: true } });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription" || !session.subscription) break;

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string,
          { expand: ["latest_invoice"] }
        );
        const customerId = await findCustomerByStripeId(
          subscription.customer as string
        );
        if (!customerId) break;

        const invoice = subscription.latest_invoice as Stripe.Invoice | null;

        await db.insert(schema.subscriptions).values({
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
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = getSubscriptionId(invoice);
        if (!subId) break;

        const subscription = await stripe.subscriptions.retrieve(subId);
        await db
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
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await db
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

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await db
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
    }

    // Log the event
    await db.insert(schema.subscriptionEvents).values({
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
  const customer = await db.query.customers.findFirst({
    where: eq(schema.customers.stripeCustomerId, stripeCustomerId),
  });
  return customer?.id ?? null;
}
