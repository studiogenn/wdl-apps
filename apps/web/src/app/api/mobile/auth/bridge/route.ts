import { NextResponse } from "next/server";
import { authenticateRequest, isErrorResponse } from "@/lib/auth/middleware";

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  return NextResponse.json({
    success: true,
    data: {
      customerID: auth.cleancloudCustomerId,
      hasProfile: auth.cleancloudCustomerId !== null,
    },
  });
}
