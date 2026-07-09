import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Documento } from "../dominio/documento";
import { BotaoCopiar } from "./BotaoCopiar";
import { BotaoExcluir } from "./BotaoExcluir";
import { BotaoFavorito } from "./BotaoFavorito";
import estilos from "./documentos.module.css";

// Tela de LEITURA do documento (RF02.2). Renderiza o conteúdo Markdown como
// HTML (com suporte a GFM: tabelas, listas de tarefas, etc.) e concentra as
// ações do documento: copiar (RF02.5), editar e excluir. É Server Component —
// o Markdown é renderizado no servidor; só os botões interativos são client.
export function VisualizacaoDocumento({
  documento,
}: {
  documento: Documento;
}) {
  return (
    <div>
      <div className={estilos.editorTopo}>
        <Link href="/documentos" className={estilos.voltar}>
          ← Voltar
        </Link>
        <div className={estilos.acoes}>
          <BotaoFavorito id={documento.id} eFavorito={documento.eFavorito} />
          <BotaoCopiar conteudo={documento.conteudo} />
          <Link
            href={`/documentos/${documento.id}/editar`}
            className={estilos.botaoSecundario}
          >
            Editar
          </Link>
          <BotaoExcluir id={documento.id} />
        </div>
      </div>

      {documento.categoriaNome && (
        <span className={estilos.chip}>{documento.categoriaNome}</span>
      )}
      <h1 className={estilos.tituloDoc}>{documento.titulo}</h1>

      <article className={estilos.markdown}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {documento.conteudo}
        </ReactMarkdown>
      </article>
    </div>
  );
}
