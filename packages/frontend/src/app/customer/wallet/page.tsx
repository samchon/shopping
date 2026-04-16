"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/format";

const mockWallet = {
  deposit: 500000,
  mileage: 10000,
  coupons: [
    { id: "1", name: "New User 10% Off", discountValue: 10, type: "PERCENTAGE", validUntil: "2024-12-31" },
    { id: "2", name: "50,000 KRW Coupon", discountValue: 50000, type: "FIXED", validUntil: "2024-06-30" },
  ],
  couponTickets: [
    { id: "1", couponName: "Free Shipping", claimedAt: "2024-01-10" },
  ],
};

const mockDepositHistory = [
  { id: "1", type: "CHARGE", amount: 500000, balanceAfter: 500000, createdAt: "2024-01-01T10:00:00Z", memo: "Initial deposit" },
  { id: "2", type: "USE", amount: -100000, balanceAfter: 400000, createdAt: "2024-01-15T14:30:00Z", memo: "Order payment" },
];

const mockMileageHistory = [
  { id: "1", type: "EARN", amount: 5000, balanceAfter: 5000, createdAt: "2024-01-10T09:00:00Z", memo: "Purchase reward" },
  { id: "2", type: "USE", amount: -1000, balanceAfter: 4000, createdAt: "2024-01-20T16:00:00Z", memo: "Order discount" },
];

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "deposits" | "mileages" | "coupons">("overview");

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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wallet</h1>

        <div className="flex space-x-4 mb-8">
          {["overview", "deposits", "mileages", "coupons"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-lg font-medium ${
                activeTab === tab ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-gray-600 mb-2">Deposit Balance</h2>
              <p className="text-3xl font-bold text-blue-600">{formatPrice(mockWallet.deposit)}</p>
              <Link href="/customer/deposits/charge">
                <Button className="mt-4">Charge Deposit</Button>
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-gray-600 mb-2">Mileage Balance</h2>
              <p className="text-3xl font-bold text-green-600">{mockWallet.mileage.toLocaleString()} KRW</p>
              <Button variant="outline" className="mt-4">Use Mileage</Button>
            </div>
          </div>
        )}

        {activeTab === "deposits" && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Deposit History</h2>
            </div>
            <div className="divide-y">
              {mockDepositHistory.map((history) => (
                <div key={history.id} className="p-6 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{history.memo}</p>
                    <p className="text-sm text-gray-600">{new Date(history.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      {history.amount > 0 ? "+" : ""}{formatPrice(history.amount)}
                    </p>
                    <p className="text-sm text-gray-600">Balance: {formatPrice(history.balanceAfter)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "mileages" && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Mileage History</h2>
            </div>
            <div className="divide-y">
              {mockMileageHistory.map((history) => (
                <div key={history.id} className="p-6 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{history.memo}</p>
                    <p className="text-sm text-gray-600">{new Date(history.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      {history.amount > 0 ? "+" : ""}{history.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Balance: {history.balanceAfter.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "coupons" && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">My Coupons</h2>
              {mockWallet.coupons.map((coupon) => (
                <div key={coupon.id} className="border rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{coupon.name}</h3>
                      <p className="text-sm text-gray-600">
                        {coupon.type === "PERCENTAGE" ? `${coupon.discountValue}% OFF` : `${coupon.discountValue} KRW OFF`}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Valid until: {new Date(coupon.validUntil).toLocaleDateString()}</p>
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Coupon Tickets</h2>
              {mockWallet.couponTickets.map((ticket) => (
                <div key={ticket.id} className="border rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{ticket.couponName}</h3>
                      <p className="text-sm text-gray-600">Claimed on {new Date(ticket.claimedAt).toLocaleDateString()}</p>
                    </div>
                    <Button variant="outline" size="sm">Use Now</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
