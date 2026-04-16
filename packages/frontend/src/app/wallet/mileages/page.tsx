import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MileagesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Mileage History</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-primary">12,500 pts</p>
          <p className="text-sm text-muted-foreground mt-1">
            Can be used for discounts on orders
          </p>
        </CardContent>
      </Card>

      <div className="border rounded-lg overflow-hidden">
        <div className="bg-muted p-4 grid grid-cols-4 gap-4 font-medium text-sm">
          <div>Date</div>
          <div>Type</div>
          <div>Points</div>
          <div>Related Order</div>
        </div>
        <div className="divide-y">
          {[
            { date: "2024-04-10", type: "Earned", points: "+1,250", order: "ORD-2024-001" },
            { date: "2024-04-05", type: "Used", points: "-500", order: "ORD-2024-002" },
            { date: "2024-03-28", type: "Earned", points: "+2,100", order: "ORD-2024-003" },
          ].map((item, i) => (
            <div key={i} className="p-4 grid grid-cols-4 gap-4 text-sm hover:bg-muted/50">
              <div>{item.date}</div>
              <div>{item.type}</div>
              <div className={item.points.startsWith("+") ? "text-green-600" : "text-red-600"}>
                {item.points}
              </div>
              <div className="text-muted-foreground">{item.order}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
