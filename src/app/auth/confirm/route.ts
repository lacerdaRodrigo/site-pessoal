import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { criarClienteServidor } from "@/nucleo/supabase/servidor";
import { caminhoInternoSeguro } from "@/nucleo/seguranca/redirecionamento";

export async function GET(requisicao: NextRequest) {
  const { searchParams, origin } = requisicao.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const tipo = searchParams.get("type") as EmailOtpType | null;
  const proximo = caminhoInternoSeguro(searchParams.get("next"));

  if (tokenHash && tipo) {
    const supabase = await criarClienteServidor();
    const { error } = await supabase.auth.verifyOtp({
      type: tipo,
      token_hash: tokenHash,
    });

    if (!error) {
      return NextResponse.redirect(new URL(proximo, origin));
    }
  }

  return NextResponse.redirect(new URL("/login?erro=link-invalido", origin));
}
