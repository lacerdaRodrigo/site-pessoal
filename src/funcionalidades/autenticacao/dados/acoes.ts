"use server";

import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/nucleo/supabase/servidor";
import { emailValido, senhaValida } from "@/funcionalidades/autenticacao/dominio/validacoes";

export type EstadoAutenticacao = {
  erro: string | null;
  mensagem?: string;
};

function obterUrlDoSite(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000")
  );
}

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

  const supabase = await criarClienteServidor();
  const { error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: {
      emailRedirectTo: `${obterUrlDoSite()}/auth/confirmado`,
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

export async function sair() {
  const supabase = await criarClienteServidor();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function solicitarRedefinicaoSenha(
  _estadoAnterior: EstadoAutenticacao,
  formData: FormData,
): Promise<EstadoAutenticacao> {
  const email = String(formData.get("email") ?? "");

  if (!emailValido(email)) {
    return { erro: "Informe um e-mail válido." };
  }

  const supabase = await criarClienteServidor();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${obterUrlDoSite()}/auth/confirm?type=recovery&next=/redefinir-senha`,
  });

  // Mensagem sempre igual, exista ou não o e-mail (RF01.4 segue a mesma
  // proteção anti-enumeração do cadastro — ver docs/04-backend/01-supabase-e-seguranca.md).
  return {
    erro: null,
    mensagem:
      "Se esse e-mail existir na nossa base, enviamos um link para redefinir a senha.",
  };
}

export async function redefinirSenha(
  _estadoAnterior: EstadoAutenticacao,
  formData: FormData,
): Promise<EstadoAutenticacao> {
  const novaSenha = String(formData.get("senha") ?? "");

  if (!senhaValida(novaSenha)) {
    return { erro: "A senha precisa ter pelo menos 8 caracteres." };
  }

  const supabase = await criarClienteServidor();
  const { error } = await supabase.auth.updateUser({ password: novaSenha });

  if (error) {
    return {
      erro:
        "Não foi possível redefinir a senha. O link pode ter expirado — solicite um novo.",
    };
  }

  redirect("/login");
}
