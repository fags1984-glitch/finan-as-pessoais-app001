import { signUp } from "@/app/actions/auth";
import { AuthForm } from "@/components/auth-form";

export default function CadastroPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <AuthForm
        title="Criar conta"
        description="Comece a organizar suas finanças"
        submitLabel="Criar conta"
        action={signUp}
        footer={{ text: "Já tem conta?", href: "/login", linkLabel: "Entrar" }}
      />
    </main>
  );
}
