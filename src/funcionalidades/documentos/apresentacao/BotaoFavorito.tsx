import { alternarFavorito } from "../dados/acoes";
import estilos from "./documentos.module.css";

// Estrela de favoritar (RF03.3). É um Server Component: um <form> que dispara a
// Server Action `alternarFavorito`. Não precisa de "use client" nem de JS no
// cliente — o clique envia o form, o servidor alterna o campo e revalida a
// rota, e o botão reaparece já no novo estado.
export function BotaoFavorito({
  id,
  eFavorito,
}: {
  id: string;
  eFavorito: boolean;
}) {
  return (
    <form action={alternarFavorito} className={estilos.formEstrela}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="eFavorito" value={String(eFavorito)} />
      <button
        type="submit"
        className={`${estilos.botaoEstrela} ${
          eFavorito ? estilos.botaoEstrelaAtivo : ""
        }`}
        aria-pressed={eFavorito}
        aria-label={eFavorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        title={eFavorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      >
        {eFavorito ? "★" : "☆"}
      </button>
    </form>
  );
}
