import { describe, expect, it } from "vitest";
import {
  corDaCategoria,
  nomeCategoriaValido,
  normalizarNomeCategoria,
  PALETA_CATEGORIAS,
  TAMANHO_MAXIMO_NOME_CATEGORIA,
} from "./categoria";

// Casos de teste documentados em
// docs/06-testes/casos-testes/unitarios/categorias.md (CT-70 a CT-74, CT-102 e CT-103).
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

describe("corDaCategoria", () => {
  it("CT-102: é determinística e sempre uma cor da paleta", () => {
    const cor = corDaCategoria("Git");
    // Mesmo nome → mesma cor, sempre.
    expect(corDaCategoria("Git")).toBe(cor);
    // E o resultado pertence à paleta oficial.
    expect(PALETA_CATEGORIAS).toContain(cor);
  });

  it("CT-103: ignora espaços nas pontas e maiúsculas/minúsculas", () => {
    expect(corDaCategoria("  git  ")).toBe(corDaCategoria("Git"));
    // Distribui: um punhado de nomes diferentes não cai todo na mesma cor.
    const nomes = ["Git", "Frontend", "Backend", "SQL", "DevOps", "Testes"];
    const cores = new Set(nomes.map(corDaCategoria));
    expect(cores.size).toBeGreaterThan(1);
  });
});
