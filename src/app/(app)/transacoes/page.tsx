import Link from "next/link";
import { Suspense } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FiltersBar } from "@/components/filters-bar";
import { TransactionList } from "@/components/transaction-list";
import { listTransactions } from "@/lib/transactions/queries";
import { filterTransactions } from "@/lib/transactions/filters";
import { filtersToSearchParams, parseFilters } from "@/lib/transactions/params";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function TransacoesPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<p className="py-12 text-center text-sm text-muted-foreground">Carregando...</p>}>
      <TransacoesContent searchParams={searchParams} />
    </Suspense>
  );
}

async function TransacoesContent({ searchParams }: PageProps) {
  const filters = parseFilters(await searchParams);
  const all = await listTransactions();
  const txs = filterTransactions(all, filters);

  const currentYear = new Date().getFullYear();
  const years = [...new Set([currentYear, ...all.map((t) => Number(t.date.slice(0, 4)))])].sort(
    (a, b) => b - a,
  );

  const exportQuery = filtersToSearchParams(filters);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Transações</h1>
        <Button variant="outline" render={<Link href={`/transacoes/export${exportQuery ? `?${exportQuery}` : ""}`} />}>
          <Download className="size-4" />
          Exportar CSV
        </Button>
      </div>

      <FiltersBar years={years} />

      <TransactionList transactions={txs} />
    </div>
  );
}
