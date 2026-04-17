// src/data.js

const DEFAULT_CATEGORIES = [
  { id: '1', name: 'Steaks e Grelhados', thumbnail: '/menu_steaks.png' },
  { id: '2', name: 'Aperitivos', thumbnail: '/menu_appetizers.png' },
  { id: '3', name: 'Burgers e Sanduíches', thumbnail: '/menu_burgers.png' },
  { id: '4', name: 'Frutos do Mar', thumbnail: '/menu_seafood.png' },
  { id: '5', name: 'Tradições na Cumbuca', thumbnail: '/feijoada.png' }
];

const DEFAULT_PRODUCTS = [
  { 
    id: '101', 
    categoryId: '1', 
    name: 'Picanha Premium', 
    image: '/picanha.png', 
    price: '89.90', 
    description: 'Corte nobre de picanha grelhada na brasa.',
    ingredients: 'Picanha (300g), arroz biro-biro, farofa de ovos e vinagrete da casa.'
  },
  { 
    id: '102', 
    categoryId: '5', 
    name: 'Feijoada Completa', 
    image: '/feijoada.png', 
    price: '74.50', 
    description: 'A mais tradicional feijoada brasileira.',
    ingredients: 'Feijão preto com carnes nobres (lombo, paio, costelinha), arroz, couve refogada, farofa e laranja.'
  },
  { 
    id: '103', 
    categoryId: '2', 
    name: 'Cebola Gigante (Blooming)', 
    image: '/menu_appetizers.png', 
    price: '54.00', 
    description: 'Nossa famosa cebola gigante empanada e frita.',
    ingredients: 'Cebola gigante, mix de temperos secretos e molho picante especial.'
  },
  { 
    id: '104', 
    categoryId: '4', 
    name: 'Salmão Grelhado', 
    image: '/menu_seafood.png', 
    price: '78.90', 
    description: 'Filé de salmão fresco grelhado com molho de camarão.',
    ingredients: 'Salmão grelhado, molho cremoso de camarão, arroz branco e legumes no vapor.'
  }
];

export function getCategories() {
  const data = localStorage.getItem('casa_categories');
  return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
}

export function saveCategory(category) {
  const categories = getCategories();
  if (category.id) {
    const index = categories.findIndex(c => c.id === category.id);
    categories[index] = category;
  } else {
    category.id = Date.now().toString();
    categories.push(category);
  }
  localStorage.setItem('casa_categories', JSON.stringify(categories));
  return categories;
}

export function deleteCategory(id) {
  let categories = getCategories();
  categories = categories.filter(c => c.id !== id);
  localStorage.setItem('casa_categories', JSON.stringify(categories));
  return categories;
}

export function getProducts() {
  const data = localStorage.getItem('casa_products');
  return data ? JSON.parse(data) : DEFAULT_PRODUCTS;
}

export function saveProduct(product) {
  const products = getProducts();
  if (product.id) {
    const index = products.findIndex(p => p.id === product.id);
    products[index] = product;
  } else {
    product.id = Date.now().toString();
    products.push(product);
  }
  localStorage.setItem('casa_products', JSON.stringify(products));
  return products;
}

export function deleteProduct(id) {
  let products = getProducts();
  products = products.filter(p => p.id !== id);
  localStorage.setItem('casa_products', JSON.stringify(products));
  return products;
}

export function resetToDefaults() {
  localStorage.setItem('casa_categories', JSON.stringify(DEFAULT_CATEGORIES));
  localStorage.setItem('casa_products', JSON.stringify(DEFAULT_PRODUCTS));
  location.reload();
}
