"use client";

import { useState, useCallback } from "react";
import { trackEvent, TRACKING_EVENTS } from "@/lib/tracking";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/shared";
import { type MembershipTier } from "@/lib/stripe-config";
import { type ScheduleData } from "./ScheduleStep";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
);

const STRIPE_APPEARANCE = {
  theme: "stripe" as const,
  variables: {
    colorPrimary: "#1B3A5C",
    borderRadius: "12px",
    fontFamily: "DM Sans, system-ui, sans-serif",
  },
};

const TIER_LABELS: Record<MembershipTier, { name: string; price: number; pickups: number; lbs: number }> = {
  weekly: { name: "Weekly", price: 139, pickups: 4, lbs: 80 },
  family: { name: "Family", price: 189, pickups: 4, lbs: 120 },
};

function MembershipPaymentForm({
  tier,
  scheduleData,
  onSuccess,
  onBack,
}: {
  readonly tier: MembershipTier;
  readonly scheduleData: ScheduleData | null;
  readonly onSuccess: () => void;
  readonly onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tierInfo = TIER_LABELS[tier];

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!stripe || !elements) return;

      setSubmitting(true);
      setProcessing(true);
      setError(null);
      trackEvent(TRACKING_EVENTS.MEMBERSHIP_PAYMENT_SUBMITTED, { tier });

      const result = await stripe.confirmSetup({
        elements,
        redirect: "if_required",
      });

      if (result.error) {
        setError(result.error.message ?? "Payment failed. Please try again.");
        setSubmitting(false);
        setProcessing(false);
        return;
      }

      const paymentMethodId = typeof result.setupIntent.payment_method === "string"
        ? result.setupIntent.payment_method
        : result.setupIntent.payment_method?.id;

      if (!paymentMethodId) {
        setError("Unable to save payment method. Please try again.");
        setSubmitting(false);
        return;
      }

      // Fire subscription activation — don't await it.
      // Card is saved on the Stripe customer; this will succeed.
      fetch("/api/membership/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "activate",
          tier,
          paymentMethodId,
          ...(scheduleData?.pickupDate && {
            pickupDate: scheduleData.pickupDate,
            pickupSlot: scheduleData.pickupSlot,
            pickupAddress: scheduleData.address,
            pickupRouteID: scheduleData.routeID,
          }),
        }),
      });

      onSuccess();
    },
    [stripe, elements, tier, onSuccess],
  );

  if (processing) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-navy/10 border-t-primary" />
        <p className="font-heading-medium text-navy text-lg uppercase">Setting up your membership...</p>
        <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/40">Securing your payment — just a moment.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order summary */}
      <div className="rounded-xl border border-navy/10 bg-white px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-[family-name:var(--font-poppins)] text-sm font-body-medium text-navy">
              {tierInfo.name} Membership
            </p>
            <p className="font-[family-name:var(--font-poppins)] text-xs text-navy/50">
              {tierInfo.pickups} pickups/mo · Up to {tierInfo.lbs} lbs included
            </p>
          </div>
          <p className="font-body-bold text-navy text-xl">
            ${tierInfo.price}<span className="text-sm font-normal text-navy/50">/mo</span>
          </p>
        </div>
        <div className="mt-3 border-t border-navy/10 pt-3">
          <div className="flex justify-between font-[family-name:var(--font-poppins)] text-xs text-navy/50">
            <span>Overage rate</span>
            <span>$1.95/lb</span>
          </div>
          <div className="mt-1 flex justify-between font-[family-name:var(--font-poppins)] text-sm font-body-medium text-navy">
            <span>Due today</span>
            <span>${tierInfo.price}.00</span>
          </div>
        </div>
      </div>

      <PaymentElement
        options={{
          wallets: {
            applePay: "auto",
            googlePay: "auto",
          },
          fields: {
            billingDetails: {
              address: "auto",
            },
          },
        }}
      />

      {error && (
        <p className="font-[family-name:var(--font-poppins)] text-sm text-red-600 text-center">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={submitting || !stripe}
        className="w-full"
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Securing payment...
          </span>
        ) : (
          `Start Membership — $${tierInfo.price}/mo`
        )}
      </Button>

      <p className="text-center font-[family-name:var(--font-poppins)] text-[11px] text-navy/30">
        Cancel anytime · No hidden fees · Secure payment via Stripe
      </p>

      <button
        type="button"
        onClick={onBack}
        disabled={submitting}
        className="w-full py-2 text-center font-[family-name:var(--font-poppins)] text-[13px] text-navy/40 hover:text-primary disabled:opacity-50"
      >
        ← Back
      </button>
    </form>
  );
}

interface PaymentStepProps {
  readonly tier: MembershipTier;
  readonly profile: import("./JoinFunnel").CustomerProfile | null;
  readonly clientSecret: string | null;
  readonly fetchError: string | null;
  readonly scheduleData: ScheduleData | null;
  readonly onSuccess: () => void;
  readonly onBack: () => void;
}

export function PaymentStep({ tier, profile, clientSecret, fetchError, scheduleData, onSuccess, onBack }: PaymentStepProps) {
  const hasSavedPayment = profile?.isReturning && profile.hasSavedPayment;

  return (
    <div className="mx-auto max-w-lg px-5 py-10">
      <h2 className="font-heading-medium text-navy text-2xl uppercase text-center mb-2">
        Complete your membership
      </h2>
      <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/50 text-center mb-8">
        {hasSavedPayment
          ? "We've upgraded our billing system — just need your card one more time."
          : "Secure payment — your card is never stored on our servers."}
      </p>

      {fetchError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
          <p className="font-[family-name:var(--font-poppins)] text-sm text-red-600 mb-3">
            {fetchError}
          </p>
          <Button variant="outline" onClick={onBack}>
            Go Back
          </Button>
        </div>
      )}

      {!clientSecret && !fetchError && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-navy/5" />
          ))}
        </div>
      )}

      {clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret, appearance: STRIPE_APPEARANCE }}
        >
          <MembershipPaymentForm
            tier={tier}
            scheduleData={scheduleData}
            onSuccess={onSuccess}
            onBack={onBack}
          />
        </Elements>
      )}
    </div>
  );
}
