import Link from "next/link";
import type { Documento } from "@/funcionalidades/documentos/dominio/documento";
import type { ResumoPainel } from "../dados/consultas";
import estilos from "./painel.module.css";

// Server Component: a tela de Início (Dashboard) após o login. Concentra a
// visão geral do conhecimento do usuário — busca global em destaque (RF03.2),
// contadores, favoritos de acesso rápido (RF03.3) e documentos recentes. Sem
// estado no cliente: a busca navega para /documentos?busca= via form GET.
export function PainelInicial({ resumo }: { resumo: ResumoPainel }) {
  const { nome, email, totais, favoritos, recentes } = resumo;
  const saudacao = nome?.trim() || email || "por aqui";
  const semDocumentos = totais.documentos === 0;

  return (
    <div>
      <div className={estilos.cabecalho}>
        <div>
          <h1 className={estilos.titulo}>Olá, {saudacao} 👋</h1>
          <p className={estilos.subtitulo}>
            Sua base de conhecimento pessoal num só lugar.
          </p>
        </div>
        <Link href="/documentos/novo" className={estilos.botaoPrimario}>
          + Novo documento
        </Link>
      </div>

      {/* Busca global em destaque (RF03.2): daqui já se acha um documento pelo
          título sem abrir a lista. Form GET → /documentos?busca=... */}
      <form className={estilos.buscaForm} role="search" action="/documentos">
        <input
          type="search"
          name="busca"
          aria-label="Buscar documentos por título"
          className={estilos.buscaInput}
          placeholder="Buscar em todos os documentos..."
        />
        <button type="submit" className={estilos.botaoSecundario}>
          Buscar
        </button>
      </form>

      {/* Contadores gerais. Cada cartão leva para a lista relacionada. */}
      <section className={estilos.cards} aria-label="Resumo">
        <Cartao numero={totais.documentos} rotulo="Documentos" href="/documentos" />
        <Cartao numero={totais.favoritos} rotulo="Favoritos" href="/documentos" />
        <Cartao numero={totais.categorias} rotulo="Categorias" href="/documentos" />
        <Cartao numero={totais.etiquetas} rotulo="Etiquetas" href="/documentos" />
      </section>

      {semDocumentos ? (
        <p className={estilos.vazio}>
          Você ainda não tem documentos.{" "}
          <Link href="/documentos/novo" className={estilos.link}>
            Crie o primeiro!
          </Link>
        </p>
      ) : (
        <div className={estilos.colunas}>
          <SecaoDocumentos
            titulo="★ Favoritos"
            documentos={favoritos}
            vazio="Nenhum favorito ainda. Marque um documento com a estrela."
          />
          <SecaoDocumentos
            titulo="Recentes"
            documentos={recentes}
            verTodosHref="/documentos"
          />
        </div>
      )}
    </div>
  );
}

function Cartao({
  numero,
  rotulo,
  href,
}: {
  numero: number;
  rotulo: string;
  href: string;
}) {
  return (
    <Link href={href} className={estilos.cartao}>
      <span className={estilos.cartaoNumero}>{numero}</span>
      <span className={estilos.cartaoRotulo}>{rotulo}</span>
    </Link>
  );
}

function SecaoDocumentos({
  titulo,
  documentos,
  vazio,
  verTodosHref,
}: {
  titulo: string;
  documentos: Documento[];
  vazio?: string;
  verTodosHref?: string;
}) {
  return (
    <section className={estilos.secao}>
      <div className={estilos.secaoTopo}>
        <h2 className={estilos.secaoTitulo}>{titulo}</h2>
        {verTodosHref && (
          <Link href={verTodosHref} className={estilos.link}>
            Ver todos →
          </Link>
        )}
      </div>
      {documentos.length === 0 ? (
        <p className={estilos.secaoVazia}>{vazio}</p>
      ) : (
        <ul className={estilos.itens}>
          {documentos.map((doc) => (
            <li key={doc.id}>
              <Link href={`/documentos/${doc.id}`} className={estilos.item}>
                <span className={estilos.itemTitulo}>{doc.titulo}</span>
                {doc.categoriaNome && (
                  <span className={estilos.chip}>{doc.categoriaNome}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
