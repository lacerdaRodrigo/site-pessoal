# Deploy — Ambientes e Pipeline (CI/CD)

## 1. Hospedagem Gratuita e Infraestrutura
O projeto foi projetado para utilizar serviços consolidados de mercado com camadas gratuitas (Free Tier) altamente generosas, ideais para o Mínimo Produto Viável (MVP):

* **A Hospedagem da Tela (Frontend):** O código do Next.js será hospedado na **Vercel** — que, além do free tier generoso, é a própria criadora do Next.js, então o deploy é nativo/zero-config (ver ADR 06 e ADR 07 em `docs/01-arquitetura/06-decisoes-tecnicas.md`). A Vercel oferece até 100 GB de tráfego/mês grátis para sites rápidos, batendo com folga concorrentes como o Firebase Hosting no quesito "limite gratuito de banda" para sites web.
* **A Hospedagem dos Dados (Backend):** O banco de dados PostgreSQL ficará no **Supabase**. O plano gratuito oferece incríveis 500 MB só para textos (Isso dá para salvar literalmente centenas de milhares de prompts sem gastar 1 centavo).

## 2. Ferramentas de Análise Estática e Segurança
Para garantir que o seu projeto saia da sua máquina direto para o ar com "Nível Senior" de inspeção e segurança (sem gastar nada), adotaremos as seguintes ferramentas:

* **Para Qualidade do Código (Linting rigoroso):** Usaremos `ESLint` (com a configuração oficial do Next.js) combinado com `Prettier` para formatação. Ele aplica regras restritas ao seu código (ex: te avisa sobre tipagem incorreta em TypeScript, imports não usados, etc). Ele analisa o seu código e avisa falhas antes de você testar.
* **Para Segurança Contra Invasões:** Ativaremos o **Dependabot** (uma ferramenta de segurança gratuita do próprio GitHub). Ele varre o nosso projeto toda semana procurando se estamos usando algum pacote com falha de segurança conhecida pelos hackers, e nos avisa. Também ativaremos o **CodeQL** (robô de segurança do GitHub) que analisa nosso código procurando portas abertas e brechas.

## 3. A Esteira de Automação (A Pipeline CI/CD)
O processo para colocar uma atualização no ar será totalmente automatizado usando o **GitHub Actions**. O ciclo de vida de uma atualização será:

1. **Gatilho (Trigger):** Você envia as mudanças (Push) para a branch principal (`main`) no GitHub.
2. **Análise de Qualidade:** O robô do GitHub instala as dependências (`npm install`) e roda `eslint`. Se o código estiver "feio" ou fugindo das regras configuradas, o robô bloqueia a entrega.
3. **Validação de Testes (O seu papel de QA em ação):** O robô roda os testes unitários/de componente (`Vitest`) e, se configurado nessa etapa, os testes E2E (`Playwright`). Se apenas 1 teste falhar, o robô bloqueia a entrega e ninguém vê o bug.
4. **Migrations:** Passando nos testes, o robô aplica as migrations pendentes no banco de produção (`supabase db push` — ver `docs/04-backend/02-migrations-e-versionamento.md`).
5. **Geração (Build):** O robô compila o site (`next build`), usando as variáveis de ambiente públicas do Supabase (URL e `anon key`).
6. **Lançamento (Deploy Automático):** O robô publica a versão final na Vercel via CLI (`vercel deploy --prod`).
7. **Resultado:** O site no ar está atualizado em menos de 2 minutos.

## 4. Onde Ficam os Segredos do CI/CD

Nenhum desses valores fica escrito no código ou no repositório — todos vivem em **GitHub Secrets** (`Settings → Secrets and variables → Actions` do repositório), injetados na pipeline via `${{ secrets.NOME_DO_SEGREDO }}` e nunca aparecem em texto puro nos logs do Actions.

| Segredo | Usado em | Para quê |
|---|---|---|
| `SUPABASE_ACCESS_TOKEN` | Etapa 4 (Migrations) | Autentica o Supabase CLI para rodar `supabase db push` contra o projeto de produção. Gerado em supabase.com → Account → Access Tokens. |
| `SUPABASE_DB_PASSWORD` | Etapa 4 (Migrations) | Senha do Postgres do projeto de produção, exigida pelo `supabase link`/`db push`. |
| `NEXT_PUBLIC_SUPABASE_URL` | Etapa 5 (Build) | URL do projeto Supabase. É uma variável **pública** (vai para o navegador), mas ainda assim precisa ser fornecida à pipeline — o `.env` local não existe no runner do GitHub Actions. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Etapa 5 (Build) | Chave anônima do Supabase (ver `docs/04-backend/01-supabase-e-seguranca.md` para o porquê de ser segura mesmo sendo pública). |
| `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` | Etapa 6 (Deploy) | Autenticam o CLI da Vercel para publicar a partir do Actions (em vez de depender só da integração automática da Vercel com o GitHub). |

> 💡 **Nota de Aprendizado (Mentoria):** por que gatilhar o deploy pelo GitHub Actions (etapa 6) em vez de deixar a integração nativa da Vercel com o GitHub fazer isso sozinha? Porque a integração nativa da Vercel dispara o deploy **independente** do resultado do lint/testes — ela não sabe que a etapa 2/3 falhou. Fazendo o Actions chamar o `vercel deploy` explicitamente, a etapa 6 só roda se as anteriores passarem, e "o robô bloqueia a entrega" (como descrito acima) vira verdade de fato, não só uma intenção.

## 5. Deploy de Preview via Integração Nativa (decidido em 2026-07-05)

A pipeline completa descrita nas seções 2-4 (gates de lint/teste/migrations antes do deploy) **ainda não existe** — é o alvo, alinhado ao "Critério de saída da V1" do roadmap (`docs/08-roadmap/01-roadmap-detalhado.md`). Antes de montá-la, decidiu-se ativar um passo intermediário para resolver uma necessidade imediata: testar o app fora do `localhost`.

**Decisão:** conectar o repositório `lacerdaRodrigo/site-pessoal` diretamente à Vercel (import do projeto no painel, sem passar pelo GitHub Actions ainda). Isso ativa o comportamento **padrão** da integração Vercel↔GitHub:
- Todo `push` na branch `main` gera um deploy de produção automático.
- Toda outra branch/PR gera uma **URL de preview** própria, isolada, sem afetar produção.

**O que isso NÃO tem (ainda):** nenhum gate de qualidade. Um `push` com lint quebrado ou teste falhando **sobe para produção do mesmo jeito** — diferente do fluxo final descrito nas seções 2-4, que só existirá quando o GitHub Actions assumir o disparo do deploy (ver a nota de aprendizado acima, que explica exatamente por que isso importa).

**Variáveis de ambiente na Vercel** (Project Settings → Environment Variables), usando o **mesmo projeto Supabase** de hoje (decisão: não criar um projeto Supabase separado só para teste, adequado ao estágio atual — single user, sem dado sensível de terceiros):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` não é definida na Vercel — o código (`src/funcionalidades/autenticacao/dados/acoes.ts`) já tem fallback automático para a variável `VERCEL_URL` (injetada pela própria Vercel em todo deploy, com valor diferente por preview), usada para montar o link de confirmação de e-mail (ver `docs/04-backend/01-supabase-e-seguranca.md`, seção 5).

**Ajuste necessário no painel do Supabase:** a cada novo domínio de preview, a URL precisa estar na allow-list de **Authentication → URL Configuration → Redirect URLs**. Como as URLs de preview da Vercel mudam a cada deploy, usa-se um padrão com wildcard (ex: `https://site-pessoal-*.vercel.app/**`) em vez de cadastrar uma URL fixa por deploy.

## 6. CI de Qualidade no GitHub Actions (implementado em 2026-07-05)

Primeira etapa concreta da pipeline da seção 3: o workflow `.github/workflows/ci.yml` roda **lint (ESLint) → testes (Vitest) → build (`next build`, que inclui a checagem de tipos do TypeScript)** a cada `push` na `main` e a cada Pull Request. Isso cobre as etapas 2, 3 (parcialmente) e 5 do ciclo descrito na seção 3.

**Por que agora:** o deploy automático da Vercel (seção 5) já estava ativo **sem nenhum gate de qualidade** — era possível subir código com teste quebrado para produção sem nenhum aviso. Com o CI, todo push passa a ter um veredito visível (✅/❌) no GitHub.

**Limitação honesta (ainda vale a seção 5):** o CI **avisa, mas ainda não bloqueia** — a integração nativa Vercel↔GitHub dispara o deploy em paralelo, sem esperar o resultado do Actions. O bloqueio de verdade virá quando o deploy for movido para dentro do Actions (etapa 6 da seção 3, via `vercel deploy`), ou, como meio-termo, ativando "branch protection" + a opção *Require status checks* no GitHub. Registrado como evolução futura.

**O que ficou de fora por enquanto (e o porquê):**
- **Testes E2E (Playwright):** rodam contra o deploy real na Vercel e dependem de credenciais de conta de teste (`E2E_EMAIL`/`E2E_SENHA`) que ainda não existem como secret — além de o deploy de preview não estar pronto no instante em que o CI roda (corrida entre Actions e Vercel).
- **Migrations (`supabase db push`):** ainda não existe nenhuma migration no projeto.

**Segredos exigidos pelo workflow** (adicionar em Settings → Secrets and variables → Actions do repositório — mesmos valores do `.env.local`): `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` (já previstos na tabela da seção 4). Sem eles, o passo de testes falha no CT-06 (teste de conexão real com o Supabase) — a mensagem de erro do próprio teste aponta a variável faltante.
