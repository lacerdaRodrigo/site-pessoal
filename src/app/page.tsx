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
        <div className={estilos.cartao}>
          <div className={estilos.logo}>K</div>
          <p className={estilos.sucesso}>Você não está logado.</p>
          <p className={estilos.linkSecundario}>
            <a href="/login">Entrar</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={estilos.pagina}>
      <div className={estilos.cartao}>
        <div className={estilos.logo}>K</div>
        <p className={estilos.sucesso}>Logado como {user.email}</p>
        <form action={sair} className={estilos.formulario}>
          <button type="submit">Sair</button>
        </form>
      </div>
    </div>
  );
}
