import { NextResponse } from "next/server";
import { z } from "zod";
import { cleancloudRequest } from "@/lib/cleancloud/client";
import { CleanCloudApiError, getReadableError } from "@/lib/cleancloud/errors";

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

    const data = await cleancloudRequest<SlotsResponse>("getSlots", {
      routeID: parsed.data.routeID,
      day: parsed.data.day,
    });

    const slots = data.slots
      ? data.slots.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    return NextResponse.json({
      success: true,
      data: { slots },
    });
  } catch (error) {
    if (error instanceof CleanCloudApiError) {
      return NextResponse.json(
        { success: false, error: getReadableError(error.apiMessage) },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unable to load time slots. Please try again." },
      { status: 500 }
    );
  }
}
