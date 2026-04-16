import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DepositsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Deposit History</h1>
        <Button>Deposit Funds</Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-primary">₩500,000</p>
        </CardContent>
      </Card>

      <div className="border rounded-lg overflow-hidden">
        <div className="bg-muted p-4 grid grid-cols-4 gap-4 font-medium text-sm">
          <div>Date</div>
          <div>Type</div>
          <div>Amount</div>
          <div>Status</div>
        </div>
        <div className="divide-y">
          {[
            { date: "2024-04-10", type: "Deposit", amount: "+₩300,000", status: "Completed" },
            { date: "2024-04-05", type: "Used", amount: "-₩50,000", status: "Completed" },
            { date: "2024-03-28", type: "Deposit", amount: "+₩250,000", status: "Completed" },
          ].map((item, i) => (
            <div key={i} className="p-4 grid grid-cols-4 gap-4 text-sm hover:bg-muted/50">
              <div>{item.date}</div>
              <div>{item.type}</div>
              <div className={item.amount.startsWith("+") ? "text-green-600" : "text-red-600"}>
                {item.amount}
              </div>
              <div>{item.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
