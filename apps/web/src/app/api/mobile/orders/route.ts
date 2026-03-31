import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticateRequest, isErrorResponse } from "@/lib/firebase/auth-middleware";
import { cleancloudRequest } from "@/lib/cleancloud/client";
import { CleanCloudApiError, getReadableError } from "@/lib/cleancloud/errors";

const orderSchema = z.object({
  pickupDate: z.number().positive().optional(),
  pickupStart: z.string().optional(),
  pickupEnd: z.string().optional(),
  deliveryDate: z.number().positive().optional(),
  deliveryStart: z.string().optional(),
  deliveryEnd: z.string().optional(),
  products: z
    .array(
      z.object({
        productID: z.number().positive(),
        quantity: z.number().positive(),
      })
    )
    .optional(),
  orderNotes: z.string().max(1000).optional(),
  finalTotal: z.number().min(0).optional(),
});

type OrderResponse = {
  readonly orderID: number;
  readonly [key: string]: unknown;
};

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  if (!auth.cleancloudCustomerId) {
    return NextResponse.json(
      { success: false, error: "No CleanCloud account linked. Please complete registration." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const params: Record<string, unknown> = {
      customerID: auth.cleancloudCustomerId,
      ...parsed.data,
    };

    const data = await cleancloudRequest<OrderResponse>("addOrder", params);

    return NextResponse.json({
      success: true,
      data: { orderID: data.orderID },
    });
  } catch (error) {
    if (error instanceof CleanCloudApiError) {
      return NextResponse.json(
        { success: false, error: getReadableError(error.apiMessage) },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}
