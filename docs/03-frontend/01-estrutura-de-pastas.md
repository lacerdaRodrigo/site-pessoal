# Frontend — Estrutura de Pastas e Arquitetura

Para a aplicação Next.js, mantemos o padrão arquitetural **Guiado por Funcionalidades (Feature-First)** definido no ADR 01, totalmente traduzido para o **Português (PT-BR)** onde o framework permitir, para garantir o máximo de clareza no aprendizado.

Esta decisão foi tomada porque, em projetos profissionais que tendem a escalar, separar os arquivos pelo "O que eles fazem" (Funcionalidade) é muito mais organizado do que separar pelo "O que eles são".

> 💡 **Nota de Aprendizado (Mentoria) — a diferença mais importante desta migração:** no Flutter, o GoRouter era um arquivo de configuração (`nucleo/rotas/`) que apontava manualmente para cada tela. No Next.js, **a própria estrutura de pastas dentro de `app/` já é a configuração de rotas** — não existe (nem precisa existir) um arquivo central listando rotas. Por isso a pasta `nucleo/rotas/` que existia no plano do Flutter **deixa de existir**: seu papel foi absorvido pela estrutura do `app/`.

## 1. A Árvore de Diretórios (Guiado por Funcionalidades)

Abaixo está o mapeamento de como a pasta `src/` (raiz do código Next.js) será organizada:

```text
src/
│
├── app/                         # 1. ROTAS (App Router) — nomes de arquivo exigidos pelo framework
│   ├── layout.tsx               # Layout raiz (equivalente ao ponto de entrada que era main.dart)
│   ├── globals.css
│   ├── login/
│   │   └── page.tsx             # Rota /login — só importa e renderiza a tela vinda de funcionalidades/
│   └── (autenticado)/           # Grupo de rotas que exigem sessão ativa (não vira segmento na URL)
│       ├── layout.tsx           # Layout que verifica sessão antes de renderizar as páginas abaixo
│       ├── painel/
│       │   └── page.tsx         # Rota /painel
│       └── documentos/
│           ├── page.tsx         # Rota /documentos (lista)
│           └── [id]/
│               └── page.tsx     # Rota /documentos/:id (visualização/edição)
│
├── nucleo/                      # 2. Tudo que é GLOBAL no sistema (core)
│   ├── tema/                    # Cores, Fontes, Dark Mode
│   ├── utilidades/               # Funções ajudantes (formatar datas, etc)
│   └── componentes/              # Componentes visuais globais (ex: Botão Padrão)
│
└── funcionalidades/              # 3. O coração do sistema (Mini-Apps)
    │
    ├── autenticacao/             # Funcionalidade: Login
    │   ├── dados/                # Comunica com Supabase Auth
    │   ├── dominio/              # Regras de negócio (ex: validar email)
    │   └── apresentacao/         # Componentes React (Formulário de Login) e hooks de estado
    │
    ├── painel-inicial/           # Funcionalidade: Tela Inicial (Dashboard)
    │   ├── dados/
    │   ├── dominio/
    │   └── apresentacao/
    │
    └── documentos/                # Funcionalidade: Prompts e Anotações (O CRUD)
        ├── dados/                 # Faz as consultas (queries) no Supabase, via TanStack Query
        ├── dominio/               # As Entidades lógicas
        └── apresentacao/          # Editor Markdown, Lista de documentos (componentes React)
```

## 2. Como uma rota se conecta à sua Funcionalidade

Essa é a peça nova em relação ao Flutter: **um arquivo `page.tsx` dentro de `app/` nunca contém a lógica da tela** — ele só importa o componente pronto de dentro de `funcionalidades/` e o renderiza. Exemplo conceitual:

```tsx
// src/app/(autenticado)/documentos/page.tsx
import { ListaDeDocumentos } from '@/funcionalidades/documentos/apresentacao'

export default function DocumentosPage() {
  return <ListaDeDocumentos />
}
```

Isso preserva o benefício do Feature-First (tudo sobre "documentos" mora em `funcionalidades/documentos/`) e ao mesmo tempo respeita a exigência do Next.js de que rotas fiquem em `app/`.

## 3. Como as camadas de uma Funcionalidade funcionam?

Dentro de cada funcionalidade (ex: `documentos/`), continuamos aplicando os princípios da **Arquitetura Limpa (Clean Architecture)** separados em 3 camadas lógicas:

* **`apresentacao/`:** É onde ficam os Componentes React visuais e os hooks de estado (*Zustand* para UI, *TanStack Query* para dados). É a única camada que se importa com a cor do botão ou com o estado de "carregando".
* **`dominio/`:** Onde ficam os tipos/classes puras em TypeScript e as regras abstratas. Esta camada **não** sabe que o Supabase ou o Next.js existem.
* **`dados/`:** Onde o "trabalho sujo" acontece. É aqui que escrevemos os Repositórios que vão bater lá na internet (Supabase), buscar os dados no banco e transformar nas classes que a camada de `dominio/` entende.

> 💡 **Nota de Aprendizado (Mentoria):** dentro de `apresentacao/`, alguns componentes vão precisar ser marcados explicitamente como `'use client'` (Client Components — interativos, rodam no navegador, podem usar Zustand/estado) enquanto outros podem ficar como Server Components por padrão (renderizados na Vercel, sem interatividade). Essa distinção é conceitualmente nova em relação ao Flutter Web, onde tudo rodava no navegador. Vamos entender isso na prática quando começarmos a escrever componentes de verdade — por ora, basta saber que ela existe.

## 4. Benefício de Mercado

Se amanhã você precisar arrumar um bug na **Tela de Login**, você não precisa abrir 5 pastas diferentes espalhadas pelo projeto. Você vai direto na pasta `funcionalidades/autenticacao/` e quase todos os arquivos relacionados ao login estarão lá dentro — a única exceção é o arquivo de rota em `app/login/page.tsx`, que é só uma "porta de entrada" fina apontando pra lá.
