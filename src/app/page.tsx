import { criarClienteServidor } from "@/nucleo/supabase/servidor";
import { sair } from "@/funcionalidades/autenticacao/dados/acoes";
import estilos from "@/funcionalidades/autenticacao/apresentacao/formulario.module.css";

export default async function Home() {
  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className={estilos.pagina}>
        <p>
          Você não está logado. <a href="/login">Entrar</a>
        </p>
      </div>
    );
  }

  return (
    <div className={estilos.pagina}>
      <form action={sair} className={estilos.formulario}>
        <p>Logado como {user.email}</p>
        <button type="submit">Sair</button>
      </form>
    </div>
  );
}
