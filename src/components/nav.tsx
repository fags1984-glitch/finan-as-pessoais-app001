"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ReceiptText, LogOut } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transacoes", label: "Transações", icon: ReceiptText },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop: barra superior */}
      <header className="hidden border-b bg-background md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/dashboard" className="font-semibold">
            Finanças Pessoais
          </Link>
          <nav className="flex items-center gap-1">
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
                  pathname.startsWith(href) && "bg-muted text-primary",
                )}
              >
                {label}
              </Link>
            ))}
            <form action={signOut}>
              <button type="submit" className="ml-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted">
                <LogOut className="size-4" />
                Sair
              </button>
            </form>
          </nav>
        </div>
      </header>

      {/* Mobile: barra inferior */}
      <nav className="fixed inset-x-0 bottom-0 z-10 flex border-t bg-background md:hidden">
        {LINKS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2 text-xs",
              pathname.startsWith(href) ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className="size-5" />
            {label}
          </Link>
        ))}
        <form action={signOut} className="flex flex-1">
          <button type="submit" className="flex flex-1 flex-col items-center gap-1 py-2 text-xs text-muted-foreground">
            <LogOut className="size-5" />
            Sair
          </button>
        </form>
      </nav>
    </>
  );
}
