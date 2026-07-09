"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Categoria } from "@/funcionalidades/categorias/dominio/categoria";
import {
  juntarEtiquetas,
  type Etiqueta,
} from "@/funcionalidades/etiquetas/dominio/etiqueta";
import {
  atualizarDocumento,
  criarDocumento,
  type EstadoDocumento,
} from "../dados/acoes";
import type { Documento } from "../dominio/documento";
import estilos from "./documentos.module.css";

const estadoInicial: EstadoDocumento = { erro: null };

// Serve tanto para CRIAR (sem prop `documento`) quanto para EDITAR (com prop).
// A exclusão vive na tela de visualização (VisualizacaoDocumento), não aqui.
// `categorias`/`etiquetasExistentes` alimentam o autocomplete dos respectivos
// campos (RF03.1 e organização por tags).
export function FormularioDocumento({
  documento,
  categorias = [],
  etiquetasExistentes = [],
}: {
  documento?: Documento;
  categorias?: Categoria[];
  etiquetasExistentes?: Etiqueta[];
}) {
  const editando = Boolean(documento);
  const [estado, executarAcao, emAndamento] = useActionState(
    editando ? atualizarDocumento : criarDocumento,
    estadoInicial,
  );

  // Conteúdo controlado: alimenta a pré-visualização Markdown ao vivo (spec 2.6).
  const [conteudo, setConteudo] = useState(documento?.conteudo ?? "");
  // No mobile, o editor e a pré-visualização viram abas; "editar" é a padrão.
  const [abaAtiva, setAbaAtiva] = useState<"editar" | "preview">("editar");

  // Ao editar, "Voltar" leva à leitura do próprio documento; ao criar, à lista.
  const destinoVoltar = documento ? `/documentos/${documento.id}` : "/documentos";

  return (
    <div>
      <div className={estilos.editorTopo}>
        <Link href={destinoVoltar} className={estilos.voltar}>
          ← Voltar
        </Link>
      </div>

      <form action={executarAcao} className={estilos.form}>
        {editando && <input type="hidden" name="id" value={documento!.id} />}

        <input
          name="titulo"
          aria-label="Título do documento"
          className={estilos.campoTitulo}
          placeholder="Título do documento"
          defaultValue={documento?.titulo ?? ""}
          required
          maxLength={255}
          autoFocus
        />

        {/* Categoria opcional com autocomplete (RF03.1): sugere as existentes
            via <datalist>, mas aceita um nome novo (find-or-create no servidor). */}
        <input
          name="categoria"
          list="lista-categorias"
          aria-label="Categoria"
          className={estilos.campoCategoria}
          placeholder="Categoria (opcional) — ex: Git, Banco de Dados, IAs"
          defaultValue={documento?.categoriaNome ?? ""}
          maxLength={60}
        />
        <datalist id="lista-categorias">
          {categorias.map((c) => (
            <option key={c.id} value={c.nome} />
          ))}
        </datalist>

        {/* Etiquetas opcionais (tags), separadas por vírgula. O <datalist>
            sugere as já existentes; nomes novos são criados no servidor
            (find-or-create), e o "#" que o usuário digitar é ignorado. */}
        <input
          name="etiquetas"
          list="lista-etiquetas"
          aria-label="Etiquetas"
          className={estilos.campoCategoria}
          placeholder="Etiquetas (opcional), separadas por vírgula — ex: dart, testes"
          defaultValue={juntarEtiquetas(documento?.etiquetas ?? [])}
        />
        <datalist id="lista-etiquetas">
          {etiquetasExistentes.map((e) => (
            <option key={e.id} value={e.nome} />
          ))}
        </datalist>

        {/* Editor + pré-visualização ao vivo (spec 2.6). No desktop, os dois
            painéis ficam lado a lado; abaixo de 768px viram abas (Editar |
            Pré-visualização) e só o painel da aba ativa aparece. */}
        <div
          className={estilos.abas}
          role="tablist"
          aria-label="Editor e pré-visualização"
        >
          <button
            type="button"
            role="tab"
            aria-selected={abaAtiva === "editar"}
            className={`${estilos.aba} ${
              abaAtiva === "editar" ? estilos.abaAtiva : ""
            }`}
            onClick={() => setAbaAtiva("editar")}
          >
            Editar
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={abaAtiva === "preview"}
            className={`${estilos.aba} ${
              abaAtiva === "preview" ? estilos.abaAtiva : ""
            }`}
            onClick={() => setAbaAtiva("preview")}
          >
            Pré-visualização
          </button>
        </div>

        <div className={estilos.editorGrid}>
          <textarea
            name="conteudo"
            aria-label="Conteúdo do documento"
            className={`${estilos.campoConteudo} ${
              abaAtiva === "preview" ? estilos.painelOculto : ""
            }`}
            placeholder="Escreva aqui o seu prompt, comando, query... (Markdown suportado)"
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            required
          />
          <div
            className={`${estilos.preview} ${
              abaAtiva === "editar" ? estilos.painelOculto : ""
            }`}
            aria-label="Pré-visualização"
          >
            {conteudo.trim() ? (
              <article className={estilos.markdown}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {conteudo}
                </ReactMarkdown>
              </article>
            ) : (
              <p className={estilos.previewVazio}>
                A pré-visualização aparece aqui conforme você escreve.
              </p>
            )}
          </div>
        </div>

        {estado.erro && (
          <p className={estilos.erro} role="alert">
            {estado.erro}
          </p>
        )}

        <button
          type="submit"
          className={estilos.botaoPrimario}
          disabled={emAndamento}
        >
          {emAndamento
            ? "Salvando..."
            : editando
              ? "Salvar alterações"
              : "Criar documento"}
        </button>
      </form>
    </div>
  );
}
