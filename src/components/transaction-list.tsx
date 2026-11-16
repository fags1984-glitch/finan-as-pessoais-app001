"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { deleteTransaction } from "@/app/actions/transactions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TransactionForm } from "@/components/transaction-form";
import { formatBRL } from "@/lib/format";
import type { Transaction } from "@/lib/transactions/types";

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function TypeDot({ type }: { type: Transaction["type"] }) {
  return (
    <span
      className={`inline-block size-2 shrink-0 rounded-full ${type === "receita" ? "bg-income" : "bg-expense"}`}
      aria-label={type === "receita" ? "Receita" : "Despesa"}
      role="img"
    />
  );
}

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function confirmDelete() {
    if (!deleting) return;
    const id = deleting.id;
    startTransition(async () => {
      const result = await deleteTransaction(id);
      if (result?.error) setError(result.error);
      setDeleting(null);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {transactions.length} {transactions.length === 1 ? "transação" : "transações"}
        </p>
        <Button onClick={() => setCreating(true)}>
          <Plus className="size-4" />
          Nova transação
        </Button>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {transactions.length === 0 ? (
        <div className="rounded-2xl bg-card p-10 text-center text-sm text-muted-foreground ring-1 ring-border">
          Nenhuma transação encontrada para os filtros atuais.
        </div>
      ) : (
        <>
          {/* Mobile: lista */}
          <ul className="divide-y rounded-2xl bg-card px-4 ring-1 ring-border md:hidden">
            {transactions.map((tx) => (
              <li key={tx.id} className="flex items-center gap-3 py-3">
                <TypeDot type={tx.type} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(tx.date)} · {tx.category}
                  </p>
                </div>
                <span className={`shrink-0 font-semibold tabular ${tx.type === "receita" ? "text-income" : "text-expense"}`}>
                  {tx.type === "receita" ? "+" : "−"} {formatBRL(tx.amount)}
                </span>
                <div className="flex shrink-0">
                  <Button variant="ghost" size="icon" aria-label="Editar" onClick={() => setEditing(tx)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Excluir" onClick={() => setDeleting(tx)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          {/* Desktop: tabela */}
          <div className="hidden overflow-hidden rounded-2xl bg-card ring-1 ring-border md:block">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr className="border-b">
                  <th className="px-5 py-3 font-medium">Data</th>
                  <th className="px-5 py-3 font-medium">Descrição</th>
                  <th className="px-5 py-3 font-medium">Categoria</th>
                  <th className="px-5 py-3 text-right font-medium">Valor</th>
                  <th className="px-5 py-3 text-right font-medium">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-t transition-colors first:border-t-0 hover:bg-muted/50">
                    <td className="px-5 py-3 whitespace-nowrap text-muted-foreground tabular">{formatDate(tx.date)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <TypeDot type={tx.type} />
                        <span className="font-medium">{tx.description}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{tx.category}</td>
                    <td
                      className={`px-5 py-3 text-right font-semibold whitespace-nowrap tabular ${
                        tx.type === "receita" ? "text-income" : "text-expense"
                      }`}
                    >
                      {formatBRL(tx.amount)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" aria-label="Editar" onClick={() => setEditing(tx)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" aria-label="Excluir" onClick={() => setDeleting(tx)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Criar */}
      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova transação</DialogTitle>
            <DialogDescription>Registre uma receita ou despesa.</DialogDescription>
          </DialogHeader>
          <TransactionForm onDone={() => setCreating(false)} />
        </DialogContent>
      </Dialog>

      {/* Editar */}
      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar transação</DialogTitle>
          </DialogHeader>
          {editing && <TransactionForm initial={editing} onDone={() => setEditing(null)} />}
        </DialogContent>
      </Dialog>

      {/* Confirmar exclusão */}
      <Dialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir transação?</DialogTitle>
            <DialogDescription>
              {deleting ? `“${deleting.description}” será removida. Esta ação não pode ser desfeita.` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={pending}>
              {pending ? "Excluindo..." : "Excluir"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
