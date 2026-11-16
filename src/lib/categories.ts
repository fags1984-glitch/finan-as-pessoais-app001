export const CATEGORIES = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Lazer",
  "Saúde",
  "Educação",
  "Salário",
  "Freelance",
  "Outros",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const TRANSACTION_TYPES = ["receita", "despesa"] as const;

export type TransactionType = (typeof TRANSACTION_TYPES)[number];
