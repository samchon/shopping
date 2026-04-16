import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Administrator Console</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₩124,500,000</p>
            <p className="text-xs text-green-600 mt-1">↑ 15% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2,847</p>
            <p className="text-xs text-green-600 mt-1">↑ 10% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Sellers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">156</p>
            <p className="text-xs text-green-600 mt-1">↑ 5 new this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">8,432</p>
            <p className="text-xs text-green-600 mt-1">↑ 234 this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Policy Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Configure platform policies and rules
            </p>
            <Link href="/admin/policies">
              <Button variant="outline" className="w-full">Manage Policies</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage customers and sellers
            </p>
            <Link href="/admin/users">
              <Button variant="outline" className="w-full">Manage Users</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Coupons & Promotions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Create and manage promotional campaigns
            </p>
            <Link href="/admin/coupons">
              <Button variant="outline" className="w-full">Manage Coupons</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Categories & Sections</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Organize product categories
            </p>
            <Link href="/admin/categories">
              <Button variant="outline" className="w-full">Manage Categories</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Monitor system activity and errors
            </p>
            <Link href="/admin/logs">
              <Button variant="outline" className="w-full">View Logs</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Configure platform settings
            </p>
            <Link href="/admin/settings">
              <Button variant="outline" className="w-full">Settings</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
