import './style.css'
import { getCategories, saveCategory, deleteCategory, getProducts, saveProduct, deleteProduct, resetToDefaults } from './data.js';
import { showToast, showConfirm } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderProducts();
    updateCategorySelect();

    // Tab Logic
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
        });
    });

    // Reset Button
    document.getElementById('btn-reset').addEventListener('click', () => {
        showConfirm(
            'Resetar Sistema', 
            'Deseja resetar para os dados padrão? Isso apagará todas as suas mudanças customizadas.',
            () => {
                resetToDefaults();
                showToast('Sistema resetado com sucesso!');
            }
        );
    });

    // Category Form
    document.getElementById('form-category').addEventListener('submit', (e) => {
        e.preventDefault();
        const category = {
            id: document.getElementById('cat-id').value || null,
            name: document.getElementById('cat-name').value,
            thumbnail: document.getElementById('cat-thumb').value
        };
        saveCategory(category);
        showToast('Categoria salva com sucesso!');
        renderCategories();
        updateCategorySelect();
        e.target.reset();
        document.getElementById('cat-id').value = '';
    });
    // Product Form
    document.getElementById('form-product').addEventListener('submit', (e) => {
        e.preventDefault();
        const product = {
            id: document.getElementById('prod-id').value || null,
            categoryId: document.getElementById('prod-category').value,
            name: document.getElementById('prod-name').value,
            price: document.getElementById('prod-price').value,
            image: document.getElementById('prod-image').value,
            description: document.getElementById('prod-desc').value,
            ingredients: document.getElementById('prod-ingredients').value
        };
        saveProduct(product);
        showToast('Produto salvo com sucesso!');
        renderProducts();
        e.target.reset();
        document.getElementById('prod-id').value = '';
    });
});

function renderCategories() {
    const list = document.getElementById('list-categories');
    const categories = getCategories();
    list.innerHTML = categories.map(cat => `
        <tr>
            <td><img src="${cat.thumbnail}" class="admin-preview"></td>
            <td>${cat.name}</td>
            <td>
                <button class="btn-edit" onclick="editCategory('${cat.id}')">Editar</button>
                <button class="btn-delete" onclick="deleteCategoryAction('${cat.id}')">Excluir</button>
            </td>
        </tr>
    `).join('');
}

function renderProducts() {
    const list = document.getElementById('list-products');
    const products = getProducts();
    const categories = getCategories();
    list.innerHTML = products.map(prod => {
        const catName = categories.find(c => c.id === prod.categoryId)?.name || 'N/A';
        return `
            <tr>
                <td><img src="${prod.image}" class="admin-preview"></td>
                <td>${prod.name}</td>
                <td>${catName}</td>
                <td>R$ ${prod.price}</td>
                <td>
                    <button class="btn-edit" onclick="editProduct('${prod.id}')">Editar</button>
                    <button class="btn-delete" onclick="deleteProductAction('${prod.id}')">Excluir</button>
                </td>
            </tr>
        `;
    }).join('');
}

function updateCategorySelect() {
    const select = document.getElementById('prod-category');
    const categories = getCategories();
    select.innerHTML = categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
}

// Global scope for onclicks (simple for prototype)
window.deleteCategoryAction = (id) => {
    showConfirm(
        'Excluir Categoria',
        'Tem certeza que deseja excluir esta categoria? Todos os produtos vinculados continuarão existindo mas sem categoria.',
        () => {
            deleteCategory(id);
            renderCategories();
            updateCategorySelect();
            showToast('Categoria excluída.', 'info');
        }
    );
};

window.deleteProductAction = (id) => {
    showConfirm(
        'Excluir Produto',
        'Deseja realmente remover este prato do cardápio?',
        () => {
            deleteProduct(id);
            renderProducts();
            showToast('Produto removido.', 'info');
        }
    );
};

window.editCategory = (id) => {
    const categories = getCategories();
    const cat = categories.find(c => c.id === id);
    if (cat) {
        document.getElementById('cat-id').value = cat.id;
        document.getElementById('cat-name').value = cat.name;
        document.getElementById('cat-thumb').value = cat.thumbnail;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

window.editProduct = (id) => {
    const products = getProducts();
    const prod = products.find(p => p.id === id);
    if (prod) {
        document.getElementById('prod-id').value = prod.id;
        document.getElementById('prod-category').value = prod.categoryId;
        document.getElementById('prod-name').value = prod.name;
        document.getElementById('prod-price').value = prod.price;
        document.getElementById('prod-image').value = prod.image;
        document.getElementById('prod-desc').value = prod.description;
        document.getElementById('prod-ingredients').value = prod.ingredients;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};
