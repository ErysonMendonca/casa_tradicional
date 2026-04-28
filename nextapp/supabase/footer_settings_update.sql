-- =============================================================
-- MIGRATION: Adicionar campos de Rodapé e Sobre Nós
-- Execute este script no SQL Editor do seu painel Supabase
-- =============================================================

ALTER TABLE public.restaurant_settings
ADD COLUMN IF NOT EXISTS about_title text DEFAULT 'NOSSA HISTÓRIA',
ADD COLUMN IF NOT EXISTS about_text text DEFAULT 'Desde as gerações passadas, a Casa de Tradição mantém o compromisso de trazer o sabor autêntico da culinária brasileira para a sua mesa. Nascemos da paixão pelas panelas de barro e pelo fogo de chão, preservando segredos culinários que atravessam décadas.\n\nCada prato é uma celebração da nossa cultura, preparado com ingredientes selecionados de pequenos produtores e o carinho que só uma cozinha verdadeiramente tradicional pode oferecer. Venha viver essa experiência conosco.',
ADD COLUMN IF NOT EXISTS contact_phone text DEFAULT '(21) 1234-5678',
ADD COLUMN IF NOT EXISTS contact_phone_2 text DEFAULT '(21) 98765-4321',
ADD COLUMN IF NOT EXISTS contact_email text DEFAULT 'info@casadetradicao.com.br',
ADD COLUMN IF NOT EXISTS contact_address text DEFAULT 'Braga, Portugal',
ADD COLUMN IF NOT EXISTS footer_about_text text DEFAULT 'A Casa de Tradição é um restaurante focado em preservar a gastronomia raiz brasileira, utilizando processos artesanais e ingredientes naturais para entregar o máximo de sabor e história em cada refeição.',
ADD COLUMN IF NOT EXISTS footer_rights text DEFAULT 'CASA DE TRADIÇÃO. TODOS OS DIREITOS RESERVADOS.';

-- Garantir que a linha existente tenha os valores padrão se estiverem nulos
UPDATE public.restaurant_settings
SET 
  about_title = COALESCE(about_title, 'NOSSA HISTÓRIA'),
  about_text = COALESCE(about_text, 'Desde as gerações passadas, a Casa de Tradição mantém o compromisso de trazer o sabor autêntico da culinária brasileira para a sua mesa. Nascemos da paixão pelas panelas de barro e pelo fogo de chão, preservando segredos culinários que atravessam décadas.\n\nCada prato é uma celebração da nossa cultura, preparado com ingredientes selecionados de pequenos produtores e o carinho que só uma cozinha verdadeiramente tradicional pode oferecer. Venha viver essa experiência conosco.'),
  contact_phone = COALESCE(contact_phone, '(21) 1234-5678'),
  contact_phone_2 = COALESCE(contact_phone_2, '(21) 98765-4321'),
  contact_email = COALESCE(contact_email, 'info@casadetradicao.com.br'),
  contact_address = COALESCE(contact_address, 'Braga, Portugal'),
  footer_about_text = COALESCE(footer_about_text, 'A Casa de Tradição é um restaurante focado em preservar a gastronomia raiz brasileira, utilizando processos artesanais e ingredientes naturais para entregar o máximo de sabor e história em cada refeição.'),
  footer_rights = COALESCE(footer_rights, 'CASA DE TRADIÇÃO. TODOS OS DIREITOS RESERVADOS.')
WHERE id IS NOT NULL;
