import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BotaoFavorito } from "./BotaoFavorito";

// A Server Action é substituída por uma fake: o teste só verifica o que o botão
// RENDERIZA conforme o estado de favorito, não o efeito no servidor.
vi.mock("../dados/acoes", () => ({
  alternarFavorito: vi.fn(),
}));

describe("BotaoFavorito", () => {
  afterEach(cleanup);

  it("CT-75: quando NÃO é favorito, mostra a estrela vazia e o rótulo de adicionar", () => {
    render(<BotaoFavorito id="doc-1" eFavorito={false} />);

    const botao = screen.getByRole("button", {
      name: "Adicionar aos favoritos",
    });
    expect(botao).toHaveTextContent("☆");
    expect(botao).toHaveAttribute("aria-pressed", "false");
  });

  it("CT-76: quando é favorito, mostra a estrela cheia, o rótulo de remover e os campos ocultos corretos", () => {
    const { container } = render(<BotaoFavorito id="doc-1" eFavorito={true} />);

    const botao = screen.getByRole("button", {
      name: "Remover dos favoritos",
    });
    expect(botao).toHaveTextContent("★");
    expect(botao).toHaveAttribute("aria-pressed", "true");

    // Os campos ocultos levam o id e o estado ATUAL — a action alterna a partir
    // deles (eFavorito=true → vira false).
    expect(container.querySelector('input[name="id"]')).toHaveValue("doc-1");
    expect(container.querySelector('input[name="eFavorito"]')).toHaveValue(
      "true",
    );
  });
});
