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
  phone: z.string().min(10).max(20),
  address: z.string().max(500).optional().default(""),
  password: z.string().min(8),
});

type CleanCloudLoginResponse = {
  readonly cid: number;
  readonly [key: string]: unknown;
};

type CleanCloudCustomerResponse = {
  readonly customerID: number;
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

  const { name, email, phone, address, password } = parsed.data;

  // Create Better Auth account
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

  if (userId) {
    // Update phone on the BA user record
    const db = getDb();
    await db
      .update(userTable)
      .set({ phone })
      .where(eq(userTable.id, userId));

    // Try to link existing CC customer, or create a new one
    let cleancloudCustomerId: number | null = null;

    try {
      const ccLogin = await cleancloudProxy<CleanCloudLoginResponse>(
        "/customers/login",
        { email, password }
      );
      if (ccLogin.success && ccLogin.data?.cid) {
        cleancloudCustomerId = ccLogin.data.cid;
      }
    } catch {
      // CC login failed — not an existing customer
    }

    if (!cleancloudCustomerId) {
      try {
        const ccCreate = await cleancloudProxy<CleanCloudCustomerResponse>(
          "/customers",
          { name, email, phone, address, password }
        );
        if (ccCreate.success && ccCreate.data?.customerID) {
          cleancloudCustomerId = ccCreate.data.customerID;
        }
      } catch {
        // CC create failed — continue without CC link
      }
    }

    if (cleancloudCustomerId) {
      await db
        .update(userTable)
        .set({ cleancloudCustomerId })
        .where(eq(userTable.id, userId));
    }
  }

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
