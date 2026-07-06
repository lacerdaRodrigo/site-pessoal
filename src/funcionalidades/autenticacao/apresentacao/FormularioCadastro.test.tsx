import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FormularioCadastro } from "./FormularioCadastro";
import { cadastrar } from "../dados/acoes";

vi.mock("../dados/acoes", () => ({
  cadastrar: vi.fn(),
}));

const cadastrarMock = vi.mocked(cadastrar);

describe("FormularioCadastro", () => {
  beforeEach(() => {
    cadastrarMock.mockReset();
  });

  it("CT-08: exibe a mensagem de sucesso após o cadastro", async () => {
    cadastrarMock.mockResolvedValueOnce({
      erro: null,
      mensagem:
        "Cadastro realizado! Verifique seu e-mail para confirmar a conta antes de entrar.",
    });
    const usuario = userEvent.setup();
    render(<FormularioCadastro />);

    await usuario.type(screen.getByLabelText("E-mail"), "novo@example.com");
    await usuario.type(screen.getByLabelText("Senha"), "senha1234");
    await usuario.click(screen.getByRole("button", { name: "Cadastrar" }));

    expect(await screen.findByText(/verifique seu e-mail/i)).toBeInTheDocument();
  });

  it("CT-09: exibe a mensagem de erro devolvida pela Server Action", async () => {
    cadastrarMock.mockResolvedValueOnce({
      erro: "A senha precisa ter pelo menos 8 caracteres.",
    });
    const usuario = userEvent.setup();
    render(<FormularioCadastro />);

    await usuario.type(screen.getByLabelText("E-mail"), "novo@example.com");
    await usuario.type(screen.getByLabelText("Senha"), "1234567a");
    await usuario.click(screen.getByRole("button", { name: "Cadastrar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "A senha precisa ter pelo menos 8 caracteres.",
    );
  });
});
