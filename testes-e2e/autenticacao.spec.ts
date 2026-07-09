import { test, expect } from "@playwright/test";

// Requer uma conta já existente e com e-mail confirmado, definida em
// .env.test.local (fora do Git, mesmo padrão do .env.local) como
// E2E_EMAIL / E2E_SENHA. Sem essas variáveis, os testes são pulados
// (não falham) — ver docs/06-testes/casos-testes/e2e/autenticacao.md
// para o motivo de cada caso depender de uma conta pré-existente.
const email = process.env.E2E_EMAIL;
const senha = process.env.E2E_SENHA;

test.describe("Autenticação", () => {
  test("CT-11: login com credenciais válidas mostra o usuário logado", async ({
    page,
  }) => {
    test.skip(!email || !senha, "Defina E2E_EMAIL e E2E_SENHA em .env.test.local");

    await page.goto("/login");
    await page.getByLabel("E-mail").fill(email!);
    await page.getByLabel("Senha").fill(senha!);
    await page.getByRole("button", { name: "Entrar" }).click();

    // Após o login, a home ("/") redireciona para /inicio (o Dashboard da área
    // autenticada), cuja sidebar exibe o e-mail do usuário.
    await expect(page).toHaveURL(/\/inicio/);
    await expect(page.getByText(email!)).toBeVisible();
  });

  test("CT-12: logout remove a sessão e volta para /login", async ({ page }) => {
    test.skip(!email || !senha, "Defina E2E_EMAIL e E2E_SENHA em .env.test.local");

    await page.goto("/login");
    await page.getByLabel("E-mail").fill(email!);
    await page.getByLabel("Senha").fill(senha!);
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page.getByText(email!)).toBeVisible();

    await page.getByRole("button", { name: "Sair" }).click();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("CT-13: login com senha incorreta mostra mensagem de erro", async ({
    page,
  }) => {
    test.skip(!email, "Defina E2E_EMAIL em .env.test.local");

    await page.goto("/login");
    await page.getByLabel("E-mail").fill(email!);
    await page.getByLabel("Senha").fill("senha-errada-123");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByText("E-mail ou senha incorretos.")).toBeVisible();
  });

  test("CT-10: cadastro com e-mail já confirmado não revela duplicidade (anti-enumeração)", async ({
    page,
  }) => {
    test.skip(!email, "Defina E2E_EMAIL em .env.test.local");

    await page.goto("/cadastro");
    await page.getByLabel("E-mail").fill(email!);
    await page.getByLabel("Senha").fill("outraSenhaQualquer123");
    await page.getByRole("button", { name: "Cadastrar" }).click();

    await expect(page.getByText(/verifique seu e-mail/i)).toBeVisible();
  });
});
