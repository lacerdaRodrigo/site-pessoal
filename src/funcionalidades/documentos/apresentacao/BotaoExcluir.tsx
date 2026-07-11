"use client";

import { useRef, useState } from "react";
import { excluirDocumento } from "../dados/acoes";
import { DialogoConfirmacao } from "@/nucleo/componentes/DialogoConfirmacao";
import estilos from "./documentos.module.css";

// Exclusão do documento com confirmação (RF02.4). Troca o confirm() nativo pelo
// DialogoConfirmacao do próprio app (spec telas 2.5): o botão só abre o modal; o
// confirmar envia o form que chama a Server Action. O toast de "excluído"
// aparece depois do redirect, pelo componente Toasts (via ?aviso=excluido).
export function BotaoExcluir({ id }: { id: string }) {
  const [aberto, setAberto] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <form action={excluirDocumento} ref={formRef}>
        <input type="hidden" name="id" value={id} />
        <button
          type="button"
          className={estilos.botaoExcluir}
          onClick={() => setAberto(true)}
        >
          Excluir
        </button>
      </form>

      <DialogoConfirmacao
        aberto={aberto}
        titulo="Excluir documento?"
        mensagem="Esta ação não pode ser desfeita."
        textoConfirmar="Excluir"
        variante="perigo"
        onConfirmar={() => {
          setAberto(false);
          formRef.current?.requestSubmit();
        }}
        onCancelar={() => setAberto(false)}
      />
    </>
  );
}
