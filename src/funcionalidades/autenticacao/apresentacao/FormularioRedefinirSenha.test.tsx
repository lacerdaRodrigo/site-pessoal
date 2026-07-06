import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FormularioRedefinirSenha } from "./FormularioRedefinirSenha";
import { redefinirSenha } from "../dados/acoes";

vi.mock("../dados/acoes", () => ({
  redefinirSenha: vi.fn(),
}));

const redefinirMock = vi.mocked(redefinirSenha);

describe("FormularioRedefinirSenha", () => {
  beforeEach(() => {
    redefinirMock.mockReset();
  });

  it("CT-17: exibe erro quando a nova senha é fraca", async () => {
    redefinirMock.mockResolvedValueOnce({
      erro: "A senha precisa ter pelo menos 8 caracteres.",
    });
    const usuario = userEvent.setup();
    render(<FormularioRedefinirSenha />);

    await usuario.type(screen.getByLabelText("Nova senha"), "1234567a");
    await usuario.click(screen.getByRole("button", { name: "Salvar nova senha" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "A senha precisa ter pelo menos 8 caracteres.",
    );
  });

  it("CT-18: exige uma senha com no mínimo 8 caracteres no campo", () => {
    render(<FormularioRedefinirSenha />);

    const campoSenha = screen.getByLabelText("Nova senha");
    expect(campoSenha).toBeRequired();
    expect(campoSenha).toHaveAttribute("minLength", "8");
  });
});
