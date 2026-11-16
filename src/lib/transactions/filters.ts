import type { Transaction, TransactionFilters } from "@/lib/transactions/types";

/** Normaliza para comparação: minúsculas e sem acentos. */
export function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export function filterTransactions(
  txs: Transaction[],
  filters: TransactionFilters,
): Transaction[] {
  const search = filters.search ? normalizeText(filters.search) : "";

  return txs.filter((tx) => {
    const [year, month] = tx.date.split("-").map(Number);
    if (filters.year !== undefined && year !== filters.year) return false;
    if (filters.month !== undefined && month !== filters.month) return false;
    if (filters.category && tx.category !== filters.category) return false;
    if (search && !normalizeText(tx.description).includes(search)) return false;
    return true;
  });
}
