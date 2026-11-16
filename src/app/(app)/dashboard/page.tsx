import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryPieChart } from "@/components/category-pie-chart";
import { PeriodSelect } from "@/components/period-select";
import { SummaryCards } from "@/components/summary-cards";
import { formatBRL } from "@/lib/format";
import { listTransactions } from "@/lib/transactions/queries";
import { filterTransactions } from "@/lib/transactions/filters";
import { byCategory, summarize } from "@/lib/transactions/summary";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function pick(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default function DashboardPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<p className="py-12 text-center text-sm text-muted-foreground">Carregando...</p>}>
      <DashboardContent searchParams={searchParams} />
    </Suspense>
  );
}

async function DashboardContent({ searchParams }: PageProps) {
  const raw = await searchParams;
  const now = new Date();
  const monthParam = Number(pick(raw.month));
  const yearParam = Number(pick(raw.year));
  const month = monthParam >= 1 && monthParam <= 12 ? monthParam : now.getMonth() + 1;
  const year = Number.isInteger(yearParam) && yearParam > 0 ? yearParam : now.getFullYear();

  const all = await listTransactions();
  const txs = filterTransactions(all, { year, month });
  const summary = summarize(txs);
  const categories = byCategory(txs);

  const years = [...new Set([now.getFullYear(), ...all.map((t) => Number(t.date.slice(0, 4)))])].sort(
    (a, b) => b - a,
  );
  const recent = txs.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <PeriodSelect years={years} year={year} month={month} />
      </div>

      <SummaryCards summary={summary} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Despesas por categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryPieChart data={categories} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimas transações</CardTitle>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">Nenhuma transação neste período</p>
            ) : (
              <ul className="divide-y">
                {recent.map((tx) => (
                  <li key={tx.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{tx.category}</p>
                    </div>
                    <span className={tx.type === "receita" ? "font-semibold text-emerald-600" : "font-semibold text-red-600"}>
                      {tx.type === "receita" ? "+" : "−"} {formatBRL(tx.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
