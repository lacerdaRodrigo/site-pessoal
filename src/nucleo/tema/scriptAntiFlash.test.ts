import { beforeEach, describe, expect, it, vi } from "vitest";
import { CHAVE_TEMA } from "./tema";
import { scriptAntiFlash } from "./scriptAntiFlash";

function executarScriptAntiFlash() {
  globalThis.eval(scriptAntiFlash);
}

function simularPreferenciaDoSistema(prefereEscuro: boolean) {
  Object.defineProperty(window, "matchMedia", {
    value: vi.fn().mockReturnValue({
      matches: prefereEscuro,
    }),
    configurable: true,
  });
}

describe("scriptAntiFlash", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-tema");
    document.documentElement.removeAttribute("data-tema-resolvido");
    document.documentElement.style.colorScheme = "";
  });

  it("CT-62: aplica o tema salvo antes da hidratação do React", () => {
    localStorage.setItem(CHAVE_TEMA, "escuro");
    simularPreferenciaDoSistema(false);

    executarScriptAntiFlash();

    expect(document.documentElement).toHaveAttribute("data-tema", "escuro");
    expect(document.documentElement).toHaveAttribute(
      "data-tema-resolvido",
      "escuro",
    );
    expect(document.documentElement.style.colorScheme).toBe("dark");
  });

  it("CT-63: quando o tema salvo é inválido, volta para sistema", () => {
    localStorage.setItem(CHAVE_TEMA, "azul");
    simularPreferenciaDoSistema(true);

    executarScriptAntiFlash();

    expect(document.documentElement).toHaveAttribute("data-tema", "sistema");
    expect(document.documentElement).toHaveAttribute(
      "data-tema-resolvido",
      "escuro",
    );
  });
});
