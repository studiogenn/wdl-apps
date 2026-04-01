import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";
import { getDb, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { STRIPE_IDS } from "@/lib/stripe-config";
import { authenticateRequest, isErrorResponse } from "@/lib/auth/middleware";

const usageSchema = z.object({
  pounds: z.number().int().positive(),
});

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  const { meterEventName } = STRIPE_IDS.subscription;
  if (!meterEventName) {
    return NextResponse.json(
      { success: false, error: "Billing meter not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const parsed = usageSchema.safeParse(body);
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
        { success: false, error: "Customer not found" },
        { status: 404 }
      );
    }

    const meterEvent = await getStripe().billing.meterEvents.create({
      event_name: meterEventName,
      payload: {
        stripe_customer_id: customer.stripeCustomerId,
        value: String(parsed.data.pounds),
      },
    });

    return NextResponse.json({
      success: true,
      data: { eventId: meterEvent.identifier, pounds: parsed.data.pounds },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to report usage";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
