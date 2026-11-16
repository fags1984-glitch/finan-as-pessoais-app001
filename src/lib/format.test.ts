import { describe, expect, it } from "vitest";
import { formatBRL, parseBRLInput } from "@/lib/format";

describe("parseBRLInput", () => {
  it("aceita formato pt-BR com milhar e vírgula decimal", () => {
    expect(parseBRLInput("1.234,56")).toBe(1234.56);
  });

  it("aceita formato com ponto decimal", () => {
    expect(parseBRLInput("1234.56")).toBe(1234.56);
  });

  it("aceita número simples com vírgula", () => {
    expect(parseBRLInput("10,5")).toBe(10.5);
  });

  it("retorna NaN para texto inválido ou vazio", () => {
    expect(Number.isNaN(parseBRLInput("abc"))).toBe(true);
    expect(Number.isNaN(parseBRLInput("   "))).toBe(true);
  });
});

describe("formatBRL", () => {
  it("formata em reais no padrão pt-BR", () => {
    expect(formatBRL(1234.5)).toMatch(/R\$\s1\.234,50/);
  });
});
