import { describe, it, expect } from "vitest";
import { LOCATIONS, getLocationBySlug } from "./index";

describe("locations data", () => {
  it("has locations defined", () => {
    expect(LOCATIONS.length).toBeGreaterThan(0);
  });

  it("each location has required fields", () => {
    LOCATIONS.forEach((loc) => {
      expect(loc.name).toBeTruthy();
      expect(loc.slug).toBeTruthy();
      expect(loc.state).toBeTruthy();
      expect(loc.neighborhoods.length).toBeGreaterThan(0);
    });
  });

  it("finds a location by slug", () => {
    const first = LOCATIONS[0];
    const found = getLocationBySlug(first.slug);
    expect(found).toEqual(first);
  });

  it("returns undefined for unknown slug", () => {
    expect(getLocationBySlug("nonexistent")).toBeUndefined();
  });
});
