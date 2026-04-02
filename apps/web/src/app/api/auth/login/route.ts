import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { cleancloudProxy } from "@/lib/cleancloud/client";
import { getDb } from "@/lib/db";
import { user as userTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type CleanCloudLoginResponse = {
  readonly cid: number;
  readonly [key: string]: unknown;
};

async function tryLinkCleanCloud(
  userId: string,
  email: string,
  password: string
): Promise<void> {
  const db = getDb();
  const [existing] = await db
    .select({ cleancloudCustomerId: userTable.cleancloudCustomerId })
    .from(userTable)
    .where(eq(userTable.id, userId))
    .limit(1);

  if (existing?.cleancloudCustomerId) return;

  const ccResult = await cleancloudProxy<CleanCloudLoginResponse>(
    "/customers/login",
    { email, password }
  );

  if (ccResult.success && ccResult.data?.cid) {
    await db
      .update(userTable)
      .set({ cleancloudCustomerId: ccResult.data.cid })
      .where(eq(userTable.id, userId));
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;

  // Try Better Auth sign-in first
  let signInResult: { headers?: Headers; response?: unknown; user?: { id?: string }; [key: string]: unknown } | undefined;
  try {
    signInResult = await auth.api.signInEmail({
      body: { email, password },
      headers: request.headers,
      asResponse: false,
      returnHeaders: true,
    }) as typeof signInResult;
  } catch {
    // BA account doesn't exist — fall through to CleanCloud
  }

  if (signInResult) {
    // returnHeaders wraps as { headers, response } — extract user id from either shape
    const resp = (signInResult.response ?? signInResult) as { user?: { id?: string } };
    const userId = resp.user?.id;

    // Best-effort CC linking — don't block login
    if (userId) {
      try {
        await tryLinkCleanCloud(userId, email, password);
      } catch {
        // CC unavailable — skip
      }
    }

    const response = NextResponse.json({
      success: true,
      data: { userId },
    });

    if (signInResult.headers) {
      for (const cookie of signInResult.headers.getSetCookie()) {
        response.headers.append("set-cookie", cookie);
      }
    }

    return response;
  }

  // BA failed — try CleanCloud login, then create/link BA account
  let ccResult;
  try {
    ccResult = await cleancloudProxy<CleanCloudLoginResponse>(
      "/customers/login",
      { email, password }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid email or password." },
      { status: 401 }
    );
  }

  if (!ccResult.success || !ccResult.data?.cid) {
    return NextResponse.json(
      { success: false, error: "Invalid email or password." },
      { status: 401 }
    );
  }

  const cid = ccResult.data.cid;

  // CC login worked — create or sign into BA account and link
  let authResult;
  try {
    authResult = await auth.api.signUpEmail({
      body: { name: email.split("@")[0] ?? email, email, password },
      headers: request.headers,
      asResponse: false,
      returnHeaders: true,
    });
  } catch {
    // BA account already exists — sign in instead
    try {
      authResult = await auth.api.signInEmail({
        body: { email, password },
        headers: request.headers,
        asResponse: false,
        returnHeaders: true,
      });
    } catch {
      // Passwords might differ between BA and CC — can't auto-link
      return NextResponse.json({
        success: true,
        data: { customerID: cid, authLinked: false },
      });
    }
  }

  if (authResult) {
    const resp = (authResult.response ?? authResult) as { user?: { id?: string } };
    const userId = resp.user?.id;
    if (userId) {
      const db = getDb();
      await db
        .update(userTable)
        .set({ cleancloudCustomerId: cid })
        .where(eq(userTable.id, userId));
    }
  }

  const response = NextResponse.json({
    success: true,
    data: { customerID: cid, authLinked: true },
  });

  if (authResult?.headers) {
    for (const cookie of (authResult.headers as Headers).getSetCookie()) {
      response.headers.append("set-cookie", cookie);
    }
  }

  return response;
}
