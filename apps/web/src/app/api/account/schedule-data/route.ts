import { NextResponse } from "next/server";
import { authenticateRequest, isErrorResponse } from "@/lib/auth/middleware";
import { getsql } from "@/lib/db/connection";
import { getDb } from "@/lib/db";
import { user as userTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { cleancloudProxy } from "@/lib/cleancloud/client";

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

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  const cleancloudCustomerId = await resolveCleanCloudId(
    auth.uid, auth.email, auth.cleancloudCustomerId,
  );

  if (!cleancloudCustomerId) {
    return NextResponse.json(
      { success: false, error: "No CleanCloud account linked. Please update your profile with your address first." },
      { status: 422 }
    );
  }

  try {
    const sql = getsql();

    // Fetch customer data — use only confirmed columns
    const customerRows = await sql`
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

    // Fetch preference options — may not exist in all environments
    let preferenceOptions: readonly Record<string, unknown>[] = [];
    try {
      preferenceOptions = await sql`
        SELECT
          api_field AS "apiField",
          preference_name AS "name"
        FROM seed.cleancloud_laundry_preference
        ORDER BY api_field, preference_code
      `;
    } catch {
      // Table doesn't exist — use empty options (users can still type custom values)
    }

    const customer = customerRows[0];

    let routeId = customer?.routeId as number | null;

    // Auto-resolve route if missing
    if (!routeId && customer) {
      const routeParams: Record<string, unknown> = {};
      if (customer.lat && customer.lng) {
        routeParams.lat = customer.lat;
        routeParams.lng = customer.lng;
      } else if (customer.address) {
        routeParams.address = customer.address;
      }

      if (Object.keys(routeParams).length > 0) {
        const routeResult = await cleancloudProxy<{ routeID: number }>("/route", routeParams);
        if (routeResult.success && routeResult.data?.routeID) {
          routeId = routeResult.data.routeID;
        }
      }
    }

    if (!routeId) {
      return NextResponse.json(
        { success: false, error: "We couldn't determine your delivery area. Please update your address." },
        { status: 422 }
      );
    }

    // Fetch available windows — fall back to CleanCloud dates API if table doesn't exist
    let windowRows: readonly WindowRow[] = [];
    try {
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
      // Table doesn't exist — fetch from CleanCloud dates/slots API
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
              rows.push({ date: dateStr, window_start: parts[0]?.trim() ?? "", window_end: parts[1]?.trim() ?? parts[0]?.trim() ?? "" });
            }
          }
          windowRows = rows;
        }
      } catch {
        // Both failed — return empty dates
      }
    }

    // Group windows by date
    const dateMap = new Map<string, Slot[]>();
    for (const row of windowRows) {
      const existing = dateMap.get(row.date);
      const slot: Slot = { start: row.window_start, end: row.window_end };
      if (existing) {
        existing.push(slot);
      } else {
        dateMap.set(row.date, [slot]);
      }
    }

    const dates: DateWithSlots[] = Array.from(dateMap.entries()).map(
      ([date, slots]) => ({ date, slots })
    );

    // Group preference options by field
    const PREF_FIELD_MAP: Record<string, string> = {
      detergenttype: "detergent",
      detergentscent: "bleach",
      fabricsoftenertype: "fabricSoftener",
      starchpreference: "colorSafeBleach",
      trouserpreference: "trouser",
      whitesdryerheat: "dryerTemperature",
      colorsdryerheat: "dryerSheets",
    };

    const options: Record<string, string[]> = {};
    for (const row of preferenceOptions) {
      const key = PREF_FIELD_MAP[row.apiField as string];
      if (key) {
        if (!options[key]) options[key] = [];
        options[key].push(row.name as string);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        routeId,
        dates,
        products: PRODUCTS,
        preferences: {
          current: {
            detergent: customer.detergent ?? null,
            bleach: customer.bleach ?? null,
            fabricSoftener: customer.fabricSoftener ?? null,
            dryerTemperature: customer.dryerTemperature ?? null,
            dryerSheets: customer.dryerSheets ?? null,
          },
          options,
        },
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to load scheduling data" },
      { status: 500 }
    );
  }
}
