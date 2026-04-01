import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => {
  const dbInsertOnConflict = vi.fn().mockResolvedValue(undefined);
  const dbInsertValues = vi.fn().mockReturnValue({ onConflictDoUpdate: dbInsertOnConflict });
  const dbInsert = vi.fn().mockReturnValue({ values: dbInsertValues });
  const dbUpdateSetWhere = vi.fn().mockResolvedValue(undefined);
  const dbUpdateSet = vi.fn().mockReturnValue({ where: dbUpdateSetWhere });
  const dbUpdate = vi.fn().mockReturnValue({ set: dbUpdateSet });

  return {
    constructEvent: vi.fn(),
    subscriptionsRetrieve: vi.fn(),
    paymentIntentsRetrieve: vi.fn(),
    dbQuerySubscriptionEventsFindFirst: vi.fn(),
    dbQueryCustomersFindFirst: vi.fn(),
    dbInsertOnConflict,
    dbInsertValues,
    dbInsert,
    dbUpdateSetWhere,
    dbUpdateSet,
    dbUpdate,
  };
});

vi.mock("@/lib/stripe", () => ({
  getStripe: () => ({
    webhooks: { constructEvent: mocks.constructEvent },
    subscriptions: { retrieve: mocks.subscriptionsRetrieve },
    paymentIntents: { retrieve: mocks.paymentIntentsRetrieve },
  }),
}));

vi.mock("@/lib/db", () => ({
  getDb: () => ({
    query: {
      subscriptionEvents: { findFirst: mocks.dbQuerySubscriptionEventsFindFirst },
      customers: { findFirst: mocks.dbQueryCustomersFindFirst },
    },
    insert: mocks.dbInsert,
    update: mocks.dbUpdate,
  }),
  schema: {
    subscriptionEvents: { stripeEventId: "stripe_event_id" },
    subscriptions: { stripeSubscriptionId: "stripe_subscription_id" },
    customers: { stripeCustomerId: "stripe_customer_id" },
    payments: { stripePaymentIntentId: "stripe_payment_intent_id" },
    invoices: { stripeInvoiceId: "stripe_invoice_id" },
  },
}));

vi.mock("drizzle-orm", () => ({
  eq: (col: string, val: string) => ({ col, val }),
}));

import { POST } from "./route";

function makeWebhookRequest(body: string, signature: string | null): Request {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (signature) headers["stripe-signature"] = signature;
  return new Request("http://localhost/api/stripe/webhook", {
    method: "POST",
    headers,
    body,
  });
}

function resetChains() {
  mocks.dbInsertValues.mockReturnValue({ onConflictDoUpdate: mocks.dbInsertOnConflict });
  mocks.dbInsert.mockReturnValue({ values: mocks.dbInsertValues });
  mocks.dbUpdate.mockReturnValue({ set: mocks.dbUpdateSet });
  mocks.dbUpdateSet.mockReturnValue({ where: mocks.dbUpdateSetWhere });
}

describe("POST /api/stripe/webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
    resetChains();
    mocks.dbQuerySubscriptionEventsFindFirst.mockResolvedValue(undefined);
  });

  it("returns 400 when stripe-signature header is missing", async () => {
    const res = await POST(makeWebhookRequest("{}", null));
    expect(res.status).toBe(400);
  });

  it("returns 400 when signature verification fails", async () => {
    mocks.constructEvent.mockImplementation(() => { throw new Error("bad sig"); });
    const res = await POST(makeWebhookRequest("{}", "sig_bad"));
    expect(res.status).toBe(400);
  });

  it("skips duplicate events (idempotency)", async () => {
    mocks.constructEvent.mockReturnValue({ id: "evt_dup", type: "invoice.paid", data: { object: {} } });
    mocks.dbQuerySubscriptionEventsFindFirst.mockResolvedValue({ id: "existing" });

    const res = await POST(makeWebhookRequest("{}", "sig_ok"));
    const json = await res.json();
    expect(json.data.skipped).toBe(true);
    expect(mocks.dbInsert).not.toHaveBeenCalled();
  });

  describe("checkout.session.completed (subscription)", () => {
    it("creates subscription record", async () => {
      mocks.constructEvent.mockReturnValue({
        id: "evt_1", type: "checkout.session.completed",
        data: { object: { mode: "subscription", subscription: "sub_1", customer: "cus_1" } },
      });
      mocks.subscriptionsRetrieve.mockResolvedValue({
        id: "sub_1", customer: "cus_1", status: "active", start_date: 1700000000,
        items: { data: [{ price: { id: "price_xyz" } }] },
        latest_invoice: { period_start: 1700000000, period_end: 1702600000 },
      });
      mocks.dbQueryCustomersFindFirst.mockResolvedValue({ id: "db_c1" });

      const res = await POST(makeWebhookRequest("{}", "sig_ok"));
      expect((await res.json()).success).toBe(true);
      // subscription insert + event log insert
      expect(mocks.dbInsert).toHaveBeenCalledTimes(2);
    });

    it("skips non-subscription sessions", async () => {
      mocks.constructEvent.mockReturnValue({
        id: "evt_2", type: "checkout.session.completed",
        data: { object: { mode: "setup", subscription: null, payment_intent: null } },
      });
      const res = await POST(makeWebhookRequest("{}", "sig_ok"));
      expect((await res.json()).success).toBe(true);
      // Only event log
      expect(mocks.dbInsert).toHaveBeenCalledTimes(1);
    });
  });

  describe("checkout.session.completed (payment)", () => {
    it("records payment from checkout", async () => {
      mocks.constructEvent.mockReturnValue({
        id: "evt_pay_checkout", type: "checkout.session.completed",
        data: { object: { mode: "payment", subscription: null, payment_intent: "pi_from_checkout" } },
      });
      mocks.paymentIntentsRetrieve.mockResolvedValue({
        id: "pi_from_checkout", customer: "cus_abc", amount: 5000, currency: "usd",
        status: "succeeded", description: "Order", metadata: {},
      });
      mocks.dbQueryCustomersFindFirst.mockResolvedValue({ id: "db_c2" });

      const res = await POST(makeWebhookRequest("{}", "sig_ok"));
      expect((await res.json()).success).toBe(true);
      // payment insert (with onConflict) + event log
      expect(mocks.dbInsert).toHaveBeenCalledTimes(2);
    });
  });

  describe("payment_intent.succeeded", () => {
    it("records payment", async () => {
      mocks.constructEvent.mockReturnValue({
        id: "evt_pi_ok", type: "payment_intent.succeeded",
        data: { object: { id: "pi_1", customer: "cus_1", amount: 3000, currency: "usd", status: "succeeded", description: null, metadata: {} } },
      });
      mocks.dbQueryCustomersFindFirst.mockResolvedValue({ id: "db_c1" });

      const res = await POST(makeWebhookRequest("{}", "sig_ok"));
      expect((await res.json()).success).toBe(true);
      expect(mocks.dbInsert).toHaveBeenCalledTimes(2);
    });

    it("skips when no customer on PI", async () => {
      mocks.constructEvent.mockReturnValue({
        id: "evt_pi_no_cus", type: "payment_intent.succeeded",
        data: { object: { id: "pi_2", customer: null, amount: 1000, currency: "usd", status: "succeeded" } },
      });
      const res = await POST(makeWebhookRequest("{}", "sig_ok"));
      expect((await res.json()).success).toBe(true);
      // Only event log
      expect(mocks.dbInsert).toHaveBeenCalledTimes(1);
    });
  });

  describe("charge.refunded", () => {
    it("marks payment as refunded", async () => {
      mocks.constructEvent.mockReturnValue({
        id: "evt_refund", type: "charge.refunded",
        data: { object: { payment_intent: "pi_refunded" } },
      });

      const res = await POST(makeWebhookRequest("{}", "sig_ok"));
      expect((await res.json()).success).toBe(true);
      expect(mocks.dbUpdate).toHaveBeenCalled();
      expect(mocks.dbUpdateSet).toHaveBeenCalledWith(
        expect.objectContaining({ status: "refunded" })
      );
    });
  });

  describe("invoice.paid", () => {
    it("records invoice and updates subscription period", async () => {
      mocks.constructEvent.mockReturnValue({
        id: "evt_inv_paid", type: "invoice.paid",
        data: {
          object: {
            id: "inv_1", customer: "cus_1",
            parent: { subscription_details: { subscription: "sub_100" } },
            amount_due: 10000, amount_paid: 10000, currency: "usd",
            status: "paid", hosted_invoice_url: null, invoice_pdf: null,
            period_start: 1700000000, period_end: 1702600000,
          },
        },
      });
      mocks.dbQueryCustomersFindFirst.mockResolvedValue({ id: "db_c1" });
      mocks.subscriptionsRetrieve.mockResolvedValue({ id: "sub_100", status: "active" });

      const res = await POST(makeWebhookRequest("{}", "sig_ok"));
      expect((await res.json()).success).toBe(true);
      // invoice insert + subscription update + event log
      expect(mocks.dbInsert).toHaveBeenCalledTimes(2);
      expect(mocks.dbUpdate).toHaveBeenCalled();
    });

    it("skips when no customer on invoice", async () => {
      mocks.constructEvent.mockReturnValue({
        id: "evt_inv_no_cus", type: "invoice.paid",
        data: { object: { id: "inv_2", customer: null, amount_due: 100, amount_paid: 100, currency: "usd", status: "paid" } },
      });
      const res = await POST(makeWebhookRequest("{}", "sig_ok"));
      expect((await res.json()).success).toBe(true);
      // Only event log
      expect(mocks.dbInsert).toHaveBeenCalledTimes(1);
    });
  });

  describe("customer.subscription.updated", () => {
    it("updates status and price", async () => {
      mocks.constructEvent.mockReturnValue({
        id: "evt_upd", type: "customer.subscription.updated",
        data: { object: { id: "sub_200", status: "past_due", cancel_at_period_end: true, items: { data: [{ price: { id: "price_new" } }] } } },
      });
      await POST(makeWebhookRequest("{}", "sig_ok"));
      expect(mocks.dbUpdateSet).toHaveBeenCalledWith(
        expect.objectContaining({ status: "past_due", cancelAtPeriodEnd: 1 })
      );
    });
  });

  describe("customer.subscription.deleted", () => {
    it("marks as canceled", async () => {
      mocks.constructEvent.mockReturnValue({
        id: "evt_del", type: "customer.subscription.deleted",
        data: { object: { id: "sub_300" } },
      });
      await POST(makeWebhookRequest("{}", "sig_ok"));
      expect(mocks.dbUpdateSet).toHaveBeenCalledWith(
        expect.objectContaining({ status: "canceled" })
      );
    });
  });

  it("logs every processed event", async () => {
    mocks.constructEvent.mockReturnValue({
      id: "evt_unknown", type: "some.event", data: { object: { x: 1 } },
    });
    const res = await POST(makeWebhookRequest("{}", "sig_ok"));
    expect(res.status).toBe(200);
    expect(mocks.dbInsert).toHaveBeenCalledTimes(1);
  });

  it("returns 500 on DB error", async () => {
    mocks.constructEvent.mockReturnValue({
      id: "evt_err", type: "customer.subscription.deleted",
      data: { object: { id: "sub_err" } },
    });
    mocks.dbUpdate.mockImplementationOnce(() => { throw new Error("DB down"); });
    const res = await POST(makeWebhookRequest("{}", "sig_ok"));
    expect(res.status).toBe(500);
  });
});
