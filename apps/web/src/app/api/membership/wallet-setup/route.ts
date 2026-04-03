import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";
import { STRIPE_IDS } from "@/lib/stripe-config";

const setupSchema = z.object({
  tier: z.enum(["weekly", "family"]),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = setupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 },
      );
    }

    const tierConfig = STRIPE_IDS.membership.tiers[parsed.data.tier];

    const setupIntent = await getStripe().setupIntents.create({
      usage: "off_session",
      automatic_payment_methods: { enabled: true },
      metadata: {
        tier: parsed.data.tier,
        priceId: tierConfig.priceId,
        pickups: String(tierConfig.pickups),
        includedLbs: String(tierConfig.includedLbs),
        source: "wallet_quick_checkout",
      },
    });

    return NextResponse.json({
      success: true,
      data: { clientSecret: setupIntent.client_secret },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create setup";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
