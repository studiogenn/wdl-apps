import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  billingPortalSessionsCreate: vi.fn(),
  dbQueryCustomersFindFirst: vi.fn(),
  authenticateRequest: vi.fn(),
}));

vi.mock("@/lib/stripe", () => ({
  getStripe: () => ({
    billingPortal: { sessions: { create: mocks.billingPortalSessionsCreate } },
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

vi.mock("drizzle-orm", () => ({
  eq: (col: string, val: string) => ({ col, val }),
}));

import { POST } from "./route";

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/stripe/portal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const authUser = { uid: "user_1", phone: undefined, cleancloudCustomerId: null };

describe("POST /api/stripe/portal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.authenticateRequest.mockResolvedValue(authUser);
  });

  it("returns 401 when not authenticated", async () => {
    const { NextResponse } = await import("next/server");
    mocks.authenticateRequest.mockResolvedValue(
      NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    );
    const res = await POST(makeRequest({ returnUrl: "http://localhost/account" }));
    expect(res.status).toBe(401);
  });

  it("returns 400 for missing returnUrl", async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
  });

  it("returns 404 when customer not found", async () => {
    mocks.dbQueryCustomersFindFirst.mockResolvedValue(undefined);
    const res = await POST(makeRequest({ returnUrl: "http://localhost/account" }));
    expect(res.status).toBe(404);
  });

  it("creates billing portal session", async () => {
    mocks.dbQueryCustomersFindFirst.mockResolvedValue({ id: "c1", stripeCustomerId: "cus_portal" });
    mocks.billingPortalSessionsCreate.mockResolvedValue({ url: "https://billing.stripe.com/s1" });

    const res = await POST(makeRequest({ returnUrl: "http://localhost/account" }));
    const json = await res.json();
    expect(json.data.url).toBe("https://billing.stripe.com/s1");
    expect(mocks.billingPortalSessionsCreate).toHaveBeenCalledWith({
      customer: "cus_portal",
      return_url: "http://localhost/account",
    });
  });

  it("returns 500 when Stripe throws", async () => {
    mocks.dbQueryCustomersFindFirst.mockResolvedValue({ id: "c1", stripeCustomerId: "cus_x" });
    mocks.billingPortalSessionsCreate.mockRejectedValue(new Error("Portal error"));
    const res = await POST(makeRequest({ returnUrl: "http://localhost/account" }));
    expect(res.status).toBe(500);
  });
});
