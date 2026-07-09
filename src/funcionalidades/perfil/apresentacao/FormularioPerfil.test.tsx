import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { atualizarPerfil } from "../dados/acoes";
import { FormularioPerfil } from "./FormularioPerfil";

vi.mock("../dados/acoes", () => ({
  atualizarPerfil: vi.fn(),
}));

const atualizarPerfilMock = vi.mocked(atualizarPerfil);

describe("FormularioPerfil", () => {
  beforeEach(() => {
    atualizarPerfilMock.mockReset();
  });

  afterEach(cleanup);

  it("CT-64: exibe e-mail somente leitura e nome inicial preenchido", () => {
    render(
      <FormularioPerfil
        nomeCompleto="Rodrigo Lacerda"
        email="rodrigo@example.com"
      />,
    );

    expect(screen.getByLabelText("E-mail")).toHaveValue("rodrigo@example.com");
    expect(screen.getByLabelText("E-mail")).toBeDisabled();
    expect(screen.getByLabelText("Nome de exibição")).toHaveValue(
      "Rodrigo Lacerda",
    );
  });

  it("CT-65: exibe a mensagem de sucesso devolvida pela Server Action", async () => {
    atualizarPerfilMock.mockResolvedValueOnce({
      erro: null,
      mensagem: "Perfil atualizado!",
    });
    const usuario = userEvent.setup();
    render(
      <FormularioPerfil nomeCompleto={null} email="rodrigo@example.com" />,
    );

    await usuario.type(screen.getByLabelText("Nome de exibição"), "Rodrigo");
    await usuario.click(screen.getByRole("button", { name: "Salvar" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Perfil atualizado!",
    );
  });

  it("CT-66: exibe o erro devolvido pela Server Action", async () => {
    atualizarPerfilMock.mockResolvedValueOnce({
      erro: "O nome pode ter no máximo 120 caracteres.",
    });
    const usuario = userEvent.setup();
    render(
      <FormularioPerfil nomeCompleto={null} email="rodrigo@example.com" />,
    );

    await usuario.click(screen.getByRole("button", { name: "Salvar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "O nome pode ter no máximo 120 caracteres.",
    );
  });
});
