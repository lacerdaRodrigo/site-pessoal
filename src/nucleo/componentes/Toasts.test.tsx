import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Toasts } from "./Toasts";

// Controla o parâmetro ?aviso= e espiona o router.replace a cada teste.
// vi.hoisted deixa os stubs prontos antes do vi.mock (que é içado pelo Vitest).
const { estado, replace } = vi.hoisted(() => ({
  estado: { aviso: "" },
  replace: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () =>
    new URLSearchParams(estado.aviso ? `aviso=${estado.aviso}` : ""),
  useRouter: () => ({ replace }),
  usePathname: () => "/documentos",
}));

// Casos de teste documentados em
// docs/06-testes/casos-testes/componentes/dialogo-e-toasts.md (CT-95 e CT-96).
describe("Toasts (aviso de sucesso pós-redirect)", () => {
  afterEach(() => {
    cleanup();
    replace.mockClear();
  });

  it("CT-95: mostra a mensagem do ?aviso= e limpa a URL", () => {
    estado.aviso = "excluido";
    render(<Toasts />);

    expect(screen.getByRole("status")).toHaveTextContent("Documento excluído.");
    // Remove o parâmetro para o toast não voltar ao recarregar/navegar.
    expect(replace).toHaveBeenCalledWith("/documentos", { scroll: false });
  });

  it("CT-96: sem um ?aviso= conhecido, não renderiza nada", () => {
    estado.aviso = "";
    render(<Toasts />);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });
});
