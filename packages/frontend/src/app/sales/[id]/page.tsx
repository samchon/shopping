import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/sales" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">
        ← Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
          <span className="text-muted-foreground text-xl">Product Image</span>
        </div>

        {/* Product Info */}
        <div>
          <Badge className="mb-4">Available</Badge>
          <h1 className="text-3xl font-bold mb-4">Product Title</h1>
          <p className="text-2xl font-bold text-primary mb-6">₩100,000</p>
          
          <div className="space-y-4 mb-8">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">
                This is a detailed description of the product. It includes all the important
                information that customers need to know before making a purchase decision.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Options</h3>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-full">Size: S</Button>
                  <Button variant="default" size="sm" className="rounded-full">Size: M</Button>
                  <Button variant="outline" size="sm" className="rounded-full">Size: L</Button>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" className="rounded-full">Color: Red</Button>
                  <Button variant="outline" size="sm" className="rounded-full">Color: Blue</Button>
                  <Button variant="outline" size="sm" className="rounded-full">Color: Green</Button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Stock</h3>
              <p className="text-muted-foreground">100 items available</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button size="lg" className="flex-1">Add to Cart</Button>
            <Button size="lg" variant="outline" className="flex-1">Buy Now</Button>
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="mt-12 space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-4">Reviews</h2>
          <div className="border rounded-lg p-4">
            <p className="text-muted-foreground">No reviews yet.</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">Questions & Answers</h2>
          <div className="border rounded-lg p-4">
            <p className="text-muted-foreground">No questions yet.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
