import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";
import { getDb, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { STRIPE_IDS, type MembershipTier } from "@/lib/stripe-config";
import { authenticateRequest, isErrorResponse } from "@/lib/auth/middleware";

const changePlanSchema = z.object({
  tier: z.enum(["weekly", "family"]),
});

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  try {
    const body = await request.json();
    const parsed = changePlanSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid plan selected" },
        { status: 400 },
      );
    }

    const db = getDb();
    const customer = await db.query.customers.findFirst({
      where: eq(schema.customers.authUserId, auth.uid),
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, error: "No account found" },
        { status: 404 },
      );
    }

    // Find active subscription in local DB
    const sub = await db.query.subscriptions.findFirst({
      where: eq(schema.subscriptions.customerId, customer.id),
    });

    if (!sub || sub.status === "canceled") {
      return NextResponse.json(
        { success: false, error: "No active subscription to change" },
        { status: 404 },
      );
    }

    const newTier = parsed.data.tier as MembershipTier;
    const newPrice = STRIPE_IDS.membership.tiers[newTier];

    if (sub.stripePriceId === newPrice.priceId) {
      return NextResponse.json(
        { success: false, error: "You're already on this plan" },
        { status: 400 },
      );
    }

    // Retrieve the Stripe subscription to find the subscription item ID
    const stripeSub = await getStripe().subscriptions.retrieve(sub.stripeSubscriptionId);
    // Find the main plan item (not the overage metered item)
    const planItem = stripeSub.items.data.find(
      (item) => !item.price.recurring?.usage_type || item.price.recurring.usage_type === "licensed",
    );

    if (!planItem) {
      return NextResponse.json(
        { success: false, error: "Unable to find plan item on subscription" },
        { status: 500 },
      );
    }

    // Update the subscription item to the new price with proration
    await getStripe().subscriptions.update(sub.stripeSubscriptionId, {
      items: [
        {
          id: planItem.id,
          price: newPrice.priceId,
        },
      ],
      proration_behavior: "create_prorations",
    });

    // Update local DB
    await db
      .update(schema.subscriptions)
      .set({
        stripePriceId: newPrice.priceId,
        updatedAt: new Date(),
      })
      .where(eq(schema.subscriptions.stripeSubscriptionId, sub.stripeSubscriptionId));

    return NextResponse.json({
      success: true,
      data: { tier: newTier, priceId: newPrice.priceId },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to change plan";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
