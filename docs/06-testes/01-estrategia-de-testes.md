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
