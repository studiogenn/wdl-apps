import { NextResponse } from "next/server";
import { getsql } from "@/lib/db/connection";

export async function GET() {
  const checks: Record<string, string> = {};

  const envKeys = ["DATABASE_URL", "BETTER_AUTH_SECRET", "BETTER_AUTH_URL", "BEHEMOUTH_API_URL", "CLEANCLOUD_PROXY_API_KEY"];
  for (const key of envKeys) {
    const val = process.env[key];
    if (!val) {
      checks[key] = "MISSING";
    } else if (key === "BETTER_AUTH_URL") {
      checks[key] = val.includes("\n") ? `HAS_NEWLINE: ${JSON.stringify(val)}` : val;
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
    const { auth } = await import("@/lib/auth");
    checks.auth_init = typeof auth.api === "object" ? "OK" : "FAIL: no api";
  } catch (e: unknown) {
    checks.auth_init = `FAIL: ${e instanceof Error ? e.message : String(e)}`;
  }

  return NextResponse.json(checks);
}
