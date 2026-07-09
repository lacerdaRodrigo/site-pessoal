# Casos de Teste (Componente) — Documentos

Casos de teste de componente da funcionalidade de Documentos (RF02/RF03 — ver `docs/01-arquitetura/03-requisitos-funcionais.md`). Renderizam os componentes em memória (React Testing Library sobre Vitest/jsdom) e simulam a interação do usuário. As Server Actions de `dados/` são substituídas por mocks (`vi.mock`) — não é chamada de rede do ponto de vista do teste. Código em `src/funcionalidades/documentos/apresentacao/{FormularioDocumento,BotaoCopiar,BotaoExcluir,BotaoFavorito}.test.tsx`.

Cada caso tem um ID (`CT-XX`) que aparece também no nome do teste automatizado correspondente, para rastrear um lado no outro.

---

## CT-35 — (Criar) o erro da Server Action aparece na tela
- **Pré-condições:** `FormularioDocumento` em modo de criação (sem documento inicial). A action `criarDocumento` está mockada para devolver um erro.
- **Passos:** Preencher título e conteúdo; clicar em "Criar documento".
- **Resultado esperado:** A mensagem de erro devolvida pela action aparece num `alert` na tela.

## CT-36 — (Criar) mostra o botão de criar, não o de salvar
- **Pré-condições:** `FormularioDocumento` em modo de criação.
- **Passos:** Renderizar o formulário sem documento inicial.
- **Resultado esperado:** Existe o botão "Criar documento" e **não** existe o botão "Salvar alterações".

## CT-37 — (Editar) o formulário vem preenchido com o documento
- **Pré-condições:** `FormularioDocumento` em modo de edição (recebe um documento existente).
- **Passos:** Renderizar o formulário passando um documento.
- **Resultado esperado:** Título e conteúdo já vêm com os valores do documento, e aparece o botão "Salvar alterações".

## CT-38 — (Editar) o erro ao salvar aparece na tela
- **Pré-condições:** Modo de edição. A action `atualizarDocumento` está mockada para devolver um erro.
- **Passos:** Clicar em "Salvar alterações".
- **Resultado esperado:** A mensagem de erro aparece num `alert` na tela.

## CT-44 — (Copiar) copia só o bloco de código e confirma na tela (RF02.5.1/5.3)
- **Pré-condições:** `BotaoCopiar` recebendo um conteúdo com um bloco de código. A API de clipboard do navegador está mockada.
- **Passos:** Clicar em "Copiar código".
- **Resultado esperado:** O clipboard recebe apenas o código do bloco (sem o texto ao redor) e o botão passa a exibir "Copiado!".

## CT-45 — (Copiar) sem bloco de código, copia o texto completo (RF02.5.2)
- **Pré-condições:** `BotaoCopiar` recebendo um conteúdo sem nenhum bloco de código. Clipboard mockado.
- **Passos:** Clicar em "Copiar código".
- **Resultado esperado:** O clipboard recebe o texto completo (fallback).

## CT-46 — (Excluir) cancelar a confirmação não exclui (RF02.4)
- **Pré-condições:** `BotaoExcluir`. O diálogo de confirmação (`window.confirm`) está mockado para retornar "cancelar" (false).
- **Passos:** Clicar em "Excluir" e cancelar a confirmação.
- **Resultado esperado:** A confirmação foi solicitada, mas a Server Action de exclusão **não** foi disparada — nada é apagado sem o "sim" do usuário.

## CT-75 — (Favoritar) documento não-favorito mostra a estrela vazia (RF03.3)
- **Pré-condições:** `BotaoFavorito` com `eFavorito={false}`.
- **Passos:** Renderizar o botão.
- **Resultado esperado:** Exibe a estrela vazia (☆), com rótulo "Adicionar aos favoritos" e `aria-pressed="false"`.

## CT-76 — (Favoritar) documento favorito mostra a estrela cheia e envia o estado atual (RF03.3)
- **Pré-condições:** `BotaoFavorito` com `eFavorito={true}`.
- **Passos:** Renderizar o botão.
- **Resultado esperado:** Exibe a estrela cheia (★), rótulo "Remover dos favoritos", `aria-pressed="true"`, e os campos ocultos carregam o `id` e o `eFavorito` atual (para a action saber a partir de qual estado alternar).

## CT-77 — (Editar) o campo Categoria vem preenchido com a categoria do documento (RF03.1)
- **Pré-condições:** `FormularioDocumento` em modo de edição, com um documento que tem `categoriaNome`.
- **Passos:** Renderizar o formulário passando o documento.
- **Resultado esperado:** O campo "Categoria" já vem com o nome da categoria do documento.

## CT-78 — (Criar) as categorias existentes viram opções de autocomplete (RF03.1)
- **Pré-condições:** `FormularioDocumento` recebendo uma lista de categorias.
- **Passos:** Renderizar o formulário.
- **Resultado esperado:** As categorias aparecem como `<option>` dentro do `<datalist>` (autocomplete), na ordem recebida.

---

## Como rodar

```
npm run test
```

Não precisa de rede nem banco (as Server Actions e o clipboard são mockados).
