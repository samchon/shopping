import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function WalletPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">My Wallet</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Deposit Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary mb-4">₩500,000</p>
            <div className="flex gap-2">
              <Button>Deposit</Button>
              <Link href="/wallet/deposits">
                <Button variant="outline">History</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mileage Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary mb-4">12,500 pts</p>
            <div className="flex gap-2">
              <Button variant="outline">Use Mileage</Button>
              <Link href="/wallet/mileages">
                <Button variant="outline">History</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <section>
        <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted p-4 font-medium">
            Latest deposit activity
          </div>
          <div className="p-4 text-muted-foreground">
            No recent transactions
          </div>
        </div>
      </section>
    </div>
  );
}
