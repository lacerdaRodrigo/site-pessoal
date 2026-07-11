import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AcoesDocumento } from "./AcoesDocumento";
import { excluirDocumento } from "../dados/acoes";

// A Server Action é efeito de rede — mockada. O foco é o fluxo do menu ⋯ →
// DialogoConfirmacao (ambos usados de verdade) na exclusão pela lista.
vi.mock("../dados/acoes", () => ({ excluirDocumento: vi.fn() }));

const excluirMock = vi.mocked(excluirDocumento);

// Casos de teste documentados em
// docs/06-testes/casos-testes/componentes/documentos.md (CT-100 e CT-101).
describe("AcoesDocumento (excluir pela lista)", () => {
  afterEach(() => {
    cleanup();
    excluirMock.mockReset();
  });

  it("CT-100: escolher 'Excluir' no menu abre o diálogo de confirmação (RF02.4)", async () => {
    const usuario = userEvent.setup();
    render(<AcoesDocumento id="doc-1" />);

    await usuario.click(
      screen.getByRole("button", { name: "Ações do documento" }),
    );
    await usuario.click(screen.getByRole("menuitem", { name: "Excluir" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Excluir documento?")).toBeInTheDocument();
  });

  it("CT-101: cancelar (Esc) fecha o diálogo sem excluir", async () => {
    const usuario = userEvent.setup();
    render(<AcoesDocumento id="doc-1" />);

    await usuario.click(
      screen.getByRole("button", { name: "Ações do documento" }),
    );
    await usuario.click(screen.getByRole("menuitem", { name: "Excluir" }));
    await usuario.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(excluirMock).not.toHaveBeenCalled();
  });
});
