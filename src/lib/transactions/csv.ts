import type { Transaction } from "@/lib/transactions/types";

const SEPARATOR = ";";
const HEADER = ["data", "descricao", "tipo", "categoria", "valor"];

/** Escapa um campo: entre aspas se contiver separador, aspas ou quebra de linha. */
export function escapeCSVField(value: string): string {
  if (/[;"\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function toCSV(txs: Transaction[]): string {
  const lines = [HEADER.join(SEPARATOR)];
  for (const tx of txs) {
    lines.push(
      [
        tx.date,
        escapeCSVField(tx.description),
        tx.type,
        escapeCSVField(tx.category),
        tx.amount.toFixed(2).replace(".", ","),
      ].join(SEPARATOR),
    );
  }
  return lines.join("\r\n");
}
