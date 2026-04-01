import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  customersCreate: vi.fn(),
  paymentIntentsCreate: vi.fn(),
  dbQueryCustomersFindFirst: vi.fn(),
  dbInsertValues: vi.fn().mockResolvedValue(undefined),
  dbInsert: vi.fn(),
  authenticateRequest: vi.fn(),
}));

mocks.dbInsert.mockReturnValue({ values: mocks.dbInsertValues });

vi.mock("@/lib/stripe", () => ({
  getStripe: () => ({
    customers: { create: mocks.customersCreate },
    paymentIntents: { create: mocks.paymentIntentsCreate },
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
  return new Request("http://localhost/api/stripe/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const authUser = { uid: "user_1", phone: "+15551234567", cleancloudCustomerId: null };

describe("POST /api/stripe/order", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.dbInsert.mockReturnValue({ values: mocks.dbInsertValues });
    mocks.authenticateRequest.mockResolvedValue(authUser);
  });

  it("returns 401 when not authenticated", async () => {
    const { NextResponse } = await import("next/server");
    mocks.authenticateRequest.mockResolvedValue(
      NextResponse.json({ success: false }, { status: 401 })
    );
    const res = await POST(makeRequest({ amountCents: 5000 }));
    expect(res.status).toBe(401);
  });

  it("returns 400 for missing amountCents", async () => {
    expect((await POST(makeRequest({}))).status).toBe(400);
  });

  it("returns 400 for negative amount", async () => {
    expect((await POST(makeRequest({ amountCents: -100 }))).status).toBe(400);
  });

  it("returns 400 for non-integer amount", async () => {
    expect((await POST(makeRequest({ amountCents: 50.5 }))).status).toBe(400);
  });

  it("creates preauth PaymentIntent with existing customer", async () => {
    mocks.dbQueryCustomersFindFirst.mockResolvedValue({ id: "c1", stripeCustomerId: "cus_existing" });
    mocks.paymentIntentsCreate.mockResolvedValue({ id: "pi_1", client_secret: "pi_1_secret" });

    const res = await POST(makeRequest({ amountCents: 5000, description: "2 bags" }));
    const json = await res.json();

    expect(json.data.paymentIntentId).toBe("pi_1");
    expect(json.data.clientSecret).toBe("pi_1_secret");
    expect(mocks.paymentIntentsCreate).toHaveBeenCalledWith({
      amount: 5000,
      currency: "usd",
      customer: "cus_existing",
      capture_method: "manual",
      description: "2 bags",
      metadata: { authUserId: "user_1" },
    });
  });

  it("creates new Stripe customer when not in DB", async () => {
    mocks.dbQueryCustomersFindFirst.mockResolvedValue(undefined);
    mocks.customersCreate.mockResolvedValue({ id: "cus_new" });
    mocks.paymentIntentsCreate.mockResolvedValue({ id: "pi_2", client_secret: "s" });

    await POST(makeRequest({ amountCents: 3000 }));
    expect(mocks.customersCreate).toHaveBeenCalled();
    expect(mocks.paymentIntentsCreate).toHaveBeenCalledWith(
      expect.objectContaining({ customer: "cus_new", capture_method: "manual" })
    );
  });

  it("omits description when not provided", async () => {
    mocks.dbQueryCustomersFindFirst.mockResolvedValue({ id: "c1", stripeCustomerId: "cus_x" });
    mocks.paymentIntentsCreate.mockResolvedValue({ id: "pi_3", client_secret: "s" });

    await POST(makeRequest({ amountCents: 2000 }));
    expect(mocks.paymentIntentsCreate.mock.calls[0][0]).not.toHaveProperty("description");
  });

  it("returns 500 when Stripe throws", async () => {
    mocks.dbQueryCustomersFindFirst.mockResolvedValue({ id: "c1", stripeCustomerId: "cus_x" });
    mocks.paymentIntentsCreate.mockRejectedValue(new Error("Card declined"));

    const res = await POST(makeRequest({ amountCents: 5000 }));
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe("Card declined");
  });
});
