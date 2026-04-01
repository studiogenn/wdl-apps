import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  customersCreate: vi.fn(),
  checkoutSessionsCreate: vi.fn(),
  dbQueryCustomersFindFirst: vi.fn(),
  dbInsertValues: vi.fn().mockResolvedValue(undefined),
  dbInsert: vi.fn(),
  authenticateRequest: vi.fn(),
}));

mocks.dbInsert.mockReturnValue({ values: mocks.dbInsertValues });

vi.mock("@/lib/stripe", () => ({
  getStripe: () => ({
    customers: { create: mocks.customersCreate },
    checkout: { sessions: { create: mocks.checkoutSessionsCreate } },
  }),
}));

vi.mock("@/lib/db", () => ({
  getDb: () => ({
    query: { customers: { findFirst: mocks.dbQueryCustomersFindFirst } },
    insert: mocks.dbInsert,
  }),
  schema: { customers: "customers_table" },
}));

vi.mock("@/lib/auth/middleware", () => ({
  authenticateRequest: mocks.authenticateRequest,
  isErrorResponse: (r: unknown) =>
    r !== null && typeof r === "object" && "status" in (r as Record<string, unknown>),
}));

import { POST } from "./route";

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validBody = {
  priceId: "price_abc123",
  successUrl: "http://localhost/success",
  cancelUrl: "http://localhost/cancel",
};

const authUser = { uid: "user_1", phone: "+15551234567", cleancloudCustomerId: null };

describe("POST /api/stripe/checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.dbInsert.mockReturnValue({ values: mocks.dbInsertValues });
    mocks.authenticateRequest.mockResolvedValue(authUser);
  });

  it("returns 401 when not authenticated", async () => {
    const { NextResponse } = await import("next/server");
    mocks.authenticateRequest.mockResolvedValue(
      NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    );
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(401);
  });

  it("returns 400 for missing priceId", async () => {
    const res = await POST(
      makeRequest({ successUrl: "http://x.com/s", cancelUrl: "http://x.com/c" })
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid successUrl", async () => {
    const res = await POST(
      makeRequest({ priceId: "price_x", successUrl: "not-a-url", cancelUrl: "http://x.com/c" })
    );
    expect(res.status).toBe(400);
  });

  it("reuses existing Stripe customer", async () => {
    mocks.dbQueryCustomersFindFirst.mockResolvedValue({
      id: "cust_db_1",
      stripeCustomerId: "cus_existing",
    });
    mocks.checkoutSessionsCreate.mockResolvedValue({ url: "https://checkout.stripe.com/s1" });

    const res = await POST(makeRequest(validBody));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data.url).toBe("https://checkout.stripe.com/s1");
    expect(mocks.customersCreate).not.toHaveBeenCalled();
    expect(mocks.checkoutSessionsCreate).toHaveBeenCalledWith({
      customer: "cus_existing",
      mode: "subscription",
      line_items: [{ price: "price_abc123", quantity: 1 }],
      success_url: "http://localhost/success",
      cancel_url: "http://localhost/cancel",
    });
  });

  it("creates new Stripe customer when not in DB", async () => {
    mocks.dbQueryCustomersFindFirst.mockResolvedValue(undefined);
    mocks.customersCreate.mockResolvedValue({ id: "cus_new" });
    mocks.checkoutSessionsCreate.mockResolvedValue({ url: "https://checkout.stripe.com/s2" });

    const res = await POST(makeRequest(validBody));
    const json = await res.json();

    expect(json.success).toBe(true);
    expect(mocks.customersCreate).toHaveBeenCalledWith({
      metadata: { authUserId: "user_1" },
      phone: "+15551234567",
    });
    expect(mocks.dbInsert).toHaveBeenCalled();
  });

  it("omits phone when undefined", async () => {
    mocks.authenticateRequest.mockResolvedValue({ uid: "user_2", phone: undefined, cleancloudCustomerId: null });
    mocks.dbQueryCustomersFindFirst.mockResolvedValue(undefined);
    mocks.customersCreate.mockResolvedValue({ id: "cus_no_phone" });
    mocks.checkoutSessionsCreate.mockResolvedValue({ url: "https://checkout.stripe.com/s3" });

    await POST(makeRequest(validBody));
    expect(mocks.customersCreate).toHaveBeenCalledWith({ metadata: { authUserId: "user_2" } });
  });

  it("returns 500 when Stripe throws", async () => {
    mocks.dbQueryCustomersFindFirst.mockResolvedValue({ id: "c", stripeCustomerId: "cus_x" });
    mocks.checkoutSessionsCreate.mockRejectedValue(new Error("Stripe is down"));

    const res = await POST(makeRequest(validBody));
    const json = await res.json();
    expect(res.status).toBe(500);
    expect(json.error).toBe("Stripe is down");
  });
});
