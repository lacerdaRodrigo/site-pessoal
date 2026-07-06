import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function criarClienteServidor() {
  const armazenadorDeCookies = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return armazenadorDeCookies.getAll();
        },
        setAll(cookiesParaDefinir) {
          try {
            cookiesParaDefinir.forEach(({ name, value, options }) =>
              armazenadorDeCookies.set(name, value, options),
            );
          } catch {
            // Chamado de um Server Component sem permissão de escrita em cookies.
            // Inofensivo aqui: o middleware.ts (Passo 4, próxima etapa) é quem
            // efetivamente renova a sessão a cada requisição.
          }
        },
      },
    },
  );
}
