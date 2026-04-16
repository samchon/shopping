import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">My Orders</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3].map((i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">ORD-2024-00{i}</TableCell>
              <TableCell>April {10 + i}, 2024</TableCell>
              <TableCell>
                <Badge variant={i === 1 ? "default" : "secondary"}>
                  {i === 1 ? "Delivered" : "Processing"}
                </Badge>
              </TableCell>
              <TableCell>₩{(100 + i) * 1000}</TableCell>
              <TableCell>
                <Link href={`/orders/${i}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
