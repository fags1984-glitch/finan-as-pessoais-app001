import { signIn } from "@/app/actions/auth";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <AuthForm
        title="Entrar"
        description="Acesse suas finanças"
        submitLabel="Entrar"
        action={signIn}
        footer={{ text: "Não tem conta?", href: "/cadastro", linkLabel: "Criar conta" }}
      />
    </main>
  );
}
