import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBRL } from "@/lib/format";
import type { Summary } from "@/lib/transactions/summary";

export function SummaryCards({ summary }: { summary: Summary }) {
  const items = [
    { label: "Receita Total", value: summary.income, className: "text-emerald-600" },
    { label: "Despesa Total", value: summary.expense, className: "text-red-600" },
    {
      label: "Saldo",
      value: summary.balance,
      className: summary.balance >= 0 ? "text-blue-600" : "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label}>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-semibold ${item.className}`}>{formatBRL(item.value)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
