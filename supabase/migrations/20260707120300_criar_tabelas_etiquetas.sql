-- Migration: criar tabelas `etiquetas` e `documento_etiquetas`
-- 2ª leva da modelagem (ver docs/02-banco-de-dados/01-entidades.md).
-- Etiquetas (tags) organizam documentos numa relação N:N: uma etiqueta pode
-- estar em vários documentos e um documento pode ter várias etiquetas. A tabela
-- de junção `documento_etiquetas` cruza os dois. Depende de `perfis` (dono) e
-- `documentos` (junção), por isso roda depois das migrations deles.

-- Tabela `etiquetas`
-- -----------------
create table public.etiquetas (
  id uuid primary key default gen_random_uuid(),
  -- Dono da etiqueta. on delete cascade: apagar a conta remove as etiquetas.
  usuario_id uuid not null references public.perfis (id) on delete cascade,
  -- não-vazio: uma etiqueta só de espaços não faz sentido.
  nome text not null check (length(trim(nome)) > 0)
);

-- Unicidade de nome por usuário, case-insensitive (mesma decisão de `categorias`,
-- ver docs/02-banco-de-dados/01-entidades.md, seção 4): "QA" e "qa" viram a
-- mesma etiqueta, mas o nome é guardado como o usuário digitou, para exibição.
-- (Este índice também serve de índice do usuario_id nas consultas por dono.)
create unique index etiquetas_usuario_nome_unico
  on public.etiquetas (usuario_id, lower(trim(nome)));

-- Segurança (RLS)
alter table public.etiquetas enable row level security;

create policy "etiquetas_select_proprio"
  on public.etiquetas for select
  using (auth.uid() = usuario_id);

create policy "etiquetas_insert_proprio"
  on public.etiquetas for insert
  with check (auth.uid() = usuario_id);

create policy "etiquetas_update_proprio"
  on public.etiquetas for update
  using (auth.uid() = usuario_id)
  with check (auth.uid() = usuario_id);

create policy "etiquetas_delete_proprio"
  on public.etiquetas for delete
  using (auth.uid() = usuario_id);

-- Tabela de junção `documento_etiquetas` (N:N)
-- -------------------------------------------
-- A chave primária composta (documento_id, etiqueta_id) já impede vincular a
-- mesma etiqueta duas vezes no mesmo documento.
create table public.documento_etiquetas (
  -- on delete cascade: apagar o documento (ação consciente, RF02.4) leva junto
  -- as associações — não faz sentido manter vínculo de etiqueta órfão.
  documento_id uuid not null references public.documentos (id) on delete cascade,
  -- on delete cascade: apagar a etiqueta remove só o vínculo; o documento nunca
  -- é afetado (ver docs/02-banco-de-dados/01-entidades.md, seção 3).
  etiqueta_id uuid not null references public.etiquetas (id) on delete cascade,
  primary key (documento_id, etiqueta_id)
);

-- A PK já cobre a busca por documento; este índice cobre o sentido inverso
-- ("quais documentos têm a etiqueta X"), usado no filtro por etiqueta.
create index documento_etiquetas_etiqueta_id_idx
  on public.documento_etiquetas (etiqueta_id);

-- Segurança (RLS)
-- A junção não tem coluna `usuario_id`: a posse é HERDADA do documento. Cada
-- policy confere, via EXISTS, que o documento (e, no insert, a etiqueta) do
-- vínculo pertence ao usuário logado. Não há UPDATE: um vínculo é criado ou
-- removido, nunca editado.
alter table public.documento_etiquetas enable row level security;

create policy "documento_etiquetas_select_proprio"
  on public.documento_etiquetas for select
  using (
    exists (
      select 1 from public.documentos d
      where d.id = documento_id and d.usuario_id = auth.uid()
    )
  );

create policy "documento_etiquetas_insert_proprio"
  on public.documento_etiquetas for insert
  with check (
    exists (
      select 1 from public.documentos d
      where d.id = documento_id and d.usuario_id = auth.uid()
    )
    and exists (
      select 1 from public.etiquetas e
      where e.id = etiqueta_id and e.usuario_id = auth.uid()
    )
  );

create policy "documento_etiquetas_delete_proprio"
  on public.documento_etiquetas for delete
  using (
    exists (
      select 1 from public.documentos d
      where d.id = documento_id and d.usuario_id = auth.uid()
    )
  );
