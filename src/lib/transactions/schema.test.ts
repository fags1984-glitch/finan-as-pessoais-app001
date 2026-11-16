import { describe, expect, it } from "vitest";
import { transactionInputSchema } from "@/lib/transactions/schema";

const valid = {
  description: "Mercado",
  amount: 10,
  date: "2026-11-10",
  type: "despesa",
  category: "Alimentação",
} as const;

describe("transactionInputSchema", () => {
  it("aceita uma transação válida", () => {
    expect(transactionInputSchema.safeParse(valid).success).toBe(true);
  });

  it("rejeita descrição só com espaços", () => {
    expect(
      transactionInputSchema.safeParse({ ...valid, description: "   " }).success,
    ).toBe(false);
  });

  it("rejeita valor zero", () => {
    expect(transactionInputSchema.safeParse({ ...valid, amount: 0 }).success).toBe(false);
  });

  it("rejeita valor negativo", () => {
    expect(transactionInputSchema.safeParse({ ...valid, amount: -5 }).success).toBe(false);
  });

  it("rejeita categoria fora da lista", () => {
    expect(
      transactionInputSchema.safeParse({ ...valid, category: "Viagem" }).success,
    ).toBe(false);
  });

  it("rejeita data em formato inválido", () => {
    expect(transactionInputSchema.safeParse({ ...valid, date: "10/11/2026" }).success).toBe(false);
  });
});
