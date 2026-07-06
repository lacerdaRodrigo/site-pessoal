# Casos de Teste (E2E) — Autenticação

Casos de teste E2E (End-to-End) da funcionalidade de Autenticação (RF01 — ver `docs/01-arquitetura/03-requisitos-funcionais.md`). Um navegador real (Playwright/Chromium) abre a aplicação e simula a jornada completa do usuário. Rodam contra o **deploy real na Vercel**, não contra `localhost` (ADR 10, `docs/01-arquitetura/06-decisoes-tecnicas.md`). Código em `testes-e2e/autenticacao.spec.ts`.

Cada caso tem um ID (`CT-XX`) que aparece também no nome do teste automatizado correspondente, para rastrear um lado no outro.

---

## CT-10 — Cadastro com e-mail já confirmado não revela duplicidade
- **Pré-condições:** Existe uma conta de teste com e-mail **já confirmado** (variável `E2E_EMAIL` em `.env.test.local`, fora do Git). Este caso reaproveita essa conta de propósito — como o Supabase nunca revela se um e-mail já existe (proteção "anti-enumeração", ver `docs/04-backend/01-supabase-e-seguranca.md`), repetir o cadastro não dispara e-mail novo nem consome o limite de 2 e-mails/hora do Supabase.
- **Passos:**
  1. Acessar `/cadastro`.
  2. Preencher com o e-mail já confirmado e qualquer senha válida.
  3. Clicar em "Cadastrar".
- **Resultado esperado:** Mensagem de sucesso aparece na tela, igual a um cadastro novo de verdade (nenhuma pista de que o e-mail já existe).

## CT-11 — Login com credenciais válidas mostra o usuário logado
- **Pré-condições:** Conta de teste confirmada (`E2E_EMAIL` / `E2E_SENHA` em `.env.test.local`).
- **Passos:**
  1. Acessar `/login`.
  2. Preencher e-mail e senha corretos.
  3. Clicar em "Entrar".
- **Resultado esperado:** Redirecionamento para `/`, exibindo "Logado como {e-mail}".

## CT-12 — Logout remove a sessão
- **Pré-condições:** Mesma conta de teste do CT-11; usuário precisa estar logado (o teste faz login antes de testar o logout).
- **Passos:**
  1. Fazer login (como no CT-11).
  2. Clicar em "Sair".
- **Resultado esperado:** Redirecionamento de volta para `/login`.

## CT-13 — Login com senha incorreta mostra erro
- **Pré-condições:** `E2E_EMAIL` definido (a senha usada no teste é sempre errada de propósito).
- **Passos:**
  1. Acessar `/login`.
  2. Preencher o e-mail de teste e uma senha errada.
  3. Clicar em "Entrar".
- **Resultado esperado:** Mensagem "E-mail ou senha incorretos." aparece na tela.

---

## Como rodar

```
npm run test:e2e
```

Precisa de um arquivo `.env.test.local` (fora do Git) com `E2E_EMAIL` e `E2E_SENHA` de uma conta já confirmada no Supabase. Sem esse arquivo, os testes são **pulados**, não falham.
