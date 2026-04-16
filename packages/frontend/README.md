# Shopping Mall Frontend

A complete, enterprise-scale shopping mall frontend built with Next.js 15, TypeScript, and shadcn/ui.

## Features

### Customer Portal
- **Product Catalog**: Browse products with filtering and search
- **Product Details**: View product options, stock, and reviews
- **Shopping Cart**: Manage cart items with quantity controls
- **Checkout**: Multi-step checkout with shipping and payment
- **Order History**: View and track all orders
- **Wallet**: Manage deposits, mileages, and coupons

### Seller Console
- **Dashboard**: Revenue, sales, and order metrics
- **Sales Management**: Create and manage product listings
- **Order Processing**: Fulfill and track orders
- **Delivery Management**: Manage shipping and tracking

### Administrator Console
- **Platform Overview**: System-wide metrics and analytics
- **Sales Management**: Monitor all seller sales
- **Order Management**: View and manage all orders
- **Financial Controls**: Manage deposits and mileages
- **Coupon Management**: Create and manage promotional coupons

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Hooks
- **API Client**: Nestia Fetcher
- **Testing**: Playwright
- **Build Tool**: pnpm

## Project Structure

```
packages/frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── customer/          # Customer portal pages
│   │   ├── seller/            # Seller console pages
│   │   ├── admin/             # Admin console pages
│   │   └── layout.tsx         # Root layout
│   ├── adapters/              # SDK API wrapper layer
│   │   └── api.ts             # API client configuration
│   ├── components/            # Reusable UI components
│   │   └── ui/                # shadcn/ui components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   │   └── utils.ts           # Class name utilities
│   ├── store/                 # State management (future)
│   ├── types/                 # Domain models
│   │   └── domain.ts          # Business entity types
│   └── utils/                 # Helper functions
│       └── format.ts          # Formatting utilities
├── playwright/                # E2E tests
│   ├── config.ts              # Playwright configuration
│   ├── e2e/                   # Test files
│   └── README.md              # Test documentation
├── wiki/                      # Documentation
│   └── README.md              # Architecture docs
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Backend running on http://127.0.0.1:37001

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at http://127.0.0.1:3000

### Building for Production

```bash
# Build optimized production bundle
pnpm build

# Start production server
pnpm start
```

## Configuration

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_HOST=http://127.0.0.1:37001
```

### API Configuration

The API host can be configured via:
- Environment variable: `NEXT_PUBLIC_API_HOST`
- Default: `http://127.0.0.1:37001`

## Testing

### Run E2E Tests

```bash
# Install Playwright browsers
pnpm exec playwright install

# Run all tests
pnpm test

# Run with UI mode
pnpm test:ui

# Generate HTML report
pnpm test --reporter=html
```

### Test Coverage

- Customer flows (catalog, cart, checkout, orders, wallet)
- Seller flows (login, dashboard, sales, orders)
- Admin flows (login, dashboard, sales, orders)

## Demo Accounts

### Customer Accounts
- **Email**: customer1@nestia.io through customer8@nestia.io
- **Password**: seed1234

### Seller/Admin Account
- **Email**: robot@nestia.io
- **Password**: samchon

## Architecture

### SDK Isolation Pattern

The frontend follows a strict separation of concerns:

1. **Adapter Layer** (`src/adapters/`): Wraps the Nestia SDK, isolating SDK-specific code
2. **Domain Models** (`src/types/`): Normalized business entities independent of SDK types
3. **UI Components** (`src/app/`): Purely dependent on domain models

This pattern ensures:
- Easy SDK replacement or upgrade
- Clear separation between business logic and API calls
- Testable domain models independent of API implementation

### State Management

Current implementation uses:
- React Hooks for local component state
- URL state for navigation
- Server Components for data fetching (future enhancement)

For complex global state, consider:
- Zustand for lightweight state
- React Query for server state caching

## Design Principles

1. **Mobile-First**: Responsive design for all screen sizes
2. **Content-First**: Clean, readable layouts
3. **Accessibility**: ARIA labels and keyboard navigation
4. **Performance**: Optimized images and code splitting
5. **Type Safety**: Full TypeScript coverage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `pnpm test`
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub
- Check the wiki documentation
- Review the CLAUDE.md guidelines

## Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Nestia](https://nestia.io/)
- [Playwright](https://playwright.dev/)
