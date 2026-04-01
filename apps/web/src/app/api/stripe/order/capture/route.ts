import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";
import { authenticateRequest, isErrorResponse } from "@/lib/auth/middleware";

const captureSchema = z.object({
  paymentIntentId: z.string().min(1),
  finalAmountCents: z.number().int().positive(),
});

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (isErrorResponse(auth)) return auth;

  try {
    const body = await request.json();
    const parsed = captureSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      );
    }

    const pi = await getStripe().paymentIntents.retrieve(
      parsed.data.paymentIntentId
    );

    if (pi.metadata.authUserId !== auth.uid) {
      return NextResponse.json(
        { success: false, error: "Not authorized for this payment" },
        { status: 403 }
      );
    }

    const captured = await getStripe().paymentIntents.capture(
      parsed.data.paymentIntentId,
      { amount_to_capture: parsed.data.finalAmountCents }
    );

    return NextResponse.json({
      success: true,
      data: {
        paymentIntentId: captured.id,
        status: captured.status,
        amountCaptured: captured.amount_received,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to capture payment";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
