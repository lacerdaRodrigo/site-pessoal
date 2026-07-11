"use client";

import { useRef, useState } from "react";
import { excluirDocumento } from "../dados/acoes";
import { MenuAcoes } from "@/nucleo/componentes/MenuAcoes";
import { DialogoConfirmacao } from "@/nucleo/componentes/DialogoConfirmacao";

// Menu "..." de ações de um item da lista (spec telas 2.4). Hoje só "Excluir":
// abre o DialogoConfirmacao (RF02.4) e, confirmando, envia a Server Action de
// exclusão. O toast de "excluído" aparece após o redirect (via ?aviso=excluido,
// tratado pelo componente Toasts na casca autenticada).
export function AcoesDocumento({ id }: { id: string }) {
  const [confirmando, setConfirmando] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <MenuAcoes
        rotulo="Ações do documento"
        itens={[
          {
            rotulo: "Excluir",
            variante: "perigo",
            onSelecionar: () => setConfirmando(true),
          },
        ]}
      />

      {/* Form escondido: só carrega a Server Action; o disparo vem do diálogo. */}
      <form action={excluirDocumento} ref={formRef} hidden>
        <input type="hidden" name="id" value={id} />
      </form>

      <DialogoConfirmacao
        aberto={confirmando}
        titulo="Excluir documento?"
        mensagem="Esta ação não pode ser desfeita."
        textoConfirmar="Excluir"
        variante="perigo"
        onConfirmar={() => {
          setConfirmando(false);
          formRef.current?.requestSubmit();
        }}
        onCancelar={() => setConfirmando(false)}
      />
    </>
  );
}
