import { test, expect } from "@playwright/test";

test.describe("Smoke tests", () => {
  test("homepage loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1").getByText("Within 24 Hours")).toBeVisible();
    await expect(page.getByRole("main").getByRole("link", { name: /schedule pickup/i })).toBeVisible();
  });

  test("services page loads", async ({ page }) => {
    await page.goto("/services-pricing");
    await expect(page.getByRole("heading", { name: /services & pricing/i })).toBeVisible();
  });

  test("how it works page loads", async ({ page }) => {
    await page.goto("/how-it-works");
    await expect(page.locator("h1", { hasText: /how it works/i })).toBeVisible();
  });

  test("FAQ accordion works", async ({ page }) => {
    await page.goto("/faq");
    await page.getByText("How does pickup and delivery work?").click();
    await expect(page.getByText("Schedule a pickup online")).toBeVisible();
  });

  test("contact form renders", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/message/i)).toBeVisible();
  });

  test("blog page loads", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("heading", { name: /blog/i })).toBeVisible();
  });

  test("locations page loads", async ({ page }) => {
    await page.goto("/locations");
    await expect(page.getByRole("heading", { name: "New York", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "New Jersey", exact: true })).toBeVisible();
  });

  test("about page loads", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { name: /about/i })).toBeVisible();
  });

  test("terms page loads", async ({ page }) => {
    await page.goto("/terms");
    await expect(page.getByRole("heading", { name: /terms of service/i })).toBeVisible();
  });
});
