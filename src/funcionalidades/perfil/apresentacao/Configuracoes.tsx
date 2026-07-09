import type { Perfil } from "../dominio/perfil";
import { FormularioPerfil } from "./FormularioPerfil";
import { SeletorDeTema } from "./SeletorDeTema";
import estilos from "./perfil.module.css";

// Composição da tela de Configurações. Server Component "casca": recebe os dados
// já carregados e monta as seções, delegando a interatividade aos Client
// Components (FormularioPerfil, SeletorDeTema).
type Props = {
  perfil: Perfil | null;
  email: string | null;
};

export function Configuracoes({ perfil, email }: Props) {
  return (
    <div className={estilos.pagina}>
      <h1 className={estilos.titulo}>Configurações</h1>

      <section className={estilos.secao}>
        <h2 className={estilos.tituloSecao}>Perfil</h2>
        <p className={estilos.descricaoSecao}>
          Seus dados de conta.
        </p>
        <FormularioPerfil
          nomeCompleto={perfil?.nomeCompleto ?? null}
          email={email}
        />
      </section>

      <section className={estilos.secao}>
        <h2 className={estilos.tituloSecao}>Aparência</h2>
        <p className={estilos.descricaoSecao}>
          Escolha o tema da interface. &quot;Sistema&quot; segue a preferência do
          seu dispositivo.
        </p>
        <SeletorDeTema />
      </section>
    </div>
  );
}
