"use client";

import Link from "next/link";
import { useActionState } from "react";
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

        <textarea
          name="conteudo"
          aria-label="Conteúdo do documento"
          className={estilos.campoConteudo}
          placeholder="Escreva aqui o seu prompt, comando, query... (Markdown suportado)"
          defaultValue={documento?.conteudo ?? ""}
          required
        />

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
