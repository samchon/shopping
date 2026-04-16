# User Flows

This document describes the main user flows in the shopping mall application.

## Customer Flows

### 1. Guest Browsing Flow
```
1. Land on homepage
2. Browse product catalog
3. Filter/search products
4. View product details
5. (Optional) Add to cart
6. (Optional) Proceed to checkout → Redirect to login
```

### 2. Registration & Login Flow
```
Option A: New Member
1. Click "Sign In" → "Create Account"
2. Fill in email and password
3. Submit → Account created
4. Automatically logged in
5. Redirected to homepage

Option B: Existing Member
1. Click "Sign In"
2. Enter email and password
3. Submit → Authenticated
4. Redirected to homepage or previous page
```

### 3. Purchase Flow
```
1. Browse products (logged in)
2. Select product
3. Choose options (size, color, etc.)
4. Click "Add to Cart" or "Buy Now"
   - If "Add to Cart": Continue shopping or go to cart
   - If "Buy Now": Skip to checkout
5. Review cart items
6. Adjust quantities if needed
7. Click "Proceed to Checkout"
8. Review order details
9. Select delivery address
10. Apply coupons/mileage (optional)
11. Review final price
12. Click "Place Order"
13. Payment processing (simulated)
14. Order confirmation page
15. Order appears in "My Orders"
```

### 4. Order Management Flow
```
1. Navigate to "My Orders"
2. View order list with status
3. Click "View Details" on an order
4. See:
   - Order items
   - Delivery information
   - Order timeline
   - Payment details
5. (Optional) Download invoice
6. (Optional) Contact support
```

### 5. Wallet Management Flow
```
1. Navigate to "My Wallet"
2. View deposit and mileage balances
3. (Optional) Click "Deposit" to add funds
4. (Optional) View transaction history
5. (Optional) Use mileage for discounts at checkout
```

### 6. Coupon Management Flow
```
1. Navigate to "My Coupons"
2. View available and expired coupons
3. Click "Use Coupon" on an available coupon
4. Coupon applied at checkout
```

## Seller Flows

### 1. Product Management Flow
```
1. Login as seller
2. Navigate to "Seller Console"
3. Click "Create New Product"
4. Fill in product details:
   - Title and description
   - Category/section
   - Price
   - Options (size, color, etc.)
   - Stock quantities
   - Images (placeholder for now)
5. Set product status (active, paused, suspended)
6. Submit → Product created
7. Product appears in product list
```

### 2. Order Processing Flow
```
1. Login as seller
2. Navigate to "Orders"
3. View new orders
4. Click on an order to view details
5. Review order items and customer information
6. Click "Prepare for Shipment"
7. Enter shipping information
8. Click "Mark as Shipped"
9. Order status updated
```

### 3. Sales Management Flow
```
1. Navigate to "My Products"
2. View all product listings
3. Click "Edit" on a product
4. Update:
   - Price
   - Stock
   - Status (open/close/pause)
   - Details
5. Save changes
6. Changes reflected immediately
```

## Administrator Flows

### 1. Platform Monitoring Flow
```
1. Login as admin
2. View admin dashboard
3. Monitor:
   - Total revenue
   - Order counts
   - Active sellers
   - Customer growth
4. Navigate to detailed sections as needed
```

### 2. Policy Management Flow
```
1. Navigate to "Policy Management"
2. View current policies:
   - Shipping policies
   - Return policies
   - Coupon rules
   - Commission rates
3. Click "Edit" on a policy
4. Update policy details
5. Save → Policy updated system-wide
```

### 3. User Management Flow
```
1. Navigate to "User Management"
2. View list of all users (customers and sellers)
3. Search/filter users
4. Click on a user to view details
5. (Optional) Suspend/activate user
6. (Optional) View user activity
```

## Error Handling Flows

### 1. Authentication Errors
```
- Invalid credentials → Show error message
- Session expired → Redirect to login
- Token refresh failed → Logout and redirect to login
```

### 2. Order Errors
```
- Insufficient stock → Show warning, allow backorder or prevent order
- Payment failed → Show error, allow retry
- Invalid address → Show validation error
```

### 3. General Errors
```
- Network error → Show retry button
- Server error → Show friendly message, log error
- Invalid input → Show field-specific validation errors
```

## Mobile Responsive Flows

All flows are designed to work on:
- **Mobile** (< 640px): Single column, stacked layout
- **Tablet** (640px - 1024px): Two columns where appropriate
- **Desktop** (> 1024px): Full layout with sidebars

Key considerations:
- Touch-friendly buttons (min 44x44px)
- Readable text sizes
- Simplified navigation on mobile
- Swipeable product galleries
- Bottom navigation for key actions (mobile only)
