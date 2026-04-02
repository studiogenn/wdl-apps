"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/shared";
import { CardUpdateModal } from "./card-update-modal";

type PaymentMethod = {
  readonly id: string;
  readonly brand: string;
  readonly last4: string;
  readonly expMonth: number;
  readonly expYear: number;
};

type Subscription = {
  readonly id: string;
  readonly status: string;
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
  readonly paymentMethod: PaymentMethod | null;
  readonly invoices: readonly Invoice[];
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-green-100 text-green-700" },
  past_due: { label: "Past Due", color: "bg-red-100 text-red-700" },
  canceled: { label: "Canceled", color: "bg-navy/10 text-navy/60" },
  trialing: { label: "Trial", color: "bg-blue-100 text-blue-700" },
  unpaid: { label: "Unpaid", color: "bg-red-100 text-red-700" },
};

const BRAND_NAMES: Record<string, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "Amex",
  discover: "Discover",
};

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

export function BillingSection() {
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCardModal, setShowCardModal] = useState(false);

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

  const handleSubscribe = useCallback(async () => {
    setActionLoading("subscribe");
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          successUrl: `${window.location.origin}/account?billing=success`,
          cancelUrl: `${window.location.origin}/account`,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.url) {
        window.location.href = data.data.url;
        return;
      }
      setError(data.error ?? "Unable to start checkout.");
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

  const handleUpdateCard = useCallback(() => {
    setShowCardModal(true);
  }, []);

  const handleCardSuccess = useCallback(async () => {
    setShowCardModal(false);
    // Re-fetch billing to show updated card
    try {
      const res = await fetch("/api/stripe/billing");
      const data = await res.json();
      if (data.success) setBilling(data.data);
    } catch {
      // Will show on next page load
    }
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

  const { subscription, paymentMethod, invoices } = billing;
  const statusInfo = subscription
    ? STATUS_LABELS[subscription.status] ?? { label: subscription.status, color: "bg-navy/10 text-navy/60" }
    : null;

  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-lg font-heading-medium text-navy">Billing</h2>

      {/* Plan */}
      <div className="rounded-xl border border-navy/10 bg-white p-6">
        {subscription ? (
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-[family-name:var(--font-poppins)] text-sm font-body-medium text-navy">
                  Monthly Subscription
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
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={actionLoading === "cancel"}
              >
                {actionLoading === "cancel" ? "Canceling..." : "Cancel Plan"}
              </Button>
            )}
          </div>
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

      {/* Payment Method */}
      <div className="rounded-xl border border-navy/10 bg-white p-6">
        <div className="flex items-center justify-between">
          {paymentMethod ? (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-navy/5 font-[family-name:var(--font-poppins)] text-xs font-body-medium text-navy/70">
                {BRAND_NAMES[paymentMethod.brand] ?? paymentMethod.brand}
              </div>
              <div>
                <p className="font-[family-name:var(--font-poppins)] text-sm font-body-medium text-navy">
                  •••• {paymentMethod.last4}
                </p>
                <p className="font-[family-name:var(--font-poppins)] text-xs text-navy/50">
                  Expires {paymentMethod.expMonth}/{paymentMethod.expYear}
                </p>
              </div>
            </div>
          ) : (
            <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/60">
              No payment method on file.
            </p>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleUpdateCard}
            disabled={actionLoading === "card"}
          >
            {actionLoading === "card"
              ? "Opening..."
              : paymentMethod
                ? "Update Card"
                : "Add Card"}
          </Button>
        </div>
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

      {showCardModal && (
        <CardUpdateModal
          onClose={() => setShowCardModal(false)}
          onSuccess={handleCardSuccess}
        />
      )}
    </div>
  );
}
