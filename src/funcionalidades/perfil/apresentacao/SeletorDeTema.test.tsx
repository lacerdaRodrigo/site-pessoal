import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SeletorDeTema } from "./SeletorDeTema";

const definirTemaMock = vi.fn();

vi.mock("@/nucleo/tema/ProvedorDeTema", () => ({
  useTema: () => ({
    tema: "sistema",
    definirTema: definirTemaMock,
  }),
}));

describe("SeletorDeTema", () => {
  afterEach(() => {
    cleanup();
    definirTemaMock.mockReset();
  });

  it("CT-67: marca o tema atual como selecionado", () => {
    render(<SeletorDeTema />);

    expect(screen.getByRole("radio", { name: "Sistema" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("CT-68: clicar em uma opção solicita a troca de tema", async () => {
    const usuario = userEvent.setup();
    render(<SeletorDeTema />);

    await usuario.click(screen.getByRole("radio", { name: "Escuro" }));

    expect(definirTemaMock).toHaveBeenCalledWith("escuro");
  });
});
