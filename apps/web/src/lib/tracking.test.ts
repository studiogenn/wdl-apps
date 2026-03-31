import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  TRACKING_EVENTS,
  trackEvent,
  trackSchedulePickupClick,
  trackCtaClick,
  trackContactFormSubmit,
  trackPhoneClick,
} from "./tracking";

vi.mock("posthog-js", () => ({
  default: {
    capture: vi.fn(),
  },
}));

import posthog from "posthog-js";

describe("TRACKING_EVENTS", () => {
  it("has expected event names", () => {
    expect(TRACKING_EVENTS.SCHEDULE_PICKUP_CLICK).toBe(
      "schedule_pickup_click"
    );
    expect(TRACKING_EVENTS.CONTACT_FORM_SUBMIT).toBe("contact_form_submit");
    expect(TRACKING_EVENTS.CTA_CLICK).toBe("cta_click");
    expect(TRACKING_EVENTS.PHONE_CLICK).toBe("phone_click");
  });
});

describe("trackEvent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls posthog.capture with event name", () => {
    trackEvent(TRACKING_EVENTS.CTA_CLICK);
    expect(posthog.capture).toHaveBeenCalledWith("cta_click", undefined);
  });

  it("passes properties to posthog.capture", () => {
    trackEvent(TRACKING_EVENTS.CTA_CLICK, { source: "hero" });
    expect(posthog.capture).toHaveBeenCalledWith("cta_click", {
      source: "hero",
    });
  });

  it("does not throw when posthog.capture throws", () => {
    vi.mocked(posthog.capture).mockImplementationOnce(() => {
      throw new Error("not initialized");
    });
    expect(() => trackEvent(TRACKING_EVENTS.CTA_CLICK)).not.toThrow();
  });
});

describe("helper functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("trackSchedulePickupClick sends correct event", () => {
    trackSchedulePickupClick("hero");
    expect(posthog.capture).toHaveBeenCalledWith("schedule_pickup_click", {
      source: "hero",
    });
  });

  it("trackCtaClick sends correct event with text and source", () => {
    trackCtaClick("Get Started", "header");
    expect(posthog.capture).toHaveBeenCalledWith("cta_click", {
      cta_text: "Get Started",
      source: "header",
    });
  });

  it("trackContactFormSubmit sends correct event", () => {
    trackContactFormSubmit();
    expect(posthog.capture).toHaveBeenCalledWith(
      "contact_form_submit",
      undefined
    );
  });

  it("trackPhoneClick sends correct event", () => {
    trackPhoneClick("contact_page");
    expect(posthog.capture).toHaveBeenCalledWith("phone_click", {
      source: "contact_page",
    });
  });
});
