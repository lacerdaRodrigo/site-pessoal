# Casos de Teste (Unitário) — Autenticação

Casos de teste unitário da funcionalidade de Autenticação (RF01 — ver `docs/01-arquitetura/03-requisitos-funcionais.md`). Testam funções isoladas da camada `dominio/`, sem depender de rede, banco ou navegador. Código em `src/funcionalidades/autenticacao/dominio/validacoes.test.ts` e `src/nucleo/supabase/conexao.test.ts`.

Cada caso tem um ID (`CT-XX`) que aparece também no nome do teste automatizado correspondente, para rastrear um lado no outro.

---

## CT-01 — E-mail bem formado é aceito
- **Pré-condições:** Nenhuma (função pura).
- **Passos:** Chamar `emailValido("rodrigo@example.com")`.
- **Resultado esperado:** Retorna `true`.

## CT-02 — E-mail sem "@" é rejeitado
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `emailValido("rodrigo-em-example.com")`.
- **Resultado esperado:** Retorna `false`.

## CT-03 — E-mail sem domínio é rejeitado
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `emailValido("rodrigo@")`.
- **Resultado esperado:** Retorna `false`.

## CT-04 — Senha com 8 caracteres é aceita (RF01.1.1)
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `senhaValida("12345678")` (exatamente 8 caracteres).
- **Resultado esperado:** Retorna `true`.

## CT-05 — Senha com menos de 8 caracteres é rejeitada (RF01.1.1)
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `senhaValida("1234567")` (7 caracteres).
- **Resultado esperado:** Retorna `false`.

## CT-06 — Conexão com o Supabase está de pé
- **Observação:** único caso desta pasta que fala com um serviço real (sem mock) — confirma que as credenciais do `.env.local` apontam para um projeto Supabase ativo.
- **Pré-condições:** `.env.local` com `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` válidos.
- **Passos:** Fazer uma requisição HTTP para `{URL}/auth/v1/health`.
- **Resultado esperado:** Resposta HTTP `200`.

---

## Como rodar

```
npm run test
```

Não precisa de nada além do `.env.local` já configurado.
