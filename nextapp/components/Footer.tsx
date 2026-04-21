import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

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
          <p>(21) 1234-5678</p>
          <p>(21) 98765-4321</p>
          <p>info@casadetradicao.com.br</p>
        </div>
        <div className="footer-col">
          <h4>SOBRE NÓS</h4>
          <p>
            A Casa de Tradição é um restaurante focado em preservar a gastronomia raiz brasileira,
            utilizando processos artesanais e ingredientes naturais para entregar o máximo de
            sabor e história em cada refeição.
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {year} CASA DE TRADIÇÃO. TODOS OS DIREITOS RESERVADOS.</p>
      </div>
    </footer>
  );
}
