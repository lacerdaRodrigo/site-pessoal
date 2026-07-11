# Casos de Teste (Componente) — Transição de Tela

Caso de teste do `TransicaoDeTela` (`src/nucleo/componentes/TransicaoDeTela.tsx`), o wrapper que dá um fade de entrada a cada troca de tela na área autenticada (spec telas 3 — ver `docs/05-ui-ux/03-telas-e-componentes.md`). Ele apenas repassa o conteúdo dentro de um elemento com `key` na rota atual; o efeito visual em si é CSS (`@keyframes`, respeitando `prefers-reduced-motion`) e não é testável em jsdom. O teste garante que o wrapper não engole o conteúdo. Código em `src/nucleo/componentes/TransicaoDeTela.test.tsx`.

Cada caso tem um ID (`CT-XX`) que aparece também no nome do teste automatizado correspondente.

---

## CT-105 — Renderiza o conteúdo da tela dentro do wrapper de transição
- **Pré-condições:** `TransicaoDeTela` renderizado com um parágrafo dentro (rota atual stubada).
- **Passos:** Renderizar o componente com um conteúdo filho.
- **Resultado esperado:** O conteúdo filho aparece normalmente na tela (o wrapper é transparente para o conteúdo).

---

## Como rodar

```
npm run test
```

Não precisa de rede nem banco (a rota atual é mockada).
