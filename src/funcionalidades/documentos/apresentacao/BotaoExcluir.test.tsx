import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BotaoExcluir } from "./BotaoExcluir";
import { excluirDocumento } from "../dados/acoes";

vi.mock("../dados/acoes", () => ({
  excluirDocumento: vi.fn(),
}));

const excluirMock = vi.mocked(excluirDocumento);

describe("BotaoExcluir", () => {
  afterEach(() => {
    cleanup();
    excluirMock.mockReset();
  });

  it("CT-46: cancelar a confirmação NÃO dispara a exclusão (RF02.4)", async () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);
    const usuario = userEvent.setup();
    render(<BotaoExcluir id="doc-1" />);

    await usuario.click(screen.getByRole("button", { name: "Excluir" }));

    expect(confirmSpy).toHaveBeenCalledOnce();
    expect(excluirMock).not.toHaveBeenCalled();
    confirmSpy.mockRestore();
  });
});
