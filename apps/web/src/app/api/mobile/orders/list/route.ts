import { NextResponse } from "next/server";
import { authenticateRequest, isErrorResponse } from "@/lib/auth/middleware";
import { cleancloudProxy } from "@/lib/cleancloud/client";
import { getReadableError } from "@/lib/cleancloud/errors";

type OrdersResponse = {
  readonly orders?: readonly Record<string, unknown>[];
  readonly [key: string]: unknown;
};

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
    const result = await cleancloudProxy<OrdersResponse>("/orders/list", {
      customerID: auth.cleancloudCustomerId,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: getReadableError(result.error ?? "") },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { orders: result.data?.orders ?? [] },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
