import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getDb, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { authenticateRequest, isErrorResponse } from "@/lib/auth/middleware";

type PaymentMethodInfo = {
  readonly id: string;
  readonly brand: string;
  readonly last4: string;
  readonly expMonth: number;
  readonly expYear: number;
};

type SubscriptionInfo = {
  readonly id: string;
  readonly status: string;
  readonly priceId: string;
  readonly currentPeriodStart: string;
  readonly currentPeriodEnd: string;
  readonly cancelAtPeriodEnd: boolean;
};

type InvoiceInfo = {
  readonly id: string;
  readonly date: string;
  readonly amountDue: number;
  readonly amountPaid: number;
  readonly currency: string;
  readonly status: string;
  readonly invoiceUrl: string | null;
  readonly invoicePdf: string | null;
};

type BillingResponse = {
  readonly hasStripeAccount: boolean;
  readonly subscription: SubscriptionInfo | null;
  readonly paymentMethod: PaymentMethodInfo | null;
  readonly invoices: readonly InvoiceInfo[];
};

export async function GET(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  const db = getDb();

  const customer = await db.query.customers.findFirst({
    where: eq(schema.customers.authUserId, auth.uid),
  });

  if (!customer) {
    const empty: BillingResponse = {
      hasStripeAccount: false,
      subscription: null,
      paymentMethod: null,
      invoices: [],
    };
    return NextResponse.json({ success: true, data: empty });
  }

  // Subscription from local DB
  const sub = await db.query.subscriptions.findFirst({
    where: eq(schema.subscriptions.customerId, customer.id),
  });

  const subscription: SubscriptionInfo | null = sub
    ? {
        id: sub.stripeSubscriptionId,
        status: sub.status,
        priceId: sub.stripePriceId,
        currentPeriodStart: sub.currentPeriodStart.toISOString(),
        currentPeriodEnd: sub.currentPeriodEnd.toISOString(),
        cancelAtPeriodEnd: sub.cancelAtPeriodEnd === 1,
      }
    : null;

  // Payment method from Stripe (not stored locally)
  let paymentMethod: PaymentMethodInfo | null = null;
  try {
    const stripeCustomer = await getStripe().customers.retrieve(
      customer.stripeCustomerId
    );

    if (!stripeCustomer.deleted) {
      const defaultPmId =
        typeof stripeCustomer.invoice_settings.default_payment_method === "string"
          ? stripeCustomer.invoice_settings.default_payment_method
          : stripeCustomer.invoice_settings.default_payment_method?.id;

      if (defaultPmId) {
        const pm = await getStripe().paymentMethods.retrieve(defaultPmId);
        if (pm.card) {
          paymentMethod = {
            id: pm.id,
            brand: pm.card.brand,
            last4: pm.card.last4,
            expMonth: pm.card.exp_month,
            expYear: pm.card.exp_year,
          };
        }
      }
    }
  } catch {
    // Stripe unreachable — return what we have from local DB
  }

  // Invoices from local DB
  const invoiceRows = await db
    .select()
    .from(schema.invoices)
    .where(eq(schema.invoices.customerId, customer.id))
    .orderBy(desc(schema.invoices.createdAt))
    .limit(12);

  const invoices: readonly InvoiceInfo[] = invoiceRows.map((inv) => ({
    id: inv.stripeInvoiceId,
    date: inv.createdAt.toISOString(),
    amountDue: inv.amountDue,
    amountPaid: inv.amountPaid,
    currency: inv.currency,
    status: inv.status,
    invoiceUrl: inv.invoiceUrl,
    invoicePdf: inv.invoicePdf,
  }));

  const data: BillingResponse = {
    hasStripeAccount: true,
    subscription,
    paymentMethod,
    invoices,
  };

  return NextResponse.json({ success: true, data });
}
