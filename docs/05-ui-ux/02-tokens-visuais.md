# UI/UX — Tokens Visuais (extraídos do protótipo)

Este documento traduz o protótipo `Knowledge Hub` em **valores exatos** para virarem o tema do Next.js (`src/nucleo/tema/`). Nada aqui é "achismo": é o que está desenhado nas telas.

> 💡 Regra: nenhum componente usa cor/tamanho "solto". Tudo sai destes tokens.

---

## 1. Cores

### Modo Escuro (foco principal)

| Token | Hex | Uso |
|---|---|---|
| `bg` | `#0F0F11` | Fundo geral da área de conteúdo |
| `sidebar` | `#0C0C0E` | Fundo do menu lateral (mais escuro) |
| `card` | `#18181B` | Cards, painéis, inputs elevados |
| `input` | `#141417` | Fundo de campos de texto |
| `code` | `#101013` | Fundo de blocos de código |
| `border` | `rgba(255,255,255,0.09)` | Bordas de 1px |
| `hover` | `rgba(255,255,255,0.045)` | Fundo ao passar o mouse |
| `text` | `#FAFAFA` | Texto principal |
| `muted` | `#A1A1AA` | Texto secundário |
| `faint` | `#6B6B73` | Texto/ícones bem discretos |
| `primary` | `#8B5CF6` | Roxo neon (no dark, levemente mais claro) |

### Modo Claro

| Token | Hex | Uso |
|---|---|---|
| `bg` | `#FAFAFA` | Fundo geral |
| `sidebar` | `#F4F4F5` | Menu lateral |
| `card` | `#FFFFFF` | Cards e painéis |
| `input` | `#FFFFFF` | Campos de texto |
| `code` | `#F4F4F5` | Blocos de código |
| `border` | `rgba(0,0,0,0.09)` | Bordas de 1px |
| `hover` | `rgba(0,0,0,0.04)` | Fundo hover |
| `text` | `#18181B` | Texto principal (grafite) |
| `muted` | `#52525B` | Texto secundário |
| `faint` | `#A1A1AA` | Texto discreto |
| `primary` | `#7C3AED` | Roxo neon |

### Cores das categorias (bolinha/dot)

| Categoria | Hex |
|---|---|
| Prompts | `#7C3AED` |
| SQL Queries | `#0EA5E9` |
| Flutter | `#22C55E` |
| Arquitetura | `#F59E0B` |
| QA / Testes | `#EC4899` |
| Git | `#EF4444` |

---

## 2. Tipografia

- **UI (textos, menus, títulos):** `Inter` — pesos 400 / 500 / 600 / 700.
- **Código e prompts:** `JetBrains Mono` — pesos 400 / 500 / 600.

| Papel | Tamanho | Peso | Fonte |
|---|---|---|---|
| Título de tela (H1) | 24–30px | 700 | Inter |
| Subtítulo de seção (H2) | 16–20px | 600 | Inter |
| Título de card / documento | 14.5px | 600 | Inter |
| Corpo | 14–15px | 400 | Inter |
| Texto secundário | 12.5–13px | 400/500 | Inter |
| Número de estatística | 28px | 600 | JetBrains Mono |
| Código / etiquetas / datas | 11–13.5px | 400/500 | JetBrains Mono |

Ajuste de letra (letter-spacing): títulos grandes usam `-0.02em`.

---

## 3. Espaçamento, Raio e Borda

- **Escala de espaçamento (px):** 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 26, 30, 34, 40.
- **Padding de conteúdo das telas:** `34px 40px`.
- **Padding interno de card:** `18px 20px`.
- **Raio de borda (`borderRadius`):**
  - Botão / input / item de lista: `8–9px`
  - Card / painel: `11–12px`
  - Card do login / logo grande: `16px`
  - Chip de etiqueta: `6–7px`
  - Avatar: círculo (`50%`)
- **Borda:** sempre `1px solid` usando o token `border`.

---

## 4. Sombras e Micro-interações

- **Sem glassmorphism.** Tudo sólido (definição do design system).
- **Sombra de destaque (roxo):** `0 6px 20px rgba(124,58,237,0.35)` — usada em botões primários no hover.
- **Sombra de card elevado (hover):** `0 10px 30px rgba(0,0,0,0.18)`.
- **Foco de input:** borda vira `primary` + `box-shadow: 0 0 0 3px rgba(124,58,237,0.18)`.
- **Hover do botão "Copiar":** brilho suave roxo (`box-shadow` + leve `translateY(-1px)`).
- **Transições:** `0.14s`–`0.18s`, propriedade `all` ou `background`.
- **Entrada de tela:** fade + subida de 6px, `0.35s ease` (via transição CSS ou biblioteca `Framer Motion`).

---

## 5. Breakpoints (Responsividade)

| Token | Largura | Comportamento |
|---|---|---|
| `mobile` | `< 768px` | Sidebar vira `MenuGaveta` (drawer) acionado por `☰` (ver `03-telas-e-componentes.md`, seção 2.2). Editor Markdown vira abas alternáveis Editar/Pré-visualização em vez de colunas lado a lado (ver seção 2.6). |
| `desktop` | `>= 768px` | Sidebar fixa de 262px, layout de duas colunas. Editor Markdown com colunas Markdown/Pré-visualização lado a lado. |

---

## 6. Como isso vira código Next.js

> 💡 **Ponto em Aberto:** esta seção assume `Tailwind CSS` como camada de estilização (encaixe natural para traduzir uma tabela de tokens em configuração) e `next-themes` para o toggle dark/light (padrão do ecossistema Next.js, evita "flash" de tema errado por já resolver SSR). Nenhuma das duas é uma decisão fechada em ADR ainda — vale confirmar quando o Módulo 05 entrar em construção prática. Nenhuma delas contraria a decisão de "construir componentes do zero" (README, Decisões Tomadas): são ferramentas de estilização/config, não uma biblioteca de componentes prontos.

- Cada bloco de cor acima = variáveis CSS (dark e light) integradas ao `tailwind.config.ts` como cores customizadas.
- Tipografia = fontes `Inter` e `JetBrains Mono` carregadas via `next/font`, configuradas em `tailwind.config.ts` (`fontFamily`).
- O toggle Dark/Light = `next-themes` combinado com a variante `dark:` do Tailwind. Estado de UI mais simples (ex: sidebar aberta) continua usando Zustand, conforme ADR 08.
- Raios e espaçamentos = extensões em `tailwind.config.ts` (`spacing`, `borderRadius`) para não repetir número mágico.
- Breakpoint = os breakpoints nativos do Tailwind (ex: `md:`) decidindo entre sidebar fixa e `MenuGaveta` — agora um componente React construído do zero, sem widget nativo equivalente ao `Drawer` que o Flutter oferecia pronto.
