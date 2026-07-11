import estilos from "./dotCategoria.module.css";

// Quadradinho colorido que identifica a categoria no início da linha/card
// (spec telas 1/2.4). É puramente visual: recebe a cor já resolvida — a lógica
// de qual cor cada categoria tem mora em `categorias/dominio` (`corDaCategoria`).
// `aria-hidden` porque é um reforço da cor; o nome da categoria aparece como
// texto ao lado, que é o que importa para leitores de tela.
export function DotCategoria({ cor }: { cor: string }) {
  return (
    <span
      className={estilos.dot}
      style={{ backgroundColor: cor }}
      aria-hidden="true"
    />
  );
}
