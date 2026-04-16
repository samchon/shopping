import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function SellerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Seller Console</h1>
        <Button>Create New Product</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₩12,450,000</p>
            <p className="text-xs text-green-600 mt-1">↑ 12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">248</p>
            <p className="text-xs text-green-600 mt-1">↑ 8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">45</p>
            <p className="text-xs text-muted-foreground mt-1">Active listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">4.8</p>
            <p className="text-xs text-muted-foreground mt-1">Out of 5.0</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">My Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your product listings
            </p>
            <Link href="/seller/sales">
              <Button variant="outline" className="w-full">View Products</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Process and ship orders
            </p>
            <Link href="/seller/orders">
              <Button variant="outline" className="w-full">View Orders</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View sales performance
            </p>
            <Link href="/seller/analytics">
              <Button variant="outline" className="w-full">View Analytics</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
