import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticateRequest, isErrorResponse } from "@/lib/auth/middleware";
import { cleancloudPost } from "@/lib/cleancloud/client";
import { getStripe } from "@/lib/stripe";
import { getsql } from "@/lib/db/connection";
import { getDb, schema } from "@/lib/db";
import { user as userTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function resolveCleanCloudId(
  userId: string,
  email: string,
  existing: number | null,
): Promise<number | null> {
  if (existing) return existing;

  try {
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
  } catch {
    return null;
  }
}

/** Check if user has an active Stripe subscription */
async function checkSubscription(authUserId: string): Promise<boolean> {
  try {
    const db = getDb();
    const customer = await db.query.customers.findFirst({
      where: eq(schema.customers.authUserId, authUserId),
    });
    if (!customer) return false;

    // Check local DB first
    const subs = await db
      .select({ status: schema.subscriptions.status })
      .from(schema.subscriptions)
      .where(eq(schema.subscriptions.customerId, customer.id))
      .limit(5);

    const hasActive = subs.some(
      (s) => s.status === "active" || s.status === "trialing",
    );
    if (hasActive) return true;

    // Fallback: check Stripe directly
    const stripeSubs = await getStripe().subscriptions.list({
      customer: customer.stripeCustomerId,
      status: "active",
      limit: 1,
    });
    return stripeSubs.data.length > 0;
  } catch {
    return false;
  }
}

/** GET: Fetch full dashboard data */
export async function GET(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  // Run subscription check in parallel with CleanCloud data
  const [hasSubscription, ccId] = await Promise.all([
    checkSubscription(auth.uid),
    resolveCleanCloudId(auth.uid, auth.email, auth.cleancloudCustomerId),
  ]);

  if (!ccId) {
    return NextResponse.json({
      success: true,
      data: {
        profile: {
          email: auth.email,
          name: "",
          phone: auth.phone ?? "",
          address: "",
        },
        preferences: {},
        delivery: {},
        orders: [],
        hasCleanCloud: false,
        hasSubscription,
      },
    });
  }

  const sql = getsql();

  // Use only columns we know exist in the staging table
  let customerData: Record<string, unknown> = {};
  try {
    const [row] = await sql`
      SELECT
        name,
        email,
        phone,
        address,
        coalesce(detergent_name, '') AS "detergent",
        coalesce(bleach_name, '') AS "bleach",
        coalesce(fabric_softener_name, '') AS "fabricSoftener",
        coalesce(dryer_temperature_name, '') AS "dryerTemperature",
        coalesce(dryer_sheets_name, '') AS "dryerSheets",
        coalesce(customer_notes, '') AS "notes",
        has_saved_payment AS "hasSavedPayment",
        subscription
      FROM stg_cleancloud.stg_cc_customers
      WHERE cleancloud_id = ${ccId}
        AND deleted_at IS NULL
      LIMIT 1
    `;
    if (row) customerData = row;
  } catch {
    // Staging table might have different columns — try minimal query
    try {
      const [row] = await sql`
        SELECT name, email, phone, address
        FROM stg_cleancloud.stg_cc_customers
        WHERE cleancloud_id = ${ccId}
          AND deleted_at IS NULL
        LIMIT 1
      `;
      if (row) customerData = row;
    } catch {
      // Table unavailable
    }
  }

  // Fetch orders
  let orderRows: readonly Record<string, unknown>[] = [];
  try {
    orderRows = await sql`
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
    `;
  } catch {
    // Orders table might not exist
  }

  // Load user preferences from local DB (delivery instructions, etc.)
  let localPrefs: Record<string, unknown> = {};
  try {
    const row = await getDb().query.userPreferences.findFirst({
      where: eq(schema.userPreferences.userId, auth.uid),
    });
    if (row?.preferences && typeof row.preferences === "object") {
      localPrefs = row.preferences as Record<string, unknown>;
    }
  } catch { /* non-critical */ }

  const c = customerData;

  return NextResponse.json({
    success: true,
    data: {
      profile: {
        email: (c.email as string) ?? auth.email,
        name: (c.name as string) ?? "",
        phone: (c.phone as string) ?? auth.phone ?? "",
        address: (c.address as string) ?? "",
      },
      preferences: {
        detergent: (c.detergent as string) ?? "",
        bleach: (c.bleach as string) ?? "",
        fabricSoftener: (c.fabricSoftener as string) ?? "",
        dryerTemperature: (c.dryerTemperature as string) ?? "",
        dryerSheets: (c.dryerSheets as string) ?? "",
      },
      delivery: {
        gateCode: (localPrefs.gateCode as string) ?? "",
        instructions: (localPrefs.deliveryInstructions as string) ?? (c.notes as string) ?? "",
        bagLocation: (localPrefs.bagLocation as string) ?? "",
      },
      orders: orderRows,
      hasCleanCloud: true,
      hasSubscription,
    },
  });
}

/** POST: Update profile/preferences/delivery fields */
const updateSchema = z.object({
  section: z.enum(["profile", "preferences", "delivery"]),
  fields: z.record(z.string(), z.string()),
});

// CleanCloud editCustomer field mapping
const CC_FIELD_MAP: Record<string, string> = {
  name: "customerName",
  phone: "customerTel",
  address: "customerAddress",
  apt: "customerApt",
  city: "customerCity",
  state: "customerState",
  zip: "customerZip",
  detergent: "detergent",
  bleach: "bleach",
  fabricSoftener: "fabricSoftener",
  dryerTemperature: "dryerTemperature",
  dryerSheets: "dryerSheets",
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

  // For delivery instructions, save to local preferences (not in CC staging table)
  if (parsed.data.section === "delivery") {
    try {
      const db = getDb();
      await db
        .insert(schema.userPreferences)
        .values({
          userId: auth.uid,
          preferences: parsed.data.fields,
        })
        .onConflictDoUpdate({
          target: schema.userPreferences.userId,
          set: { preferences: parsed.data.fields, updatedAt: new Date() },
        });
    } catch (err) {
      console.error("[Dashboard] Failed to save delivery preferences:", err);
    }

    // Also update CleanCloud customer notes with delivery info
    if (ccId) {
      try {
        const notes = [
          parsed.data.fields.gateCode && `Gate: ${parsed.data.fields.gateCode}`,
          parsed.data.fields.instructions && `Instructions: ${parsed.data.fields.instructions}`,
          parsed.data.fields.bagLocation && `Bag: ${parsed.data.fields.bagLocation}`,
        ].filter(Boolean).join("\n");

        if (notes) {
          await cleancloudPost("/editCustomer", {
            customerID: ccId,
            customerNotes: notes,
          });
        }
      } catch { /* non-critical */ }
    }

    return NextResponse.json({ success: true });
  }

  // Profile and preferences — update CleanCloud directly
  if (!ccId) {
    return NextResponse.json(
      { success: false, error: "No CleanCloud account linked" },
      { status: 404 },
    );
  }

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
