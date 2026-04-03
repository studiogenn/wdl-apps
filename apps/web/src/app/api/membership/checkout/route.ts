import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";
import { getDb, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { STRIPE_IDS, type MembershipTier } from "@/lib/stripe-config";
import { authenticateRequest, isErrorResponse } from "@/lib/auth/middleware";

const checkoutSchema = z.object({
  tier: z.enum(["starter", "standard", "family"]),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

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

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  try {
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 },
      );
    }

    const tier = parsed.data.tier as MembershipTier;
    const tierConfig = STRIPE_IDS.membership.tiers[tier];
    const { overagePriceId } = STRIPE_IDS.membership;

    if (!tierConfig.priceId || !overagePriceId) {
      return NextResponse.json(
        { success: false, error: "Stripe prices not configured" },
        { status: 503 },
      );
    }

    const stripeCustomerId = await getOrCreateStripeCustomer(auth.uid, auth.phone);

    const session = await getStripe().checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      allow_promotion_codes: true,
      line_items: [
        { price: tierConfig.priceId, quantity: 1 },
        { price: overagePriceId },
      ],
      subscription_data: {
        metadata: {
          tier,
          pickups: String(tierConfig.pickups),
          includedLbs: String(tierConfig.includedLbs),
          source: "join_funnel",
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
      { status: 500 },
    );
  }
}
