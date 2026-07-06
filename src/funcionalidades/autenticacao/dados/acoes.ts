"use server";

import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/nucleo/supabase/servidor";
import { emailValido, senhaValida } from "@/funcionalidades/autenticacao/dominio/validacoes";

export type EstadoAutenticacao = {
  erro: string | null;
  mensagem?: string;
};

export async function entrar(
  _estadoAnterior: EstadoAutenticacao,
  formData: FormData,
): Promise<EstadoAutenticacao> {
  const email = String(formData.get("email") ?? "");
  const senha = String(formData.get("senha") ?? "");

  if (!emailValido(email)) {
    return { erro: "Informe um e-mail válido." };
  }
  if (!senhaValida(senha)) {
    return { erro: "A senha precisa ter pelo menos 8 caracteres." };
  }

  const supabase = await criarClienteServidor();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error) {
    return { erro: "E-mail ou senha incorretos." };
  }

  redirect("/");
}

export async function cadastrar(
  _estadoAnterior: EstadoAutenticacao,
  formData: FormData,
): Promise<EstadoAutenticacao> {
  const email = String(formData.get("email") ?? "");
  const senha = String(formData.get("senha") ?? "");

  if (!emailValido(email)) {
    return { erro: "Informe um e-mail válido." };
  }
  if (!senhaValida(senha)) {
    return { erro: "A senha precisa ter pelo menos 8 caracteres." };
  }

  const urlDoSite =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const supabase = await criarClienteServidor();
  const { error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: {
      emailRedirectTo: `${urlDoSite}/auth/confirmado`,
    },
  });

  if (error) {
    return { erro: error.message };
  }

  return {
    erro: null,
    mensagem:
      "Cadastro realizado! Verifique seu e-mail para confirmar a conta antes de entrar.",
  };
}
