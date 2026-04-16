const fs = require("fs");
const path = require("path");

const files = {
  "admin/deposits/page.tsx": `"use client";

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
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      deposit.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}>{deposit.status}</span>
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
`,
  "admin/orders/page.tsx": `"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/utils/format";

const mockOrders = [
  { id: "1", orderNumber: "ORD-2024-001", customer: "John Doe", seller: "Tech Store", total: 1999000, status: "PAID", date: "2024-01-15" },
  { id: "2", orderNumber: "ORD-2024-002", customer: "Jane Smith", seller: "Phone Hub", total: 1299000, status: "SHIPPED", date: "2024-01-14" },
  { id: "3", orderNumber: "ORD-2024-003", customer: "Bob Wilson", seller: "Audio World", total: 598000, status: "PENDING", date: "2024-01-13" },
];

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState("all");
  const filteredOrders = filter === "all" ? mockOrders : mockOrders.filter(o => o.status.toLowerCase() === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/admin" className="text-purple-600 hover:underline">&larr; Back to Dashboard</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">All Orders</h1>

        <div className="flex space-x-4 mb-6">
          {["all", "pending", "paid", "shipped", "delivered"].map((status) => (
            <button key={status} onClick={() => setFilter(status)} className={`px-4 py-2 rounded-lg font-medium ${filter === status ? "bg-purple-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{order.orderNumber}</td>
                  <td className="px-6 py-4">{order.customer}</td>
                  <td className="px-6 py-4">{order.seller}</td>
                  <td className="px-6 py-4 font-semibold">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4 text-gray-600">{formatDate(order.date)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "PAID" ? "bg-blue-100 text-blue-800" :
                      order.status === "SHIPPED" ? "bg-green-100 text-green-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>{order.status}</span>
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
`,
  "admin/sales/page.tsx": `"use client";

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
`,
  "customer/cart/page.tsx": `"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/format";

const mockCartItems = [
  { id: "1", productId: "prod-1", productName: "MacBook Pro 14-inch", price: 1999000, quantity: 1, optionIds: { color: "space gray", ram: "16GB" }, stockId: "stock-1", image: "https://example.com/macbook.jpg" },
  { id: "2", productId: "prod-2", productName: "AirPods Pro", price: 299000, quantity: 2, optionIds: {}, stockId: "stock-2", image: "https://example.com/airpods.jpg" },
];

export default function CartPage() {
  const [items, setItems] = useState(mockCartItems);

  const updateQuantity = (id, delta) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 0;
  const total = subtotal - discount;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/customer" className="text-blue-600 hover:underline">&larr; Continue Shopping</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Link href="/customer">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex gap-4">
                    <div className="w-32 h-32 bg-gray-200 rounded-lg flex-shrink-0">
                      <img src={item.image} alt={item.productName} className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{item.productName}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {Object.entries(item.optionIds).map(([key, value]) => (
                          <span key={key}>{key}: {value} </span>
                        ))}
                      </p>
                      <p className="text-blue-600 font-bold mb-4">{formatPrice(item.price)}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" onClick={() => updateQuantity(item.id, -1)}>-</Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button variant="outline" onClick={() => updateQuantity(item.id, 1)}>+</Button>
                        </div>
                        <Button variant="ghost" onClick={() => removeItem(item.id)} className="text-red-600">
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">{formatPrice(total)}</span>
                  </div>
                </div>
                <Link href="/customer/checkout">
                  <Button className="w-full py-6 text-lg">Proceed to Checkout</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
`,
  "customer/orders/page.tsx": `"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/utils/format";

const mockOrders = [
  { id: "1", orderNumber: "ORD-2024-001", status: "PAID", items: [{ name: "MacBook Pro", quantity: 1, price: 1999000 }], subtotal: 1999000, discount: 0, total: 1999000, createdAt: "2024-01-15T10:30:00Z", paidAt: "2024-01-15T11:00:00Z" },
  { id: "2", orderNumber: "ORD-2024-002", status: "SHIPPED", items: [{ name: "AirPods Pro", quantity: 2, price: 299000 }], subtotal: 598000, discount: 50000, total: 548000, createdAt: "2024-01-14T14:20:00Z", paidAt: "2024-01-14T15:00:00Z", shippedAt: "2024-01-15T09:00:00Z" },
  { id: "3", orderNumber: "ORD-2024-003", status: "PENDING", items: [{ name: "iPhone 15", quantity: 1, price: 1299000 }], subtotal: 1299000, discount: 0, total: 1299000, createdAt: "2024-01-13T16:45:00Z" },
];

const statusColors = {
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
`;

const baseDir = "D:/github/samchon/nestia.examples/shopping/packages/frontend/src/app";

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(baseDir, filePath);
  fs.writeFileSync(fullPath, content, "utf8");
  console.log("Fixed:", filePath);
});

console.log("All files fixed successfully!");
