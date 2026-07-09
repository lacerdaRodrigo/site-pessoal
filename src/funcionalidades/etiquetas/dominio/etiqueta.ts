// Camada de domínio da funcionalidade Etiquetas (tags).
// Tipos e regras PURAS: não sabem que o Supabase ou o Next.js existem.
// A tabela `etiquetas` (supabase/migrations/20260707120300_criar_tabelas_etiquetas.sql)
// só exige `nome` não-vazio (sem limite de tamanho no banco). Aqui aplicamos um
// teto de tamanho na aplicação para dar um erro amigável antes de ir ao banco —
// a regra do app pode ser MAIS estrita que a do banco, nunca mais frouxa.

// Etiquetas são rótulos curtos (ex: "testes", "dart"); teto menor que o de
// categorias (60), que são "pastas" com nomes maiores.
export const TAMANHO_MAXIMO_NOME_ETIQUETA = 40;

/**
 * A entidade lógica Etiqueta (camelCase que a aplicação usa). A tradução das
 * colunas do banco (snake_case: usuario_id) para este formato é responsabilidade
 * da camada `dados/`, não daqui.
 */
export type Etiqueta = {
  id: string;
  usuarioId: string;
  nome: string;
};

/**
 * Normaliza o nome da etiqueta para guardar/comparar: apara os espaços das
 * pontas e remove um "#" inicial (o usuário costuma digitar "#dart", mas o "#"
 * é enfeite — guardamos "dart" para que "#dart" e "dart" sejam a mesma etiqueta).
 * O vazio vira string vazia — quem chama decide o que fazer com isso.
 */
export function normalizarNomeEtiqueta(nome: string): string {
  return nome.trim().replace(/^#+/, "").trim();
}

/**
 * Nome de etiqueta válido = não-vazio (ignorando espaços e "#" das pontas) e no
 * máximo 40 caracteres. Espelha `check (length(trim(nome)) > 0)` do banco, com o
 * teto de tamanho adicional da aplicação. Valida o nome JÁ NORMALIZADO.
 */
export function nomeEtiquetaValido(nome: string): boolean {
  const limpo = normalizarNomeEtiqueta(nome);
  return limpo.length > 0 && limpo.length <= TAMANHO_MAXIMO_NOME_ETIQUETA;
}

/**
 * Transforma o texto do campo de etiquetas (separado por vírgulas) na lista de
 * nomes normalizados a salvar. Regras:
 * - separa por vírgula;
 * - normaliza cada nome (trim + tira "#");
 * - descarta os vazios e os que passam do tamanho máximo;
 * - remove duplicatas de forma case-insensitive (mantém a 1ª grafia digitada),
 *   espelhando o índice único `lower(trim(nome))` do banco.
 * Ex: "#dart, Dart , testes," → ["dart", "testes"].
 */
export function separarEtiquetas(texto: string): string[] {
  const vistos = new Set<string>();
  const resultado: string[] = [];

  for (const bruto of texto.split(",")) {
    const nome = normalizarNomeEtiqueta(bruto);
    if (!nome || nome.length > TAMANHO_MAXIMO_NOME_ETIQUETA) continue;

    const chave = nome.toLowerCase();
    if (vistos.has(chave)) continue;
    vistos.add(chave);
    resultado.push(nome);
  }

  return resultado;
}

/**
 * Junta uma lista de etiquetas no texto do campo (o inverso de separarEtiquetas),
 * para preencher o formulário na edição. Ex: [{nome:"dart"},{nome:"testes"}]
 * → "dart, testes".
 */
export function juntarEtiquetas(etiquetas: Etiqueta[]): string {
  return etiquetas.map((e) => e.nome).join(", ");
}
