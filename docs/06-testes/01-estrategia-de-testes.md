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

## 2. Metodologia (TDD e Mocks)

* **Desenvolvimento Orientado a Testes (TDD):** Sempre que possível, escreveremos o teste antes do código. Exemplo: primeiro escrevemos o teste "O botão deve salvar", vemos ele falhar, e depois criamos o botão para o teste passar.
* **Isolamento (Mocks):** Para não "sujar" o banco de dados do Supabase na nuvem durante os milhares de testes automatizados, vamos usar "Mocking" — no ecossistema JS, a ferramenta padrão para isso é o `MSW` (Mock Service Worker), que intercepta as chamadas de rede antes de saírem do navegador (equivalente ao papel que o `mocktail` cumpria no Flutter). Nós vamos "fingir" que o Supabase respondeu com sucesso, apenas para testar se o aplicativo se comporta bem sem precisar usar a internet real.

## 3. Critério de Conclusão (Definition of Done)
Uma nova funcionalidade só será considerada "Terminada" quando:
1. O código estiver limpo e na pasta certa.
2. Os testes unitários, de componente e de integração estiverem passando com tela verde.
3. Não existir nenhum "aviso amarelo" (Warnings de Linting) no código TypeScript (ESLint).
