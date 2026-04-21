/**
 * Dados padrão (fallback local enquanto o Supabase não está conectado).
 * Após conectar o Supabase, esses dados devem ser migrados para o banco.
 */

import type { Category, Product } from './supabase/types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Steaks e Grelhados', thumbnail: '/menu_steaks.png', created_at: '' },
  { id: '2', name: 'Aperitivos', thumbnail: '/menu_appetizers.png', created_at: '' },
  { id: '3', name: 'Burgers e Sanduíches', thumbnail: '/menu_burgers.png', created_at: '' },
  { id: '4', name: 'Frutos do Mar', thumbnail: '/menu_seafood.png', created_at: '' },
  { id: '5', name: 'Tradições na Cumbuca', thumbnail: '/feijoada.png', created_at: '' },
];

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '101',
    category_id: '1',
    name: 'Picanha Premium',
    image: '/picanha.png',
    price: 89.9,
    description: 'Corte nobre de picanha grelhada na brasa.',
    ingredients: 'Picanha (300g), arroz biro-biro, farofa de ovos e vinagrete da casa.',
    active: true,
    created_at: '',
  },
  {
    id: '102',
    category_id: '5',
    name: 'Feijoada Completa',
    image: '/feijoada.png',
    price: 74.5,
    description: 'A mais tradicional feijoada brasileira.',
    ingredients:
      'Feijão preto com carnes nobres (lombo, paio, costelinha), arroz, couve refogada, farofa e laranja.',
    active: true,
    created_at: '',
  },
  {
    id: '103',
    category_id: '2',
    name: 'Cebola Gigante (Blooming)',
    image: '/menu_appetizers.png',
    price: 54.0,
    description: 'Nossa famosa cebola gigante empanada e frita.',
    ingredients: 'Cebola gigante, mix de temperos secretos e molho picante especial.',
    active: true,
    created_at: '',
  },
  {
    id: '104',
    category_id: '4',
    name: 'Salmão Grelhado',
    image: '/menu_seafood.png',
    price: 78.9,
    description: 'Filé de salmão fresco grelhado com molho de camarão.',
    ingredients: 'Salmão grelhado, molho cremoso de camarão, arroz branco e legumes no vapor.',
    active: true,
    created_at: '',
  },
];
