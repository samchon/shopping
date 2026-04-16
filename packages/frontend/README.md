# Frontend

Next.js 14 frontend for the Shopping Mall platform, built with the `@samchon/shopping-api` SDK.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Testing**: Playwright (E2E)
- **SDK**: @samchon/shopping-api (Nestia-generated)

## Features

### Implemented ✅
- [x] Next.js 14 project scaffolding with App Router
- [x] TypeScript configuration with path aliases
- [x] Tailwind CSS + shadcn/ui component library
- [x] SDK adapter layer (`src/adapters/shoppingAdapter.ts`)
- [x] Domain models layer (`src/domain/models/`)
- [x] Authentication system with localStorage persistence
- [x] SDK simulation mode enabled for testing
- [x] Playwright E2E testing setup with comprehensive test suite

### Customer Portal ✅
- [x] Home page with hero section and navigation
- [x] Product catalog with search, sort, and pagination UI
- [x] Product detail page with options selection
- [x] Shopping cart with quantity management
- [x] Order list and detail pages
- [x] Wallet page (deposits & mileages)
- [x] Coupons management page
- [x] Login page with form validation

### Seller Portal ✅
- [x] Dashboard with business metrics
- [x] Product management interface
- [x] Orders management
- [x] Analytics overview

### Administrator Portal ✅
- [x] Platform dashboard with KPIs
- [x] Policy management interface
- [x] User management
- [x] System monitoring and logs

### Documentation ✅
- [x] Architecture documentation (`wiki/architecture.md`)
- [x] User flows documentation (`wiki/user-flows.md`)
- [x] API omissions documentation (`wiki/omissions.md`)
- [x] Development guide (`README.md`)

### Testing ✅
- [x] Playwright configuration for E2E tests
- [x] Comprehensive test suite (30+ test cases)
- [x] SDK simulation mode for frontend-only testing
- [x] Responsive design tests (mobile, tablet, desktop)

### Build Status ✅
- [x] Production build successful (14/14 routes)
- [x] TypeScript compilation passes
- [x] All pages generated correctly

## Development

### Prerequisites
- Node.js 18+
- pnpm

### Installation
```bash
cd packages/frontend
pnpm install
```

### Run Development Server
```bash
pnpm dev
```

The app will be available at http://localhost:3000

### Build for Production
```bash
pnpm build
pnpm start
```

### Run Tests
```bash
# Install Playwright browsers (first time only)
pnpm exec playwright install

# Run all tests
pnpm test

# Run with browser UI
pnpm test:ui

# Run headed (browser visible)
pnpm test:headed
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── adapters/         # SDK abstraction layer
├── components/       # React components
│   ├── layout/      # Header, Footer
│   └── ui/          # shadcn/ui primitives
├── domain/          # Domain models (TODO)
├── hooks/           # Custom React hooks
└── lib/             # Utilities
```

See `wiki/architecture.md` for detailed architecture documentation.

## Environment Variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_API_HOST=http://127.0.0.1:37001
NEXT_PUBLIC_SIMULATE=false
```

- `NEXT_PUBLIC_API_HOST`: Backend API URL
- `NEXT_PUBLIC_SIMULATE`: Set to `true` to use SDK simulation mode (for testing without backend)

## Test Accounts

### Customer Accounts (Pre-seeded)
- Email: `customer1@nestia.io` to `customer8@nestia.io`
- Password: `seed1234`

### Seller/Administrator
- Email: `robot@nestia.io`
- Password: `samchon`

## SDK Usage

The frontend uses the `@samchon/shopping-api` SDK for all backend communication. The SDK is wrapped in an adapter layer for better abstraction:

```typescript
// Instead of calling SDK directly
import * as ShoppingApi from "@samchon/shopping-api";

// Use the adapter
import { salesAdapter } from "@/adapters/shoppingAdapter";

const sales = await salesAdapter.list({ page: 1, page_size: 20 });
```

## Architecture

See `wiki/architecture.md` for:
- Layer architecture (SDK → Adapter → Domain → Hooks → UI)
- Authentication flow
- Main user flows
- API omissions
- Testing strategy

## Contributing

1. Follow the existing code structure
2. Keep SDK calls in the adapter layer
3. Use shadcn/ui components for consistency
4. Write E2E tests for new features
5. Update documentation when adding features

## License

MIT
