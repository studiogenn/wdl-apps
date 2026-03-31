import { describe, it, expect } from "vitest";
import { FAQ_ITEMS } from "./faq";

describe("FAQ data", () => {
  it("has FAQ items", () => {
    expect(FAQ_ITEMS.length).toBeGreaterThan(0);
  });

  it("each item has question and answer", () => {
    FAQ_ITEMS.forEach((item) => {
      expect(item.question).toBeTruthy();
      expect(item.answer).toBeTruthy();
    });
  });
});
