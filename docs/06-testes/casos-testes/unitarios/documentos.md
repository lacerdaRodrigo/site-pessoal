# Casos de Teste (Unitário) — Documentos

Casos de teste unitário da funcionalidade de Documentos (RF02 — ver `docs/01-arquitetura/03-requisitos-funcionais.md`). Testam as validações puras da camada `dominio/`, sem depender de rede, banco ou navegador. As regras espelham os `CHECK`s da migration `supabase/migrations/20260707120200_criar_tabela_documentos.sql`, para barrar entrada inválida com mensagem amigável antes de chegar ao banco. Código em `src/funcionalidades/documentos/dominio/documento.test.ts`.

Cada caso tem um ID (`CT-XX`) que aparece também no nome do teste automatizado correspondente, para rastrear um lado no outro.

---

## CT-27 — Título comum é aceito
- **Pré-condições:** Nenhuma (função pura).
- **Passos:** Chamar `tituloValido("Prompt para gerar testes")`.
- **Resultado esperado:** Retorna `true`.

## CT-28 — Título vazio é rejeitado
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `tituloValido("")`.
- **Resultado esperado:** Retorna `false`.

## CT-29 — Título só com espaços é rejeitado
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `tituloValido("   ")` (apenas espaços).
- **Resultado esperado:** Retorna `false` (o `trim()` derruba os espaços das pontas).

## CT-30 — Título com exatamente 255 caracteres é aceito (fronteira)
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `tituloValido()` com um texto de exatamente 255 caracteres.
- **Resultado esperado:** Retorna `true` (255 é o limite máximo permitido pelo banco).

## CT-31 — Título com 256 caracteres é rejeitado (fronteira)
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `tituloValido()` com um texto de 256 caracteres (um acima do limite).
- **Resultado esperado:** Retorna `false`.

## CT-32 — Conteúdo com texto é aceito
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `conteudoValido("SELECT * FROM documentos;")`.
- **Resultado esperado:** Retorna `true`.

## CT-33 — Conteúdo vazio é rejeitado
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `conteudoValido("")`.
- **Resultado esperado:** Retorna `false` (decisão de exigir corpo no documento).

## CT-34 — Conteúdo só com espaços é rejeitado
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `conteudoValido("   ")` (apenas espaços).
- **Resultado esperado:** Retorna `false`.

## CT-41 — Copiar extrai só o conteúdo do bloco de código (RF02.5.1)
- **Pré-condições:** Nenhuma (função pura).
- **Passos:** Chamar `extrairCodigoParaCopiar()` com um Markdown que tem texto ao redor e um bloco ```` ```sql ... ``` ````.
- **Resultado esperado:** Retorna apenas o código de dentro do bloco (sem as cercas, sem a linguagem, sem o texto ao redor).

## CT-42 — Copiar junta vários blocos de código
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `extrairCodigoParaCopiar()` com um Markdown que tem dois blocos de código e texto entre eles.
- **Resultado esperado:** Retorna o conteúdo dos dois blocos concatenados (separados por linha em branco), ignorando o texto ao redor.

## CT-43 — Sem bloco de código, copia o texto completo (RF02.5.2)
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `extrairCodigoParaCopiar()` com um texto sem nenhum bloco de código.
- **Resultado esperado:** Retorna o texto completo, sem alteração (fallback).

---

## Como rodar

```
npm run test
```

Não precisa de nada além do ambiente já configurado (validações puras, sem rede).
