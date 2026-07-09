# Casos de Teste (Unitário) — Etiquetas

Casos de teste unitário da funcionalidade de Etiquetas (tags — ver `docs/02-banco-de-dados/01-entidades.md`). Testam as regras puras da camada `dominio/`, sem depender de rede, banco ou navegador. As regras espelham o `CHECK` da migration `supabase/migrations/20260707120300_criar_tabelas_etiquetas.sql` (`nome` não-vazio), com um teto de tamanho adicional da aplicação (40 caracteres) e a normalização do "#" que o usuário costuma digitar. Código em `src/funcionalidades/etiquetas/dominio/etiqueta.test.ts`.

Cada caso tem um ID (`CT-XX`) que aparece também no nome do teste automatizado correspondente, para rastrear um lado no outro.

---

## CT-79 — Normalizar apara espaços e remove o "#" inicial
- **Pré-condições:** Nenhuma (função pura).
- **Passos:** Chamar `normalizarNomeEtiqueta("  #dart  ")`, `normalizarNomeEtiqueta("testes")` e `normalizarNomeEtiqueta("   ")`.
- **Resultado esperado:** `"dart"`, `"testes"` e `""` (o "#" é enfeite, então "#dart" e "dart" viram a mesma etiqueta).

## CT-80 — Nome comum é aceito (com ou sem "#")
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `nomeEtiquetaValido("testes")` e `nomeEtiquetaValido("#dart")`.
- **Resultado esperado:** Retorna `true` nos dois.

## CT-81 — Nome vazio, só de espaços ou só "#" é rejeitado
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `nomeEtiquetaValido("")`, `nomeEtiquetaValido("   ")` e `nomeEtiquetaValido("#")`.
- **Resultado esperado:** Retorna `false` nos três (após normalizar, sobra vazio).

## CT-82 — Tamanho no limite é aceito e um além é rejeitado (fronteira)
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `nomeEtiquetaValido()` com 40 e com 41 caracteres.
- **Resultado esperado:** `true` para 40 (limite da aplicação) e `false` para 41.

## CT-83 — Separar por vírgula, normalizar e descartar vazios
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `separarEtiquetas("#dart, testes ,, ")`.
- **Resultado esperado:** Retorna `["dart", "testes"]` (vazios entre vírgulas são ignorados).

## CT-84 — Remover duplicatas case-insensitive (mantém a 1ª grafia)
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `separarEtiquetas("Dart, dart, DART")`.
- **Resultado esperado:** Retorna `["Dart"]` (espelha o índice único `lower(trim(nome))` do banco; guarda a grafia que o usuário digitou primeiro).

## CT-85 — Descartar nomes acima do tamanho máximo
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `separarEtiquetas("ok, <41 caracteres>")`.
- **Resultado esperado:** Retorna `["ok"]` (o nome grande demais é filtrado antes de ir ao banco).

## CT-86 — Juntar etiquetas é o inverso de separar
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `juntarEtiquetas([{nome:"dart"}, {nome:"testes"}])`.
- **Resultado esperado:** Retorna `"dart, testes"` (usado para preencher o formulário na edição).

---

## Como rodar

```
npm run test
```

Não precisa de nada além do ambiente já configurado (regras puras, sem rede).
