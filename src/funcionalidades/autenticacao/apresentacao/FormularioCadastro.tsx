"use client";

import { useActionState } from "react";
import { cadastrar, type EstadoAutenticacao } from "../dados/acoes";
import estilos from "./formulario.module.css";

const estadoInicial: EstadoAutenticacao = { erro: null };

export function FormularioCadastro() {
  const [estado, executarAcao, emAndamento] = useActionState(
    cadastrar,
    estadoInicial,
  );

  if (estado.mensagem) {
    return (
      <div className={estilos.pagina}>
        <p className={estilos.sucesso}>{estado.mensagem}</p>
      </div>
    );
  }

  return (
    <div className={estilos.pagina}>
      <form action={executarAcao} className={estilos.formulario}>
        <h1>Criar conta</h1>

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
          autoComplete="new-password"
        />

        {estado.erro && (
          <p className={estilos.erro} role="alert">
            {estado.erro}
          </p>
        )}

        <button type="submit" disabled={emAndamento}>
          {emAndamento ? "Cadastrando..." : "Cadastrar"}
        </button>

        <p>
          Já tem conta? <a href="/login">Entrar</a>
        </p>
      </form>
    </div>
  );
}
