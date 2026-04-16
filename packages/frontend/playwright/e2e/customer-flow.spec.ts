import { test, expect } from "@playwright/test";

test.describe("Customer Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/customer");
  });

  test("should display customer portal", async ({ page }) => {
    await expect(page.getByText(/Shopping Mall/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /catalog/i })).toBeVisible();
  });

  test("should navigate to login page", async ({ page }) => {
    await page.getByRole("link", { name: /login/i }).click();
    await expect(page.getByText(/sign in/i)).toBeVisible();
  });

  test("should navigate to signup page", async ({ page }) => {
    await page.getByRole("link", { name: /sign up/i }).click();
    await expect(page.getByText(/create account/i)).toBeVisible();
  });

  test("should display product catalog", async ({ page }) => {
    // Mock products will be loaded from API
    await expect(page.getByRole("heading", { name: /featured products/i })).toBeVisible();
  });

  test("should navigate to product detail page", async ({ page }) => {
    // Click on first product card
    const productCard = page.getByRole("link", { name: /product/i }).first();
    if (await productCard.isVisible()) {
      await productCard.click();
      await expect(page.getByRole("heading")).toBeVisible();
    }
  });

  test("should navigate to cart page", async ({ page }) => {
    await page.goto("/customer/cart");
    await expect(page.getByText(/shopping cart/i)).toBeVisible();
  });

  test("should navigate to checkout page", async ({ page }) => {
    await page.goto("/customer/checkout");
    await expect(page.getByText(/checkout/i)).toBeVisible();
  });

  test("should display orders page", async ({ page }) => {
    await page.goto("/customer/orders");
    await expect(page.getByText(/order history/i)).toBeVisible();
  });

  test("should display wallet page", async ({ page }) => {
    await page.goto("/customer/wallet");
    await expect(page.getByText(/my wallet/i)).toBeVisible();
  });
});
