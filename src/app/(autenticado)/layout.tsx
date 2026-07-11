import { Suspense } from "react";
import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/nucleo/supabase/servidor";
import { AppShell } from "@/nucleo/componentes/AppShell";
import { Toasts } from "@/nucleo/componentes/Toasts";
import { TransicaoDeTela } from "@/nucleo/componentes/TransicaoDeTela";

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

  return (
    <AppShell email={user.email ?? null}>
      {/* Toasts de sucesso pós-redirect (lê ?aviso= da URL). useSearchParams
          exige um limite de Suspense para não travar a renderização. */}
      <Suspense fallback={null}>
        <Toasts />
      </Suspense>
      {/* Fade de entrada a cada troca de tela (só o conteúdo, não o toast). */}
      <TransicaoDeTela>{children}</TransicaoDeTela>
    </AppShell>
  );
}
