import { NextResponse, type NextRequest } from "next/server";
import { filterTransactions } from "@/lib/transactions/filters";
import { toCSV } from "@/lib/transactions/csv";
import { listTransactions } from "@/lib/transactions/queries";
import { parseFilters } from "@/lib/transactions/params";

export async function GET(request: NextRequest) {
  const raw = Object.fromEntries(request.nextUrl.searchParams.entries());
  const txs = filterTransactions(await listTransactions(), parseFilters(raw));

  // BOM UTF-8 para o Excel reconhecer acentos.
  const body = "﻿" + toCSV(txs);

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="transacoes.csv"',
    },
  });
}
