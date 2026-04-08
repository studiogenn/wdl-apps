import { NextResponse } from "next/server";
import { z } from "zod";
import { cleancloudProxy } from "@/lib/cleancloud/client";
import { getReadableError } from "@/lib/cleancloud/errors";

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

    console.log("[CleanCloud Orders] Creating order for customer:", parsed.data.customerID);
    const result = await cleancloudProxy<OrderResponse>("/orders", parsed.data);
    console.log("[CleanCloud Orders] Proxy response:", JSON.stringify(result));

    if (!result.success) {
      console.error("[CleanCloud Orders] CleanCloud rejected order:", result.error);
      return NextResponse.json(
        { success: false, error: getReadableError(result.error ?? "") },
        { status: 422 }
      );
    }

    console.log("[CleanCloud Orders] Order created successfully, orderID:", result.data!.orderID);
    return NextResponse.json({
      success: true,
      data: { orderID: result.data!.orderID },
    });
  } catch (err) {
    console.error("[CleanCloud Orders] Unhandled error:", err);
    return NextResponse.json(
      { success: false, error: "Unable to create order. Please try again." },
      { status: 500 }
    );
  }
}
