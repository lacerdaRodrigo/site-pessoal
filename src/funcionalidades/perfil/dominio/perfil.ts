// Camada de domínio da funcionalidade Perfil.
// Tipos e regras PURAS: não sabem que o Supabase ou o Next.js existem.
// A tabela `perfis` (supabase/migrations/20260707120000_criar_tabela_perfis.sql)
// tem `nome_completo` como coluna NULLABLE (sem CHECK): o nome de exibição é
// OPCIONAL. Ainda assim aplicamos um teto de tamanho aqui, para dar um erro
// amigável na aplicação em vez de guardar um nome absurdamente longo.

// O e-mail NÃO mora em `perfis` — ele vive em `auth.users` (gerenciado pelo
// Supabase Auth). Por isso não faz parte desta entidade; a camada de dados o
// busca à parte, e ele é somente-leitura na tela.

export const TAMANHO_MAXIMO_NOME = 120;

/**
 * A entidade lógica Perfil (camelCase que a aplicação usa). A tradução das
 * colunas do banco (snake_case: nome_completo, criado_em) para este formato é
 * responsabilidade da camada `dados/`, não daqui.
 */
export type Perfil = {
  id: string;
  nomeCompleto: string | null;
  criadoEm: string;
};

/**
 * Nome válido = opcional (vazio é permitido, pois a coluna é nullable) e, se
 * preenchido, no máximo 120 caracteres.
 */
export function nomeValido(nome: string): boolean {
  return nome.trim().length <= TAMANHO_MAXIMO_NOME;
}

/**
 * Normaliza o nome para guardar: apara espaços das pontas e converte o vazio em
 * `null` (a coluna é nullable — "sem nome" é null, não string vazia).
 */
export function normalizarNome(nome: string): string | null {
  const limpo = nome.trim();
  return limpo.length > 0 ? limpo : null;
}
