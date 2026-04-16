import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/orders" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">
        ← Back to Orders
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold">Order #{params.id}</h1>
                  <p className="text-muted-foreground">Placed on April 15, 2024</p>
                </div>
                <Badge>Delivered</Badge>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <div className="flex gap-4 p-4 border rounded-lg">
                  <div className="w-20 h-20 bg-muted rounded flex items-center justify-center">
                    <span className="text-muted-foreground text-xs">Image</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Product Name</h3>
                    <p className="text-sm text-muted-foreground">Size: M, Color: Blue</p>
                    <p className="text-sm font-medium mt-1">₩50,000 × 1</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 border rounded-lg">
                  <div className="w-20 h-20 bg-muted rounded flex items-center justify-center">
                    <span className="text-muted-foreground text-xs">Image</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Another Product</h3>
                    <p className="text-sm text-muted-foreground">Size: L</p>
                    <p className="text-sm font-medium mt-1">₩30,000 × 2</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-bold mb-4">Delivery Information</h2>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Name:</span> John Doe</p>
                <p><span className="text-muted-foreground">Phone:</span> 010-1234-5678</p>
                <p><span className="text-muted-foreground">Address:</span> 123 Main St, Seoul, Korea</p>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-bold mb-4">Order Timeline</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-green-600 mt-2" />
                  <div>
                    <p className="font-medium">Order Placed</p>
                    <p className="text-sm text-muted-foreground">April 15, 2024 10:30 AM</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-green-600 mt-2" />
                  <div>
                    <p className="font-medium">Payment Confirmed</p>
                    <p className="text-sm text-muted-foreground">April 15, 2024 10:35 AM</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-green-600 mt-2" />
                  <div>
                    <p className="font-medium">Shipped</p>
                    <p className="text-sm text-muted-foreground">April 16, 2024 2:00 PM</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-green-600 mt-2" />
                  <div>
                    <p className="font-medium">Delivered</p>
                    <p className="text-sm text-muted-foreground">April 18, 2024 4:30 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
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
                  <span>Total Paid</span>
                  <span>₩108,000</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button variant="outline" className="w-full">Download Invoice</Button>
                <Button variant="outline" className="w-full">Contact Support</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
