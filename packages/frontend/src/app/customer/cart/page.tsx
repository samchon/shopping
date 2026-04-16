"use client";

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

  const updateQuantity = (id: string, delta: number) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 0;
  const total = subtotal - discount;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/customer" className="text-blue-600 hover:underline">
            &larr; Continue Shopping
          </Link>
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
