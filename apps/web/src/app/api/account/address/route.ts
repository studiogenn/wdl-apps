import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticateRequest, isErrorResponse } from "@/lib/auth/middleware";
import { cleancloudPost } from "@/lib/cleancloud/client";
import { getStripe } from "@/lib/stripe";
import { getDb, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getsql } from "@/lib/db/connection";
import { user as userTable } from "@/lib/db/schema";

const addressSchema = z.object({
  street: z.string().min(1).max(300),
  apt: z.string().max(50).optional().default(""),
  city: z.string().min(1).max(100),
  state: z.string().min(2).max(50),
  zip: z.string().min(5).max(10),
});

/** Resolve CleanCloud customer ID from auth user */
async function resolveCleanCloudId(
  userId: string,
  email: string,
  existing: number | null,
): Promise<number | null> {
  if (existing) return existing;

  const sql = getsql();
  const [match] = await sql`
    SELECT cleancloud_id AS "cleancloudId"
    FROM stg_cleancloud.stg_cc_customers
    WHERE lower(email) = lower(${email})
      AND deleted_at IS NULL
    ORDER BY created_at DESC
    LIMIT 1
  `;

  if (!match?.cleancloudId) return null;

  const ccId = match.cleancloudId as number;
  await getDb()
    .update(userTable)
    .set({ cleancloudCustomerId: ccId })
    .where(eq(userTable.id, userId));

  return ccId;
}

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  const body = await request.json();
  const parsed = addressSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Please fill in all address fields" },
      { status: 400 },
    );
  }

  const { street, apt, city, state, zip } = parsed.data;

  // Update CleanCloud — send each field separately so City/State/Zip populate
  const ccId = await resolveCleanCloudId(auth.uid, auth.email, auth.cleancloudCustomerId);
  if (ccId) {
    try {
      await cleancloudPost("/editCustomer", {
        customerID: ccId,
        customerAddress: street,
        customerApt: apt,
        customerCity: city,
        customerState: state,
        customerZip: zip,
      });
    } catch (err) {
      console.error("[Address] CleanCloud update failed:", err);
    }
  }

  // Update Stripe customer shipping address
  try {
    const db = getDb();
    const customer = await db.query.customers.findFirst({
      where: eq(schema.customers.authUserId, auth.uid),
    });

    if (customer) {
      await getStripe().customers.update(customer.stripeCustomerId, {
        shipping: {
          name: auth.email,
          address: {
            line1: street,
            line2: apt || undefined,
            city,
            state,
            postal_code: zip,
            country: "US",
          },
        },
      });
    }
  } catch {
    // Non-critical
  }

  return NextResponse.json({ success: true });
}

export async function GET(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  const ccId = await resolveCleanCloudId(auth.uid, auth.email, auth.cleancloudCustomerId);
  if (!ccId) {
    return NextResponse.json({
      success: true,
      data: { street: "", apt: "", city: "", state: "", zip: "" },
    });
  }

  const sql = getsql();
  const [customer] = await sql`
    SELECT
      address AS "street",
      apt,
      city,
      state,
      zip
    FROM stg_cleancloud.stg_cc_customers
    WHERE cleancloud_id = ${ccId}
      AND deleted_at IS NULL
    LIMIT 1
  `;

  return NextResponse.json({
    success: true,
    data: {
      street: customer?.street ?? "",
      apt: customer?.apt ?? "",
      city: customer?.city ?? "",
      state: customer?.state ?? "",
      zip: customer?.zip ?? "",
    },
  });
}
