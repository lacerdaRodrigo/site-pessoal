import { listarDocumentos } from "@/funcionalidades/documentos/dados/acoes";
import { listarCategorias } from "@/funcionalidades/categorias/dados/consultas";
import { ListaDeDocumentos } from "@/funcionalidades/documentos/apresentacao/ListaDeDocumentos";

// Rota /documentos (lista). Lê a busca (?busca=) e o filtro de categoria
// (?categoria=) da URL e delega a listagem já filtrada ao componente.
export default async function DocumentosPage({
  searchParams,
}: {
  searchParams: Promise<{ busca?: string; categoria?: string }>;
}) {
  const { busca, categoria } = await searchParams;
  const [documentos, categorias] = await Promise.all([
    listarDocumentos({ busca, categoriaId: categoria }),
    listarCategorias(),
  ]);

  return (
    <ListaDeDocumentos
      documentos={documentos}
      categorias={categorias}
      busca={busca ?? ""}
      categoriaAtivaId={categoria ?? null}
    />
  );
}
