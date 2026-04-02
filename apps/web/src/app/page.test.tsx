import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/home/Hero";

describe("Hero", () => {
  it("renders the hero headline with default content", () => {
    render(<Hero />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(/Laundry Pickup/i);
  });

  it("renders the schedule pickup CTA", () => {
    render(<Hero />);
    expect(
      screen.getByRole("link", { name: /view memberships/i })
    ).toBeInTheDocument();
  });

  it("renders custom content from CMS config", () => {
    render(
      <Hero
        config={{
          heading: "Custom Headline",
          subheading: "Custom subheadline text",
          ctaText: "Custom CTA",
          ctaLink: "/custom",
        }}
      />
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Custom Headline"
    );
    expect(screen.getByRole("link", { name: /custom cta/i })).toHaveAttribute(
      "href",
      "/custom"
    );
  });

  it("renders default bullet points when no config", () => {
    render(<Hero />);
    expect(screen.getByText("24-Hour Turnaround")).toBeInTheDocument();
    expect(screen.getByText("Reliable Delivery Service")).toBeInTheDocument();
    expect(screen.getByText("No Harsh Chemicals")).toBeInTheDocument();
  });
});
