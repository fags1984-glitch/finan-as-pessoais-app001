import { z } from "zod";
import { CATEGORIES, TRANSACTION_TYPES } from "@/lib/categories";

export const transactionInputSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Informe uma descrição")
    .max(120, "A descrição deve ter no máximo 120 caracteres"),
  amount: z.number().positive("O valor deve ser maior que zero"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  type: z.enum(TRANSACTION_TYPES, { message: "Tipo inválido" }),
  category: z.enum(CATEGORIES, { message: "Categoria inválida" }),
});

export type TransactionInput = z.infer<typeof transactionInputSchema>;
