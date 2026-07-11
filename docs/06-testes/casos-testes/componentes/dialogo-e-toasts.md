# Casos de Teste (Componente) — Diálogo de Confirmação e Toasts

Casos de teste dos dois componentes de feedback reutilizáveis em `src/nucleo/componentes/`:

- **`DialogoConfirmacao`** — modal do próprio app que substitui o `confirm()` nativo em ações destrutivas (spec telas 2.5 · RF02.4). Código em `DialogoConfirmacao.test.tsx`.
- **`Toasts`** — aviso de sucesso mostrado depois de uma Server Action que redireciona (criar/salvar/excluir documento — spec telas seção 3). A mensagem viaja no parâmetro `?aviso=` da URL de destino; o componente lê, exibe e limpa a URL. Código em `Toasts.test.tsx`.

Cada caso tem um ID (`CT-XX`) que aparece também no nome do teste automatizado correspondente.

---

## CT-93 — DialogoConfirmacao: fechado não renderiza; aberto mostra o conteúdo e confirma
- **Pré-condições:** `DialogoConfirmacao` renderizado com `aberto={false}`.
- **Passos:** Verificar que não há diálogo; reabrir com `aberto`; clicar no botão de confirmar.
- **Resultado esperado:** Com `aberto={false}` não existe `role="dialog"`. Com `aberto`, aparecem o título e a mensagem, e o clique em confirmar chama `onConfirmar` uma vez, sem chamar `onCancelar`.

## CT-94 — DialogoConfirmacao: cancelar, clicar no fundo e Esc chamam onCancelar
- **Pré-condições:** `DialogoConfirmacao` com `aberto`.
- **Passos:** Clicar no botão "Cancelar", clicar no fundo escurecido e pressionar Esc.
- **Resultado esperado:** `onCancelar` é chamado três vezes (uma por gesto). Os três caminhos de fechamento funcionam.

## CT-95 — Toasts: mostra a mensagem do ?aviso= e limpa a URL
- **Pré-condições:** URL com `?aviso=excluido`.
- **Passos:** Renderizar `Toasts`.
- **Resultado esperado:** Aparece um `role="status"` com "Documento excluído." e o `router.replace` é chamado para a rota sem o parâmetro (`/documentos`), evitando que o toast reapareça ao recarregar.

## CT-96 — Toasts: sem um ?aviso= conhecido, não renderiza nada
- **Pré-condições:** URL sem `aviso` (ou com um código desconhecido).
- **Passos:** Renderizar `Toasts`.
- **Resultado esperado:** Nenhum `role="status"` na tela e o `router.replace` não é chamado.

---

## Como rodar

```
npm run test
```

Não precisa de rede nem banco (rota e router do Next são mockados).
