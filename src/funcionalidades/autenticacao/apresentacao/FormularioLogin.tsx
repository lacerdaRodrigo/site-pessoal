"use client";

import { useActionState } from "react";
import { entrar, type EstadoAutenticacao } from "../dados/acoes";
import estilos from "./formulario.module.css";

const estadoInicial: EstadoAutenticacao = { erro: null };

export function FormularioLogin() {
  const [estado, executarAcao, emAndamento] = useActionState(
    entrar,
    estadoInicial,
  );

  return (
    <div className={estilos.pagina}>
      <div className={estilos.cartao}>
        <div className={estilos.logo}>K</div>
        <h1 className={estilos.titulo}>Entrar</h1>

        <form action={executarAcao} className={estilos.formulario}>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
          />

          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            name="senha"
            type="password"
            required
            minLength={8}
            autoComplete="current-password"
          />

          {estado.erro && (
            <p className={estilos.erro} role="alert">
              {estado.erro}
            </p>
          )}

          <button type="submit" disabled={emAndamento}>
            {emAndamento ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className={estilos.linkSecundario}>
          <a href="/esqueci-senha">Esqueceu a senha?</a>
        </p>
        <p className={estilos.linkSecundario}>
          Não tem conta? <a href="/cadastro">Cadastre-se</a>
        </p>

        <p className={estilos.rodape}>v0.1.0</p>
      </div>
    </div>
  );
}
