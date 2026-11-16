# Finanças Pessoais App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Web app de finanças pessoais com login (Supabase Auth), CRUD de transações, categorias, filtros, dashboard com gráfico por categoria, exportação CSV e landing page.

**Architecture:** Aplicação única Next.js (App Router) sem backend separado. Mutations via Server Actions, leitura via Server Components, e um cliente Supabase server-side (`@supabase/ssr`) com cookies. RLS no Postgres garante isolamento por usuário. Lógica pura (categorias, resumo, filtros, CSV) fica em módulos testáveis com Vitest.

**Tech Stack:** Next.js 14+ (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, Recharts, Supabase (Auth + PostgreSQL + RLS), `@supabase/ssr`, Zod, Vitest.

**Spec:** Desenho aprovado pelo usuário na conversa (PRD "Finanças Pessoais App").

## Global Constraints

- Interface em português (pt-BR); valores monetários em BRL (`Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`).
- Categorias fixas: Alimentação, Transporte, Moradia, Lazer, Saúde, Educação, Salário, Freelance, Outros.
- Tipo de transação: `receita` ou `despesa`.
- Cada usuário só vê e gerencia as próprias transações (RLS).
- Layout responsivo com Tailwind (mobile first, sem scroll horizontal).
- Supabase ainda não conectado: variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` ficam em `.env.example`; o usuário preenche depois.

## Review Focus

- Valor com vírgula decimal pt-BR (`"1.234,56"`) deve ser aceito e salvo corretamente.
- Valor zero ou negativo deve ser rejeitado com mensagem clara.
- Descrição vazia ou só com espaços deve ser rejeitada.
- Mês sem transações deve mostrar estado vazio sem quebrar o gráfico.
- CSV com vírgula, aspas ou quebra de linha na descrição deve ser escapado.

---

## File Structure

- `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.mjs`: scaffold (Task 1).
- `src/lib/categories.ts`: lista de categorias e tipo de transação.
- `src/lib/format.ts`: formatação de moeda e data pt-BR, parse de valor pt-BR.
- `src/lib/transactions/schema.ts`: schema Zod do formulário de transação.
- `src/lib/transactions/summary.ts`: resumo (receita, despesa, saldo) e agregação por categoria.
- `src/lib/transactions/filters.ts`: filtros (mês/ano, categoria, busca) como função pura.
- `src/lib/transactions/csv.ts`: geração de CSV com escape.
- `src/lib/supabase/server.ts`, `src/lib/supabase/client.ts`, `src/lib/supabase/middleware.ts`: clientes Supabase.
- `src/proxy.ts`: proteção de rotas (Next 16 chama middleware de proxy).
- `src/app/actions/auth.ts`: Server Actions de login, cadastro e logout.
- `src/app/actions/transactions.ts`: Server Actions de criar, editar, excluir.
- `src/app/page.tsx`: landing page.
- `src/app/login/page.tsx`, `src/app/cadastro/page.tsx`: autenticação.
- `src/app/(app)/layout.tsx`: layout autenticado com navegação.
- `src/app/(app)/dashboard/page.tsx`: dashboard.
- `src/app/(app)/transacoes/page.tsx`: lista, filtros e busca.
- `src/app/(app)/transacoes/export/route.ts`: exportação CSV.
- `src/components/transaction-form.tsx`, `src/components/transaction-list.tsx`, `src/components/category-pie-chart.tsx`, `src/components/summary-cards.tsx`, `src/components/filters-bar.tsx`, `src/components/nav.tsx`: componentes.
- `supabase/schema.sql`: tabela, índices e políticas RLS.
- Testes em `src/lib/**/*.test.ts`.

---

### Task 1: Scaffold do projeto

**Files:**
- Create: projeto Next.js na raiz (`package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `src/app/layout.tsx`, `src/app/globals.css`)
- Create: `.env.example`, `vitest.config.ts`

**Interfaces:**
- Consumes: nada.
- Produces: scripts `dev`, `build`, `test` (Vitest) funcionando.

- [ ] **Step 1: Criar o projeto Next.js**

Run: `npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-turbopack`
Expected: projeto criado sem erros.

- [ ] **Step 2: Instalar dependências**

Run: `npm install @supabase/supabase-js @supabase/ssr recharts zod class-variance-authority clsx tailwind-merge lucide-react`
Run: `npm install -D vitest @vitejs/plugin-react jsdom`
Expected: instalação sem erros.

- [ ] **Step 3: Inicializar shadcn/ui**

Run: `npx shadcn@latest init -d`
Then: `npx shadcn@latest add button card input label select dialog table badge`
Expected: componentes em `src/components/ui/`.

- [ ] **Step 4: Configurar Vitest e script de teste**

`vitest.config.ts` com ambiente `node`, alias `@` apontando para `src`. Em `package.json`, script `"test": "vitest run"`.

- [ ] **Step 5: Criar `.env.example`**

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

- [ ] **Step 6: Verificar build**

Run: `npm run build`
Expected: build concluído sem erros.

---

### Task 2: Domínio puro (categorias, formatação, validação)

**Files:**
- Create: `src/lib/categories.ts`, `src/lib/format.ts`, `src/lib/transactions/schema.ts`
- Test: `src/lib/format.test.ts`, `src/lib/transactions/schema.test.ts`

**Interfaces:**
- Produces:
  - `CATEGORIES: readonly ["Alimentação","Transporte","Moradia","Lazer","Saúde","Educação","Salário","Freelance","Outros"]`
  - `type Category = (typeof CATEGORIES)[number]`
  - `type TransactionType = "receita" | "despesa"`
  - `formatBRL(value: number): string`
  - `parseBRLInput(input: string): number` (aceita `"1.234,56"` e `"1234.56"`; retorna `NaN` se inválido)
  - `transactionInputSchema`: Zod com `description` (trim, não vazio, máx. 120), `amount` (number > 0), `date` (YYYY-MM-DD), `type` (enum), `category` (enum de `CATEGORIES`).

- [ ] **Step 1: Escrever testes de `parseBRLInput`**

```ts
expect(parseBRLInput("1.234,56")).toBe(1234.56);
expect(parseBRLInput("1234.56")).toBe(1234.56);
expect(Number.isNaN(parseBRLInput("abc"))).toBe(true);
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test -- src/lib/format.test.ts`
Expected: FAIL (função não definida).

- [ ] **Step 3: Implementar `format.ts`** com `formatBRL` e `parseBRLInput`.

- [ ] **Step 4: Escrever testes do schema**: descrição só com espaços falha; `amount` 0 falha; `amount` 10 passa; categoria fora da lista falha.

- [ ] **Step 5: Implementar `categories.ts` e `schema.ts`** e rodar `npm test`.
Expected: PASS.

---

### Task 3: Resumo, filtros e CSV (lógica pura)

**Files:**
- Create: `src/lib/transactions/summary.ts`, `src/lib/transactions/filters.ts`, `src/lib/transactions/csv.ts`
- Test: `src/lib/transactions/summary.test.ts`, `src/lib/transactions/filters.test.ts`, `src/lib/transactions/csv.test.ts`

**Interfaces:**
- Consumes: `Transaction` = `{ id: string; description: string; amount: number; date: string; type: TransactionType; category: Category }`; `TransactionType`, `Category` de Task 2.
- Produces:
  - `summarize(txs: Transaction[]): { income: number; expense: number; balance: number }`
  - `byCategory(txs: Transaction[]): { category: Category; total: number }[]` (somente despesas, ordenado do maior para o menor)
  - `filterTransactions(txs, { year?: number; month?: number; category?: Category; search?: string }): Transaction[]` (busca sem diferenciar maiúsculas e acentos)
  - `toCSV(txs: Transaction[]): string` (cabeçalho `data;descricao;tipo;categoria;valor`, separador `;`, valor com vírgula decimal, campos com `;`, `"`, ou quebra de linha entre aspas, com `"` duplicado)

- [ ] **Step 1: Escrever testes** cobrindo: soma de receitas e despesas e saldo; `byCategory` ignora receitas; filtro por mês e ano; busca `"cafe"` encontra `"Café da manhã"`; CSV com descrição `Mercado; "Extra"` produz `"Mercado; ""Extra"""`.

- [ ] **Step 2: Rodar e ver falhar.** Run: `npm test`. Expected: FAIL.

- [ ] **Step 3: Implementar os três módulos.** Run: `npm test`. Expected: PASS.

---

### Task 4: Banco de dados (Supabase schema e RLS)

**Files:**
- Create: `supabase/schema.sql`

**Interfaces:**
- Produces: tabela `public.transactions` com colunas `id uuid pk default gen_random_uuid()`, `user_id uuid not null references auth.users on delete cascade default auth.uid()`, `description text not null check (length(trim(description)) between 1 and 120)`, `amount numeric(12,2) not null check (amount > 0)`, `date date not null`, `type text not null check (type in ('receita','despesa'))`, `category text not null check (category in (...9 categorias...))`, `created_at timestamptz default now()`. Índice em `(user_id, date)`.

- [ ] **Step 1: Escrever `supabase/schema.sql`** com a tabela, índice, `alter table ... enable row level security` e políticas separadas para `select`, `insert`, `update`, `delete` usando `auth.uid() = user_id`.

- [ ] **Step 2: Verificar revisando o arquivo.** Expected: as quatro políticas usam `auth.uid() = user_id`. (A aplicação no projeto Supabase fica para depois, junto com as variáveis de ambiente.)

---

### Task 5: Clientes Supabase e proteção de rotas

**Files:**
- Create: `src/lib/supabase/server.ts`, `src/lib/supabase/client.ts`, `src/lib/supabase/middleware.ts`, `src/middleware.ts`

**Interfaces:**
- Produces:
  - `createClient(): Promise<SupabaseClient>` em `server.ts` (usa `cookies()` do Next).
  - `createBrowserClient()` em `client.ts`.
  - `updateSession(request: NextRequest): Promise<NextResponse>` em `middleware.ts`: atualiza a sessão e redireciona para `/login` quando não há usuário e a rota começa com `/dashboard` ou `/transacoes`.
  - `src/middleware.ts` exporta `middleware` e `config.matcher` excluindo assets estáticos.

- [ ] **Step 1: Implementar os clientes** conforme a documentação do `@supabase/ssr` (padrão `getAll`/`setAll`).

- [ ] **Step 2: Implementar `updateSession` e `middleware.ts`.** Se as variáveis de ambiente não existirem, a função deve lançar erro com mensagem clara ("Configure NEXT_PUBLIC_SUPABASE_URL").

- [ ] **Step 3: Verificar build.** Run: `npm run build`. Expected: sucesso.

---

### Task 6: Autenticação (login, cadastro, logout)

**Files:**
- Create: `src/app/actions/auth.ts`, `src/app/login/page.tsx`, `src/app/cadastro/page.tsx`

**Interfaces:**
- Produces: `signIn(formData: FormData)`, `signUp(formData: FormData)`, `signOut()` como Server Actions. Erros retornam `{ error: string }` e o formulário exibe a mensagem.

- [ ] **Step 1: Implementar as Server Actions** com `supabase.auth.signInWithPassword`, `signUp` e `signOut`. Redirecionar para `/dashboard` após login/cadastro.

- [ ] **Step 2: Implementar as páginas** `login` e `cadastro` com formulário (e-mail, senha) usando shadcn `Card`, `Input`, `Button`, `Label`.

- [ ] **Step 3: Verificar build.** Run: `npm run build`. Expected: sucesso.

---

### Task 7: Layout autenticado e navegação responsiva

**Files:**
- Create: `src/app/(app)/layout.tsx`, `src/components/nav.tsx`

**Interfaces:**
- Consumes: `signOut` de Task 6.
- Produces: `Nav` com links "Dashboard" e "Transações" e botão "Sair". No mobile, a navegação fica em barra inferior; no desktop, na barra superior.

- [ ] **Step 1: Implementar `nav.tsx`** (client component com `usePathname` para destacar o link ativo).

- [ ] **Step 2: Implementar `(app)/layout.tsx`** renderizando `Nav` e `children` dentro de um container com gutter de 16px no mobile.

- [ ] **Step 3: Verificar build.** Run: `npm run build`. Expected: sucesso.

---

### Task 8: CRUD de transações

**Files:**
- Create: `src/app/actions/transactions.ts`, `src/lib/transactions/queries.ts`, `src/components/transaction-form.tsx`

**Interfaces:**
- Consumes: `transactionInputSchema` (Task 2), `createClient` (Task 5), `Transaction` (Task 3).
- Produces:
  - `listTransactions(): Promise<Transaction[]>` em `queries.ts` (ordenado por data desc, mapeando colunas snake_case para o tipo `Transaction`).
  - `createTransaction(input: TransactionInput)`, `updateTransaction(id: string, input: TransactionInput)`, `deleteTransaction(id: string)` como Server Actions. Validam com o schema Zod, retornam `{ error }` em falha e chamam `revalidatePath('/transacoes')` e `revalidatePath('/dashboard')` em sucesso.
  - `TransactionForm` (client): props `initial?: Transaction`, `onDone: () => void`. O campo de valor aceita vírgula decimal e usa `parseBRLInput`.

- [ ] **Step 1: Implementar as actions e `listTransactions`.**

- [ ] **Step 2: Implementar `TransactionForm`** com campos descrição, valor, data, tipo, categoria (shadcn `Select`).

- [ ] **Step 3: Verificar build.** Run: `npm run build`. Expected: sucesso.

---

### Task 9: Página de transações com filtros, busca e exportação

**Files:**
- Create: `src/app/(app)/transacoes/page.tsx`, `src/app/(app)/transacoes/export/route.ts`, `src/components/transaction-list.tsx`, `src/components/filters-bar.tsx`

**Interfaces:**
- Consumes: `listTransactions` (Task 8), `filterTransactions` (Task 3), `toCSV` (Task 3), `TransactionForm` (Task 8).
- Produces:
  - Página lê `searchParams` (`year`, `month`, `category`, `q`) e aplica `filterTransactions`.
  - `FiltersBar` (client): atualiza a URL com `router.replace` ao mudar mês/ano, categoria ou busca.
  - `TransactionList` (client): lista com editar (abre `Dialog` com `TransactionForm`) e excluir (confirmação em `Dialog`). Estado vazio quando não há resultados.
  - Rota `GET /transacoes/export` aceita os mesmos parâmetros de filtro, aplica `filterTransactions` e retorna `text/csv` com `Content-Disposition: attachment; filename="transacoes.csv"`.

- [ ] **Step 1: Implementar `FiltersBar` e `TransactionList`.**

- [ ] **Step 2: Implementar a página** e o botão "Exportar CSV" apontando para `/transacoes/export` com os filtros atuais.

- [ ] **Step 3: Implementar a rota de exportação.**

- [ ] **Step 4: Verificar build.** Run: `npm run build`. Expected: sucesso.

---

### Task 10: Dashboard

**Files:**
- Create: `src/app/(app)/dashboard/page.tsx`, `src/components/summary-cards.tsx`, `src/components/category-pie-chart.tsx`

**Interfaces:**
- Consumes: `listTransactions`, `filterTransactions`, `summarize`, `byCategory`, `formatBRL`.
- Produces:
  - Página com seletor de mês/ano (searchParams `year`, `month`; padrão: mês atual).
  - `SummaryCards`: três cards (Receita Total, Despesa Total, Saldo) com `formatBRL`.
  - `CategoryPieChart` (client, Recharts `PieChart`): recebe `data: { category; total }[]`. Se vazio, mostra "Sem despesas neste período".

- [ ] **Step 1: Implementar `SummaryCards` e `CategoryPieChart`.**

- [ ] **Step 2: Implementar a página** juntando os componentes.

- [ ] **Step 3: Verificar build.** Run: `npm run build`. Expected: sucesso.

---

### Task 11: Landing page

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: nada.
- Produces: página pública com título, descrição curta do produto, botões "Entrar" (`/login`) e "Criar conta" (`/cadastro`), e três destaques (registro, dashboard, exportação CSV).

- [ ] **Step 1: Implementar a landing page** responsiva.

- [ ] **Step 2: Verificar build.** Run: `npm run build`. Expected: sucesso.

---

### Task 12: Verificação final

- [ ] **Step 1:** Run: `npm test`. Expected: todos os testes passam.
- [ ] **Step 2:** Run: `npm run build`. Expected: build sem erros.
- [ ] **Step 3:** Run: `npm run lint`. Expected: sem erros.
- [ ] **Step 4:** Revisar contra o PRD: landing, login/cadastro, proteção de rotas, dashboard com cards e pizza, CRUD, filtros por mês/ano, categoria e busca, exportação CSV, responsividade.
- [ ] **Step 5:** Registrar o que ficou pendente: aplicar `supabase/schema.sql`, preencher `.env.local`, deploy na Vercel.
