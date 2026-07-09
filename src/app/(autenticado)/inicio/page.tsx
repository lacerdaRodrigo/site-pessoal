import { PainelInicial } from "@/funcionalidades/painel-inicial/apresentacao/PainelInicial";
import { carregarPainel } from "@/funcionalidades/painel-inicial/dados/consultas";

// Rota /inicio — a tela de Início (Dashboard) após o login: visão geral do
// conhecimento do usuário (contadores, busca global, favoritos e recentes).
export default async function InicioPage() {
  const resumo = await carregarPainel();
  return <PainelInicial resumo={resumo} />;
}
