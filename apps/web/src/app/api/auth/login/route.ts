import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let signInResult: any;
  let signInError: unknown;
  try {
    signInResult = await auth.api.signInEmail({
      body: { email, password },
      headers: request.headers,
      asResponse: false,
      returnHeaders: true,
    });
  } catch (e) {
    signInError = e;
  }

  return NextResponse.json({
    debug: true,
    gotResult: signInResult != null,
    resultKeys: signInResult ? Object.keys(signInResult) : null,
    resultStr: signInResult
      ? JSON.stringify(signInResult, (_k: string, v: unknown) =>
          v instanceof Headers ? "[Headers]" : v
        )
      : null,
    gotError: signInError != null,
    errorMsg: signInError instanceof Error ? signInError.message : String(signInError ?? "none"),
    errorStack: signInError instanceof Error ? signInError.stack?.split("\n").slice(0, 3) : null,
  });
}
