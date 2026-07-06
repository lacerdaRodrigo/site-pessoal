import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FormularioEsqueciSenha } from "./FormularioEsqueciSenha";
import { solicitarRedefinicaoSenha } from "../dados/acoes";

vi.mock("../dados/acoes", () => ({
  solicitarRedefinicaoSenha: vi.fn(),
}));

const solicitarMock = vi.mocked(solicitarRedefinicaoSenha);

describe("FormularioEsqueciSenha", () => {
  beforeEach(() => {
    solicitarMock.mockReset();
  });

  it("CT-15: exibe mensagem genérica de sucesso após solicitar o link", async () => {
    solicitarMock.mockResolvedValueOnce({
      erro: null,
      mensagem:
        "Se esse e-mail existir na nossa base, enviamos um link para redefinir a senha.",
    });
    const usuario = userEvent.setup();
    render(<FormularioEsqueciSenha />);

    await usuario.type(screen.getByLabelText("E-mail"), "rodrigo@example.com");
    await usuario.click(
      screen.getByRole("button", { name: "Enviar link de redefinição" }),
    );

    expect(
      await screen.findByText(/enviamos um link para redefinir a senha/i),
    ).toBeInTheDocument();
  });

  it("CT-16: exibe erro quando a Server Action falha", async () => {
    solicitarMock.mockResolvedValueOnce({ erro: "Informe um e-mail válido." });
    const usuario = userEvent.setup();
    render(<FormularioEsqueciSenha />);

    await usuario.type(screen.getByLabelText("E-mail"), "rodrigo@example.com");
    await usuario.click(
      screen.getByRole("button", { name: "Enviar link de redefinição" }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Informe um e-mail válido.",
    );
  });
});
