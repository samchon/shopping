"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/utils/format";

const mockOrders = [
  { id: "1", orderNumber: "ORD-2024-101", customer: "John Doe", total: 1999000, status: "PENDING", date: "2024-01-15" },
  { id: "2", orderNumber: "ORD-2024-102", customer: "Jane Smith", total: 598000, status: "PROCESSING", date: "2024-01-14" },
  { id: "3", orderNumber: "ORD-2024-103", customer: "Bob Wilson", total: 299000, status: "SHIPPED", date: "2024-01-13" },
];

export default function SellerOrdersPage() {
  const [filter, setFilter] = useState("all");
  const filteredOrders = filter === "all" ? mockOrders : mockOrders.filter(o => o.status.toLowerCase() === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/seller" className="text-green-600 hover:underline">&larr; Back to Dashboard</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Orders</h1>

        <div className="flex space-x-4 mb-6">
          {["all", "pending", "processing", "shipped", "delivered"].map((status) => (
            <button key={status} onClick={() => setFilter(status)} className={`px-4 py-2 rounded-lg font-medium ${filter === status ? "bg-green-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{order.orderNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{formatDate(order.date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                      order.status === "PROCESSING" ? "bg-blue-100 text-blue-800" :
                      "bg-green-100 text-green-800"
                    }`}>{order.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/seller/orders/${order.id}`}>
                      <Button variant="outline" size="sm">View</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
