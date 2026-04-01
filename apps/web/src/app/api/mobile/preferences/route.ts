import { NextResponse } from "next/server";
import { authenticateRequest, isErrorResponse } from "@/lib/auth/middleware";
import { getDb, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  try {
    const row = await getDb().query.userPreferences.findFirst({
      where: eq(schema.userPreferences.userId, auth.uid),
    });

    return NextResponse.json({
      success: true,
      data: { preferences: row?.preferences ?? {} },
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

    await getDb()
      .insert(schema.userPreferences)
      .values({
        userId: auth.uid,
        preferences: body,
      })
      .onConflictDoUpdate({
        target: schema.userPreferences.userId,
        set: { preferences: body, updatedAt: new Date() },
      });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to save preferences" },
      { status: 500 }
    );
  }
}
