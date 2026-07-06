# Arquitetura — Decisões Técnicas (ADR)

Este documento registra as decisões técnicas mais importantes no formato **ADR (Architecture Decision Record)**: um padrão de mercado para deixar registrado não só *o que* foi decidido, mas *por que* — incluindo as alternativas que foram descartadas.

> 💡 **Nota de Aprendizado (Mentoria):** Em times profissionais, ADRs evitam a pergunta "por que fizeram assim?" seis meses depois, quando ninguém mais lembra o contexto da decisão. Cada ADR tem: Contexto, Decisão e Consequências.
>
> Regra importante de como usar ADRs (aplicada pela primeira vez neste documento em 2026-07-02): **quando uma decisão muda, o ADR antigo não é apagado nem reescrito** — ele é marcado como "Superseded" (superado) e um novo ADR é criado. Isso preserva o histórico: qualquer pessoa lendo o projeto no futuro entende não só a decisão atual, mas também o que foi tentado antes e por que mudou.

---

## ADR 01 — Arquitetura Feature-First (em vez de Layer-First)

**Status:** Ativo (decisão de arquitetura, independente da tecnologia de frontend escolhida).

**Contexto:** Definir como organizar as pastas do código-fonte: agrupando por camada técnica (`screens/`, `services/`, `models/`) ou por funcionalidade de negócio (`autenticacao/`, `documentos/`).

**Decisão:** Adotar **Feature-First**, com cada funcionalidade contendo suas próprias subcamadas `dados/`, `dominio/` e `apresentacao/` (ver `docs/03-frontend/01-estrutura-de-pastas.md`).

**Consequências:**
- ✅ Escalabilidade: novas features não "engordam" pastas genéricas compartilhadas.
- ✅ Facilidade de manutenção: um bug em "Login" tem todos os arquivos relevantes em um único lugar.
- ⚠️ Curva de aprendizado inicial maior que a estrutura Layer-First (mais simples de entender no primeiro contato, mas escala mal).

---

## ADR 02 — Riverpod como gerenciador de estado

**Status:** ⛔ Superseded por [ADR 08](#adr-08--zustand--tanstack-query-como-gerenciadores-de-estado-substitui-adr-02).

**Contexto:** Escolher entre `Provider`, `Riverpod` e `Bloc` para gerenciar estado global e local no Flutter Web.

**Decisão:** Usar **Riverpod**.

**Consequências:**
- ✅ Segurança em tempo de compilação (erros de `Provider` fora de contexto viram erro de build, não crash em produção).
- ✅ Testabilidade alta (providers podem ser sobrescritos em testes).
- ⚠️ Ainda exige disciplina para não crescer providers "genéricos demais" — deve seguir a divisão por feature do ADR 01.

---

## ADR 03 — GoRouter para roteamento Web

**Status:** ⛔ Superseded por [ADR 09](#adr-09--app-router-como-roteamento-substitui-adr-03).

**Contexto:** Flutter Web precisa de URLs reais (compartilháveis, com suporte a F5 e botão "voltar"), o que o `Navigator` clássico não resolve bem sozinho.

**Decisão:** Usar **GoRouter**, pacote oficial do time Flutter.

**Consequências:**
- ✅ Suporte nativo a deep linking e URLs amigáveis.
- ✅ Mantido oficialmente, reduz risco de abandono do pacote.

---

## ADR 04 — RLS (Row Level Security) no Supabase

**Status:** Ativo.

**Contexto:** Garantir que um usuário nunca acesse dados de outro, mesmo que a validação no frontend falhe ou seja manipulada (ex: alguém chamando a API do Supabase diretamente, sem passar pela tela).

**Decisão:** Toda tabela sensível (`documentos`, `categorias`, `etiquetas`) terá políticas de **RLS** no PostgreSQL, filtrando sempre por `auth.uid()`.

**Consequências:**
- ✅ Segurança "de graça" no nível do banco — não depende de o frontend estar correto.
- ✅ Alinhado com o objetivo de aprendizado de segurança desde o primeiro dia (ver RNF01 em `04-requisitos-nao-funcionais.md`).
- ⚠️ Exige atenção: toda nova tabela criada precisa lembrar de habilitar RLS explicitamente (o Supabase não liga por padrão).
- 🔎 Nota pós-migração (2026-07-02): esta decisão independe da tecnologia de frontend — vale tanto para Flutter Web quanto para Next.js, já que o RLS vive inteiramente no Supabase/PostgreSQL.

---

## ADR 05 — Documentação e código em Português (PT-BR)

**Status:** Ativo.

**Contexto:** O padrão de mercado internacional é nomear tabelas, pastas e variáveis em inglês.

**Decisão:** Priorizar **Português** em toda a documentação, pastas de features, tabelas do banco, e **também dentro do próprio código** — nomes de variáveis, funções, componentes, tipos/interfaces — por ser um projeto de aprendizado pessoal. Reforçado explicitamente por Rodrigo em 2026-07-02: "tudo que puder ser em PT-BR deve ser, até o código, nome de pasta, variáveis, etc."

**Consequências:**
- ✅ Reduz a barreira de entendimento conceitual enquanto o Rodrigo aprende os conceitos.
- ⚠️ Foge do padrão usado pela maioria das vagas/empresas — importante ter consciência de que, em um projeto de time real, o padrão seria inglês.
- ⚠️ Exige atenção redobrada em código: bibliotecas de terceiros (ex: Zustand, TanStack Query) usam APIs/termos em inglês por natureza — a regra vale para o código que **nós** escrevemos (nomes que escolhemos), não para renomear APIs de bibliotecas externas.
- 🔎 Nota pós-migração (2026-07-02): o Next.js exige alguns nomes literais em inglês por convenção do framework (`app/`, `public/`, `page.tsx`, `layout.tsx`, palavras reservadas da linguagem) — isso é uma exceção técnica obrigatória, não uma quebra da decisão. Pastas de features dentro de `src/funcionalidades/` e todo o código de domínio/negócio continuam em português.

---

## ADR 06 — Vercel como hospedagem do frontend

**Status:** Ativo (reforçado pela migração — ver nota abaixo).

**Contexto:** Escolher onde hospedar o build do frontend entre Vercel, Firebase Hosting e GitHub Pages.

**Decisão:** Usar **Vercel**.

**Consequências:**
- ✅ 100 GB/mês de tráfego grátis, superior ao free tier de concorrentes diretos para esse caso de uso.
- ✅ Integração simples com GitHub Actions para deploy automático.
- 🔎 Nota pós-migração (2026-07-02): com a troca para Next.js (ADR 07), essa decisão fica ainda mais forte — Vercel é a plataforma criadora do Next.js, então o deploy passa de "hospedagem genérica de estático" para "hospedagem nativa do framework", com otimizações automáticas.

---

## ADR 07 — Migração do Frontend: Flutter Web → Next.js (com TypeScript)

**Status:** Ativo. Decidido em 2026-07-02, em conjunto entre Rodrigo e a IA Mentora, antes do `flutter create` ter sido executado (nenhum código de frontend existia ainda).

**Contexto:** A escolha original por Flutter Web (ver stack tecnológica anterior) pesava dois fatores: (1) possibilidade de reaproveitar código para uma versão mobile no futuro, e (2) o objetivo explícito de aprender Flutter Web/Dart. Ao revisar a decisão, identificamos que:
- O objetivo de aprender Flutter já está sendo satisfeito por outro projeto pessoal do Rodrigo, feito especificamente em Flutter para evoluir habilidades de QA mobile — esse fator deixou de ser exclusivo deste projeto.
- A hospedagem já estava decidida como Vercel (ADR 06), que é a criadora do Next.js — sinergia técnica direta.
- O núcleo do produto é conteúdo em Markdown, um caso de uso muito bem servido pelo ecossistema React/Next.
- O roadmap V2 do README prevê um "portfólio público de anotações" — isso demanda SEO, ponto fraco histórico do Flutter Web (renderização client-side pesada) e ponto forte do Next.js (renderização no servidor).

**Decisão:** Adotar **Next.js (App Router)** com **TypeScript** no lugar de Flutter Web + Dart.

**Consequências:**
- ✅ Deploy nativo e otimizado na Vercel (ver ADR 06).
- ✅ Acesso a um ecossistema maduro de bibliotecas de Markdown, resolvendo a pendência que já existia em `05-stack-tecnologica.md`.
- ✅ Melhor SEO nativo, relevante para o roadmap V2 (compartilhamento público).
- ✅ TypeScript preserva a tipagem forte que o projeto já valorizava no Dart (null-safety), e reforça diretamente o ferramental de testes usado em QA (Playwright, Cypress).
- ⚠️ Perde-se o reaproveitamento "quase 1:1" de código para mobile nativo que o Flutter oferecia. Se uma versão mobile entrar no roadmap (V3), a opção mais próxima seria **React Native** — reaproveita conceitos e parte do raciocínio de React, mas não é o mesmo código, exigindo um projeto novo.
- ⚠️ Todo o Módulo 01 (arquitetura), Módulo 03 (frontend) e Módulo 06 (testes) precisaram ser revisados para refletir a nova stack — feito módulo a módulo, sem pular etapas. As pendências levantadas nessa revisão (que viviam num `PENDENCIAS.md` temporário, já removido) foram todas decididas e incorporadas aos documentos oficiais correspondentes.
- Este ADR **supera** o ADR 02 (Riverpod) e o ADR 03 (GoRouter) — ver ADR 08 e ADR 09. Não afeta o ADR 01 (Feature-First), ADR 04 (RLS) e ADR 05 (PT-BR), que continuam válidos independentemente da tecnologia de frontend. Reforça o ADR 06 (Vercel).

---

## ADR 08 — Zustand + TanStack Query como gerenciadores de estado (substitui ADR 02)

**Status:** Ativo. Decidido em 2026-07-02, em conjunto com Rodrigo (ver `docs/01-arquitetura/05-stack-tecnologica.md`, seção 2, para as alternativas descartadas: Redux Toolkit e Context API puro).

**Contexto:** O Riverpod, no Flutter, acumulava duas responsabilidades numa única ferramenta: estado de interface (o que a tela mostra agora) e sincronização com dados remotos do Supabase (cache, loading, erro). Era preciso decidir o equivalente para Next.js.

**Decisão:** Usar **Zustand** para estado de UI/local, e **TanStack Query** para estado de servidor (dados vindos do Supabase).

**Consequências:**
- ✅ Cada ferramenta resolve um problema bem definido, em vez de uma única lib genérica acumulando responsabilidades.
- ✅ TanStack Query dá cache, loading e refetch automático "de graça" — resolve na prática o mesmo problema que providers assíncronos resolviam no Riverpod.
- ✅ Zustand tem pouquíssimo boilerplate, mantendo a simplicidade que o projeto já buscava.
- ⚠️ Dois conceitos novos para aprender ao mesmo tempo (em vez de um só), mas cada um tem escopo pequeno e bem isolado.

---

## ADR 09 — App Router como roteamento (substitui ADR 03)

**Status:** Ativo. Decidido em 2026-07-02.

**Contexto:** Assim como no Flutter Web, o Next.js Web precisa de roteamento com URLs reais, deep linking e suporte a F5/botão voltar.

**Decisão:** Usar o **App Router**, nativo do Next.js.

**Consequências:**
- ✅ Ao contrário do GoRouter (que era uma dependência externa, ainda que oficial), o App Router já vem embutido no framework — nenhuma decisão de "qual pacote instalar" é necessária.
- ✅ Suporta Server Components e layouts aninhados nativamente.
- ⚠️ Introduz o paradigma de Server Components vs. Client Components, que será explorado com calma quando o código nascer (Módulo 03 e além) — é uma diferença conceitual real em relação ao modelo 100% client-side do Flutter Web.

---

## ADR 10 — Testes E2E (Playwright) rodam contra o ambiente de deploy real, não só `localhost`

**Status:** Ativo. Decidido em 2026-07-05.

**Contexto:** `docs/06-testes/01-estrategia-de-testes.md` já definia o Playwright como ferramenta de E2E, mas sem especificar contra qual ambiente os testes rodariam — a suposição implícita, por não existir deploy ainda, era `localhost`. Nesta mesma conversa em que o ambiente de teste/preview no Vercel foi ativado (ver seção 5 de `docs/07-deploy/01-ambientes-e-pipeline.md`), ficou claro que rodar o E2E contra o deploy real é estritamente melhor, e não custa mais caro.

**Decisão:** Os testes E2E do Playwright vão rodar contra a URL de deploy (preview da Vercel, e futuramente produção), em vez de depender de `next dev` local.

**Consequências:**
- ✅ O teste valida o software mais próximo do que o usuário real vai experimentar — inclui o comportamento de build de produção (`next build`), não o modo de desenvolvimento.
- ✅ Não depende do Rodrigo ter o `next dev` rodando localmente pra rodar a suíte de E2E — importante para rodar via GitHub Actions no futuro (a pipeline completa, ainda não implementada).
- ⚠️ Testes E2E que criam dados reais (ex: cadastro de usuário) passam a interagir com o Supabase de produção/único (mesma decisão de "Ambiente de Teste/Preview" — não há projeto Supabase de teste isolado ainda). Isso significa: dados de teste do E2E podem aparecer misturados com dados reais de uso pessoal, e o limite de e-mail do Supabase (2/hora, ver `docs/04-backend/01-supabase-e-seguranca.md`) pode ser atingido mais rápido se o E2E cadastrar contas repetidamente.

> 💡 **Nota de Aprendizado (Mentoria):** este ADR existe por causa da regra "Decisões Não São Definitivas" registrada no `README.md` — a estratégia de testes original não estava errada, só foi escrita antes de existir um ambiente de deploy pra testar contra. Um ADR novo (em vez de editar o antigo) preserva o raciocínio de por que a decisão evoluiu.

## ADR 11 — Fluxo de trabalho via branch + Pull Request, com `main` protegida

**Status:** Ativo. Decidido em 2026-07-05.

**Contexto:** até aqui, todos os commits foram feitos direto na `main` — hábito comum em projeto solo. Com o CI de qualidade e o E2E pós-deploy implementados (seções 6 e 7 de `docs/07-deploy/01-ambientes-e-pipeline.md`), o próprio Rodrigo enxergou a lacuna: no push direto na `main`, a Vercel deploya produção imediatamente e em paralelo aos testes — se um bug escapar, ele fica **em produção** até o E2E acusar. Os gates existem, mas chegam tarde demais para *prevenir*; eles só *detectam*.

**Decisão:** todo trabalho de código passa a ser feito em **branches curtas por assunto**, integradas à `main` via **Pull Request**. A `main` fica protegida no GitHub (*branch protection* exigindo os status checks do CI e do E2E) — o botão de merge só libera com tudo verde. O E2E roda contra o **deploy de preview do PR** (o workflow `e2e.yml` já cobre: o evento `deployment_status` dispara para previews também), então produção só recebe código que já passou por lint, testes, build **e** E2E num clone real da infraestrutura da Vercel.

**Nomenclatura de branches:** mesmo vocabulário dos commits (Conventional Commits já em uso) + descrição curta em PT-BR com hífens: `feat/crud-documentos`, `fix/redirect-login`, `docs/adr-fluxo-pr`, `ci/gate-de-deploy`.

**Consequências:**
- ✅ Produção nunca recebe código não testado — a frase "o robô bloqueia a entrega" (seção 3 da doc de deploy) vira realidade **sem** precisar mover o deploy para dentro do Actions ainda.
- ✅ Cada PR ganha uma URL de preview isolada + E2E automático contra ela — dá para *ver* a feature no ar antes de mergear.
- ✅ Hábito profissional idêntico ao de times reais (objetivo de aprendizado do projeto).
- ⚠️ Overhead pequeno por mudança: criar branch, abrir PR, aguardar os checks. Aceito de propósito — inclusive para mudanças só de documentação.
- ⚠️ Depende de um passo manual no painel do GitHub para a proteção valer de fato (ver seção 8 da doc de deploy); até lá, o fluxo é disciplina, não trava.

> 💡 **Nota de Aprendizado (Mentoria):** a alternativa considerada foi rodar o E2E contra um `localhost` dentro do próprio runner do CI (`next build && next start`), antes de qualquer deploy. Foi descartada porque testaria só o *código*, não o *sistema* (variáveis de ambiente do painel da Vercel, HTTPS real, Redirect URLs do Supabase — a classe de problema que já travou o primeiro deploy). O preview de PR dá o melhor dos dois mundos: é a infraestrutura real da Vercel, mas descartável e isolada de produção — mantendo o espírito do ADR 10.
