import { describe, expect, it } from "vitest";
import { resolverTema, temaValido } from "./tema";

describe("temaValido", () => {
  it("CT-53: aceita os três temas conhecidos", () => {
    expect(temaValido("claro")).toBe(true);
    expect(temaValido("escuro")).toBe(true);
    expect(temaValido("sistema")).toBe(true);
  });

  it("CT-54: rejeita valores desconhecidos (ex.: lixo no localStorage)", () => {
    expect(temaValido("azul")).toBe(false);
    expect(temaValido(null)).toBe(false);
    expect(temaValido(undefined)).toBe(false);
  });
});

describe("resolverTema", () => {
  it("CT-55: 'claro' resolve para claro, ignorando o SO", () => {
    expect(resolverTema("claro", true)).toBe("claro");
  });

  it("CT-56: 'escuro' resolve para escuro, ignorando o SO", () => {
    expect(resolverTema("escuro", false)).toBe("escuro");
  });

  it("CT-57: 'sistema' segue o SO quando ele prefere escuro", () => {
    expect(resolverTema("sistema", true)).toBe("escuro");
  });

  it("CT-58: 'sistema' segue o SO quando ele prefere claro", () => {
    expect(resolverTema("sistema", false)).toBe("claro");
  });
});
