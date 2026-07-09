import { notFound } from "next/navigation";
import { obterDocumento } from "@/funcionalidades/documentos/dados/acoes";
import { listarCategorias } from "@/funcionalidades/categorias/dados/consultas";
import { FormularioDocumento } from "@/funcionalidades/documentos/apresentacao/FormularioDocumento";

// Rota /documentos/:id/editar — EDIÇÃO do documento (RF02.3).
export default async function EditarDocumentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [documento, categorias] = await Promise.all([
    obterDocumento(id),
    listarCategorias(),
  ]);

  if (!documento) notFound();

  return <FormularioDocumento documento={documento} categorias={categorias} />;
}
