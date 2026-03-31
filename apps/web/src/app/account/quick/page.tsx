"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { SignupShell } from "@/components/signup/signup-shell";
import { ZipCheck } from "@/components/signup/zip-check";
import { ContactForm, type ContactInfo } from "@/components/signup/contact-form";
import { SchedulePicker } from "@/components/signup/schedule-picker";
import { Confirmation } from "@/components/signup/confirmation";
import { LoginForm } from "@/components/signup/login-form";
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

const VARIANT = "quick";
const STEP_LABELS = ["Zip Code", "Your Info", "Schedule", "Done"] as const;
const TOTAL_STEPS = 4;

type QuickState = {
  readonly currentStep: number;
  readonly routeID: number | null;
  readonly zip: string;
  readonly customerID: number | null;
  readonly contactInfo: ContactInfo | null;
  readonly pickupDate: number | null;
  readonly pickupStart: string | null;
  readonly orderID: number | null;
  readonly loading: boolean;
  readonly error: string;
};

type QuickAction =
  | { type: "ZIP_CHECKED"; routeID: number; zip: string }
  | { type: "CUSTOMER_CREATED"; customerID: number; contactInfo: ContactInfo }
  | { type: "ORDER_CREATED"; orderID: number; pickupDate: number; pickupStart: string }
  | { type: "GO_BACK" }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error: string };

const initialState: QuickState = {
  currentStep: 1,
  routeID: null,
  zip: "",
  customerID: null,
  contactInfo: null,
  pickupDate: null,
  pickupStart: null,
  orderID: null,
  loading: false,
  error: "",
};

function reducer(state: QuickState, action: QuickAction): QuickState {
  switch (action.type) {
    case "ZIP_CHECKED":
      return { ...state, currentStep: 2, routeID: action.routeID, zip: action.zip, error: "" };
    case "CUSTOMER_CREATED":
      return { ...state, currentStep: 3, customerID: action.customerID, contactInfo: action.contactInfo, loading: false, error: "" };
    case "ORDER_CREATED":
      return { ...state, currentStep: 4, orderID: action.orderID, pickupDate: action.pickupDate, pickupStart: action.pickupStart, loading: false, error: "" };
    case "GO_BACK":
      return { ...state, currentStep: Math.max(1, state.currentStep - 1), error: "" };
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    case "SET_ERROR":
      return { ...state, error: action.error, loading: false };
  }
}

export default function QuickSignupPage() {
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
  }, []);

  const handleScheduleSubmit = useCallback(async (pickupDate: number, pickupStart: string, pickupEnd: string) => {
    if (!state.customerID) return;
    dispatch({ type: "SET_LOADING", loading: true });
    try {
      const res = await fetch("/api/cleancloud/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerID: state.customerID,
          pickupDate,
          pickupStart,
          pickupEnd,
        }),
      });
      const data = await res.json();
      if (data.success) {
        trackOrderCompleted(data.data.orderID, state.customerID);
        trackSignupStepCompleted(VARIANT, "schedule");
        trackSignupCompleted(VARIANT, state.customerID, data.data.orderID);
        dispatch({ type: "ORDER_CREATED", orderID: data.data.orderID, pickupDate, pickupStart });
      } else {
        dispatch({ type: "SET_ERROR", error: data.error });
      }
    } catch {
      dispatch({ type: "SET_ERROR", error: "Unable to schedule pickup. Please try again." });
    }
  }, [state.customerID]);

  const handleBack = useCallback(() => {
    dispatch({ type: "GO_BACK" });
  }, []);

  const handleLoginSuccess = useCallback((_customerID: number) => {
    trackSignupStepCompleted(VARIANT, "login");
    window.location.href = "/account/manage";
  }, []);

  const toggleLogin = useCallback(() => {
    setLoginMode((prev) => !prev);
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
        <ContactForm
          onSubmit={handleContactSubmit}
          onBack={handleBack}
          loading={state.loading}
          error={state.error}
        />
      )}
      {!loginMode && state.currentStep === 3 && state.routeID && (
        <SchedulePicker
          routeID={state.routeID}
          onSubmit={handleScheduleSubmit}
          onBack={handleBack}
          loading={state.loading}
          error={state.error}
        />
      )}
      {!loginMode && state.currentStep === 4 && (
        <Confirmation
          customerName={state.contactInfo?.name}
          pickupDate={state.pickupDate ? formatPickupDate(state.pickupDate) : undefined}
          pickupTime={state.pickupStart ?? undefined}
        />
      )}
    </SignupShell>
  );
}
