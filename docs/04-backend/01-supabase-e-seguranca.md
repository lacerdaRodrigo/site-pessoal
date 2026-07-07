# Backend — Supabase e Segurança de Dados

O **Knowledge Hub** não terá um servidor backend escrito à mão (ex: Node.js ou Django). Em vez disso, usamos o **Supabase** como *Backend as a Service* (BaaS): ele fornece autenticação, banco de dados e storage prontos, e nosso trabalho é configurá-los corretamente e consumi-los pelo Next.js.

## 1. Os Três Serviços do Supabase Usados no Projeto

### Supabase Auth
Gerencia cadastro, login, logout, recuperação de senha e emissão do token de sessão (JWT). O Next.js nunca lida com senha em texto puro — apenas envia o formulário e recebe de volta um token, que é anexado automaticamente em toda requisição seguinte.

### PostgreSQL (Banco de Dados)
Guarda as tabelas `perfis`, `categorias`, `documentos`, `etiquetas` e `documento_etiquetas` (ver modelo completo em `docs/02-banco-de-dados/01-entidades.md`).

### Supabase Storage
Reservado para uso futuro (ex: anexar imagens a um documento). Não faz parte do escopo funcional do MVP, mas a infraestrutura já vem disponível no mesmo projeto Supabase.

## 2. RLS (Row Level Security) — A Regra de Ouro da Segurança

> 💡 **Nota de Aprendizado (Mentoria):** RLS é uma funcionalidade do próprio PostgreSQL (não é exclusiva do Supabase) que permite escrever regras de acesso *dentro do banco*, linha por linha. Isso é diferente de validar no frontend: mesmo que alguém chame a API diretamente pelo Postman, sem passar pela tela do Flutter, o banco recusa acesso a dados que não são dele.

Toda tabela que guarda dados do usuário terá:
1. **RLS habilitado** (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`) — por padrão, o Supabase cria tabelas com RLS **desligado**, então isso precisa ser feito explicitamente em toda migration nova.
2. **Uma policy de `SELECT`, `INSERT`, `UPDATE` e `DELETE`** restringindo `usuario_id = auth.uid()`.

### Exemplo de Policy (referência para quando o código nascer)
```sql
create policy "usuarios_veem_apenas_seus_documentos"
on documentos for select
using (auth.uid() = usuario_id);

create policy "usuarios_editam_apenas_seus_documentos"
on documentos for update
using (auth.uid() = usuario_id);
```

## 3. Por que a `anon key` Pode Ficar Visível no Navegador (e o que nunca pode)

> 💡 **Ponto de aprendizado confirmado com Rodrigo em 2026-07-02** — registrado aqui porque é o tipo de dúvida que gera pânico (ou excesso de confiança) na primeira code review real.

**A `anon key` não é uma senha — é só um crachá que identifica o projeto.** A segurança não vem de escondê-la; vem inteiramente do RLS (seção 2 acima). Analogia: a `anon key` é a porta da frente destrancada de um prédio — qualquer um entra (qualquer um consegue *chamar* a API do Supabase). Mas dentro do prédio, cada sala (cada linha de cada tabela) tem sua própria trava, que confere o crachá individual de quem entrou antes de deixar ver o que tem lá dentro. Essa trava é o RLS. A porta destrancada não é uma falha, porque nada de valioso fica guardado ali — o valor está trancado sala por sala.

Tecnicamente, duas coisas diferentes estão em jogo:
1. **A `anon key`** só prova que a requisição pertence ao *projeto* Supabase certo. É pública por design (o próprio Supabase documenta isso assim) — o mesmo princípio de uma chave de API do Google Maps restrita por domínio.
2. **O JWT de sessão** (emitido no login) é o que prova *quem* está pedindo os dados — carrega o `auth.uid()` real do usuário.

Toda query no Postgres é filtrada pelo RLS usando o `auth.uid()` extraído do JWT, **não** a `anon key`. Se alguém copiar sua `anon key` do DevTools e chamar a API direto pelo Postman sem estar logado como você, o `auth.uid()` dessa chamada é `NULL` — e `NULL` nunca é igual a nenhum `usuario_id`. A policy devolve zero linhas. A chave sozinha não abre porta nenhuma.

### O que seria perigoso de verdade: a `service_role key`

Essa chave (diferente da `anon key`) **ignora o RLS por completo** — é a "chave mestra", pensada só para código de servidor confiável (scripts administrativos, jobs). Se ela vazar, é acesso total e irrestrito ao banco, sem filtro nenhum.

### Solução de segurança adotada para nunca vazar a `service_role key`

1. **Não provisionar ainda.** O escopo do V1 (single user, tudo passa por RLS) **não precisa** de `service_role key` em nenhum lugar do código da aplicação. Ela só existiria por real necessidade futura (ex: um job administrativo em V3). Enquanto não houver essa necessidade, a chave simplesmente não é gerada/usada — reduz a superfície de risco a zero.
2. **Disciplina de nomes de variável de ambiente:** só `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` recebem o prefixo `NEXT_PUBLIC_`. Se um dia a `service_role key` for necessária, ela se chama `SUPABASE_SERVICE_ROLE_KEY` — **sem** o prefixo, ponto final.
3. **Módulo central de configuração server-only.** Quando essa chave existir, o acesso a ela fica isolado num único arquivo (ex: `src/nucleo/config/env-servidor.ts`) que importa o pacote `server-only` no topo. Esse pacote faz o **build falhar** se qualquer Client Component tentar importar esse arquivo, direta ou indiretamente — é uma trava automática, não depende de disciplina humana lembrando de "tomar cuidado".
4. **A chave nunca entra no Git.** `.env.local` (e qualquer `.env*` exceto um `.env.example` sem valores reais) fica no `.gitignore` desde o primeiro commit do projeto.
5. **Rede de segurança extra (ativada em 2026-07-06):** o **Secret Protection** do GitHub — que reúne o **Secret Scanning** + o **Push Protection**, gratuito em repositório público — está ativo. O Secret Scanning varre o repositório procurando padrões de chave de API vazada e alerta; o Push Protection vai além e **bloqueia o `git push`** na hora se detectar um segredo, impedindo o vazamento **antes** de entrar no histórico (rede extra além do `.gitignore`, para o caso de uma chave ser colada por engano num arquivo versionado). Complementa o Dependabot e o CodeQL (também ativos) — ver `docs/07-deploy/01-ambientes-e-pipeline.md`, seção 2.

## 4. Checklist de Segurança para Toda Nova Tabela

Sempre que uma tabela nova for criada no projeto, o checklist abaixo deve ser seguido (e vale a pena copiar esse checklist para o PR/commit que cria a migration):
- [ ] RLS habilitado.
- [ ] Policy de `SELECT` restringindo por `auth.uid()`.
- [ ] Policy de `INSERT` garantindo que `usuario_id` inserido é o do próprio usuário logado.
- [ ] Policy de `UPDATE` e `DELETE` restringindo por `auth.uid()`.
- [ ] Teste manual: tentar acessar dado de outro usuário via API e confirmar que retorna vazio/erro.

## 5. Política de Senha e Confirmação de E-mail

**Senha:** mínimo de **8 caracteres** (acima do padrão do Supabase, que é 6), configurado no painel do projeto Supabase (Authentication → Policies) ou via `supabase/config.toml` (`[auth] minimum_password_length = 8`). Sem exigência de composição (símbolo/maiúscula obrigatórios) — comprimento é o que efetivamente dificulta ataques de força bruta; regras de complexidade forçada tendem a produzir senhas previsíveis (`Senha123!`) em vez de senhas fortes.

**Confirmação de e-mail:** mantida **ativada** (comportamento padrão do Supabase Auth) — sem essa confirmação, o RF01.4 ("Esqueci minha senha") fica sem garantia de que o e-mail cadastrado é real e acessível pelo dono da conta.

> 💡 **Nota de Aprendizado (Mentoria):** o receio de "ficar trancado fora da própria conta" (citado na revisão que gerou este documento) é real, mas é sobretudo um problema de **ambiente de desenvolvimento**, não de produção. Rodando o Supabase localmente (`supabase start`), os e-mails de confirmação não saem para a internet — eles caem numa caixa de teste local (Inbucket/Mailpit, acessível em `localhost`), então dá pra confirmar a própria conta sem depender de e-mail real durante os testes. Em produção, o e-mail é real e a confirmação cumpre seu papel de segurança de verdade.

**Destino do link de confirmação (decidido em 2026-07-05):** por padrão, o Supabase redireciona o link do e-mail de confirmação para o `Site URL` configurado no painel (que sem customização cai na raiz `/` do app). Isso foi ajustado passando `options.emailRedirectTo` explicitamente na chamada de `supabase.auth.signUp()` (`src/funcionalidades/autenticacao/dados/acoes.ts`), apontando para uma página própria de destino (`src/app/auth/confirmado/page.tsx`) em vez de deixar cair na home. A URL usada é montada a partir de `NEXT_PUBLIC_SITE_URL` (`.env.local`), com fallback para a variável automática `VERCEL_URL` quando rodando em preview/produção na Vercel — isso é o que permite o mesmo código funcionar em localhost e nos ambientes de deploy sem precisar trocar nada manualmente (ver `docs/07-deploy/01-ambientes-e-pipeline.md`).

> ⚠️ Toda URL de redirecionamento usada em `emailRedirectTo` precisa estar cadastrada em **Authentication → URL Configuration → Redirect URLs** no painel do Supabase — caso contrário, o Supabase ignora o valor e volta a usar o `Site URL` padrão.

**Template do e-mail de confirmação (decidido em 2026-07-05, pendente de aplicar):** a decisão é substituir o template padrão do Supabase ("Confirm your email address", em inglês, sem identidade do produto) por um texto em português com a marca "Knowledge Hub", editado diretamente em **Authentication → Email Templates → Confirm signup** no painel. **Status:** tentativa feita em 2026-07-05, mas o e-mail recebido ainda veio com o texto padrão — ver pendência registrada no README ("Pontos que Ainda Precisam Ser Definidos"). Não foi configurado SMTP customizado (o remetente continua sendo o do Supabase, `noreply@mail.app.supabase.io`) — trocar isso exigiria um domínio de e-mail próprio, fora de escopo por ora.

**Limite de envio de e-mail do serviço padrão (constatado em 2026-07-05):** o e-mail integrado do Supabase (sem SMTP customizado) tem um limite documentado de **2 e-mails por hora por projeto** (endpoints `/auth/v1/signup`, `/auth/v1/recover`, `/auth/v1/user` — fonte: [documentação oficial de rate limits do Supabase Auth](https://supabase.com/docs/guides/auth/rate-limits)). Isso explica um comportamento observado durante o teste: repetir o cadastro com o mesmo e-mail várias vezes seguidas faz o Supabase parar de enviar o e-mail de confirmação a partir da 3ª tentativa na mesma hora, **sem retornar erro** (o `signUp()` responde como se tivesse dado certo). **Não é um bug do código** — é um limite da infraestrutura gratuita do Supabase, e não há teste automatizado que faça sentido escrever para isso (é um comportamento do serviço externo, não da nossa lógica). Resolve-se apenas configurando SMTP customizado (mesmo item acima, fora de escopo por ora).

**Recuperação de senha — RF01.4 (implementado em 2026-07-05):** diferente da confirmação de cadastro, redefinir a senha exige uma **sessão temporária de recovery** estabelecida via cookie (é preciso estar "autenticado" para poder chamar `supabase.auth.updateUser({ password })`). Por isso, o link do e-mail de recuperação **não pode** apontar direto para uma página de destino como no cadastro — ele passa primeiro por uma rota própria do app, `src/app/auth/confirm/route.ts`, que chama `supabase.auth.verifyOtp({ type, token_hash })` (isso é o que efetivamente grava o cookie de sessão via `criarClienteServidor()`) e só depois redireciona para `/redefinir-senha`. Se o token for inválido ou expirado, redireciona para `/login?erro=link-invalido`.

Fluxo completo:
1. Usuário pede o link em `/esqueci-senha` → `solicitarRedefinicaoSenha()` chama `supabase.auth.resetPasswordForEmail(email, { redirectTo: ".../auth/confirm?type=recovery&next=/redefinir-senha" })`.
2. **Configuração manual necessária no painel do Supabase** (Authentication → Email Templates → **Reset Password**): trocar o corpo do e-mail para usar `{{ .TokenHash }}` em vez do `{{ .ConfirmationURL }}` padrão — o padrão não passa pela rota `/auth/confirm` do nosso app, então a sessão de recovery nunca seria estabelecida. O link no template precisa ficar assim:
   ```
   {{ .RedirectTo }}&token_hash={{ .TokenHash }}
   ```
   `{{ .RedirectTo }}` já renderiza o valor completo que passamos em `redirectTo` no passo 1 (`.../auth/confirm?type=recovery&next=/redefinir-senha`) — por isso o link final some com `&token_hash=...` (não `?`, já tem `?` vindo do `{{ .RedirectTo }}`). Usar `{{ .RedirectTo }}` em vez de escrever `{{ .SiteURL }}/auth/confirm...` fixo no template é o que mantém o link funcionando tanto em `localhost` quanto na Vercel, sem editar o painel de novo a cada ambiente — mesmo princípio do `emailRedirectTo` do cadastro (seção acima).
3. Usuário clica no e-mail → cai em `/auth/confirm` → sessão de recovery é gravada via cookie → redireciona para `/redefinir-senha`.
4. Usuário define a nova senha → `redefinirSenha()` chama `supabase.auth.updateUser({ password })` → redireciona para `/login`.

Assim como no cadastro, a mensagem de sucesso do CT-15 (`docs/06-testes/casos-testes/componentes/recuperacao-senha.md`) é **sempre a mesma**, exista ou não o e-mail informado (mesma proteção anti-enumeração). O endpoint `/auth/v1/recover` está sob o mesmo limite de 2 e-mails/hora descrito acima.

**Proteção contra Open Redirect no `?next=` (corrigido em 2026-07-05):** a rota `/auth/confirm` recebe o destino final do fluxo pelo parâmetro `next` da URL — e um parâmetro de URL é sempre entrada externa, mesmo quando somos nós que montamos o link. A implementação original fazia `NextResponse.redirect(new URL(next, origin))` sem validar o valor; como `new URL()` usa o `origin` apenas como *base*, um `next` com URL absoluta (`https://site-malicioso.com`), protocolo-relativa (`//site-malicioso.com`) ou com barra invertida (`/\site-malicioso.com`) ignoraria a base e mandaria o usuário para fora do nosso domínio — a falha clássica de **Open Redirect**, usada em phishing. A correção: o valor passa por `caminhoInternoSeguro()` (`src/nucleo/seguranca/redirecionamento.ts`), que só aceita caminhos internos (começam com `/`, não com `//` nem `/\`) e cai no fallback `/` para qualquer outra coisa. Casos de teste em `docs/06-testes/casos-testes/unitarios/recuperacao-senha.md` (CT-22 a CT-26). A explorabilidade era baixa (o redirect só acontece com `token_hash` válido, que chega apenas no e-mail do dono da conta), mas a validação é barata e a rota tende a ser reaproveitada por fluxos futuros.

Fonte consultada: [supabase.com/docs/guides/auth/passwords](https://supabase.com/docs/guides/auth/passwords).

## 6. Autenticação em Cache no Next.js (Decidido)

**Decisão confirmada com Rodrigo em 2026-07-02:** a sessão será mantida via **cookies**, usando o comportamento **padrão** do pacote oficial `@supabase/ssr` — sem customização.

No ecossistema Flutter, isso era resolvido com `SharedPreferences`/local storage do navegador, gerenciado pelo SDK `supabase_flutter`. No Next.js a situação é diferente por causa dos Server Components (ver nota em `docs/01-arquitetura/01-visao-geral.md`): como parte da renderização acontece no servidor da Vercel, a sessão não pode viver só no `localStorage` do navegador (o servidor não tem acesso a ele). O `@supabase/ssr` resolve isso com um arquivo especial na raiz do projeto que renova o token a cada requisição (`src/proxy.ts` — a partir do Next.js 16 esse arquivo se chama `proxy.ts`; em versões anteriores era `middleware.ts`, nome usado na documentação oficial do Supabase até o momento), e duas funções (`createBrowserClient` / `createServerClient`) que leem/escrevem o mesmo cookie dos dois lados.

**Por que o padrão, e não algo customizado:** é a receita oficial documentada pelo próprio Supabase para Next.js App Router — não há requisito neste projeto (single user, sem necessidade exótica de sessão) que justifique reconstruir algo que o fornecedor já resolve e mantém. Implementado no Passo 4 do roadmap (ver README).
