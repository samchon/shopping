"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api, createConnection } from "@/adapters/api";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/format";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const connection = createConnection();
      await api.customers.sales.at(connection, productId);
    } catch (err) {
      console.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/customer" className="text-blue-600 hover:underline">
            &larr; Back to Catalog
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Product Details</h1>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600">Product details will be displayed here.</p>
        </div>
      </main>
    </div>
  );
}
