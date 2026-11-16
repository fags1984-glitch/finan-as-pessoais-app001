import { Suspense } from "react";
import { connection } from "next/server";
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
  await connection();
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
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Dashboard</h1>
        <PeriodSelect years={years} year={year} month={month} />
      </div>

      <SummaryCards summary={summary} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <section className="rounded-2xl bg-card p-6 ring-1 ring-border lg:col-span-3">
          <h2 className="font-heading text-base font-semibold">Despesas por categoria</h2>
          <div className="mt-4">
            <CategoryPieChart data={categories} />
          </div>
        </section>

        <section className="rounded-2xl bg-card p-6 ring-1 ring-border lg:col-span-2">
          <h2 className="font-heading text-base font-semibold">Últimas transações</h2>
          {recent.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">Nenhuma transação neste período</p>
          ) : (
            <ul className="mt-2 divide-y">
              {recent.map((tx) => (
                <li key={tx.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">{tx.category}</p>
                  </div>
                  <span
                    className={`shrink-0 font-semibold tabular ${
                      tx.type === "receita" ? "text-income" : "text-expense"
                    }`}
                  >
                    {tx.type === "receita" ? "+" : "−"} {formatBRL(tx.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
