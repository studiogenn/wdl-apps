import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticateRequest, isErrorResponse } from "@/lib/auth/middleware";
import { cleancloudPost } from "@/lib/cleancloud/client";
import { getStripe } from "@/lib/stripe";
import { getDb, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getsql } from "@/lib/db/connection";
import { user as userTable } from "@/lib/db/schema";

const addressSchema = z.object({
  address: z.string().min(5).max(500),
});

/** Resolve CleanCloud customer ID from auth user */
async function resolveCleanCloudId(
  userId: string,
  email: string,
  existing: number | null,
): Promise<number | null> {
  if (existing) return existing;

  const sql = getsql();
  const [match] = await sql`
    SELECT cleancloud_id AS "cleancloudId"
    FROM stg_cleancloud.stg_cc_customers
    WHERE lower(email) = lower(${email})
      AND deleted_at IS NULL
    ORDER BY created_at DESC
    LIMIT 1
  `;

  if (!match?.cleancloudId) return null;

  const ccId = match.cleancloudId as number;
  await getDb()
    .update(userTable)
    .set({ cleancloudCustomerId: ccId })
    .where(eq(userTable.id, userId));

  return ccId;
}

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  const body = await request.json();
  const parsed = addressSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Please enter a valid address" },
      { status: 400 },
    );
  }

  const { address } = parsed.data;

  // Update CleanCloud customer address
  const ccId = await resolveCleanCloudId(auth.uid, auth.email, auth.cleancloudCustomerId);
  if (ccId) {
    try {
      await cleancloudPost("/editCustomer", {
        customerID: ccId,
        customerAddress: address,
      });
    } catch (err) {
      console.error("[Address] CleanCloud update failed:", err);
      // Continue — still update Stripe
    }
  }

  // Update Stripe customer shipping address
  try {
    const db = getDb();
    const customer = await db.query.customers.findFirst({
      where: eq(schema.customers.authUserId, auth.uid),
    });

    if (customer) {
      await getStripe().customers.update(customer.stripeCustomerId, {
        shipping: {
          name: auth.email, // Stripe requires a name on shipping
          address: { line1: address },
        },
      });
    }
  } catch {
    // Non-critical — Stripe address update is secondary
  }

  return NextResponse.json({ success: true });
}

export async function GET(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  const ccId = await resolveCleanCloudId(auth.uid, auth.email, auth.cleancloudCustomerId);
  if (!ccId) {
    return NextResponse.json({ success: true, data: { address: "" } });
  }

  const sql = getsql();
  const [customer] = await sql`
    SELECT address
    FROM stg_cleancloud.stg_cc_customers
    WHERE cleancloud_id = ${ccId}
      AND deleted_at IS NULL
    LIMIT 1
  `;

  return NextResponse.json({
    success: true,
    data: { address: customer?.address ?? "" },
  });
}
