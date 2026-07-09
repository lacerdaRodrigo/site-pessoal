// Camada de domínio da funcionalidade Categorias.
// Tipos e regras PURAS: não sabem que o Supabase ou o Next.js existem.
// A tabela `categorias` (supabase/migrations/20260707120100_criar_tabela_categorias.sql)
// só exige `nome` não-vazio (sem limite de tamanho no banco). Aqui aplicamos um
// teto de tamanho na aplicação para dar um erro amigável antes de ir ao banco —
// a regra do app pode ser MAIS estrita que a do banco, nunca mais frouxa.

export const TAMANHO_MAXIMO_NOME_CATEGORIA = 60;

/**
 * A entidade lógica Categoria (camelCase que a aplicação usa). A tradução das
 * colunas do banco (snake_case: usuario_id, criado_em) para este formato é
 * responsabilidade da camada `dados/`, não daqui.
 */
export type Categoria = {
  id: string;
  usuarioId: string;
  nome: string;
  criadoEm: string;
};

/**
 * Nome de categoria válido = não-vazio (ignorando espaços nas pontas) e no
 * máximo 60 caracteres. Espelha `check (length(trim(nome)) > 0)` do banco, com o
 * teto de tamanho adicional da aplicação.
 */
export function nomeCategoriaValido(nome: string): boolean {
  const limpo = nome.trim();
  return limpo.length > 0 && limpo.length <= TAMANHO_MAXIMO_NOME_CATEGORIA;
}

/**
 * Normaliza o nome da categoria para guardar/comparar: apara os espaços das
 * pontas. O vazio vira string vazia — quem chama decide que "vazio" significa
 * "sem categoria" (o documento fica com categoria_id null).
 */
export function normalizarNomeCategoria(nome: string): string {
  return nome.trim();
}
