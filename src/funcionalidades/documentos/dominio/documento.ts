// Camada de domínio da funcionalidade Documentos.
// Tipos e regras PURAS: não sabem que o Supabase ou o Next.js existem.
// As validações aqui espelham os CHECKs da migration
// (supabase/migrations/20260707120200_criar_tabela_documentos.sql), para dar um
// erro amigável na aplicação antes de a requisição chegar no banco.

import type { Etiqueta } from "@/funcionalidades/etiquetas/dominio/etiqueta";

// Limite igual ao CHECK do banco (titulo text ... length(titulo) <= 255).
export const TAMANHO_MAXIMO_TITULO = 255;

/**
 * A entidade lógica Documento (formato limpo em camelCase que a aplicação usa).
 * A tradução das colunas do banco (snake_case: usuario_id, criado_em...) para
 * este formato é responsabilidade da camada `dados/` (repositório), não daqui.
 */
export type Documento = {
  id: string;
  usuarioId: string;
  categoriaId: string | null;
  titulo: string;
  conteudo: string;
  eFavorito: boolean;
  criadoEm: string;
  atualizadoEm: string;
  // Nome da categoria pai, DENORMALIZADO para exibição. É preenchido pela camada
  // de dados quando ela faz o join com `categorias`; opcional porque a entidade
  // pura não depende dele (a fonte da verdade do vínculo é `categoriaId`).
  categoriaNome?: string | null;
  // Etiquetas do documento, DENORMALIZADAS para exibição. Preenchidas pela camada
  // de dados a partir do join com `documento_etiquetas`/`etiquetas`. Opcional: a
  // fonte da verdade do vínculo é a tabela de junção, não este campo.
  etiquetas?: Etiqueta[];
};

/**
 * Título válido = não-vazio (ignorando espaços nas pontas) e no máximo 255
 * caracteres. Espelha `check (length(trim(titulo)) > 0 and length(titulo) <= 255)`.
 */
export function tituloValido(titulo: string): boolean {
  return titulo.trim().length > 0 && titulo.length <= TAMANHO_MAXIMO_TITULO;
}

/**
 * Conteúdo válido = não-vazio (ignorando espaços nas pontas).
 * Espelha `check (length(trim(conteudo)) > 0)` — decisão de exigir corpo.
 */
export function conteudoValido(conteudo: string): boolean {
  return conteudo.trim().length > 0;
}

/**
 * Decide o que o botão "Copiar" leva para a área de transferência (RF02.5).
 * - Se o conteúdo (Markdown) tem um ou mais blocos de código cercados por ```,
 *   junta APENAS o conteúdo desses blocos (o prompt/snippet em si), sem as
 *   cercas nem a linguagem — RF02.5.1.
 * - Se não há nenhum bloco de código, devolve o texto completo — RF02.5.2.
 * Função pura de propósito: toda a regra fica testável sem tocar no navegador.
 */
export function extrairCodigoParaCopiar(conteudo: string): string {
  const blocos: string[] = [];
  // ```lingua\n ...código... \n``` — a linguagem (opcional) é ignorada.
  const regex = /```[^\n]*\n([\s\S]*?)```/g;
  let encontrado: RegExpExecArray | null;
  while ((encontrado = regex.exec(conteudo)) !== null) {
    // Remove a quebra de linha final que antecede a cerca de fechamento.
    blocos.push(encontrado[1].replace(/\n$/, ""));
  }

  if (blocos.length === 0) {
    return conteudo;
  }
  return blocos.join("\n\n");
}
