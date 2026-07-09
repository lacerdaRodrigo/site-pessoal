// Núcleo — Sistema de Tema (claro / escuro / sistema).
// Aqui mora apenas a LÓGICA PURA e as constantes: nada de React nem de DOM,
// para ser testável isoladamente (Vitest) e reutilizável tanto no provider
// (navegador) quanto no script anti-flash injetado no <head>.
//
// Decisões (ver README > Decisões Tomadas):
// - Toggle construído do zero (sem next-themes): coerente com "componentes do
//   zero" e sem dependência nova.
// - Preferência guardada em localStorage (V1). Sincronizar entre dispositivos
//   via coluna em `perfis` fica como melhoria futura.
// - Três modos: "sistema" reaproveita o @media (prefers-color-scheme) que já
//   existia como comportamento padrão.

/** A preferência que o usuário escolhe. */
export type Tema = "claro" | "escuro" | "sistema";

/** O tema que de fato é aplicado na tela (o "sistema" já resolvido). */
export type TemaResolvido = "claro" | "escuro";

/** Ordem de exibição no seletor. */
export const TEMAS: Tema[] = ["claro", "escuro", "sistema"];

/** Chave no localStorage (prefixo kh = Knowledge Hub). */
export const CHAVE_TEMA = "kh-tema";

/** Sem preferência salva, seguimos o sistema operacional. */
export const TEMA_PADRAO: Tema = "sistema";

/** Rótulos amigáveis para a UI. */
export const ROTULOS_TEMA: Record<Tema, string> = {
  claro: "Claro",
  escuro: "Escuro",
  sistema: "Sistema",
};

/** Type guard: garante que um valor cru (ex.: do localStorage) é um Tema. */
export function temaValido(valor: unknown): valor is Tema {
  return valor === "claro" || valor === "escuro" || valor === "sistema";
}

/**
 * Resolve o tema escolhido para o que realmente se aplica: "sistema" depende da
 * preferência do SO (prefers-color-scheme); "claro"/"escuro" são absolutos.
 */
export function resolverTema(
  tema: Tema,
  sistemaPrefereEscuro: boolean,
): TemaResolvido {
  if (tema === "sistema") return sistemaPrefereEscuro ? "escuro" : "claro";
  return tema;
}
