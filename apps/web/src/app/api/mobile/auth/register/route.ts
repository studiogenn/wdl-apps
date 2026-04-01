import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticateRequest, isErrorResponse } from "@/lib/auth/middleware";
import { cleancloudRequest } from "@/lib/cleancloud/client";
import { CleanCloudApiError, getReadableError } from "@/lib/cleancloud/errors";
import { getDb, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

const registerSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  address: z.string().min(1).max(500),
  promoCode: z.string().max(50).optional(),
});

type CustomerResponse = {
  readonly customerID: number;
  readonly [key: string]: unknown;
};

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
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

    if (parsed.data.promoCode) {
      params.promoCode = parsed.data.promoCode;
    }

    const data = await cleancloudRequest<CustomerResponse>("addCustomer", params);

    // Store CleanCloud customer ID on the Better Auth user record
    await getDb()
      .update(schema.user)
      .set({
        cleancloudCustomerId: data.customerID,
        phone: parsed.data.phone,
        updatedAt: new Date(),
      })
      .where(eq(schema.user.id, auth.uid));

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
      { success: false, error: "Failed to create account" },
      { status: 500 }
    );
  }
}
