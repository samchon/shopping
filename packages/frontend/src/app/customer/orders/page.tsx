"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/utils/format";

const mockOrders = [
  { id: "1", orderNumber: "ORD-2024-001", status: "PAID", items: [{ name: "MacBook Pro", quantity: 1, price: 1999000 }], subtotal: 1999000, discount: 0, total: 1999000, createdAt: "2024-01-15T10:30:00Z", paidAt: "2024-01-15T11:00:00Z" },
  { id: "2", orderNumber: "ORD-2024-002", status: "SHIPPED", items: [{ name: "AirPods Pro", quantity: 2, price: 299000 }], subtotal: 598000, discount: 50000, total: 548000, createdAt: "2024-01-14T14:20:00Z", paidAt: "2024-01-14T15:00:00Z", shippedAt: "2024-01-15T09:00:00Z" },
  { id: "3", orderNumber: "ORD-2024-003", status: "PENDING", items: [{ name: "iPhone 15", quantity: 1, price: 1299000 }], subtotal: 1299000, discount: 0, total: 1299000, createdAt: "2024-01-13T16:45:00Z" },
];

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-green-100 text-green-800",
  DELIVERED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const [filter, setFilter] = useState("all");
  const filteredOrders = filter === "all" ? mockOrders : mockOrders.filter(o => o.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/customer" className="text-blue-600 hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Orders</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{order.orderNumber}</h3>
                  <p className="text-sm text-gray-600">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status] || "bg-gray-100"}`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-xl font-bold text-blue-600">{formatPrice(order.total)}</p>
                </div>
                <Link href={`/customer/orders/${order.id}`}>
                  <Button>View Details</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
