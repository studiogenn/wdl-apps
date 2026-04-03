import { NextResponse } from "next/server";
import { createHmac } from "node:crypto";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";
import { getDb, schema } from "@/lib/db";
import { getsql } from "@/lib/db/connection";
import { eq } from "drizzle-orm";
import { STRIPE_IDS, type MembershipTier } from "@/lib/stripe-config";
import { cleancloudProxy } from "@/lib/cleancloud/client";
import { user as userTable } from "@/lib/db/schema";

const quickCheckoutSchema = z.object({
  tier: z.enum(["weekly", "family"]),
  paymentMethodId: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1).max(200),
  phone: z.string().min(5).max(30),
});

type CleanCloudLoginResponse = {
  readonly cid: number;
  readonly [key: string]: unknown;
};

type CleanCloudCustomerResponse = {
  readonly customerID: number;
  readonly [key: string]: unknown;
};

function generateRandomPassword(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

function signSessionToken(token: string, secret: string): string {
  const signature = createHmac("sha256", secret)
    .update(token)
    .digest("base64");
  return `${token}.${signature}`;
}

async function findExistingUser(email: string) {
  const db = getDb();
  const [existing] = await db
    .select({
      id: userTable.id,
      name: userTable.name,
      cleancloudCustomerId: userTable.cleancloudCustomerId,
    })
    .from(userTable)
    .where(eq(userTable.email, email.trim().toLowerCase()))
    .limit(1);
  return existing ?? null;
}

async function findCcCustomerByEmail(email: string): Promise<number | null> {
  const sql = getsql();
  const [match] = await sql`
    SELECT cleancloud_id AS "cleancloudId"
    FROM stg_cleancloud.stg_cc_customers
    WHERE lower(email) = lower(${email})
      AND deleted_at IS NULL
    ORDER BY created_at DESC
    LIMIT 1
  `;
  return (match?.cleancloudId as number) ?? null;
}

async function getOrCreateStripeCustomer(
  authUserId: string,
  email: string,
  name: string,
  phone: string,
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  },
) {
  const existing = await getDb().query.customers.findFirst({
    where: eq(schema.customers.authUserId, authUserId),
  });

  if (existing) return existing.stripeCustomerId;

  const customer = await getStripe().customers.create({
    email,
    name,
    phone,
    metadata: { authUserId },
    ...(address?.line1 ? { address } : {}),
  });

  await getDb().insert(schema.customers).values({
    authUserId,
    stripeCustomerId: customer.id,
  });

  return customer.id;
}

async function createCcCustomer(
  email: string,
  name: string,
  phone: string,
  address: string,
): Promise<number | null> {
  // Try to find existing CC customer first
  try {
    const ccLogin = await cleancloudProxy<CleanCloudLoginResponse>(
      "/customers/login",
      { email, password: "" },
    );
    if (ccLogin.success && ccLogin.data?.cid) {
      return ccLogin.data.cid;
    }
  } catch {
    // Not found — will create
  }

  try {
    const ccCreate = await cleancloudProxy<CleanCloudCustomerResponse>(
      "/customers",
      { name, email, phone, address },
    );
    if (ccCreate.success && ccCreate.data?.customerID) {
      return ccCreate.data.customerID;
    }
  } catch {
    // CC unavailable — continue without
  }

  return null;
}

async function createSessionForUser(userId: string) {
  const ctx = await (auth as unknown as { $context: Promise<{
    readonly internalAdapter: {
      createSession: (userId: string) => Promise<{
        id: string;
        token: string;
        userId: string;
        expiresAt: Date;
      }>;
    };
    readonly secret: string;
    readonly authCookies: {
      readonly sessionToken: {
        readonly name: string;
        readonly attributes: {
          readonly path?: string;
          readonly httpOnly?: boolean;
          readonly secure?: boolean;
          readonly sameSite?: string;
          readonly maxAge?: number;
        };
      };
    };
    readonly sessionConfig: { readonly expiresIn: number };
  }> }).$context;

  const session = await ctx.internalAdapter.createSession(userId);
  const signedToken = signSessionToken(session.token, ctx.secret);

  const cookieName = ctx.authCookies.sessionToken.name;
  const attrs = ctx.authCookies.sessionToken.attributes;
  const maxAge = ctx.sessionConfig.expiresIn;

  const parts = [
    `${cookieName}=${signedToken}`,
    `Path=${attrs.path ?? "/"}`,
    `Max-Age=${maxAge}`,
  ];
  if (attrs.httpOnly !== false) parts.push("HttpOnly");
  if (attrs.secure !== false) parts.push("Secure");
  if (attrs.sameSite) parts.push(`SameSite=${attrs.sameSite}`);

  return parts.join("; ");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = quickCheckoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const { tier, paymentMethodId, email, name, phone } = parsed.data;
    const tierConfig = STRIPE_IDS.membership.tiers[tier as MembershipTier];
    const { overagePriceId } = STRIPE_IDS.membership;

    // ── Phase 1: Retrieve PM + check existing user in parallel ──
    const [pm, existingUser, ccIdByEmail] = await Promise.all([
      getStripe().paymentMethods.retrieve(paymentMethodId),
      findExistingUser(email),
      findCcCustomerByEmail(email),
    ]);

    const billingAddress = pm.billing_details?.address;
    const addressString = billingAddress?.line1
      ? [billingAddress.line1, billingAddress.line2, billingAddress.city, billingAddress.state, billingAddress.postal_code]
          .filter(Boolean)
          .join(", ")
      : "";

    // ── Phase 2: Create or resolve BA account ──
    let userId: string;
    let sessionCookie: string;

    if (existingUser) {
      userId = existingUser.id;

      // Check for active subscription
      const stripeCustomer = await getDb().query.customers.findFirst({
        where: eq(schema.customers.authUserId, userId),
      });

      if (stripeCustomer) {
        const activeSubs = await getStripe().subscriptions.list({
          customer: stripeCustomer.stripeCustomerId,
          status: "active",
          limit: 1,
        });

        if (activeSubs.data.length > 0) {
          return NextResponse.json({
            success: false,
            error: "already_subscribed",
            data: { subscriptionId: activeSubs.data[0].id },
          });
        }
      }

      // Create session for existing user
      sessionCookie = await createSessionForUser(userId);
    } else {
      // New user — create BA account
      const password = generateRandomPassword();
      const signUpResult = await auth.api.signUpEmail({
        body: { name, email, password },
        headers: request.headers,
        asResponse: false,
        returnHeaders: true,
      });

      userId = (signUpResult as { response: { user?: { id?: string } } }).response?.user?.id ?? "";

      if (!userId) {
        return NextResponse.json(
          { success: false, error: "Failed to create account" },
          { status: 500 },
        );
      }

      // Update phone
      await getDb()
        .update(userTable)
        .set({ phone })
        .where(eq(userTable.id, userId));

      // Extract session cookie from signup response
      const signUpHeaders = (signUpResult as { headers?: Headers }).headers;
      sessionCookie = signUpHeaders?.getSetCookie?.()[0] ?? "";

      // Fallback: create session manually if signup didn't return cookie
      if (!sessionCookie) {
        sessionCookie = await createSessionForUser(userId);
      }
    }

    // ── Phase 3: Stripe customer + subscription + CC customer in parallel ──
    const stripeAddress = billingAddress?.line1
      ? {
          line1: billingAddress.line1 ?? undefined,
          line2: billingAddress.line2 ?? undefined,
          city: billingAddress.city ?? undefined,
          state: billingAddress.state ?? undefined,
          postal_code: billingAddress.postal_code ?? undefined,
          country: billingAddress.country ?? undefined,
        }
      : undefined;

    const [stripeCustomerId, ccId] = await Promise.all([
      getOrCreateStripeCustomer(userId, email, name, phone, stripeAddress),
      // Use existing CC ID if found, otherwise create
      ccIdByEmail
        ? Promise.resolve(ccIdByEmail)
        : createCcCustomer(email, name, phone, addressString),
    ]);

    // Link CC customer to BA user if found/created
    if (ccId) {
      getDb()
        .update(userTable)
        .set({ cleancloudCustomerId: ccId })
        .where(eq(userTable.id, userId))
        .then(() => {})
        .catch(() => {});
    }

    // Update Stripe customer with address from PM
    if (stripeAddress) {
      getStripe()
        .customers.update(stripeCustomerId, {
          address: stripeAddress,
          name,
          phone,
        })
        .catch(() => {});
    }

    // ── Phase 4: Create subscription ──
    // Guard: check if customer already has an active subscription on Stripe
    const existingSubs = await getStripe().subscriptions.list({
      customer: stripeCustomerId,
      status: "active",
      limit: 1,
    });

    if (existingSubs.data.length > 0) {
      const response = NextResponse.json({
        success: true,
        data: {
          subscriptionId: existingSubs.data[0].id,
          status: existingSubs.data[0].status,
        },
      });
      response.headers.append("set-cookie", sessionCookie);
      return response;
    }

    const subscription = await getStripe().subscriptions.create({
      customer: stripeCustomerId,
      items: [
        { price: tierConfig.priceId },
        { price: overagePriceId },
      ],
      default_payment_method: paymentMethodId,
      metadata: {
        tier,
        pickups: String(tierConfig.pickups),
        includedLbs: String(tierConfig.includedLbs),
        source: "wallet_quick_checkout",
      },
    });

    const response = NextResponse.json({
      success: true,
      data: {
        subscriptionId: subscription.id,
        status: subscription.status,
      },
    });

    response.headers.append("set-cookie", sessionCookie);
    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Quick checkout failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
