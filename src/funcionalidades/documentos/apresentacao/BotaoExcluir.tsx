"use client";

import { excluirDocumento } from "../dados/acoes";
import estilos from "./documentos.module.css";

// Exclusão do documento com confirmação (RF02.4). Fica na visualização, junto
// das demais ações do documento. Form separado que chama a Server Action.
export function BotaoExcluir({ id }: { id: string }) {
  return (
    <form
      action={excluirDocumento}
      onSubmit={(e) => {
        if (
          !confirm(
            "Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita.",
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className={estilos.botaoExcluir}>
        Excluir
      </button>
    </form>
  );
}
