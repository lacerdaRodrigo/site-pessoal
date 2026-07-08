-- Migration: criar tabela `documentos`
-- O coração do produto: os textos/prompts/queries que o usuário salva.
-- Depende de `perfis` (dono) e `categorias` (pasta), por isso roda por último.

-- Função reutilizável de "carimbo" de atualização
-- -----------------------------------------------
-- Mantém `atualizado_em` sempre correto pelo próprio banco: a cada UPDATE, o
-- Postgres sobrescreve o campo com now(). Vantagem sobre fazer isso no código:
-- é impossível algum caminho da aplicação "esquecer" de atualizar a data — o
-- banco é a fonte da verdade. É genérica de propósito (não cita `documentos`),
-- para ser reaproveitada por qualquer tabela futura que tenha `atualizado_em`.
create function public.set_atualizado_em()
returns trigger
language plpgsql
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

create table public.documentos (
  id uuid primary key default gen_random_uuid(),
  -- Dono do documento. on delete cascade: apagar a conta remove os documentos.
  usuario_id uuid not null references public.perfis (id) on delete cascade,
  -- Categoria pai. Nullable + on delete set null: apagar uma categoria NÃO
  -- apaga os documentos — eles só ficam "sem categoria" (o valor do app é nunca
  -- perder conhecimento). Ver docs/02-banco-de-dados/01-entidades.md, seção 3.
  categoria_id uuid references public.categorias (id) on delete set null,
  -- Título obrigatório, não-vazio e no máximo 255 caracteres.
  titulo text not null check (length(trim(titulo)) > 0 and length(titulo) <= 255),
  -- Conteúdo obrigatório e não-vazio (decisão: exigir corpo já na criação).
  conteudo text not null check (length(trim(conteudo)) > 0),
  e_favorito boolean not null default false,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- Índices para as consultas mais comuns: "meus documentos" e "documentos desta categoria".
create index documentos_usuario_id_idx on public.documentos (usuario_id);
create index documentos_categoria_id_idx on public.documentos (categoria_id);

-- Antes de cada UPDATE, carimba a data de atualização (usa a função acima).
create trigger documentos_set_atualizado_em
  before update on public.documentos
  for each row execute function public.set_atualizado_em();

-- Segurança (RLS)
alter table public.documentos enable row level security;

create policy "documentos_select_proprio"
  on public.documentos for select
  using (auth.uid() = usuario_id);

create policy "documentos_insert_proprio"
  on public.documentos for insert
  with check (auth.uid() = usuario_id);

create policy "documentos_update_proprio"
  on public.documentos for update
  using (auth.uid() = usuario_id)
  with check (auth.uid() = usuario_id);

create policy "documentos_delete_proprio"
  on public.documentos for delete
  using (auth.uid() = usuario_id);
