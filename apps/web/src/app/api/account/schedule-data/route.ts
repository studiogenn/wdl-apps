import { NextResponse } from "next/server";
import { authenticateRequest, isErrorResponse } from "@/lib/auth/middleware";
import { getsql } from "@/lib/db/connection";
import { cleancloudProxy } from "@/lib/cleancloud/client";

type RawDateEntry = {
  readonly dateStamp: number;
  readonly remainingSlots?: string;
  readonly [key: string]: unknown;
};

type DatesResponse = {
  readonly Dates?: ReadonlyArray<RawDateEntry>;
  readonly dates?: ReadonlyArray<RawDateEntry>;
};

type Product = {
  readonly productID: number;
  readonly name: string;
  readonly price: number;
};

type ProductsResponse = {
  readonly products?: ReadonlyArray<Product>;
};

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  if (!auth.cleancloudCustomerId) {
    return NextResponse.json(
      { success: false, error: "No CleanCloud account linked" },
      { status: 422 }
    );
  }

  try {
    const sql = getsql();

    // Fetch customer data + preference options in parallel
    const [customerRows, preferenceOptions] = await Promise.all([
      sql`
        SELECT
          route_id          AS "routeId",
          detergent_name    AS "detergent",
          bleach_name       AS "bleach",
          fabric_softener_name AS "fabricSoftener",
          dryer_temperature_name AS "dryerTemperature",
          dryer_sheets_name AS "dryerSheets"
        FROM stg_cleancloud.stg_cc_customers
        WHERE cleancloud_id = ${auth.cleancloudCustomerId}
          AND deleted_at IS NULL
        LIMIT 1
      `,
      sql`
        SELECT
          api_field AS "apiField",
          preference_name AS "name"
        FROM seed.cleancloud_laundry_preference
        ORDER BY api_field, preference_code
      `,
    ]);

    const customer = customerRows[0];

    if (!customer?.routeId) {
      return NextResponse.json(
        { success: false, error: "No delivery route assigned to your account" },
        { status: 422 }
      );
    }

    const routeId = customer.routeId as number;

    // Fetch dates + products in parallel
    const [datesResult, productsResult] = await Promise.all([
      cleancloudProxy<DatesResponse>("/scheduling/dates", { routeID: routeId }),
      cleancloudProxy<ProductsResponse>("/products"),
    ]);

    if (!datesResult.success) {
      return NextResponse.json(
        { success: false, error: "Unable to load available dates" },
        { status: 502 }
      );
    }

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
        dates: (datesResult.data?.Dates ?? datesResult.data?.dates ?? []).map((d) => ({
          date: d.dateStamp,
          remaining: d.remainingSlots ? parseInt(d.remainingSlots, 10) : undefined,
        })),
        products: productsResult.data?.products ?? [],
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
