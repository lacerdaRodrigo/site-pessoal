import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BotaoExcluir } from "./BotaoExcluir";
import { excluirDocumento } from "../dados/acoes";

// A Server Action é efeito de rede — mockada. O foco é a confirmação via
// DialogoConfirmacao (usado de verdade), que substituiu o confirm() nativo.
vi.mock("../dados/acoes", () => ({
  excluirDocumento: vi.fn(),
}));

const excluirMock = vi.mocked(excluirDocumento);

describe("BotaoExcluir", () => {
  afterEach(() => {
    cleanup();
    excluirMock.mockReset();
  });

  it("CT-97: clicar em Excluir abre o diálogo de confirmação (sem confirm nativo)", async () => {
    const usuario = userEvent.setup();
    render(<BotaoExcluir id="doc-1" />);

    // Antes do clique não há modal; e o confirm() nativo não é mais usado.
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await usuario.click(screen.getByRole("button", { name: "Excluir" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Excluir documento?")).toBeInTheDocument();
  });

  it("CT-46: cancelar a confirmação (Esc) NÃO dispara a exclusão (RF02.4)", async () => {
    const usuario = userEvent.setup();
    render(<BotaoExcluir id="doc-1" />);

    await usuario.click(screen.getByRole("button", { name: "Excluir" }));
    await usuario.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(excluirMock).not.toHaveBeenCalled();
  });
});
