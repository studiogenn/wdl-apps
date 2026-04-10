import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticateRequest, isErrorResponse } from "@/lib/auth/middleware";
import { cleancloudProxy, findCustomerByEmail } from "@/lib/cleancloud/client";
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

  // 1. Try to find existing CC customer by email (search, not login)
  let cleancloudCustomerId: number | null = null;

  try {
    const existing = await findCustomerByEmail(auth.email);
    if (existing) {
      cleancloudCustomerId = parseInt(existing.customerID, 10);
    }
  } catch {
    // Search failed — will try to create
  }

  // 2. If not found, create a new CleanCloud customer
  if (!cleancloudCustomerId) {
    try {
      const ccCreate = await cleancloudProxy<CleanCloudCustomerResponse>(
        "/customers",
        { name, email: auth.email, phone, address },
      );

      if (!ccCreate.success) {
        const errorMsg = ccCreate.error ?? "";
        console.error("[CC Link] Create failed:", errorMsg);

        // If "already exists" error, try searching again
        if (errorMsg.toLowerCase().includes("already exists") || errorMsg.toLowerCase().includes("already registered")) {
          try {
            const retry = await findCustomerByEmail(auth.email);
            if (retry) {
              cleancloudCustomerId = parseInt(retry.customerID, 10);
            }
          } catch { /* give up */ }
        }

        if (!cleancloudCustomerId) {
          return NextResponse.json(
            { success: false, error: getReadableError(errorMsg) },
            { status: 422 },
          );
        }
      } else {
        cleancloudCustomerId = ccCreate.data!.customerID;
      }
    } catch (err) {
      console.error("[CC Link] Create threw:", err instanceof Error ? err.message : err);
      return NextResponse.json(
        { success: false, error: "Unable to set up your laundry account. Please try again or contact support." },
        { status: 500 },
      );
    }
  }

  // 3. Link to auth user
  await db
    .update(userTable)
    .set({ cleancloudCustomerId, phone })
    .where(eq(userTable.id, auth.uid));

  return NextResponse.json({
    success: true,
    data: { cleancloudCustomerId },
  });
}
