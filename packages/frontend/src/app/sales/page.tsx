import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SalesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Products</h1>
      
      <div className="flex gap-4 mb-6">
        <Input 
          placeholder="Search products..." 
          className="max-w-sm"
        />
        <Button>Search</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Product cards will be loaded here */}
        <div className="border rounded-lg p-4 bg-muted/30">
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    </div>
  );
}
