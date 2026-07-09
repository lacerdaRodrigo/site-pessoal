import { describe, expect, it } from "vitest";
import {
  conteudoValido,
  extrairCodigoParaCopiar,
  tituloValido,
} from "./documento";

describe("tituloValido", () => {
  it("CT-27: aceita um título comum", () => {
    expect(tituloValido("Prompt para gerar testes")).toBe(true);
  });

  it("CT-28: rejeita título vazio", () => {
    expect(tituloValido("")).toBe(false);
  });

  it("CT-29: rejeita título só com espaços", () => {
    expect(tituloValido("   ")).toBe(false);
  });

  it("CT-30: aceita título com exatamente 255 caracteres (fronteira)", () => {
    expect(tituloValido("a".repeat(255))).toBe(true);
  });

  it("CT-31: rejeita título com 256 caracteres (fronteira)", () => {
    expect(tituloValido("a".repeat(256))).toBe(false);
  });
});

describe("conteudoValido", () => {
  it("CT-32: aceita um conteúdo com texto", () => {
    expect(conteudoValido("SELECT * FROM documentos;")).toBe(true);
  });

  it("CT-33: rejeita conteúdo vazio", () => {
    expect(conteudoValido("")).toBe(false);
  });

  it("CT-34: rejeita conteúdo só com espaços", () => {
    expect(conteudoValido("   ")).toBe(false);
  });
});

describe("extrairCodigoParaCopiar", () => {
  it("CT-41: extrai só o conteúdo de um bloco de código (RF02.5.1)", () => {
    const conteudo = "Explicação antes.\n\n```sql\nSELECT 1;\n```\n\nDepois.";
    expect(extrairCodigoParaCopiar(conteudo)).toBe("SELECT 1;");
  });

  it("CT-42: junta vários blocos de código, ignorando o texto ao redor", () => {
    const conteudo =
      "```bash\nnpm install\n```\ntexto no meio\n```bash\nnpm test\n```";
    expect(extrairCodigoParaCopiar(conteudo)).toBe("npm install\n\nnpm test");
  });

  it("CT-43: sem bloco de código, devolve o texto completo (RF02.5.2)", () => {
    const conteudo = "Só um texto comum, sem código nenhum.";
    expect(extrairCodigoParaCopiar(conteudo)).toBe(conteudo);
  });
});
