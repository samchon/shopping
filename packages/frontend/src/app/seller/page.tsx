"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, createConnection } from "@/adapters/api";
import { Button } from "@/components/ui/button";
import type { Customer, Product } from "@/types/domain";
import { formatPrice } from "@/utils/format";

export default function SellerPage() {
  const router = useRouter();
  const [seller, setSeller] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const connection = createConnection();
      const result = await api.sellers.authenticate.get(connection);
      if (result) {
        setSeller(result);
      } else {
        router.push("/seller/login");
      }
    } catch (err) {
      router.push("/seller/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-green-600">
              Seller Console
            </Link>
            <div className="flex items-center space-x-4">
              {seller && (
                <>
                  <span className="text-gray-700">
                    Welcome, {seller.name}
                  </span>
                  <Link href="/seller/sales">
                    <Button variant="outline">My Sales</Button>
                  </Link>
                  <Link href="/seller/orders">
                    <Button variant="outline">Orders</Button>
                  </Link>
                  <Link href="/seller/deliveries">
                    <Button variant="outline">Deliveries</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-green-600 rounded-lg p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Seller Console</h1>
          <p className="text-green-100">
            Manage your sales, orders, and inventory
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Revenue</h3>
            <p className="text-2xl font-bold text-gray-900">$12,345</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Active Sales</h3>
            <p className="text-2xl font-bold text-gray-900">24</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Pending Orders</h3>
            <p className="text-2xl font-bold text-gray-900">8</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Orders</h3>
            <p className="text-2xl font-bold text-gray-900">156</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/seller/sales/new">
              <Button className="w-full">Create New Sale</Button>
            </Link>
            <Link href="/seller/sales">
              <Button variant="outline" className="w-full">Manage Sales</Button>
            </Link>
            <Link href="/seller/orders/pending">
              <Button variant="outline" className="w-full">Process Orders</Button>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Order #ORD-00{i}</p>
                  <p className="text-sm text-gray-500">3 items ??$299.99</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    Pending
                  </span>
                  <Link href={`/seller/orders/${i}`}>
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gray-400 text-sm">
            © 2024 Shopping Mall Seller Console
          </p>
        </div>
      </footer>
    </div>
  );
}
