import { notFound } from "next/navigation";
import { obterDocumento } from "@/funcionalidades/documentos/dados/acoes";
import { listarCategorias } from "@/funcionalidades/categorias/dados/consultas";
import { listarEtiquetas } from "@/funcionalidades/etiquetas/dados/consultas";
import { FormularioDocumento } from "@/funcionalidades/documentos/apresentacao/FormularioDocumento";

// Rota /documentos/:id/editar — EDIÇÃO do documento (RF02.3).
export default async function EditarDocumentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [documento, categorias, etiquetas] = await Promise.all([
    obterDocumento(id),
    listarCategorias(),
    listarEtiquetas(),
  ]);

  if (!documento) notFound();

  return (
    <FormularioDocumento
      documento={documento}
      categorias={categorias}
      etiquetasExistentes={etiquetas}
    />
  );
}
