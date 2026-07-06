import { describe, expect, it } from "vitest";
import { emailValido, senhaValida } from "./validacoes";

describe("emailValido", () => {
  it("CT-01: aceita um e-mail bem formado", () => {
    expect(emailValido("rodrigo@example.com")).toBe(true);
  });

  it("CT-02: rejeita um texto sem @", () => {
    expect(emailValido("rodrigo-em-example.com")).toBe(false);
  });

  it("CT-03: rejeita um texto sem domínio", () => {
    expect(emailValido("rodrigo@")).toBe(false);
  });
});

describe("senhaValida", () => {
  it("CT-04: aceita senha com exatamente 8 caracteres (RF01.1.1)", () => {
    expect(senhaValida("12345678")).toBe(true);
  });

  it("CT-05: rejeita senha com 7 caracteres", () => {
    expect(senhaValida("1234567")).toBe(false);
  });
});
