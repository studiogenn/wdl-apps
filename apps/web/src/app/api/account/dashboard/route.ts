import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticateRequest, isErrorResponse } from "@/lib/auth/middleware";
import { cleancloudPost } from "@/lib/cleancloud/client";
import { getStripe } from "@/lib/stripe";
import { getsql } from "@/lib/db/connection";
import { getDb, schema } from "@/lib/db";
import { user as userTable } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

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

/** GET: Fetch full dashboard data from CleanCloud staging tables */
export async function GET(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  const ccId = await resolveCleanCloudId(auth.uid, auth.email, auth.cleancloudCustomerId);

  if (!ccId) {
    // Still check for subscription even without CleanCloud
    let hasSubscription = false;
    try {
      const db = getDb();
      const customer = await db.query.customers.findFirst({
        where: eq(schema.customers.authUserId, auth.uid),
      });
      if (customer) {
        const sub = await db.query.subscriptions.findFirst({
          where: and(
            eq(schema.subscriptions.customerId, customer.id),
            eq(schema.subscriptions.status, "active"),
          ),
        });
        hasSubscription = !!sub;
      }
    } catch { /* non-critical */ }

    return NextResponse.json({
      success: true,
      data: {
        profile: { email: auth.email, name: "", phone: auth.phone ?? "", address: "" },
        preferences: {},
        delivery: {},
        orders: [],
        hasCleanCloud: false,
        hasSubscription,
      },
    });
  }

  const sql = getsql();

  const [customerRows, orderRows] = await Promise.all([
    sql`
      SELECT
        name,
        email,
        phone,
        address,
        coalesce(apt_number, '') AS "apt",
        coalesce(city, '') AS "city",
        coalesce(state, '') AS "state",
        coalesce(zip_code, '') AS "zip",
        coalesce(detergent_name, '') AS "detergent",
        coalesce(bleach_name, '') AS "bleach",
        coalesce(fabric_softener_name, '') AS "fabricSoftener",
        coalesce(dryer_temperature_name, '') AS "dryerTemperature",
        coalesce(dryer_sheets_name, '') AS "dryerSheets",
        coalesce(customer_notes, '') AS "notes",
        coalesce(gate_code, '') AS "gateCode",
        coalesce(delivery_instructions, '') AS "deliveryInstructions",
        coalesce(bag_location, '') AS "bagLocation",
        has_saved_payment AS "hasSavedPayment",
        subscription
      FROM stg_cleancloud.stg_cc_customers
      WHERE cleancloud_id = ${ccId}
        AND deleted_at IS NULL
      LIMIT 1
    `.catch(() =>
      // Fallback if some columns don't exist
      sql`
        SELECT
          name, email, phone, address,
          coalesce(detergent_name, '') AS "detergent",
          coalesce(bleach_name, '') AS "bleach",
          coalesce(fabric_softener_name, '') AS "fabricSoftener",
          coalesce(dryer_temperature_name, '') AS "dryerTemperature",
          coalesce(dryer_sheets_name, '') AS "dryerSheets"
        FROM stg_cleancloud.stg_cc_customers
        WHERE cleancloud_id = ${ccId}
          AND deleted_at IS NULL
        LIMIT 1
      `
    ),
    sql`
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
      WHERE customer_id = ${ccId}
        AND deleted_at IS NULL
      ORDER BY created_date DESC
      LIMIT 20
    `.catch(() => []),
  ]);

  const c = customerRows[0] ?? {};

  // Check for active subscription
  let hasSubscription = false;
  try {
    const db = getDb();
    const customer = await db.query.customers.findFirst({
      where: eq(schema.customers.authUserId, auth.uid),
    });
    if (customer) {
      const sub = await db.query.subscriptions.findFirst({
        where: and(
          eq(schema.subscriptions.customerId, customer.id),
          eq(schema.subscriptions.status, "active"),
        ),
      });
      hasSubscription = !!sub;
    }
    // Fallback to Stripe if local DB doesn't have it
    if (!hasSubscription && customer) {
      const stripeSubs = await getStripe().subscriptions.list({
        customer: customer.stripeCustomerId,
        status: "active",
        limit: 1,
      });
      hasSubscription = stripeSubs.data.length > 0;
    }
  } catch {
    // Non-critical
  }

  return NextResponse.json({
    success: true,
    data: {
      profile: {
        email: (c.email as string) ?? auth.email,
        name: (c.name as string) ?? "",
        phone: (c.phone as string) ?? auth.phone ?? "",
        address: (c.address as string) ?? "",
        apt: (c.apt as string) ?? "",
        city: (c.city as string) ?? "",
        state: (c.state as string) ?? "",
        zip: (c.zip as string) ?? "",
      },
      preferences: {
        detergent: (c.detergent as string) ?? "",
        bleach: (c.bleach as string) ?? "",
        fabricSoftener: (c.fabricSoftener as string) ?? "",
        dryerTemperature: (c.dryerTemperature as string) ?? "",
        dryerSheets: (c.dryerSheets as string) ?? "",
      },
      delivery: {
        gateCode: (c.gateCode as string) ?? "",
        instructions: (c.deliveryInstructions as string) ?? "",
        bagLocation: (c.bagLocation as string) ?? "",
      },
      orders: orderRows,
      hasCleanCloud: true,
      hasSubscription,
    },
  });
}

/** POST: Update profile/preferences/delivery fields in CleanCloud */
const updateSchema = z.object({
  section: z.enum(["profile", "preferences", "delivery"]),
  fields: z.record(z.string(), z.string()),
});

// CleanCloud editCustomer field mapping
const CC_FIELD_MAP: Record<string, string> = {
  // Profile
  name: "customerName",
  phone: "customerTel",
  address: "customerAddress",
  apt: "customerApt",
  city: "customerCity",
  state: "customerState",
  zip: "customerZip",
  // Preferences
  detergent: "detergent",
  bleach: "bleach",
  fabricSoftener: "fabricSoftener",
  dryerTemperature: "dryerTemperature",
  dryerSheets: "dryerSheets",
  // Delivery
  gateCode: "gateCode",
  instructions: "deliveryInstructions",
  bagLocation: "bagLocation",
};

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 },
    );
  }

  const ccId = await resolveCleanCloudId(auth.uid, auth.email, auth.cleancloudCustomerId);
  if (!ccId) {
    return NextResponse.json(
      { success: false, error: "No CleanCloud account linked" },
      { status: 404 },
    );
  }

  // Map our field names to CleanCloud API field names
  const ccFields: Record<string, unknown> = { customerID: ccId };
  for (const [key, value] of Object.entries(parsed.data.fields)) {
    const ccKey = CC_FIELD_MAP[key];
    if (ccKey) ccFields[ccKey] = value;
  }

  try {
    await cleancloudPost("/editCustomer", ccFields);
  } catch (err) {
    console.error("[Dashboard] CleanCloud update failed:", err);
    return NextResponse.json(
      { success: false, error: "Unable to save changes" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
