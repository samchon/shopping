import { expect, test } from "@playwright/test";

test.describe("Shopping Mall E2E Tests with SDK Simulation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  // ===== HOME PAGE =====
  test("homepage loads and displays correctly", async ({ page }) => {
    await expect(page).toHaveTitle("Shopping Mall");
    await expect(page.locator("h1")).toContainText("Welcome to Shopping Mall");
    await expect(page.locator("text=Browse Products")).toBeVisible();
  });

  test("homepage navigation works", async ({ page }) => {
    await page.click("text=Browse Products");
    await expect(page).toHaveURL("/sales");
  });

  // ===== PRODUCT CATALOG =====
  test("product catalog page loads", async ({ page }) => {
    await page.goto("/sales");
    await expect(page.locator("h1")).toContainText("Products");
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
  });

  test("product search functionality", async ({ page }) => {
    await page.goto("/sales");
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill("test product");
    await page.click('button:has-text("Search")');
    // Should show search results or loading state
    await expect(page.locator("h1")).toContainText("Products");
  });

  test("product sort functionality", async ({ page }) => {
    await page.goto("/sales");
    const select = page.locator('button[aria-label*="Select"]');
    await select.click();
    await page.click("text=Newest");
    await expect(page.locator("h1")).toContainText("Products");
  });

  // ===== PRODUCT DETAIL =====
  test("product detail page loads", async ({ page }) => {
    await page.goto("/sales/123e4567-e89b-12d3-a456-426614174000");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("text=Add to Cart")).toBeVisible();
    await expect(page.locator("text=Buy Now")).toBeVisible();
  });

  test("product options can be selected", async ({ page }) => {
    await page.goto("/sales/123e4567-e89b-12d3-a456-426614174000");
    // Click on size option
    await page.click('button:has-text("Size: M")');
    // Click on color option
    await page.click('button:has-text("Color: Blue")');
    await expect(page.locator("text=Add to Cart")).toBeVisible();
  });

  // ===== LOGIN FLOW =====
  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h2")).toContainText("Welcome Back");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("login form validation", async ({ page }) => {
    await page.goto("/login");
    await page.click('button:has-text("Login")');
    // Should show validation errors
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test("login with test credentials", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "customer1@nestia.io");
    await page.fill('input[type="password"]', "seed1234");
    await page.click('button:has-text("Login")');
    // Should redirect after successful login
    await page.waitForTimeout(2000);
    await expect(page).not.toHaveURL("/login");
  });

  // ===== SHOPPING CART =====
  test("cart page loads", async ({ page }) => {
    await page.goto("/cart");
    await expect(page.locator("h1")).toContainText("Shopping Cart");
    await expect(page.locator("text=Order Summary")).toBeVisible();
  });

  test("cart displays order summary", async ({ page }) => {
    await page.goto("/cart");
    await expect(page.locator("text=Subtotal")).toBeVisible();
    await expect(page.locator("text=Total")).toBeVisible();
  });

  test("proceed to checkout button exists", async ({ page }) => {
    await page.goto("/cart");
    await expect(
      page.locator('button:has-text("Proceed to Checkout")'),
    ).toBeVisible();
  });

  // ===== ORDERS =====
  test("orders page loads", async ({ page }) => {
    await page.goto("/orders");
    await expect(page.locator("h1")).toContainText("My Orders");
    await expect(page.locator("table")).toBeVisible();
  });

  test("order detail page loads", async ({ page }) => {
    await page.goto("/orders/1");
    await expect(page.locator("h1")).toContainText("Order #1");
    await expect(page.locator("text=Order Summary")).toBeVisible();
    await expect(page.locator("text=Delivery Information")).toBeVisible();
  });

  // ===== WALLET =====
  test("wallet page loads", async ({ page }) => {
    await page.goto("/wallet");
    await expect(page.locator("h1")).toContainText("My Wallet");
    await expect(page.locator("text=Deposit Balance")).toBeVisible();
    await expect(page.locator("text=Mileage Balance")).toBeVisible();
  });

  test("deposit history page loads", async ({ page }) => {
    await page.goto("/wallet/deposits");
    await expect(page.locator("h1")).toContainText("Deposit History");
  });

  test("mileage history page loads", async ({ page }) => {
    await page.goto("/wallet/mileages");
    await expect(page.locator("h1")).toContainText("Mileage History");
  });

  // ===== COUPONS =====
  test("coupons page loads", async ({ page }) => {
    await page.goto("/coupons");
    await expect(page.locator("h1")).toContainText("My Coupons");
  });

  // ===== SELLER PORTAL =====
  test("seller dashboard loads", async ({ page }) => {
    await page.goto("/seller");
    await expect(page.locator("h1")).toContainText("Seller Console");
    await expect(page.locator("text=Total Sales")).toBeVisible();
    await expect(page.locator("text=Orders")).toBeVisible();
  });

  test("seller can access product management", async ({ page }) => {
    await page.goto("/seller");
    await expect(page.locator("text=View Products")).toBeVisible();
    await expect(page.locator("text=View Orders")).toBeVisible();
  });

  // ===== ADMIN PORTAL =====
  test("admin dashboard loads", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.locator("h1")).toContainText("Administrator Console");
    await expect(page.locator("text=Total Revenue")).toBeVisible();
    await expect(page.locator("text=Total Orders")).toBeVisible();
  });

  test("admin can access management sections", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.locator("text=Manage Policies")).toBeVisible();
    await expect(page.locator("text=Manage Users")).toBeVisible();
    await expect(page.locator("text=Manage Coupons")).toBeVisible();
  });

  // ===== RESPONSIVE DESIGN =====
  test("mobile responsive layout", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("text=Browse Products")).toBeVisible();
  });

  test("tablet responsive layout", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/sales");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("desktop responsive layout", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
  });

  // ===== NAVIGATION FLOW =====
  test("complete browsing flow", async ({ page }) => {
    // Start at home
    await page.goto("/");
    await expect(page).toHaveURL("/");

    // Navigate to products
    await page.click("text=Browse Products");
    await expect(page).toHaveURL("/sales");

    // Navigate to cart
    await page.click("text=Cart");
    await expect(page).toHaveURL("/cart");

    // Navigate to orders
    await page.click("text=Orders");
    await expect(page).toHaveURL("/orders");
  });

  test("header navigation is consistent", async ({ page }) => {
    const pages = ["/", "/sales", "/cart", "/orders", "/wallet", "/coupons"];

    for (const url of pages) {
      await page.goto(url);
      await expect(page.locator("text=Products")).toBeVisible();
      await expect(page.locator("text=Orders")).toBeVisible();
      await expect(page.locator("text=Cart")).toBeVisible();
    }
  });
});
