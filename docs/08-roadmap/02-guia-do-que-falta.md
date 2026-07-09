# Guia — O Que Falta Construir

Backlog acionável do projeto, do mais próximo (lacunas da V1) ao mais distante (V2/V3). O roadmap por versão fica em [`01-roadmap-detalhado.md`](01-roadmap-detalhado.md); aqui é a lista de trabalho concreta. Requisitos citados estão em `docs/01-arquitetura/03-requisitos-funcionais.md` (RF) e `04-requisitos-nao-funcionais.md` (RNF); a spec de telas em `docs/05-ui-ux/03-telas-e-componentes.md`.

Legenda: ✅ pronto · 🟡 parcial · ⬜ a fazer.

## Telas

Todas as telas da V1 existem. Rotas: `/login`, `/cadastro`, `/esqueci-senha`, `/redefinir-senha`, `/auth/confirm`, `/auth/confirmado`, `/inicio` (Dashboard), `/documentos`, `/documentos/novo`, `/documentos/[id]`, `/documentos/[id]/editar`, `/configuracoes`. **Nenhuma tela nova pendente na V1** — o que falta são refinamentos dentro delas.

## Lacunas da V1 (a spec promete, o código ainda não faz)

| # | Item | Onde a spec pede | Status |
|---|---|---|---|
| A | Sidebar + gaveta hambúrguer no mobile (< 768px) | RNF02.3 (obrigatório) · telas 2.2 | ✅ (falta opcional: busca e lista de categorias dentro da sidebar) |
| B | Editor com pré-visualização Markdown ao vivo (split pane; abas no mobile) | telas 2.6 | ✅ (falta opcional: barra de topo com modo/rascunho) |
| C | `DialogoConfirmacao` (modal) + toasts de sucesso (hoje: `confirm()` nativo, sem toast) | telas 2.4/2.5/3 · RF02.4 | 🟡 |
| D | `MenuAcoes` ("...") nos itens da lista (excluir direto da lista) | telas 2.4 | ⬜ |
| E | Cor por categoria (`DotCategoria`) — exige coluna `cor` em `categorias` (migration) | telas 1/2.4 | ⬜ |
| F | Extrair componentes reutilizáveis para `src/nucleo/componentes/` | telas 1 | 🟡 (começou no AppShell) |
| G | Busca por conteúdo e por etiqueta (hoje só por título) | telas 3 · RF03.2 | 🟡 (conteúdo adiado de propósito) |
| H | Transição de entrada (fade) ao trocar de tela | telas 3 | ⬜ (cosmético) |

## Reconciliações de documentação (não é código)

- **RNF03.2** ainda cita Zustand + TanStack Query — superado pelo ADR 08 (seguimos RSC). Marcar como Superseded.
- **`docs/03-frontend/01-estrutura-de-pastas.md`** só lista 3 pastas — oficializar `categorias/`, `etiquetas/`, `perfil/`, `painel-inicial/`.
- Grafia `painel_inicial` (docs) vs `painel-inicial` (código).

## V2 — Compartilhamento, Produtividade e IA

- Tornar Público (link read-only) — pré-requisito: revisar o modelo de RLS (hoje 100% privado).
- Modo Portfólio (página pública curada).
- Assistente de IA embutido (via API) e auto-classificação de categoria.
- Integrações de produtividade: exportar (MD/PDF), atalhos de teclado.

## V3 — Multiusuário e Colaboração

- Multiusuário · RBAC (permissões) · Versionamento de documentos · Colaboração em tempo real. Pré-requisito: revisar a modelagem (hoje um `usuario_id` fixo por linha).

## Oportunidades ainda não mapeadas

- **Supabase Storage** está na stack, sem uso — habilitaria anexos/imagens em documentos.
- Gestão de categorias/etiquetas (renomear/excluir) — hoje só "find-or-create".
- Busca full-text real (`tsvector`) e paginação/ordenação da lista quando crescer.

## Pendências operacionais (não são código)

- 🔴 `supabase db push` da migration de etiquetas — trava o runtime até rodar.
- 🟡 Templates de e-mail no Supabase (Confirm signup, Reset password).
