"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/format";

const mockSales = [
  { id: "1", seller: "Tech Store", name: "MacBook Pro", sales: 45, revenue: 89955000, status: "ACTIVE" },
  { id: "2", seller: "Phone Hub", name: "iPhone 15", sales: 128, revenue: 166272000, status: "ACTIVE" },
  { id: "3", seller: "Audio World", name: "AirPods Pro", sales: 234, revenue: 69966000, status: "PAUSED" },
];

export default function AdminSalesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/admin" className="text-purple-600 hover:underline">&larr; Back to Dashboard</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Platform Sales Overview</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Sales</h3>
            <p className="text-3xl font-bold text-gray-900">407</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-green-600">{formatPrice(326193000)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Active Sellers</h3>
            <p className="text-3xl font-bold text-gray-900">15</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{sale.seller}</td>
                  <td className="px-6 py-4 font-medium">{sale.name}</td>
                  <td className="px-6 py-4">{sale.sales}</td>
                  <td className="px-6 py-4 font-semibold text-green-600">{formatPrice(sale.revenue)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sale.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>{sale.status}</span>
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
