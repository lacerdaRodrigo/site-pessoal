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

/**
 * Paleta do `DotCategoria` (spec telas 1/2.4). Cores escolhidas para contrastar
 * tanto no tema claro quanto no escuro. A cor de cada categoria é DERIVADA do
 * nome (ver `corDaCategoria`), então não precisa ser guardada no banco — deixar
 * o usuário escolher/editar a cor fica para a V2 (aí entra uma coluna `cor`).
 */
export const PALETA_CATEGORIAS = [
  "#7c3aed", // roxo
  "#0ea5e9", // azul
  "#10b981", // verde
  "#f59e0b", // âmbar
  "#ef4444", // vermelho
  "#ec4899", // rosa
  "#14b8a6", // teal
  "#8b5cf6", // violeta
] as const;

/**
 * Cor determinística da categoria a partir do nome: mesmo nome → sempre a mesma
 * cor da paleta, ignorando espaços nas pontas e maiúsculas/minúsculas. É pura
 * (sem estado/banco), então o `DotCategoria` pode colorir a categoria onde quer
 * que ela apareça (cards, filtros) só com o nome em mãos.
 */
export function corDaCategoria(nome: string): string {
  const limpo = normalizarNomeCategoria(nome).toLowerCase();
  // Hash simples e estável (base 31, mantido em 32 bits) → índice na paleta.
  let hash = 0;
  for (let i = 0; i < limpo.length; i++) {
    hash = (hash * 31 + limpo.charCodeAt(i)) | 0;
  }
  return PALETA_CATEGORIAS[Math.abs(hash) % PALETA_CATEGORIAS.length];
}
