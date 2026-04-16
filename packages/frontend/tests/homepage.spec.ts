import { expect, test } from "@playwright/test";

test.describe("Shopping Mall Frontend", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("homepage loads successfully", async ({ page }) => {
    await expect(page).toHaveTitle("Shopping Mall");
    await expect(page.locator("h1")).toContainText("Welcome to Shopping Mall");
  });

  test("navigation links are present", async ({ page }) => {
    await expect(page.locator('a[href="/sales"]')).toBeVisible();
    await expect(page.locator('a[href="/cart"]')).toBeVisible();
    await expect(page.locator('a[href="/login"]')).toBeVisible();
  });

  test("can navigate to products page", async ({ page }) => {
    await page.click('a[href="/sales"]');
    await expect(page).toHaveURL("/sales");
    await expect(page.locator("h1")).toContainText("Products");
  });

  test("can navigate to login page", async ({ page }) => {
    await page.click('a[href="/login"]');
    await expect(page).toHaveURL("/login");
    await expect(page.locator("h2")).toContainText("Welcome Back");
  });

  test("login form has required fields", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});
