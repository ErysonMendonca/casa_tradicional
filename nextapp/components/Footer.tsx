'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Footer({ initialSettings }: { initialSettings?: any }) {
  const year = new Date().getFullYear();
  const [settings, setSettings] = useState<any>(initialSettings || null);

  useEffect(() => {
    if (!initialSettings) {
      fetch('/api/settings', { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setSettings(data);
          } else if (data === null) {
            setSettings({});
          }
        })
        .catch(err => console.error('Erro ao carregar configurações do rodapé:', err));
    } else {
      setSettings(initialSettings);
    }
  }, [initialSettings]);

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <h4>SITE</h4>
          <Link href="/cardapio">Cardápio</Link>
          <Link href="#reservas">Reservas</Link>
          <Link href="#lojas">Lojas</Link>
          <Link href="#sobre">Sobre Nós</Link>
        </div>
        <div className="footer-col">
          <h4>CONTATO</h4>
          <p>{settings?.contact_phone || '(21) 1234-5678'}</p>
          {settings?.contact_phone_2 && <p>{settings.contact_phone_2}</p>}
          <p>{settings?.contact_email || 'info@casadetradicao.com.br'}</p>
          {settings?.contact_address && <p>{settings.contact_address}</p>}
          
          {settings?.whatsapp_number && (
            <a 
              href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#2D5A27', fontWeight: 'bold', display: 'block', marginTop: '10px', textDecoration: 'none' }}
            >
              🟢 WhatsApp: {settings.whatsapp_number}
            </a>
          )}
        </div>
        <div className="footer-col">
          <h4>SOBRE NÓS</h4>
          <p>
            {settings?.footer_about_text || 
              'A Casa de Tradição é um restaurante focado em preservar a gastronomia raiz brasileira, utilizando processos artesanais e ingredientes naturais para entregar o máximo de sabor e história em cada refeição.'
            }
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {year} {settings?.footer_rights || 'CASA DE TRADIÇÃO. TODOS OS DIREITOS RESERVADOS.'}</p>
      </div>
    </footer>
  );
}
