import { NextResponse } from "next/server";
import { authenticateRequest, isErrorResponse } from "@/lib/auth/middleware";
import { getsql } from "@/lib/db/connection";

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  if (!auth.cleancloudCustomerId) {
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
      WHERE customer_id = ${auth.cleancloudCustomerId}
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
