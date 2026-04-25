'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductModal from '@/components/ProductModal';
import { DEFAULT_CATEGORIES, DEFAULT_PRODUCTS } from '@/lib/data';
import type { Category, Product } from '@/lib/supabase/types';

function validateImageSrc(src: string | undefined | null, fallback: string): string {
  if (!src || typeof src !== 'string' || src.trim() === '') return fallback;
  if (src.startsWith('/') || src.startsWith('data:')) return src;
  try {
    new URL(src);
    return src;
  } catch (e) {
    return fallback;
  }
}

export default function CardapioPage() {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState(true);

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Busca do Supabase via API Routes (com fallback para dados locais)
  useEffect(() => {
    async function fetchData() {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products'),
        ]);
        if (catsRes.ok && prodsRes.ok) {
          const [cats, prods] = await Promise.all([catsRes.json(), prodsRes.json()]);
          if (Array.isArray(cats) && cats.length > 0) setCategories(cats);
          if (Array.isArray(prods) && prods.length > 0) setProducts(prods);
        }
      } catch {
        // Mantém os dados locais em caso de erro
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const displayedItems = useMemo(() => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return {
        type: 'products' as const,
        items: products.filter(
          p => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term),
        ),
      };
    }
    if (activeCategoryId) {
      return {
        type: 'products' as const,
        items: products.filter(p => p.category_id === activeCategoryId),
      };
    }
    return { type: 'categories' as const, items: categories };
  }, [searchTerm, activeCategoryId, products, categories]);

  const mainTitle = useMemo(() => {
    if (searchTerm.trim()) return 'RESULTADOS DA BUSCA';
    if (activeCategoryId) {
      return (categories.find(c => c.id === activeCategoryId)?.name ?? 'Produtos').toUpperCase();
    }
    return 'TODAS AS CATEGORIAS';
  }, [searchTerm, activeCategoryId, categories]);

  return (
    <>
      <Header activePage="cardapio" />

      <div className="menu-page-wrapper">
        <div className="menu-view-container">
          {/* SIDEBAR */}
          <aside className="menu-sidebar">
            <div className="sidebar-search-box">
              <p>Selecione uma categoria para ver pratos e preços completos.</p>
              <button className="btn-primary-small">BUSCAR LOJA</button>
            </div>

            <nav className="sidebar-categories">
              {loading ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#888', fontSize: '0.8rem', fontFamily: 'var(--font-body)' }}>
                  Carregando...
                </div>
              ) : (
                <>
                  <button
                    className={`cat-item${!activeCategoryId ? ' active' : ''}`}
                    onClick={() => { setActiveCategoryId(null); setSearchTerm(''); }}
                  >
                    <span className="cat-thumb" style={{ backgroundImage: "url('/menu_appetizers.png')" }} />
                    Todas as Categorias
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      className={`cat-item${activeCategoryId === cat.id ? ' active' : ''}`}
                      onClick={() => { setActiveCategoryId(cat.id); setSearchTerm(''); }}
                    >
                      <span className="cat-thumb" style={{ backgroundImage: `url('${cat.thumbnail}')` }} />
                      {cat.name}
                    </button>
                  ))}
                </>
              )}
            </nav>
          </aside>

          {/* CONTEÚDO PRINCIPAL */}
          <section className="menu-main-content">
            <div className="menu-top-bar">
              <div className="search-menu-input">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Pesquisar no cardápio..."
                  value={searchTerm}
                  onChange={e => { setSearchTerm(e.target.value); setActiveCategoryId(null); }}
                />
              </div>
              <button className="btn-catering">Menu para Eventos</button>
            </div>

            <h2 className="section-title-center">{mainTitle}</h2>

            {loading ? (
              <div className="menu-categories-grid">
                {[1, 2, 3, 4, 5].map(n => (
                  <div key={n} style={{
                    background: '#E8E0D4',
                    borderRadius: 4,
                    aspectRatio: '16/11',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }} />
                ))}
                <style>{`@keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }`}</style>
              </div>
            ) : (
              <div className="menu-categories-grid">
                {displayedItems.type === 'categories' &&
                  (displayedItems.items as Category[]).map(cat => (
                    <button
                      key={cat.id}
                      className="menu-category-card"
                      onClick={() => setActiveCategoryId(cat.id)}
                      aria-label={`Ver categoria ${cat.name}`}
                    >
                      <div className="cat-img-wrapper">
                        <Image
                          src={validateImageSrc(cat.thumbnail, '/menu_steaks.png')}
                          alt={cat.name}
                          width={300}
                          height={200}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { (e.target as HTMLImageElement).src = '/menu_steaks.png'; }}
                        />
                      </div>
                      <h3>{cat.name}</h3>
                    </button>
                  ))
                }

                {displayedItems.type === 'products' && (
                  (displayedItems.items as Product[]).length === 0
                    ? <p className="no-products">Nenhum prato encontrado.</p>
                    : (displayedItems.items as Product[]).map(prod => (
                      <button
                        key={prod.id}
                        className="menu-product-card"
                        onClick={() => setSelectedProduct(prod)}
                        aria-label={`Ver detalhes de ${prod.name}`}
                      >
                        <div className="cat-img-wrapper">
                          <Image
                            src={validateImageSrc(prod.image, '/picanha.png')}
                            alt={prod.name}
                            width={300}
                            height={200}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { (e.target as HTMLImageElement).src = '/picanha.png'; }}
                          />
                        </div>
                        <div className="product-info-simple">
                          <h3 className="product-name">{prod.name}</h3>
                          <span className="product-price">
                            € {Number(prod.price).toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </button>
                    ))
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <Footer />
    </>
  );
}
