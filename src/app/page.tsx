import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const HIGHLIGHTS = [
  {
    title: "Registre tudo num só lugar",
    description: "Receitas e despesas com descrição, valor, data e categoria.",
  },
  {
    title: "Veja seu mês de relance",
    description: "Cards de receita, despesa e saldo, com gráfico por categoria.",
  },
  {
    title: "Exporte quando quiser",
    description: "Baixe as transações filtradas em CSV para planilhas.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <span className="font-semibold">Finanças Pessoais</span>
        <div className="flex gap-2">
          <Button variant="ghost" render={<Link href="/login" />}>
            Entrar
          </Button>
          <Button render={<Link href="/cadastro" />}>Criar conta</Button>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center md:py-24">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Controle suas finanças com clareza
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Um jeito simples e visual de acompanhar receitas, despesas e saldo do mês, sem planilhas espalhadas.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button size="lg" render={<Link href="/cadastro" />}>
            Começar agora
          </Button>
          <Button size="lg" variant="outline" render={<Link href="/login" />}>
            Já tenho conta
          </Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-20 md:grid-cols-3 md:px-6">
        {HIGHLIGHTS.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </section>
    </main>
  );
}
