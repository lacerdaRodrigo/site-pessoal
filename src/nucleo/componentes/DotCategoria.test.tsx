import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DotCategoria } from "./DotCategoria";

// Caso de teste documentado em
// docs/06-testes/casos-testes/componentes/dot-categoria.md (CT-104).
describe("DotCategoria", () => {
  afterEach(cleanup);

  it("CT-104: pinta o quadradinho com a cor recebida e some para leitores de tela", () => {
    const { container } = render(<DotCategoria cor="#10b981" />);
    const dot = container.querySelector("span");

    expect(dot).not.toBeNull();
    expect(dot).toHaveStyle({ backgroundColor: "#10b981" });
    expect(dot).toHaveAttribute("aria-hidden", "true");
  });
});
