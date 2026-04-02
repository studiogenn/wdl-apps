import { NextResponse } from "next/server";
import { getsql } from "@/lib/db/connection";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  const checks: Record<string, string> = {};

  const envKeys = ["DATABASE_URL", "BETTER_AUTH_SECRET", "BETTER_AUTH_URL", "BEHEMOUTH_API_URL", "CLEANCLOUD_PROXY_API_KEY"];
  for (const key of envKeys) {
    const val = process.env[key];
    if (!val) {
      checks[key] = "MISSING";
    } else if (key === "BETTER_AUTH_URL") {
      checks[key] = val;
    } else {
      checks[key] = val.includes("\n") ? "set (HAS_NEWLINE)" : "set";
    }
  }

  try {
    const sql = getsql();
    const result = await sql`SELECT 1 as ok`;
    checks.db_connection = result[0]?.ok === 1 ? "OK" : "UNEXPECTED";
  } catch (e: unknown) {
    checks.db_connection = `FAIL: ${e instanceof Error ? e.message : String(e)}`;
  }

  try {
    const ts = Date.now();
    const result = await auth.api.signUpEmail({
      body: {
        name: "Debug Test",
        email: `debug-test-${ts}@example.com`,
        password: "testpassword123",
      },
      headers: request.headers,
      asResponse: false,
    });
    checks.signup_test = result?.user?.id ? `OK: ${result.user.id}` : `UNEXPECTED: ${JSON.stringify(result)}`;
  } catch (e: unknown) {
    checks.signup_test = `FAIL: ${e instanceof Error ? e.stack ?? e.message : String(e)}`;
  }

  return NextResponse.json(checks);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await auth.api.signUpEmail({
      body,
      headers: request.headers,
      asResponse: true,
    });
    return result;
  } catch (e: unknown) {
    return NextResponse.json({
      error: e instanceof Error ? e.stack ?? e.message : String(e),
      headers: Object.fromEntries(request.headers.entries()),
    }, { status: 500 });
  }
}
