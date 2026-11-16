import { Nav } from "@/components/nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/40">
      <Nav />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 md:px-6 md:pb-10">{children}</main>
    </div>
  );
}
