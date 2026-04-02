import { toNextJsHandler } from "better-auth/next-js";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const handler = toNextJsHandler(auth);

export async function GET(request: Request) {
  try {
    return await handler.GET(request);
  } catch (e: unknown) {
    console.error("[auth GET]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    return await handler.POST(request);
  } catch (e: unknown) {
    console.error("[auth POST]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
