import { describe, expect, it } from "vitest";
import { nomeValido, normalizarNome } from "./perfil";

describe("nomeValido", () => {
  it("CT-47: aceita um nome comum", () => {
    expect(nomeValido("Rodrigo Lacerda")).toBe(true);
  });

  it("CT-48: aceita nome vazio (o nome é opcional)", () => {
    expect(nomeValido("")).toBe(true);
  });

  it("CT-49: aceita nome com exatamente 120 caracteres (fronteira)", () => {
    expect(nomeValido("a".repeat(120))).toBe(true);
  });

  it("CT-50: rejeita nome com 121 caracteres (fronteira)", () => {
    expect(nomeValido("a".repeat(121))).toBe(false);
  });
});

describe("normalizarNome", () => {
  it("CT-51: apara os espaços das pontas", () => {
    expect(normalizarNome("  Rodrigo  ")).toBe("Rodrigo");
  });

  it("CT-52: converte vazio/só-espaços em null", () => {
    expect(normalizarNome("   ")).toBe(null);
    expect(normalizarNome("")).toBe(null);
  });
});
