import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";
import { getDb, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { STRIPE_IDS, type MembershipTier } from "@/lib/stripe-config";
import { authenticateRequest, isErrorResponse } from "@/lib/auth/middleware";

const setupSchema = z.object({
  action: z.literal("setup"),
  tier: z.enum(["weekly", "family"]),
});

const activateSchema = z.object({
  action: z.literal("activate"),
  tier: z.enum(["weekly", "family"]),
  paymentMethodId: z.string().min(1),
});

const requestSchema = z.discriminatedUnion("action", [setupSchema, activateSchema]);

async function getOrCreateStripeCustomer(authUserId: string, email: string, phone?: string) {
  const existing = await getDb().query.customers.findFirst({
    where: eq(schema.customers.authUserId, authUserId),
  });

  if (existing) return existing.stripeCustomerId;

  const customer = await getStripe().customers.create({
    email,
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
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 },
      );
    }

    const stripeCustomerId = await getOrCreateStripeCustomer(auth.uid, auth.email, auth.phone);

    if (parsed.data.action === "setup") {
      const tier = parsed.data.tier;
      const tierConfig = STRIPE_IDS.membership.tiers[tier];

      const setupIntent = await getStripe().setupIntents.create({
        customer: stripeCustomerId,
        usage: "off_session",
        automatic_payment_methods: { enabled: true },
        metadata: {
          tier,
          priceId: tierConfig.priceId,
          pickups: String(tierConfig.pickups),
          includedLbs: String(tierConfig.includedLbs),
          source: "join_funnel",
        },
      });

      return NextResponse.json({
        success: true,
        data: { clientSecret: setupIntent.client_secret },
      });
    }

    // action === "activate"
    const tier = parsed.data.tier as MembershipTier;
    const tierConfig = STRIPE_IDS.membership.tiers[tier];
    const { overagePriceId } = STRIPE_IDS.membership;

    // Pull address from payment method (Apple Pay / Google Pay may provide it)
    try {
      const pm = await getStripe().paymentMethods.retrieve(parsed.data.paymentMethodId);
      const addr = pm.billing_details?.address;
      const pmName = pm.billing_details?.name;
      const pmPhone = pm.billing_details?.phone;
      if (addr?.line1) {
        await getStripe().customers.update(stripeCustomerId, {
          address: {
            line1: addr.line1 ?? undefined,
            line2: addr.line2 ?? undefined,
            city: addr.city ?? undefined,
            state: addr.state ?? undefined,
            postal_code: addr.postal_code ?? undefined,
            country: addr.country ?? undefined,
          },
          ...(pmName ? { name: pmName } : {}),
          ...(pmPhone ? { phone: pmPhone } : {}),
        });
      }
    } catch {
      // Non-critical — address enrichment failed, continue
    }

    if (!tierConfig.priceId || !overagePriceId) {
      return NextResponse.json(
        { success: false, error: "Stripe prices not configured" },
        { status: 503 },
      );
    }

    // Guard: check if customer already has an active subscription
    const existingSubs = await getStripe().subscriptions.list({
      customer: stripeCustomerId,
      status: "active",
      limit: 1,
    });
    if (existingSubs.data.length > 0) {
      return NextResponse.json({
        success: true,
        data: {
          subscriptionId: existingSubs.data[0].id,
          status: existingSubs.data[0].status,
        },
      });
    }

    const subscription = await getStripe().subscriptions.create({
      customer: stripeCustomerId,
      items: [
        { price: tierConfig.priceId },
        { price: overagePriceId },
      ],
      default_payment_method: parsed.data.paymentMethodId,
      metadata: {
        tier,
        pickups: String(tierConfig.pickups),
        includedLbs: String(tierConfig.includedLbs),
        source: "join_funnel",
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        subscriptionId: subscription.id,
        status: subscription.status,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to process request";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
