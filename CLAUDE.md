# CLAUDE.md — contexto do agente

Base de conhecimento pessoal (Knowledge Hub). O que o produto é, escopo e roadmap: `README.md` e `docs/`. Este arquivo é só o **não-óbvio** para trabalhar aqui — o que não dá para descobrir lendo o código ou o `git log`.

## Comandos

| Ação | Comando |
|---|---|
| Rodar em dev (Turbopack) | `npm run dev` → http://localhost:3000 |
| Lint | `npm run lint` |
| Testes (unit + componente) | `npm run test` |
| Testes + cobertura (o que o CI roda) | `npm run test:coverage` |
| Build + type-check | `npm run build` |
| E2E (Playwright) | `npm run test:e2e` |

- **E2E roda contra o deploy real na Vercel**, não `localhost` (ADR 10). Precisa de `.env.test.local` (fora do Git) com `E2E_EMAIL`/`E2E_SENHA` de uma conta confirmada — sem isso os specs são **pulados**, não falham. No CI, dispara pós-deploy via `deployment_status`.
- `next build` faz o type-check — os testes de E2E (`testes-e2e/`) ficam fora dele e do Vitest, então erro de tipo lá só aparece no `npm run test:e2e`/`playwright test --list`.

## Arquitetura e convenções

- **Feature-first (fatia vertical)**, ADR 01. Cada funcionalidade em `src/funcionalidades/<nome>/` com três camadas: `dominio/` (regras puras, sem Supabase/Next), `dados/` (repositório: Server Actions que falam com o Supabase), `apresentacao/` (componentes). Núcleo compartilhado em `src/nucleo/`.
- **PT-BR em tudo** (ADR 05): nomes de variáveis, funções, tipos, tabelas, pastas e docs. Exceção só onde o framework exige (`app/`, `page.tsx`, `layout.tsx`, palavras reservadas).
- **camelCase no domínio ↔ snake_case no banco.** A tradução é responsabilidade da camada `dados/` (função `mapear()` em cada `acoes.ts`/`consultas.ts`). O domínio nunca vê `usuario_id`/`criado_em`.
- **Server Actions + Server Components (RSC)**, NÃO TanStack Query/Zustand (o ADR 08 previa Zustand+TanStack, mas o CRUD seguiu RSC — mais simples, zero libs novas). Formulários client usam `useActionState`; ações sem retorno usam `<form action={...}>` direto.
- **RLS filtra as leituras** (`auth.uid() = usuario_id`): não é preciso filtrar por usuário à mão nas queries de leitura. No INSERT, preencher `usuario_id` explicitamente.
- Estilo: **CSS Modules / CSS puro, sem Tailwind.** Consome os tokens de `src/app/globals.css` (definidos em `docs/05-ui-ux/02-tokens-visuais.md`).

## Banco de dados / Supabase

- Migrations em `supabase/migrations/`, cada uma **já com RLS + policies no mesmo arquivo**. Ordem por dependência de FK: `perfis` → `categorias` → `documentos`.
- **Sem Docker nesta máquina:** o ambiente local (`supabase start`/`db reset`) NÃO funciona. Aplicar migrations com **`supabase db push`** direto no projeto remoto (o aviso de Docker no push é inofensivo). O Supabase CLI foi instalado pelo **binário oficial** em `~/.local/bin` — `npx supabase` falha ("No matching Supabase CLI binary").
- Verificar tabela no ar: REST API com a `anon key` retornando `200 []` = tabela existe + RLS ativo.

## Testes

- **Cobertura mede SÓ a lógica** (`src/funcionalidades/**/dominio/**` + `src/nucleo/**`, excluindo `nucleo/supabase/**`). UI, `apresentacao/` e `dados/` ficam de fora — validados por componente/E2E. **Gate de 80% trava o merge** no CI. Ao adicionar lógica em `dominio/`/`nucleo/`, escrever teste junto ou o CI barra.
- **Caso de teste legível para cada teste automatizado**, em `docs/06-testes/casos-testes/{unitarios,componentes,e2e}/` — nunca misturar os níveis. Cada teste tem um ID `CT-XX` que aparece no nome do teste e no doc. **Numeração contígua: confira o maior `CT-` já usado antes de numerar** (`grep -rhoE "CT-[0-9]+" docs src testes-e2e`).
- **Gotcha:** não há `globals: true` no Vitest → a limpeza automática do Testing Library não roda. Em arquivo de teste de componente com mais de um `render()`, chamar `afterEach(cleanup)`.
- Server Actions em teste de componente: mockar com `vi.mock()` (não são chamada de rede). `MSW` fica para chamadas HTTP diretas do navegador.

## Regras invioláveis (fluxo)

- **Nunca codar direto na `main`** (protegida, ADR 11). Todo trabalho em branch por assunto (`feat/`/`fix/`/`docs/`/`chore/`/`ci/` + descrição PT-BR) e integrado via PR. Checar a branch antes de editar; se estiver na `main`, parar e perguntar.
- **Pendências do Git primeiro:** antes de abrir feature nova, mergear PRs abertos (Dependabot!) e limpar o Git.
- **Decisões não são definitivas:** propor melhorias sobre decisões antigas quando fizer sentido; ao mudar, marcar o ADR antigo como "Superseded" (não apagar) e registrar o porquê.
- **Documentação viva:** ao mudar arquitetura/regra/escopo, atualizar os docs afetados no mesmo trabalho — só os que a mudança toca. NÃO documentar o que o git já registra (histórico, PRs, status).
- **NÃO rodar `npm audit fix --force`** — faria downgrade catastrófico (`next 16 → 9`). As vulns de `postcss` (transitiva do Next) e o bump ESLint 9→10 foram **adiados de propósito**.
- Rodrigo **commita/pusha ele mesmo** — não commitar sem ele pedir.

## Onde achar o quê

- Decisões de arquitetura (o porquê): `docs/01-arquitetura/06-decisoes-tecnicas.md` (ADRs, com "Superseded").
- Entidades do banco: `docs/02-banco-de-dados/01-entidades.md` · Migrations: `docs/04-backend/02-migrations-e-versionamento.md` · Segurança/RLS/auth: `docs/04-backend/01-supabase-e-seguranca.md`.
- Estratégia de testes: `docs/06-testes/01-estrategia-de-testes.md` · Deploy/pipeline: `docs/07-deploy/01-ambientes-e-pipeline.md` · Tokens/telas: `docs/05-ui-ux/`.
