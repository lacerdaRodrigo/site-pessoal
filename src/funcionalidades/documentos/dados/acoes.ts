"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/nucleo/supabase/servidor";
import { garantirCategoria } from "@/funcionalidades/categorias/dados/consultas";
import {
  conteudoValido,
  tituloValido,
  type Documento,
} from "@/funcionalidades/documentos/dominio/documento";

// Camada de DADOS (repositório) da funcionalidade Documentos.
// É o "trabalho sujo": fala com o Supabase e traduz os dados para o domínio.
// O RLS no banco já garante que cada usuário só enxerga/mexe nos próprios
// documentos (auth.uid()); aqui não precisamos filtrar por usuario_id à mão nas
// leituras — mas na criação temos de preencher usuario_id explicitamente.

export type EstadoDocumento = {
  erro: string | null;
};

// Formato cru vindo do Postgres (snake_case). O `categorias` aninhado vem do
// join `select("*, categorias(nome)")` — é o nome da categoria pai (ou null).
type LinhaDocumento = {
  id: string;
  usuario_id: string;
  categoria_id: string | null;
  titulo: string;
  conteudo: string;
  e_favorito: boolean;
  criado_em: string;
  atualizado_em: string;
  categorias?: { nome: string } | null;
};

// Colunas + o join com a categoria pai (para exibir o nome sem uma 2ª consulta).
const SELECT_COM_CATEGORIA = "*, categorias(nome)";

// Traduz a linha do banco (snake_case) para a entidade do domínio (camelCase).
function mapear(linha: LinhaDocumento): Documento {
  return {
    id: linha.id,
    usuarioId: linha.usuario_id,
    categoriaId: linha.categoria_id,
    titulo: linha.titulo,
    conteudo: linha.conteudo,
    eFavorito: linha.e_favorito,
    criadoEm: linha.criado_em,
    atualizadoEm: linha.atualizado_em,
    categoriaNome: linha.categorias?.nome ?? null,
  };
}

// Filtros opcionais da listagem: busca por título (RF03.2) e categoria (RF03.1).
export type FiltrosDocumentos = {
  busca?: string;
  categoriaId?: string;
};

// No ILIKE, `%` e `_` são curingas — escapa-os para buscar o texto literal.
function escaparParaIlike(texto: string): string {
  return texto.replace(/[\\%_]/g, "\\$&");
}

export async function listarDocumentos(
  filtros: FiltrosDocumentos = {},
): Promise<Documento[]> {
  const supabase = await criarClienteServidor();
  let consulta = supabase
    .from("documentos")
    .select(SELECT_COM_CATEGORIA)
    .order("atualizado_em", { ascending: false });

  const busca = filtros.busca?.trim();
  if (busca) {
    consulta = consulta.ilike("titulo", `%${escaparParaIlike(busca)}%`);
  }
  if (filtros.categoriaId) {
    consulta = consulta.eq("categoria_id", filtros.categoriaId);
  }

  const { data, error } = await consulta;
  if (error || !data) return [];
  return (data as unknown as LinhaDocumento[]).map(mapear);
}

export async function obterDocumento(id: string): Promise<Documento | null> {
  const supabase = await criarClienteServidor();
  const { data, error } = await supabase
    .from("documentos")
    .select(SELECT_COM_CATEGORIA)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return mapear(data as unknown as LinhaDocumento);
}

export async function criarDocumento(
  _estadoAnterior: EstadoDocumento,
  formData: FormData,
): Promise<EstadoDocumento> {
  const titulo = String(formData.get("titulo") ?? "");
  const conteudo = String(formData.get("conteudo") ?? "");
  const categoria = String(formData.get("categoria") ?? "");

  // Mesmas regras do domínio (que espelham os CHECKs do banco): erro amigável
  // antes de ir ao Supabase.
  if (!tituloValido(titulo)) {
    return { erro: "O título precisa ter entre 1 e 255 caracteres." };
  }
  if (!conteudoValido(conteudo)) {
    return { erro: "O conteúdo não pode ficar vazio." };
  }

  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Contas antigas podem existir antes da trigger que cria `perfis` no signup.
  // Como `documentos.usuario_id` referencia `perfis.id`, garantimos a linha sem
  // sobrescrever perfil já existente.
  await supabase
    .from("perfis")
    .upsert({ id: user.id }, { onConflict: "id", ignoreDuplicates: true });

  // Categoria digitada (opcional): reaproveita a existente ou cria (RF03.1).
  const categoriaId = await garantirCategoria(supabase, user.id, categoria);

  const { data, error } = await supabase
    .from("documentos")
    .insert({ usuario_id: user.id, titulo, conteudo, categoria_id: categoriaId })
    .select("id")
    .single();

  if (error || !data) {
    return { erro: "Não foi possível criar o documento. Tente de novo." };
  }

  revalidatePath("/documentos");
  redirect(`/documentos/${data.id}`);
}

export async function atualizarDocumento(
  _estadoAnterior: EstadoDocumento,
  formData: FormData,
): Promise<EstadoDocumento> {
  const id = String(formData.get("id") ?? "");
  const titulo = String(formData.get("titulo") ?? "");
  const conteudo = String(formData.get("conteudo") ?? "");
  const categoria = String(formData.get("categoria") ?? "");

  if (!id) return { erro: "Documento inválido." };
  if (!tituloValido(titulo)) {
    return { erro: "O título precisa ter entre 1 e 255 caracteres." };
  }
  if (!conteudoValido(conteudo)) {
    return { erro: "O conteúdo não pode ficar vazio." };
  }

  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Categoria: vazia limpa o vínculo (categoria_id null); preenchida reaproveita
  // ou cria a categoria e atrela o documento (RF03.1).
  const categoriaId = await garantirCategoria(supabase, user.id, categoria);

  const { error } = await supabase
    .from("documentos")
    .update({ titulo, conteudo, categoria_id: categoriaId })
    .eq("id", id);

  if (error) {
    return { erro: "Não foi possível salvar as alterações." };
  }

  revalidatePath("/documentos");
  revalidatePath(`/documentos/${id}`);
  redirect(`/documentos/${id}`);
}

export async function excluirDocumento(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (id) {
    const supabase = await criarClienteServidor();
    await supabase.from("documentos").delete().eq("id", id);
    revalidatePath("/documentos");
  }
  redirect("/documentos");
}

export async function alternarFavorito(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const eFavoritoAtual = String(formData.get("eFavorito") ?? "") === "true";
  if (!id) return;

  const supabase = await criarClienteServidor();
  await supabase
    .from("documentos")
    .update({ e_favorito: !eFavoritoAtual })
    .eq("id", id);

  // Sem redirect: o botão vive tanto na lista quanto na tela de leitura. Só
  // revalidamos as duas rotas afetadas para que o usuário permaneça onde está
  // (a estrela apenas alterna no lugar) — RF03.3.
  revalidatePath("/documentos");
  revalidatePath(`/documentos/${id}`);
}
