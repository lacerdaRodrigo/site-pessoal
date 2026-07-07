# Deploy — Ambientes e Pipeline (CI/CD)

## 1. Hospedagem Gratuita e Infraestrutura
O projeto foi projetado para utilizar serviços consolidados de mercado com camadas gratuitas (Free Tier) altamente generosas, ideais para o Mínimo Produto Viável (MVP):

* **A Hospedagem da Tela (Frontend):** O código do Next.js será hospedado na **Vercel** — que, além do free tier generoso, é a própria criadora do Next.js, então o deploy é nativo/zero-config (ver ADR 06 e ADR 07 em `docs/01-arquitetura/06-decisoes-tecnicas.md`). A Vercel oferece até 100 GB de tráfego/mês grátis para sites rápidos, batendo com folga concorrentes como o Firebase Hosting no quesito "limite gratuito de banda" para sites web.
* **A Hospedagem dos Dados (Backend):** O banco de dados PostgreSQL ficará no **Supabase**. O plano gratuito oferece incríveis 500 MB só para textos (Isso dá para salvar literalmente centenas de milhares de prompts sem gastar 1 centavo).

## 2. Ferramentas de Análise Estática e Segurança
Para garantir que o seu projeto saia da sua máquina direto para o ar com "Nível Senior" de inspeção e segurança (sem gastar nada), adotaremos as seguintes ferramentas:

* **Para Qualidade do Código (Linting rigoroso):** Usaremos `ESLint` (com a configuração oficial do Next.js) combinado com `Prettier` para formatação. Ele aplica regras restritas ao seu código (ex: te avisa sobre tipagem incorreta em TypeScript, imports não usados, etc). Ele analisa o seu código e avisa falhas antes de você testar.
* **Para Segurança Contra Invasões (ativado em 2026-07-06, tudo gratuito no repositório público, em Settings → Advanced Security):** três defesas que cobrem frentes distintas —
  * **Dependabot** varre as **dependências** (pacotes npm) semanalmente procurando falhas conhecidas e abre PR de correção automático. As atualizações de rotina são configuradas em `.github/dependabot.yml`.
  * **CodeQL** analisa o **nosso código** procurando brechas (injection, XSS, portas abertas), a cada push/PR.
  * **Secret Protection** (Secret Scanning + Push Protection) cuida de **segredos vazados**: varre o repositório atrás de chaves/tokens e **bloqueia o `git push`** se detectar um segredo, impedindo o vazamento antes de acontecer.

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
| `VERCEL_AUTOMATION_BYPASS_SECRET` | E2E (`e2e.yml`) | Secret do "Protection Bypass for Automation" da Vercel — deixa o Playwright acessar a URL protegida do deploy sem cair na tela de login da Vercel (ver seção 7). Gerado em Project Settings → Deployment Protection. |

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
- **Migrations (`supabase db push`):** ainda não existe nenhuma migration no projeto.

**Segredos exigidos pelo workflow** (adicionar em Settings → Secrets and variables → Actions do repositório — mesmos valores do `.env.local`): `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` (já previstos na tabela da seção 4). Sem eles, o passo de testes falha no CT-06 (teste de conexão real com o Supabase) — a mensagem de erro do próprio teste aponta a variável faltante. **Status:** adicionados em 2026-07-05, CI verde.

## 7. E2E no CI via `deployment_status` (implementado em 2026-07-05)

Os testes E2E (Playwright) ganharam workflow próprio, `.github/workflows/e2e.yml`, separado do CI de qualidade por causa de um problema de **timing**: no evento de `push`, o Actions e o deploy da Vercel largam juntos — se o Playwright rodasse ali, poderia testar o deploy **anterior**, que ainda estaria no ar enquanto o novo builda.

**A solução:** a integração Vercel↔GitHub registra cada deploy como um *Deployment* no GitHub e emite o evento **`deployment_status`** a cada mudança de estado. O workflow dispara apenas quando `state == success` — ou seja, **depois** que o deploy novo está servindo tráfego — e recebe no próprio evento a URL exata daquele deploy (`environment_url`), repassada ao Playwright via `PLAYWRIGHT_BASE_URL` (o `playwright.config.ts` já suportava essa variável). Dois bônus dessa abordagem:
- **Previews de PR também são testados:** cada preview da Vercel emite seu próprio `deployment_status` com sua própria URL — o E2E roda contra o preview isolado, antes do merge.
- **Código e site na mesma versão:** o checkout usa `github.event.deployment.sha`, garantindo que os specs testados são os do commit que gerou aquele deploy (e não o estado mais novo da branch).

**Detalhes de execução:** instala só o Chromium (`npx playwright install --with-deps chromium`, único navegador configurado); em CI cada teste que falha ganha 1 retry (`retries` no `playwright.config.ts`), o que também ativa a gravação do trace (`on-first-retry`); em caso de falha, os traces sobem como artefato do workflow (baixar e abrir com `npx playwright show-trace`).

**Segredos exigidos:** `E2E_EMAIL` e `E2E_SENHA` (mesmos valores do `.env.test.local` — conta de teste real, já confirmada, no Supabase). Sem eles o workflow ainda passa: os specs pulam (não falham) os casos que exigem login, e rodam apenas os que não dependem de conta (CT-19/CT-20).

> ⚠️ **Descoberta na primeira execução real (2026-07-06):** o `environment_url` que a Vercel envia no evento é a **URL interna e única daquele deploy** (ex: `site-pessoal-wgis-h4q2...vercel.app`), não o domínio público — e essas URLs ficam atrás da **Deployment Protection** da Vercel (ativa por padrão), que exige login na Vercel. Resultado: o Playwright do CI recebia um redirect para `vercel.com/sso-api` em vez do app, e a suíte inteira falhava — enquanto localmente passava, porque roda contra o domínio público (sem proteção). Ninguém percebe isso testando no navegador, porque o dono do projeto está logado na Vercel e passa pelo SSO transparentemente.
>
> **Correção adotada (2026-07-06): "Protection Bypass for Automation" da Vercel** — o fluxo oficial da Vercel para exatamente este caso (rodar E2E/CI contra deploys protegidos). Considerou-se antes simplesmente *desativar* a Vercel Authentication (Deployment Protection → Disabled), mas isso tornaria **todo preview público na internet**; o bypass foi preferido por **manter a proteção de pé** e liberar só quem tem o secret. Como funciona: gera-se um secret em **Project Settings → Deployment Protection → Protection Bypass for Automation**; o Playwright o envia no header `x-vercel-protection-bypass` (mais o `x-vercel-set-bypass-cookie: true`, para as navegações seguintes dentro do navegador), e a Vercel libera a requisição sem tocar na proteção real. O `playwright.config.ts` só monta esses headers quando a variável `VERCEL_AUTOMATION_BYPASS_SECRET` existe — assim o `npm run test:e2e` local (contra o domínio público, sem proteção) continua funcionando sem nenhum secret. No CI, o valor vem de um **GitHub Secret de mesmo nome** (adicionar em Settings → Secrets and variables → Actions, com o mesmo valor gerado no painel da Vercel), repassado pelo `e2e.yml`.
>
> **Efeito colateral descoberto na mesma investigação (2026-07-06): dois projetos Vercel no mesmo repositório.** O repositório estava conectado a **dois** projetos Vercel (`site-pessoal` e `site-pessoal-wgis`) — provável import duplicado; a Vercel acrescenta um sufixo aleatório (`-wgis`) quando o nome já existe. Cada projeto buildava o mesmo commit e emitia seu próprio `deployment_status`, disparando o E2E **duas vezes** por push, com dois checks de nome idêntico (`Playwright contra o deploy`). Pior: como o secret de bypass é **por projeto** e o GitHub Secret guarda um único valor, no máximo um dos dois E2E poderia passar — e a branch protection, que exige aquele check verde, nunca ficaria satisfeita. **Consolidou-se em `site-pessoal-wgis`** (o domínio já referenciado neste doc, no `README.md` e no `playwright.config.ts`); o projeto `site-pessoal` foi excluído e o secret de bypass foi regenerado no projeto que ficou. Lição: um repositório deve estar ligado a **um** projeto Vercel — dois deploys do mesmo commit é sinal de import duplicado.

## 8. Fluxo de Trabalho: branch + Pull Request, `main` protegida (decidido em 2026-07-05)

Decisão registrada como **ADR 11** (`docs/01-arquitetura/06-decisoes-tecnicas.md`) — contexto e consequências completos lá. Resumo operacional:

**O ciclo de toda mudança de código passa a ser:**
1. Criar branch a partir da `main`: `git checkout -b feat/nome-da-feature` (nomenclatura: `feat/`, `fix/`, `docs/`, `chore/`, `ci/` + descrição curta em PT-BR).
2. Commitar na branch e abrir um Pull Request no GitHub.
3. Automaticamente: o CI (seção 6) roda na branch **e** a Vercel cria um deploy de **preview** com URL própria → o E2E (seção 7) roda contra esse preview.
4. Tudo verde → merge na `main` → a Vercel deploya produção (com código já testado de ponta a ponta) → o E2E roda de novo contra produção, agora como *smoke test*.

**Ativação da proteção (passo manual no painel do GitHub, feito uma única vez):**
GitHub → repositório → **Settings → Branches → Add classic branch protection rule**:
- *Branch name pattern*: `main`
- ✅ **Require a pull request before merging** — sem marcar "Require approvals" (projeto solo: o GitHub não deixa o autor aprovar o próprio PR, então exigir aprovação travaria tudo).
- ✅ **Require status checks to pass before merging** — buscar e marcar os dois checks: `Lint, testes e build` (do CI) e `Playwright contra o deploy` (do E2E). Os nomes só aparecem na busca depois de cada workflow ter rodado pelo menos uma vez.
- ✅ **Do not allow bypassing the above settings** — aplica a regra até para admin (você). Sem isso, o push direto na `main` continuaria passando silenciosamente; se um dia precisar de um bypass de emergência, é só desmarcar temporariamente esta opção no painel.

**Efeito prático:** push direto na `main` passa a ser **rejeitado** pelo GitHub, e o merge de PR fica bloqueado enquanto CI ou E2E estiverem vermelhos — "o robô bloqueia a entrega" (seção 3) de verdade.

> ⚠️ **Limitação do plano gratuito (descoberta em 2026-07-06):** em repositório **privado**, o GitHub Free permite *criar* a regra, mas **não a aplica** — o próprio painel avisa: *"Your rules won't be enforced on this private repository until you move to a GitHub Team or Enterprise organization account"*. Por isso (somado ao alinhamento com o portfólio público do roadmap V2 e aos ganhos de Actions ilimitado + CodeQL gratuito), o repositório foi tornado **público** em 2026-07-06 — decisão registrada no `README.md`, tomada após varredura completa do histórico do Git confirmar que nenhum segredo foi jamais commitado.

> ✅ **Regra ativada e validada de ponta a ponta (2026-07-06):** a proteção da `main` passou a valer de fato e o **PR #1** foi o primeiro a percorrer todo o fluxo — CI + E2E verdes → merge → deploy de produção. **Armadilha encontrada no primeiro merge:** a opção **"Require approvals"** tinha sido marcada, e num projeto solo o GitHub **não deixa o autor aprovar o próprio PR** — o merge fica travado com *"At least 1 approving review is required"* mesmo com todos os checks verdes. Correção: `Settings → Branches → Edit rule` → **desmarcar "Require approvals"** (pôr 0), mantendo as três opções acima. É exatamente o alerta que já estava na lista de ativação (*"sem marcar Require approvals"*) — reforçado aqui porque custou uma depuração. Outro ponto de confusão da mesma sessão: o merge de um PR é feito **no botão do site do GitHub**, não pelo `git` local — a `main` protegida rejeita push direto, então tentar mergear pela linha de comando não funciona (e isso é a proteção agindo como esperado).
