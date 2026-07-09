import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProvedorDeTema, useTema } from "./ProvedorDeTema";
import { CHAVE_TEMA, type Tema } from "./tema";

type OuvinteMatchMedia = () => void;

const ouvintes = new Set<OuvinteMatchMedia>();
let sistemaPrefereEscuro = false;

function criarMatchMedia() {
  return vi.fn().mockImplementation((consulta: string) => ({
    matches: sistemaPrefereEscuro,
    media: consulta,
    onchange: null,
    addEventListener: vi.fn((_evento: string, callback: OuvinteMatchMedia) => {
      ouvintes.add(callback);
    }),
    removeEventListener: vi.fn((_evento: string, callback: OuvinteMatchMedia) => {
      ouvintes.delete(callback);
    }),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

function PainelDeTeste() {
  const { tema, definirTema } = useTema();
  const opcoes: Tema[] = ["claro", "escuro", "sistema"];

  return (
    <div>
      <p>Tema atual: {tema}</p>
      {opcoes.map((opcao) => (
        <button key={opcao} type="button" onClick={() => definirTema(opcao)}>
          {opcao}
        </button>
      ))}
    </div>
  );
}

describe("ProvedorDeTema", () => {
  beforeEach(() => {
    sistemaPrefereEscuro = false;
    ouvintes.clear();
    localStorage.clear();
    document.documentElement.removeAttribute("data-tema");
    document.documentElement.removeAttribute("data-tema-resolvido");
    document.documentElement.style.colorScheme = "";
    Object.defineProperty(window, "matchMedia", {
      value: criarMatchMedia(),
      configurable: true,
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("CT-59: usa o tema salvo no localStorage ao montar", async () => {
    localStorage.setItem(CHAVE_TEMA, "escuro");

    render(
      <ProvedorDeTema>
        <PainelDeTeste />
      </ProvedorDeTema>,
    );

    expect(await screen.findByText("Tema atual: escuro")).toBeInTheDocument();
    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute("data-tema", "escuro");
      expect(document.documentElement).toHaveAttribute(
        "data-tema-resolvido",
        "escuro",
      );
    });
  });

  it("CT-60: troca o tema, aplica no html e persiste a escolha", async () => {
    const usuario = userEvent.setup();
    render(
      <ProvedorDeTema>
        <PainelDeTeste />
      </ProvedorDeTema>,
    );

    await usuario.click(screen.getByRole("button", { name: "escuro" }));

    expect(screen.getByText("Tema atual: escuro")).toBeInTheDocument();
    expect(localStorage.getItem(CHAVE_TEMA)).toBe("escuro");
    expect(document.documentElement).toHaveAttribute(
      "data-tema-resolvido",
      "escuro",
    );
  });

  it("CT-61: no modo sistema, acompanha a preferência do sistema operacional", async () => {
    const usuario = userEvent.setup();
    render(
      <ProvedorDeTema>
        <PainelDeTeste />
      </ProvedorDeTema>,
    );

    await usuario.click(screen.getByRole("button", { name: "sistema" }));

    expect(document.documentElement).toHaveAttribute(
      "data-tema-resolvido",
      "claro",
    );

    sistemaPrefereEscuro = true;
    ouvintes.forEach((ouvinte) => ouvinte());

    expect(document.documentElement).toHaveAttribute(
      "data-tema-resolvido",
      "escuro",
    );
  });
});
