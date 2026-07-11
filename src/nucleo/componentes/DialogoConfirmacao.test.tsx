import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DialogoConfirmacao } from "./DialogoConfirmacao";

// Casos de teste documentados em
// docs/06-testes/casos-testes/componentes/dialogo-e-toasts.md (CT-93 e CT-94).
describe("DialogoConfirmacao (modal de confirmação)", () => {
  // Sem `globals: true` no Vitest, a limpeza automática não roda.
  afterEach(cleanup);

  it("CT-93: fechado não renderiza; aberto mostra o conteúdo e confirma", async () => {
    const usuario = userEvent.setup();
    const onConfirmar = vi.fn();
    const onCancelar = vi.fn();

    const { rerender } = render(
      <DialogoConfirmacao
        aberto={false}
        titulo="Excluir documento?"
        mensagem="Esta ação não pode ser desfeita."
        textoConfirmar="Excluir"
        onConfirmar={onConfirmar}
        onCancelar={onCancelar}
      />,
    );

    // Fechado: nada na tela.
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(
      <DialogoConfirmacao
        aberto
        titulo="Excluir documento?"
        mensagem="Esta ação não pode ser desfeita."
        textoConfirmar="Excluir"
        onConfirmar={onConfirmar}
        onCancelar={onCancelar}
      />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Excluir documento?")).toBeInTheDocument();
    expect(
      screen.getByText("Esta ação não pode ser desfeita."),
    ).toBeInTheDocument();

    await usuario.click(screen.getByRole("button", { name: "Excluir" }));
    expect(onConfirmar).toHaveBeenCalledTimes(1);
    expect(onCancelar).not.toHaveBeenCalled();
  });

  it("CT-94: cancelar, clicar no fundo e Esc chamam onCancelar", async () => {
    const usuario = userEvent.setup();
    const onCancelar = vi.fn();

    render(
      <DialogoConfirmacao
        aberto
        titulo="Excluir documento?"
        onConfirmar={vi.fn()}
        onCancelar={onCancelar}
      />,
    );

    // Há dois elementos "Cancelar": o fundo escurecido (aria-label) e o botão.
    const botoesCancelar = screen.getAllByRole("button", { name: "Cancelar" });
    expect(botoesCancelar).toHaveLength(2);
    await usuario.click(botoesCancelar[0]);
    await usuario.click(botoesCancelar[1]);
    await usuario.keyboard("{Escape}");

    expect(onCancelar).toHaveBeenCalledTimes(3);
  });
});
