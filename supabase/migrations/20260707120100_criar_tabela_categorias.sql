-- Migration: criar tabela `categorias`
-- As "pastas" macro que organizam o menu lateral. Cada categoria pertence a um
-- usuário. Depende de `perfis` (por isso roda depois da migration de perfis).

create table public.categorias (
  id uuid primary key default gen_random_uuid(),
  -- Dono da categoria. on delete cascade: apagar a conta remove as categorias.
  usuario_id uuid not null references public.perfis (id) on delete cascade,
  -- não-vazio: um nome só de espaços não faz sentido como categoria.
  nome text not null check (length(trim(nome)) > 0),
  criado_em timestamptz not null default now()
);

-- Unicidade de nome por usuário, case-insensitive (ver docs/02-banco-de-dados/01-entidades.md, seção 4)
-- ------------------------------------------------------------------------------------------------
-- Um UNIQUE(usuario_id, nome) comum deixaria "QA" e "qa" coexistirem (strings
-- diferentes). Aplicar lower(trim()) na expressão do índice trata as duas como a
-- mesma — mas o nome continua guardado como o usuário digitou, para exibição.
-- (Este índice também serve de índice do usuario_id para as consultas por dono.)
create unique index categorias_usuario_nome_unico
  on public.categorias (usuario_id, lower(trim(nome)));

-- Segurança (RLS)
alter table public.categorias enable row level security;

create policy "categorias_select_proprio"
  on public.categorias for select
  using (auth.uid() = usuario_id);

-- No INSERT o with check garante que ninguém crie categoria "em nome" de outro.
create policy "categorias_insert_proprio"
  on public.categorias for insert
  with check (auth.uid() = usuario_id);

create policy "categorias_update_proprio"
  on public.categorias for update
  using (auth.uid() = usuario_id)
  with check (auth.uid() = usuario_id);

create policy "categorias_delete_proprio"
  on public.categorias for delete
  using (auth.uid() = usuario_id);
