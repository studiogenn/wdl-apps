"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared";

type Subscription = {
  readonly id: string;
  readonly status: string;
  readonly priceId: string;
  readonly currentPeriodEnd: string;
  readonly cancelAtPeriodEnd: boolean;
};

type Invoice = {
  readonly id: string;
  readonly date: string;
  readonly amountDue: number;
  readonly amountPaid: number;
  readonly currency: string;
  readonly status: string;
  readonly invoiceUrl: string | null;
  readonly invoicePdf: string | null;
};

type BillingData = {
  readonly hasStripeAccount: boolean;
  readonly subscription: Subscription | null;
  readonly invoices: readonly Invoice[];
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-green-100 text-green-700" },
  past_due: { label: "Past Due", color: "bg-red-100 text-red-700" },
  canceled: { label: "Canceled", color: "bg-navy/10 text-navy/60" },
  trialing: { label: "Trial", color: "bg-blue-100 text-blue-700" },
  unpaid: { label: "Unpaid", color: "bg-red-100 text-red-700" },
};

const PLANS = [
  { tier: "weekly", name: "Weekly", price: "$139", lbs: "80 lbs", priceId_live: "price_1TI23A3uBUfrZCbdZYksg6nE", priceId_test: "price_1TI23A3uBUfrZCbdZYksg6nE" },
  { tier: "family", name: "Family", price: "$189", lbs: "120 lbs", priceId_live: "price_1TI23A3uBUfrZCbddxcUgBe0", priceId_test: "price_1TI23A3uBUfrZCbddxcUgBe0" },
] as const;

function formatCents(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getCurrentPlanName(priceId: string): string {
  const match = PLANS.find((p) => p.priceId_live === priceId || p.priceId_test === priceId);
  return match ? `${match.name} Plan` : "Monthly Subscription";
}

export function BillingSection() {
  const router = useRouter();
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPlanPicker, setShowPlanPicker] = useState(false);
  const [confirmTier, setConfirmTier] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBilling() {
      try {
        const res = await fetch("/api/stripe/billing");
        const data = await res.json();
        if (data.success) setBilling(data.data);
      } catch {
        // Billing unavailable
      } finally {
        setLoading(false);
      }
    }
    fetchBilling();
  }, []);

  const handleSubscribe = useCallback(() => {
    router.push("/subscriptions");
  }, [router]);

  const handleChangePlan = useCallback(async (tier: string) => {
    setActionLoading(`change-${tier}`);
    setError(null);
    try {
      const res = await fetch("/api/stripe/change-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (data.success) {
        // Re-fetch billing to reflect the change
        const billingRes = await fetch("/api/stripe/billing");
        const billingData = await billingRes.json();
        if (billingData.success) setBilling(billingData.data);
        setShowPlanPicker(false);
      } else {
        setError(data.error ?? "Unable to change plan.");
      }
    } catch {
      setError("Something went wrong.");
    }
    setActionLoading(null);
  }, []);

  const handleCancel = useCallback(async () => {
    setActionLoading("cancel");
    setError(null);
    try {
      const res = await fetch("/api/stripe/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        setBilling((prev) =>
          prev && prev.subscription
            ? { ...prev, subscription: { ...prev.subscription, cancelAtPeriodEnd: true } }
            : prev
        );
      } else {
        setError(data.error ?? "Unable to cancel.");
      }
    } catch {
      setError("Something went wrong.");
    }
    setActionLoading(null);
  }, []);

  if (loading) {
    return (
      <div className="mt-6">
        <h2 className="mb-4 text-lg font-heading-medium text-navy">Billing</h2>
        <div className="rounded-xl border border-navy/10 bg-white p-6">
          <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/40">
            Loading billing info...
          </p>
        </div>
      </div>
    );
  }

  if (!billing) return null;

  const { subscription, invoices } = billing;
  const statusInfo = subscription
    ? STATUS_LABELS[subscription.status] ?? { label: subscription.status, color: "bg-navy/10 text-navy/60" }
    : null;

  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-lg font-heading-medium text-navy">Billing</h2>

      {/* Plan */}
      <div className="rounded-xl border border-navy/10 bg-white p-6">
        {subscription ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-[family-name:var(--font-poppins)] text-sm font-body-medium text-navy">
                    {getCurrentPlanName(subscription.priceId)}
                  </p>
                  <span className={`rounded-full px-2.5 py-0.5 font-[family-name:var(--font-poppins)] text-xs font-body-medium ${statusInfo?.color}`}>
                    {statusInfo?.label}
                  </span>
                </div>
                {subscription.cancelAtPeriodEnd ? (
                  <p className="mt-1 font-[family-name:var(--font-poppins)] text-xs text-amber-600">
                    Cancels {formatDate(subscription.currentPeriodEnd)}
                  </p>
                ) : (
                  <p className="mt-1 font-[family-name:var(--font-poppins)] text-xs text-navy/50">
                    Renews {formatDate(subscription.currentPeriodEnd)}
                  </p>
                )}
              </div>
              {subscription.status === "active" && !subscription.cancelAtPeriodEnd && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => { setShowPlanPicker(!showPlanPicker); setConfirmTier(null); }}
                  >
                    {showPlanPicker ? "Close" : "Change Plan"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={actionLoading === "cancel"}
                  >
                    {actionLoading === "cancel" ? "Canceling..." : "Cancel Plan"}
                  </Button>
                </div>
              )}
            </div>

            {/* Plan picker */}
            {showPlanPicker && subscription.status === "active" && (
              <div className="mt-4 border-t border-navy/10 pt-4">
                {confirmTier ? (() => {
                  const target = PLANS.find((p) => p.tier === confirmTier);
                  const current = PLANS.find((p) => p.priceId_live === subscription.priceId || p.priceId_test === subscription.priceId);
                  const isUpgrade = target && current && parseInt(target.price.replace("$", "")) > parseInt(current.price.replace("$", ""));
                  return (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                      <p className="font-[family-name:var(--font-poppins)] text-sm font-body-medium text-navy mb-2">
                        Switch to {target?.name} Plan ({target?.price}/mo)?
                      </p>
                      <p className="font-[family-name:var(--font-poppins)] text-xs text-navy/60 mb-4">
                        {isUpgrade
                          ? "You'll be charged a prorated amount for the rest of this billing period. Your next invoice will reflect the new plan price."
                          : "You'll receive a prorated credit on your next invoice for the remaining days on your current plan."}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => { handleChangePlan(confirmTier); setConfirmTier(null); }}
                          disabled={actionLoading?.startsWith("change")}
                        >
                          {actionLoading?.startsWith("change") ? "Switching..." : `Yes, switch to ${target?.name}`}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setConfirmTier(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  );
                })() : (
                  <div className="grid grid-cols-2 gap-3">
                    {PLANS.map((plan) => {
                      const isCurrent = plan.priceId_live === subscription.priceId || plan.priceId_test === subscription.priceId;
                      return (
                        <button
                          key={plan.tier}
                          disabled={isCurrent || actionLoading?.startsWith("change")}
                          onClick={() => setConfirmTier(plan.tier)}
                          className={`rounded-xl border p-4 text-left transition-colors ${
                            isCurrent
                              ? "border-primary bg-primary/5 cursor-default"
                              : "border-navy/10 hover:border-primary/40 hover:bg-primary/[0.02]"
                          }`}
                        >
                          <p className="font-[family-name:var(--font-poppins)] text-sm font-body-medium text-navy">
                            {plan.name}
                          </p>
                          <p className="font-[family-name:var(--font-poppins)] text-lg font-body-bold text-navy">
                            {plan.price}<span className="text-xs font-normal text-navy/50">/mo</span>
                          </p>
                          <p className="font-[family-name:var(--font-poppins)] text-xs text-navy/50">
                            4 pickups · {plan.lbs} included
                          </p>
                          {isCurrent ? (
                            <p className="mt-2 font-[family-name:var(--font-poppins)] text-xs font-body-medium text-primary">
                              Current plan
                            </p>
                          ) : (
                            <p className="mt-2 font-[family-name:var(--font-poppins)] text-xs text-primary">
                              Switch to this plan
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-between">
            <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/60">
              No active subscription.
            </p>
            <Button
              size="sm"
              onClick={handleSubscribe}
              disabled={actionLoading === "subscribe"}
            >
              {actionLoading === "subscribe" ? "Loading..." : "Subscribe"}
            </Button>
          </div>
        )}
      </div>

      {/* Invoices */}
      {invoices.length > 0 && (
        <div className="rounded-xl border border-navy/10 bg-white p-6">
          <p className="mb-3 font-[family-name:var(--font-poppins)] text-sm font-body-medium text-navy">
            Recent Invoices
          </p>
          <div className="space-y-2">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between rounded-lg bg-navy/[0.02] px-4 py-3"
              >
                <div>
                  <p className="font-[family-name:var(--font-poppins)] text-sm text-navy">
                    {formatCents(inv.amountDue, inv.currency)}
                  </p>
                  <p className="font-[family-name:var(--font-poppins)] text-xs text-navy/50">
                    {formatDate(inv.date)} — {inv.status}
                  </p>
                </div>
                <div className="flex gap-2">
                  {inv.invoiceUrl && (
                    <a
                      href={inv.invoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-[family-name:var(--font-poppins)] text-xs text-primary underline underline-offset-2 hover:text-primary-hover"
                    >
                      View
                    </a>
                  )}
                  {inv.invoicePdf && (
                    <a
                      href={inv.invoicePdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-[family-name:var(--font-poppins)] text-xs text-navy/50 underline underline-offset-2 hover:text-primary"
                    >
                      PDF
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="font-[family-name:var(--font-poppins)] text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
