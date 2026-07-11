import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TransicaoDeTela } from "./TransicaoDeTela";

// A rota atual (usePathname) é a única dependência externa — stubada. O foco é
// que o wrapper apenas repassa o conteúdo (o fade em si é CSS, não testável em jsdom).
vi.mock("next/navigation", () => ({ usePathname: () => "/documentos" }));

// Caso de teste documentado em
// docs/06-testes/casos-testes/componentes/transicao-de-tela.md (CT-105).
describe("TransicaoDeTela", () => {
  afterEach(cleanup);

  it("CT-105: renderiza o conteúdo da tela dentro do wrapper de transição", () => {
    render(
      <TransicaoDeTela>
        <p>Conteúdo da página</p>
      </TransicaoDeTela>,
    );

    expect(screen.getByText("Conteúdo da página")).toBeInTheDocument();
  });
});
