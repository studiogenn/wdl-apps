import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ success: true, data: { loggedIn: false } });
    }

    const user = session.user as Record<string, unknown>;
    const db = getDb();

    // Find Stripe customer linked to this auth user
    const customer = await db.query.customers.findFirst({
      where: eq(schema.customers.authUserId, session.user.id),
    });

    let hasActiveSubscription = false;
    if (customer) {
      const activeSub = await db.query.subscriptions.findFirst({
        where: and(
          eq(schema.subscriptions.customerId, customer.id),
          eq(schema.subscriptions.status, "active"),
        ),
      });
      hasActiveSubscription = !!activeSub;
    }

    return NextResponse.json({
      success: true,
      data: {
        loggedIn: true,
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        phone: (user.phone as string) ?? "",
        hasActiveSubscription,
      },
    });
  } catch {
    return NextResponse.json({ success: true, data: { loggedIn: false } });
  }
}
