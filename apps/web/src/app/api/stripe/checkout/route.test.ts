import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  customersCreate: vi.fn(),
  checkoutSessionsCreate: vi.fn(),
  dbQueryCustomersFindFirst: vi.fn(),
  dbInsertValues: vi.fn().mockResolvedValue(undefined),
  dbInsert: vi.fn(),
  authGetSession: vi.fn(),
  stripeIds: {
    subscription: {
      productId: "prod_test",
      basePriceId: "price_base_test",
      overagePriceId: "price_overage_test",
      meterId: "meter_test",
      meterEventName: "wdl_overage_lbs",
    },
    singleOrder: { productId: "prod_order_test" },
  },
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

vi.mock("@/lib/auth", () => ({
  auth: {
    api: { getSession: mocks.authGetSession },
  },
}));

vi.mock("@/lib/stripe-config", () => ({
  STRIPE_IDS: mocks.stripeIds,
}));

import { POST } from "./route";

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validSubBody = {
  mode: "subscription" as const,
  successUrl: "http://localhost/success",
  cancelUrl: "http://localhost/cancel",
  bags: 1,
  frequency: "weekly" as const,
};

const validPaygBody = {
  mode: "payment" as const,
  successUrl: "http://localhost/success",
  cancelUrl: "http://localhost/cancel",
  amountCents: 4774,
  description: "One-time laundry order (~15 lbs est.)",
};

const sessionUser = { id: "user_1", phone: "+15551234567" };

describe("POST /api/stripe/checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.dbInsert.mockReturnValue({ values: mocks.dbInsertValues });
    mocks.authGetSession.mockResolvedValue({ user: sessionUser });
    mocks.stripeIds.subscription.basePriceId = "price_base_test";
    mocks.stripeIds.subscription.overagePriceId = "price_overage_test";
  });

  it("returns 503 when subscription price IDs not configured", async () => {
    mocks.stripeIds.subscription.basePriceId = "";
    const res = await POST(makeRequest(validSubBody));
    expect(res.status).toBe(503);
  });

  it("returns 400 for invalid request body", async () => {
    const res = await POST(
      makeRequest({ mode: "subscription", successUrl: "not-a-url", cancelUrl: "http://x.com/c", bags: 1, frequency: "weekly" })
    );
    expect(res.status).toBe(400);
  });

  it("creates subscription checkout with correct quantity (bags * pickups)", async () => {
    mocks.dbQueryCustomersFindFirst.mockResolvedValue({
      id: "cust_db_1",
      stripeCustomerId: "cus_existing",
    });
    mocks.checkoutSessionsCreate.mockResolvedValue({ url: "https://checkout.stripe.com/s1" });

    const res = await POST(makeRequest({ ...validSubBody, bags: 2, frequency: "weekly" }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data.url).toBe("https://checkout.stripe.com/s1");
    expect(mocks.customersCreate).not.toHaveBeenCalled();
    expect(mocks.checkoutSessionsCreate).toHaveBeenCalledWith({
      customer: "cus_existing",
      mode: "subscription",
      line_items: [
        { price: "price_base_test", quantity: 8 },
        { price: "price_overage_test" },
      ],
      subscription_data: {
        metadata: { bags: "2", frequency: "weekly" },
      },
      success_url: "http://localhost/success",
      cancel_url: "http://localhost/cancel",
    });
  });

  it("uses 2 pickups for biweekly frequency", async () => {
    mocks.dbQueryCustomersFindFirst.mockResolvedValue({ id: "c", stripeCustomerId: "cus_x" });
    mocks.checkoutSessionsCreate.mockResolvedValue({ url: "https://checkout.stripe.com/s3" });

    await POST(makeRequest({ ...validSubBody, bags: 1, frequency: "biweekly" }));

    expect(mocks.checkoutSessionsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [
          { price: "price_base_test", quantity: 2 },
          { price: "price_overage_test" },
        ],
      }),
    );
  });

  it("creates new Stripe customer when not in DB", async () => {
    mocks.dbQueryCustomersFindFirst.mockResolvedValue(undefined);
    mocks.customersCreate.mockResolvedValue({ id: "cus_new" });
    mocks.checkoutSessionsCreate.mockResolvedValue({ url: "https://checkout.stripe.com/s2" });

    const res = await POST(makeRequest(validSubBody));
    const json = await res.json();

    expect(json.success).toBe(true);
    expect(mocks.customersCreate).toHaveBeenCalledWith({
      metadata: { authUserId: "user_1" },
      phone: "+15551234567",
    });
    expect(mocks.dbInsert).toHaveBeenCalled();
  });

  it("works without auth (guest checkout)", async () => {
    mocks.authGetSession.mockResolvedValue(null);
    mocks.checkoutSessionsCreate.mockResolvedValue({ url: "https://checkout.stripe.com/guest" });

    const res = await POST(makeRequest(validSubBody));
    const json = await res.json();

    expect(json.success).toBe(true);
    expect(mocks.customersCreate).not.toHaveBeenCalled();
    expect(mocks.dbQueryCustomersFindFirst).not.toHaveBeenCalled();
    expect(mocks.checkoutSessionsCreate).toHaveBeenCalledWith(
      expect.not.objectContaining({ customer: expect.anything() }),
    );
  });

  it("creates payment checkout for PAYG with manual capture", async () => {
    mocks.dbQueryCustomersFindFirst.mockResolvedValue({ id: "c", stripeCustomerId: "cus_x" });
    mocks.checkoutSessionsCreate.mockResolvedValue({ url: "https://checkout.stripe.com/payg" });

    const res = await POST(makeRequest(validPaygBody));
    const json = await res.json();

    expect(json.success).toBe(true);
    expect(json.data.url).toBe("https://checkout.stripe.com/payg");
    expect(mocks.checkoutSessionsCreate).toHaveBeenCalledWith({
      customer: "cus_x",
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product: "prod_order_test",
            unit_amount: 4774,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        capture_method: "manual",
        metadata: { authUserId: "user_1" },
      },
      success_url: "http://localhost/success",
      cancel_url: "http://localhost/cancel",
    });
  });

  it("returns 500 when Stripe throws", async () => {
    mocks.dbQueryCustomersFindFirst.mockResolvedValue({ id: "c", stripeCustomerId: "cus_x" });
    mocks.checkoutSessionsCreate.mockRejectedValue(new Error("Stripe is down"));

    const res = await POST(makeRequest(validSubBody));
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe("Stripe is down");
  });
});
