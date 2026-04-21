import type { Metadata } from 'next';
import './globals.css';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
