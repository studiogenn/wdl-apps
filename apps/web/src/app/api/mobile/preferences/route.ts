import { NextResponse } from "next/server";
import { authenticateRequest, isErrorResponse } from "@/lib/firebase/auth-middleware";
import { adminDb } from "@/lib/firebase/admin";

export async function GET(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  try {
    const doc = await adminDb.collection("customers").doc(auth.uid).get();
    const preferences = doc.exists ? doc.data()?.preferences ?? {} : {};

    return NextResponse.json({
      success: true,
      data: { preferences },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  try {
    const body = await request.json();

    await adminDb.collection("customers").doc(auth.uid).set(
      { preferences: body, updatedAt: new Date().toISOString() },
      { merge: true }
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to save preferences" },
      { status: 500 }
    );
  }
}
