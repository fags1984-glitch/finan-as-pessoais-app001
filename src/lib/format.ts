const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatBRL(value: number): string {
  return currencyFormatter.format(value);
}

/**
 * Converte um valor digitado em pt-BR ("1.234,56") ou em formato com ponto
 * decimal ("1234.56") para número. Retorna NaN quando o texto não é um número.
 */
export function parseBRLInput(input: string): number {
  const trimmed = input.trim();
  if (trimmed === "") return NaN;

  // Se há vírgula, ela é o separador decimal e os pontos são milhares.
  const normalized = trimmed.includes(",")
    ? trimmed.replace(/\./g, "").replace(",", ".")
    : trimmed;

  if (!/^-?\d+(\.\d+)?$/.test(normalized)) return NaN;
  return Number(normalized);
}
