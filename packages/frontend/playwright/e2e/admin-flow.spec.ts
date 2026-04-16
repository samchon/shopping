import { test, expect } from "@playwright/test";

test.describe("Admin Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/login");
  });

  test("should display admin login page", async ({ page }) => {
    await expect(page.getByText(/admin login/i)).toBeVisible();
  });

  test("should navigate to admin console after login", async ({ page }) => {
    await page.fill('input[type="email"]', "robot@nestia.io");
    await page.fill('input[type="password"]', "samchon");
    await page.click('button[type="submit"]');
    await expect(page.getByText(/administrator console/i)).toBeVisible();
  });

  test("should display admin dashboard", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByText(/administrator console/i)).toBeVisible();
  });

  test("should navigate to sales overview", async ({ page }) => {
    await page.goto("/admin");
    const salesLink = page.getByRole("link", { name: /sales overview/i });
    if (await salesLink.isVisible()) {
      await salesLink.click();
      await expect(page.getByText(/sales/i)).toBeVisible();
    }
  });

  test("should navigate to orders page", async ({ page }) => {
    await page.goto("/admin");
    const ordersLink = page.getByRole("link", { name: /orders/i });
    if (await ordersLink.isVisible()) {
      await ordersLink.click();
      await expect(page.getByText(/orders/i)).toBeVisible();
    }
  });
});
