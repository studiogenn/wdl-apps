import { NextResponse } from "next/server";
import { authenticateRequest, isErrorResponse } from "@/lib/auth/middleware";
import { getsql } from "@/lib/db/connection";
import { getDb } from "@/lib/db";
import { user as userTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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

  // Link to user record for future requests
  await getDb()
    .update(userTable)
    .set({ cleancloudCustomerId: ccId })
    .where(eq(userTable.id, userId));

  return ccId;
}

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  const customerId = await resolveCleanCloudId(
    auth.uid,
    auth.email,
    auth.cleancloudCustomerId,
  );

  if (!customerId) {
    return NextResponse.json({
      success: true,
      data: { orders: [] },
    });
  }

  try {
    const sql = getsql();
    const orders = await sql`
      SELECT
        cleancloud_id     AS "orderID",
        status_name       AS "status",
        status_category   AS "statusCategory",
        is_terminal       AS "isTerminal",
        service_name      AS "service",
        total,
        paid,
        pickup_date       AS "pickupDate",
        pickup_window_start AS "pickupStart",
        pickup_window_end   AS "pickupEnd",
        delivery_date     AS "deliveryDate",
        delivery_window_start AS "deliveryStart",
        delivery_window_end   AS "deliveryEnd",
        weight,
        pieces,
        receipt_link      AS "receiptLink",
        created_date      AS "createdDate"
      FROM stg_cleancloud.stg_cc_orders
      WHERE customer_id = ${customerId}
        AND deleted_at IS NULL
      ORDER BY created_date DESC
      LIMIT 20
    `;

    return NextResponse.json({
      success: true,
      data: { orders },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
