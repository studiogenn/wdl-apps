import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  meterEventsCreate: vi.fn(),
  dbQueryCustomersFindFirst: vi.fn(),
  authenticateRequest: vi.fn(),
}));

vi.mock("@/lib/stripe", () => ({
  getStripe: () => ({
    billing: { meterEvents: { create: mocks.meterEventsCreate } },
  }),
}));

vi.mock("@/lib/db", () => ({
  getDb: () => ({
    query: { customers: { findFirst: mocks.dbQueryCustomersFindFirst } },
  }),
  schema: { customers: { authUserId: "auth_user_id" } },
}));

vi.mock("@/lib/auth/middleware", () => ({
  authenticateRequest: mocks.authenticateRequest,
  isErrorResponse: (r: unknown) =>
    r !== null && typeof r === "object" && "status" in (r as Record<string, unknown>),
}));

vi.mock("@/lib/stripe-config", () => ({
  STRIPE_IDS: {
    subscription: {
      productId: "prod_test",
      basePriceId: "price_base",
      overagePriceId: "price_overage",
      meterId: "meter_test",
      meterEventName: "wdl_overage_lbs",
    },
    singleOrder: { productId: "prod_order" },
  },
}));

vi.mock("drizzle-orm", () => ({
  eq: (col: string, val: string) => ({ col, val }),
}));

import { POST } from "./route";

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/stripe/usage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const authUser = { uid: "user_1", phone: undefined, cleancloudCustomerId: null };

describe("POST /api/stripe/usage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.authenticateRequest.mockResolvedValue(authUser);
  });

  it("returns 401 when not authenticated", async () => {
    const { NextResponse } = await import("next/server");
    mocks.authenticateRequest.mockResolvedValue(
      NextResponse.json({ success: false }, { status: 401 })
    );
    const res = await POST(makeRequest({ pounds: 50 }));
    expect(res.status).toBe(401);
  });

  it("returns 400 for missing pounds", async () => {
    expect((await POST(makeRequest({}))).status).toBe(400);
  });

  it("returns 400 for zero pounds", async () => {
    expect((await POST(makeRequest({ pounds: 0 }))).status).toBe(400);
  });

  it("returns 404 when customer not found", async () => {
    mocks.dbQueryCustomersFindFirst.mockResolvedValue(undefined);
    const res = await POST(makeRequest({ pounds: 50 }));
    expect(res.status).toBe(404);
  });

  it("reports meter event", async () => {
    mocks.dbQueryCustomersFindFirst.mockResolvedValue({ id: "c1", stripeCustomerId: "cus_abc" });
    mocks.meterEventsCreate.mockResolvedValue({ identifier: "evt_m1" });

    const res = await POST(makeRequest({ pounds: 75 }));
    const json = await res.json();

    expect(json.data.eventId).toBe("evt_m1");
    expect(json.data.pounds).toBe(75);
    expect(mocks.meterEventsCreate).toHaveBeenCalledWith({
      event_name: "wdl_overage_lbs",
      payload: { stripe_customer_id: "cus_abc", value: "75" },
    });
  });

  it("returns 500 when Stripe throws", async () => {
    mocks.dbQueryCustomersFindFirst.mockResolvedValue({ id: "c1", stripeCustomerId: "cus_abc" });
    mocks.meterEventsCreate.mockRejectedValue(new Error("Meter error"));
    const res = await POST(makeRequest({ pounds: 50 }));
    expect(res.status).toBe(500);
  });
});
