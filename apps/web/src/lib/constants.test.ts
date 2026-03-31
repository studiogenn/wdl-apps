import { describe, it, expect } from "vitest";
import { BRAND, COMPANY, NAV_LINKS } from "./constants";

describe("constants", () => {
  it("has correct brand colors", () => {
    expect(BRAND.colors.primary).toBe("#060B36");
    expect(BRAND.colors.accent).toBe("#F5E6A3");
    expect(BRAND.colors.dark).toBe("#1a1a2e");
  });

  it("has correct company info", () => {
    expect(COMPANY.name).toBe("We Deliver Laundry");
    expect(COMPANY.phone).toBe("855-968-5511");
    expect(COMPANY.email).toBe("hello@wedeliverlaundry.com");
  });

  it("has nav links with paths", () => {
    expect(NAV_LINKS.length).toBeGreaterThan(0);
    NAV_LINKS.forEach((link) => {
      expect(link.href).toMatch(/^\//);
      expect(link.label).toBeTruthy();
    });
  });
});
