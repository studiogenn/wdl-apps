"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { type MembershipTier } from "@/lib/stripe-config";
import { trackEvent, TRACKING_EVENTS } from "@/lib/tracking";
import { TierSelection, type PlanChoice } from "./TierSelection";
import { AuthStep } from "./AuthStep";
import { ScheduleStep } from "./ScheduleStep";
import { PaymentStep } from "./PaymentStep";

type Step = "tier" | "auth" | "schedule" | "payment";

export type CustomerProfile = {
  readonly isReturning: boolean;
  readonly name?: string;
  readonly address?: string;
  readonly routeId?: number;
  readonly routeName?: string;
  readonly preferences?: {
    readonly detergent: string | null;
    readonly bleach: string | null;
    readonly fabricSoftener: string | null;
    readonly dryerTemperature: string | null;
    readonly dryerSheets: string | null;
  };
  readonly hasSavedPayment?: boolean;
  readonly orderCount?: number;
  readonly lastOrderDate?: string | null;
};

export function JoinFunnel() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("tier");
  const [plan, setPlan] = useState<PlanChoice>("weekly");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [walletClientSecret, setWalletClientSecret] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);

  const prefetchFired = useRef(false);
  const walletPrefetchTier = useRef<string | null>(null);

  const isInstant = plan === "instant";
  const membershipTier = isInstant ? null : (plan as MembershipTier);

  // Prefetch SetupIntent for wallet checkout on tier selection (no auth needed)
  useEffect(() => {
    if (isInstant || !membershipTier) return;
    if (walletPrefetchTier.current === membershipTier) return;

    walletPrefetchTier.current = membershipTier;
    setWalletClientSecret(null);

    fetch("/api/membership/wallet-setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier: membershipTier }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setWalletClientSecret(json.data.clientSecret);
        }
      })
      .catch(() => {
        // Wallet checkout won't be available — manual flow still works
      });
  }, [isInstant, membershipTier]);

  // Fire SetupIntent + profile prefetch in parallel after auth (membership only)
  const prefetchAll = useCallback((selectedTier: MembershipTier) => {
    if (prefetchFired.current) return;
    prefetchFired.current = true;

    fetch("/api/membership/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "setup", tier: selectedTier }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setClientSecret(json.data.clientSecret);
        } else {
          setPaymentError(json.error ?? "Something went wrong");
        }
      })
      .catch(() => {
        setPaymentError("Unable to initialize payment.");
      });

    fetch("/api/account/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setProfile(json.data);
      })
      .catch(() => {
        setProfile({ isReturning: false });
      });
  }, []);

  // Profile-only prefetch for Instant (no SetupIntent needed)
  const prefetchProfile = useCallback(() => {
    fetch("/api/account/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setProfile(json.data);
      })
      .catch(() => {
        setProfile({ isReturning: false });
      });
  }, []);

  const handlePlanSelect = useCallback((selected: PlanChoice) => {
    if (selected === "instant") {
      trackEvent(TRACKING_EVENTS.INSTANT_SELECTED);
    } else {
      trackEvent(TRACKING_EVENTS.MEMBERSHIP_PLAN_SELECTED, { tier: selected });
    }
    setPlan(selected);
    prefetchFired.current = false;
    setClientSecret(null);
    setPaymentError(null);
    setStep("auth");
    window.scrollTo(0, 0);
  }, []);

  const handleWalletSuccess = useCallback(() => {
    trackEvent(TRACKING_EVENTS.MEMBERSHIP_ACTIVATED, { tier: plan, method: "wallet" });
    router.push("/join/success");
  }, [plan, router]);

  const handleAuthComplete = useCallback(() => {
    if (isInstant) {
      trackEvent(TRACKING_EVENTS.MEMBERSHIP_AUTH_COMPLETED, { plan: "instant" });
      window.location.href = "/order";
    } else {
      trackEvent(TRACKING_EVENTS.MEMBERSHIP_AUTH_COMPLETED, { plan: membershipTier! });
      prefetchAll(membershipTier!);
      setStep("schedule");
      window.scrollTo(0, 0);
    }
  }, [isInstant, membershipTier, prefetchAll, prefetchProfile, router]);

  const handleScheduleComplete = useCallback(() => {
    trackEvent(TRACKING_EVENTS.MEMBERSHIP_SCHEDULE_COMPLETED, { tier: plan });
    trackEvent(TRACKING_EVENTS.MEMBERSHIP_CHECKOUT_REACHED, { tier: plan });
    setStep("payment");
    window.scrollTo(0, 0);
  }, [plan]);

  const handlePaymentSuccess = useCallback(() => {
    trackEvent(TRACKING_EVENTS.MEMBERSHIP_ACTIVATED, { tier: plan });
    router.push("/join/success");
  }, [plan, router]);

  const steps = isInstant
    ? ["Plan", "Account"]
    : ["Plan", "Account", "Schedule", "Payment"];
  const stepIndex = step === "tier" ? 0 : step === "auth" ? 1 : step === "schedule" ? 2 : 3;

  return (
    <div className="flex flex-col" style={{ minHeight: "calc(100dvh - var(--header-height))" }}>
      <div className="flex-1 flex flex-col justify-center bg-cream">
        {step === "tier" && (
          <TierSelection
            selected={plan}
            onSelect={handlePlanSelect}
            walletClientSecret={isInstant ? null : walletClientSecret}
            walletTier={membershipTier}
            onWalletSuccess={handleWalletSuccess}
          />
        )}

        {step === "auth" && (
          <AuthStep
            onComplete={handleAuthComplete}
            onBack={() => { setStep("tier"); window.scrollTo(0, 0); }}
          />
        )}

        {step === "schedule" && membershipTier && (
          <ScheduleStep
            tier={membershipTier}
            profile={profile}
            onComplete={handleScheduleComplete}
            onBack={() => { setStep("auth"); window.scrollTo(0, 0); }}
          />
        )}

        {step === "payment" && membershipTier && (
          <PaymentStep
            tier={membershipTier}
            profile={profile}
            clientSecret={clientSecret}
            fetchError={paymentError}
            onSuccess={handlePaymentSuccess}
            onBack={() => { setStep("schedule"); window.scrollTo(0, 0); }}
          />
        )}
      </div>

      {/* Progress */}
      <div className="bg-white border-t border-navy/10 px-6 py-3 shrink-0">
        <div className="mx-auto max-w-lg">
          <div className="flex gap-1.5">
            {steps.map((label, i) => (
              <div key={label} className="flex-1">
                <div
                  className={`h-1 rounded-full transition-colors ${
                    i <= stepIndex ? "bg-primary" : "bg-navy/10"
                  }`}
                />
                <p
                  className={`mt-1 text-[11px] font-[family-name:var(--font-poppins)] ${
                    i <= stepIndex ? "text-primary font-body-medium" : "text-navy/30"
                  }`}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
