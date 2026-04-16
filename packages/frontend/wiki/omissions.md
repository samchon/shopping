# Intentional API Omissions

This document outlines SDK features that were intentionally NOT implemented in the frontend.

## Authentication & User Management

### ❌ External User Authentication
- **API**: `authenticate.external`
- **Reason**: Out of scope for MVP. Social login (Google, Facebook, etc.) can be added later.
- **Alternative**: Email/password login is fully functional.

### ❌ Citizenship Activation Flow
- **API**: `authenticate.activate`
- **Reason**: Real-name verification requires integration with Korean verification services.
- **Alternative**: Simplified signup without real-name verification for demo purposes.

## Seller Features

### ❌ Seller Onboarding Application
- **API**: Seller registration endpoints
- **Reason**: Sellers are pre-created in the system for demonstration.
- **Alternative**: Admin can create seller accounts directly.

### ❌ Sale Studio (Product Cloning)
- **API**: Sale replication endpoints
- **Reason**: Advanced feature not critical for core shopping flow.
- **Alternative**: Sellers can create products from scratch.

## Admin Features

### ❌ Advanced Analytics Dashboard
- **API**: Various aggregate and statistical endpoints
- **Reason**: Full analytics would require charting libraries and complex data processing.
- **Alternative**: Basic stats are shown on admin dashboard.

### ❌ Bulk Operations
- **API**: Bulk update/delete endpoints
- **Reason**: Power user feature, not needed for core functionality.
- **Alternative**: Individual item management is available.

## Customer Features

### ❌ Wishlist
- **API**: No SDK support
- **Reason**: Not available in the backend SDK.
- **Alternative**: Direct "Add to Cart" or "Buy Now".

### ❌ Product Comparison
- **API**: No SDK support
- **Reason**: Not available in the backend SDK.
- **Alternative**: Customers can open products in new tabs.

### ❌ Advanced Search Filters
- **API**: Complex search parameters available but not fully utilized
- **Reason**: Basic search meets MVP requirements.
- **Alternative**: Simple keyword search and category filtering.

## Payment & Checkout

### ❌ Multiple Payment Methods
- **API**: Payment gateway integrations
- **Reason**: Actual payment processing requires merchant accounts and integration.
- **Alternative**: Simulated payment flow for demonstration.

### ❌ Split Payments
- **API**: Partial payment with multiple methods
- **Reason**: Complex feature not needed for core flow.
- **Alternative**: Single payment method per order.

## Notifications

### ❌ Real-time Notifications
- **API**: WebSocket or push notification endpoints
- **Reason**: Would require additional infrastructure (Socket.io, Firebase, etc.).
- **Alternative**: Email notifications (backend-only) and manual checking.

### ❌ Order Status Updates
- **API**: Push-based status updates
- **Reason**: Polling-based updates are sufficient for MVP.
- **Alternative**: Customers can check order status in "My Orders".

## Reporting

### ❌ Export Functions
- **API**: CSV/Excel export endpoints
- **Reason**: Power user feature for sellers/admins.
- **Alternative**: Data can be viewed in-table.

## Why These Omissions?

1. **Focus on Core Flow**: The primary goal is to demonstrate a working e-commerce platform with the main user journey (browse → cart → checkout → order).

2. **SDK-Driven Development**: We only implement features that the SDK supports and that add clear value to the user experience.

3. **Progressive Enhancement**: The architecture allows easy addition of these features later without refactoring.

4. **Demonstration Purpose**: This project showcases AI-generated frontend from a Nestia SDK, not a production-ready e-commerce platform.

## Future Considerations

If building for production, consider implementing:
- Full payment gateway integration
- Real-time order tracking
- Advanced search with facets
- Wishlist and saved searches
- Social login
- Email/SMS notifications
- Analytics dashboard with charts
- Admin bulk operations
- CSV imports/exports
