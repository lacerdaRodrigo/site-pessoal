# Testes — Estratégia de Qualidade (QA)

Como o desenvolvedor principal desta aplicação é um Especialista em Qualidade (QA Pleno), o projeto adotará a postura de **"Tolerância Zero a Bugs Críticos"** e uma mentalidade **Shift-Left** (testar o quanto antes, escrevendo testes junto com o código e não no final).

O objetivo é desenvolver um software maduro, extremamente estável e robusto.

## 1. A Pirâmide de Testes no Next.js

Para garantir que a aplicação saia sem bugs, o desenvolvimento abraçará os 3 níveis clássicos de testes, agora com o ferramental padrão do ecossistema JavaScript/TypeScript (substituindo o ferramental Flutter original):

### A. Testes de Unidade (Unit Tests)
- **O que testa:** Funções isoladas, validações (ex: *O email digitado é válido?*) e regras de negócio da camada de `dominio/`.
- **Como atua:** São extremamente rápidos. Nenhuma classe/função de regra de negócio deve existir sem um teste validando se ela funciona no cenário "Feliz" e no cenário de "Erro".
- **Ferramenta:** `Vitest` (equivalente direto ao `flutter_test` para unidade — rápido, nativo em TypeScript/ESM).

### B. Testes de Componente
- **O que testa:** A interface visual. Ele renderiza o componente React em memória e simula um clique/interação.
- **Como atua:** Garante que se o usuário clicar no botão "Copiar Prompt", o botão muda de cor e dispara a ação correta. Impede que a gente coloque uma tela no ar com botões "quebrados" ou fora do lugar.
- **Ferramenta:** `React Testing Library`, rodando sobre o `Vitest` (equivalente direto ao `testWidgets` do Flutter).

### C. Testes de Integração (E2E - End-to-End)
- **O que testa:** A jornada real e completa do usuário no site.
- **Como atua:** Um "robô" invisível abre o site no navegador -> vai na tela de Login -> Digita a senha real -> Clica no menu lateral -> Cria um documento -> Salva -> Exclui. Garante que todas as peças (Tela + Lógica + Supabase) funcionam muito bem em conjunto.
- **Ferramenta:** `Playwright` (equivalente direto ao `integration_test` do Flutter — é também a ferramenta de E2E recomendada oficialmente pela documentação do Next.js).
- **Ambiente-alvo (decidido em 2026-07-05, ADR 10 em `docs/01-arquitetura/06-decisoes-tecnicas.md`):** roda contra o **deploy real na Vercel** (preview/produção), não contra `localhost` — decisão tomada assim que o ambiente de deploy ficou disponível.

## 2. Metodologia (TDD e Mocks)

* **Desenvolvimento Orientado a Testes (TDD):** Sempre que possível, escreveremos o teste antes do código. Exemplo: primeiro escrevemos o teste "O botão deve salvar", vemos ele falhar, e depois criamos o botão para o teste passar.
* **Isolamento (Mocks) — dois casos diferentes (esclarecido em 2026-07-05):**
  * **Componentes que chamam Server Actions do Next.js** (ex: os formulários de login/cadastro): o teste de componente usa `vi.mock()` do próprio Vitest para substituir a Server Action inteira por uma função fake que devolve o resultado desejado (sucesso ou erro). Isso porque uma Server Action não é uma chamada de rede do ponto de vista do navegador/teste — é uma referência de função — então o `MSW` não tem o que interceptar aqui.
  * **Componentes que chamam o Supabase diretamente pelo navegador** (ex: futuras telas de CRUD de Documentos usando `criarClienteNavegador`): aqui sim entra o `MSW` (Mock Service Worker), que intercepta a chamada HTTP real antes de sair do navegador (equivalente ao papel que o `mocktail` cumpria no Flutter), fingindo que o Supabase respondeu com sucesso sem precisar de internet real.
  * Em ambos os casos, o objetivo é o mesmo: não "sujar" o banco de dados do Supabase na nuvem com dados de teste, nem depender de internet para rodar a suíte de unidade/componente.
* **Testes que tocam um serviço real pulam quando faltam credenciais (ajustado em 2026-07-06):** o único teste sem mock é o **CT-06** (`src/nucleo/supabase/conexao.test.ts`), que faz uma requisição real ao Supabase para confirmar que URL/`anon key` apontam para um projeto ativo. Ele agora **pula** (`it.skipIf`) quando `NEXT_PUBLIC_SUPABASE_URL`/`ANON_KEY` não estão no ambiente, em vez de falhar. Motivo: os **PRs do Dependabot** rodam o CI **sem acesso aos GitHub Secrets** (o GitHub não os expõe a PRs automáticos, por segurança) — antes desse ajuste, o CT-06 quebrava e travava todo PR do Dependabot. Onde há credenciais (`.env.local` na máquina, CI de PRs normais e da `main`), ele roda de verdade. Mesmo padrão dos casos de E2E que dependem de login (pulam sem `E2E_EMAIL`/`E2E_SENHA`).

## 3. Casos de Teste Documentados (`docs/06-testes/casos-testes/`)

Todo teste automatizado (unitário, componente ou E2E) tem um **caso de teste** correspondente documentado em Markdown em `docs/06-testes/casos-testes/`, separado em três subpastas por tipo — `unitarios/`, `componentes/`, `e2e/` — cada uma com um arquivo por funcionalidade (ex: `autenticacao.md`), para não misturar a escrita de níveis diferentes da pirâmide. O caso de teste é escrito para ser lido por **qualquer QA ou pessoa não-técnica**, sem precisar entender o código do teste.

Cada caso segue o modelo:
- **ID** (`CT-XX`) — o mesmo ID aparece no nome do teste automatizado (`it("CT-XX: ...")` / `test("CT-XX: ...")`), pra rastrear um lado no outro.
- **Tipo** — qual camada da pirâmide (unitário / componente / E2E) e onde está o código do teste.
- **Pré-condições** — o que precisa existir antes do teste rodar.
- **Passos** — numerados, na ordem em que acontecem.
- **Resultado esperado** — o que confirma que o caso passou.

## 4. Critério de Conclusão (Definition of Done)
Uma nova funcionalidade só será considerada "Terminada" quando:
1. O código estiver limpo e na pasta certa.
2. Os testes unitários, de componente e de integração estiverem passando com tela verde.
3. Cada teste tiver seu caso de teste correspondente documentado em `docs/06-testes/casos-testes/` (seção 3 acima).
4. Não existir nenhum "aviso amarelo" (Warnings de Linting) no código TypeScript (ESLint).
5. A cobertura de testes da **camada de lógica** se mantiver em **pelo menos 80%** — o CI mede e **bloqueia a entrega** se cair abaixo (ver seção 5).

## 5. Meta de Cobertura de Testes (decidido em 2026-07-06)

**Meta: no mínimo 80% de cobertura na camada de lógica** — medida pelo `Vitest` (`@vitest/coverage-v8`), com o `vitest.config.ts` reprovando (exit code ≠ 0) se ficar abaixo. O CI roda `npm run test:coverage` (workflow `ci.yml`), então um PR que derrube a cobertura da lógica **não passa no gate** e não pode ser mergeado.

**Por que "na lógica" e não cobertura global (nuance de QA):** cobertura mede *linhas executadas por algum teste*, não *se o teste é bom* — dá para ter 90% global com testes que não afirmam nada. E código de UI, configuração e tipos infla ou distorce o número. Por isso a meta é apontada para onde ela **significa** algo: a regra de negócio. O escopo medido é:

- ✅ **Incluído:** `src/funcionalidades/**/dominio/**` (validações e regras) e `src/nucleo/**` (utilitários de núcleo, ex: `seguranca/redirecionamento.ts`).
- ❌ **Excluído de propósito:** `src/app/**` e `**/apresentacao/**` (UI — validada por testes de componente), `**/dados/**` (Server Actions — validadas por E2E) e `src/nucleo/supabase/**` (wrappers de infra — dependem de ambiente/rede, validados pelo teste de conexão real e pelo E2E). Incluir essas camadas só distorceria o número sem medir a lógica.

**Estado em 2026-07-06:** a camada de lógica está em **100%** (`validacoes.ts` e `redirecionamento.ts`, ambos com teste). A meta protege esse patamar: código de negócio novo sem teste derruba a % e trava o CI — exatamente o "Shift-Left" da seção 1 virando gate automático.

**Ferramentas de análise de código do projeto (o quadro completo):** a qualidade e a validação do código são cobertas por camadas que se complementam — **ESLint + Prettier** (estilo, erros, tipagem), **TypeScript** no `next build` (tipos), **CodeQL** (brechas de segurança), **Dependabot** (vulnerabilidades em dependências) e agora esta **meta de cobertura** (quanto da lógica está testado). Uma ferramenta de *quality gate* unificado com nota, tipo **SonarCloud**, foi **conscientemente adiada** (não descartada): com o código ainda pequeno ela se sobreporia ao ESLint/CodeQL sem ganho proporcional. Passa a fazer sentido quando o código crescer (CRUD, editor, busca) e como item de portfólio na V2.
