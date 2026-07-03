# UI/UX — Telas e Componentes (spec do protótipo)

Mapa das telas do protótipo `Knowledge Hub` e dos componentes reutilizáveis, ligando cada um à estrutura Feature-First (`src/funcionalidades/`).

---

## 1. Componentes reutilizáveis (`src/nucleo/componentes/`)

| Componente | Descrição | Onde aparece |
|---|---|---|
| `BotaoPrimario` | Fundo `primary`, texto branco, raio 9px, brilho roxo no hover. | Entrar, Salvar, Novo, Editar |
| `BotaoSecundario` | Fundo `card`, borda 1px, vira roxo no hover. | Copiar conteúdo |
| `BotaoPerigo` | Texto/borda em tom de erro (vermelho), fundo `card`, mais intenso no hover. | Excluir |
| `CardConteudo` | Fundo `card`, borda 1px, raio 12px, eleva no hover. | Dashboard, lista |
| `CampoTexto` | Fundo `input`, borda 1px, anel de foco roxo. | Login, busca, editor |
| `ChipEtiqueta` | Fonte mono, fundo `inline`, raio 6px. | Lista e visualização |
| `DotCategoria` | Quadradinho 8px com cor da categoria. | Sidebar, cards, lista |
| `ItemLista` | Linha com dot + título + etiquetas + data + estrela + menu de ações (`...`). | Lista de documentos |
| `MenuAcoes` | Menu "..." revelado no hover/toque, com opções contextuais (ex: Excluir). | ItemLista |
| `DialogoConfirmacao` | Modal com título, mensagem e ações Cancelar/Confirmar (variante `perigo` para exclusão). | Excluir documento |
| `ToggleTema` | Botão ☾ / ☀ que alterna Dark/Light. | Rodapé da sidebar |
| `MenuGaveta` | Sidebar em modo *drawer*: desliza sobre o conteúdo com overlay escurecido, abre pelo botão `☰`. | Layout mobile (< 768px) |

---

## 2. Telas

### 2.1 Login — `funcionalidades/autenticacao/`
- Fundo com leve halo roxo no topo (radial gradient).
- Card central (max 400px): logo "K", título, campos e-mail/senha, botão **Entrar**, link "Esqueceu a senha?".
- Rodapé com versão em fonte mono.

### 2.2 App Shell (layout base)
Estrutura de duas colunas presente em todas as telas internas:
- **Sidebar (262px):** logo → busca → botão "Novo documento" → navegação (Painel, Todos, Favoritos) → lista de Categorias → rodapé com perfil + toggle de tema.
- **Área principal:** troca de conteúdo conforme a navegação.

**Comportamento responsivo (breakpoint < 768px):**
- A sidebar de 262px **não fica fixa na tela**. Em telas estreitas, ela vira um menu hambúrguer (`☰`) fixo no topo da área principal.
- Ao tocar no `☰`, a sidebar desliza por cima do conteúdo como uma gaveta (*drawer*), com um overlay escurecido atrás dela.
- Selecionar qualquer item do menu (navegação, categoria) fecha a gaveta automaticamente e mostra o conteúdo escolhido.
- Este comportamento é obrigatório (ver RNF02.3 em `docs/01-arquitetura/04-requisitos-nao-funcionais.md`): sem ele, a sidebar fixa consome ~67% da largura de uma tela de celular (390px), espremendo o conteúdo e quebrando o texto.

### 2.3 Painel Inicial (Dashboard) — `funcionalidades/painel_inicial/`
- Saudação + título.
- 4 cards de estatística: Documentos, Categorias, Favoritos, Etiquetas.
- Seção "Editados recentemente" em grade de 2 colunas com link "Ver todos".

### 2.4 Lista de Documentos — `funcionalidades/documentos/`
- Título dinâmico (Todos / Favoritos / nome da categoria) + contagem.
- Botão "Novo".
- Linhas de documento com dot da categoria, título, trecho, etiquetas, data, estrela para favoritar e um `MenuAcoes` (`...`, revelado no hover/toque) com a opção **Excluir**.
- Filtra por categoria (sidebar) e por busca (texto).
- **RF02.4 (exclusão):** clicar em "Excluir" no `MenuAcoes` abre o `DialogoConfirmacao` (variante perigo). Confirmando, o documento é removido da lista e um toast confirma a ação; cancelando, nada acontece.

### 2.5 Visualização de Documento — `funcionalidades/documentos/`
- Barra fixa no topo: voltar, **Copiar conteúdo**, **Editar**, **Excluir** (`BotaoPerigo`, alinhado à direita para separar visualmente das ações "seguras").
- Cabeçalho: categoria + data, título grande, estrela de favorito, etiquetas.
- Corpo: Markdown renderizado (blocos de código em `JetBrains Mono`).
- **Regra do botão Copiar:** copia **apenas o conteúdo do(s) bloco(s) de código** (o prompt/snippet), não o documento inteiro. Fallback: se não houver bloco, copia o texto todo.
- **RF02.4 (exclusão):** clicar em "Excluir" abre o mesmo `DialogoConfirmacao` da lista. Confirmando, volta para a Lista de Documentos com um toast de confirmação.

### 2.6 Editor Markdown — `funcionalidades/documentos/`
- Barra superior: voltar, modo (Novo/Editando), estado do rascunho, **Salvar**.
- Título editável + seletor de categoria + campo de etiquetas.
- Área dividida em 2: **Markdown** (esquerda, mono) | **Pré-visualização** ao vivo (direita).

**Comportamento responsivo (breakpoint < 768px):** as duas colunas lado a lado não cabem numa tela de celular. Abaixo de 768px, a área vira **abas alternáveis** (`Editar` | `Pré-visualização`) em vez de colunas lado a lado — empilhar as duas verticalmente deixaria cada painel curto demais pra ser útil numa tela de ~390px. A aba `Editar` é a padrão ao abrir o editor (é onde o usuário passa a maior parte do tempo); trocar para `Pré-visualização` é uma ação explícita. Ver token `mobile` em `02-tokens-visuais.md`, seção 5.

---

## 3. Estados e comportamentos (para casos de teste)

- Favoritar/desfavoritar atualiza a contagem em "Favoritos" e o dot da estrela.
- Busca filtra por título, conteúdo e etiquetas.
- Copiar mostra confirmação temporária ("Prompt copiado!") e volta ao normal após ~1.6s.
- Excluir sempre passa pelo `DialogoConfirmacao` antes de remover — nunca exclui direto no clique do menu/botão. Cancelar fecha o diálogo sem nenhum efeito colateral (nenhuma chamada ao Supabase).
- Troca de tema afeta todas as cores instantaneamente.
- Transição de entrada (fade) ao mudar de tela.

> Estes comportamentos viram critérios de aceite (RF) e casos de teste E2E no módulo de testes.
