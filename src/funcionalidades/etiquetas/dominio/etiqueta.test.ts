import { describe, expect, it } from "vitest";
import {
  juntarEtiquetas,
  nomeEtiquetaValido,
  normalizarNomeEtiqueta,
  separarEtiquetas,
  TAMANHO_MAXIMO_NOME_ETIQUETA,
  type Etiqueta,
} from "./etiqueta";

// Casos de teste documentados em
// docs/06-testes/casos-testes/unitarios/etiquetas.md (CT-79 a CT-85).
describe("normalizarNomeEtiqueta", () => {
  it("CT-79: apara espaços e remove o # inicial", () => {
    expect(normalizarNomeEtiqueta("  #dart  ")).toBe("dart");
    expect(normalizarNomeEtiqueta("testes")).toBe("testes");
    expect(normalizarNomeEtiqueta("   ")).toBe("");
  });
});

describe("nomeEtiquetaValido", () => {
  it("CT-80: aceita um nome comum (com ou sem #)", () => {
    expect(nomeEtiquetaValido("testes")).toBe(true);
    expect(nomeEtiquetaValido("#dart")).toBe(true);
  });

  it("CT-81: rejeita nome vazio, só de espaços ou só '#'", () => {
    expect(nomeEtiquetaValido("")).toBe(false);
    expect(nomeEtiquetaValido("   ")).toBe(false);
    expect(nomeEtiquetaValido("#")).toBe(false);
  });

  it("CT-82: aceita no limite e rejeita um caractere além (fronteira)", () => {
    const noLimite = "a".repeat(TAMANHO_MAXIMO_NOME_ETIQUETA);
    const acima = "a".repeat(TAMANHO_MAXIMO_NOME_ETIQUETA + 1);
    expect(nomeEtiquetaValido(noLimite)).toBe(true);
    expect(nomeEtiquetaValido(acima)).toBe(false);
  });
});

describe("separarEtiquetas", () => {
  it("CT-83: separa por vírgula, normaliza e descarta vazios", () => {
    expect(separarEtiquetas("#dart, testes ,, ")).toEqual(["dart", "testes"]);
  });

  it("CT-84: remove duplicatas de forma case-insensitive (mantém a 1ª grafia)", () => {
    expect(separarEtiquetas("Dart, dart, DART")).toEqual(["Dart"]);
  });

  it("CT-85: descarta nomes acima do tamanho máximo", () => {
    const gigante = "a".repeat(TAMANHO_MAXIMO_NOME_ETIQUETA + 1);
    expect(separarEtiquetas(`ok, ${gigante}`)).toEqual(["ok"]);
  });
});

describe("juntarEtiquetas", () => {
  it("CT-86: junta os nomes separados por vírgula (inverso de separar)", () => {
    const etiquetas: Etiqueta[] = [
      { id: "1", usuarioId: "u", nome: "dart" },
      { id: "2", usuarioId: "u", nome: "testes" },
    ];
    expect(juntarEtiquetas(etiquetas)).toBe("dart, testes");
  });
});
