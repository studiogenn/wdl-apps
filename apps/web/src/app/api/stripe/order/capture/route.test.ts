import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  paymentIntentsRetrieve: vi.fn(),
  paymentIntentsCapture: vi.fn(),
  authenticateRequest: vi.fn(),
}));

vi.mock("@/lib/stripe", () => ({
  getStripe: () => ({
    paymentIntents: {
      retrieve: mocks.paymentIntentsRetrieve,
      capture: mocks.paymentIntentsCapture,
    },
  }),
}));

vi.mock("@/lib/auth/middleware", () => ({
  authenticateRequest: mocks.authenticateRequest,
  isErrorResponse: (r: unknown) =>
    r !== null && typeof r === "object" && "status" in (r as Record<string, unknown>),
}));

import { POST } from "./route";

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/stripe/order/capture", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const authUser = { uid: "user_1", phone: undefined, cleancloudCustomerId: null };

describe("POST /api/stripe/order/capture", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.authenticateRequest.mockResolvedValue(authUser);
  });

  it("returns 401 when not authenticated", async () => {
    const { NextResponse } = await import("next/server");
    mocks.authenticateRequest.mockResolvedValue(
      NextResponse.json({ success: false }, { status: 401 })
    );
    const res = await POST(makeRequest({ paymentIntentId: "pi_1", finalAmountCents: 4500 }));
    expect(res.status).toBe(401);
  });

  it("returns 400 for missing fields", async () => {
    expect((await POST(makeRequest({ finalAmountCents: 100 }))).status).toBe(400);
    expect((await POST(makeRequest({ paymentIntentId: "pi_1" }))).status).toBe(400);
  });

  it("returns 403 when PaymentIntent belongs to different user", async () => {
    mocks.paymentIntentsRetrieve.mockResolvedValue({
      id: "pi_1", metadata: { authUserId: "user_other" },
    });
    const res = await POST(makeRequest({ paymentIntentId: "pi_1", finalAmountCents: 4500 }));
    expect(res.status).toBe(403);
  });

  it("captures with final amount", async () => {
    mocks.paymentIntentsRetrieve.mockResolvedValue({
      id: "pi_1", metadata: { authUserId: "user_1" },
    });
    mocks.paymentIntentsCapture.mockResolvedValue({
      id: "pi_1", status: "succeeded", amount_received: 4500,
    });

    const res = await POST(makeRequest({ paymentIntentId: "pi_1", finalAmountCents: 4500 }));
    const json = await res.json();
    expect(json.data.status).toBe("succeeded");
    expect(json.data.amountCaptured).toBe(4500);
    expect(mocks.paymentIntentsCapture).toHaveBeenCalledWith("pi_1", { amount_to_capture: 4500 });
  });

  it("returns 500 when capture fails", async () => {
    mocks.paymentIntentsRetrieve.mockResolvedValue({
      id: "pi_1", metadata: { authUserId: "user_1" },
    });
    mocks.paymentIntentsCapture.mockRejectedValue(new Error("Already captured"));
    const res = await POST(makeRequest({ paymentIntentId: "pi_1", finalAmountCents: 4500 }));
    expect(res.status).toBe(500);
  });
});
