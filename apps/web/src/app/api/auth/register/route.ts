import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { cleancloudProxy } from "@/lib/cleancloud/client";
import { getDb } from "@/lib/db";
import { user as userTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const registerSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  password: z.string().min(8),
});

type CleanCloudLoginResponse = {
  readonly cid: number;
  readonly [key: string]: unknown;
};

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { name, email, password } = parsed.data;

  let signUpResult;
  try {
    signUpResult = await auth.api.signUpEmail({
      body: { name, email, password },
      headers: request.headers,
      asResponse: false,
      returnHeaders: true,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Could not create account.";
    const status = msg.toLowerCase().includes("already") ? 409 : 500;
    return NextResponse.json({ success: false, error: msg }, { status });
  }

  const userId = signUpResult?.response?.user?.id as string | undefined;

  // Try to link CleanCloud customer — best-effort, don't block signup
  if (userId) {
    try {
      const ccResult = await cleancloudProxy<CleanCloudLoginResponse>(
        "/customers/login",
        { email, password }
      );
      if (ccResult.success && ccResult.data?.cid) {
        const db = getDb();
        await db
          .update(userTable)
          .set({ cleancloudCustomerId: ccResult.data.cid })
          .where(eq(userTable.id, userId));
      }
    } catch {
      // CleanCloud unavailable or credentials don't match — skip linking
    }
  }

  // Forward session cookies from Better Auth
  const response = NextResponse.json({
    success: true,
    data: { userId },
  });

  if (signUpResult?.headers) {
    for (const cookie of signUpResult.headers.getSetCookie()) {
      response.headers.append("set-cookie", cookie);
    }
  }

  return response;
}
