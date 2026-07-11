import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MenuAcoes } from "./MenuAcoes";

// Casos de teste documentados em
// docs/06-testes/casos-testes/componentes/menu-acoes.md (CT-98 e CT-99).
describe("MenuAcoes (menu ⋯ de ações)", () => {
  // Sem `globals: true` no Vitest, a limpeza automática não roda.
  afterEach(cleanup);

  it("CT-98: começa fechado; abrir e escolher uma ação chama o callback e fecha", async () => {
    const usuario = userEvent.setup();
    const onExcluir = vi.fn();
    render(
      <MenuAcoes
        rotulo="Ações do documento"
        itens={[
          { rotulo: "Excluir", variante: "perigo", onSelecionar: onExcluir },
        ]}
      />,
    );

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    await usuario.click(
      screen.getByRole("button", { name: "Ações do documento" }),
    );
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await usuario.click(screen.getByRole("menuitem", { name: "Excluir" }));
    expect(onExcluir).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("CT-99: Esc fecha o menu sem escolher nenhuma ação", async () => {
    const usuario = userEvent.setup();
    const onExcluir = vi.fn();
    render(<MenuAcoes itens={[{ rotulo: "Excluir", onSelecionar: onExcluir }]} />);

    await usuario.click(screen.getByRole("button", { name: "Ações" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await usuario.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(onExcluir).not.toHaveBeenCalled();
  });
});
