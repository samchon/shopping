import { ShoppingAPI } from "@/lib/api";

// Default API configuration
const DEFAULT_API_HOST = process.env.NEXT_PUBLIC_API_HOST || "http://127.0.0.1:37001";

// Create a singleton API instance
let apiInstance: ShoppingAPI | null = null;

export function getShoppingAPI(): ShoppingAPI {
  if (!apiInstance) {
    apiInstance = new ShoppingAPI({
      host: DEFAULT_API_HOST,
      simulate: false, // Set to true for simulation mode
    });
  }
  return apiInstance;
}
