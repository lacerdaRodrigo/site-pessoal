# Casos de Teste (E2E) — Documentos

Casos de teste E2E (End-to-End) da funcionalidade de Documentos (RF02/RF03 — ver `docs/01-arquitetura/03-requisitos-funcionais.md`). Um navegador real (Playwright/Chromium) faz a jornada completa do usuário contra o **deploy real na Vercel** (ADR 10). Código em `testes-e2e/documentos.spec.ts`.

Cada caso tem um ID (`CT-XX`) que aparece também no nome do teste automatizado correspondente, para rastrear um lado no outro.

---

## CT-40 — Jornada completa: criar (com categoria), favoritar, editar, buscar e excluir
- **Pré-condições:** Conta de teste confirmada (`E2E_EMAIL` / `E2E_SENHA` em `.env.test.local`, fora do Git). O deploy alvo já precisa ter a área autenticada de Documentos com categorias, favoritos e busca.
- **Passos:**
  1. Fazer login com a conta de teste (a home leva à área autenticada, cuja sidebar mostra o e-mail).
  2. Ir em `/documentos` e clicar em "+ Novo documento".
  3. Preencher título (único, com timestamp), **categoria** (única, RF03.1) e conteúdo; clicar em "Criar documento".
  4. Na tela de **leitura**, conferir que o título aparece como cabeçalho, a **categoria** aparece e o conteúdo é renderizado.
  5. Clicar em "Adicionar aos favoritos" (RF03.3) e conferir que a estrela vira "Remover dos favoritos".
  6. Clicar em "Editar", alterar o conteúdo, **adicionar uma etiqueta** e clicar em "Salvar alterações"; conferir o conteúdo atualizado na leitura.
  7. Voltar para `/documentos` e **buscar** (RF03.2) três vezes — por **título**, por uma palavra só do **conteúdo** e pelo nome da **etiqueta** — conferindo em cada uma que o documento aparece no resultado.
  8. Abrir o documento e clicar em "Excluir": conferir que abre o `DialogoConfirmacao` (não o `confirm()` nativo) e clicar no "Excluir" **do modal** para confirmar (RF02.4).
- **Resultado esperado:** Após a exclusão, volta para a lista (`/documentos`), um **toast** "Documento excluído." é exibido e o documento criado **não** aparece mais. O teste é auto-limpante: como cria e apaga o mesmo documento, não deixa resíduo no banco.

---

## Como rodar

```
npm run test:e2e
```

Precisa de um `.env.test.local` (fora do Git) com `E2E_EMAIL` e `E2E_SENHA` de uma conta já confirmada no Supabase. Sem esse arquivo, o teste é **pulado**, não falha.

**No CI:** roda automaticamente após cada deploy da Vercel (workflow `.github/workflows/e2e.yml`, gatilho `deployment_status`), usando os secrets `E2E_EMAIL`/`E2E_SENHA` do repositório.
