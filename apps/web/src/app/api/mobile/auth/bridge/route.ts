import { NextResponse } from "next/server";
import { z } from "zod";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

const bridgeSchema = z.object({
  phone: z.string().min(10).max(20),
});


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

    // Check if mapping already exists
    const existing = await adminDb.collection("customers").doc(uid).get();
    if (existing.exists && existing.data()?.cleancloudCustomerId) {
      return NextResponse.json({
        success: true,
        data: {
          customerID: existing.data()!.cleancloudCustomerId,
          hasProfile: true,
        },
      });
    }

    // Parse phone from request body
    const body = await request.json();
    const parsed = bridgeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid phone number" },
        { status: 400 }
      );
    }

    // Normalize to E.164
    const digits = parsed.data.phone.replace(/\D/g, "");
    const e164 = digits.startsWith("1") ? `+${digits}` : `+1${digits}`;

    // Try to find customer in CleanCloud by phone
    // CleanCloud doesn't have a phone lookup endpoint, so we check Firestore
    // for any existing mapping with this phone
    const phoneQuery = await adminDb
      .collection("customers")
      .where("phone", "==", e164)
      .limit(1)
      .get();

    if (!phoneQuery.empty) {
      const match = phoneQuery.docs[0].data();
      // Link this Firebase UID to the existing CleanCloud customer
      await adminDb.collection("customers").doc(uid).set({
        cleancloudCustomerId: match.cleancloudCustomerId,
        phone: e164,
        linkedAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        data: { customerID: match.cleancloudCustomerId, hasProfile: true },
      });
    }

    // No existing customer found — need to register
    return NextResponse.json({
      success: true,
      data: { customerID: null, hasProfile: false },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 401 }
    );
  }
}
