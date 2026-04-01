import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  TRACKING_EVENTS,
  trackEvent,
  trackContactFormSubmit,
} from "./tracking";

vi.mock("posthog-js", () => ({
  default: {
    capture: vi.fn(),
  },
}));

import posthog from "posthog-js";

describe("TRACKING_EVENTS", () => {
  it("has expected event names", () => {
    expect(TRACKING_EVENTS.CONTACT_FORM_SUBMIT).toBe("contact_form_submit");
    expect(TRACKING_EVENTS.SECTION_VIEWED).toBe("section_viewed");
    expect(TRACKING_EVENTS.SIGNUP_FLOW_STARTED).toBe("signup_flow_started");
  });
});

describe("trackEvent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls posthog.capture with event name", () => {
    trackEvent(TRACKING_EVENTS.CONTACT_FORM_SUBMIT);
    expect(posthog.capture).toHaveBeenCalledWith("contact_form_submit", undefined);
  });

  it("passes properties to posthog.capture", () => {
    trackEvent(TRACKING_EVENTS.CONTACT_FORM_SUBMIT, { source: "hero" });
    expect(posthog.capture).toHaveBeenCalledWith("contact_form_submit", {
      source: "hero",
    });
  });

  it("does not throw when posthog.capture throws", () => {
    vi.mocked(posthog.capture).mockImplementationOnce(() => {
      throw new Error("not initialized");
    });
    expect(() => trackEvent(TRACKING_EVENTS.CONTACT_FORM_SUBMIT)).not.toThrow();
  });
});

describe("helper functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("trackContactFormSubmit sends correct event", () => {
    trackContactFormSubmit();
    expect(posthog.capture).toHaveBeenCalledWith(
      "contact_form_submit",
      undefined
    );
  });
});
