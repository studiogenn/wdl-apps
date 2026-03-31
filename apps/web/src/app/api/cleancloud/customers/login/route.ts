import { NextResponse } from "next/server";
import { z } from "zod";
import { cleancloudRequest } from "@/lib/cleancloud/client";
import { CleanCloudApiError, getReadableError } from "@/lib/cleancloud/errors";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginResponse = {
  readonly cid: number;
  readonly [key: string]: unknown;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const data = await cleancloudRequest<LoginResponse>("loginCustomer", {
      customerEmail: parsed.data.email,
      customerPassword: parsed.data.password,
    });

    return NextResponse.json({
      success: true,
      data: { customerID: data.cid },
    });
  } catch (error) {
    if (error instanceof CleanCloudApiError) {
      return NextResponse.json(
        { success: false, error: getReadableError(error.apiMessage) },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unable to log in. Please try again." },
      { status: 500 }
    );
  }
}
