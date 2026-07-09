"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  CHAVE_TEMA,
  resolverTema,
  TEMA_PADRAO,
  temaValido,
  type Tema,
} from "./tema";

type ContextoTema = {
  tema: Tema;
  definirTema: (novo: Tema) => void;
};

const Contexto = createContext<ContextoTema | null>(null);

const CONSULTA_ESCURO = "(prefers-color-scheme: dark)";

/**
 * Aplica o tema resolvido no <html>: escreve `data-tema` (a escolha do usuário)
 * e `data-tema-resolvido` (claro|escuro de fato), de onde o CSS em globals.css
 * lê as variáveis de cor. Também ajusta `color-scheme` para os controles nativos
 * do navegador (scrollbar, inputs) acompanharem o tema.
 */
function aplicarNoDocumento(tema: Tema) {
  const prefereEscuro = window.matchMedia(CONSULTA_ESCURO).matches;
  const resolvido = resolverTema(tema, prefereEscuro);
  const raiz = document.documentElement;
  raiz.setAttribute("data-tema", tema);
  raiz.setAttribute("data-tema-resolvido", resolvido);
  raiz.style.colorScheme = resolvido;
}

export function ProvedorDeTema({ children }: { children: ReactNode }) {
  // No servidor não há localStorage; começamos no padrão e corrigimos ao montar.
  // O script anti-flash (RootLayout) já pintou a tela certa antes disso, então
  // não há "flash" visível — este estado só sincroniza o React com o que já está
  // aplicado no DOM.
  const [tema, definirTemaEstado] = useState<Tema>(TEMA_PADRAO);

  // Ao montar: lê a preferência salva e a adota. O setState síncrono aqui é
  // intencional e é o que garante hidratação consistente: servidor e primeira
  // renderização do cliente usam o mesmo TEMA_PADRAO (sem "mismatch"), e só
  // DEPOIS da hidratação este effect ajusta para o valor do localStorage. É o
  // mesmo padrão do next-themes; por isso silenciamos a regra só aqui.
  useEffect(() => {
    const salvo = localStorage.getItem(CHAVE_TEMA);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    definirTemaEstado(temaValido(salvo) ? salvo : TEMA_PADRAO);
  }, []);

  // Sempre que o tema mudar, aplica no documento e persiste.
  useEffect(() => {
    aplicarNoDocumento(tema);
    localStorage.setItem(CHAVE_TEMA, tema);
  }, [tema]);

  // No modo "sistema", acompanha em tempo real a troca de tema do SO.
  useEffect(() => {
    if (tema !== "sistema") return;
    const consulta = window.matchMedia(CONSULTA_ESCURO);
    const aoTrocar = () => aplicarNoDocumento("sistema");
    consulta.addEventListener("change", aoTrocar);
    return () => consulta.removeEventListener("change", aoTrocar);
  }, [tema]);

  return (
    <Contexto.Provider value={{ tema, definirTema: definirTemaEstado }}>
      {children}
    </Contexto.Provider>
  );
}

/** Hook para ler/trocar o tema de dentro de qualquer Client Component. */
export function useTema(): ContextoTema {
  const contexto = useContext(Contexto);
  if (!contexto) {
    throw new Error("useTema precisa estar dentro de <ProvedorDeTema>.");
  }
  return contexto;
}
