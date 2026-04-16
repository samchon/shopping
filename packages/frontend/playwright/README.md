# Shopping Mall Frontend - E2E Tests

## Overview
Playwright end-to-end tests for the shopping mall frontend application.

## Setup

### Prerequisites
- Node.js 18+
- Playwright browsers (installed via pnpm exec playwright install)

### Installation
```bash
cd packages/frontend
pnpm install
pnpm exec playwright install
```

### Running Tests

**Run all tests:**
```bash
pnpm test
```

**Run with UI mode:**
```bash
pnpm test:ui
```

**Run specific project:**
```bash
pnpm test --project=chromium
```

**Run specific test file:**
```bash
pnpm test e2e/customer-flow.spec.ts
```

**Generate HTML report:**
```bash
pnpm test --reporter=html
# Then open: playwright-report/index.html
```

## Test Coverage

### Customer Flow (customer-flow.spec.ts)
- Customer portal display
- Login/signup navigation
- Product catalog browsing
- Product detail page
- Cart management
- Checkout flow
- Order history
- Wallet management

### Seller Flow (seller-flow.spec.ts)
- Seller login
- Seller console dashboard
- Sales management
- Order management

### Admin Flow (admin-flow.spec.ts)
- Admin login
- Admin console dashboard
- Sales overview
- Order management

## Configuration

Tests are configured in playwright/config.ts:
- Runs on http://127.0.0.1:3000
- Automatically starts dev server before tests
- Supports Chromium, Firefox, and WebKit
- Generates traces on first retry

## Demo Accounts

**Customer:**
- Email: customer1@nestia.io
- Password: seed1234

**Seller/Admin:**
- Email: robot@nestia.io
- Password: samchon

## CI/CD Integration

Tests run automatically on GitHub Actions:
- Runs on push to main branch
- Runs on pull requests
- Generates HTML report artifact
