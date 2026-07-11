import { criarClienteServidor } from "@/nucleo/supabase/servidor";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  normalizarNomeEtiqueta,
  type Etiqueta,
} from "@/funcionalidades/etiquetas/dominio/etiqueta";

// Camada de DADOS da funcionalidade Etiquetas.
// Helpers de LEITURA/escrita chamados no servidor (por páginas e por outras
// Server Actions) — não são "use server" porque nunca são invocados direto do
// cliente. O RLS no banco já garante que cada usuário só vê/mexe nas próprias
// etiquetas (auth.uid() = usuario_id).

type LinhaEtiqueta = {
  id: string;
  usuario_id: string;
  nome: string;
};

function mapear(linha: LinhaEtiqueta): Etiqueta {
  return {
    id: linha.id,
    usuarioId: linha.usuario_id,
    nome: linha.nome,
  };
}

/** Lista as etiquetas do usuário logado, em ordem alfabética. */
export async function listarEtiquetas(): Promise<Etiqueta[]> {
  const supabase = await criarClienteServidor();
  const { data, error } = await supabase
    .from("etiquetas")
    .select("*")
    .order("nome", { ascending: true });

  if (error || !data) return [];
  return (data as LinhaEtiqueta[]).map(mapear);
}

// No ILIKE do Postgres, `%` e `_` são curingas. Um nome de etiqueta com esses
// caracteres precisa tê-los escapados para casar de forma literal.
function escaparParaIlike(texto: string): string {
  return texto.replace(/[\\%_]/g, "\\$&");
}

/**
 * "Find-or-create": dado o NOME (já normalizado) de uma etiqueta, devolve o id —
 * reaproveitando uma já existente (comparação case-insensitive, que espelha o
 * índice único `lower(trim(nome))` do banco) ou criando uma nova. Devolve null
 * se o nome for vazio ou se algo der errado. Recebe o `supabase` e o `usuarioId`
 * de quem chama para não refazer o getUser/criar cliente à toa.
 */
async function garantirEtiqueta(
  supabase: SupabaseClient,
  usuarioId: string,
  nomeBruto: string,
): Promise<string | null> {
  const nome = normalizarNomeEtiqueta(nomeBruto);
  if (!nome) return null;

  const alvo = escaparParaIlike(nome);

  const { data: existente } = await supabase
    .from("etiquetas")
    .select("id")
    .eq("usuario_id", usuarioId)
    .ilike("nome", alvo)
    .maybeSingle();
  if (existente) return existente.id as string;

  const { data: nova, error } = await supabase
    .from("etiquetas")
    .insert({ usuario_id: usuarioId, nome })
    .select("id")
    .single();
  if (!error && nova) return nova.id as string;

  // Corrida rara: a etiqueta pode ter sido criada em paralelo (o índice único
  // barra a duplicata). Re-seleciona para devolver o id da que venceu.
  const { data: reconsulta } = await supabase
    .from("etiquetas")
    .select("id")
    .eq("usuario_id", usuarioId)
    .ilike("nome", alvo)
    .maybeSingle();
  return (reconsulta?.id as string) ?? null;
}

/**
 * Sincroniza as etiquetas de um documento com a lista de nomes recebida:
 * resolve cada nome para um id (find-or-create) e REESCREVE os vínculos na
 * junção `documento_etiquetas` (apaga os antigos, insere os novos). É a única
 * forma de o documento passar a "ter exatamente estas etiquetas". Simples e
 * suficiente para uso single-user; o RLS garante que só mexemos no que é nosso.
 */
export async function sincronizarEtiquetas(
  supabase: SupabaseClient,
  usuarioId: string,
  documentoId: string,
  nomes: string[],
): Promise<void> {
  const ids: string[] = [];
  for (const nome of nomes) {
    const id = await garantirEtiqueta(supabase, usuarioId, nome);
    if (id) ids.push(id);
  }

  // Limpa os vínculos atuais deste documento antes de recriar o conjunto.
  await supabase
    .from("documento_etiquetas")
    .delete()
    .eq("documento_id", documentoId);

  if (ids.length === 0) return;

  await supabase.from("documento_etiquetas").insert(
    ids.map((etiquetaId) => ({
      documento_id: documentoId,
      etiqueta_id: etiquetaId,
    })),
  );
}

/**
 * Devolve os ids dos documentos que têm a etiqueta informada — usado pelo filtro
 * por etiqueta da listagem (RF03.1/organização). Lista vazia = nenhum documento.
 */
export async function idsDocumentosComEtiqueta(
  etiquetaId: string,
): Promise<string[]> {
  const supabase = await criarClienteServidor();
  const { data, error } = await supabase
    .from("documento_etiquetas")
    .select("documento_id")
    .eq("etiqueta_id", etiquetaId);

  if (error || !data) return [];
  return (data as { documento_id: string }[]).map((l) => l.documento_id);
}

/**
 * Ids dos documentos que têm ALGUMA etiqueta cujo nome casa parcialmente com o
 * termo (ILIKE) — usado pela busca global, que também procura por etiqueta
 * (RF03.2). O `!inner` no embed transforma o join em filtrável: só voltam as
 * junções cuja etiqueta bate. O RLS restringe tudo ao usuário logado.
 */
export async function idsDocumentosComEtiquetaLike(
  termo: string,
): Promise<string[]> {
  const supabase = await criarClienteServidor();
  const alvo = `%${escaparParaIlike(termo)}%`;
  const { data, error } = await supabase
    .from("documento_etiquetas")
    .select("documento_id, etiquetas!inner(nome)")
    .ilike("etiquetas.nome", alvo);

  if (error || !data) return [];
  return (data as { documento_id: string }[]).map((l) => l.documento_id);
}
