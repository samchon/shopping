"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/format";

const mockCoupons = [
  { id: "1", name: "New User 10% Off", type: "PERCENTAGE", value: 10, minPurchase: 50000, validUntil: "2024-12-31", usageLimit: 1000, usedCount: 234, status: "ACTIVE" },
  { id: "2", name: "50,000 KRW Coupon", type: "FIXED", value: 50000, minPurchase: 200000, validUntil: "2024-06-30", usageLimit: 500, usedCount: 123, status: "ACTIVE" },
  { id: "3", name: "Free Shipping", type: "FIXED", value: 3000, minPurchase: 0, validUntil: "2024-03-31", usageLimit: 2000, usedCount: 1456, status: "ACTIVE" },
];

export default function AdminCouponsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/admin" className="text-purple-600 hover:underline">&larr; Back to Dashboard</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Coupon Management</h1>
          <Button className="bg-purple-600 hover:bg-purple-700">Create Coupon</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCoupons.map((coupon) => (
            <div key={coupon.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg">{coupon.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${coupon.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>{coupon.status}</span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium">{coupon.type === "PERCENTAGE" ? `${coupon.value}% OFF` : `₩${coupon.value.toLocaleString()} OFF`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Min Purchase</span>
                  <span className="font-medium">{formatPrice(coupon.minPurchase)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valid Until</span>
                  <span className="font-medium">{new Date(coupon.validUntil).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Usage</span>
                  <span className="font-medium">{coupon.usedCount} / {coupon.usageLimit}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">Edit</Button>
                <Button variant="outline" className="flex-1">View Details</Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
