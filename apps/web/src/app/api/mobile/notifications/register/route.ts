import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticateRequest, isErrorResponse } from "@/lib/auth/middleware";
import { getDb, schema } from "@/lib/db";
import { and, eq } from "drizzle-orm";

const registerSchema = z.object({
  token: z.string().min(1),
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

    const existing = await getDb().query.pushTokens.findFirst({
      where: and(
        eq(schema.pushTokens.userId, auth.uid),
        eq(schema.pushTokens.platform, parsed.data.platform),
      ),
    });

    if (existing) {
      await getDb()
        .update(schema.pushTokens)
        .set({ token: parsed.data.token, updatedAt: new Date() })
        .where(eq(schema.pushTokens.id, existing.id));
    } else {
      await getDb().insert(schema.pushTokens).values({
        userId: auth.uid,
        token: parsed.data.token,
        platform: parsed.data.platform,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to register notification token" },
      { status: 500 }
    );
  }
}
