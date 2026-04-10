import { NextResponse } from "next/server";
import { authenticateRequest, isErrorResponse } from "@/lib/auth/middleware";
import { getsql } from "@/lib/db/connection";
import { getDb, schema } from "@/lib/db";
import { user as userTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { cleancloudProxy } from "@/lib/cleancloud/client";
import { getStripe } from "@/lib/stripe";

type WindowRow = {
  readonly date: string;
  readonly window_start: string;
  readonly window_end: string;
};

type Slot = { readonly start: string; readonly end: string };

type DateWithSlots = {
  readonly date: string;
  readonly slots: readonly Slot[];
};

export type ScheduleProduct = {
  readonly id: string;
  readonly name: string;
  readonly rateCentsPerLb: number;
  readonly addon?: boolean;
};

const PRODUCTS: readonly ScheduleProduct[] = [
  { id: "wash-fold", name: "Wash & Fold", rateCentsPerLb: 295 },
  { id: "deep-clean", name: "Deep Clean", rateCentsPerLb: 45, addon: true },
];

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
    await getDb().update(userTable).set({ cleancloudCustomerId: ccId }).where(eq(userTable.id, userId));
    return ccId;
  } catch {
    return null;
  }
}

/** Get customer address from Stripe (shipping or subscription metadata) */
async function getStripeAddress(authUserId: string): Promise<string> {
  try {
    const db = getDb();
    const stripeCustomer = await db.query.customers.findFirst({
      where: eq(schema.customers.authUserId, authUserId),
    });
    if (!stripeCustomer) return "";

    const sc = await getStripe().customers.retrieve(stripeCustomer.stripeCustomerId);
    if (sc.deleted) return "";

    const addr = sc.shipping?.address;
    if (addr) {
      const parts = [addr.line1, addr.line2, addr.city, addr.state, addr.postal_code].filter(Boolean);
      if (parts.length > 0) return parts.join(", ");
    }

    // Check subscription metadata
    const subs = await getStripe().subscriptions.list({
      customer: stripeCustomer.stripeCustomerId,
      limit: 1,
    });
    return subs.data[0]?.metadata?.pickupAddress ?? "";
  } catch {
    return "";
  }
}

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  const cleancloudCustomerId = await resolveCleanCloudId(
    auth.uid, auth.email, auth.cleancloudCustomerId,
  );

  if (!cleancloudCustomerId) {
    return NextResponse.json(
      { success: false, error: "No CleanCloud account linked. Please update your profile with your address first." },
      { status: 422 },
    );
  }

  // 1. Try to get customer data from staging table
  let customerAddress = "";
  let routeId: number | null = null;
  let customerPrefs = {
    detergent: null as string | null,
    bleach: null as string | null,
    fabricSoftener: null as string | null,
    dryerTemperature: null as string | null,
    dryerSheets: null as string | null,
  };

  try {
    const sql = getsql();
    const [customer] = await sql`
      SELECT
        route_id          AS "routeId",
        address,
        lat,
        lng,
        detergent_name    AS "detergent",
        bleach_name       AS "bleach",
        fabric_softener_name AS "fabricSoftener",
        dryer_temperature_name AS "dryerTemperature",
        dryer_sheets_name AS "dryerSheets"
      FROM stg_cleancloud.stg_cc_customers
      WHERE cleancloud_id = ${cleancloudCustomerId}
        AND deleted_at IS NULL
      LIMIT 1
    `;

    if (customer) {
      routeId = (customer.routeId as number) ?? null;
      customerAddress = (customer.address as string) ?? "";
      customerPrefs = {
        detergent: (customer.detergent as string) ?? null,
        bleach: (customer.bleach as string) ?? null,
        fabricSoftener: (customer.fabricSoftener as string) ?? null,
        dryerTemperature: (customer.dryerTemperature as string) ?? null,
        dryerSheets: (customer.dryerSheets as string) ?? null,
      };

      // Try lat/lng route resolution if no routeId
      if (!routeId && customer.lat && customer.lng) {
        try {
          const r = await cleancloudProxy<{ routeID: number }>("/route", {
            lat: customer.lat, lng: customer.lng,
          });
          if (r.success && r.data?.routeID) routeId = r.data.routeID;
        } catch { /* non-critical */ }
      }
    }
  } catch {
    // Staging table unavailable — will fall back to Stripe
  }

  // 2. If no address from staging, try Stripe
  if (!customerAddress) {
    customerAddress = await getStripeAddress(auth.uid);
  }

  // 3. If still no routeId, resolve from address
  if (!routeId && customerAddress) {
    try {
      const r = await cleancloudProxy<{ routeID: number }>("/route", {
        address: customerAddress,
      });
      if (r.success && r.data?.routeID) routeId = r.data.routeID;
    } catch { /* route lookup failed */ }
  }

  if (!routeId) {
    return NextResponse.json(
      { success: false, error: "We couldn't determine your delivery area. Please update your address in your profile." },
      { status: 422 },
    );
  }

  // 4. Fetch available pickup windows
  let windowRows: readonly WindowRow[] = [];

  // Try internal table first
  try {
    const sql = getsql();
    windowRows = await sql`
      SELECT
        date::text AS "date",
        window_start,
        window_end
      FROM operations.agent_available_windows
      WHERE route_id = ${routeId}
        AND date >= CURRENT_DATE
        AND window_type = 'pickup'
      ORDER BY date, window_start
    ` as readonly WindowRow[];
  } catch {
    // Table doesn't exist
  }

  // Fall back to CleanCloud dates API
  if (windowRows.length === 0) {
    try {
      const datesResult = await cleancloudProxy<{ Dates: Array<{ dateStamp: number; times: string }> }>(
        "/scheduling/dates",
        { routeID: routeId },
      );
      if (datesResult.success && datesResult.data?.Dates) {
        const rows: WindowRow[] = [];
        for (const d of datesResult.data.Dates.slice(0, 14)) {
          const dateObj = new Date(d.dateStamp * 1000);
          const dateStr = dateObj.toISOString().split("T")[0];
          const times = (d.times ?? "").split(",").filter(Boolean);
          for (const t of times) {
            const parts = t.trim().split("-");
            rows.push({
              date: dateStr,
              window_start: parts[0]?.trim() ?? "",
              window_end: parts[1]?.trim() ?? parts[0]?.trim() ?? "",
            });
          }
        }
        windowRows = rows;
      }
    } catch {
      // CleanCloud API also failed
    }
  }

  // 5. Group windows by date
  const dateMap = new Map<string, Slot[]>();
  for (const row of windowRows) {
    const existing = dateMap.get(row.date);
    const slot: Slot = { start: row.window_start, end: row.window_end };
    if (existing) existing.push(slot);
    else dateMap.set(row.date, [slot]);
  }

  const dates: DateWithSlots[] = Array.from(dateMap.entries()).map(
    ([date, slots]) => ({ date, slots }),
  );

  // 6. Preference options (best-effort)
  const options: Record<string, string[]> = {};
  try {
    const sql = getsql();
    const preferenceOptions = await sql`
      SELECT api_field AS "apiField", preference_name AS "name"
      FROM seed.cleancloud_laundry_preference
      ORDER BY api_field, preference_code
    `;

    const PREF_FIELD_MAP: Record<string, string> = {
      detergenttype: "detergent",
      detergentscent: "bleach",
      fabricsoftenertype: "fabricSoftener",
      whitesdryerheat: "dryerTemperature",
      colorsdryerheat: "dryerSheets",
    };

    for (const row of preferenceOptions) {
      const key = PREF_FIELD_MAP[row.apiField as string];
      if (key) {
        if (!options[key]) options[key] = [];
        options[key].push(row.name as string);
      }
    }
  } catch {
    // Table doesn't exist — empty options
  }

  return NextResponse.json({
    success: true,
    data: {
      routeId,
      dates,
      products: PRODUCTS,
      preferences: {
        current: customerPrefs,
        options,
      },
    },
  });
}
