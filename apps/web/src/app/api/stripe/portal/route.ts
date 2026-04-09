import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";
import { getDb, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { STRIPE_IDS } from "@/lib/stripe-config";
import {
  authenticateRequest,
  isErrorResponse,
} from "@/lib/auth/middleware";

const portalSchema = z.object({
  returnUrl: z.string().url(),
});

// Cache the portal configuration ID so we only create it once per process
let portalConfigId: string | null = null;

/**
 * Get or create a Stripe Billing Portal configuration that allows
 * customers to update their subscription (upgrade/downgrade) in addition
 * to the default cancel + payment method management.
 */
async function getPortalConfigId(): Promise<string> {
  if (portalConfigId) return portalConfigId;

  const stripe = getStripe();

  // Collect all switchable price IDs from both membership and legacy tiers
  const membershipPrices = Object.values(STRIPE_IDS.membership.tiers).map(
    (t) => t.priceId,
  );
  const legacyPrices = Object.values(STRIPE_IDS.subscription.tiers).map(
    (t) => t.priceId,
  );
  const allPrices = [...membershipPrices, ...legacyPrices];

  // Check if we already have a configuration with updates enabled
  const existing = await stripe.billingPortal.configurations.list({ limit: 10 });
  const match = existing.data.find(
    (c) => c.is_default || c.features.subscription_update.enabled,
  );

  if (match?.features.subscription_update.enabled) {
    portalConfigId = match.id;
    return portalConfigId;
  }

  // Create a new portal configuration with plan switching enabled
  const config = await stripe.billingPortal.configurations.create({
    business_profile: {
      headline: "Manage your We Deliver Laundry subscription",
    },
    features: {
      subscription_update: {
        enabled: true,
        default_allowed_updates: ["price", "promotion_code"],
        proration_behavior: "create_prorations",
        products: [
          {
            product: STRIPE_IDS.membership.productId,
            prices: membershipPrices,
          },
          {
            product: STRIPE_IDS.subscription.productId,
            prices: legacyPrices,
          },
        ],
      },
      subscription_cancel: {
        enabled: true,
        mode: "at_period_end",
      },
      payment_method_update: {
        enabled: true,
      },
      invoice_history: {
        enabled: true,
      },
    },
  });

  portalConfigId = config.id;
  return portalConfigId;
}

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  try {
    const body = await request.json();
    const parsed = portalSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      );
    }

    const customer = await getDb().query.customers.findFirst({
      where: eq(schema.customers.authUserId, auth.uid),
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, error: "No subscription found" },
        { status: 404 }
      );
    }

    const configId = await getPortalConfigId();

    const session = await getStripe().billingPortal.sessions.create({
      customer: customer.stripeCustomerId,
      return_url: parsed.data.returnUrl,
      configuration: configId,
    });

    return NextResponse.json({ success: true, data: { url: session.url } });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create portal session";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
