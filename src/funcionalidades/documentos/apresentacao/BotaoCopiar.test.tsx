import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BotaoCopiar } from "./BotaoCopiar";

const writeText = vi.fn().mockResolvedValue(undefined);

describe("BotaoCopiar", () => {
  beforeEach(() => {
    writeText.mockClear();
    // jsdom não implementa a clipboard; injetamos um mock. Usamos fireEvent
    // (não userEvent) porque o userEvent.setup() instala o próprio stub de
    // clipboard e substituiria este mock.
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
  });

  afterEach(cleanup);

  it("CT-44: copia só o bloco de código e mostra 'Copiado!' (RF02.5.1/5.3)", async () => {
    render(<BotaoCopiar conteudo={"Explicação\n\n```sql\nSELECT 1;\n```"} />);

    fireEvent.click(screen.getByRole("button", { name: "Copiar código" }));

    expect(writeText).toHaveBeenCalledWith("SELECT 1;");
    expect(await screen.findByText("Copiado!")).toBeInTheDocument();
  });

  it("CT-45: sem bloco de código, copia o texto completo (RF02.5.2)", async () => {
    const conteudo = "Só um texto comum, sem código.";
    render(<BotaoCopiar conteudo={conteudo} />);

    fireEvent.click(screen.getByRole("button", { name: "Copiar código" }));

    expect(writeText).toHaveBeenCalledWith(conteudo);
    expect(await screen.findByText("Copiado!")).toBeInTheDocument();
  });
});
