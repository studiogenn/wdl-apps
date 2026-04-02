import { NextResponse } from "next/server";

export async function GET() {
  const checks: Record<string, string> = {};

  checks.DATABASE_URL = process.env.DATABASE_URL ? "set" : "MISSING";
  checks.BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET ? "set" : "MISSING";
  checks.BETTER_AUTH_URL = process.env.BETTER_AUTH_URL ?? "MISSING";

  try {
    const { getDb } = await import("@/lib/db");
    const db = getDb();
    const result = await db.execute(new (await import("drizzle-orm")).SQL(["SELECT 1 as ok"]));
    checks.db_connection = "OK";
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
