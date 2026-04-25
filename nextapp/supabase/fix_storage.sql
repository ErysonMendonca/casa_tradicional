-- =============================================================
-- FIX: Criar o Bucket de Armazenamento e Políticas
-- Execute no SQL Editor do Supabase: https://app.supabase.com
-- =============================================================

-- 1. Criar o bucket 'images' se ele não existir
insert into storage.buckets (id, name, public)
select 'images', 'images', true
where not exists (
    select 1 from storage.buckets where id = 'images'
);

-- 2. Habilitar o RLS no bucket (geralmente habilitado por padrão em novos buckets)

-- 3. Políticas de Segurança para o bucket 'images'

-- 3.1 Permitir leitura pública (fundamental para exibir as imagens no site)
create policy "Acesso Público para Leitura"
on storage.objects for select
using ( bucket_id = 'images' );

-- 3.2 Permitir Upload (Insert)
-- Como o painel admin usa o cliente anon (devido ao sistema de sessão customizado),
-- precisamos permitir anon ou ajustar conforme a segurança desejada.
create policy "Permitir Upload Anonimo para Admin"
on storage.objects for insert
with check ( bucket_id = 'images' );

-- 3.3 Permitir Update
create policy "Permitir Update para Admin"
on storage.objects for update
using ( bucket_id = 'images' );

-- 3.4 Permitir Delete
create policy "Permitir Delete para Admin"
on storage.objects for delete
using ( bucket_id = 'images' );
