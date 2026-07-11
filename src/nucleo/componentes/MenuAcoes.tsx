"use client";

import { useEffect, useRef, useState } from "react";
import estilos from "./menuAcoes.module.css";

export type ItemAcao = {
  rotulo: string;
  onSelecionar: () => void;
  variante?: "normal" | "perigo";
};

// Menu "..." de ações contextuais (spec telas 2.4). Um gatilho "⋯" revela uma
// lista de ações (ex: Excluir na lista de documentos). Fecha ao escolher uma
// ação, com Esc e ao clicar fora. É genérico: quem usa passa os itens e o que
// cada um faz; ações destrutivas usam a variante "perigo" (texto em vermelho).
export function MenuAcoes({
  itens,
  rotulo = "Ações",
}: {
  itens: ItemAcao[];
  rotulo?: string;
}) {
  const [aberto, setAberto] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  // Com o menu aberto: fecha ao clicar fora ou pressionar Esc (padrão de overlay).
  useEffect(() => {
    if (!aberto) return;
    const aoClicarFora = (e: MouseEvent) => {
      if (!container.current?.contains(e.target as Node)) setAberto(false);
    };
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false);
    };
    document.addEventListener("mousedown", aoClicarFora);
    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.removeEventListener("mousedown", aoClicarFora);
      document.removeEventListener("keydown", aoTeclar);
    };
  }, [aberto]);

  return (
    <div className={estilos.container} ref={container}>
      <button
        type="button"
        className={estilos.gatilho}
        aria-haspopup="menu"
        aria-expanded={aberto}
        aria-label={rotulo}
        onClick={() => setAberto((v) => !v)}
      >
        ⋯
      </button>

      {aberto && (
        <div className={estilos.menu} role="menu" aria-label={rotulo}>
          {itens.map((item) => (
            <button
              key={item.rotulo}
              type="button"
              role="menuitem"
              className={`${estilos.item} ${
                item.variante === "perigo" ? estilos.perigo : ""
              }`}
              onClick={() => {
                setAberto(false);
                item.onSelecionar();
              }}
            >
              {item.rotulo}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
