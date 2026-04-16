# Shopping Mall Frontend Wiki

## Architecture

### Overview
This frontend is built with Next.js 15, TypeScript, and shadcn/ui. It follows a clean architecture pattern with:

- **Adapter Layer** (`src/adapters/`): SDK-specific code isolated from UI
- **Domain Models** (`src/types/`): Normalized business entities
- **Components** (`src/components/`): Reusable UI components
- **Hooks** (`src/hooks/`): Custom React hooks
- **Utils** (`src/utils/`): Helper functions

### Key Design Decisions

#### 1. SDK Isolation
The SDK (`@samchon/shopping-api`) is wrapped in an adapter layer to prevent SDK types from spreading across the UI. This makes it easier to replace or update the SDK in the future.

#### 2. Domain Models
Domain models normalize SDK types into business-friendly entities. For example:
- `IShoppingSale` → `Product` / `ProductDetail`
- `IShoppingCustomer` → `Customer`

#### 3. State Management
Currently using React hooks for state. For complex global state, consider:
- Zustand for lightweight state
- React Query for server state

## User Flows

### Customer Flow
1. **Browse Catalog** → View products by category
2. **Product Detail** → View options, stock, reviews
3. **Add to Cart** → Select options, add quantity
4. **Checkout** → Review cart, apply discounts, place order
5. **Order History** → View orders, track delivery
6. **Wallet** → Manage deposits, mileages, coupons

### Seller Flow
1. **Dashboard** → View sales, revenue, orders
2. **Manage Sales** → Create, edit, pause/resume sales
3. **Order Management** → Process orders, manage deliveries
4. **Inventory** → Update stock, manage options

### Admin Flow
1. **Dashboard** → Platform-wide metrics
2. **Sales Overview** → Monitor all sales
3. **Order Management** → View all orders
4. **Coupon Management** → Create and manage coupons
5. **Deposit/Mileage** → Manage financial operations

## API Endpoints

### Customer
- `POST /shoppings/customers/authenticate` - Create customer session
- `PUT /shoppings/customers/authenticate/login` - Login with member account
- `GET /shoppings/customers/sales` - List products
- `GET /shoppings/customers/sales/:id` - Get product details
- `GET /shoppings/customers/carts/commodities` - Get cart
- `POST /shoppings/customers/carts/commodities` - Add to cart
- `POST /shoppings/customers/orders` - Place order
- `GET /shoppings/customers/orders` - List orders

### Seller
- `PUT /shoppings/sellers/authenticate/login` - Login
- `GET /shoppings/sellers/sales` - List sales
- `POST /shoppings/sellers/sales` - Create sale
- `GET /shoppings/sellers/orders` - List orders

### Admin
- `PUT /shoppings/admins/authenticate/login` - Login
- `GET /shoppings/admins/sales` - List all sales
- `GET /shoppings/admins/orders` - List all orders

## Testing

### Playwright E2E Tests
Tests are located in `playwright/` directory.

Run tests:
```bash
pnpm test
```

Run UI mode:
```bash
pnpm test:ui
```

### Test Coverage
- Authentication flows
- Product browsing
- Cart operations
- Order placement
- Seller operations
- Admin operations

## Environment Variables

```env
NEXT_PUBLIC_API_HOST=http://127.0.0.1:37001
```

## Account Credentials

### Customer (Seed Accounts)
- Email: `customer1@nestia.io` to `customer8@nestia.io`
- Password: `seed1234`

### Seller/Admin
- Email: `robot@nestia.io`
- Password: `samchon`

## Development

### Start Development Server
```bash
cd packages/frontend
pnpm dev
```

### Build for Production
```bash
pnpm build
pnpm start
```

### Lint Code
```bash
pnpm lint
```

## Known Limitations

1. **Mock Data**: Currently hardcoded demo data until backend integration is complete
2. **Authentication**: Basic auth flow implemented, OAuth not yet added
3. **Real-time Updates**: No WebSocket integration yet
4. **Offline Support**: PWA features not implemented

## Future Enhancements

1. **Performance**
   - Image optimization
   - Code splitting
   - Lazy loading

2. **Features**
   - Product reviews and Q&A
   - Wishlist functionality
   - Advanced search and filtering
   - Push notifications

3. **Infrastructure**
   - CI/CD pipeline
   - Automated testing
   - Monitoring and analytics

## Troubleshooting

### Build Errors
- Ensure all dependencies are installed: `pnpm install`
- Clear Next.js cache: `rm -rf .next`
- Check TypeScript version compatibility

### Runtime Errors
- Verify API host is accessible
- Check browser console for errors
- Ensure backend is running on port 37001

### Authentication Issues
- Clear browser cookies
- Check token expiration
- Verify backend authentication service
