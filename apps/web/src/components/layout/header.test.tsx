import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./header";

// Mock next/navigation (required by "use client" components in test env)
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));

describe("Header", () => {
  it("renders the company logo", () => {
    render(<Header />);
    expect(screen.getAllByAltText("We Deliver Laundry").length).toBeGreaterThanOrEqual(1);
  });

  it("renders nav links", () => {
    render(<Header />);
    expect(screen.getAllByRole("link", { name: /wash & fold/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole("link", { name: /locations/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole("link", { name: /about us/i }).length).toBeGreaterThanOrEqual(1);
  });

  it("renders schedule pickup CTA", () => {
    render(<Header />);
    expect(screen.getAllByRole("link", { name: /schedule pickup/i }).length).toBeGreaterThanOrEqual(1);
  });
});
