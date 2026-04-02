import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";
import { getDb, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { authenticateRequest, isErrorResponse } from "@/lib/auth/middleware";

const bodySchema = z.object({
  paymentMethodId: z.string().min(1),
});

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  const body = await request.json();
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid request." },
      { status: 400 }
    );
  }

  const customer = await getDb().query.customers.findFirst({
    where: eq(schema.customers.authUserId, auth.uid),
  });

  if (!customer) {
    return NextResponse.json(
      { success: false, error: "No billing account found." },
      { status: 404 }
    );
  }

  try {
    await getStripe().customers.update(customer.stripeCustomerId, {
      invoice_settings: {
        default_payment_method: parsed.data.paymentMethodId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update payment method";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
