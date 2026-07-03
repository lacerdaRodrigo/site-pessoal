# Backend — Migrations e Versionamento do Banco

## 1. Decisão: Uso do Supabase CLI

Esta era uma pendência registrada no README ("Pontos que Ainda Precisam Ser Definidos"). Decisão tomada: **sim, vamos usar o Supabase CLI** para versionar o schema do banco de dados.

> 💡 **Nota de Aprendizado (Mentoria):** "Migration" é um arquivo `.sql` que descreve **uma mudança incremental** no banco (ex: "criar tabela X", "adicionar coluna Y"). Em vez de editar o banco direto pela interface visual do Supabase (o que ninguém mais consegue rastrear depois), cada mudança de schema vira um arquivo versionado no Git — igual ao código.

## 2. Por que não editar o banco direto pelo Dashboard do Supabase?

- **Rastreabilidade:** sem migrations, não existe histórico de "quando" e "por quê" uma coluna foi criada — só o estado atual.
- **Reprodutibilidade:** se o projeto precisar recriar o banco do zero (ex: ambiente de testes, ou um novo colaborador no futuro), rodar as migrations em ordem recria o schema exato.
- **Alinhamento com a "Regra de Ouro" do projeto:** a mesma lógica de "documentação viva" (README) se aplica ao banco — o schema deve estar documentado e versionado, não só existir "na nuvem".

## 3. Fluxo de Trabalho Planejado

```text
1. Rodrigo cria/altera uma tabela localmente com o Supabase CLI
   (supabase migration new nome_da_mudanca)
        ↓
2. Escreve o SQL da mudança dentro do arquivo gerado em supabase/migrations/
        ↓
3. Testa localmente (supabase db reset, ambiente local do Supabase via Docker)
        ↓
4. Commita o arquivo de migration no Git junto com o código que o utiliza
        ↓
5. Pipeline de CI/CD (GitHub Actions) aplica a migration no projeto Supabase
   de produção (supabase db push), como parte do deploy
```

## 4. Estrutura de Pastas Esperada

```text
supabase/
├── config.toml           # Configuração do projeto Supabase CLI
└── migrations/
    ├── 20260701000000_criar_tabela_perfis.sql
    ├── 20260701000100_criar_tabela_categorias.sql
    ├── 20260701000200_criar_tabela_documentos.sql
    └── ...
```

Cada arquivo de migration deve, sempre que criar uma tabela nova, já incluir a habilitação de RLS e as policies correspondentes (ver checklist em `01-supabase-e-seguranca.md`) — nunca separar "criar tabela" de "proteger tabela" em commits diferentes, para evitar uma janela de tempo em que a tabela existe sem proteção.

## 5. Impacto no Pipeline de CI/CD

Este fluxo se conecta com o Módulo 07 (Deploy): o passo `supabase db push` roda como etapa 4 da pipeline, **antes** do build/deploy do frontend (ver `docs/07-deploy/01-ambientes-e-pipeline.md`, seções 3 e 4) — schema do banco atualizado antes de qualquer código novo que dependa dele ir ao ar. Autenticação via `SUPABASE_ACCESS_TOKEN` e `SUPABASE_DB_PASSWORD`, guardados como GitHub Secrets (mesma seção 4 do documento de deploy).
