-- ===========================================================================
--  SEED COMPLETO — Casa de Tradição
--  Execute no SQL Editor do Supabase: https://app.supabase.com
--  Projeto → SQL Editor → New Query → cole este script → Run
-- ===========================================================================

-- ===========================================================================
-- PASSO 1: SCHEMA (pule se já executou o schema.sql antes)
-- ===========================================================================

create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  thumbnail   text not null,
  created_at  timestamptz default now()
);

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

-- RLS
alter table public.categories   enable row level security;
alter table public.products     enable row level security;
alter table public.reservations enable row level security;

-- Policies (ignora se já existem)
do $$ begin
  create policy "categories_public_read" on public.categories for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "products_public_read" on public.products for select using (active = true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "reservations_public_insert" on public.reservations for insert with check (true);
exception when duplicate_object then null; end $$;


-- ===========================================================================
-- PASSO 2: LIMPAR DADOS ANTERIORES (se quiser recomeçar)
-- ===========================================================================
-- Descomente as linhas abaixo para limpar antes de reinserir:
-- truncate public.products restart identity cascade;
-- truncate public.categories restart identity cascade;


-- ===========================================================================
-- PASSO 3: CATEGORIAS
-- ===========================================================================

insert into public.categories (id, name, thumbnail) values
  ('a1000000-0000-0000-0000-000000000001', 'Steaks e Grelhados',    '/menu_steaks.png'),
  ('a1000000-0000-0000-0000-000000000002', 'Aperitivos',            '/menu_appetizers.png'),
  ('a1000000-0000-0000-0000-000000000003', 'Burgers e Sanduíches',  '/menu_burgers.png'),
  ('a1000000-0000-0000-0000-000000000004', 'Frutos do Mar',         '/menu_seafood.png'),
  ('a1000000-0000-0000-0000-000000000005', 'Tradições na Cumbuca',  '/feijoada.png')
on conflict (id) do nothing;


-- ===========================================================================
-- PASSO 4: PRODUTOS (12 pratos completos)
-- ===========================================================================

insert into public.products (id, category_id, name, price, image, description, ingredients, active) values

  -- ── STEAKS E GRELHADOS ──────────────────────────────────────────────────
  (
    'b1000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000001',
    'Picanha Premium 300g',
    89.90,
    '/picanha.png',
    'Corte nobre de picanha maturada, grelhada na brasa com sal grosso no ponto exato. Servida fatiada com acompanhamentos tradicionais.',
    'Picanha bovina maturada (300g), arroz biro-biro com alho, farofa de ovos caipiras, vinagrete da casa e pão de alho artesanal.',
    true
  ),
  (
    'b1000000-0000-0000-0000-000000000002',
    'a1000000-0000-0000-0000-000000000001',
    'Alcatra com Manteiga de Ervas',
    79.90,
    '/menu_steaks.png',
    'Alcatra grelhada em fogo alto e finalizada com manteiga de ervas frescas. Macia por dentro, selada por fora.',
    'Alcatra (280g), manteiga de ervas frescas (alecrim, tomilho, alho), arroz branco, batata rústica assada e salada da casa.',
    true
  ),
  (
    'b1000000-0000-0000-0000-000000000003',
    'a1000000-0000-0000-0000-000000000001',
    'Costela de Boi no Bafo (500g)',
    94.90,
    '/picanha.png',
    'Costela bovina cozida lentamente no bafo por 8 horas até o ponto de desmanchar. Uma tradição que não tem preço.',
    'Costela de boi (500g), marinada especial da casa (páprica defumada, alho, cebola, louro), mandioca cozida, molho de pimenta artesanal e farofa de bacon.',
    true
  ),

  -- ── APERITIVOS ──────────────────────────────────────────────────────────
  (
    'b1000000-0000-0000-0000-000000000004',
    'a1000000-0000-0000-0000-000000000002',
    'Cebola Gigante Empanada',
    54.00,
    '/menu_appetizers.png',
    'Nossa lendária Cebola Gigante, empanada no mix secreto de especiarias e frita na hora. Crocante por fora, macia por dentro. Serve até 4 pessoas.',
    'Cebola doce uruguaia selecionada (1 kg), mix secreto de especiarias (páprica, cominho, alho em pó, orégano), molho de imersão picante da casa.',
    true
  ),
  (
    'b1000000-0000-0000-0000-000000000005',
    'a1000000-0000-0000-0000-000000000002',
    'Bolinho de Bacalhau (6 unidades)',
    38.90,
    '/menu_appetizers.png',
    'Bolinhos de bacalhau do Porto feitos com peixe desfiado, batata e ervas. Fritos na hora, dourados e irresistíveis. Acompanha maionese de ervas.',
    'Bacalhau do Porto (200g), batata asterix, cebola, salsinha, coentro, azeite extravirgem e maionese de ervas frescas para acompanhar.',
    true
  ),

  -- ── BURGERS E SANDUÍCHES ────────────────────────────────────────────────
  (
    'b1000000-0000-0000-0000-000000000006',
    'a1000000-0000-0000-0000-000000000003',
    'Burger da Casa 200g',
    49.90,
    '/menu_burgers.png',
    'Smash burger artesanal com blend exclusivo de carnes nobres (fraldinha + acém). Temperado com sal e pimenta preta, selado na chapa.',
    'Blend 200g (fraldinha + acém), queijo cheddar americano, alface americana, tomate, cebola roxa caramelizada, molho especial da casa, brioche artesanal e batata rústica temperada.',
    true
  ),
  (
    'b1000000-0000-0000-0000-000000000007',
    'a1000000-0000-0000-0000-000000000003',
    'Smash Burger Duplo 400g',
    62.90,
    '/menu_burgers.png',
    'Dois smash burgers empilhados com blend premium, duplo queijo e o dobro de sabor. Para os fãs da carne no ponto certo.',
    'Blend duplo 400g (fraldinha + acém), queijo cheddar duplo, bacon suíno tostado, alface, tomate, pickles, cebola caramelizada artesanal, aioli de alho defumado, brioche premium e batatas fritas.',
    true
  ),

  -- ── FRUTOS DO MAR ───────────────────────────────────────────────────────
  (
    'b1000000-0000-0000-0000-000000000008',
    'a1000000-0000-0000-0000-000000000004',
    'Salmão Grelhado com Molho de Camarão',
    78.90,
    '/menu_seafood.png',
    'Filé de salmão fresco grelhado ao ponto, coberto com molho cremoso de camarão ao champignon. Elegância e sabor do mar na sua mesa.',
    'Filé de salmão fresco (250g), camarão médio (100g), champignon fatiado, creme de leite fresco, manteiga noisette, arroz branco soltinho e legumes no vapor (brócolis, cenoura, abobrinha).',
    true
  ),
  (
    'b1000000-0000-0000-0000-000000000009',
    'a1000000-0000-0000-0000-000000000004',
    'Camarão na Manteiga ao Alho',
    84.90,
    '/menu_seafood.png',
    'Camarões grandes salteados na manteiga de qualidade com alho dourado e ervas frescas. Simples, mas de um sabor incrível.',
    'Camarão grande VG (300g), manteiga de qualidade superior, alho confitado, limão siciliano, azeite de oliva extravirgem, arroz de limão e pão artesanal tostado na manteiga.',
    true
  ),

  -- ── TRADIÇÕES NA CUMBUCA ────────────────────────────────────────────────
  (
    'b1000000-0000-0000-0000-000000000010',
    'a1000000-0000-0000-0000-000000000005',
    'Feijoada Completa (individual)',
    74.50,
    '/feijoada.png',
    'A mais tradicional feijoada brasileira, cozida lentamente com carnes nobres selecionadas. Servida na cumbuca de barro que mantém o calor. Tradição que vai além do sabor.',
    'Feijão preto (200g), lombo suíno, costela suína, paio, chouriço, lingüiça calabresa, orelha, pé e rabo de porco, arroz branco, couve refogada no alho e azeite, farofa crocante de manteiga e rodela de laranja baía.',
    true
  ),
  (
    'b1000000-0000-0000-0000-000000000011',
    'a1000000-0000-0000-0000-000000000005',
    'Moqueca de Peixe na Panela de Barro',
    82.90,
    '/moqueca.png',
    'Moqueca autêntica do litoral baiano, preparada na tradicional panela de barro que absorve os sabores ao longo do cozimento. Receita de gerações.',
    'Peixe robalo (250g) ou garoupa, azeite de dendê extra, leite de coco fresco, tomate, cebola, pimentão vermelho, amarelo e verde, coentro, pimenta dedo-de-moça, arroz branco e pirão de peixe feito na hora.',
    true
  ),
  (
    'b1000000-0000-0000-0000-000000000012',
    'a1000000-0000-0000-0000-000000000005',
    'Frango ao Molho de Tucupi',
    58.90,
    '/feijoada.png',
    'Coxa e sobrecoxa de frango caipira cozidas no tucupi artesanal com jambu. Um sabor único da Amazônia que transporta você para a floresta.',
    'Coxa e sobrecoxa de frango caipira, tucupi artesanal (400ml), jambu fresco, alho, cebola, pimenta de cheiro, arroz branco e farofa de mandioca temperada.',
    true
  )

on conflict (id) do nothing;


-- ===========================================================================
-- PASSO 5: USUÁRIO ADMINISTRADOR
-- ===========================================================================
-- O usuário admin deve ser criado pelo painel do Supabase:
--
--  1. Acesse: https://app.supabase.com
--  2. Selecione seu projeto
--  3. Vá em: Authentication → Users → Add User → Create new user
--  4. Preencha:
--       Email:  admin@casadetradicao.com
--       Password: Admin@2026!  ← mude para uma senha forte
--       [ ] Auto Confirm User → marque esta opção
--  5. Clique em "Create User"
--  6. O usuário já poderá fazer login em /admin/login
--
-- OU via SQL (requer acesso direto ao schema auth):
-- insert into auth.users (
--   id, email, encrypted_password, email_confirmed_at,
--   created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
--   is_super_admin, role
-- ) values (
--   gen_random_uuid(),
--   'admin@casadetradicao.com',
--   crypt('Admin@2026!', gen_salt('bf')),
--   now(), now(), now(),
--   '{"provider":"email","providers":["email"]}',
--   '{"name":"Administrador"}',
--   false, 'authenticated'
-- ) on conflict do nothing;
-- ===========================================================================


-- ===========================================================================
-- VERIFICAÇÃO: Conferir dados inseridos
-- ===========================================================================
select 'Categorias:' as tabela, count(*) as total from public.categories
union all
select 'Produtos:',   count(*) from public.products
union all
select 'Reservas:',   count(*) from public.reservations;
