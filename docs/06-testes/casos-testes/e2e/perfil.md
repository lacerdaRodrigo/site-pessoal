# Casos de Teste (E2E) — Perfil e Configurações

Casos de teste E2E da tela de Configurações/Perfil. Um navegador real (Playwright/Chromium) faz login, acessa `/configuracoes`, atualiza o nome de exibição e valida a persistência do tema. Código em `testes-e2e/perfil.spec.ts`.

Cada caso tem um ID (`CT-XX`) que aparece também no nome do teste automatizado correspondente, para rastrear um lado no outro.

---

## CT-69 — Atualizar nome e persistir preferência de tema
- **Pré-condições:** Conta de teste confirmada (`E2E_EMAIL` / `E2E_SENHA` em `.env.test.local`). O deploy alvo precisa ter a rota `/configuracoes`.
- **Passos:**
  1. Fazer login com a conta de teste.
  2. Ir para `/configuracoes`.
  3. Conferir e-mail somente leitura.
  4. Alterar o nome de exibição e salvar.
  5. Conferir a mensagem "Perfil atualizado!".
  6. Selecionar o tema "Escuro".
  7. Recarregar a página.
- **Resultado esperado:** O nome permanece salvo no campo, o tema "Escuro" continua selecionado e o `<html>` está com `data-tema-resolvido="escuro"`.

---

## Como rodar

```
npm run test:e2e
```

Precisa de um `.env.test.local` com `E2E_EMAIL` e `E2E_SENHA`. Para validar código local antes do deploy, rode com `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000` enquanto o `npm run dev` estiver ativo.
