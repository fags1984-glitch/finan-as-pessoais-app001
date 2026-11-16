"use client";

import { useRouter, usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { MONTHS } from "@/components/filters-bar";

type Props = {
  years: number[];
  year: number;
  month: number;
};

export function PeriodSelect({ years, year, month }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(key: "year" | "month", value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.replace(`${pathname}?${params.toString()}`);
  }

  const selectClass = "h-9 rounded-md border bg-background px-3 text-sm";

  return (
    <div className="flex gap-2">
      <select aria-label="Mês" className={selectClass} value={month} onChange={(e) => update("month", e.target.value)}>
        {MONTHS.map((name, i) => (
          <option key={name} value={i + 1}>
            {name}
          </option>
        ))}
      </select>
      <select aria-label="Ano" className={selectClass} value={year} onChange={(e) => update("year", e.target.value)}>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}
