import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { cleancloudProxy } from "@/lib/cleancloud/client";
import { getDb } from "@/lib/db";
import { user as userTable, account as accountTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type CleanCloudLoginResponse = {
  readonly cid: number;
  readonly [key: string]: unknown;
};

type AuthResultWithHeaders = {
  readonly headers: Headers;
  readonly response: {
    readonly user?: { readonly id?: string };
    readonly [key: string]: unknown;
  };
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

function buildSuccessResponse(
  result: AuthResultWithHeaders,
  userId: string | undefined
): NextResponse {
  const response = NextResponse.json({
    success: true,
    data: { userId },
  });

  for (const cookie of result.headers.getSetCookie()) {
    response.headers.append("set-cookie", cookie);
  }

  return response;
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
  let signInResult: AuthResultWithHeaders | undefined;
  try {
    signInResult = await auth.api.signInEmail({
      body: { email, password },
      headers: request.headers,
      asResponse: false,
      returnHeaders: true,
    }) as AuthResultWithHeaders;
  } catch {
    // BA account doesn't exist or wrong password — fall through to CleanCloud
  }

  if (signInResult) {
    const userId = signInResult.response.user?.id;

    if (userId) {
      try {
        await tryLinkCleanCloud(userId, email, password);
      } catch {
        // CC unavailable — skip
      }
    }

    return buildSuccessResponse(signInResult, userId);
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

  // Check for orphan user (migrated from CleanCloud without credentials row)
  const db = getDb();
  const normalizedEmail = email.trim().toLowerCase();
  const [existingUser] = await db
    .select({ id: userTable.id, name: userTable.name })
    .from(userTable)
    .where(eq(userTable.email, normalizedEmail))
    .limit(1);

  let preservedName: string | undefined;
  if (existingUser) {
    const [existingAccount] = await db
      .select({ id: accountTable.id })
      .from(accountTable)
      .where(eq(accountTable.userId, existingUser.id))
      .limit(1);

    if (!existingAccount) {
      // User row exists but no credentials — delete so signUpEmail
      // can recreate with proper Better Auth account + password hash
      preservedName = existingUser.name;
      await db.delete(userTable).where(eq(userTable.id, existingUser.id));
    }
  }

  // CC login worked — create or sign into BA account and link
  let authResult: AuthResultWithHeaders | undefined;
  try {
    authResult = await auth.api.signUpEmail({
      body: { name: preservedName ?? email.split("@")[0] ?? email, email, password },
      headers: request.headers,
      asResponse: false,
      returnHeaders: true,
    }) as AuthResultWithHeaders;
  } catch {
    try {
      authResult = await auth.api.signInEmail({
        body: { email, password },
        headers: request.headers,
        asResponse: false,
        returnHeaders: true,
      }) as AuthResultWithHeaders;
    } catch {
      return NextResponse.json(
        { success: false, error: "We couldn't sign you in. Please create a new account or reset your password." },
        { status: 401 }
      );
    }
  }

  const userId = authResult?.response.user?.id;
  if (userId) {
    await db
      .update(userTable)
      .set({ cleancloudCustomerId: cid })
      .where(eq(userTable.id, userId));
  }

  if (authResult) {
    return buildSuccessResponse(authResult, userId);
  }

  return NextResponse.json({
    success: true,
    data: { customerID: cid, authLinked: false },
  });
}
