import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to Shopping Mall
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Discover amazing products from our curated sellers
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/sales">
            <Button size="lg">Browse Products</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Shop Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Browse through our extensive catalog of products from verified
              sellers.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Secure Checkout</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Enjoy safe and secure payment processing with multiple payment
              options.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Track Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Monitor your orders from purchase to delivery with real-time
              updates.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
