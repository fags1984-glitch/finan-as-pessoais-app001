"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuthState } from "@/app/actions/auth";

type Props = {
  title: string;
  description: string;
  submitLabel: string;
  action: (prev: AuthState, formData: FormData) => Promise<AuthState>;
  footer: { text: string; href: string; linkLabel: string };
};

export function AuthForm({ title, description, submitLabel, action, footer }: Props) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(action, undefined);

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>

      <form action={formAction} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required className="h-11 rounded-lg bg-card" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={submitLabel === "Entrar" ? "current-password" : "new-password"}
            required
            className="h-11 rounded-lg bg-card"
          />
        </div>

        {state?.error && (
          <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {state.error}
          </p>
        )}

        <Button type="submit" className="h-11 w-full rounded-lg text-sm" disabled={pending}>
          {pending ? "Aguarde..." : submitLabel}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {footer.text}{" "}
        <Link href={footer.href} className="font-semibold text-primary underline-offset-4 hover:underline">
          {footer.linkLabel}
        </Link>
      </p>
    </div>
  );
}
