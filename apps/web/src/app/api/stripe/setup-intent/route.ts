import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getDb, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { authenticateRequest, isErrorResponse } from "@/lib/auth/middleware";

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  const db = getDb();

  const customer = await db.query.customers.findFirst({
    where: eq(schema.customers.authUserId, auth.uid),
  });

  let stripeCustomerId: string;

  if (customer) {
    stripeCustomerId = customer.stripeCustomerId;
  } else {
    const stripeCustomer = await getStripe().customers.create({
      email: auth.email,
      metadata: { authUserId: auth.uid },
      ...(auth.phone ? { phone: auth.phone } : {}),
    });
    await db.insert(schema.customers).values({
      authUserId: auth.uid,
      stripeCustomerId: stripeCustomer.id,
    });
    stripeCustomerId = stripeCustomer.id;
  }

  try {
    const setupIntent = await getStripe().setupIntents.create({
      customer: stripeCustomerId,
      usage: "off_session",
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({
      success: true,
      data: { clientSecret: setupIntent.client_secret },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create setup intent";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
