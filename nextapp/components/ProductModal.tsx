'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/supabase/types';

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

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  // Fecha com ESC
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (product) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [product, handleKeyDown]);

  const handleRequest = () => {
    onClose();
    // Toast de confirmação — implementado no componente pai
    alert(`Pedido de "${product?.name}" recebido! Em breve um atendente entrará em contato.`);
  };

  return (
    <div
      className={`modal-overlay${product ? ' active' : ''}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Detalhes do produto"
    >
      <div className="modal-container">
        <button className="close-modal" onClick={onClose} aria-label="Fechar">
          ×
        </button>
        {product && (
          <div className="modal-content">
            <div className="modal-image">
              <Image
                src={validateImageSrc(product.image, '/picanha.png')}
                alt={product.name}
                width={500}
                height={600}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { (e.target as HTMLImageElement).src = '/picanha.png'; }}
              />
            </div>
            <div className="modal-info">
              <h2 className="modal-item-title">{product.name}</h2>
              <p className="modal-item-desc">{product.description}</p>
              <div className="modal-ingredients">
                <h4>O QUE VAI NO PRATO:</h4>
                <p>{product.ingredients}</p>
              </div>
              <div className="modal-footer-action">
                <span className="modal-item-price">
                  € {Number(product.price).toFixed(2).replace('.', ',')}
                </span>
                <button className="btn-request" onClick={handleRequest}>
                  SOLICITAR PEDIDO
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
