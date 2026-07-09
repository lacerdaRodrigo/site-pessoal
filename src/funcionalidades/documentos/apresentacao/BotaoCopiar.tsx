"use client";

import { useState } from "react";
import { extrairCodigoParaCopiar } from "../dominio/documento";
import estilos from "./documentos.module.css";

// Botão "Copiar" da visualização (RF02.5). A regra do QUE copiar (blocos de
// código ou texto todo) mora no domínio; aqui é só o efeito colateral de
// navegador (clipboard) e o feedback visual temporário (RF02.5.3).
export function BotaoCopiar({ conteudo }: { conteudo: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    await navigator.clipboard.writeText(extrairCodigoParaCopiar(conteudo));
    setCopiado(true);
    // Volta ao estado normal depois de ~1,6s (RF02.5.3).
    setTimeout(() => setCopiado(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copiar}
      className={
        copiado ? `${estilos.botaoCopiar} ${estilos.copiado}` : estilos.botaoCopiar
      }
    >
      {copiado ? "Copiado!" : "Copiar código"}
    </button>
  );
}
