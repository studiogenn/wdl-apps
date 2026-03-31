import { NextResponse } from "next/server";
import { z } from "zod";
import { cleancloudRequest } from "@/lib/cleancloud/client";
import { CleanCloudApiError, getReadableError } from "@/lib/cleancloud/errors";

const orderSchema = z.object({
  customerID: z.number().int().positive("Customer ID is required"),
  pickupDate: z.number().int().positive().optional(),
  pickupStart: z.string().optional(),
  pickupEnd: z.string().optional(),
  deliveryDate: z.number().int().positive().optional(),
  deliveryStart: z.string().optional(),
  deliveryEnd: z.string().optional(),
  products: z.array(z.object({
    productID: z.number(),
    quantity: z.number().int().positive(),
  })).optional(),
  orderNotes: z.string().max(1000).optional(),
  finalTotal: z.number().min(0).optional(),
});

type OrderResponse = {
  readonly orderID: number;
  readonly [key: string]: unknown;
};

export async function POST(request: Request) {
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
      customerID: parsed.data.customerID,
      finalTotal: parsed.data.finalTotal ?? 0,
    };

    if (parsed.data.pickupDate) params.pickupDate = parsed.data.pickupDate;
    if (parsed.data.pickupStart) params.pickupStart = parsed.data.pickupStart;
    if (parsed.data.pickupEnd) params.pickupEnd = parsed.data.pickupEnd;
    if (parsed.data.deliveryDate) params.deliveryDate = parsed.data.deliveryDate;
    if (parsed.data.deliveryStart) params.deliveryStart = parsed.data.deliveryStart;
    if (parsed.data.deliveryEnd) params.deliveryEnd = parsed.data.deliveryEnd;
    if (parsed.data.products) params.products = parsed.data.products;
    if (parsed.data.orderNotes) params.orderNotes = parsed.data.orderNotes;

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
      { success: false, error: "Unable to create order. Please try again." },
      { status: 500 }
    );
  }
}
