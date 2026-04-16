"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/utils/format";

const mockDeliveries = [
  { id: "1", trackingNumber: "TRK123456789", shipper: "CJ Logistics", status: "IN_TRANSIT", location: "Seoul Distribution Center", estimatedDelivery: "2024-01-17", history: [{ status: "ORDERED", occurredAt: "2024-01-15" }, { status: "SHIPPED", occurredAt: "2024-01-16" }, { status: "IN_TRANSIT", occurredAt: "2024-01-17" }] },
  { id: "2", trackingNumber: "TRK987654321", shipper: "Korea Post", status: "DELIVERED", location: "Delivered", estimatedDelivery: "2024-01-14", history: [{ status: "ORDERED", occurredAt: "2024-01-12" }, { status: "SHIPPED", occurredAt: "2024-01-13" }, { status: "DELIVERED", occurredAt: "2024-01-14" }] },
];

export default function SellerDeliveriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/seller" className="text-green-600 hover:underline">&larr; Back to Dashboard</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Delivery Management</h1>

        <div className="space-y-4">
          {mockDeliveries.map((delivery) => (
            <div key={delivery.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{delivery.trackingNumber}</h3>
                  <p className="text-sm text-gray-600">{delivery.shipper}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  delivery.status === "DELIVERED" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                }`}>{delivery.status}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Current Location</p>
                  <p className="font-medium">{delivery.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estimated Delivery</p>
                  <p className="font-medium">{formatDate(delivery.estimatedDelivery)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tracking Number</p>
                  <p className="font-medium text-sm">{delivery.trackingNumber}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Tracking History</h4>
                <div className="space-y-2">
                  {delivery.history.map((event, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        event.status === "DELIVERED" ? "bg-green-500" :
                        event.status === "IN_TRANSIT" ? "bg-blue-500" :
                        "bg-gray-400"
                      }`}></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{event.status}</p>
                        <p className="text-xs text-gray-500">{formatDate(event.occurredAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
