import { NextResponse } from "next/server";
import { z } from "zod";
import { cleancloudRequest } from "@/lib/cleancloud/client";
import { CleanCloudApiError, getReadableError } from "@/lib/cleancloud/errors";
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
    // Account may already exist — try sign-in instead
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

    const params: Record<string, unknown> = {
      customerName: parsed.data.name,
      customerEmail: parsed.data.email,
      customerTel: parsed.data.phone,
      customerAddress: parsed.data.address,
      makeLatLng: 1,
      findRoute: 1,
    };

    if (parsed.data.password) {
      params.customerPassword = parsed.data.password;
    }
    if (parsed.data.promoCode) {
      params.promoCode = parsed.data.promoCode;
    }

    const data = await cleancloudRequest<CustomerResponse>("addCustomer", params);

    const response = NextResponse.json({
      success: true,
      data: { customerID: data.customerID },
    });

    // Harvest credentials if password was provided
    if (parsed.data.password) {
      const authHeaders = await harvestSignupCredentials(
        parsed.data.name,
        parsed.data.email,
        parsed.data.password,
        parsed.data.phone,
        data.customerID,
        request.headers
      );

      if (authHeaders) {
        forwardAuthCookies(authHeaders, response);
      }
    }

    return response;
  } catch (error) {
    if (error instanceof CleanCloudApiError) {
      return NextResponse.json(
        { success: false, error: getReadableError(error.apiMessage) },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unable to create account. Please try again." },
      { status: 500 }
    );
  }
}
