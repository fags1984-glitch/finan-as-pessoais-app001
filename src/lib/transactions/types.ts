import type { Category, TransactionType } from "@/lib/categories";

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
  type: TransactionType;
  category: Category;
};

export type TransactionFilters = {
  year?: number;
  month?: number; // 1-12
  category?: Category;
  search?: string;
};
