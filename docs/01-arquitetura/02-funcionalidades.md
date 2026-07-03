# Arquitetura — Catálogo de Funcionalidades

Antes de detalharmos os Requisitos Funcionais numerados (documento `03-requisitos-funcionais.md`), este documento serve como um "mapa" mais visual: ele conecta cada funcionalidade planejada do MVP à sua futura pasta de código (seguindo a estrutura Feature-First definida em `docs/03-frontend/01-estrutura-de-pastas.md`).

> 💡 **Nota de Aprendizado (Mentoria):** Pense neste documento como a "ponte" entre o que o Produto promete (README) e o que o Código vai entregar (pasta `funcionalidades/`). Cada linha da tabela abaixo, no futuro, vira uma pasta dentro de `src/funcionalidades/`. Os nomes exatos das rotas em `src/app/` (obrigatórias pelo Next.js) serão detalhados quando chegarmos ao Módulo 03.

## 1. Mapa de Funcionalidades x Código

| Funcionalidade | Descrição Resumida | Pasta em `src/funcionalidades/` |
|---|---|---|
| Autenticação | Criar conta, login, logout e recuperação de senha via Supabase Auth. | `autenticacao/` |
| Painel Inicial (Dashboard) | Tela de entrada com visão geral: últimos documentos editados e estatísticas rápidas (total de documentos, categorias). | `painel-inicial/` |
| Gestão de Documentos | CRUD completo de anotações/prompts, com editor Markdown. | `documentos/` |
| Categorias e Etiquetas (Tags) | Organizar documentos em categorias (pastas macro) e etiquetas (tags livres). | `categorias/` (a criar) |
| Busca | Pesquisa global por título/conteúdo dos documentos. | Pode viver dentro de `documentos/` ou virar sua própria pasta `busca/`, a decidir quando o código nascer. |
| Favoritos | Marcar documentos como favoritos para acesso rápido. | Reaproveita `documentos/` (é um campo `e_favorito`, não uma tela nova). |
| Perfil e Configurações | Editar dados básicos do usuário e preferências (ex: tema claro/escuro). | `perfil/` (a criar) |

## 2. Por que separar "Funcionalidades" de "Requisitos Funcionais"?

São dois níveis de detalhe diferentes, e ambos têm valor:
- **Este documento (`02-funcionalidades.md`):** Visão de produto/arquitetura — "quais blocos de funcionalidade existem e onde moram no código".
- **`03-requisitos-funcionais.md`:** Visão de especificação — "o que exatamente o sistema deve fazer, item por item, numerado (RF01.1, RF01.2...)", útil para escrever casos de teste e critérios de aceite.

## 3. Fora do MVP (mas mapeado para o futuro)

Categorias e Perfil ainda não têm pasta formal na estrutura Feature-First porque a estrutura atual (ver `03-frontend/01-estrutura-de-pastas.md`) só detalha `autenticacao/`, `painel_inicial/` e `documentos/`. Isso é um ponto em aberto: quando começarmos a codificar essas telas, devemos voltar neste documento e no de estrutura de pastas para adicioná-las oficialmente.
