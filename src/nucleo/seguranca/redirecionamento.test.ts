import { describe, expect, it } from "vitest";
import { caminhoInternoSeguro } from "./redirecionamento";

describe("caminhoInternoSeguro", () => {
  it("CT-22: aceita um caminho interno da aplicação", () => {
    expect(caminhoInternoSeguro("/redefinir-senha")).toBe("/redefinir-senha");
  });

  it("CT-23: rejeita uma URL absoluta para outro domínio", () => {
    expect(caminhoInternoSeguro("https://site-malicioso.com")).toBe("/");
  });

  it("CT-24: rejeita uma URL protocolo-relativa (//)", () => {
    expect(caminhoInternoSeguro("//site-malicioso.com")).toBe("/");
  });

  it("CT-25: rejeita a variação com barra invertida (/\\)", () => {
    expect(caminhoInternoSeguro("/\\site-malicioso.com")).toBe("/");
  });

  it("CT-26: cai no fallback '/' quando o valor está ausente", () => {
    expect(caminhoInternoSeguro(null)).toBe("/");
  });
});
