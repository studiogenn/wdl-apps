import { describe, it, expect } from "vitest";
import { resolveLocation } from "./geo";

describe("resolveLocation", () => {
  it("returns null for non-US countries", () => {
    expect(resolveLocation("London", "ENG", "GB")).toBeNull();
  });

  it("matches Manhattan by city name", () => {
    const result = resolveLocation("New York", "NY", "US");
    expect(result).not.toBeNull();
    expect(result!.location.slug).toBe("manhattan");
    expect(result!.matchType).toBe("city");
  });

  it("matches case-insensitively", () => {
    const result = resolveLocation("HOBOKEN", "NJ", "US");
    expect(result).not.toBeNull();
    expect(result!.location.slug).toBe("hudson-county");
  });

  it("matches Queens neighborhoods", () => {
    const result = resolveLocation("Jamaica", "NY", "US");
    expect(result).not.toBeNull();
    expect(result!.location.slug).toBe("queens");
  });

  it("matches by neighborhood when city not in direct map", () => {
    const result = resolveLocation("Parsippany-Troy Hills", "NJ", "US");
    expect(result).not.toBeNull();
    expect(result!.location.slug).toBe("morris-county");
    expect(result!.matchType).toBe("neighborhood");
  });

  it("falls back to region match for NY", () => {
    const result = resolveLocation("Albany", "NY", "US");
    expect(result).not.toBeNull();
    expect(result!.matchType).toBe("region");
    expect(result!.location.state).toBe("NY");
  });

  it("falls back to region match for NJ", () => {
    const result = resolveLocation("Trenton", "NJ", "US");
    expect(result).not.toBeNull();
    expect(result!.matchType).toBe("region");
    expect(result!.location.state).toBe("NJ");
  });

  it("returns null for US cities outside service area", () => {
    expect(resolveLocation("Los Angeles", "CA", "US")).toBeNull();
  });

  it("matches Long Island cities", () => {
    const result = resolveLocation("Hempstead", "NY", "US");
    expect(result).not.toBeNull();
    expect(result!.location.slug).toBe("long-island");
    expect(result!.matchType).toBe("city");
  });

  it("matches Bergen County cities", () => {
    const result = resolveLocation("Fort Lee", "NJ", "US");
    expect(result).not.toBeNull();
    expect(result!.location.slug).toBe("bergen-county");
  });

  it("trims whitespace", () => {
    const result = resolveLocation("  Hoboken  ", " NJ ", "US");
    expect(result).not.toBeNull();
    expect(result!.location.slug).toBe("hudson-county");
  });
});
