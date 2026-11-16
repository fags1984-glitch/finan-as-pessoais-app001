import { createClient } from "@/lib/supabase/server";
import type { Transaction } from "@/lib/transactions/types";
import type { Category, TransactionType } from "@/lib/categories";

type Row = {
  id: string;
  description: string;
  amount: string | number; // numeric chega como string pelo PostgREST
  date: string;
  type: TransactionType;
  category: Category;
};

export function mapRow(row: Row): Transaction {
  return {
    id: row.id,
    description: row.description,
    amount: Number(row.amount),
    date: row.date,
    type: row.type,
    category: row.category,
  };
}

export async function listTransactions(): Promise<Transaction[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("id, description, amount, date, type, category")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Erro ao carregar transações: ${error.message}`);
  return (data as Row[]).map(mapRow);
}
