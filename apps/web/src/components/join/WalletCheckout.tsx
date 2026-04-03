"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  ExpressCheckoutElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import type {
  StripeExpressCheckoutElementConfirmEvent,
  StripeExpressCheckoutElementClickEvent,
  StripeExpressCheckoutElementReadyEvent,
} from "@stripe/stripe-js";
import { type MembershipTier } from "@/lib/stripe-config";
import { trackEvent, TRACKING_EVENTS } from "@/lib/tracking";

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

function WalletCheckoutInner({
  tier,
  onReady,
  onSuccess,
}: {
  readonly tier: MembershipTier;
  readonly onReady: (available: boolean) => void;
  readonly onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReady = useCallback(
    (event: StripeExpressCheckoutElementReadyEvent) => {
      const available = event.availablePaymentMethods != null;
      onReady(available);
    },
    [onReady],
  );

  const handleClick = useCallback(
    (event: StripeExpressCheckoutElementClickEvent) => {
      event.resolve({
        emailRequired: true,
        phoneNumberRequired: true,
        billingAddressRequired: true,
      });
    },
    [],
  );

  const handleConfirm = useCallback(
    async (event: StripeExpressCheckoutElementConfirmEvent) => {
      if (!stripe || !elements) return;

      setProcessing(true);
      setError(null);

      trackEvent(TRACKING_EVENTS.MEMBERSHIP_PAYMENT_SUBMITTED, {
        tier,
        method: "wallet",
      });

      // Submit elements + confirm the SetupIntent
      const { error: submitError } = await elements.submit();
      if (submitError) {
        event.paymentFailed({ reason: "fail" });
        setError(submitError.message ?? "Payment failed.");
        setProcessing(false);
        return;
      }

      const result = await stripe.confirmSetup({
        elements,
        redirect: "if_required",
      });

      if (result.error) {
        event.paymentFailed({ reason: "fail" });
        setError(result.error.message ?? "Payment failed.");
        setProcessing(false);
        return;
      }

      // Extract PM ID from confirmed SetupIntent
      const paymentMethodId =
        typeof result.setupIntent.payment_method === "string"
          ? result.setupIntent.payment_method
          : result.setupIntent.payment_method?.id;

      if (!paymentMethodId) {
        event.paymentFailed({ reason: "fail" });
        setError("Unable to save payment method.");
        setProcessing(false);
        return;
      }

      // Call quick-checkout with PM + billing details
      const billingEmail = event.billingDetails?.email;
      const billingName = event.billingDetails?.name;
      const billingPhone = event.billingDetails?.phone;

      if (!billingEmail || !billingName) {
        event.paymentFailed({ reason: "fail" });
        setError("Email and name are required.");
        setProcessing(false);
        return;
      }

      try {
        const res = await fetch("/api/membership/quick-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tier,
            paymentMethodId,
            email: billingEmail,
            name: billingName,
            phone: billingPhone ?? "",
          }),
        });

        const data = await res.json();

        if (!data.success) {
          if (data.error === "already_subscribed") {
            router.push("/account");
            return;
          }
          event.paymentFailed({ reason: "fail" });
          setError(data.error ?? "Something went wrong.");
          setProcessing(false);
          return;
        }

        trackEvent(TRACKING_EVENTS.MEMBERSHIP_ACTIVATED, {
          tier,
          method: "wallet",
        });
        onSuccess();
      } catch {
        event.paymentFailed({ reason: "fail" });
        setError("Something went wrong. Please try again.");
        setProcessing(false);
      }
    },
    [stripe, elements, tier, router, onSuccess],
  );

  if (processing) {
    return (
      <div className="flex items-center justify-center py-4 gap-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-navy/10 border-t-primary" />
        <p className="font-[family-name:var(--font-poppins)] text-xs text-navy/40">
          Setting up your membership...
        </p>
      </div>
    );
  }

  return (
    <div>
      <ExpressCheckoutElement
        options={{
          buttonType: {
            applePay: "subscribe",
            googlePay: "subscribe",
          },
          buttonHeight: 48,
          paymentMethods: {
            applePay: "auto",
            googlePay: "auto",
            link: "auto",
            amazonPay: "never",
            paypal: "never",
            klarna: "never",
          },
          emailRequired: true,
          phoneNumberRequired: true,
          billingAddressRequired: true,
        }}
        onReady={handleReady}
        onClick={handleClick}
        onConfirm={handleConfirm}
      />
      {error && (
        <p className="mt-2 font-[family-name:var(--font-poppins)] text-xs text-red-600 text-center">
          {error}
        </p>
      )}
    </div>
  );
}

interface WalletCheckoutProps {
  readonly tier: MembershipTier;
  readonly clientSecret: string | null;
  readonly onReady: (available: boolean) => void;
  readonly onSuccess: () => void;
}

export function WalletCheckout({
  tier,
  clientSecret,
  onReady,
  onSuccess,
}: WalletCheckoutProps) {
  // Can't mount Elements without a client secret
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    if (!clientSecret && !notified) {
      // No secret yet — wallet buttons won't render, report not ready
      // (will re-render when clientSecret arrives)
    }
  }, [clientSecret, notified]);

  if (!clientSecret) {
    return null;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: STRIPE_APPEARANCE,
      }}
    >
      <WalletCheckoutInner
        tier={tier}
        onReady={(available) => {
          if (!notified) {
            setNotified(true);
            onReady(available);
          }
        }}
        onSuccess={onSuccess}
      />
    </Elements>
  );
}
