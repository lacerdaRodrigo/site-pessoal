import { carregarDadosDoPerfil } from "@/funcionalidades/perfil/dados/acoes";
import { Configuracoes } from "@/funcionalidades/perfil/apresentacao/Configuracoes";

// Rota /configuracoes — "porta de entrada" fina: só carrega os dados e renderiza
// o componente da funcionalidade. A guarda de sessão vem do layout (autenticado).
export default async function PaginaConfiguracoes() {
  const { perfil, email } = await carregarDadosDoPerfil();
  return <Configuracoes perfil={perfil} email={email} />;
}
