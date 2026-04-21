'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
  activePage?: 'home' | 'cardapio' | 'admin';
}

export default function Header({ activePage }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <button
            className="hamburger-btn"
            aria-label="Abrir menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div className="logo-area">
            <Link href="/">
              <Image src="/logo_marca.png" alt="Casa de Tradição" className="logo-img" width={120} height={50} style={{ height: '50px', width: 'auto' }} />
            </Link>
          </div>

          <nav className={`main-nav${menuOpen ? ' active' : ''}`}>
            <Link href="/cardapio" className={activePage === 'cardapio' ? 'active' : ''}>
              VER CARDÁPIO
            </Link>
            <Link href="#pedir">PEDIR ONLINE</Link>
            <Link href="#gift">CARTÃO PRESENTE</Link>
          </nav>
        </div>

        <div className="header-right">
          <Link href="#lojas" className="location-link">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>Encontrar loja</span>
          </Link>
          <button className="cart-btn" aria-label="Carrinho">
            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="1.5" fill="none">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
