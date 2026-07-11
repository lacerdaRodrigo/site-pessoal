# Casos de Teste (Componente) — Menu de Ações (⋯)

Casos de teste do `MenuAcoes` (`src/nucleo/componentes/MenuAcoes.tsx`), o menu "⋯" de ações contextuais dos itens da lista (spec telas 2.4 — ver `docs/05-ui-ux/03-telas-e-componentes.md`). É genérico: recebe uma lista de ações e o que cada uma faz; ações destrutivas usam a variante "perigo". O teste foca abrir/fechar e o disparo da ação escolhida. Código em `src/nucleo/componentes/MenuAcoes.test.tsx`.

Cada caso tem um ID (`CT-XX`) que aparece também no nome do teste automatizado correspondente.

---

## CT-98 — Começa fechado; abrir e escolher uma ação chama o callback e fecha
- **Pré-condições:** `MenuAcoes` com um item "Excluir".
- **Passos:** Verificar que não há menu; clicar no gatilho "⋯"; clicar em "Excluir".
- **Resultado esperado:** No início não existe `role="menu"`. Após clicar no gatilho, o menu aparece. Ao escolher "Excluir", o callback da ação é chamado uma vez e o menu fecha.

## CT-99 — Esc fecha o menu sem escolher nenhuma ação
- **Pré-condições:** `MenuAcoes` com o menu aberto.
- **Passos:** Abrir o menu e pressionar Esc.
- **Resultado esperado:** O menu fecha e nenhum callback de ação é chamado.

---

## Como rodar

```
npm run test
```

Não precisa de rede nem banco.
