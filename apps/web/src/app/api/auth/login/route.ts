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
  const db = getDb();
  const normalizedEmail = email.trim().toLowerCase();

  // Try Better Auth sign-in first (primary auth)
  let authResult: AuthResultWithHeaders | undefined;
  try {
    authResult = await auth.api.signInEmail({
      body: { email, password },
      headers: request.headers,
      asResponse: false,
      returnHeaders: true,
    }) as AuthResultWithHeaders;
  } catch {
    // Better Auth sign-in failed — try CleanCloud validation + account creation
  }

  // If Better Auth failed, try validating against CleanCloud and creating/linking an account
  if (!authResult?.response?.user?.id) {
    let ccCid: number | null = null;
    try {
      const ccResult = await cleancloudProxy<CleanCloudLoginResponse>(
        "/customers/login",
        { email, password },
      );
      if (ccResult.success && ccResult.data?.cid) {
        ccCid = ccResult.data.cid;
      }
    } catch {
      // CleanCloud also failed — credentials are invalid
    }

    if (!ccCid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 },
      );
    }

    // CleanCloud validated — check for orphan user record and recreate with proper credentials
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
        preservedName = existingUser.name;
        await db.delete(userTable).where(eq(userTable.id, existingUser.id));
      }
    }

    // Create Better Auth account with CleanCloud-validated password
    try {
      authResult = await auth.api.signUpEmail({
        body: { name: preservedName ?? email.split("@")[0] ?? email, email, password },
        headers: request.headers,
        asResponse: false,
        returnHeaders: true,
      }) as AuthResultWithHeaders;
    } catch {
      // signUpEmail may fail if account exists with different password — try signIn again
      // This shouldn't normally happen but handles edge cases
      return NextResponse.json(
        { success: false, error: "We couldn't sign you in. Please try again." },
        { status: 401 },
      );
    }

    // Link CleanCloud ID
    const userId = authResult?.response?.user?.id;
    if (userId && ccCid) {
      await db
        .update(userTable)
        .set({ cleancloudCustomerId: ccCid })
        .where(eq(userTable.id, userId));
    }
  }

  const userId = authResult?.response?.user?.id;
  if (!userId) {
    return NextResponse.json(
      { success: false, error: "We couldn't sign you in. Please try again." },
      { status: 401 },
    );
  }

  // Opportunistically link CleanCloud if not already linked
  const [userRecord] = await db
    .select({ cleancloudCustomerId: userTable.cleancloudCustomerId })
    .from(userTable)
    .where(eq(userTable.id, userId))
    .limit(1);

  if (!userRecord?.cleancloudCustomerId) {
    try {
      const ccResult = await cleancloudProxy<CleanCloudLoginResponse>(
        "/customers/login",
        { email, password },
      );
      if (ccResult.success && ccResult.data?.cid) {
        await db
          .update(userTable)
          .set({ cleancloudCustomerId: ccResult.data.cid })
          .where(eq(userTable.id, userId));
      }
    } catch {
      // Non-critical — CC link can happen later
    }
  }

  const response = NextResponse.json({ success: true, data: { userId } });
  if (authResult?.headers) {
    for (const cookie of authResult.headers.getSetCookie()) {
      response.headers.append("set-cookie", cookie);
    }
  }
  return response;
}
