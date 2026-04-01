import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticateRequest, isErrorResponse } from "@/lib/auth/middleware";
import { cleancloudProxy } from "@/lib/cleancloud/client";
import { getReadableError } from "@/lib/cleancloud/errors";

const addCardSchema = z.object({
  token: z.string().min(1),
  type: z.number().min(1).max(6).default(1),
});

// GET saved cards
export async function GET(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  if (!auth.cleancloudCustomerId) {
    return NextResponse.json(
      { success: false, error: "No CleanCloud account linked" },
      { status: 403 }
    );
  }

  try {
    const result = await cleancloudProxy("/cards", {
      customerID: auth.cleancloudCustomerId,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: getReadableError(result.error ?? "") },
        { status: 422 }
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch cards" },
      { status: 500 }
    );
  }
}

// POST add a card
export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  if (!auth.cleancloudCustomerId) {
    return NextResponse.json(
      { success: false, error: "No CleanCloud account linked" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const parsed = addCardSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid card data" },
        { status: 400 }
      );
    }

    const result = await cleancloudProxy("/cards/add", {
      customerID: auth.cleancloudCustomerId,
      token: parsed.data.token,
      type: parsed.data.type,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: getReadableError(result.error ?? "") },
        { status: 422 }
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to add card" },
      { status: 500 }
    );
  }
}
