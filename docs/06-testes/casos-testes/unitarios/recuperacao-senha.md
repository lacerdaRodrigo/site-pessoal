# Casos de Teste (Unitário) — Recuperação de Senha

Casos de teste unitário nascidos do fluxo de Recuperação de Senha (RF01.4 — ver `docs/01-arquitetura/03-requisitos-funcionais.md`). Testam a função `caminhoInternoSeguro`, que protege a rota de callback `/auth/confirm` contra **Open Redirect** — ela valida o parâmetro `?next=` do link do e-mail e só aceita caminhos internos da aplicação (qualquer coisa suspeita cai no fallback `/`). A função vive em `src/nucleo/seguranca/redirecionamento.ts` (e não dentro da funcionalidade de autenticação) porque serve para qualquer redirect futuro que receba destino de fora. Código dos testes em `src/nucleo/seguranca/redirecionamento.test.ts`.

Cada caso tem um ID (`CT-XX`) que aparece também no nome do teste automatizado correspondente, para rastrear um lado no outro.

> 💡 **Contexto (por que isso é um risco):** sem essa validação, um link como `/auth/confirm?...&next=https://site-malicioso.com` redirecionaria o usuário para fora do nosso domínio ao final do fluxo — a página maliciosa poderia imitar a nossa tela de login e capturar a senha, com a vítima achando que nunca saiu do site legítimo (phishing por "trampolim confiável").

---

## CT-22 — Caminho interno é aceito
- **Pré-condições:** Nenhuma (função pura).
- **Passos:** Chamar `caminhoInternoSeguro("/redefinir-senha")`.
- **Resultado esperado:** Retorna `"/redefinir-senha"` (o próprio valor, sem alteração).

## CT-23 — URL absoluta para outro domínio é rejeitada
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `caminhoInternoSeguro("https://site-malicioso.com")`.
- **Resultado esperado:** Retorna `"/"` (fallback seguro).

## CT-24 — URL protocolo-relativa é rejeitada
- **Observação:** `//site-malicioso.com` não tem `https:`, mas o navegador completa com o protocolo da página atual e navega para o domínio externo do mesmo jeito.
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `caminhoInternoSeguro("//site-malicioso.com")`.
- **Resultado esperado:** Retorna `"/"`.

## CT-25 — Variação com barra invertida é rejeitada
- **Observação:** o parser de URL dos navegadores normaliza `/\` para `//`, então `/\site-malicioso.com` é um jeito clássico de burlar validações que só checam `//`.
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `caminhoInternoSeguro("/\\site-malicioso.com")`.
- **Resultado esperado:** Retorna `"/"`.

## CT-26 — Valor ausente cai no fallback
- **Pré-condições:** Nenhuma.
- **Passos:** Chamar `caminhoInternoSeguro(null)` (link sem o parâmetro `next`).
- **Resultado esperado:** Retorna `"/"`.

---

## Como rodar

```
npm run test
```

Não precisa de nada além do `.env.local` já configurado.
