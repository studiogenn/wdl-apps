import { NextResponse } from "next/server";
import { z } from "zod";
import { cleancloudRequest } from "@/lib/cleancloud/client";
import { CleanCloudApiError, getReadableError } from "@/lib/cleancloud/errors";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { user as userTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginResponse = {
  readonly cid: number;
  readonly [key: string]: unknown;
};

async function harvestCredentials(
  email: string,
  password: string,
  cleancloudCustomerId: number,
  requestHeaders: Headers
): Promise<Headers | null> {
  try {
    // Try signing in first (account already exists)
    const signInResult = await auth.api.signInEmail({
      body: { email, password },
      headers: requestHeaders,
      asResponse: false,
      returnHeaders: true,
    });

    if (signInResult?.response) {
      // Update cleancloudCustomerId if missing
      const db = getDb();
      await db
        .update(userTable)
        .set({ cleancloudCustomerId: cleancloudCustomerId })
        .where(eq(userTable.email, email));

      return signInResult.headers;
    }
  } catch {
    // Sign-in failed — account doesn't exist yet, create it
    try {
      const signUpResult = await auth.api.signUpEmail({
        body: {
          name: email.split("@")[0] ?? email,
          email,
          password,
        },
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
            .set({ cleancloudCustomerId: cleancloudCustomerId })
            .where(eq(userTable.id, userId));
        }
        return signUpResult.headers;
      }
    } catch {
      // Signup also failed (e.g. email already exists with different password).
      // Don't block the CleanCloud login — just skip harvesting.
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
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const data = await cleancloudRequest<LoginResponse>("loginCustomer", {
      customerEmail: parsed.data.email,
      customerPassword: parsed.data.password,
    });

    const response = NextResponse.json({
      success: true,
      data: { customerID: data.cid },
    });

    // Harvest credentials in the background — don't block the response
    const authHeaders = await harvestCredentials(
      parsed.data.email,
      parsed.data.password,
      data.cid,
      request.headers
    );

    if (authHeaders) {
      forwardAuthCookies(authHeaders, response);
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
      { success: false, error: "Unable to log in. Please try again." },
      { status: 500 }
    );
  }
}
