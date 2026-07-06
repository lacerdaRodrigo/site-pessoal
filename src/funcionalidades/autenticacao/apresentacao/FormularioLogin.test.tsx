import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FormularioLogin } from "./FormularioLogin";
import { entrar } from "../dados/acoes";

vi.mock("../dados/acoes", () => ({
  entrar: vi.fn(),
}));

const entrarMock = vi.mocked(entrar);

describe("FormularioLogin", () => {
  beforeEach(() => {
    entrarMock.mockReset();
  });

  it("CT-07: exibe a mensagem de erro devolvida pela Server Action", async () => {
    entrarMock.mockResolvedValueOnce({ erro: "E-mail ou senha incorretos." });
    const usuario = userEvent.setup();
    render(<FormularioLogin />);

    await usuario.type(screen.getByLabelText("E-mail"), "rodrigo@example.com");
    await usuario.type(screen.getByLabelText("Senha"), "senha1234");
    await usuario.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "E-mail ou senha incorretos.",
    );
  });

  it("CT-14: não permite enviar o formulário sem preencher e-mail e senha", () => {
    render(<FormularioLogin />);

    expect(screen.getByLabelText("E-mail")).toBeRequired();
    expect(screen.getByLabelText("Senha")).toBeRequired();
  });
});
