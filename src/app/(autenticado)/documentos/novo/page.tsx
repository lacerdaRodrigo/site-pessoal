import { FormularioDocumento } from "@/funcionalidades/documentos/apresentacao/FormularioDocumento";
import { listarCategorias } from "@/funcionalidades/categorias/dados/consultas";

// Rota /documentos/novo — cria um documento. Carrega as categorias existentes
// para alimentar o autocomplete do campo de categoria (RF03.1).
export default async function NovoDocumentoPage() {
  const categorias = await listarCategorias();
  return <FormularioDocumento categorias={categorias} />;
}
