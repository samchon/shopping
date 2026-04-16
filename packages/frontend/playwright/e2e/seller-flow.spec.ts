import { test, expect } from "@playwright/test";

test.describe("Seller Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/seller/login");
  });

  test("should display seller login page", async ({ page }) => {
    await expect(page.getByText(/seller login/i)).toBeVisible();
  });

  test("should navigate to seller console after login", async ({ page }) => {
    // Fill login form
    await page.fill('input[type="email"]', "robot@nestia.io");
    await page.fill('input[type="password"]', "samchon");

    // Submit
    await page.click('button[type="submit"]');

    // Should redirect to seller console
    await expect(page.getByText(/seller console/i)).toBeVisible();
  });

  test("should display seller dashboard", async ({ page }) => {
    await page.goto("/seller");
    await expect(page.getByText(/seller console/i)).toBeVisible();
  });

  test("should navigate to sales management", async ({ page }) => {
    await page.goto("/seller");
    const salesLink = page.getByRole("link", { name: /my sales/i });
    if (await salesLink.isVisible()) {
      await salesLink.click();
      await expect(page.getByText(/sales/i)).toBeVisible();
    }
  });

  test("should navigate to orders page", async ({ page }) => {
    await page.goto("/seller");
    const ordersLink = page.getByRole("link", { name: /orders/i });
    if (await ordersLink.isVisible()) {
      await ordersLink.click();
      await expect(page.getByText(/orders/i)).toBeVisible();
    }
  });
});
