import { NextResponse } from "next/server";
import { authenticateRequest, isErrorResponse } from "@/lib/auth/middleware";
import { getsql } from "@/lib/db/connection";

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  if (!auth.cleancloudCustomerId) {
    return NextResponse.json({
      success: true,
      data: { isReturning: false },
    });
  }

  const sql = getsql();

  const [profile, orderStats] = await Promise.all([
    sql`
      SELECT
        name,
        address,
        phone,
        route_id         AS "routeId",
        route_name       AS "routeName",
        detergent_name   AS "detergent",
        bleach_name      AS "bleach",
        fabric_softener_name AS "fabricSoftener",
        dryer_temperature_name AS "dryerTemperature",
        dryer_sheets_name AS "dryerSheets",
        has_saved_payment AS "hasSavedPayment",
        subscription
      FROM stg_cleancloud.stg_cc_customers
      WHERE cleancloud_id = ${auth.cleancloudCustomerId}
        AND deleted_at IS NULL
      LIMIT 1
    `,
    sql`
      SELECT
        count(*)::int AS "orderCount",
        max(created_date) AS "lastOrderDate"
      FROM stg_cleancloud.stg_cc_orders
      WHERE customer_id = ${auth.cleancloudCustomerId}
        AND deleted_at IS NULL
    `,
  ]);

  if (!profile[0]) {
    return NextResponse.json({
      success: true,
      data: { isReturning: false },
    });
  }

  const p = profile[0];
  const stats = orderStats[0];

  return NextResponse.json({
    success: true,
    data: {
      isReturning: true,
      name: p.name,
      address: p.address,
      phone: p.phone,
      routeId: p.routeId,
      routeName: p.routeName,
      preferences: {
        detergent: p.detergent,
        bleach: p.bleach,
        fabricSoftener: p.fabricSoftener,
        dryerTemperature: p.dryerTemperature,
        dryerSheets: p.dryerSheets,
      },
      hasSavedPayment: p.hasSavedPayment ?? false,
      hasSubscription: !!p.subscription,
      orderCount: stats?.orderCount ?? 0,
      lastOrderDate: stats?.lastOrderDate ?? null,
    },
  });
}
