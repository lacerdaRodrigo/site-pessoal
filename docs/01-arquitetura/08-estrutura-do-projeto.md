# Arquitetura — Estrutura do Projeto (Repositório)

Este documento descreve a organização do **repositório como um todo** (pastas na raiz do projeto). Para a organização interna do código-fonte (`src/`), consulte `docs/03-frontend/01-estrutura-de-pastas.md` — aquele documento é o "zoom" da pasta `src/`; este é o "zoom out" do repositório inteiro.

> 💡 **Nota de Aprendizado (Mentoria):** `src/` aqui cumpre o mesmo papel que `lib/` cumpria no Flutter — um container único para todo o código-fonte, separado dos arquivos de configuração que ficam soltos na raiz.

## 1. Árvore Esperada na Raiz do Repositório

```text
projeto-web/
│
├── docs/                      # Documentação viva do projeto (SDD)
│   ├── 00-visao-do-produto/
│   ├── 01-arquitetura/
│   ├── 02-banco-de-dados/
│   ├── 03-frontend/
│   ├── 04-backend/
│   ├── 05-ui-ux/
│   ├── 06-testes/
│   │   └── casos-testes/        # Casos de teste em Markdown, separados por tipo (unitarios/, componentes/, e2e/)
│   ├── 07-deploy/
│   ├── 08-roadmap/
│   └── 09-documentacao/
│
├── src/                         # Código-fonte do projeto
│   ├── app/                     # Rotas do Next.js (App Router) — nome exigido pelo framework
│   ├── nucleo/                  # Tudo que é global (tema, utilidades, componentes compartilhados)
│   └── funcionalidades/         # Lógica de negócio por feature (Feature-First) — detalhado no Módulo 03
│                                 #   testes unitários/componente ficam ao lado do arquivo que testam
│                                 #   (ex: validacoes.ts + validacoes.test.ts), não numa pasta central
│                                 #   — decisão de 2026-07-05, substitui o __tests__/ planejado abaixo
│
├── testes-e2e/                  # Testes end-to-end (Playwright) — substitui o integration_test/ do Flutter
│
├── public/                      # Assets estáticos (imagens, favicon) — nome exigido pelo framework
│
├── .github/
│   └── workflows/              # Pipelines de CI/CD (GitHub Actions) — ainda não criado, ver Módulo 07
│
├── supabase/                   # Migrations e configuração do Supabase CLI (ver docs/04-backend/02-migrations-e-versionamento.md)
│
├── package.json                # Dependências e metadados do projeto (substitui o pubspec.yaml do Flutter)
├── tsconfig.json                # Configuração do TypeScript
├── eslint.config.mjs            # Configuração de lint (substitui o analysis_options.yaml do Flutter)
├── next.config.ts               # Configuração do Next.js
├── vitest.config.ts             # Configuração do Vitest (testes unitários e de componente)
├── playwright.config.ts         # Configuração do Playwright (testes E2E)
└── README.md                   # Documento raiz — Single Source of Truth do projeto
```

## 2. O que já existe e o que ainda não existe

O `npx create-next-app` foi executado em 2026-07-02 (ver "Próximos Passos" no README). As pastas `src/` (com `src/app/` já criado pelo framework) e `public/` **já existem fisicamente**, junto com `package.json`, `tsconfig.json`, `eslint.config.mjs` e `next.config.ts`.

`src/nucleo/` e `src/funcionalidades/` já existem e já têm código real (não só `.gitkeep`): conexão com Supabase, telas de login/cadastro, logout, e os respectivos testes de unidade/componente ao lado de cada arquivo.

`testes-e2e/`, `docs/06-testes/casos-testes/`, `vitest.config.ts` e `playwright.config.ts` foram criados em 2026-07-05, junto com a infraestrutura completa de testes (ver `docs/06-testes/01-estrategia-de-testes.md`).

Ainda **não existem**:
- `.github/workflows/` — nasce junto com o pipeline de CI/CD completo (Módulo 07, seção 5 já cobre o estado intermediário atual via integração nativa Vercel↔GitHub).
- `supabase/` — só será criada quando o primeiro código de migration nascer, seguindo o fluxo já decidido em `docs/04-backend/02-migrations-e-versionamento.md`.

O repositório Git já foi inicializado e conectado ao GitHub (ver README — seção "Decisões Tomadas").

## 3. Por que documentar uma estrutura que ainda não existe?

Porque a "Regra de Ouro" do projeto (README, seção "Decisões Tomadas") exige que a documentação seja escrita *antes ou junto* da decisão técnica, não depois. Isso também ajuda a validar, no momento do `create-next-app`, se a estrutura gerada bate com o que foi planejado — e não o contrário.
