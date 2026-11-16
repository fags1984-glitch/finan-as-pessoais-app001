import Link from "next/link";
import { signIn } from "@/app/actions/auth";
import { AuthForm } from "@/components/auth-form";
import { AuthShowcase } from "@/components/auth-showcase";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1fr_1fr]">
      <AuthShowcase />
      <div className="flex flex-col justify-center px-6 py-12 md:px-12">
        <Link href="/" className="mb-auto font-heading text-[17px] font-semibold tracking-tight lg:hidden">
          Finanças
        </Link>
        <div className="mx-auto w-full max-w-sm">
          <AuthForm
            title="Entrar"
            description="Acesse suas finanças"
            submitLabel="Entrar"
            action={signIn}
            footer={{ text: "Não tem conta?", href: "/cadastro", linkLabel: "Criar conta" }}
          />
        </div>
      </div>
    </main>
  );
}
