import { describe, it, expect } from "vitest";
import {
  FLAG_KEYS,
  DEFAULT_HERO_CONTENT,
  parseHeroPayload,
} from "./feature-flags";

describe("FLAG_KEYS", () => {
  it("has expected flag keys", () => {
    expect(FLAG_KEYS.HERO_CONTENT).toBe("hero-content");
    expect(FLAG_KEYS.HOMEPAGE_VARIANT).toBe("homepage-variant");
  });
});

describe("parseHeroPayload", () => {
  it("returns default for null", () => {
    expect(parseHeroPayload(null)).toEqual(DEFAULT_HERO_CONTENT);
  });

  it("returns default for undefined", () => {
    expect(parseHeroPayload(undefined)).toEqual(DEFAULT_HERO_CONTENT);
  });

  it("returns default for string", () => {
    expect(parseHeroPayload("not an object")).toEqual(DEFAULT_HERO_CONTENT);
  });

  it("returns default for partial object", () => {
    expect(parseHeroPayload({ headline: "Test" })).toEqual(
      DEFAULT_HERO_CONTENT
    );
  });

  it("returns default when fields have wrong types", () => {
    expect(
      parseHeroPayload({
        headline: 123,
        highlightedText: "ok",
        subheadline: "ok",
        ctaText: "ok",
        ctaUrl: "ok",
      })
    ).toEqual(DEFAULT_HERO_CONTENT);
  });

  it("parses valid payload", () => {
    const payload = {
      headline: "Custom Headline",
      highlightedText: "Custom Highlight",
      subheadline: "Custom sub",
      ctaText: "Custom CTA",
      ctaUrl: "/custom",
    };
    expect(parseHeroPayload(payload)).toEqual({
      ...payload,
      locationPrefix: "Serving",
      locationText: "",
    });
  });

  it("parses valid payload with location fields", () => {
    const payload = {
      headline: "Custom Headline",
      highlightedText: "Custom Highlight",
      subheadline: "Custom sub",
      ctaText: "Custom CTA",
      ctaUrl: "/custom",
      locationPrefix: "Now in",
      locationText: "Manhattan",
    };
    expect(parseHeroPayload(payload)).toEqual(payload);
  });

  it("ignores extra fields", () => {
    const payload = {
      headline: "Test",
      highlightedText: "Highlight",
      subheadline: "Sub",
      ctaText: "CTA",
      ctaUrl: "/url",
      extraField: "ignored",
    };
    const result = parseHeroPayload(payload);
    expect(result).toEqual({
      headline: "Test",
      highlightedText: "Highlight",
      subheadline: "Sub",
      ctaText: "CTA",
      ctaUrl: "/url",
      locationPrefix: "Serving",
      locationText: "",
    });
    expect("extraField" in result).toBe(false);
  });
});
