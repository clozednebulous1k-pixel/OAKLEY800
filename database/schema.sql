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

drop policy if exists "inscricoes_insert_public" on public.inscricoes;
drop policy if exists "inscricoes_select_admin" on public.inscricoes;
drop policy if exists "inscricoes_delete_admin" on public.inscricoes;

-- Visitantes podem enviar inscrição (chave anon do front)
create policy "inscricoes_insert_public"
  on public.inscricoes
  for insert
  to anon, authenticated
  with check (true);

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
