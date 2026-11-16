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

function Brand() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2.5">
      <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
          <path d="M4 17 10 11 14 15 20 8" />
        </svg>
      </span>
      <span className="font-heading text-[17px] font-semibold tracking-tight text-white">Finanças</span>
    </Link>
  );
}

export function Nav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop: barra lateral */}
      <aside className="sticky top-0 hidden h-screen flex-col bg-sidebar p-5 text-sidebar-foreground md:flex">
        <Brand />

        <nav className="mt-10 flex flex-col gap-1">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <form action={signOut} className="mt-auto">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
          >
            <LogOut className="size-4" />
            Sair
          </button>
        </form>
      </aside>

      {/* Mobile: barra inferior flutuante */}
      <nav className="fixed inset-x-4 bottom-4 z-10 flex rounded-2xl bg-sidebar p-1.5 shadow-lg shadow-black/20 md:hidden">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-xs font-medium transition-colors",
                active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70",
              )}
            >
              <Icon className="size-5" />
              {label}
            </Link>
          );
        })}
        <form action={signOut} className="flex flex-1">
          <button
            type="submit"
            className="flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-xs font-medium text-sidebar-foreground/70"
          >
            <LogOut className="size-5" />
            Sair
          </button>
        </form>
      </nav>
    </>
  );
}
