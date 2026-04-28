-- =============================================================
-- MIGRATION: Adicionar campos de Personalização da Home
-- Execute este script no SQL Editor do seu painel Supabase
-- =============================================================

ALTER TABLE public.restaurant_settings
ADD COLUMN IF NOT EXISTS hero_title text DEFAULT 'TRADIÇÃO QUE ALIMENTA A ALMA.',
ADD COLUMN IF NOT EXISTS hero_image text DEFAULT '/hero_bg.png',
ADD COLUMN IF NOT EXISTS highlight1_title text DEFAULT 'MOQUECA NA PANELA DE BARRO',
ADD COLUMN IF NOT EXISTS highlight1_image text DEFAULT '/moqueca.png',
ADD COLUMN IF NOT EXISTS highlight1_desc text DEFAULT 'Moqueca na panela de barro, com azeite de dendê, temperos frescos e leite de coco.',
ADD COLUMN IF NOT EXISTS highlight2_title text DEFAULT 'FEIJOADA COMPLETA',
ADD COLUMN IF NOT EXISTS highlight2_image text DEFAULT '/feijoada.png',
ADD COLUMN IF NOT EXISTS highlight2_desc text DEFAULT 'Feijoada completa servida na cumbuca de barro, com arroz, farofa e laranja.',
ADD COLUMN IF NOT EXISTS highlight3_title text DEFAULT 'PICANHA NA CHAPA',
ADD COLUMN IF NOT EXISTS highlight3_image text DEFAULT '/picanha.png',
ADD COLUMN IF NOT EXISTS highlight3_desc text DEFAULT 'Picanha na chapa, selecionada e assada com sal grosso no ponto perfeito.',
ADD COLUMN IF NOT EXISTS about_image text DEFAULT '/historia_bg.png',
ADD COLUMN IF NOT EXISTS rewards_title text DEFAULT 'RECOMPENSAS TRADICIONAIS',
ADD COLUMN IF NOT EXISTS rewards_desc text DEFAULT 'Venha conhecer nossas tradições de perto. Participe do nosso programa de recompensas.',
ADD COLUMN IF NOT EXISTS rewards_action text DEFAULT 'GANHE UM PASTELZINHO DE ENTRADA GRÁTIS',
ADD COLUMN IF NOT EXISTS booking_title text DEFAULT 'VIVA A EXPERIÊNCIA',
ADD COLUMN IF NOT EXISTS booking_desc text DEFAULT 'Garanta seu lugar em nossa mesa. Recomendamos reservas com pelo menos 24h de antecedência, especialmente para grupos e finais de semana.',
ADD COLUMN IF NOT EXISTS location_desc text DEFAULT 'Visite nossa casa e sinta o acolhimento da tradição no coração de Braga. Esperamos por você.',
ADD COLUMN IF NOT EXISTS location_map_iframe text DEFAULT 'https://maps.google.com/maps?q=41.5561905,-8.4218855&hl=pt&z=15&output=embed';

-- Atualizar valores existentes
UPDATE public.restaurant_settings
SET 
  hero_title = COALESCE(hero_title, 'TRADIÇÃO QUE ALIMENTA A ALMA.'),
  hero_image = COALESCE(hero_image, '/hero_bg.png'),
  highlight1_title = COALESCE(highlight1_title, 'MOQUECA NA PANELA DE BARRO'),
  highlight1_image = COALESCE(highlight1_image, '/moqueca.png'),
  highlight1_desc = COALESCE(highlight1_desc, 'Moqueca na panela de barro, com azeite de dendê, temperos frescos e leite de coco.'),
  highlight2_title = COALESCE(highlight2_title, 'FEIJOADA COMPLETA'),
  highlight2_image = COALESCE(highlight2_image, '/feijoada.png'),
  highlight2_desc = COALESCE(highlight2_desc, 'Feijoada completa servida na cumbuca de barro, com arroz, farofa e laranja.'),
  highlight3_title = COALESCE(highlight3_title, 'PICANHA NA CHAPA'),
  highlight3_image = COALESCE(highlight3_image, '/picanha.png'),
  highlight3_desc = COALESCE(highlight3_desc, 'Picanha na chapa, selecionada e assada com sal grosso no ponto perfeito.'),
  about_image = COALESCE(about_image, '/historia_bg.png'),
  rewards_title = COALESCE(rewards_title, 'RECOMPENSAS TRADICIONAIS'),
  rewards_desc = COALESCE(rewards_desc, 'Venha conhecer nossas tradições de perto. Participe do nosso programa de recompensas.'),
  rewards_action = COALESCE(rewards_action, 'GANHE UM PASTELZINHO DE ENTRADA GRÁTIS'),
  booking_title = COALESCE(booking_title, 'VIVA A EXPERIÊNCIA'),
  booking_desc = COALESCE(booking_desc, 'Garanta seu lugar em nossa mesa. Recomendamos reservas com pelo menos 24h de antecedência, especialmente para grupos e finais de semana.'),
  location_desc = COALESCE(location_desc, 'Visite nossa casa e sinta o acolhimento da tradição no coração de Braga. Esperamos por você.'),
  location_map_iframe = COALESCE(location_map_iframe, 'https://maps.google.com/maps?q=41.5561905,-8.4218855&hl=pt&z=15&output=embed')
WHERE id IS NOT NULL;
