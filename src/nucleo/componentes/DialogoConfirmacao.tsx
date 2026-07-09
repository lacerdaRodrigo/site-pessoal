"use client";

import { useEffect, useRef } from "react";
import estilos from "./dialogoConfirmacao.module.css";

// Modal de confirmação reutilizável (spec telas, seção 1). Substitui o
// confirm() nativo do navegador por um diálogo do próprio app, com variante
// "perigo" para ações destrutivas (ex: excluir documento — RF02.4). Fecha no
// Esc, no botão Cancelar e ao clicar fora (no fundo). É controlado por quem usa:
// `aberto` liga/desliga e os callbacks decidem o que cada botão faz.
export function DialogoConfirmacao({
  aberto,
  titulo,
  mensagem,
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
  variante = "normal",
  onConfirmar,
  onCancelar,
}: {
  aberto: boolean;
  titulo: string;
  mensagem?: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  variante?: "normal" | "perigo";
  onConfirmar: () => void;
  onCancelar: () => void;
}) {
  const confirmarRef = useRef<HTMLButtonElement>(null);

  // Ao abrir: foca o botão de confirmar e liga o Esc para cancelar.
  useEffect(() => {
    if (!aberto) return;
    confirmarRef.current?.focus();
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancelar();
    };
    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [aberto, onCancelar]);

  if (!aberto) return null;

  return (
    <div className={estilos.overlay}>
      {/* Fundo clicável (botão para ser acessível por teclado, não um <div>). */}
      <button
        type="button"
        className={estilos.fundo}
        aria-label={textoCancelar}
        onClick={onCancelar}
      />
      <div
        className={estilos.caixa}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialogo-titulo"
      >
        <h2 id="dialogo-titulo" className={estilos.titulo}>
          {titulo}
        </h2>
        {mensagem && <p className={estilos.mensagem}>{mensagem}</p>}
        <div className={estilos.acoes}>
          <button
            type="button"
            className={estilos.botaoCancelar}
            onClick={onCancelar}
          >
            {textoCancelar}
          </button>
          <button
            ref={confirmarRef}
            type="button"
            className={`${estilos.botaoConfirmar} ${
              variante === "perigo" ? estilos.perigo : ""
            }`}
            onClick={onConfirmar}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
