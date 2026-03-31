import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "./admin";

export type AuthenticatedUser = {
  readonly uid: string;
  readonly phone: string | undefined;
  readonly cleancloudCustomerId: number | null;
};

export async function authenticateRequest(
  request: Request
): Promise<AuthenticatedUser | NextResponse> {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, error: "Missing or invalid Authorization header" },
      { status: 401 }
    );
  }

  const token = authHeader.slice(7);

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;
    const phone = decoded.phone_number;

    // Look up CleanCloud customer ID from Firestore
    const doc = await adminDb.collection("customers").doc(uid).get();
    const cleancloudCustomerId = doc.exists
      ? (doc.data()?.cleancloudCustomerId as number) ?? null
      : null;

    return { uid, phone, cleancloudCustomerId };
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

export function isErrorResponse(
  result: AuthenticatedUser | NextResponse
): result is NextResponse {
  return result instanceof NextResponse;
}
