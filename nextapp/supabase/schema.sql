-- =============================================================
-- SCRIPT SQL — Casa de Tradição (Supabase)
-- Execute no SQL Editor do Supabase: https://app.supabase.com
-- =============================================================

-- 1. CATEGORIAS
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  thumbnail   text not null,
  created_at  timestamptz default now()
);

-- 2. PRODUTOS
create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  category_id  uuid references public.categories(id) on delete set null,
  name         text not null,
  price        numeric(10,2) not null,
  image        text not null,
  description  text not null,
  ingredients  text not null,
  active       boolean default true,
  created_at   timestamptz default now()
);

-- 3. RESERVAS
create table if not exists public.reservations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text not null,
  date        date not null,
  time        time not null,
  guests      int not null check (guests > 0),
  notes       text,
  status      text default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at  timestamptz default now()
);

-- =============================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================

alter table public.categories   enable row level security;
alter table public.products     enable row level security;
alter table public.reservations enable row level security;

-- Leitura pública para categorias e produtos ativos
create policy "categories_public_read"  on public.categories   for select using (true);
create policy "products_public_read"    on public.products     for select using (active = true);

-- Somente escrita via service_role (API Routes com supabaseAdmin)
-- Nenhuma policy extra necessária — service_role bypassa RLS

-- Inserção de reservas pública (qualquer visitante pode fazer uma reserva)
create policy "reservations_public_insert" on public.reservations for insert with check (true);
-- Leitura de reservas apenas para admins (via service_role)

-- =============================================================
-- DADOS INICIAIS (SEED)
-- =============================================================

insert into public.categories (name, thumbnail) values
  ('Steaks e Grelhados',      '/menu_steaks.png'),
  ('Aperitivos',              '/menu_appetizers.png'),
  ('Burgers e Sanduíches',    '/menu_burgers.png'),
  ('Frutos do Mar',           '/menu_seafood.png'),
  ('Tradições na Cumbuca',    '/feijoada.png');

-- Produtos (referenciando as categorias criadas acima)
with cats as (
  select id, name from public.categories
)
insert into public.products (category_id, name, price, image, description, ingredients)
select
  c.id,
  p.name,
  p.price,
  p.image,
  p.description,
  p.ingredients
from (
  values
  ('Steaks e Grelhados',   'Picanha Premium',          89.90, '/picanha.png',          'Corte nobre de picanha grelhada na brasa.',                      'Picanha (300g), arroz biro-biro, farofa de ovos e vinagrete da casa.'),
  ('Tradições na Cumbuca', 'Feijoada Completa',        74.50, '/feijoada.png',         'A mais tradicional feijoada brasileira.',                        'Feijão preto com carnes nobres (lombo, paio, costelinha), arroz, couve refogada, farofa e laranja.'),
  ('Aperitivos',           'Cebola Gigante (Blooming)', 54.00, '/menu_appetizers.png', 'Nossa famosa cebola gigante empanada e frita.',                  'Cebola gigante, mix de temperos secretos e molho picante especial.'),
  ('Frutos do Mar',        'Salmão Grelhado',          78.90, '/menu_seafood.png',     'Filé de salmão fresco grelhado com molho de camarão.',           'Salmão grelhado, molho cremoso de camarão, arroz branco e legumes no vapor.')
) as p(category_name, name, price, image, description, ingredients)
join cats c on c.name = p.category_name;
