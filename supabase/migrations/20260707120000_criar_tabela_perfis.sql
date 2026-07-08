-- Migration: criar tabela `perfis`
-- Guarda os dados de aplicação do usuário (nome de exibição etc.).
-- A autenticação em si (email/senha) vive na tabela escondida `auth.users`,
-- gerenciada pelo Supabase. `perfis` é 1:1 com `auth.users`: mesmo `id`.

create table public.perfis (
  -- O id do perfil É o id do usuário no sistema de login (relação 1:1).
  -- on delete cascade: se a conta for apagada, o perfil vai junto (sem dado órfão).
  id uuid primary key references auth.users (id) on delete cascade,
  nome_completo text,
  criado_em timestamptz not null default now()
);

-- Criação automática do perfil no cadastro
-- ----------------------------------------
-- Sem isto, um usuário recém-cadastrado não teria linha em `perfis`, e as FKs
-- de `categorias`/`documentos` (usuario_id -> perfis.id) não teriam para onde
-- apontar. Um trigger em `auth.users` cria o perfil no mesmo instante do signup.
-- SECURITY DEFINER: roda com privilégios do dono da função (contorna o RLS para
-- conseguir inserir); `set search_path = ''` obriga qualificar todo objeto com o
-- schema (public./auth.) — recomendação de segurança do Supabase contra sequestro
-- de search_path.
create function public.criar_perfil_no_cadastro()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.perfis (id, nome_completo)
  values (new.id, new.raw_user_meta_data ->> 'nome_completo');
  return new;
end;
$$;

create trigger ao_cadastrar_criar_perfil
  after insert on auth.users
  for each row execute function public.criar_perfil_no_cadastro();

-- Segurança (RLS)
-- ---------------
-- Por padrão o Supabase cria a tabela com RLS desligado; ligar é obrigatório.
alter table public.perfis enable row level security;

-- Cada usuário só enxerga e edita o próprio perfil (o id do perfil = auth.uid()).
create policy "perfis_select_proprio"
  on public.perfis for select
  using (auth.uid() = id);

create policy "perfis_insert_proprio"
  on public.perfis for insert
  with check (auth.uid() = id);

create policy "perfis_update_proprio"
  on public.perfis for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Sem policy de DELETE de propósito: o perfil não se apaga sozinho pela app;
-- ele só some via cascade quando a conta em `auth.users` é excluída.
