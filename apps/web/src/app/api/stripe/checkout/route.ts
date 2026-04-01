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

const checkoutSchema = z.object({
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
  mode: z.enum(["subscription", "payment"]).default("subscription"),
  quantity: z.number().int().positive().default(1),
});

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  const { basePriceId, overagePriceId } = STRIPE_IDS.subscription;
  if (!basePriceId || !overagePriceId) {
    return NextResponse.json(
      { success: false, error: "Stripe prices not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      );
    }

    const existing = await getDb().query.customers.findFirst({
      where: eq(schema.customers.authUserId, auth.uid),
    });

    let stripeCustomerId: string;

    if (existing) {
      stripeCustomerId = existing.stripeCustomerId;
    } else {
      const customer = await getStripe().customers.create({
        metadata: { authUserId: auth.uid },
        ...(auth.phone ? { phone: auth.phone } : {}),
      });
      await getDb().insert(schema.customers).values({
        authUserId: auth.uid,
        stripeCustomerId: customer.id,
      });
      stripeCustomerId = customer.id;
    }

    const session = await getStripe().checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      line_items: [
        { price: basePriceId, quantity: 1 },
        { price: overagePriceId },
      ],
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
