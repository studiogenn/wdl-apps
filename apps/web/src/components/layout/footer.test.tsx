import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./footer";

describe("Footer", () => {
  it("renders company phone number", () => {
    render(<Footer />);
    expect(screen.getByText("(855) 968-5511")).toBeInTheDocument();
  });

  it("renders company email", () => {
    render(<Footer />);
    expect(screen.getByText("start@wedeliverlaundry.com")).toBeInTheDocument();
  });

  it("renders terms of service link", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /terms of service/i })).toBeInTheDocument();
  });
});
