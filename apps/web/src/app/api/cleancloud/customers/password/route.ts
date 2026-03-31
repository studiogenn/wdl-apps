import { NextResponse } from "next/server";
import { z } from "zod";
import { cleancloudRequest } from "@/lib/cleancloud/client";
import { CleanCloudApiError, getReadableError } from "@/lib/cleancloud/errors";

const passwordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = passwordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    await cleancloudRequest("passwordCustomer", {
      customerEmail: parsed.data.email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof CleanCloudApiError) {
      return NextResponse.json(
        { success: false, error: getReadableError(error.apiMessage) },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unable to send reset email. Please try again." },
      { status: 500 }
    );
  }
}
