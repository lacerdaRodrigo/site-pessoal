# Arquitetura — Stack Tecnológica

Este documento detalha **o que** cada peça da stack faz e **por que** foi escolhida — o README (seção "Decisões Tomadas") registra a decisão em uma linha; aqui explicamos o raciocínio por trás dela.

> 💡 **Nota de Aprendizado (Mentoria):** este documento já reflete a migração de Flutter Web para Next.js, decidida em 2026-07-02. O histórico de *por que* a stack mudou — não só *para o quê* — fica registrado como ADR em `06-decisoes-tecnicas.md` (ADR 07), seguindo a mesma lógica de nunca apagar o "porquê" de uma decisão anterior.

## 1. Visão Geral

| Camada | Tecnologia | Papel |
|---|---|---|
| Frontend | Next.js (App Router) | Interface e lógica de apresentação, com renderização híbrida (servidor e navegador). |
| Servidor de Desenvolvimento | Turbopack | Empacotador usado pelo `next dev` — recarrega a página mais rápido a cada arquivo salvo. Não afeta o build de produção nem o código escrito. |
| Linguagem | TypeScript | Linguagem única para todo o frontend (tipagem forte, parecida com o null-safety do Dart). |
| Gerenciamento de Estado (UI) | Zustand | Controla o estado local/de interface (ex: modal aberto, tema, sidebar). |
| Gerenciamento de Estado (Servidor) | TanStack Query | Controla os dados vindos do Supabase: cache, loading, refetch automático. |
| Roteamento | App Router | Nativo do Next.js — controla as URLs do navegador e a navegação entre telas. |
| Estilização | CSS Modules / CSS puro (sem framework utilitário) | Aplica os tokens visuais próprios do projeto (`02-tokens-visuais.md`) sem depender de convenção de classes de terceiros. |
| Backend (BaaS) | Supabase | Autenticação, banco de dados e storage, sem precisar escrever um servidor próprio. |
| Banco de Dados | PostgreSQL (via Supabase) | Armazenamento relacional dos dados do usuário. |
| Storage | Supabase Storage | Guarda arquivos/imagens (uso futuro, ex: anexos em documentos). |
| Autenticação | Supabase Auth | Login, cadastro, sessão e hashing de senha gerenciados pelo provedor. |
| Editor | Markdown (biblioteca a definir) | Escrita e renderização de conteúdo formatado — ver "Pontos em Aberto". |
| Linting | ESLint + Prettier | Regras de qualidade e formatação de código para TypeScript/React. |
| CI/CD | GitHub Actions | Automação de lint, testes e deploy. |
| Hospedagem Frontend | Vercel | Plataforma criadora do Next.js — deploy nativo, zero-config. |
| Segurança de Dependências | Dependabot + CodeQL | Varredura automática de vulnerabilidades. |

## 2. Por que cada escolha?

### Next.js + TypeScript (em vez de Flutter Web + Dart)
- **Hospedagem já decidida é a Vercel** (ver ADR 06) — Next.js é o framework da própria Vercel, o que dá deploy zero-config e otimizações automáticas que o Flutter Web (servido como estático genérico) não aproveita.
- **Conteúdo é o núcleo do produto:** o Knowledge Hub é, essencialmente, uma aplicação de leitura/escrita de Markdown. O ecossistema React/Next tem bibliotecas maduras para isso, o que resolve diretamente o "Ponto em Aberto" da seção 3.
- **SEO nativo:** o roadmap V2 do README menciona "portfólio público de anotações" — conteúdo que precisa ser indexado por buscadores. Next.js renderiza no servidor por padrão, o que favorece isso; Flutter Web (client-side, renderizado em canvas/JS pesado) é historicamente fraco em SEO.
- **TypeScript como equivalente ao null-safety do Dart:** mantém a rede de segurança de tipagem forte que o projeto já valorizava, e é também o padrão do ferramental de teste (Playwright, Cypress) — reforça diretamente habilidades relevantes para a área de QA do Rodrigo.
- O objetivo de aprender Flutter (citado na versão anterior deste documento) deixou de ser um fator decisivo *para este projeto*: já existe um app separado em Flutter cobrindo esse objetivo de aprendizado. Ver ADR 07 em `06-decisoes-tecnicas.md` para o histórico completo dessa decisão.

### Zustand + TanStack Query (em vez de Riverpod)
- Riverpod, no Flutter, acumulava duas responsabilidades: estado de UI (o que a tela está mostrando agora) e sincronização com dados remotos (o que veio do Supabase). No mundo React, essas duas responsabilidades costumam ser resolvidas por ferramentas diferentes, cada uma especializada:
  - **Zustand** — store mínima, pouco boilerplate, para estado de interface (modais, sidebar, tema).
  - **TanStack Query** — cache, loading e refetch automático para dados vindos do Supabase, sem precisar escrever essa lógica manualmente.
- É a combinação mais usada hoje em apps Next.js reais que conversam com um backend. Ver ADR 08.

### App Router (em vez de GoRouter)
- É o roteamento **nativo** do Next.js — ao contrário do GoRouter (que era um pacote externo, ainda que oficial, no Flutter), aqui não existe dependência extra para instalar: escolher Next.js já inclui o roteamento.
- Suporta URLs reais, deep linking, e nested layouts nativamente — mesmos requisitos que o GoRouter resolvia no Flutter Web (F5, botão voltar, compartilhamento de link). Ver ADR 09.

### Turbopack no modo dev (em vez de Webpack)
- **Decisão confirmada com Rodrigo em 2026-07-02.** Escolhido no prompt do `create-next-app`.
- Só afeta o `next dev` (servidor local usado enquanto se escreve código) — o recarregamento da página fica mais rápido a cada arquivo salvo. Não muda o build de produção, o código escrito ou qualquer decisão de arquitetura.
- É a opção recomendada atualmente pelo próprio Next.js, sem contrapartida conhecida para um projeto deste porte.

### CSS Modules / CSS puro (em vez de Tailwind CSS)
- **Decisão confirmada com Rodrigo em 2026-07-02.** O projeto já tem um Design System próprio, com tokens visuais extraídos do protótipo aprovado (`docs/05-ui-ux/02-tokens-visuais.md`) e a decisão de "Construção de componentes do zero" registrada no README.
- Tailwind CSS é uma opção popular no ecossistema Next.js, mas estiliza via classes utilitárias (ex: `bg-black text-purple-500`), o que substituiria a convenção de tokens já definida por uma convenção de classes diferente — sem ganho real, já que o visual não parte de um design genérico a ser customizado, e sim de um sistema já desenhado.
- CSS Modules (nativo do Next.js, sem instalação extra) mantém o CSS escopado por componente e permite consumir os tokens diretamente (via variáveis CSS), preservando a mesma lógica do protótipo em `Knowledge Hub (standalone).html`.

### Supabase (em vez de Firebase)
- Banco relacional (PostgreSQL) em vez de NoSQL — mais adequado para dados estruturados como categorias/tags/documentos com relacionamentos.
- RLS (Row Level Security) nativa do Postgres, dando segurança "de graça" no nível do banco.
- Free tier generoso (500 MB de banco) e SQL puro, o que também é mais um objetivo de aprendizado (modelagem relacional).
- Essa decisão **não mudou** com a troca de frontend — o backend continua o mesmo independentemente da tecnologia do lado cliente.

### Vercel (em vez de Firebase Hosting/GitHub Pages)
Free tier com 100 GB/mês de tráfego, deploy automático por push e integração simples com GitHub Actions. Com a troca para Next.js, essa escolha fica ainda mais forte: agora não é só "uma hospedagem boa", é a hospedagem **nativa** do framework escolhido.

## 3. Pontos em Aberto

- **Biblioteca de edição/renderização Markdown:** ainda não escolhida. Candidatas a avaliar no ecossistema JS/React: `react-markdown` (renderização simples), `MDX` (Markdown + componentes React), ou um editor rico como `Tiptap`/`Lexical` (experiência tipo WYSIWYG). Decisão pendente para quando o Módulo 05 (UI/UX) entrar em construção prática.
