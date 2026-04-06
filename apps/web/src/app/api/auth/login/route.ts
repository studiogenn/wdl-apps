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

  // Always validate against CleanCloud first
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
  const db = getDb();
  const normalizedEmail = email.trim().toLowerCase();

  // Check for existing user
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
      // Orphan user — delete so signUpEmail can recreate with proper credentials
      preservedName = existingUser.name;
      await db.delete(userTable).where(eq(userTable.id, existingUser.id));
    }
  }

  // CleanCloud validated — create or sign into Better Auth for session management
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
      // BA sign-in failed — update password to match CleanCloud's
    }
  }

  const userId = authResult?.response.user?.id;

  if (userId) {
    // Link CleanCloud ID
    await db
      .update(userTable)
      .set({ cleancloudCustomerId: cid })
      .where(eq(userTable.id, userId));

    const response = NextResponse.json({ success: true, data: { userId } });
    if (authResult?.headers) {
      for (const cookie of authResult.headers.getSetCookie()) {
        response.headers.append("set-cookie", cookie);
      }
    }
    return response;
  }

  return NextResponse.json(
    { success: false, error: "We couldn't sign you in. Please try again." },
    { status: 401 }
  );
}
