"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/format";

const mockMileages = [
  { id: "1", customer: "John Doe", amount: 10000, earned: 8000, used: 2000, status: "ACTIVE" },
  { id: "2", customer: "Jane Smith", amount: 5000, earned: 5000, used: 0, status: "ACTIVE" },
  { id: "3", customer: "Bob Wilson", amount: 15000, earned: 12000, used: 3000, status: "ACTIVE" },
];

export default function AdminMileagesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/admin" className="text-purple-600 hover:underline">&larr; Back to Dashboard</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mileage Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Mileage</h3>
            <p className="text-3xl font-bold text-gray-900">{formatPrice(30000)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Earned</h3>
            <p className="text-3xl font-bold text-green-600">{formatPrice(25000)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Used</h3>
            <p className="text-3xl font-bold text-red-600">{formatPrice(5000)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Active Users</h3>
            <p className="text-3xl font-bold text-gray-900">3</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Earned</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Used</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockMileages.map((mileage) => (
                <tr key={mileage.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{mileage.customer}</td>
                  <td className="px-6 py-4 font-semibold text-blue-600">{formatPrice(mileage.amount)}</td>
                  <td className="px-6 py-4 text-green-600">+{formatPrice(mileage.earned)}</td>
                  <td className="px-6 py-4 text-red-600">-{formatPrice(mileage.used)}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">{mileage.status}</span>
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
