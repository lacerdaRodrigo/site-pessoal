import { FormularioDocumento } from "@/funcionalidades/documentos/apresentacao/FormularioDocumento";
import { listarCategorias } from "@/funcionalidades/categorias/dados/consultas";
import { listarEtiquetas } from "@/funcionalidades/etiquetas/dados/consultas";

// Rota /documentos/novo — cria um documento. Carrega categorias e etiquetas
// existentes para alimentar o autocomplete dos respectivos campos (RF03.1).
export default async function NovoDocumentoPage() {
  const [categorias, etiquetas] = await Promise.all([
    listarCategorias(),
    listarEtiquetas(),
  ]);
  return (
    <FormularioDocumento categorias={categorias} etiquetasExistentes={etiquetas} />
  );
}
