import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticateRequest, isErrorResponse } from "@/lib/firebase/auth-middleware";
import { adminDb } from "@/lib/firebase/admin";

const registerSchema = z.object({
  fcmToken: z.string().min(1),
  platform: z.enum(["ios", "android"]),
});

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid registration data" },
        { status: 400 }
      );
    }

    await adminDb
      .collection("customers")
      .doc(auth.uid)
      .collection("fcmTokens")
      .doc(parsed.data.platform)
      .set({
        token: parsed.data.fcmToken,
        platform: parsed.data.platform,
        updatedAt: new Date().toISOString(),
      });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to register notification token" },
      { status: 500 }
    );
  }
}
