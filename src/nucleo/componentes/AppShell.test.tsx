import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppShell } from "./AppShell";

// Dependências externas do shell viram stubs: a rota atual (usePathname), a
// Server Action de logout e o seletor de tema (que depende do contexto de tema).
// O foco do teste é só o comportamento da gaveta (abrir/fechar).
vi.mock("next/navigation", () => ({ usePathname: () => "/inicio" }));
vi.mock("@/funcionalidades/autenticacao/dados/acoes", () => ({ sair: vi.fn() }));
vi.mock("@/funcionalidades/perfil/apresentacao/SeletorDeTema", () => ({
  SeletorDeTema: () => null,
}));

// Casos de teste documentados em
// docs/06-testes/casos-testes/componentes/app-shell.md (CT-89 e CT-90).
describe("AppShell (gaveta mobile)", () => {
  // Sem `globals: true` no Vitest, a limpeza automática não roda.
  afterEach(cleanup);

  it("CT-89: começa fechado e abre a gaveta ao clicar no ☰ (RNF02.3)", async () => {
    const usuario = userEvent.setup();
    render(<AppShell email="rod@exemplo.com">conteúdo</AppShell>);

    const abrir = screen.getByLabelText("Abrir menu");
    expect(abrir).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByLabelText("Fechar menu")).not.toBeInTheDocument();

    await usuario.click(abrir);

    expect(screen.getByLabelText("Abrir menu")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByLabelText("Fechar menu")).toBeInTheDocument();
  });

  it("CT-90: clicar no overlay fecha a gaveta", async () => {
    const usuario = userEvent.setup();
    render(<AppShell email="rod@exemplo.com">conteúdo</AppShell>);

    await usuario.click(screen.getByLabelText("Abrir menu"));
    await usuario.click(screen.getByLabelText("Fechar menu"));

    expect(screen.queryByLabelText("Fechar menu")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Abrir menu")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});
