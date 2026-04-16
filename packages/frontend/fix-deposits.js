const fs = require('fs');

const adminDeposits = \"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/utils/format";

const mockDeposits = [
  { id: "1", customer: "John Doe", amount: 500000, status: "ACTIVE", created: "2024-01-01" },
  { id: "2", customer: "Jane Smith", amount: 300000, status: "ACTIVE", created: "2024-01-05" },
  { id: "3", customer: "Bob Wilson", amount: 100000, status: "REFUNDED", created: "2024-01-10" },
];

export default function AdminDepositsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/admin" className="text-purple-600 hover:underline">&larr; Back to Dashboard</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Deposit Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Deposits</h3>
            <p className="text-3xl font-bold text-gray-900">{formatPrice(900000)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Active Deposits</h3>
            <p className="text-3xl font-bold text-green-600">{formatPrice(800000)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Refunded</h3>
            <p className="text-3xl font-bold text-gray-900">{formatPrice(100000)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Customers</h3>
            <p className="text-3xl font-bold text-gray-900">3</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockDeposits.map((deposit) => (
                <tr key={deposit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{deposit.customer}</td>
                  <td className="px-6 py-4 font-semibold">{formatPrice(deposit.amount)}</td>
                  <td className="px-6 py-4">
                    <span className={\px-2 py-1 rounded-full text-xs font-medium \\}>{deposit.status}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{formatDate(deposit.created)}</td>
                  <td className="px-6 py-4">
                    <Button variant="outline" size="sm">View</Button>
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
\;

fs.writeFileSync('src/app/admin/deposits/page.tsx', adminDeposits, 'utf8');
console.log('Fixed admin/deposits/page.tsx');
