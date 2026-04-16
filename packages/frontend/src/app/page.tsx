import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Shopping Mall
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Enterprise-scale shopping mall application
        </p>
        <div className="space-y-4">
          <Link
            href="/customer"
            className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Customer Portal
          </Link>
          <Link
            href="/seller"
            className="block w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Seller Portal
          </Link>
          <Link
            href="/admin"
            className="block w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Administrator Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
