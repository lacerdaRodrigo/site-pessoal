"use client";

import { ROTULOS_TEMA, TEMAS } from "@/nucleo/tema/tema";
import { useTema } from "@/nucleo/tema/ProvedorDeTema";
import estilos from "./perfil.module.css";

// Seletor de aparência: três botões (Claro / Escuro / Sistema). O botão do tema
// ativo fica destacado. A troca é instantânea e persistida pelo ProvedorDeTema.
export function SeletorDeTema() {
  const { tema, definirTema } = useTema();

  return (
    <div
      className={estilos.seletorTema}
      role="radiogroup"
      aria-label="Tema da interface"
    >
      {TEMAS.map((opcao) => (
        <button
          key={opcao}
          type="button"
          role="radio"
          aria-checked={tema === opcao}
          className={`${estilos.opcaoTema} ${
            tema === opcao ? estilos.opcaoTemaAtiva : ""
          }`}
          onClick={() => definirTema(opcao)}
        >
          {ROTULOS_TEMA[opcao]}
        </button>
      ))}
    </div>
  );
}
