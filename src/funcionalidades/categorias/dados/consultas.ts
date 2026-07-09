import { criarClienteServidor } from "@/nucleo/supabase/servidor";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  normalizarNomeCategoria,
  type Categoria,
} from "@/funcionalidades/categorias/dominio/categoria";

// Camada de DADOS da funcionalidade Categorias.
// São helpers de LEITURA/escrita chamados no servidor (por páginas e por outras
// Server Actions) — não são "use server" porque nunca são invocados direto do
// cliente. O RLS no banco já garante que cada usuário só vê as próprias
// categorias (auth.uid() = usuario_id).

type LinhaCategoria = {
  id: string;
  usuario_id: string;
  nome: string;
  criado_em: string;
};

function mapear(linha: LinhaCategoria): Categoria {
  return {
    id: linha.id,
    usuarioId: linha.usuario_id,
    nome: linha.nome,
    criadoEm: linha.criado_em,
  };
}

/** Lista as categorias do usuário logado, em ordem alfabética. */
export async function listarCategorias(): Promise<Categoria[]> {
  const supabase = await criarClienteServidor();
  const { data, error } = await supabase
    .from("categorias")
    .select("*")
    .order("nome", { ascending: true });

  if (error || !data) return [];
  return (data as LinhaCategoria[]).map(mapear);
}

// No ILIKE do Postgres, `%` e `_` são curingas. Um nome de categoria como "50%"
// ou "a_b" precisa ter esses caracteres escapados para casar de forma literal.
function escaparParaIlike(texto: string): string {
  return texto.replace(/[\\%_]/g, "\\$&");
}

/**
 * "Find-or-create": dado o NOME digitado pelo usuário, devolve o id de uma
 * categoria — reaproveitando uma já existente (comparação case-insensitive, que
 * espelha o índice único `lower(trim(nome))` do banco) ou criando uma nova.
 * Nome vazio significa "sem categoria" → devolve null.
 *
 * Recebe o `supabase` e o `usuarioId` de quem chama (a Server Action de
 * documentos) para não refazer o getUser/criar cliente à toa.
 */
export async function garantirCategoria(
  supabase: SupabaseClient,
  usuarioId: string,
  nomeBruto: string,
): Promise<string | null> {
  const nome = normalizarNomeCategoria(nomeBruto);
  if (!nome) return null;

  const alvo = escaparParaIlike(nome);

  const { data: existente } = await supabase
    .from("categorias")
    .select("id")
    .eq("usuario_id", usuarioId)
    .ilike("nome", alvo)
    .maybeSingle();
  if (existente) return existente.id as string;

  const { data: nova, error } = await supabase
    .from("categorias")
    .insert({ usuario_id: usuarioId, nome })
    .select("id")
    .single();
  if (!error && nova) return nova.id as string;

  // Corrida rara: a categoria pode ter sido criada em paralelo (o índice único
  // barra a duplicata). Re-seleciona para devolver o id da que venceu.
  const { data: reconsulta } = await supabase
    .from("categorias")
    .select("id")
    .eq("usuario_id", usuarioId)
    .ilike("nome", alvo)
    .maybeSingle();
  return (reconsulta?.id as string) ?? null;
}
