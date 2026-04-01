import { NextResponse } from "next/server";
import { z } from "zod";
import { cleancloudProxy } from "@/lib/cleancloud/client";
import { getReadableError } from "@/lib/cleancloud/errors";

const routeSchema = z.object({
  zip: z.string().min(5).max(10).optional(),
  address: z.string().min(1).optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
}).refine(
  (data) => data.zip || data.address || (data.lat && data.lng),
  { message: "Provide a zip code, address, or coordinates" }
);

type RouteResponse = {
  readonly routeID: number;
  readonly routeName?: string;
  readonly [key: string]: unknown;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = routeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const result = await cleancloudProxy<RouteResponse>("/route", parsed.data);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: getReadableError(result.error ?? "") },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { routeID: result.data!.routeID, routeName: result.data!.routeName },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Unable to check service area. Please try again." },
      { status: 500 }
    );
  }
}
