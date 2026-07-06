import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function atualizarSessao(requisicao: NextRequest) {
  let resposta = NextResponse.next({ request: requisicao });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return requisicao.cookies.getAll();
        },
        setAll(cookiesParaDefinir) {
          cookiesParaDefinir.forEach(({ name, value }) =>
            requisicao.cookies.set(name, value),
          );
          resposta = NextResponse.next({ request: requisicao });
          cookiesParaDefinir.forEach(({ name, value, options }) =>
            resposta.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Não adicionar nenhuma lógica entre o createServerClient acima e o
  // getUser() abaixo: é essa chamada que efetivamente valida o token com o
  // Supabase e devolve os cookies renovados. Pular ou adiar essa chamada é a
  // causa mais comum de bug de "usuário deslogado aleatoriamente" com o
  // @supabase/ssr (aviso da própria documentação oficial).
  await supabase.auth.getUser();

  return resposta;
}
