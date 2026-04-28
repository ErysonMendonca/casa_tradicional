-- =============================================================
-- MIGRATION: Adicionar campos de cores personalizáveis
-- Execute este script no SQL Editor do seu painel Supabase
-- =============================================================

ALTER TABLE public.restaurant_settings
ADD COLUMN IF NOT EXISTS color_primary text DEFAULT '#7E1C1C',
ADD COLUMN IF NOT EXISTS color_secondary text DEFAULT '#371D10',
ADD COLUMN IF NOT EXISTS color_tertiary text DEFAULT '#F4EFE6';

-- Atualizar valores existentes
UPDATE public.restaurant_settings
SET 
  color_primary = COALESCE(color_primary, '#7E1C1C'),
  color_secondary = COALESCE(color_secondary, '#371D10'),
  color_tertiary = COALESCE(color_tertiary, '#F4EFE6');
