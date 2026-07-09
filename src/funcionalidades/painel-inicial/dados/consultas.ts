import { criarClienteServidor } from "@/nucleo/supabase/servidor";
import { listarDocumentos } from "@/funcionalidades/documentos/dados/acoes";
import { listarCategorias } from "@/funcionalidades/categorias/dados/consultas";
import { listarEtiquetas } from "@/funcionalidades/etiquetas/dados/consultas";
import type { Documento } from "@/funcionalidades/documentos/dominio/documento";

// Camada de DADOS do Painel Inicial (Dashboard).
// Não define consultas próprias ao banco: COMPÕE as leituras que cada
// funcionalidade já expõe (documentos, categorias, etiquetas) num único resumo
// para a tela de Início. O RLS garante que tudo vem só do usuário logado.

export type ResumoPainel = {
  nome: string | null;
  email: string | null;
  totais: {
    documentos: number;
    categorias: number;
    etiquetas: number;
    favoritos: number;
  };
  favoritos: Documento[];
  recentes: Documento[];
};

// Quantos itens mostrar nas listas de acesso rápido (favoritos e recentes).
const LIMITE_LISTAS = 5;

/**
 * Monta o resumo da tela de Início: nome/e-mail do usuário, contadores gerais e
 * as listas curtas de favoritos e de documentos recentes. `listarDocumentos()`
 * já vem ordenado por `atualizado_em` desc, então os primeiros são os recentes.
 */
export async function carregarPainel(): Promise<ResumoPainel> {
  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [documentos, categorias, etiquetas] = await Promise.all([
    listarDocumentos(),
    listarCategorias(),
    listarEtiquetas(),
  ]);

  // Nome de exibição (opcional) — vem de `perfis`; o e-mail vem de auth.users.
  let nome: string | null = null;
  if (user) {
    const { data } = await supabase
      .from("perfis")
      .select("nome_completo")
      .eq("id", user.id)
      .maybeSingle();
    nome = (data?.nome_completo as string | null) ?? null;
  }

  const favoritos = documentos.filter((d) => d.eFavorito);

  return {
    nome,
    email: user?.email ?? null,
    totais: {
      documentos: documentos.length,
      categorias: categorias.length,
      etiquetas: etiquetas.length,
      favoritos: favoritos.length,
    },
    favoritos: favoritos.slice(0, LIMITE_LISTAS),
    recentes: documentos.slice(0, LIMITE_LISTAS),
  };
}
