import { NextResponse } from "next/server";
import { z } from "zod";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { cleancloudRequest } from "@/lib/cleancloud/client";
import { CleanCloudApiError, getReadableError } from "@/lib/cleancloud/errors";

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
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, error: "Missing authorization" },
      { status: 401 }
    );
  }

  try {
    const decoded = await adminAuth.verifyIdToken(authHeader.slice(7));
    const uid = decoded.uid;

    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const digits = parsed.data.phone.replace(/\D/g, "");
    const e164 = digits.startsWith("1") ? `+${digits}` : `+1${digits}`;

    // Create customer in CleanCloud
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

    // Store mapping in Firestore
    await adminDb.collection("customers").doc(uid).set({
      cleancloudCustomerId: data.customerID,
      phone: e164,
      email: parsed.data.email,
      name: parsed.data.name,
      createdAt: new Date().toISOString(),
    });

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
