import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReservationForm from '@/components/ReservationForm';
import { supabaseAdmin } from '@/lib/supabase/admin';
 
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Casa de Tradição — Gastronomia Brasileira em Braga',
  description:
    'Venha viver a experiência da culinária brasileira tradicional. Moqueca, Feijoada, Picanha e muito mais. Restaurante em Braga, Portugal.',
};

async function getSettings() {
  try {
    const { data } = await supabaseAdmin
      .from('restaurant_settings')
      .select('*')
      .order('updated_at', { ascending: false });
    
    return data && data.length > 0 ? data[0] : null;
  } catch (e) {
    console.error('Erro ao buscar settings no servidor:', e);
    return null;
  }
}

export default async function HomePage() {
  const settings = await getSettings();

  return (
    <>
      <Header activePage="home" />

      <main>
        {/* ===== HERO ===== */}
        <section className="hero" style={{ backgroundImage: "url('/hero_bg.png')" }}>
          <div className="hero-content">
            <h1>
              TRADIÇÃO QUE<br />ALIMENTA A ALMA.
            </h1>
            <div className="hero-buttons">
              <Link href="/cardapio" className="btn-secondary">VER CARDÁPIO</Link>
              <Link href="#reservar" className="btn-primary">FAZER RESERVA</Link>
            </div>
          </div>
        </section>

        {/* ===== DESTAQUES ===== */}
        <section className="destaques" id="cardapio">
          <h2>TRADIÇÕES EM DESTAQUE</h2>
          <div className="cards-grid">
            <div className="card">
              <Image src="/moqueca.png" alt="Moqueca na Panela de Barro" width={400} height={250} style={{ width: '100%', height: '250px', objectFit: 'cover', marginBottom: '20px' }} />
              <h3>MOQUECA NA PANELA DE BARRO</h3>
              <p>Moqueca na panela de barro, com azeite de dendê, temperos frescos e leite de coco.</p>
            </div>
            <div className="card">
              <Image src="/feijoada.png" alt="Feijoada Completa" width={400} height={250} style={{ width: '100%', height: '250px', objectFit: 'cover', marginBottom: '20px' }} />
              <h3>FEIJOADA COMPLETA</h3>
              <p>Feijoada completa servida na cumbuca de barro, com arroz, farofa e laranja.</p>
            </div>
            <div className="card">
              <Image src="/picanha.png" alt="Picanha na Chapa" width={400} height={250} style={{ width: '100%', height: '250px', objectFit: 'cover', marginBottom: '20px' }} />
              <h3>PICANHA NA CHAPA</h3>
              <p>Picanha na chapa, selecionada e assada com sal grosso no ponto perfeito.</p>
            </div>
          </div>
        </section>

        {/* ===== NOSSA HISTÓRIA ===== */}
        <section className="historia" id="sobre">
          <div className="historia-container">
            <div className="historia-text">
              <h2>{settings?.about_title || 'NOSSA HISTÓRIA'}</h2>
              <div style={{ whiteSpace: 'pre-line' }}>
                <p>
                  {settings?.about_text || 
                    `Desde as gerações passadas, a Casa de Tradição mantém o compromisso de trazer o sabor autêntico da culinária brasileira para a sua mesa. Nascemos da paixão pelas panelas de barro e pelo fogo de chão, preservando segredos culinários que atravessam décadas.\n\nCada prato é uma celebração da nossa cultura, preparado com ingredientes selecionados de pequenos produtores e o carinho que só uma cozinha verdadeiramente tradicional pode oferecer. Venha viver essa experiência conosco.`
                  }
                </p>
              </div>
              <div className="historia-actions">
                <Link href="/cardapio" className="btn-secondary">VER CARDÁPIO</Link>
              </div>
            </div>
            <div className="historia-image" />
          </div>
        </section>

        {/* ===== RECOMPENSAS ===== */}
        <section className="recompensas">
          <div className="recompensas-content">
            <div className="recompensas-text">
              <h2>RECOMPENSAS<br />TRADICIONAIS</h2>
              <p>Venha conhecer nossas tradições de perto. Participe do nosso programa de recompensas.</p>
            </div>
            <div className="recompensas-action">
              <h3>GANHE UM PASTELZINHO DE ENTRADA GRÁTIS</h3>
              <Link href="#signup" className="btn-secondary">CADASTRAR / ENTRAR</Link>
            </div>
          </div>
        </section>

        {/* ===== RESERVAR ===== */}
        <section className="reservar" id="reservar">
          <div className="reservation-container">
            <div className="res-form-side">
              <h2 className="section-title-center" style={{ textAlign: 'left', marginBottom: '30px' }}>RESERVE SUA MESA</h2>
              <ReservationForm />
            </div>
            <div className="res-info-side">
              <h2>VIVA A EXPERIÊNCIA</h2>
              <p>
                Garanta seu lugar em nossa mesa. Recomendamos reservas com pelo menos 24h de antecedência, especialmente para grupos e finais de semana.
              </p>
              <div className="res-details">
                <p><strong>Horário de Funcionamento:</strong><br />Ter - Dom: {settings?.open_time?.substring(0, 5) || '12:00'} - {settings?.close_time?.substring(0, 5) || '23:00'}</p>
                <p><strong>Telefone:</strong><br />{settings?.contact_phone || '+351 000 000 000'}</p>
                <p><strong>Morada:</strong><br />{settings?.contact_address || 'Braga, Portugal'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== LOCALIZAÇÃO ===== */}
        <section className="localizacao" id="lojas">
          <div className="loc-text">
            <h2>LOCALIZADO EM<br />{settings?.contact_address?.split(',')[0]?.toUpperCase() || 'BRAGA'}</h2>
            <p>Visite nossa casa e sinta o acolhimento da tradição no coração de {settings?.contact_address?.split(',')[0] || 'Braga'}. Esperamos por você.</p>
            <p><strong>{settings?.contact_address || 'Braga, Portugal'}</strong></p>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=41.5561905,-8.4218855"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              COMO CHEGAR
            </a>
          </div>
          <div className="loc-map">
            <iframe
              src="https://maps.google.com/maps?q=41.5561905,-8.4218855&hl=pt&z=15&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.2)', display: 'block', minHeight: '500px' }}
              allowFullScreen
              loading="lazy"
              title="Localização Casa de Tradição"
            />
          </div>
        </section>
      </main>

      <Footer initialSettings={settings} />
    </>
  );
}
