import { SharedLayout } from "@/components/shared-layout";

export default function Home() {
  return (
    <SharedLayout>
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Welcome to Shopping Mall
        </h1>
        <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mb-8">
          Discover thousands of products from verified sellers. 
          Secure checkout, fast delivery, and amazing deals.
        </p>
        <div className="flex gap-4">
          <a href="/products">
            <button className="px-8 py-3 bg-zinc-900 text-zinc-50 rounded-md hover:bg-zinc-800 font-semibold text-lg">
              Browse Products
            </button>
          </a>
          <a href="/login">
            <button className="px-8 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 font-semibold text-lg">
              Learn More
            </button>
          </a>
        </div>
      </section>
    </SharedLayout>
  );
}
