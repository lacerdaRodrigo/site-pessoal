import { test, expect } from "@playwright/test";

// Jornada real da tela de Configurações/Perfil. Usa a mesma conta confirmada
// dos testes de autenticação (E2E_EMAIL / E2E_SENHA). Sem credenciais, pula.
const email = process.env.E2E_EMAIL;
const senha = process.env.E2E_SENHA;

test.describe("Perfil e Configurações", () => {
  test("CT-69: atualiza nome e persiste a preferência de tema", async ({
    page,
  }) => {
    test.skip(!email || !senha, "Defina E2E_EMAIL e E2E_SENHA em .env.test.local");

    const nome = `Rodrigo E2E ${Date.now()}`;

    await page.goto("/login");
    await page.getByLabel("E-mail").fill(email!);
    await page.getByLabel("Senha").fill(senha!);
    await page.getByRole("button", { name: "Entrar" }).click();
    // Login leva à área autenticada; a sidebar mostra o e-mail.
    await expect(page.getByText(email!)).toBeVisible();

    await page.goto("/configuracoes");
    await expect(
      page.getByRole("heading", { name: "Configurações" }),
    ).toBeVisible();
    await expect(page.getByLabel("E-mail")).toHaveValue(email!);

    await page.getByLabel("Nome de exibição").fill(nome);
    await page.getByRole("button", { name: "Salvar" }).click();
    await expect(page.getByText("Perfil atualizado!")).toBeVisible();

    await page.getByRole("main").getByRole("radio", { name: "Escuro" }).click();
    await expect(page.getByRole("main").getByRole("radio", { name: "Escuro" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await expect(page.locator("html")).toHaveAttribute(
      "data-tema-resolvido",
      "escuro",
    );

    await page.reload();

    await expect(page.getByLabel("Nome de exibição")).toHaveValue(nome);
    await expect(page.getByRole("main").getByRole("radio", { name: "Escuro" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });
});
