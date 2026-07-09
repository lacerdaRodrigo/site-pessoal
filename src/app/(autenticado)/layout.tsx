import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/nucleo/supabase/servidor";
import { AppShell } from "@/nucleo/componentes/AppShell";

// Layout do grupo de rotas (autenticado): a guarda de sessão do app.
// Toda página abaixo dele exige um usuário logado — se não houver, manda pro
// /login antes de renderizar qualquer coisa. O parêntese em "(autenticado)"
// faz o Next tratar isto como grupo lógico, sem virar segmento na URL. A casca
// visual (sidebar + gaveta mobile) vive no AppShell (Client Component).
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

  return <AppShell email={user.email ?? null}>{children}</AppShell>;
}
