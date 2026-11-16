import type { Category } from "@/lib/categories";
import { CATEGORIES } from "@/lib/categories";
import type { TransactionFilters } from "@/lib/transactions/types";

type RawParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function toInt(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isInteger(n) ? n : undefined;
}

/** Converte os parâmetros da URL (year, month, category, q) em filtros. */
export function parseFilters(raw: RawParams): TransactionFilters {
  const month = toInt(first(raw.month));
  const category = first(raw.category);

  return {
    year: toInt(first(raw.year)),
    month: month !== undefined && month >= 1 && month <= 12 ? month : undefined,
    category: CATEGORIES.includes(category as Category) ? (category as Category) : undefined,
    search: first(raw.q)?.trim() || undefined,
  };
}

/** Converte filtros em query string para links (ex.: exportação). */
export function filtersToSearchParams(filters: TransactionFilters): string {
  const params = new URLSearchParams();
  if (filters.year !== undefined) params.set("year", String(filters.year));
  if (filters.month !== undefined) params.set("month", String(filters.month));
  if (filters.category) params.set("category", filters.category);
  if (filters.search) params.set("q", filters.search);
  return params.toString();
}
