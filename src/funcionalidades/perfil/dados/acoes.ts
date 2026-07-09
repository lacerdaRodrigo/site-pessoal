"use server";

import { revalidatePath } from "next/cache";
import { criarClienteServidor } from "@/nucleo/supabase/servidor";
import {
  nomeValido,
  normalizarNome,
  type Perfil,
} from "@/funcionalidades/perfil/dominio/perfil";

// Camada de DADOS (repositório) da funcionalidade Perfil.
// Fala com o Supabase e traduz os dados para o domínio. O RLS no banco já
// garante que cada usuário só lê/edita o próprio perfil (auth.uid() = id), então
// não precisamos filtrar por id à mão — mas precisamos do usuário logado para
// saber a qual linha aplicar o update.

export type EstadoPerfil = {
  erro: string | null;
  mensagem?: string;
};

// Formato cru vindo do Postgres (snake_case).
type LinhaPerfil = {
  id: string;
  nome_completo: string | null;
  criado_em: string;
};

function mapear(linha: LinhaPerfil): Perfil {
  return {
    id: linha.id,
    nomeCompleto: linha.nome_completo,
    criadoEm: linha.criado_em,
  };
}

/**
 * Carrega o perfil do usuário logado + o e-mail (que vem de `auth.users`, não de
 * `perfis`). A tela de Configurações precisa dos dois, então buscamos juntos
 * para evitar duas idas ao servidor.
 */
export async function carregarDadosDoPerfil(): Promise<{
  perfil: Perfil | null;
  email: string | null;
}> {
  const supabase = await criarClienteServidor();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { perfil: null, email: null };

  const { data, error } = await supabase
    .from("perfis")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const perfil = error || !data ? null : mapear(data as LinhaPerfil);
  return { perfil, email: user.email ?? null };
}

/**
 * Atualiza o nome de exibição do usuário logado. Segue o mesmo contrato de
 * `useActionState` da autenticação (estado anterior + FormData).
 */
export async function atualizarPerfil(
  _estadoAnterior: EstadoPerfil,
  formData: FormData,
): Promise<EstadoPerfil> {
  const nome = String(formData.get("nomeCompleto") ?? "");

  if (!nomeValido(nome)) {
    return { erro: "O nome pode ter no máximo 120 caracteres." };
  }

  const supabase = await criarClienteServidor();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { erro: "Sua sessão expirou. Entre novamente." };
  }

  // `upsert` cobre contas criadas antes da migration/trigger de perfis: se a
  // linha ainda não existe, ela é criada; se já existe, apenas o nome muda.
  const { error } = await supabase.from("perfis").upsert(
    {
      id: user.id,
      nome_completo: normalizarNome(nome),
    },
    { onConflict: "id" },
  );

  if (error) {
    return { erro: "Não foi possível salvar. Tente novamente." };
  }

  // Revalida a página para refletir o nome recém-salvo.
  revalidatePath("/configuracoes");
  return { erro: null, mensagem: "Perfil atualizado!" };
}
