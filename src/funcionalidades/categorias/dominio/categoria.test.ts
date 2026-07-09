import { describe, expect, it } from "vitest";
import {
  nomeCategoriaValido,
  normalizarNomeCategoria,
  TAMANHO_MAXIMO_NOME_CATEGORIA,
} from "./categoria";

// Casos de teste documentados em
// docs/06-testes/casos-testes/unitarios/categorias.md (CT-70 a CT-74).
describe("nomeCategoriaValido", () => {
  it("CT-70: aceita um nome comum", () => {
    expect(nomeCategoriaValido("Banco de Dados")).toBe(true);
  });

  it("CT-71: rejeita nome vazio ou só de espaços", () => {
    expect(nomeCategoriaValido("")).toBe(false);
    expect(nomeCategoriaValido("   ")).toBe(false);
  });

  it("CT-72: aceita exatamente no limite de tamanho", () => {
    const noLimite = "a".repeat(TAMANHO_MAXIMO_NOME_CATEGORIA);
    expect(nomeCategoriaValido(noLimite)).toBe(true);
  });

  it("CT-73: rejeita um caractere além do limite", () => {
    const acimaDoLimite = "a".repeat(TAMANHO_MAXIMO_NOME_CATEGORIA + 1);
    expect(nomeCategoriaValido(acimaDoLimite)).toBe(false);
  });
});

describe("normalizarNomeCategoria", () => {
  it("CT-74: apara espaços das pontas e mantém o vazio como string vazia", () => {
    expect(normalizarNomeCategoria("  Git  ")).toBe("Git");
    expect(normalizarNomeCategoria("   ")).toBe("");
  });
});
