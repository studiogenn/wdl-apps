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

  if (!customer) {
    return NextResponse.json(
      { success: false, error: "No billing account found." },
      { status: 404 }
    );
  }

  const sub = await db.query.subscriptions.findFirst({
    where: eq(schema.subscriptions.customerId, customer.id),
  });

  if (!sub || sub.status !== "active") {
    return NextResponse.json(
      { success: false, error: "No active subscription to cancel." },
      { status: 404 }
    );
  }

  try {
    await getStripe().subscriptions.update(sub.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    await db
      .update(schema.subscriptions)
      .set({ cancelAtPeriodEnd: 1, updatedAt: new Date() })
      .where(eq(schema.subscriptions.stripeSubscriptionId, sub.stripeSubscriptionId));

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to cancel subscription";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
