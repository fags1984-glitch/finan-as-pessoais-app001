"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/lib/categories";

export const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

type Props = {
  years: number[];
  defaultYear?: number;
  defaultMonth?: number;
};

export function FiltersBar({ years, defaultYear, defaultMonth }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    startTransition(() => router.replace(`${pathname}?${params.toString()}`));
  }

  const selectClass =
    "h-10 rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/30";

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
      <select
        aria-label="Mês"
        className={selectClass}
        value={searchParams.get("month") ?? String(defaultMonth ?? "")}
        onChange={(e) => update("month", e.target.value)}
      >
        <option value="">Todos os meses</option>
        {MONTHS.map((name, i) => (
          <option key={name} value={i + 1}>
            {name}
          </option>
        ))}
      </select>

      <select
        aria-label="Ano"
        className={selectClass}
        value={searchParams.get("year") ?? String(defaultYear ?? "")}
        onChange={(e) => update("year", e.target.value)}
      >
        <option value="">Todos os anos</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      <select
        aria-label="Categoria"
        className={selectClass}
        value={searchParams.get("category") ?? ""}
        onChange={(e) => update("category", e.target.value)}
      >
        <option value="">Todas as categorias</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <Input
        aria-label="Buscar por descrição"
        placeholder="Buscar descrição"
        defaultValue={searchParams.get("q") ?? ""}
        onChange={(e) => update("q", e.target.value)}
        className="col-span-2 md:col-span-2"
      />
    </div>
  );
}
