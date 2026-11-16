"use server";

import { revalidatePath } from "next/cache";
import { parseBRLInput } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { transactionInputSchema } from "@/lib/transactions/schema";

export type TransactionState = { error?: string; ok?: boolean } | undefined;

/**
 * Lê e valida o FormData do formulário de transação.
 * Campos: description, amount (pt-BR), date, type, category.
 */
function parseForm(formData: FormData) {
  const amountText = String(formData.get("amount") ?? "");
  const parsed = transactionInputSchema.safeParse({
    description: formData.get("description"),
    amount: parseBRLInput(amountText),
    date: formData.get("date"),
    type: formData.get("type"),
    category: formData.get("category"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" } as const;
  }
  return { data: parsed.data } as const;
}

function revalidate() {
  revalidatePath("/transacoes");
  revalidatePath("/dashboard");
}

export async function createTransaction(
  _prev: TransactionState,
  formData: FormData,
): Promise<TransactionState> {
  const result = parseForm(formData);
  if ("error" in result) return { error: result.error };

  const supabase = await createClient();
  const { error } = await supabase.from("transactions").insert(result.data);
  if (error) return { error: "Não foi possível salvar a transação" };

  revalidate();
  return { ok: true };
}

export async function updateTransaction(
  _prev: TransactionState,
  formData: FormData,
): Promise<TransactionState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Transação não encontrada" };

  const result = parseForm(formData);
  if ("error" in result) return { error: result.error };

  const supabase = await createClient();
  const { error } = await supabase.from("transactions").update(result.data).eq("id", id);
  if (error) return { error: "Não foi possível atualizar a transação" };

  revalidate();
  return { ok: true };
}

export async function deleteTransaction(id: string): Promise<TransactionState> {
  if (!id) return { error: "Transação não encontrada" };

  const supabase = await createClient();
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) return { error: "Não foi possível excluir a transação" };

  revalidate();
  return { ok: true };
}
