import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Cart Item 1 */}
          <div className="border rounded-lg p-4 flex gap-4">
            <div className="w-24 h-24 bg-muted rounded flex items-center justify-center flex-shrink-0">
              <span className="text-muted-foreground text-sm">Image</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Product Name</h3>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline" className="text-xs">Size: M</Badge>
                <Badge variant="outline" className="text-xs">Color: Blue</Badge>
              </div>
              <p className="text-muted-foreground text-sm mt-2">₩50,000</p>
            </div>
            <div className="flex flex-col items-end justify-between">
              <Button variant="ghost" size="sm" className="text-destructive">
                Remove
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  -
                </Button>
                <span className="text-sm font-medium w-8 text-center">1</span>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  +
                </Button>
              </div>
            </div>
          </div>

          {/* Cart Item 2 */}
          <div className="border rounded-lg p-4 flex gap-4">
            <div className="w-24 h-24 bg-muted rounded flex items-center justify-center flex-shrink-0">
              <span className="text-muted-foreground text-sm">Image</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Another Product</h3>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline" className="text-xs">Size: L</Badge>
              </div>
              <p className="text-muted-foreground text-sm mt-2">₩30,000</p>
            </div>
            <div className="flex flex-col items-end justify-between">
              <Button variant="ghost" size="sm" className="text-destructive">
                Remove
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  -
                </Button>
                <span className="text-sm font-medium w-8 text-center">2</span>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  +
                </Button>
              </div>
            </div>
          </div>

          <Link href="/sales">
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₩110,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>₩3,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="text-green-600">-₩5,000</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>₩108,000</span>
              </div>
            </div>

            <Button className="w-full">Proceed to Checkout</Button>
            
            <p className="text-xs text-muted-foreground text-center mt-4">
              Secure checkout with SSL encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
