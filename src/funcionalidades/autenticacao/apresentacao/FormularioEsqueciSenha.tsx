"use client";

import { useActionState } from "react";
import { solicitarRedefinicaoSenha, type EstadoAutenticacao } from "../dados/acoes";
import estilos from "./formulario.module.css";

const estadoInicial: EstadoAutenticacao = { erro: null };

export function FormularioEsqueciSenha() {
  const [estado, executarAcao, emAndamento] = useActionState(
    solicitarRedefinicaoSenha,
    estadoInicial,
  );

  if (estado.mensagem) {
    return (
      <div className={estilos.pagina}>
        <div className={estilos.cartao}>
          <div className={estilos.logo}>K</div>
          <p className={estilos.sucesso}>{estado.mensagem}</p>
          <p className={estilos.linkSecundario}>
            <a href="/login">Voltar para o login</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={estilos.pagina}>
      <div className={estilos.cartao}>
        <div className={estilos.logo}>K</div>
        <h1 className={estilos.titulo}>Esqueci minha senha</h1>

        <form action={executarAcao} className={estilos.formulario}>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
          />

          {estado.erro && (
            <p className={estilos.erro} role="alert">
              {estado.erro}
            </p>
          )}

          <button type="submit" disabled={emAndamento}>
            {emAndamento ? "Enviando..." : "Enviar link de redefinição"}
          </button>
        </form>

        <p className={estilos.linkSecundario}>
          <a href="/login">Voltar para o login</a>
        </p>

        <p className={estilos.rodape}>v0.1.0</p>
      </div>
    </div>
  );
}
