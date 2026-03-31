"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { SignupShell } from "@/components/signup/signup-shell";
import { ZipCheck } from "@/components/signup/zip-check";
import { ServiceSelector } from "@/components/signup/service-selector";
import { ContactForm, type ContactInfo } from "@/components/signup/contact-form";
import { SchedulePicker } from "@/components/signup/schedule-picker";
import { Confirmation } from "@/components/signup/confirmation";
import { LoginForm } from "@/components/signup/login-form";
import { PromoInput } from "@/components/signup/promo-input";
import { fromCleanCloudTimestamp } from "@/lib/cleancloud/dates";
import {
  trackSignupFlowStarted,
  trackSignupStepCompleted,
  trackSignupCompleted,
  trackSignupAbandoned,
  identifyCustomer,
  trackCustomerSignup,
  trackOrderCompleted,
} from "@/lib/tracking";

const VARIANT = "guided";
const STEP_LABELS = ["Zip Code", "Service", "Your Info", "Schedule", "Done"] as const;
const TOTAL_STEPS = 5;

type SelectedProduct = {
  readonly productID: number;
  readonly name: string;
  readonly price: number;
};

type GuidedState = {
  readonly currentStep: number;
  readonly routeID: number | null;
  readonly zip: string;
  readonly selectedProduct: SelectedProduct | null;
  readonly customerID: number | null;
  readonly contactInfo: ContactInfo | null;
  readonly promoCode: string;
  readonly pickupDate: number | null;
  readonly pickupStart: string | null;
  readonly orderID: number | null;
  readonly loading: boolean;
  readonly error: string;
};

type GuidedAction =
  | { type: "ZIP_CHECKED"; routeID: number; zip: string }
  | { type: "SERVICE_SELECTED"; product: SelectedProduct }
  | { type: "CUSTOMER_CREATED"; customerID: number; contactInfo: ContactInfo }
  | { type: "ORDER_CREATED"; orderID: number; pickupDate: number; pickupStart: string }
  | { type: "GO_BACK" }
  | { type: "SET_PROMO"; promoCode: string }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error: string };

const initialState: GuidedState = {
  currentStep: 1,
  routeID: null,
  zip: "",
  selectedProduct: null,
  customerID: null,
  contactInfo: null,
  promoCode: "",
  pickupDate: null,
  pickupStart: null,
  orderID: null,
  loading: false,
  error: "",
};

function reducer(state: GuidedState, action: GuidedAction): GuidedState {
  switch (action.type) {
    case "ZIP_CHECKED":
      return { ...state, currentStep: 2, routeID: action.routeID, zip: action.zip, error: "" };
    case "SERVICE_SELECTED":
      return { ...state, currentStep: 3, selectedProduct: action.product, error: "" };
    case "CUSTOMER_CREATED":
      return { ...state, currentStep: 4, customerID: action.customerID, contactInfo: action.contactInfo, loading: false, error: "" };
    case "ORDER_CREATED":
      return { ...state, currentStep: 5, orderID: action.orderID, pickupDate: action.pickupDate, pickupStart: action.pickupStart, loading: false, error: "" };
    case "GO_BACK":
      return { ...state, currentStep: Math.max(1, state.currentStep - 1), error: "" };
    case "SET_PROMO":
      return { ...state, promoCode: action.promoCode };
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    case "SET_ERROR":
      return { ...state, error: action.error, loading: false };
  }
}

export default function GuidedSignupPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loginMode, setLoginMode] = useState(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("tab") === "login";
    }
    return false;
  });
  const startedRef = useRef(false);

  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      trackSignupFlowStarted(VARIANT);
    }
  }, []);

  // Track abandonment on unmount
  const stepRef = useRef(state.currentStep);
  stepRef.current = state.currentStep;
  const completedRef = useRef(false);
  if (state.currentStep === TOTAL_STEPS) completedRef.current = true;

  useEffect(() => {
    return () => {
      if (!completedRef.current) {
        trackSignupAbandoned(VARIANT, String(stepRef.current));
      }
    };
  }, []);

  const handleZipSuccess = useCallback((routeID: number, zip: string) => {
    trackSignupStepCompleted(VARIANT, "zip_check");
    dispatch({ type: "ZIP_CHECKED", routeID, zip });
  }, []);

  const handleLoginSuccess = useCallback((_customerID: number) => {
    trackSignupStepCompleted(VARIANT, "login");
    window.location.href = "/account/manage";
  }, []);

  const toggleLogin = useCallback(() => {
    setLoginMode((prev) => !prev);
  }, []);

  const handleServiceSelect = useCallback((product: SelectedProduct) => {
    trackSignupStepCompleted(VARIANT, "service_select");
    dispatch({ type: "SERVICE_SELECTED", product });
  }, []);

  const handleContactSubmit = useCallback(async (info: ContactInfo) => {
    dispatch({ type: "SET_LOADING", loading: true });
    try {
      const res = await fetch("/api/cleancloud/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: info.name,
          email: info.email,
          phone: info.phone,
          address: info.address,
          promoCode: state.promoCode || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        identifyCustomer({
          customerId: data.data.customerID,
          email: info.email,
          name: info.name,
          phone: info.phone,
        });
        trackCustomerSignup(data.data.customerID, info.email);
        trackSignupStepCompleted(VARIANT, "contact_info");
        dispatch({ type: "CUSTOMER_CREATED", customerID: data.data.customerID, contactInfo: info });
      } else {
        dispatch({ type: "SET_ERROR", error: data.error });
      }
    } catch {
      dispatch({ type: "SET_ERROR", error: "Unable to create account. Please try again." });
    }
  }, [state.promoCode]);

  const handleScheduleSubmit = useCallback(async (pickupDate: number, pickupStart: string, pickupEnd: string) => {
    if (!state.customerID) return;
    dispatch({ type: "SET_LOADING", loading: true });

    const orderPayload: Record<string, unknown> = {
      customerID: state.customerID,
      pickupDate,
      pickupStart,
      pickupEnd,
    };

    if (state.selectedProduct) {
      orderPayload.products = [{
        productID: state.selectedProduct.productID,
        quantity: 1,
      }];
      orderPayload.finalTotal = state.selectedProduct.price;
    }

    try {
      const res = await fetch("/api/cleancloud/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      const data = await res.json();
      if (data.success) {
        trackOrderCompleted(data.data.orderID, state.customerID, {
          service_type: state.selectedProduct?.name,
          promo_code: state.promoCode || undefined,
        });
        trackSignupStepCompleted(VARIANT, "schedule");
        trackSignupCompleted(VARIANT, state.customerID, data.data.orderID);
        dispatch({ type: "ORDER_CREATED", orderID: data.data.orderID, pickupDate, pickupStart });
      } else {
        dispatch({ type: "SET_ERROR", error: data.error });
      }
    } catch {
      dispatch({ type: "SET_ERROR", error: "Unable to schedule pickup. Please try again." });
    }
  }, [state.customerID, state.selectedProduct]);

  const handleBack = useCallback(() => {
    dispatch({ type: "GO_BACK" });
  }, []);

  const handlePromoChange = useCallback((value: string) => {
    dispatch({ type: "SET_PROMO", promoCode: value });
  }, []);

  function formatPickupDate(timestamp: number): string {
    return fromCleanCloudTimestamp(timestamp).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <SignupShell
      currentStep={state.currentStep}
      totalSteps={TOTAL_STEPS}
      stepLabels={[...STEP_LABELS]}
      showLogin={state.currentStep === 1}
      onToggleLogin={toggleLogin}
      isLoginMode={loginMode}
    >
      {loginMode && (
        <LoginForm
          onSuccess={handleLoginSuccess}
          onSwitchToSignup={toggleLogin}
        />
      )}
      {!loginMode && state.currentStep === 1 && (
        <ZipCheck onSuccess={handleZipSuccess} />
      )}
      {!loginMode && state.currentStep === 2 && (
        <ServiceSelector
          onSelect={handleServiceSelect}
          onBack={handleBack}
        />
      )}
      {!loginMode && state.currentStep === 3 && (
        <div className="space-y-6">
          <ContactForm
            onSubmit={handleContactSubmit}
            onBack={handleBack}
            loading={state.loading}
            error={state.error}
          />
          <PromoInput value={state.promoCode} onChange={handlePromoChange} />
        </div>
      )}
      {!loginMode && state.currentStep === 4 && state.routeID && (
        <div>
          <SchedulePicker
            routeID={state.routeID}
            onSubmit={handleScheduleSubmit}
            onBack={handleBack}
            loading={state.loading}
            error={state.error}
          />
          <div className="mt-6 rounded-xl border border-navy/10 bg-navy/[0.02] p-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-navy/40 font-[family-name:var(--font-poppins)]">
              What to expect
            </h3>
            <ul className="space-y-2 text-xs text-navy/60 font-[family-name:var(--font-poppins)]">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Our driver will pick up your laundry at the scheduled time
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                We&apos;ll wash and fold everything within 24 hours
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Delivery back to your door at a time that works for you
              </li>
            </ul>
          </div>
        </div>
      )}
      {!loginMode && state.currentStep === 5 && (
        <Confirmation
          customerName={state.contactInfo?.name}
          pickupDate={state.pickupDate ? formatPickupDate(state.pickupDate) : undefined}
          pickupTime={state.pickupStart ?? undefined}
          serviceName={state.selectedProduct?.name}
          showUpsell
        />
      )}
    </SignupShell>
  );
}
