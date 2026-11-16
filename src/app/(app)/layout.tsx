import { Nav } from "@/components/nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[232px_1fr]">
      <Nav />
      <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-6 md:px-10 md:pb-12 md:pt-10">{children}</main>
    </div>
  );
}
