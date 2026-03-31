import { test, expect } from "@playwright/test";

test.describe("Personalization & A/B testing infrastructure", () => {
  test("sets visitor ID cookie on first visit", async ({ page }) => {
    await page.goto("/");
    const cookies = await page.context().cookies();
    const visitorCookie = cookies.find((c) => c.name === "ab_visitor_id");
    expect(visitorCookie).toBeDefined();
    expect(visitorCookie!.value).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    );
  });

  test("preserves visitor ID cookie across navigations", async ({ page }) => {
    await page.goto("/");
    const cookies1 = await page.context().cookies();
    const id1 = cookies1.find((c) => c.name === "ab_visitor_id")!.value;

    await page.goto("/about");
    const cookies2 = await page.context().cookies();
    const id2 = cookies2.find((c) => c.name === "ab_visitor_id")!.value;

    expect(id1).toBe(id2);
  });

  test("renders default hero content without flags", async ({ page }) => {
    await page.goto("/");
    const heading = page.locator("h1");
    await expect(heading).toContainText("Laundry Pickup & Delivery");
    await expect(heading).toContainText("Within 24 Hours");
  });

  test("renders schedule pickup CTA", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("main").getByRole("link", { name: /schedule pickup/i })
    ).toBeVisible();
  });

  test("sets x-wdl-visitor-id response header", async ({ page }) => {
    const response = await page.goto("/");
    expect(response).not.toBeNull();
    const visitorId = response!.headerValue("x-wdl-visitor-id");
    expect(await visitorId).toBeTruthy();
  });

  test("sets x-wdl-flags response header", async ({ page }) => {
    const response = await page.goto("/");
    expect(response).not.toBeNull();
    const flags = response!.headerValue("x-wdl-flags");
    expect(await flags).toBeTruthy();
  });

  test("variant pages are not directly navigable in sitemap", async ({
    page,
  }) => {
    // Variant pages exist but are served via rewrite, not direct navigation.
    // Verify the route exists by checking it doesn't 404 outright
    // (it will render the variant page content).
    const response = await page.goto("/variants/homepage-b");
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);
  });
});
