"use client";

import { useActionState } from "react";
import { redefinirSenha, type EstadoAutenticacao } from "../dados/acoes";
import estilos from "./formulario.module.css";

const estadoInicial: EstadoAutenticacao = { erro: null };

export function FormularioRedefinirSenha() {
  const [estado, executarAcao, emAndamento] = useActionState(
    redefinirSenha,
    estadoInicial,
  );

  return (
    <div className={estilos.pagina}>
      <div className={estilos.cartao}>
        <div className={estilos.logo}>K</div>
        <h1 className={estilos.titulo}>Nova senha</h1>

        <form action={executarAcao} className={estilos.formulario}>
          <label htmlFor="senha">Nova senha</label>
          <input
            id="senha"
            name="senha"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />

          {estado.erro && (
            <p className={estilos.erro} role="alert">
              {estado.erro}
            </p>
          )}

          <button type="submit" disabled={emAndamento}>
            {emAndamento ? "Salvando..." : "Salvar nova senha"}
          </button>
        </form>

        <p className={estilos.rodape}>v0.1.0</p>
      </div>
    </div>
  );
}
