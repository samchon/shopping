import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function CouponsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">My Coupons</h1>
        <Link href="/sales">
          <Button>Browse Products</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Available Coupons */}
        {[1, 2, 3].map((i) => (
          <Card key={i} className="relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold">
              Available
            </div>
            <CardHeader>
              <CardTitle className="text-lg">₩{10 * i}00 Off Coupon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                Minimum purchase: ₩50,000
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Expires: December 31, 2024
              </p>
              <Button size="sm" className="w-full">Use Coupon</Button>
            </CardContent>
          </Card>
        ))}

        {/* Expired Coupon */}
        <Card className="opacity-60">
          <div className="absolute top-0 right-0 bg-muted text-muted-foreground px-3 py-1 text-xs font-semibold">
            Expired
          </div>
          <CardHeader>
            <CardTitle className="text-lg">₩5,000 Off Coupon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              Minimum purchase: ₩30,000
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Expired: January 15, 2024
            </p>
            <Button size="sm" className="w-full" disabled>Expired</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
