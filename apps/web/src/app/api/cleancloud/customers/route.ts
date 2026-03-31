import { NextResponse } from "next/server";
import { z } from "zod";
import { cleancloudRequest } from "@/lib/cleancloud/client";
import { CleanCloudApiError, getReadableError } from "@/lib/cleancloud/errors";

const customerSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number").max(20),
  address: z.string().min(1, "Address is required").max(500),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  promoCode: z.string().max(50).optional(),
});

type CustomerResponse = {
  readonly customerID: number;
  readonly [key: string]: unknown;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = customerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const params: Record<string, unknown> = {
      customerName: parsed.data.name,
      customerEmail: parsed.data.email,
      customerTel: parsed.data.phone,
      customerAddress: parsed.data.address,
      makeLatLng: 1,
      findRoute: 1,
    };

    if (parsed.data.password) {
      params.customerPassword = parsed.data.password;
    }
    if (parsed.data.promoCode) {
      params.promoCode = parsed.data.promoCode;
    }

    const data = await cleancloudRequest<CustomerResponse>("addCustomer", params);

    return NextResponse.json({
      success: true,
      data: { customerID: data.customerID },
    });
  } catch (error) {
    if (error instanceof CleanCloudApiError) {
      return NextResponse.json(
        { success: false, error: getReadableError(error.apiMessage) },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unable to create account. Please try again." },
      { status: 500 }
    );
  }
}
