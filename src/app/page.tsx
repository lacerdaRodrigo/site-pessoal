import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/nucleo/supabase/servidor";

// Raiz do app: um roteador, não uma página. Como todo o produto é login-gated,
// "/" não tem conteúdo próprio — só decide o destino. Logado vai pro núcleo do
// produto (/documentos); deslogado vai pro /login. Assim não sobra tela órfã
// e a decisão de "para onde ir" fica num lugar só.
export default async function Home() {
  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  redirect(user ? "/documentos" : "/login");
}
