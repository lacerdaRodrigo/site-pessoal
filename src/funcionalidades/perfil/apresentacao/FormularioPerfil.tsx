"use client";

import { useActionState } from "react";
import { atualizarPerfil, type EstadoPerfil } from "../dados/acoes";
import { TAMANHO_MAXIMO_NOME } from "../dominio/perfil";
import estilos from "./perfil.module.css";

const estadoInicial: EstadoPerfil = { erro: null };

type Props = {
  nomeCompleto: string | null;
  email: string | null;
};

export function FormularioPerfil({ nomeCompleto, email }: Props) {
  const [estado, executarAcao, emAndamento] = useActionState(
    atualizarPerfil,
    estadoInicial,
  );

  return (
    <form action={executarAcao} className={estilos.formulario}>
      <label htmlFor="email">E-mail</label>
      <input
        id="email"
        name="email"
        type="email"
        value={email ?? ""}
        readOnly
        disabled
        aria-describedby="email-ajuda"
      />
      <p id="email-ajuda" className={estilos.ajuda}>
        O e-mail é usado para login e não pode ser alterado aqui.
      </p>

      <label htmlFor="nomeCompleto">Nome de exibição</label>
      <input
        id="nomeCompleto"
        name="nomeCompleto"
        type="text"
        defaultValue={nomeCompleto ?? ""}
        maxLength={TAMANHO_MAXIMO_NOME}
        autoComplete="name"
        placeholder="Como você quer ser chamado"
      />

      {estado.erro && (
        <p className={estilos.erro} role="alert">
          {estado.erro}
        </p>
      )}
      {estado.mensagem && (
        <p className={estilos.sucesso} role="status">
          {estado.mensagem}
        </p>
      )}

      <button type="submit" disabled={emAndamento}>
        {emAndamento ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
