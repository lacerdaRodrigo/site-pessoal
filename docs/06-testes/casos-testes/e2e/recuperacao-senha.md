# Casos de Teste (E2E) — Recuperação de Senha

Casos de teste E2E da funcionalidade de Recuperação de Senha (RF01.4). Código em `testes-e2e/recuperacao-senha.spec.ts`.

---

## CT-19 — Link "Esqueceu a senha?" leva para /esqueci-senha
- **Pré-condições:** Nenhuma.
- **Passos:**
  1. Acessar `/login`.
  2. Clicar no link "Esqueceu a senha?".
- **Resultado esperado:** Navega para `/esqueci-senha`, exibindo o título "Esqueci minha senha".

## CT-20 — Link de confirmação com token inválido redireciona para /login com erro
- **Pré-condições:** Nenhuma.
- **Passos:** Acessar diretamente `/auth/confirm?token_hash=token-invalido&type=recovery&next=/redefinir-senha`.
- **Resultado esperado:** Redirecionamento para `/login?erro=link-invalido` (a rota de callback em `src/app/auth/confirm/route.ts` chama `verifyOtp`, que falha para um token inválido).

## CT-21 — Ciclo completo de redefinição de senha (Manual)
- **Tipo:** **Manual** — não automatizado. Validar o ciclo completo exigiria ler uma caixa de entrada de e-mail real dentro do teste, o que não está configurado (o Supabase, sem SMTP customizado, também tem limite de 2 e-mails/hora — ver `docs/04-backend/01-supabase-e-seguranca.md` — o que tornaria a suíte automatizada frágil).
- **Pré-condições:** Ter acesso a uma conta de teste confirmada e à caixa de entrada dela.
- **Passos:**
  1. Acessar `/esqueci-senha`, informar o e-mail da conta de teste, enviar.
  2. Abrir o e-mail recebido e clicar no link de redefinição.
  3. Confirmar que a página `/redefinir-senha` é exibida (a rota `/auth/confirm` deve ter estabelecido a sessão de recovery e redirecionado pra cá).
  4. Preencher uma nova senha (8+ caracteres) e clicar em "Salvar nova senha".
  5. Confirmar redirecionamento para `/login`.
  6. Fazer login com a **nova** senha.
- **Resultado esperado:** Login bem-sucedido com a nova senha; a senha antiga deixa de funcionar.
- **Quando rodar:** sempre que o fluxo de recuperação de senha for alterado (template de e-mail, rota de callback, ou as Server Actions `solicitarRedefinicaoSenha`/`redefinirSenha`).

---

## Como rodar (CT-19 e CT-20)

```
npm run test:e2e
```

Não precisam de `.env.test.local` (não dependem de uma conta pré-existente).

**No CI:** também rodam automaticamente após cada deploy da Vercel (workflow `.github/workflows/e2e.yml`, gatilho `deployment_status` — ver `docs/07-deploy/01-ambientes-e-pipeline.md`, seção 7).
