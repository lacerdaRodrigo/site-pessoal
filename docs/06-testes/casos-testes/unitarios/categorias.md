# Casos de Teste (Unitário) — Categorias

Casos de teste unitário da funcionalidade de Categorias (RF03.1 — ver `docs/01-arquitetura/03-requisitos-funcionais.md`). Testam as regras puras da camada `dominio/`, sem depender de rede, banco ou navegador. As regras espelham o `CHECK` da migration `supabase/migrations/20260707120100_criar_tabela_categorias.sql` (`nome` não-vazio), com um teto de tamanho adicional da aplicação (60 caracteres). Código em `src/funcionalidades/categorias/dominio/categoria.test.ts`.

Cada caso tem um ID (`CT-XX`) que aparece também no nome do teste automatizado correspondente, para rastrear um lado no outro.

---

## CT-70 — Nome de categoria comum é aceito
- **Pré-condições:** Nenhuma (função pura).
- **Passos:** Chamar `nomeCategoriaValido("Banco de Dados")`.
- **Resultado esperado:** Retorna `true`.

## CT-71 — Nome vazio ou só de espaços é rejeitado
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `nomeCategoriaValido("")` e `nomeCategoriaValido("   ")`.
- **Resultado esperado:** Retorna `false` nos dois (o `trim()` derruba os espaços das pontas).

## CT-72 — Nome com exatamente 60 caracteres é aceito (fronteira)
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `nomeCategoriaValido()` com um texto de exatamente 60 caracteres.
- **Resultado esperado:** Retorna `true` (60 é o limite da aplicação).

## CT-73 — Nome com 61 caracteres é rejeitado (fronteira)
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `nomeCategoriaValido()` com um texto de 61 caracteres (um acima do limite).
- **Resultado esperado:** Retorna `false`.

## CT-74 — Normalizar apara espaços e mantém o vazio como vazio
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `normalizarNomeCategoria("  Git  ")` e `normalizarNomeCategoria("   ")`.
- **Resultado esperado:** Retorna `"Git"` no primeiro e `""` no segundo (o vazio sinaliza "sem categoria" para quem chama).

## CT-102 — Cor da categoria é determinística e sempre da paleta (telas 1/2.4)
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `corDaCategoria("Git")` duas vezes.
- **Resultado esperado:** As duas chamadas devolvem a mesma cor (determinística) e essa cor pertence a `PALETA_CATEGORIAS`.

## CT-103 — Cor ignora espaços/maiúsculas e distribui entre nomes
- **Pré-condições:** Nenhuma.
- **Passos:** Comparar `corDaCategoria("  git  ")` com `corDaCategoria("Git")`; mapear um punhado de nomes distintos para cores.
- **Resultado esperado:** `"  git  "` e `"Git"` dão a mesma cor (normaliza e ignora caixa); um conjunto de nomes diferentes produz mais de uma cor (não colapsa tudo numa só).

---

## Como rodar

```
npm run test
```

Não precisa de nada além do ambiente já configurado (regras puras, sem rede).
