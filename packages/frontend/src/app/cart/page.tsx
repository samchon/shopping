import { getShoppingAPI } from "@/lib";

export default async function Cart() {
  const api = getShoppingAPI();

  // Fetch cart items from the API
  let cartItems: any[] = [];
  try {
    const result = await api.customer.carts.commodities.list();
    cartItems = result.data;
  } catch (error) {
    console.error("Failed to fetch cart items:", error);
  }

  const subtotal = cartItems.reduce(
    (sum: number, item: any) => sum + (item.price?.real || 0) * (item.volume || 1),
    0
  );
  const shipping = 5.99;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {cartItems.length > 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow">
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {cartItems.map((item: any) => (
                <div key={item.id} className="p-6 flex gap-4">
                  <div className="h-24 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-md flex-shrink-0 flex items-center justify-center">
                    <span className="text-zinc-500">Product Image</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {item.sale?.content?.title || "Unknown Product"}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      ${item.price?.real?.toFixed(2)} each
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button className="px-3 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-950">
                        -
                      </button>
                      <span className="w-8 text-center">{item.volume || 1}</span>
                      <button className="px-3 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-950">
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ${((item.price?.real || 0) * (item.volume || 1)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-200 dark:border-zinc-800 p-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full mt-6 bg-zinc-900 text-zinc-50 py-3 rounded-md hover:bg-zinc-800 text-lg font-semibold">
                Proceed to Checkout
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-zinc-600 dark:text-zinc-400">
              Your cart is empty.
            </p>
            <a
              href="/products"
              className="inline-block mt-4 px-6 py-2 bg-zinc-900 text-zinc-50 rounded-md hover:bg-zinc-800"
            >
              Browse Products
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
