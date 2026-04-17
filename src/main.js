import './style.css'
import { getCategories, getProducts } from './data.js';
import { showToast } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // Menu Page Logic
    if (document.body.classList.contains('menu-page')) {
        initMenuPage();
    }

    // Common Logic (Mobile Menu)
    const hamburger = document.querySelector('.hamburger-btn');
    const mainNav = document.querySelector('.main-nav');
    if (hamburger && mainNav) {
        hamburger.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }

    // Modal Close Logic
    const closeModal = document.querySelector('.close-modal');
    const modal = document.getElementById('product-modal');
    if (closeModal && modal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }

    // Button Request Logic
    const btnRequest = document.getElementById('btn-request');
    if (btnRequest) {
        btnRequest.addEventListener('click', () => {
            showToast('Pedido solicitado com sucesso! Em breve um atendente entrará em contato.');
            modal.classList.remove('active');
        });
    }
});

function initMenuPage() {
    renderSidebarCategories();
    renderMainCategories();

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            if (term) {
                renderSearchResults(term);
            } else {
                renderMainCategories();
            }
        });
    }
}

function renderSidebarCategories() {
    const container = document.getElementById('sidebar-categories');
    const categories = getCategories();

    container.innerHTML = `
        <a href="#" class="cat-item active" data-id="all">
          <span class="cat-thumb" style="background-image: url('/menu_appetizers.png');"></span>
          Todas as Categorias
        </a>
    ` + categories.map(cat => `
        <a href="#" class="cat-item" data-id="${cat.id}">
          <span class="cat-thumb" style="background-image: url('${cat.thumbnail}');"></span>
          ${cat.name}
        </a>
    `).join('');

    container.querySelectorAll('.cat-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            container.querySelectorAll('.cat-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const catId = item.dataset.id;
            if (catId === 'all') {
                renderMainCategories();
            } else {
                renderProductsByCategory(catId);
            }
        });
    });
}

function renderMainCategories() {
    document.getElementById('main-title').textContent = 'TODAS AS CATEGORIAS';
    const grid = document.getElementById('menu-grid');
    const categories = getCategories();

    grid.innerHTML = categories.map(cat => `
        <div class="menu-category-card" data-id="${cat.id}">
          <div class="cat-img-wrapper">
            <img src="${cat.thumbnail}" alt="${cat.name}">
          </div>
          <h3>${cat.name}</h3>
        </div>
    `).join('');

    grid.querySelectorAll('.menu-category-card').forEach(card => {
        card.addEventListener('click', () => {
            renderProductsByCategory(card.dataset.id);
            // Sync sidebar
            const sidebar = document.getElementById('sidebar-categories');
            sidebar.querySelectorAll('.cat-item').forEach(i => i.classList.remove('active'));
            sidebar.querySelector(`[data-id="${card.dataset.id}"]`)?.classList.add('active');
        });
    });
}

function renderProductsByCategory(catId) {
    const categories = getCategories();
    const subTitle = categories.find(c => c.id === catId)?.name || 'Produtos';
    document.getElementById('main-title').textContent = subTitle.toUpperCase();

    const grid = document.getElementById('menu-grid');
    const products = getProducts().filter(p => p.categoryId === catId);

    if (products.length === 0) {
        grid.innerHTML = '<p class="no-products">Nenhum prato cadastrado nesta categoria.</p>';
        return;
    }

    grid.innerHTML = products.map(prod => `
        <div class="menu-product-card" data-id="${prod.id}">
          <div class="cat-img-wrapper">
            <img src="${prod.image}" alt="${prod.name}">
          </div>
          <div class="product-info-simple">
            <h3 class="product-name">${prod.name}</h3>
            <span class="product-price">R$ ${prod.price}</span>
          </div>
        </div>
    `).join('');

    grid.querySelectorAll('.menu-product-card').forEach(card => {
        card.addEventListener('click', () => {
            openProductModal(card.dataset.id);
        });
    });
}

function renderSearchResults(term) {
    document.getElementById('main-title').textContent = 'RESULTADOS DA BUSCA';
    const grid = document.getElementById('menu-grid');
    const products = getProducts().filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.description.toLowerCase().includes(term)
    );

    if (products.length === 0) {
        grid.innerHTML = '<p class="no-products">Nenhum prato encontrado para sua busca.</p>';
        return;
    }

    grid.innerHTML = products.map(prod => `
        <div class="menu-product-card" data-id="${prod.id}">
          <div class="cat-img-wrapper">
            <img src="${prod.image}" alt="${prod.name}">
          </div>
          <div class="product-info-simple">
            <h3 class="product-name">${prod.name}</h3>
            <span class="product-price">R$ ${prod.price}</span>
          </div>
        </div>
    `).join('');

    grid.querySelectorAll('.menu-product-card').forEach(card => {
        card.addEventListener('click', () => {
            openProductModal(card.dataset.id);
        });
    });
}

function openProductModal(prodId) {
    const products = getProducts();
    const prod = products.find(p => p.id === prodId);
    if (!prod) return;

    document.getElementById('modal-img').src = prod.image;
    document.getElementById('modal-title').textContent = prod.name;
    document.getElementById('modal-desc').textContent = prod.description;
    document.getElementById('modal-ingredients-list').textContent = prod.ingredients;
    document.getElementById('modal-price').textContent = `R$ ${prod.price}`;

    document.getElementById('product-modal').classList.add('active');
}
