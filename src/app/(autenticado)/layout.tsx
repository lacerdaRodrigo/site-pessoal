import Link from "next/link";
import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/nucleo/supabase/servidor";
import { sair } from "@/funcionalidades/autenticacao/dados/acoes";
import estilos from "@/funcionalidades/documentos/apresentacao/documentos.module.css";

// Layout do grupo de rotas (autenticado): a guarda de sessão do app.
// Toda página abaixo dele exige um usuário logado — se não houver, manda pro
// /login antes de renderizar qualquer coisa. O parêntese em "(autenticado)"
// faz o Next tratar isto como grupo lógico, sem virar segmento na URL.
export default async function LayoutAutenticado({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className={estilos.app}>
      <header className={estilos.cabecalho}>
        <Link href="/documentos" className={estilos.marca}>
          <span className={estilos.logo}>K</span>
          <span>Knowledge Hub</span>
        </Link>
        <nav className={estilos.navegacao} aria-label="Navegação principal">
          <Link href="/documentos">Documentos</Link>
          <Link href="/configuracoes">Configurações</Link>
        </nav>
        <div className={estilos.usuario}>
          <span className={estilos.email}>{user.email}</span>
          <form action={sair}>
            <button type="submit" className={estilos.botaoSair}>
              Sair
            </button>
          </form>
        </div>
      </header>
      <main className={estilos.conteudo}>{children}</main>
    </div>
  );
}
