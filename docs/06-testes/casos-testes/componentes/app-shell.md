# Casos de Teste (Componente) — App Shell (sidebar + gaveta mobile)

Casos de teste do `AppShell` (`src/nucleo/componentes/AppShell.tsx`), a casca da área autenticada: sidebar no desktop e, abaixo de 768px, uma gaveta (drawer) que abre por um botão ☰ (RNF02.3 — ver `docs/01-arquitetura/04-requisitos-nao-funcionais.md`). O teste foca o comportamento de abrir/fechar; rota, logout e seletor de tema são stubados. Código em `src/nucleo/componentes/AppShell.test.tsx`.

Cada caso tem um ID (`CT-XX`) que aparece também no nome do teste automatizado correspondente.

---

## CT-89 — Começa fechado e abre a gaveta ao clicar no ☰ (RNF02.3)
- **Pré-condições:** `AppShell` renderizado.
- **Passos:** Verificar o estado inicial e clicar no botão "Abrir menu" (☰).
- **Resultado esperado:** No início, o botão "Abrir menu" tem `aria-expanded="false"` e não existe o botão "Fechar menu" (overlay). Após o clique, `aria-expanded` vira `"true"` e o overlay "Fechar menu" aparece.

## CT-90 — Clicar no overlay fecha a gaveta
- **Pré-condições:** `AppShell` com a gaveta aberta.
- **Passos:** Abrir a gaveta e clicar no overlay "Fechar menu".
- **Resultado esperado:** O overlay some e o botão "Abrir menu" volta a `aria-expanded="false"`.

---

## Como rodar

```
npm run test
```

Não precisa de rede nem banco (rota, logout e tema são mockados).
