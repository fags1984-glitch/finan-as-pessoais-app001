import Link from "next/link";
import { Button } from "@/components/ui/button";

const HIGHLIGHTS = [
  {
    title: "Registre tudo num só lugar",
    description: "Receitas e despesas com descrição, valor, data e categoria.",
  },
  {
    title: "Veja seu mês de relance",
    description: "Saldo, receita e despesa do período, com gráfico por categoria.",
  },
  {
    title: "Exporte quando quiser",
    description: "Baixe as transações filtradas em CSV para planilhas.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <span className="font-heading text-[17px] font-semibold tracking-tight">Finanças</span>
        <div className="flex gap-2">
          <Button variant="ghost" nativeButton={false} render={<Link href="/login" />}>
            Entrar
          </Button>
          <Button nativeButton={false} render={<Link href="/cadastro" />}>
            Criar conta
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 pb-20 pt-16 md:pt-28">
        <h1 className="max-w-3xl font-heading text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
          Controle suas finanças com clareza
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Um jeito simples e visual de acompanhar receitas, despesas e saldo do mês, sem planilhas espalhadas.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="h-11 px-5" nativeButton={false} render={<Link href="/cadastro" />}>
            Começar agora
          </Button>
          <Button size="lg" variant="outline" className="h-11 px-5" nativeButton={false} render={<Link href="/login" />}>
            Já tenho conta
          </Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-10 border-t px-6 py-14 md:grid-cols-3">
        {HIGHLIGHTS.map((item) => (
          <div key={item.title}>
            <h2 className="font-heading text-lg font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
