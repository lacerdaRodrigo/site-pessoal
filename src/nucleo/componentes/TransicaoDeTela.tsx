"use client";

import { usePathname } from "next/navigation";
import estilos from "./transicaoDeTela.module.css";

// Transição de entrada (fade) ao trocar de tela (spec telas, seção 3). O truque
// é a `key={caminho}`: quando a rota muda, o React troca a chave, remonta este
// wrapper e a animação CSS roda de novo — sem biblioteca de animação. O respeito
// a "prefers-reduced-motion" fica no CSS (só anima quem não pediu menos movimento).
export function TransicaoDeTela({ children }: { children: React.ReactNode }) {
  const caminho = usePathname();

  return (
    <div key={caminho} className={estilos.tela}>
      {children}
    </div>
  );
}
