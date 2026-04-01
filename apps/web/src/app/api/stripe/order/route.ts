import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";
import { getDb, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { authenticateRequest, isErrorResponse } from "@/lib/auth/middleware";

const orderSchema = z.object({
  amountCents: z.number().int().positive(),
  description: z.string().min(1).optional(),
});

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  try {
    const body = await request.json();
    const parsed = orderSchema.safeParse(body);
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

    const paymentIntent = await getStripe().paymentIntents.create({
      amount: parsed.data.amountCents,
      currency: "usd",
      customer: stripeCustomerId,
      capture_method: "manual",
      ...(parsed.data.description
        ? { description: parsed.data.description }
        : {}),
      metadata: { authUserId: auth.uid },
    });

    return NextResponse.json({
      success: true,
      data: {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
