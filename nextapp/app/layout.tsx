import type { Metadata } from 'next';
import './globals.css';

import { supabaseAdmin } from '@/lib/supabase/admin';

export const metadata: Metadata = {
  title: 'Casa de Tradição',
  description:
    'Restaurante focado em preservar a gastronomia raiz brasileira. Pratos tradicionais com ingredientes selecionados e preparo artesanal em Braga, Portugal.',
  keywords: ['restaurante', 'culinária brasileira', 'tradicional', 'Braga', 'moqueca', 'feijoada'],
  openGraph: {
    title: 'Casa de Tradição',
    description: 'Tradição que alimenta a alma.',
    locale: 'pt_BR',
    type: 'website',
  },
};

async function getSettings() {
  try {
    const { data } = await supabaseAdmin
      .from('restaurant_settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1);
    
    return data && data.length > 0 ? data[0] : null;
  } catch (e) {
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  
  const primaryColor = settings?.color_primary || '#7E1C1C';
  const secondaryColor = settings?.color_secondary || '#371D10';
  const tertiaryColor = settings?.color_tertiary || '#F4EFE6';

  return (
    <html lang="pt-BR">
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --color-accent: ${primaryColor};
            --color-primary-dark: ${secondaryColor};
            --color-bg: ${tertiaryColor};
            
            /* Ajustes automáticos baseados nas cores principais */
            --color-accent-hover: ${primaryColor}E6; /* Adiciona transparência para o hover */
            --color-text: ${secondaryColor};
            --color-text-light: ${tertiaryColor};
            --color-border: ${tertiaryColor}CC;
          }
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}
