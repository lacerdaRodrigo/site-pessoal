# Casos de Teste (Componente) — Autenticação

Casos de teste de componente da funcionalidade de Autenticação (RF01 — ver `docs/01-arquitetura/03-requisitos-funcionais.md`). Renderizam o componente React em memória (React Testing Library) e simulam clique/digitação — sem abrir navegador de verdade e sem falar com o Supabase real (a Server Action é substituída por `vi.mock()`, ver `docs/06-testes/01-estrategia-de-testes.md`, seção 2). Código em `src/funcionalidades/autenticacao/apresentacao/FormularioLogin.test.tsx` e `FormularioCadastro.test.tsx`.

Cada caso tem um ID (`CT-XX`) que aparece também no nome do teste automatizado correspondente, para rastrear um lado no outro.

---

## CT-07 — Login exibe erro quando a Server Action falha
- **Pré-condições:** A Server Action `entrar` é substituída por um mock que devolve erro (não fala com o Supabase de verdade).
- **Passos:**
  1. Renderizar `<FormularioLogin />`.
  2. Preencher e-mail e senha.
  3. Clicar em "Entrar".
- **Resultado esperado:** Mensagem "E-mail ou senha incorretos." aparece na tela (dentro de um elemento com papel de alerta, `role="alert"`, para leitores de tela).

## CT-08 — Cadastro exibe mensagem de sucesso
- **Pré-condições:** A Server Action `cadastrar` é substituída por um mock que devolve sucesso.
- **Passos:**
  1. Renderizar `<FormularioCadastro />`.
  2. Preencher e-mail e senha.
  3. Clicar em "Cadastrar".
- **Resultado esperado:** Mensagem "Cadastro realizado! Verifique seu e-mail..." aparece na tela.

## CT-09 — Cadastro exibe erro quando a Server Action falha
- **Pré-condições:** A Server Action `cadastrar` é substituída por um mock que devolve erro.
- **Passos:**
  1. Renderizar `<FormularioCadastro />`.
  2. Preencher e-mail e uma senha fraca.
  3. Clicar em "Cadastrar".
- **Resultado esperado:** Mensagem de erro aparece na tela (`role="alert"`).

## CT-14 — Formulário de login exige e-mail e senha
- **Pré-condições:** Nenhuma.
- **Passos:** Renderizar `<FormularioLogin />` e inspecionar os campos.
- **Resultado esperado:** Os campos de e-mail e senha têm o atributo HTML `required`.

---

## Como rodar

```
npm run test
```

Não precisa de nada além do `.env.local` já configurado (o mesmo comando roda os casos unitários e de componente juntos — ambos usam Vitest).
