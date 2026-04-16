import { getShoppingAPI } from "@/lib";
import type { IPage, IShoppingSale } from "@samchon/shopping-api";

export default async function Products() {
  const api = getShoppingAPI();

  // Fetch products from the API
  let products: IShoppingSale.ISummary[] = [];
  try {
    const result: IPage<IShoppingSale.ISummary> = await api.customer.sales.listSummary();
    products = result.data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Products</h1>
        
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full max-w-md px-4 py-2 rounded-md border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow"
              >
                <div className="h-48 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                  <span className="text-zinc-500">
                    {product.content?.title || "Product Image"}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">
                    {product.content?.title || "Unknown Product"}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    ${product.price_range.lowest.real || 0} - ${product.price_range.highest.real || 0}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 bg-zinc-900 text-zinc-50 py-2 rounded-md hover:bg-zinc-800">
                      Details
                    </button>
                    <button className="flex-1 bg-zinc-100 dark:bg-zinc-800 py-2 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-zinc-600 dark:text-zinc-400">
              No products found.
            </p>
            <button className="mt-4 px-6 py-2 bg-zinc-900 text-zinc-50 rounded-md hover:bg-zinc-800">
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
