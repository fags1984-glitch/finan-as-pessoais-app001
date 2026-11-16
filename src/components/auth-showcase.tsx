export function AuthShowcase() {
  return (
    <aside className="relative hidden overflow-hidden bg-pine p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <span className="font-heading text-[17px] font-semibold tracking-tight">Finanças</span>

      <div className="max-w-md">
        <p className="font-heading text-5xl font-semibold leading-[1.05] tracking-tight">
          Saiba para onde vai cada real.
        </p>
        <p className="mt-6 text-lg leading-relaxed text-white/75">
          Registre receitas e despesas, veja o saldo do mês de relance e exporte tudo em CSV quando quiser.
        </p>
      </div>

      <svg
        aria-hidden
        viewBox="0 0 400 120"
        className="absolute -bottom-6 -right-10 w-[420px] text-white/10"
        fill="none"
        stroke="currentColor"
        strokeWidth="18"
        strokeLinecap="round"
      >
        <path d="M10 100 C 80 100, 90 40, 160 60 S 250 110, 300 40 S 370 20, 390 14" />
      </svg>
    </aside>
  );
}
