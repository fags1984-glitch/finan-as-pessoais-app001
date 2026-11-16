"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createTransaction,
  updateTransaction,
  type TransactionState,
} from "@/app/actions/transactions";
import { CATEGORIES } from "@/lib/categories";
import type { Transaction } from "@/lib/transactions/types";

type Props = {
  initial?: Transaction;
  onDone: () => void;
};

function toBRLInput(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

export function TransactionForm({ initial, onDone }: Props) {
  const action = initial ? updateTransaction : createTransaction;
  const [state, formAction, pending] = useActionState<TransactionState, FormData>(action, undefined);
  useEffect(() => {
    if (state?.ok) onDone();
  }, [state, onDone]);

  return (
    <form action={formAction} className="space-y-4">
      {initial && <input type="hidden" name="id" value={initial.id} />}

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input id="description" name="description" defaultValue={initial?.description} maxLength={120} required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="amount">Valor (R$)</Label>
          <Input
            id="amount"
            name="amount"
            inputMode="decimal"
            placeholder="0,00"
            defaultValue={initial ? toBRLInput(initial.amount) : ""}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Data</Label>
          <Input id="date" name="date" type="date" defaultValue={initial?.date ?? today()} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <select
            id="type"
            name="type"
            defaultValue={initial?.type ?? "despesa"}
            className="h-9 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="despesa">Despesa</option>
            <option value="receita">Receita</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <select
            id="category"
            name="category"
            defaultValue={initial?.category ?? "Outros"}
            className="h-9 w-full rounded-md border bg-background px-3 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando..." : initial ? "Salvar alterações" : "Adicionar"}
        </Button>
      </div>
    </form>
  );
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}
