# 📚 Planejamento do Projeto

> **Projeto:** Knowledge Hub (nome provisório)  
> **Versão:** 0.1.0  
> **Status:** Planejamento  
> **Responsável:** Rodrigo Lacerda

---

## 🎯 Módulo 00 — Visão do Produto

Este módulo concentra as informações estratégicas do projeto, definindo o propósito, escopo, público e roadmap.

### 📖 Sobre o Projeto
O objetivo deste projeto é desenvolver uma **Base de Conhecimento Pessoal (Personal Knowledge Base)** para centralizar informações utilizadas no dia a dia, como:
- Documentações e Guias
- Prompts para IA
- Templates e Snippets de código
- Casos de Teste e Técnicas de QA
- Relatórios de Bugs
- Estudos e Anotações Gerais (Flutter, Arquitetura, Git, etc.)
- Portfólio real de conhecimentos aplicados

O sistema será desenvolvido inicialmente para **uso pessoal**, servindo também como um laboratório de estudos contínuos, mas sua arquitetura será desenhada prevendo escalabilidade futura.

### 🤝 Dinâmica de Aprendizado e Mentoria
Este projeto está sendo construído com uma mentalidade de aprendizado e evolução constante. Através de uma dinâmica de **Pair Programming** entre um Desenvolvedor Júnior (Rodrigo) e uma IA Mentora (eu), o objetivo é ir além do código que simplesmente funciona: **queremos aprender e aplicar as melhores práticas da engenharia de software**.

Isso significa que, em cada etapa, vamos discutir e definir juntos:
- **Arquitetura de Software** que seja escalável e de fácil manutenção.
- **Clean Code e SOLID**, visando um código que times profissionais adorariam ler.
- **Segurança**, garantindo a proteção dos dados desde o primeiro dia.
- **Técnicas de Qualidade**, como TDD, testes e boas práticas.

### 🎯 Objetivos Principais
- **Centralização:** Ter todo o conhecimento em um único lugar.
- **Eficiência:** Reduzir o tempo procurando informações.
- **Padronização:** Uniformizar documentos, templates e estudos.
- **Praticidade:** Possibilitar a cópia rápida de conteúdos.
- **Laboratório Técnico:** Servir como ambiente prático para aplicar e aprender conceitos avançados (ex: Next.js, Supabase, Arquitetura de Software).

### 🚀 Escopo da Versão 1 (MVP)
A primeira versão será focada em entregar o núcleo de valor por meio de uma **Aplicação Web**.
- O sistema deverá ser totalmente responsivo (Mobile First / Adaptativo) para uso via navegador em celulares e desktop.
- Foco em Single User (Uso pessoal).

### 📦 Funcionalidades Planejadas (MVP)
- **Login / Autenticação:** Acesso seguro aos dados via Supabase Auth.
- **Dashboard:** Visão geral rápida dos últimos documentos e estatísticas.
- **Gerenciamento de Categorias e Tags:** Organização estruturada da informação.
- **Gestão de Documentos:** Criar, editar, visualizar e excluir anotações.
- **Editor Markdown:** Experiência rica para escrita com suporte a formatação, tabelas e código.
- **Busca:** Pesquisa eficiente de conteúdos e títulos.
- **Favoritos e Ações Rápidas:** Marcar documentos importantes e botão de "Copiar conteúdo".
- **Perfil e Configurações Básicas.**

### 🚫 Fora do Escopo da V1
- Aplicativo Nativo (Android/iOS).
- Múltiplos usuários ou Controle avançado de permissões (RBAC).
- Compartilhamento público de links.
- Colaboração em tempo real.
- Integração nativa com IA (Geração de resumos, chat).
- Notificações ou Exportação avançada (PDF).

### 📈 Evolução do Projeto (Roadmap Macro)
- **V1 (MVP):** Aplicação Web focada em uso pessoal e gestão básica de documentos.
- **V2:** Funcionalidades de compartilhamento (ex: portfólio público de anotações específicas), integrações de produtividade e IA.
- **V3:** Sistema multiusuário, controle de permissões (RBAC), versionamento de documentos e colaboração.

---

## 🏗️ Módulo 01 — Arquitetura Geral e Tecnologia

### ⚙️ Stack Tecnológica (Definida)
| Camada | Tecnologia |
|---------|------------|
| Frontend | Next.js (App Router) |
| Linguagem | TypeScript |
| Backend | Supabase |
| Banco de Dados | PostgreSQL |
| Storage | Supabase Storage |
| Autenticação | Supabase Auth |
| Editor | Markdown |

### 🏛 Arquitetura Inicial de Sistemas
```text
Navegador (Cliente) / Servidor Vercel
       ↓
 Next.js (Frontend - UI, Estado, Lógica de Apresentação)
       ↓ (REST/SDK)
  Supabase (Backend as a Service)
       ↓
 PostgreSQL (Banco de Dados) & Supabase Storage (Arquivos/Imagens)
```

### 🎯 Objetivos Técnicos e de Aprendizado
O projeto adota uma abordagem profissional e servirá para aplicar:
- Next.js & TypeScript
- Clean Code e Princípios SOLID
- Arquitetura em Camadas (Feature-First com influência de Clean Architecture)
- Componentização e Design System
- Responsividade e UI/UX
- Modelagem de dados relacional (PostgreSQL) e Supabase
- Boas práticas de Git e Git Flow

---

## 📂 Estrutura da Documentação do Projeto

A documentação será modularizada. Cada documento deverá ter responsabilidade única e responder a uma pergunta clara.

```text
docs/
├── README.md (Este documento)
├── 00-visao-do-produto/
│   ├── 01-proposito.md
│   ├── 02-escopo-e-roadmap.md
│   └── 03-publico-alvo.md
├── 01-arquitetura/
│   ├── 01-visao-geral.md
│   ├── 02-funcionalidades.md
│   ├── 03-requisitos-funcionais.md
│   ├── 04-requisitos-nao-funcionais.md
│   ├── 05-stack-tecnologica.md
│   ├── 06-decisoes-tecnicas.md
│   ├── 07-arquitetura-geral.md
│   └── 08-estrutura-do-projeto.md
├── 02-banco-de-dados/
│   └── 01-entidades.md
├── 03-frontend/
│   └── 01-estrutura-de-pastas.md
├── 04-backend/
│   ├── 01-supabase-e-seguranca.md
│   └── 02-migrations-e-versionamento.md
├── 05-ui-ux/
│   ├── 01-design-system.md
│   ├── 02-tokens-visuais.md
│   └── 03-telas-e-componentes.md
├── 06-testes/
│   └── 01-estrategia-de-testes.md
├── 07-deploy/
│   └── 01-ambientes-e-pipeline.md
├── 08-roadmap/
│   └── 01-roadmap-detalhado.md
└── 09-documentacao/
    └── 01-padrao-sdd.md
```

---

## 🗂️ Planejamento e Status dos Módulos

- ✅ **Módulo 00 — Visão do Produto:** Definido (Propósito, Escopo e Público-Alvo).
- ✅ **Módulo 01 — Arquitetura:** Definido (Visão Geral, Requisitos Funcionais e Não-Funcionais).
- ✅ **Módulo 02 — Banco de Dados:** Definido (Modelo Conceitual e Entidades).
- ✅ **Módulo 03 — Frontend:** Definido (Estrutura de Pastas Feature-First em português).
- ✅ **Módulo 04 — Backend:** Definido (RLS no Supabase e uso do Supabase CLI para migrations).
- ✅ **Módulo 05 — UI/UX:** Definido (Design System, Dark/Light Mode com Roxo Neon, protótipo navegável em HTML com tokens visuais e mapa de telas extraídos).
- ✅ **Módulo 06 — Testes:** Definido (Estratégia de QA com testes unitários, de componente e E2E).
- ✅ **Módulo 07 — Deploy:** Definido (Hospedagem na Vercel e Pipeline no GitHub Actions).
- ✅ **Módulo 08 — Roadmap:** Definido (Detalhamento de V1, V2 e V3).
- ✅ **Módulo 09 — Documentação Técnica:** Definido (Padrão SDD e regras de escrita).

---

## 📌 Decisões Tomadas
- O projeto será desenvolvido inicialmente apenas para Web utilizando Next.js.
- Backend baseado em Supabase (PostgreSQL, Auth e Storage).
- A documentação será modularizada em arquivos `.md` focados.
- Tratar o desenvolvimento como um projeto profissional real.
- Inclusão do **Módulo 00 - Visão do Produto** para alinhar estratégia antes do desenvolvimento técnico.
- **Arquitetura Frontend:** Padrão Feature-First (organização guiada pelas funcionalidades).
- **Gerenciamento de Estado:** Zustand (estado de UI/local) + TanStack Query (estado de servidor/dados do Supabase).
- **Roteamento Web:** App Router, nativo do Next.js.
- **Design System:** Construção de componentes do zero, buscando um visual "SaaS Premium" exclusivo (Dark Mode, responsividade fluida).
- **Estilização (2026-07-02):** CSS Modules / CSS puro, **sem Tailwind CSS** — o projeto já tem tokens visuais próprios (`docs/05-ui-ux/02-tokens-visuais.md`) e a estilização os consome diretamente, sem a camada de classes utilitárias do Tailwind. Ver `docs/01-arquitetura/05-stack-tecnologica.md`.
- **Servidor de Desenvolvimento (2026-07-02):** uso do **Turbopack** no `next dev` (opção escolhida no `create-next-app`) — apenas acelera o recarregamento em desenvolvimento, sem impacto em produção. Ver `docs/01-arquitetura/05-stack-tecnologica.md`.
- **Banco de Dados:** Tabelas core definidas em português (`perfis`, `categorias`, `documentos`, `etiquetas`, `documento_etiquetas`).
- **Segurança de Dados:** Uso de RLS (Row Level Security) no Supabase, garantindo que usuários acessem apenas os dados do próprio `auth.uid()`. A `anon key` pode ficar pública (protegida pelo RLS); a `service_role key` (que ignora RLS) não será provisionada até haver necessidade real, e nunca leva o prefixo `NEXT_PUBLIC_` — ver `docs/04-backend/01-supabase-e-seguranca.md`.
- **Política de Conta:** senha com mínimo de 8 caracteres (sem exigência de complexidade arbitrária) e confirmação de e-mail obrigatória antes do primeiro login (padrão do Supabase Auth, mantido intencionalmente).
- **Padrão de Documentação:** Adoção do modelo **SDD (Software Design Document)** para as anotações e pastas do projeto, focando em nível profissional.
- **Sincronia de Documentação (Regra de Ouro):** A documentação é "viva". **É estritamente obrigatório** que qualquer nova decisão técnica, alteração estrutural ou mudança de plano seja imediatamente refletida no documento correspondente **E** no `README.md`. O repositório deve estar sempre 100% atualizado para garantir continuidade perfeita (Single Source of Truth), independentemente do computador em que o projeto for aberto.
- **Idioma Padrão (Regra de Ouro):** Priorizar e utilizar a língua **Português (PT-BR)** em **tudo** que for possível — documentação, pastas, estruturas, e também **dentro do próprio código**: nomes de variáveis, funções, componentes, tipos/interfaces e tabelas do banco. A única exceção são nomes literalmente exigidos por convenção de framework/ferramenta (ex: `app/`, `public/`, `page.tsx`, `layout.tsx`, palavras reservadas da linguagem) — nesses casos, o inglês é obrigatório e não uma escolha. Fora dessa exceção, PT-BR sempre, para facilitar o aprendizado e domínio dos conceitos.
- **Decisões Não São Definitivas (Regra de Ouro, reforçada em 2026-07-05):** nenhuma decisão registrada neste projeto é "pedra fundamental" — o projeto é um ambiente de aprendizado (ver [[user-profile]]/`docs/00-visao-do-produto`), e faz parte do processo revisitar uma decisão anterior sempre que a conversa revelar uma abordagem melhor. Quando isso acontecer: (1) a mudança é discutida abertamente, (2) a decisão antiga não é apagada — é marcada como superada, seguindo o mesmo mecanismo de ADR "Superseded" já usado em `docs/01-arquitetura/06-decisoes-tecnicas.md`, e (3) o motivo da mudança fica registrado, não só o resultado. Esta regra nasceu de um caso real: a estratégia de testes (linha abaixo) tinha sido fechada de um jeito e foi revisada nesta mesma conversa para um formato melhor, depois que o ambiente de deploy ficou pronto.
- **Testes e QA:** Foco extremo em qualidade (TDD, Testes de Unidade, Componente e E2E). **Atualizado em 2026-07-05:** os testes E2E (Playwright) vão rodar contra o ambiente de deploy real (Vercel), não só `localhost` — decisão tomada assim que o ambiente de teste ficou disponível, em vez de esperar a V1 inteira ficar pronta. Ver ADR 10 em `docs/01-arquitetura/06-decisoes-tecnicas.md`.
- **Hospedagem e Pipeline:** Frontend na Vercel, banco no Supabase. CI/CD automatizado via GitHub Actions executando linter (`ESLint` + `Prettier`) e análise de vulnerabilidades (`Dependabot`).
- **Versionamento de Banco de Dados:** Uso do **Supabase CLI** para escrever e versionar migrations em `supabase/migrations/`, aplicadas via pipeline de CI/CD (ver `docs/04-backend/02-migrations-e-versionamento.md`).
- **Migração de Stack Frontend (2026-07-02):** o projeto trocou de Flutter Web + Dart para **Next.js + TypeScript**, antes de qualquer código de frontend ter sido escrito. Motivo: o objetivo de aprender Flutter já é coberto por outro projeto pessoal do Rodrigo; Next.js encaixa melhor com a hospedagem já decidida (Vercel), com o núcleo do produto (conteúdo em Markdown) e com o roadmap V2 (portfólio público, que exige SEO). Histórico completo da decisão, incluindo o que foi descartado e por quê, em `docs/01-arquitetura/06-decisoes-tecnicas.md` (ADR 07, ADR 08, ADR 09).
- **Repositório Git (2026-07-02):** inicializado (branch `main`) e conectado ao repositório remoto [`lacerdaRodrigo/site-pessoal`](https://github.com/lacerdaRodrigo/site-pessoal) no GitHub, via SSH. Primeiro commit (`chore: scaffold inicial do projeto`) enviado com o scaffold do Next.js e toda a documentação SDD.
- **Revisão de Pendências (2026-07-02):** revisão completa da documentação antes do `create-next-app` fechou 8 pontos em aberto (botão de excluir documento, editor Markdown mobile, regras de `ON DELETE`, unicidade de categoria/etiqueta, política de senha, segredos de CI/CD, nitpick do RNF03, e o porquê de a `anon key` ser segura) — todos decididos e incorporados aos documentos oficiais dos respectivos módulos. O `PENDENCIAS.md` temporário que reunia esses itens foi removido.
- **Sessão de Autenticação (2026-07-02):** confirmado o uso do comportamento **padrão** do pacote `@supabase/ssr` (sessão via cookies, sincronizada entre cliente e servidor via `proxy.ts`), sem customização — ver `docs/04-backend/01-supabase-e-seguranca.md`, seção 6.
- **Personalização do E-mail de Confirmação (2026-07-05):** o redirecionamento do link de confirmação (`emailRedirectTo`) e o template do e-mail (Authentication → Email Templates no painel do Supabase) foram customizados para não ficar com a aparência genérica padrão do Supabase — ver `docs/04-backend/01-supabase-e-seguranca.md`, seção 5.
- **Ambiente de Teste/Preview (2026-07-05):** deploy de teste no **Vercel**, usando o mesmo projeto Supabase de produção por enquanto (adequado ao estágio atual, single user) — ver `docs/07-deploy/01-ambientes-e-pipeline.md`, seção 5.
- **Casos de Teste Documentados (2026-07-05):** todo teste automatizado (unitário, componente ou E2E) passa a ter um caso de teste correspondente em `docs/06-testes/casos-testes/` — separado em três subpastas por tipo (`unitarios/`, `componentes/`, `e2e/`, sem misturar a escrita de níveis diferentes da pirâmide), escrito para qualquer QA ou pessoa não-técnica entender sem ler código. Ver `docs/06-testes/01-estrategia-de-testes.md`, seção 3.
- **Mocks: `vi.mock()` para Server Actions, `MSW` para chamadas HTTP do navegador (esclarecido em 2026-07-05):** os testes de componente dos formulários de login/cadastro mockam a Server Action inteira com `vi.mock()` do Vitest, não com `MSW` — uma Server Action não é uma chamada de rede do ponto de vista do teste, então não há o que o `MSW` interceptar. O `MSW` continua reservado para quando o app fizer chamadas HTTP diretas do navegador ao Supabase (ex: CRUD de Documentos) — ver `docs/06-testes/01-estrategia-de-testes.md`, seção 2.
- **Design System Aplicado nas Telas de Autenticação (2026-07-05):** tokens de cor/tipografia/raio de `docs/05-ui-ux/02-tokens-visuais.md` implementados via CSS custom properties em `globals.css` (CSS puro, sem Tailwind — mantém a decisão já registrada acima), fontes trocadas para Inter + JetBrains Mono, e o layout da tela de Login seguindo `docs/05-ui-ux/03-telas-e-componentes.md`, seção 2.1.
- **Recuperação de Senha via Rota de Callback Própria (2026-07-05):** diferente da confirmação de cadastro (que não precisa de sessão), a recuperação de senha exige uma sessão de recovery — por isso o link do e-mail passa por `src/app/auth/confirm/route.ts` (chama `supabase.auth.verifyOtp()`) antes de chegar em `/redefinir-senha`, em vez de cair direto numa página como no cadastro. Ver `docs/04-backend/01-supabase-e-seguranca.md`, seção 5.

---

## ❓ Pontos que Ainda Precisam Ser Definidos

- **Biblioteca de Editor Markdown:** Ainda não escolhida qual biblioteca/abordagem usar para escrita e renderização de Markdown (ver `docs/01-arquitetura/05-stack-tecnologica.md`).
- **🐛 Pendente (2026-07-05):** o template de e-mail de confirmação (Authentication → Email Templates → Confirm signup, no painel do Supabase) ainda não está com o texto customizado — o e-mail recebido continua com a aparência/redação padrão do Supabase, mesmo após a tentativa de edição. Precisa ser revisitado: confirmar se o template foi de fato salvo no painel certo (o mesmo projeto Supabase do `.env.local`) e se não há cache de e-mail já enviado antes da edição.
- **🚧 Pendente (2026-07-05) — passo manual para a Recuperação de Senha funcionar:** Rodrigo pausou aqui de propósito para voltar depois. Faltam dois ajustes no painel do Supabase:
  1. **Authentication → URL Configuration → Redirect URLs** — adicionar `http://localhost:3000/auth/confirm` e `https://site-pessoal-wgis.vercel.app/auth/confirm`.
  2. **Authentication → Email Templates → Reset Password** — trocar o corpo do e-mail para usar `{{ .RedirectTo }}&token_hash={{ .TokenHash }}` em vez do `{{ .ConfirmationURL }}` padrão (ver `docs/04-backend/01-supabase-e-seguranca.md`, seção 5, para o porquê e o texto sugerido completo). **Atenção:** rolar até o fim e clicar em "Save" — suspeita-se que essa etapa não tenha sido concluída da vez passada no template "Confirm signup" (pendência acima), já que o texto não mudou.
  - Depois desses dois passos: testar o ciclo completo (CT-21, `docs/06-testes/casos-testes/e2e/recuperacao-senha.md`) — pedir o link em `/esqueci-senha`, abrir o e-mail, clicar, definir nova senha, logar com ela.

---

## 🚦 Fases de Desenvolvimento (V1)

Visão geral de todo o escopo da V1 (ver `docs/08-roadmap/01-roadmap-detalhado.md`), com status atualizado a cada avanço. Legenda: ✅ Feito · 🚧 Impedimento (tentado, travou em algo, ver "Pontos que Ainda Precisam Ser Definidos") · ⬜ Não feito.

| Fase | Status |
|---|---|
| Planejamento e Documentação (SDD) | ✅ |
| Scaffold do projeto (Next.js + TypeScript) | ✅ |
| Estrutura de pastas Feature-First (`nucleo/`, `funcionalidades/`) | ✅ |
| Conexão com Supabase + teste automatizado de conexão | ✅ |
| Autenticação — Cadastro e Login (telas + Server Actions) | ✅ |
| Autenticação — Personalização do e-mail de confirmação | 🚧 |
| Autenticação — Logout | ✅ |
| Autenticação — Recuperação de senha (RF01.4) | 🚧 |
| Design da tela de Login/Cadastro (design system aplicado) | ✅ |
| Ambiente de teste/preview (Vercel) | ✅ |
| Infraestrutura de testes de Componente (React Testing Library) e E2E (Playwright) | ✅ |
| Pipeline de CI/CD completa (GitHub Actions: lint + testes + migrations) | ⬜ |
| CRUD de Documentos (criar, ler, editar, excluir) | ⬜ |
| Editor Markdown | ⬜ |
| Categorias e Etiquetas | ⬜ |
| Busca Global | ⬜ |
| Favoritos | ⬜ |
| Dashboard / Painel Inicial | ⬜ |
| Perfil e Configurações (tema claro/escuro) | ⬜ |

---

## 📝 Próximos Passos
1. ✅ Criar os primeiros wireframes/protótipos de tela (Módulo 05) — protótipo navegável em `Knowledge Hub (standalone).html`, com telas e componentes documentados em `docs/05-ui-ux/03-telas-e-componentes.md`.
2. ✅ Rodar o comando `npx create-next-app` para inicializar o código do projeto — executado em 2026-07-02 com `--ts --app --src-dir --no-tailwind --eslint --use-npm --import-alias "@/*" --disable-git --no-agents-md`. `src/app/`, `public/`, `package.json`, `tsconfig.json` e `eslint.config.mjs` já existem e batem com o planejado em `docs/01-arquitetura/08-estrutura-do-projeto.md`. `npm run dev` testado e responde em `http://localhost:3000` com Turbopack (padrão do Next.js 16, sem flag extra necessária).
3. ✅ Montar a árvore de pastas em Português dentro de `src/` (`nucleo/` e `funcionalidades/`), seguindo `docs/03-frontend/01-estrutura-de-pastas.md` — pastas ainda vazias (com `.gitkeep`), reservando o lugar de cada camada até ganharem código de verdade. `npm run lint` e `npm run build` confirmados sem erros.
4. ✅ Conectar o projeto ao Supabase e rodar o primeiro teste automatizado (2026-07-05) — projeto Supabase criado, chaves em `.env.local` (fora do Git), SDK (`@supabase/ssr` + `@supabase/supabase-js`) instalado, `Vitest` configurado e primeiro teste de conexão real (`src/nucleo/supabase/conexao.test.ts`) passando. Wrappers de cliente criados em `src/nucleo/supabase/cliente.ts` (navegador) e `servidor.ts` (servidor), e `src/proxy.ts` implementado para renovar a sessão a cada requisição (nome `proxy.ts` por causa da renomeação do arquivo de convenção no Next.js 16 — ver `docs/04-backend/01-supabase-e-seguranca.md`, seção 6).
5. ✅ Telas de login e cadastro (2026-07-05) — `src/funcionalidades/autenticacao/{dominio,dados,apresentacao}` com validação de e-mail/senha (RF01.1.1, testada em `dominio/validacoes.test.ts`), Server Actions de `entrar`/`cadastrar` e páginas em `/login` e `/cadastro`. E-mail de confirmação personalizado e redirecionado para `/auth/confirmado` (ver seção 5 de `docs/04-backend/01-supabase-e-seguranca.md`).
6. ✅ Ambiente de teste/preview no Vercel (2026-07-05) — repositório conectado, deploy automático funcionando (`/login`, `/cadastro`, `/auth/confirmado` no ar), reaproveitando o mesmo projeto Supabase. Redirect URLs liberadas no painel do Supabase (domínio fixo + wildcard de preview) — ver `docs/07-deploy/01-ambientes-e-pipeline.md`, seção 5. No caminho, corrigido um bloqueio de deploy da Vercel causado por typo no e-mail configurado no Git (não relacionado ao plano gratuito).
7. 🚧 **Pendente:** personalização do template de e-mail de confirmação ainda não aplicada de fato — ver "Pontos que Ainda Precisam Ser Definidos".
8. ✅ Logout (2026-07-05) — Server Action `sair()` em `src/funcionalidades/autenticacao/dados/acoes.ts`, e a home (`src/app/page.tsx`) deixou de ser o placeholder do `create-next-app`: agora mostra "Logado como {e-mail}" + botão "Sair" quando há sessão, ou um link para `/login` quando não há.
9. ✅ Infraestrutura de testes de Componente e E2E (2026-07-05) — React Testing Library + `jest-dom` + `user-event` instalados, ambiente do Vitest trocado para `jsdom` (`vitest.config.ts`), testes de componente escritos para os formulários de login/cadastro (mockando as Server Actions com `vi.mock`). `MSW` instalado para uso futuro (mock de chamadas HTTP reais do navegador, ex: CRUD de Documentos). `Playwright` instalado e configurado (`playwright.config.ts`) rodando contra o deploy real na Vercel (ADR 10), com 4 casos E2E escritos em `testes-e2e/autenticacao.spec.ts` (login, logout, senha incorreta, cadastro com e-mail já confirmado) — pulados automaticamente até existir um `.env.test.local` com `E2E_EMAIL`/`E2E_SENHA` de uma conta de teste confirmada. Todos os 14 casos de teste (unitário + componente + E2E) documentados em `docs/06-testes/casos-testes/{unitarios,componentes,e2e}/autenticacao.md` (nova convenção — ver `docs/06-testes/01-estrategia-de-testes.md`, seção 3).
10. ✅ Design system aplicado às telas de autenticação (2026-07-05) — `globals.css` recebeu os tokens de cor de `docs/05-ui-ux/02-tokens-visuais.md` (dark/light via `prefers-color-scheme`), `layout.tsx` trocou as fontes do `create-next-app` (Geist) pelas decididas no design system (Inter + JetBrains Mono), e `formulario.module.css` foi reescrito seguindo a spec da tela de Login (`docs/05-ui-ux/03-telas-e-componentes.md`, seção 2.1): halo roxo no topo, card centralizado com logo "K", raio 16px, anel de foco roxo nos inputs, brilho no hover do botão. Aplicado de forma consistente em login, cadastro, confirmação de e-mail e home.
11. 🚧 Recuperação de senha / RF01.4 (2026-07-05) — Server Actions `solicitarRedefinicaoSenha`/`redefinirSenha`, rota de callback `src/app/auth/confirm/route.ts` (chama `verifyOtp` para estabelecer a sessão de recovery via cookie) e páginas `/esqueci-senha`/`/redefinir-senha` implementadas e testadas (componente + E2E de navegação/token inválido — ver `docs/06-testes/casos-testes/{componentes,e2e}/recuperacao-senha.md`). Detalhes do fluxo em `docs/04-backend/01-supabase-e-seguranca.md`, seção 5. **Falta o passo manual no painel do Supabase** (customizar o template "Reset Password" para usar `{{ .TokenHash }}` — ver "Pontos que Ainda Precisam Ser Definidos") antes do ciclo completo funcionar de ponta a ponta.
