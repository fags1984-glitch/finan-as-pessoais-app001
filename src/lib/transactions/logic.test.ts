import { describe, expect, it } from "vitest";
import { byCategory, summarize } from "@/lib/transactions/summary";
import { filterTransactions } from "@/lib/transactions/filters";
import { toCSV } from "@/lib/transactions/csv";
import type { Transaction } from "@/lib/transactions/types";

const txs: Transaction[] = [
  { id: "1", description: "Salário", amount: 5000, date: "2026-11-05", type: "receita", category: "Salário" },
  { id: "2", description: "Café da manhã", amount: 30, date: "2026-11-06", type: "despesa", category: "Alimentação" },
  { id: "3", description: "Mercado", amount: 200, date: "2026-11-07", type: "despesa", category: "Alimentação" },
  { id: "4", description: "Ônibus", amount: 10, date: "2026-10-20", type: "despesa", category: "Transporte" },
];

describe("summarize", () => {
  it("soma receitas e despesas e calcula saldo", () => {
    expect(summarize(txs)).toEqual({ income: 5000, expense: 240, balance: 4760 });
  });
});

describe("byCategory", () => {
  it("considera apenas despesas e ordena do maior para o menor", () => {
    expect(byCategory(txs)).toEqual([
      { category: "Alimentação", total: 230 },
      { category: "Transporte", total: 10 },
    ]);
  });
});

describe("filterTransactions", () => {
  it("filtra por mês e ano", () => {
    expect(filterTransactions(txs, { year: 2026, month: 10 }).map((t) => t.id)).toEqual(["4"]);
  });

  it("filtra por categoria", () => {
    expect(filterTransactions(txs, { category: "Alimentação" })).toHaveLength(2);
  });

  it("busca sem diferenciar maiúsculas e acentos", () => {
    expect(filterTransactions(txs, { search: "cafe" }).map((t) => t.id)).toEqual(["2"]);
  });
});

describe("toCSV", () => {
  it("gera cabeçalho e escapa descrição com separador e aspas", () => {
    const csv = toCSV([
      { id: "9", description: 'Mercado; "Extra"', amount: 12.5, date: "2026-11-01", type: "despesa", category: "Outros" },
    ]);
    expect(csv.split("\r\n")).toEqual([
      "data;descricao;tipo;categoria;valor",
      '2026-11-01;"Mercado; ""Extra""";despesa;Outros;12,50',
    ]);
  });
});
