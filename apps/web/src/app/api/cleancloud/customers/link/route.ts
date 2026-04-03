import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticateRequest, isErrorResponse } from "@/lib/auth/middleware";
import { cleancloudProxy } from "@/lib/cleancloud/client";
import { getReadableError } from "@/lib/cleancloud/errors";
import { getDb } from "@/lib/db";
import { user as userTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const linkSchema = z.object({
  name: z.string().min(1).max(200),
  phone: z.string().min(10).max(20),
  address: z.string().min(1).max(500),
});

type CleanCloudCustomerResponse = {
  readonly customerID: number;
  readonly [key: string]: unknown;
};

type CleanCloudLoginResponse = {
  readonly cid: number;
  readonly [key: string]: unknown;
};

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  // Already linked
  if (auth.cleancloudCustomerId) {
    return NextResponse.json({
      success: true,
      data: { cleancloudCustomerId: auth.cleancloudCustomerId },
    });
  }

  const body = await request.json();
  const parsed = linkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const db = getDb();
  const { name, phone, address } = parsed.data;

  // Try to find existing CC customer by email first
  let cleancloudCustomerId: number | null = null;

  try {
    const ccLogin = await cleancloudProxy<CleanCloudLoginResponse>(
      "/customers/login",
      { email: auth.email, password: "" },
    );
    if (ccLogin.success && ccLogin.data?.cid) {
      cleancloudCustomerId = ccLogin.data.cid;
    }
  } catch {
    // Not found — will create
  }

  if (!cleancloudCustomerId) {
    const ccCreate = await cleancloudProxy<CleanCloudCustomerResponse>(
      "/customers",
      { name, email: auth.email, phone, address },
    );

    if (!ccCreate.success) {
      return NextResponse.json(
        { success: false, error: getReadableError(ccCreate.error ?? "") },
        { status: 422 },
      );
    }

    cleancloudCustomerId = ccCreate.data!.customerID;
  }

  // Link to auth user
  await db
    .update(userTable)
    .set({ cleancloudCustomerId, phone })
    .where(eq(userTable.id, auth.uid));

  return NextResponse.json({
    success: true,
    data: { cleancloudCustomerId },
  });
}
