# Knowledge Hub

Uma **base de conhecimento pessoal** (Personal Knowledge Base) para centralizar o que se usa no dia a dia — documentações, prompts de IA, snippets de código, casos de teste, anotações — com editor Markdown, busca, categorias e favoritos. Uso single-user na V1, arquitetura pensada para escalar depois.

> Projeto de estudos conduzido como produto real: uma dinâmica de *pair programming* entre Rodrigo (dev júnior/QA) e uma IA mentora, priorizando arquitetura limpa, segurança e testes. Decisões e o "porquê" de cada uma ficam registradas como ADRs em [`docs/01-arquitetura/06-decisoes-tecnicas.md`](docs/01-arquitetura/06-decisoes-tecnicas.md).

## Stack

Next.js (App Router) · TypeScript · Supabase (PostgreSQL + Auth + Storage) · CSS Modules (sem Tailwind) · Vitest + React Testing Library + Playwright · Deploy na Vercel.

## Como rodar

Pré-requisitos: Node.js + npm, e um `.env.local` (fora do Git) com as chaves do Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

```bash
npm install
npm run dev          # http://localhost:3000
```

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (Turbopack) |
| `npm run lint` | ESLint |
| `npm run test` | Testes unitários e de componente (Vitest) |
| `npm run test:coverage` | Testes + cobertura (gate de 80% na lógica) |
| `npm run build` | Build de produção + type-check |
| `npm run test:e2e` | E2E (Playwright) — precisa de `.env.test.local` com credenciais |

## Arquitetura em um parágrafo

Organização **feature-first**: cada funcionalidade em `src/funcionalidades/<nome>/` dividida em `dominio/` (regras puras), `dados/` (Server Actions que falam com o Supabase) e `apresentacao/` (componentes); o compartilhado fica em `src/nucleo/`. O acesso a dados usa **Server Actions + Server Components**, com **RLS** no Postgres garantindo que cada usuário só veja os próprios dados. Detalhes em [`docs/01-arquitetura/`](docs/01-arquitetura/).

## Documentação

A documentação segue o padrão SDD, modularizada em [`docs/`](docs/) — cada arquivo com responsabilidade única:

| Pasta | Assunto |
|---|---|
| `00-visao-do-produto/` | Propósito, escopo, roadmap e público-alvo |
| `01-arquitetura/` | Visão geral, requisitos, stack e **ADRs (decisões técnicas)** |
| `02-banco-de-dados/` | Entidades e modelagem |
| `03-frontend/` · `05-ui-ux/` | Estrutura de pastas · design system, tokens e telas |
| `04-backend/` | Supabase, segurança/RLS e migrations |
| `06-testes/` | Estratégia de testes e casos de teste (`unitarios/`, `componentes/`, `e2e/`) |
| `07-deploy/` · `08-roadmap/` | Ambientes e pipeline · roadmap detalhado |
| `09-documentacao/` | Padrão de documentação (SDD) |

Para desenvolver neste repositório, veja também [`CLAUDE.md`](CLAUDE.md) (convenções e comandos para o agente de IA).

## Licença / status

Projeto pessoal de estudos, em desenvolvimento (V1 / MVP). Repositório: [`lacerdaRodrigo/site-pessoal`](https://github.com/lacerdaRodrigo/site-pessoal).
