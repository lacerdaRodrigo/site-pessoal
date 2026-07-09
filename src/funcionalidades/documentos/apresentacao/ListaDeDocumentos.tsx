import Link from "next/link";
import type { Categoria } from "@/funcionalidades/categorias/dominio/categoria";
import type { Etiqueta } from "@/funcionalidades/etiquetas/dominio/etiqueta";
import type { Documento } from "../dominio/documento";
import { BotaoFavorito } from "./BotaoFavorito";
import estilos from "./documentos.module.css";

// Server Component: exibe a lista com busca (RF03.2), filtro por categoria
// (RF03.1), filtro por etiqueta e a seção de favoritos de acesso rápido
// (RF03.3). Sem estado no cliente — busca e filtros viajam pela URL
// (?busca= / ?categoria= / ?etiqueta=) e o servidor devolve a lista já filtrada.
export function ListaDeDocumentos({
  documentos,
  categorias,
  etiquetas = [],
  busca = "",
  categoriaAtivaId = null,
  etiquetaAtivaId = null,
}: {
  documentos: Documento[];
  categorias: Categoria[];
  etiquetas?: Etiqueta[];
  busca?: string;
  categoriaAtivaId?: string | null;
  etiquetaAtivaId?: string | null;
}) {
  const filtrando =
    Boolean(busca) || Boolean(categoriaAtivaId) || Boolean(etiquetaAtivaId);
  // A seção "Favoritos" é a lista de acesso rápido do modo padrão. Ao buscar ou
  // filtrar, mostramos só a lista achatada dos resultados.
  const favoritos = filtrando ? [] : documentos.filter((d) => d.eFavorito);
  const categoriaAtiva = categoriaAtivaId
    ? categorias.find((c) => c.id === categoriaAtivaId)
    : null;
  const etiquetaAtiva = etiquetaAtivaId
    ? etiquetas.find((e) => e.id === etiquetaAtivaId)
    : null;

  return (
    <div>
      <div className={estilos.listaTopo}>
        <h1 className={estilos.tituloPagina}>Meus documentos</h1>
        <Link href="/documentos/novo" className={estilos.botaoPrimario}>
          + Novo documento
        </Link>
      </div>

      {/* Busca global (RF03.2). Form GET: navega para /documentos?busca=... e
          preserva a categoria e a etiqueta filtradas como campos ocultos. */}
      <form className={estilos.buscaForm} role="search">
        {categoriaAtivaId && (
          <input type="hidden" name="categoria" value={categoriaAtivaId} />
        )}
        {etiquetaAtivaId && (
          <input type="hidden" name="etiqueta" value={etiquetaAtivaId} />
        )}
        <input
          type="search"
          name="busca"
          aria-label="Buscar documentos por título"
          className={estilos.buscaInput}
          placeholder="Buscar por título..."
          defaultValue={busca}
        />
        <button type="submit" className={estilos.botaoSecundario}>
          Buscar
        </button>
      </form>

      {/* Filtro por categoria (RF03.1). Cada link carrega a busca atual. */}
      {categorias.length > 0 && (
        <nav className={estilos.filtros} aria-label="Filtrar por categoria">
          <Link
            href={hrefFiltro({ busca, etiqueta: etiquetaAtivaId ?? undefined })}
            className={`${estilos.chipFiltro} ${
              categoriaAtivaId ? "" : estilos.chipFiltroAtivo
            }`}
          >
            Todas
          </Link>
          {categorias.map((c) => (
            <Link
              key={c.id}
              href={hrefFiltro({
                busca,
                categoria: c.id,
                etiqueta: etiquetaAtivaId ?? undefined,
              })}
              className={`${estilos.chipFiltro} ${
                c.id === categoriaAtivaId ? estilos.chipFiltroAtivo : ""
              }`}
            >
              {c.nome}
            </Link>
          ))}
        </nav>
      )}

      {/* Indicador do filtro por etiqueta ativo, com atalho para limpá-lo. */}
      {etiquetaAtiva && (
        <p className={estilos.filtroEtiqueta}>
          Filtrando pela etiqueta{" "}
          <span className={estilos.chipEtiqueta}>#{etiquetaAtiva.nome}</span>{" "}
          <Link
            href={hrefFiltro({ busca, categoria: categoriaAtivaId ?? undefined })}
            className={estilos.limparFiltro}
          >
            ✕ limpar
          </Link>
        </p>
      )}

      {documentos.length === 0 ? (
        <p className={estilos.vazio}>
          {busca
            ? `Nenhum documento encontrado para "${busca}".`
            : etiquetaAtiva
              ? `Nenhum documento com a etiqueta "#${etiquetaAtiva.nome}".`
              : categoriaAtiva
                ? `Nenhum documento na categoria "${categoriaAtiva.nome}".`
                : "Você ainda não tem documentos. Crie o primeiro!"}
        </p>
      ) : (
        <>
          {favoritos.length > 0 && (
            <section>
              <h2 className={estilos.secaoTitulo}>★ Favoritos</h2>
              <Cards documentos={favoritos} />
            </section>
          )}
          <section>
            {favoritos.length > 0 && (
              <h2 className={estilos.secaoTitulo}>Todos os documentos</h2>
            )}
            <Cards documentos={documentos} />
          </section>
        </>
      )}
    </div>
  );
}

// Monta a URL de filtro preservando os filtros ativos (?busca=&categoria=&etiqueta=).
function hrefFiltro({
  busca,
  categoria,
  etiqueta,
}: {
  busca?: string;
  categoria?: string;
  etiqueta?: string;
}): string {
  const params = new URLSearchParams();
  if (busca) params.set("busca", busca);
  if (categoria) params.set("categoria", categoria);
  if (etiqueta) params.set("etiqueta", etiqueta);
  const qs = params.toString();
  return qs ? `/documentos?${qs}` : "/documentos";
}

function Cards({ documentos }: { documentos: Documento[] }) {
  return (
    <ul className={estilos.cards}>
      {documentos.map((doc) => (
        <li key={doc.id} className={estilos.item}>
          <Link href={`/documentos/${doc.id}`} className={estilos.card}>
            <span className={estilos.cardTitulo}>{doc.titulo}</span>
            <span className={estilos.cardMeta}>
              {doc.categoriaNome && (
                <span className={estilos.chip}>{doc.categoriaNome}</span>
              )}
              {doc.etiquetas?.map((e) => (
                <span key={e.id} className={estilos.chipEtiqueta}>
                  #{e.nome}
                </span>
              ))}
              <span className={estilos.cardData}>
                Atualizado em {formatarData(doc.atualizadoEm)}
              </span>
            </span>
          </Link>
          <BotaoFavorito id={doc.id} eFavorito={doc.eFavorito} />
        </li>
      ))}
    </ul>
  );
}

function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
