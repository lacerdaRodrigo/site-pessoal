import { notFound } from "next/navigation";
import { obterDocumento } from "@/funcionalidades/documentos/dados/acoes";
import { VisualizacaoDocumento } from "@/funcionalidades/documentos/apresentacao/VisualizacaoDocumento";

// Rota /documentos/:id — LEITURA do documento (Markdown renderizado + ações).
// Se não existir (ou não for do usuário, graças ao RLS), cai no 404.
export default async function DocumentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const documento = await obterDocumento(id);

  if (!documento) notFound();

  return <VisualizacaoDocumento documento={documento} />;
}
