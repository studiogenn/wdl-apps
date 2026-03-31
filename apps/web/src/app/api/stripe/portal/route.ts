import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";
import { getDb, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import {
  authenticateRequest,
  isErrorResponse,
} from "@/lib/firebase/auth-middleware";

const portalSchema = z.object({
  returnUrl: z.string().url(),
});

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
      where: eq(schema.customers.firebaseUid, auth.uid),
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, error: "No subscription found" },
        { status: 404 }
      );
    }

    const session = await getStripe().billingPortal.sessions.create({
      customer: customer.stripeCustomerId,
      return_url: parsed.data.returnUrl,
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
