"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, createConnection } from "@/adapters/api";
import { Button } from "@/components/ui/button";
import type { Customer, Product } from "@/types/domain";
import { formatPrice } from "@/utils/format";

export default function CustomerPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    checkAuth();
    fetchProducts();
  }, []);

  const checkAuth = async () => {
    try {
      const connection = createConnection();
      await api.customers.authenticate.get(connection);
      setCustomer({ id: "1", name: "Test User", email: "test@example.com", phone: "" });
    } catch (err) {
      // Not authenticated, that's okay
      console.log("Not authenticated");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const connection = createConnection();
      await api.customers.sales.index(connection, {
        limit: 20,
        offset: 0,
      });
      setProducts([
        { id: "1", name: "Test Product", description: "Test", price: 10000, originalPrice: 15000, images: [], category: "Test", channel: "Test", section: "Test", sellerId: "1", sellerName: "Test Seller", stock: 100, available: true },
      ]);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Shopping Mall
            </Link>
            <div className="flex items-center space-x-4">
              {customer ? (
                <>
                  <span className="text-gray-700">
                    Welcome, {customer.name}
                  </span>
                  <Link href="/customer/cart">
                    <Button variant="outline">Cart</Button>
                  </Link>
                  <Link href="/customer/orders">
                    <Button variant="outline">Orders</Button>
                  </Link>
                  <Link href="/customer/wallet">
                    <Button variant="outline">Wallet</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/customer/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link href="/customer/signup">
                    <Button>Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-blue-600 rounded-lg p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome to Shopping Mall</h1>
          <p className="text-blue-100">
            Discover amazing products at great prices
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          {products.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">No products available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/customer/product/${product.id}`}
                  className="block"
                >
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-blue-600">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
