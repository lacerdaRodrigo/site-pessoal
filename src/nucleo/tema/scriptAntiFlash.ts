import { CHAVE_TEMA, TEMA_PADRAO } from "./tema";

// Script injetado no início do <body>, ANTES do conteúdo, para aplicar o tema
// salvo já na primeira pintura e evitar o "flash" de tema errado (FOUC). É JS
// cru (string) que roda no navegador de forma síncrona, sem passar pelo React/
// hidratação — por isso precisa ser autossuficiente. Ele escreve os mesmos
// atributos que o ProvedorDeTema mantém depois (data-tema / data-tema-resolvido).
export const scriptAntiFlash = `(function(){try{var t=localStorage.getItem("${CHAVE_TEMA}");if(t!=="claro"&&t!=="escuro"&&t!=="sistema")t="${TEMA_PADRAO}";var e=t==="escuro"||(t==="sistema"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.setAttribute("data-tema",t);r.setAttribute("data-tema-resolvido",e?"escuro":"claro");r.style.colorScheme=e?"dark":"light";}catch(x){}})();`;
