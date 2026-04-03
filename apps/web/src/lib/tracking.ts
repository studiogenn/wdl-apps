import posthog from "posthog-js";

export const TRACKING_EVENTS = {
  CONTACT_FORM_SUBMIT: "contact_form_submit",
  BOOKING_FORM_SUBMITTED: "booking_form_submitted",
  SECTION_VIEWED: "section_viewed",
  SIGNUP_FLOW_STARTED: "signup_flow_started",
  SIGNUP_STEP_COMPLETED: "signup_step_completed",
  SIGNUP_ZIP_CHECKED: "signup_zip_checked",
  SIGNUP_COMPLETED: "signup_completed",
  SIGNUP_ABANDONED: "signup_abandoned",
  // Membership funnel
  MEMBERSHIP_PLAN_SELECTED: "membership_plan_selected",
  MEMBERSHIP_PLAN_CHANGED: "membership_plan_changed",
  MEMBERSHIP_AUTH_COMPLETED: "membership_auth_completed",
  MEMBERSHIP_SCHEDULE_COMPLETED: "membership_schedule_completed",
  MEMBERSHIP_CHECKOUT_REACHED: "membership_checkout_reached",
  MEMBERSHIP_PAYMENT_SUBMITTED: "membership_payment_submitted",
  MEMBERSHIP_ACTIVATED: "membership_activated",
  INSTANT_SELECTED: "instant_selected",
} as const;

export type TrackingEvent =
  (typeof TRACKING_EVENTS)[keyof typeof TRACKING_EVENTS];

type EventProperties = {
  readonly [key: string]: string | number | boolean;
};

export function trackEvent(
  event: string,
  properties?: EventProperties
): void {
  try {
    posthog.capture(event, properties);
  } catch {
    // PostHog not initialized — silently skip
  }
}

export function trackContactFormSubmit(): void {
  trackEvent(TRACKING_EVENTS.CONTACT_FORM_SUBMIT);
}

export function trackBookingFormSubmitted(source: string): void {
  trackEvent(TRACKING_EVENTS.BOOKING_FORM_SUBMITTED, { source });
}

export function trackSectionViewed(section: string): void {
  trackEvent(TRACKING_EVENTS.SECTION_VIEWED, { section });
}

export function trackSignupFlowStarted(variant: string): void {
  trackEvent(TRACKING_EVENTS.SIGNUP_FLOW_STARTED, { variant });
}

export function trackSignupStepCompleted(variant: string, step: string): void {
  trackEvent(TRACKING_EVENTS.SIGNUP_STEP_COMPLETED, { variant, step });
}

export function trackSignupZipChecked(zip: string, inServiceArea: boolean): void {
  trackEvent(TRACKING_EVENTS.SIGNUP_ZIP_CHECKED, { zip, in_service_area: inServiceArea });
}

export function trackSignupCompleted(variant: string, customerId: number, orderId: number): void {
  trackEvent(TRACKING_EVENTS.SIGNUP_COMPLETED, { variant, customer_id: customerId, order_id: orderId });
}

export function trackSignupAbandoned(variant: string, lastStep: string): void {
  trackEvent(TRACKING_EVENTS.SIGNUP_ABANDONED, { variant, last_step: lastStep });
}

// ─── Identity Stitching ───────────────────────────────────────────────
// Canonical distinct_id = Better Auth user.id.
// CleanCloud customer ID is aliased so historical events follow.

type CustomerIdentity = {
  readonly userId?: string;
  readonly customerId: number;
  readonly email: string;
  readonly name?: string;
  readonly phone?: string;
};

export function identifyCustomer(identity: CustomerIdentity): void {
  try {
    const distinctId = identity.userId ?? identity.email;
    const personProps: Record<string, string | number> = {
      cleancloud_id: identity.customerId,
      email: identity.email,
    };
    if (identity.name) personProps.name = identity.name;
    if (identity.phone) personProps.phone = identity.phone;

    posthog.identify(distinctId, personProps);
    posthog.alias(String(identity.customerId), distinctId);
  } catch {
    // PostHog not initialized
  }
}

export function identifyWithEmail(email: string, properties?: { readonly name?: string; readonly phone?: string }): void {
  try {
    const personProps: Record<string, string> = { email };
    if (properties?.name) personProps.name = properties.name;
    if (properties?.phone) personProps.phone = properties.phone;

    posthog.identify(email, personProps);
  } catch {
    // PostHog not initialized
  }
}

// ─── Conversion Events (match old site event names) ───────────────────

export function trackCustomerSignup(customerId: number, email: string): void {
  trackEvent("cc_signup", { customer_id: customerId, email });
}

export function trackOrderCompleted(orderId: number, customerId: number, properties?: {
  readonly item_count?: number;
  readonly service_type?: string;
  readonly promo_code?: string;
}): void {
  trackEvent("order_completed", {
    order_id: orderId,
    customer_id: customerId,
    ...properties,
  });
}
