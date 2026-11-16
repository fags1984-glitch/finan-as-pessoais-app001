import { formatBRL } from "@/lib/format";
import type { Summary } from "@/lib/transactions/summary";

export function SummaryCards({ summary }: { summary: Summary }) {
  const total = summary.income + summary.expense;
  const incomeShare = total > 0 ? Math.round((summary.income / total) * 100) : 0;
  const expenseShare = total > 0 ? 100 - incomeShare : 0;

  return (
    <section className="rounded-3xl bg-pine p-6 text-white md:p-8">
      <p className="text-sm text-white/70">Saldo do período</p>
      <p
        className={`mt-2 font-heading text-4xl font-semibold tracking-tight tabular md:text-5xl ${
          summary.balance < 0 ? "text-orange-200" : ""
        }`}
      >
        {formatBRL(summary.balance)}
      </p>

      <div
        role="img"
        aria-label={`Receitas ${incomeShare}% e despesas ${expenseShare}% do total movimentado`}
        className="mt-6 flex h-2.5 overflow-hidden rounded-full bg-white/15"
      >
        <div className="h-full bg-emerald-300 transition-[width] duration-500" style={{ width: `${incomeShare}%` }} />
        <div className="h-full bg-orange-300 transition-[width] duration-500" style={{ width: `${expenseShare}%` }} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 md:max-w-md">
        <div>
          <p className="flex items-center gap-2 text-sm text-white/70">
            <span className="size-2 rounded-full bg-emerald-300" aria-hidden />
            Receita total
          </p>
          <p className="mt-1 text-lg font-semibold tabular">{formatBRL(summary.income)}</p>
        </div>
        <div>
          <p className="flex items-center gap-2 text-sm text-white/70">
            <span className="size-2 rounded-full bg-orange-300" aria-hidden />
            Despesa total
          </p>
          <p className="mt-1 text-lg font-semibold tabular">{formatBRL(summary.expense)}</p>
        </div>
      </div>
    </section>
  );
}
