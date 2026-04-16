"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const mockPolicies = [
  { id: "1", title: "Return Policy", category: "Customer Service", lastUpdated: "2024-01-10", status: "ACTIVE" },
  { id: "2", title: "Privacy Policy", category: "Legal", lastUpdated: "2024-01-05", status: "ACTIVE" },
  { id: "3", title: "Terms of Service", category: "Legal", lastUpdated: "2024-01-01", status: "ACTIVE" },
  { id: "4", title: "Shipping Policy", category: "Operations", lastUpdated: "2023-12-20", status: "ACTIVE" },
];

export default function AdminPoliciesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/admin" className="text-purple-600 hover:underline">&larr; Back to Dashboard</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Policy Management</h1>
          <Button className="bg-purple-600 hover:bg-purple-700">Create Policy</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPolicies.map((policy) => (
            <div key={policy.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg">{policy.title}</h3>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">{policy.status}</span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Category</span>
                  <span className="font-medium text-sm">{policy.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Last Updated</span>
                  <span className="font-medium text-sm">{new Date(policy.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">Edit</Button>
                <Button variant="outline" className="flex-1">View</Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
