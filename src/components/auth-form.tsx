"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" name="password" type="password" autoComplete="current-password" required />
          </div>
          {state?.error && (
            <p role="alert" className="text-sm text-red-600">
              {state.error}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Aguarde..." : submitLabel}
          </Button>
          <p className="text-sm text-muted-foreground">
            {footer.text}{" "}
            <Link href={footer.href} className="font-medium text-primary underline-offset-4 hover:underline">
              {footer.linkLabel}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
