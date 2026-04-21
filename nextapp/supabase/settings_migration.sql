-- =============================================================
-- CRIAÇÃO DA TABELA DE CONFIGURAÇÕES DE RESERVA
-- Execute isto no SQL Editor do seu painel Supabase
-- =============================================================

create table if not exists public.restaurant_settings (
  id uuid primary key default gen_random_uuid(),
  total_tables int not null default 10,
  open_time time not null default '10:00:00',
  close_time time not null default '22:00:00',
  reservation_duration_mins int not null default 90,
  whatsapp_number text not null default '5511999999999',
  updated_at timestamptz default now()
);

-- Limpar caso exista lixo para mantermos apenas 1 linha oficial de configuração
truncate public.restaurant_settings restart identity cascade;

-- Inserir a linha única de configuração padrão baseada na sua idealização
insert into public.restaurant_settings (total_tables, open_time, close_time, reservation_duration_mins, whatsapp_number)
values (10, '10:00:00', '22:00:00', 90, '');

-- Políticas de Segurança (Row Level Security)
alter table public.restaurant_settings enable row level security;

-- O sistema público (front-end) pode ler essas configurações para saber se há vagas e pra quem mandar o WhatsApp
do $$ begin
  create policy "settings_public_read" on public.restaurant_settings for select using (true);
exception when duplicate_object then null; end $$;
