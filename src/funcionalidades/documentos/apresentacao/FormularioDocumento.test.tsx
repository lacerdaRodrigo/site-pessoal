import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FormularioDocumento } from "./FormularioDocumento";
import { atualizarDocumento, criarDocumento } from "../dados/acoes";
import type { Documento } from "../dominio/documento";

// As Server Actions são substituídas por funções fake (não são chamada de rede
// do ponto de vista do teste — mesmo motivo dos testes dos forms de auth).
vi.mock("../dados/acoes", () => ({
  criarDocumento: vi.fn(),
  atualizarDocumento: vi.fn(),
}));

const criarMock = vi.mocked(criarDocumento);
const atualizarMock = vi.mocked(atualizarDocumento);

const documentoExemplo: Documento = {
  id: "doc-1",
  usuarioId: "user-1",
  categoriaId: null,
  titulo: "Prompt de testes",
  conteudo: "SELECT * FROM documentos;",
  eFavorito: false,
  criadoEm: "2026-07-07T00:00:00Z",
  atualizadoEm: "2026-07-07T00:00:00Z",
};

describe("FormularioDocumento", () => {
  beforeEach(() => {
    criarMock.mockReset();
    atualizarMock.mockReset();
  });

  // Sem `globals: true` no Vitest, a limpeza automática do Testing Library não
  // roda — sem isto os formulários acumulam no DOM entre os testes.
  afterEach(cleanup);

  it("CT-35: (criar) exibe o erro devolvido pela Server Action", async () => {
    criarMock.mockResolvedValueOnce({
      erro: "O conteúdo não pode ficar vazio.",
    });
    const usuario = userEvent.setup();
    render(<FormularioDocumento />);

    await usuario.type(
      screen.getByLabelText("Título do documento"),
      "Meu título",
    );
    await usuario.type(
      screen.getByLabelText("Conteúdo do documento"),
      "algum conteúdo",
    );
    await usuario.click(screen.getByRole("button", { name: "Criar documento" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "O conteúdo não pode ficar vazio.",
    );
  });

  it("CT-36: (criar) mostra o botão de criar, não o de salvar", () => {
    render(<FormularioDocumento />);

    expect(
      screen.getByRole("button", { name: "Criar documento" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Salvar alterações" }),
    ).not.toBeInTheDocument();
  });

  it("CT-37: (editar) vem com os campos preenchidos e o botão de salvar", () => {
    render(<FormularioDocumento documento={documentoExemplo} />);

    expect(screen.getByLabelText("Título do documento")).toHaveValue(
      "Prompt de testes",
    );
    expect(screen.getByLabelText("Conteúdo do documento")).toHaveValue(
      "SELECT * FROM documentos;",
    );
    expect(
      screen.getByRole("button", { name: "Salvar alterações" }),
    ).toBeInTheDocument();
  });

  it("CT-38: (editar) exibe o erro devolvido ao salvar", async () => {
    atualizarMock.mockResolvedValueOnce({
      erro: "Não foi possível salvar as alterações.",
    });
    const usuario = userEvent.setup();
    render(<FormularioDocumento documento={documentoExemplo} />);

    await usuario.click(
      screen.getByRole("button", { name: "Salvar alterações" }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível salvar as alterações.",
    );
  });

  it("CT-77: (editar) o campo Categoria vem preenchido com a categoria do documento (RF03.1)", () => {
    render(
      <FormularioDocumento
        documento={{ ...documentoExemplo, categoriaId: "cat-1", categoriaNome: "Git" }}
      />,
    );

    expect(screen.getByLabelText("Categoria")).toHaveValue("Git");
  });

  it("CT-78: (criar) as categorias existentes viram opções de autocomplete (RF03.1)", () => {
    const categorias = [
      { id: "cat-1", usuarioId: "user-1", nome: "Git", criadoEm: "2026-07-07T00:00:00Z" },
      { id: "cat-2", usuarioId: "user-1", nome: "Banco de Dados", criadoEm: "2026-07-07T00:00:00Z" },
    ];
    const { container } = render(<FormularioDocumento categorias={categorias} />);

    const opcoes = Array.from(container.querySelectorAll("datalist option")).map(
      (o) => o.getAttribute("value"),
    );
    expect(opcoes).toEqual(["Git", "Banco de Dados"]);
  });

  it("CT-87: (editar) o campo Etiquetas vem preenchido com as etiquetas do documento", () => {
    render(
      <FormularioDocumento
        documento={{
          ...documentoExemplo,
          etiquetas: [
            { id: "e1", usuarioId: "user-1", nome: "dart" },
            { id: "e2", usuarioId: "user-1", nome: "testes" },
          ],
        }}
      />,
    );

    expect(screen.getByLabelText("Etiquetas")).toHaveValue("dart, testes");
  });

  it("CT-88: (criar) as etiquetas existentes viram opções de autocomplete", () => {
    const etiquetasExistentes = [
      { id: "e1", usuarioId: "user-1", nome: "dart" },
      { id: "e2", usuarioId: "user-1", nome: "testes" },
    ];
    const { container } = render(
      <FormularioDocumento etiquetasExistentes={etiquetasExistentes} />,
    );

    const opcoes = Array.from(
      container.querySelectorAll("#lista-etiquetas option"),
    ).map((o) => o.getAttribute("value"));
    expect(opcoes).toEqual(["dart", "testes"]);
  });

  it("CT-91: a pré-visualização renderiza o Markdown ao vivo conforme digita (spec 2.6)", async () => {
    const usuario = userEvent.setup();
    render(<FormularioDocumento />);

    // Antes de digitar, o painel mostra o placeholder, não um cabeçalho.
    expect(
      screen.queryByRole("heading", { name: "Olá" }),
    ).not.toBeInTheDocument();

    await usuario.type(
      screen.getByLabelText("Conteúdo do documento"),
      "# Olá",
    );

    // O "# Olá" digitado vira um <h1> renderizado na pré-visualização.
    expect(
      await screen.findByRole("heading", { name: "Olá" }),
    ).toBeInTheDocument();
  });

  it("CT-92: no mobile, alternar para a aba Pré-visualização marca-a como ativa (spec 2.6)", async () => {
    const usuario = userEvent.setup();
    render(<FormularioDocumento />);

    const abaEditar = screen.getByRole("tab", { name: "Editar" });
    const abaPreview = screen.getByRole("tab", { name: "Pré-visualização" });
    expect(abaEditar).toHaveAttribute("aria-selected", "true");
    expect(abaPreview).toHaveAttribute("aria-selected", "false");

    await usuario.click(abaPreview);

    expect(abaPreview).toHaveAttribute("aria-selected", "true");
    expect(abaEditar).toHaveAttribute("aria-selected", "false");
  });
});
