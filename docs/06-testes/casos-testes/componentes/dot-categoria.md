# Casos de Teste (Componente) — Dot da Categoria

Caso de teste do `DotCategoria` (`src/nucleo/componentes/DotCategoria.tsx`), o quadradinho colorido de 8px que identifica a categoria no início da linha/card (spec telas 1/2.4 — ver `docs/05-ui-ux/03-telas-e-componentes.md`). É puramente visual: recebe a cor já resolvida (a lógica de qual cor cada categoria tem mora em `categorias/dominio` → `corDaCategoria`, coberta pelos casos unitários CT-102/CT-103). Código em `src/nucleo/componentes/DotCategoria.test.tsx`.

Cada caso tem um ID (`CT-XX`) que aparece também no nome do teste automatizado correspondente.

---

## CT-104 — Pinta o quadradinho com a cor recebida e some para leitores de tela
- **Pré-condições:** `DotCategoria` renderizado com `cor="#10b981"`.
- **Passos:** Renderizar o componente e inspecionar o elemento.
- **Resultado esperado:** O elemento tem `background-color` igual à cor recebida e `aria-hidden="true"` (é reforço visual; o nome da categoria vem como texto ao lado).

---

## Como rodar

```
npm run test
```

Não precisa de rede nem banco.
