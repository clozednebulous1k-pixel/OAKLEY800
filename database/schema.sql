-- Rode este SQL no editor SQL do seu projeto Supabase (ou em qualquer Postgres compatível).
-- Tabela de inscrições do formulário público.

create table if not exists public.inscricoes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  curso text not null,
  semestre text not null,
  created_at timestamptz not null default now()
);

-- Índice para listar por data no painel
create index if not exists inscricoes_created_at_idx on public.inscricoes (created_at desc);

alter table public.inscricoes enable row level security;
alter table public.inscricoes force row level security;

drop policy if exists "inscricoes_insert_public" on public.inscricoes;
drop policy if exists "inscricoes_select_admin" on public.inscricoes;
drop policy if exists "inscricoes_delete_admin" on public.inscricoes;

-- Visitantes podem enviar inscrição (chave anon do front)
create policy "inscricoes_insert_public"
  on public.inscricoes
  for insert
  to anon
  with check (
    char_length(trim(nome)) between 2 and 120
    and char_length(trim(curso)) between 2 and 120
    and char_length(trim(semestre)) between 1 and 40
  );

-- Só usuários logados (admin) podem listar
create policy "inscricoes_select_admin"
  on public.inscricoes
  for select
  to authenticated
  using (true);

-- Só admin logado pode remover permanentemente
create policy "inscricoes_delete_admin"
  on public.inscricoes
  for delete
  to authenticated
  using (true);

-- Permissões explícitas (evita DELETE “silencioso” = 0 linhas se a role não tiver direito na tabela)
revoke all on table public.inscricoes from public;
grant usage on schema public to anon, authenticated;
grant insert on public.inscricoes to anon;
grant select, delete on public.inscricoes to authenticated;
