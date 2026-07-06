import { test, expect } from "@playwright/test";

// O ciclo completo (pedir o link → abrir o e-mail de verdade → clicar →
// trocar a senha) não é automatizável aqui: exigiria ler uma caixa de
// entrada real, e o Supabase (sem SMTP customizado) tem limite de 2
// e-mails/hora (ver docs/04-backend/01-supabase-e-seguranca.md). Esse
// caminho fica como CT-21 (manual) em
// docs/06-testes/casos-testes/e2e/recuperacao-senha.md. Os dois testes
// abaixo cobrem o que dá pra validar sem depender de e-mail real.
test.describe("Recuperação de senha", () => {
  test("CT-19: link 'Esqueceu a senha?' no login leva para /esqueci-senha", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByRole("link", { name: "Esqueceu a senha?" }).click();

    await expect(page).toHaveURL(/\/esqueci-senha$/);
    await expect(
      page.getByRole("heading", { name: "Esqueci minha senha" }),
    ).toBeVisible();
  });

  test("CT-20: link de confirmação com token inválido redireciona para /login com erro", async ({
    page,
  }) => {
    await page.goto("/auth/confirm?token_hash=token-invalido&type=recovery&next=/redefinir-senha");

    await expect(page).toHaveURL(/\/login\?erro=link-invalido$/);
  });
});
