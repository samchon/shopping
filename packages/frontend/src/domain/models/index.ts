/**
 * Domain Models - Normalized types separate from SDK
 * These provide a clean interface for the UI layer
 */
import type * as SDK from "@samchon/shopping-api";

// Customer/Member
export interface Customer {
  id: string;
  name: string;
  email?: string;
  isMember: boolean;
}

// Product/Sale
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  options: ProductOption[];
  stock: number;
  seller: Seller;
}

export interface ProductOption {
  id: string;
  name: string;
  type: "selectable" | "descriptive";
  candidates?: OptionCandidate[];
}

export interface OptionCandidate {
  id: string;
  name: string;
  stock: number;
}

export interface Seller {
  id: string;
  name: string;
  rating: number;
}

// Cart
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedOptions: Record<string, string>;
  price: number;
}

// Order
export interface Order {
  id: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  createdAt: Date;
  deliveredAt?: Date;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

// Wallet
export interface Wallet {
  deposit: number;
  mileage: number;
}

// Coupon
export interface Coupon {
  id: string;
  name: string;
  discount: number;
  minPurchase: number;
  expiresAt: Date;
  isActive: boolean;
}

// Transformations from SDK to Domain - Simplified for SDK compatibility
export const transforms = {
  sdkCustomerToDomain: (sdk: SDK.IShoppingCustomer): Customer => ({
    id: sdk.id,
    name: "Customer",
    email: undefined,
    isMember: !!sdk.member,
  }),

  sdkSaleToProduct: (sdk: SDK.IShoppingSale): Product => ({
    id: sdk.id,
    title: sdk.content.title,
    description: sdk.content.body,
    price: 0,
    images: [],
    options: [],
    stock: 0,
    seller: {
      id: sdk.seller.id,
      name: "Seller",
      rating: 0,
    },
  }),

  sdkOrderToDomain: (sdk: SDK.IShoppingOrder): Order => ({
    id: sdk.id,
    status: sdk.publish?.paid_at ? "paid" : "pending",
    items: [],
    total: sdk.price.real,
    createdAt: new Date(sdk.created_at),
  }),
};
