import { NextResponse } from "next/server";
import { z } from "zod";
import { cleancloudProxy } from "@/lib/cleancloud/client";
import { getReadableError } from "@/lib/cleancloud/errors";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { user as userTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const customerSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number").max(20),
  address: z.string().min(1, "Address is required").max(500),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  promoCode: z.string().max(50).optional(),
});

type CustomerResponse = {
  readonly customerID: number;
  readonly [key: string]: unknown;
};

async function harvestSignupCredentials(
  name: string,
  email: string,
  password: string,
  phone: string,
  cleancloudCustomerId: number,
  requestHeaders: Headers
): Promise<Headers | null> {
  try {
    const signUpResult = await auth.api.signUpEmail({
      body: { name, email, password },
      headers: requestHeaders,
      asResponse: false,
      returnHeaders: true,
    });

    if (signUpResult?.response) {
      const db = getDb();
      const userId = (signUpResult.response as { user?: { id?: string } }).user?.id;
      if (userId) {
        await db
          .update(userTable)
          .set({ cleancloudCustomerId: cleancloudCustomerId, phone })
          .where(eq(userTable.id, userId));
      }
      return signUpResult.headers;
    }
  } catch {
    try {
      const signInResult = await auth.api.signInEmail({
        body: { email, password },
        headers: requestHeaders,
        asResponse: false,
        returnHeaders: true,
      });

      if (signInResult?.response) {
        const db = getDb();
        await db
          .update(userTable)
          .set({ cleancloudCustomerId: cleancloudCustomerId, phone })
          .where(eq(userTable.email, email));
        return signInResult.headers;
      }
    } catch {
      // Both failed — skip harvesting silently
    }
  }

  return null;
}

function forwardAuthCookies(
  authHeaders: Headers,
  response: NextResponse
): void {
  for (const cookie of authHeaders.getSetCookie()) {
    response.headers.append("set-cookie", cookie);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = customerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const result = await cleancloudProxy<CustomerResponse>("/customers", {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      address: parsed.data.address,
      ...(parsed.data.password && { password: parsed.data.password }),
      ...(parsed.data.promoCode && { promoCode: parsed.data.promoCode }),
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: getReadableError(result.error ?? "") },
        { status: 422 }
      );
    }

    const response = NextResponse.json({
      success: true,
      data: { customerID: result.data!.customerID },
    });

    if (parsed.data.password) {
      const authHeaders = await harvestSignupCredentials(
        parsed.data.name,
        parsed.data.email,
        parsed.data.password,
        parsed.data.phone,
        result.data!.customerID,
        request.headers
      );

      if (authHeaders) {
        forwardAuthCookies(authHeaders, response);
      }
    }

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Unable to create account. Please try again." },
      { status: 500 }
    );
  }
}
