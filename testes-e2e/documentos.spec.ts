import { test, expect } from "@playwright/test";

// Jornada real do CRUD de Documentos (RF02). Roda contra o deploy na Vercel
// (ADR 10) e exige a mesma conta de teste confirmada do fluxo de auth
// (E2E_EMAIL / E2E_SENHA em .env.test.local). Sem essas variáveis, é pulado.
// O teste é auto-limpante: cria um documento com título único e o exclui no
// fim, então não deixa resíduo no banco.
const email = process.env.E2E_EMAIL;
const senha = process.env.E2E_SENHA;

test.describe("Documentos", () => {
  test("CT-40: jornada CRUD — criar, ver, editar e excluir um documento", async ({
    page,
  }) => {
    test.skip(!email || !senha, "Defina E2E_EMAIL e E2E_SENHA em .env.test.local");

    const titulo = `Documento E2E ${Date.now()}`;
    const categoria = `Cat E2E ${Date.now()}`;
    const etiqueta = `etiquetae2e${Date.now()}`;

    // Login (redireciona para /, que leva à área autenticada /inicio).
    await page.goto("/login");
    await page.getByLabel("E-mail").fill(email!);
    await page.getByLabel("Senha").fill(senha!);
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page.getByText(email!)).toBeVisible();

    // CRIAR (com categoria — RF03.1). "+ Novo documento" existe na sidebar e no
    // topo da lista; usamos o da área principal (getByRole("main")).
    await page.goto("/documentos");
    await page
      .getByRole("main")
      .getByRole("link", { name: "+ Novo documento" })
      .click();
    await page.getByLabel("Título do documento").fill(titulo);
    await page.getByLabel("Categoria").fill(categoria);
    await page
      .getByLabel("Conteúdo do documento")
      .fill("Conteúdo inicial do teste E2E.");
    await page.getByRole("button", { name: "Criar documento" }).click();

    // Após criar, cai na LEITURA: título como cabeçalho, categoria e conteúdo.
    await expect(page.getByRole("heading", { name: titulo })).toBeVisible();
    await expect(page.getByText(categoria)).toBeVisible();
    await expect(page.getByText("Conteúdo inicial do teste E2E.")).toBeVisible();

    // FAVORITAR a partir da leitura (RF03.3): a estrela passa a "cheia".
    await page.getByRole("button", { name: "Adicionar aos favoritos" }).click();
    await expect(
      page.getByRole("button", { name: "Remover dos favoritos" }),
    ).toBeVisible();

    // EDITAR (também adiciona uma etiqueta, para exercitar a busca por etiqueta).
    await page.getByRole("link", { name: "Editar" }).click();
    await page
      .getByLabel("Conteúdo do documento")
      .fill("Conteúdo editado pelo teste E2E.");
    await page.getByLabel("Etiquetas").fill(etiqueta);
    await page.getByRole("button", { name: "Salvar alterações" }).click();

    // Volta à leitura com o conteúdo atualizado. Espera o título (só existe na
    // tela de leitura) antes de checar o conteúdo — senão o texto casaria também
    // com o editor + a pré-visualização ao vivo (dois elementos = strict mode).
    await expect(page.getByRole("heading", { name: titulo })).toBeVisible();
    await expect(page.getByText("Conteúdo editado pelo teste E2E.")).toBeVisible();

    // BUSCAR na lista (RF03.2): a busca global casa por título, conteúdo E
    // etiqueta. Cada busca deve trazer o mesmo documento no resultado.
    const rotuloBusca = "Buscar documentos por título, conteúdo ou etiqueta";
    await page.goto("/documentos");

    // por título
    await page.getByLabel(rotuloBusca).fill(titulo);
    await page.getByRole("button", { name: "Buscar" }).click();
    await expect(page.getByText(titulo)).toBeVisible();

    // por conteúdo (uma palavra que só existe no corpo, não no título)
    await page.getByLabel(rotuloBusca).fill("editado pelo teste");
    await page.getByRole("button", { name: "Buscar" }).click();
    await expect(page.getByText(titulo)).toBeVisible();

    // por etiqueta (o nome da tag adicionada na edição)
    await page.getByLabel(rotuloBusca).fill(etiqueta);
    await page.getByRole("button", { name: "Buscar" }).click();
    await expect(page.getByText(titulo)).toBeVisible();

    // EXCLUIR a partir da leitura: o botão abre o DialogoConfirmacao (não o
    // confirm() nativo) e só o "Excluir" do modal remove de fato (RF02.4).
    await page.getByRole("link", { name: titulo }).click();
    await page.getByRole("button", { name: "Excluir" }).click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Excluir" })
      .click();

    // De volta à lista, o toast confirma e o documento não existe mais.
    await expect(page).toHaveURL(/\/documentos(\?|$)/);
    await expect(page.getByRole("status")).toContainText("Documento excluído.");
    await expect(page.getByText(titulo)).toHaveCount(0);
  });
});
