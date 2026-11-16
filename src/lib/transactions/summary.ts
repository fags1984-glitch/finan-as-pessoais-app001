import type { Category } from "@/lib/categories";
import type { Transaction } from "@/lib/transactions/types";

export type Summary = { income: number; expense: number; balance: number };

export function summarize(txs: Transaction[]): Summary {
  let income = 0;
  let expense = 0;
  for (const tx of txs) {
    if (tx.type === "receita") income += tx.amount;
    else expense += tx.amount;
  }
  return { income, expense, balance: income - expense };
}

/** Totais de despesas por categoria, do maior para o menor. */
export function byCategory(
  txs: Transaction[],
): { category: Category; total: number }[] {
  const totals = new Map<Category, number>();
  for (const tx of txs) {
    if (tx.type !== "despesa") continue;
    totals.set(tx.category, (totals.get(tx.category) ?? 0) + tx.amount);
  }
  return [...totals.entries()]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}
