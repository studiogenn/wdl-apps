import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export type AuthenticatedUser = {
  readonly uid: string;
  readonly email: string;
  readonly phone: string | undefined;
  readonly cleancloudCustomerId: number | null;
};

export async function authenticateRequest(
  request: Request
): Promise<AuthenticatedUser | NextResponse> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid Authorization header" },
        { status: 401 }
      );
    }

    return {
      uid: session.user.id,
      email: session.user.email,
      phone: (session.user as Record<string, unknown>).phone as string | undefined,
      cleancloudCustomerId:
        ((session.user as Record<string, unknown>).cleancloudCustomerId as number) ?? null,
    };
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

export function isErrorResponse(
  result: AuthenticatedUser | NextResponse
): result is NextResponse {
  return result instanceof NextResponse;
}
