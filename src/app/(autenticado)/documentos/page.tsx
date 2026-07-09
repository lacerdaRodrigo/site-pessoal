import { listarDocumentos } from "@/funcionalidades/documentos/dados/acoes";
import { listarCategorias } from "@/funcionalidades/categorias/dados/consultas";
import { listarEtiquetas } from "@/funcionalidades/etiquetas/dados/consultas";
import { ListaDeDocumentos } from "@/funcionalidades/documentos/apresentacao/ListaDeDocumentos";

// Rota /documentos (lista). Lê a busca (?busca=), o filtro de categoria
// (?categoria=) e o de etiqueta (?etiqueta=) da URL e delega a listagem já
// filtrada ao componente.
export default async function DocumentosPage({
  searchParams,
}: {
  searchParams: Promise<{ busca?: string; categoria?: string; etiqueta?: string }>;
}) {
  const { busca, categoria, etiqueta } = await searchParams;
  const [documentos, categorias, etiquetas] = await Promise.all([
    listarDocumentos({ busca, categoriaId: categoria, etiquetaId: etiqueta }),
    listarCategorias(),
    listarEtiquetas(),
  ]);

  return (
    <ListaDeDocumentos
      documentos={documentos}
      categorias={categorias}
      etiquetas={etiquetas}
      busca={busca ?? ""}
      categoriaAtivaId={categoria ?? null}
      etiquetaAtivaId={etiqueta ?? null}
    />
  );
}
