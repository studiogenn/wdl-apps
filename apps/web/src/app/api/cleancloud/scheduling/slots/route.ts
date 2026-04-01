import { NextResponse } from "next/server";
import { z } from "zod";
import { cleancloudProxy } from "@/lib/cleancloud/client";
import { getReadableError } from "@/lib/cleancloud/errors";

const slotsSchema = z.object({
  routeID: z.number().int().positive("Route ID is required"),
  day: z.number().int().positive("Day timestamp is required"),
});

type SlotsResponse = {
  readonly slots?: string;
  readonly [key: string]: unknown;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = slotsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const result = await cleancloudProxy<SlotsResponse>("/scheduling/slots", {
      routeID: parsed.data.routeID,
      day: parsed.data.day,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: getReadableError(result.error ?? "") },
        { status: 422 }
      );
    }

    const slots = result.data?.slots
      ? result.data.slots.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    return NextResponse.json({
      success: true,
      data: { slots },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Unable to load time slots. Please try again." },
      { status: 500 }
    );
  }
}
