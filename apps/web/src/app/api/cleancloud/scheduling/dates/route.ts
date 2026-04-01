import { NextResponse } from "next/server";
import { z } from "zod";
import { cleancloudProxy } from "@/lib/cleancloud/client";
import { getReadableError } from "@/lib/cleancloud/errors";

const datesSchema = z.object({
  routeID: z.number().int().positive("Route ID is required"),
});

type DateEntry = {
  readonly date: number;
  readonly slots?: string;
  readonly remaining?: number;
  readonly [key: string]: unknown;
};

type DatesResponse = {
  readonly dates?: ReadonlyArray<DateEntry>;
  readonly [key: string]: unknown;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = datesSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const result = await cleancloudProxy<DatesResponse>("/scheduling/dates", {
      routeID: parsed.data.routeID,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: getReadableError(result.error ?? "") },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { dates: result.data?.dates ?? [] },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Unable to load available dates. Please try again." },
      { status: 500 }
    );
  }
}
