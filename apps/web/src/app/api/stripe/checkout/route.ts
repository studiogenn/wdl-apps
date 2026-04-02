import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";
import { getDb, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { STRIPE_IDS } from "@/lib/stripe-config";
import { auth } from "@/lib/auth";

const subscriptionSchema = z.object({
  mode: z.literal("subscription"),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
  bags: z.number().int().min(1).max(4),
  frequency: z.enum(["weekly", "biweekly"]),
  planMetadata: z.record(z.string(), z.string()).optional(),
});

const paymentSchema = z.object({
  mode: z.literal("payment"),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
  amountCents: z.number().int().positive(),
  description: z.string().optional(),
  planMetadata: z.record(z.string(), z.string()).optional(),
});

const checkoutSchema = z.discriminatedUnion("mode", [
  subscriptionSchema,
  paymentSchema,
]);

async function getOrCreateStripeCustomer(authUserId: string, phone?: string) {
  const existing = await getDb().query.customers.findFirst({
    where: eq(schema.customers.authUserId, authUserId),
  });

  if (existing) return existing.stripeCustomerId;

  const customer = await getStripe().customers.create({
    metadata: { authUserId },
    ...(phone ? { phone } : {}),
  });
  await getDb().insert(schema.customers).values({
    authUserId,
    stripeCustomerId: customer.id,
  });
  return customer.id;
}

async function resolveCustomer(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return null;
    const user = session.user;
    const customerId = await getOrCreateStripeCustomer(
      user.id,
      (user as Record<string, unknown>).phone as string | undefined,
    );
    return { authUserId: user.id, stripeCustomerId: customerId };
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      );
    }

    if (parsed.data.mode === "subscription") {
      const { basePriceId, overagePriceId } = STRIPE_IDS.subscription;
      if (!basePriceId || !overagePriceId) {
        return NextResponse.json(
          { success: false, error: "Stripe prices not configured" },
          { status: 503 }
        );
      }

      const customer = await resolveCustomer(request);
      const pickupsPerMonth = parsed.data.frequency === "weekly" ? 4 : 2;
      const quantity = parsed.data.bags * pickupsPerMonth;

      const session = await getStripe().checkout.sessions.create({
        ...(customer ? { customer: customer.stripeCustomerId } : {}),
        mode: "subscription",
        line_items: [
          { price: basePriceId, quantity },
          { price: overagePriceId },
        ],
        subscription_data: {
          metadata: {
            bags: String(parsed.data.bags),
            frequency: parsed.data.frequency,
            ...parsed.data.planMetadata,
          },
        },
        success_url: parsed.data.successUrl,
        cancel_url: parsed.data.cancelUrl,
      });

      return NextResponse.json({ success: true, data: { url: session.url } });
    }

    // Payment mode (PAYG)
    const customer = await resolveCustomer(request);

    const session = await getStripe().checkout.sessions.create({
      ...(customer ? { customer: customer.stripeCustomerId } : {}),
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product: STRIPE_IDS.singleOrder.productId,
            unit_amount: parsed.data.amountCents,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        capture_method: "manual",
        metadata: {
          ...(customer ? { authUserId: customer.authUserId } : {}),
          ...parsed.data.planMetadata,
        },
      },
      success_url: parsed.data.successUrl,
      cancel_url: parsed.data.cancelUrl,
    });

    return NextResponse.json({ success: true, data: { url: session.url } });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create checkout";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
