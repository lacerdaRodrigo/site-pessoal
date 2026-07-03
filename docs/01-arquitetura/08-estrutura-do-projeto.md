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
│   ├── 07-deploy/
│   ├── 08-roadmap/
│   └── 09-documentacao/
│
├── src/                         # Código-fonte do projeto (a ser criado)
│   ├── app/                     # Rotas do Next.js (App Router) — nome exigido pelo framework
│   ├── nucleo/                  # Tudo que é global (tema, utilidades, componentes compartilhados)
│   └── funcionalidades/         # Lógica de negócio por feature (Feature-First) — detalhado no Módulo 03
│
├── __tests__/                   # Testes unitários e de integração (a ser criado — nomenclatura definida no Módulo 06)
│
├── e2e/                         # Testes end-to-end (a ser criado — substitui o integration_test/ do Flutter)
│
├── public/                      # Assets estáticos (imagens, favicon) — nome exigido pelo framework
│
├── .github/
│   └── workflows/              # Pipelines de CI/CD (GitHub Actions)
│
├── supabase/                   # Migrations e configuração do Supabase CLI (ver docs/04-backend/02-migrations-e-versionamento.md)
│
├── package.json                # Dependências e metadados do projeto (substitui o pubspec.yaml do Flutter)
├── tsconfig.json                # Configuração do TypeScript
├── eslint.config.mjs            # Configuração de lint (substitui o analysis_options.yaml do Flutter)
├── next.config.ts               # Configuração do Next.js
└── README.md                   # Documento raiz — Single Source of Truth do projeto
```

## 2. O que já existe e o que ainda não existe

O `npx create-next-app` foi executado em 2026-07-02 (ver "Próximos Passos" no README). As pastas `src/` (com `src/app/` já criado pelo framework) e `public/` **já existem fisicamente**, junto com `package.json`, `tsconfig.json`, `eslint.config.mjs` e `next.config.ts`.

Ainda **não existem**:
- `src/nucleo/` e `src/funcionalidades/` — nascem no próximo passo, quando a árvore Feature-First de `docs/03-frontend/01-estrutura-de-pastas.md` for montada dentro de `src/`.
- `__tests__/` e `e2e/` — nascem junto com a estratégia de testes (Módulo 06).
- `.github/workflows/` — nasce junto com o pipeline de CI/CD (Módulo 07).
- `supabase/` — só será criada quando o primeiro código de backend nascer, seguindo o fluxo de migrations já decidido em `docs/04-backend/02-migrations-e-versionamento.md`.

O repositório Git ainda não foi inicializado (decisão deliberada, ver README — seção "Decisões Tomadas"); por isso o `create-next-app` foi rodado com a flag `--disable-git`.

## 3. Por que documentar uma estrutura que ainda não existe?

Porque a "Regra de Ouro" do projeto (README, seção "Decisões Tomadas") exige que a documentação seja escrita *antes ou junto* da decisão técnica, não depois. Isso também ajuda a validar, no momento do `create-next-app`, se a estrutura gerada bate com o que foi planejado — e não o contrário.
