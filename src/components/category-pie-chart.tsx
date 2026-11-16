"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatBRL } from "@/lib/format";
import type { Category } from "@/lib/categories";

const COLORS = [
  "#0b5d4f", "#13805a", "#e09f3e", "#c4502a", "#4f6d8a",
  "#7fb89e", "#8a7bb0", "#b8a48a", "#94a39d",
];

type Props = { data: { category: Category; total: number }[] };

export function CategoryPieChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        Sem despesas neste período
      </p>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="total" nameKey="category" innerRadius={55} outerRadius={95} paddingAngle={2}>
            {data.map((entry, i) => (
              <Cell key={entry.category} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatBRL(Number(value))} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
