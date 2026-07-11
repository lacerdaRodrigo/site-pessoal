"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import estilos from "./toasts.module.css";

// Toasts de sucesso após uma ação que redireciona (criar/salvar/excluir
// documento — spec telas seção 3, RF02.4). Como a Server Action redireciona, o
// componente que disparou a ação some da tela; então a mensagem viaja no
// parâmetro `?aviso=` da URL de destino. Este componente (montado na casca
// autenticada) lê o parâmetro, mostra o toast, some sozinho após alguns
// segundos e limpa a URL para não reexibir ao recarregar ou voltar.
const MENSAGENS: Record<string, string> = {
  criado: "Documento criado.",
  salvo: "Alterações salvas.",
  excluido: "Documento excluído.",
};

const DURACAO_MS = 4000;

export function Toasts() {
  const params = useSearchParams();
  const router = useRouter();
  const caminho = usePathname();

  const aviso = params.get("aviso");
  const textoDoAviso = aviso ? (MENSAGENS[aviso] ?? null) : null;

  // A mensagem visível é ajustada DURANTE a renderização (padrão React de
  // "ajustar estado quando a entrada muda"), nunca dentro de um efeito. Só
  // reage a um aviso novo: a limpeza da URL (aviso -> null) é ignorada de
  // propósito, para o toast não desaparecer no mesmo instante em que é exibido.
  const [mensagem, setMensagem] = useState<string | null>(textoDoAviso);
  const [avisoAnterior, setAvisoAnterior] = useState(aviso);
  if (aviso && aviso !== avisoAnterior) {
    setAvisoAnterior(aviso);
    setMensagem(textoDoAviso);
  }

  // Colateral: tira o `?aviso=` da URL para não reexibir ao recarregar/voltar.
  useEffect(() => {
    if (textoDoAviso) router.replace(caminho, { scroll: false });
  }, [textoDoAviso, caminho, router]);

  // Colateral: some sozinho após alguns segundos. O setState fica no timer
  // (callback assíncrono), fora do corpo do efeito.
  useEffect(() => {
    if (!mensagem) return;
    const timer = setTimeout(() => setMensagem(null), DURACAO_MS);
    return () => clearTimeout(timer);
  }, [mensagem]);

  if (!mensagem) return null;

  return (
    <div className={estilos.regiao} role="status" aria-live="polite">
      <button
        type="button"
        className={estilos.toast}
        onClick={() => setMensagem(null)}
      >
        <span className={estilos.marca} aria-hidden="true">
          ✓
        </span>
        {mensagem}
      </button>
    </div>
  );
}
