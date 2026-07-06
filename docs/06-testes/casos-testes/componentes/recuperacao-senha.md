# Casos de Teste (Componente) — Recuperação de Senha

Casos de teste de componente da funcionalidade de Recuperação de Senha (RF01.4 — ver `docs/01-arquitetura/03-requisitos-funcionais.md`). Código em `src/funcionalidades/autenticacao/apresentacao/FormularioEsqueciSenha.test.tsx` e `FormularioRedefinirSenha.test.tsx`.

---

## CT-15 — Solicitar redefinição exibe mensagem genérica de sucesso
- **Pré-condições:** A Server Action `solicitarRedefinicaoSenha` é substituída por um mock que devolve sucesso.
- **Passos:**
  1. Renderizar `<FormularioEsqueciSenha />`.
  2. Preencher o e-mail.
  3. Clicar em "Enviar link de redefinição".
- **Resultado esperado:** Mensagem "Se esse e-mail existir na nossa base, enviamos um link..." aparece na tela — **sempre a mesma mensagem**, exista ou não o e-mail (mesma proteção anti-enumeração do cadastro, CT-10).

## CT-16 — Solicitar redefinição exibe erro quando a Server Action falha
- **Pré-condições:** A Server Action `solicitarRedefinicaoSenha` é substituída por um mock que devolve erro.
- **Passos:**
  1. Renderizar `<FormularioEsqueciSenha />`.
  2. Preencher e enviar.
- **Resultado esperado:** Mensagem de erro aparece na tela (`role="alert"`).

## CT-17 — Redefinir senha exibe erro quando a nova senha é fraca
- **Pré-condições:** A Server Action `redefinirSenha` é substituída por um mock que devolve erro.
- **Passos:**
  1. Renderizar `<FormularioRedefinirSenha />`.
  2. Preencher uma senha com menos de 8 caracteres.
  3. Clicar em "Salvar nova senha".
- **Resultado esperado:** Mensagem "A senha precisa ter pelo menos 8 caracteres." aparece na tela.

## CT-18 — Campo de nova senha exige 8 caracteres
- **Pré-condições:** Nenhuma.
- **Passos:** Renderizar `<FormularioRedefinirSenha />` e inspecionar o campo.
- **Resultado esperado:** O campo tem `required` e `minLength="8"`.

---

## Como rodar

```
npm run test
```
