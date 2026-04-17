// src/utils.js

/**
 * Exibe uma notificação temporária no topo da tela.
 * @param {string} message - Mensagem a ser exibida.
 * @param {string} type - Tipo: 'success' (default), 'error', 'info'.
 */
export function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    
    const icon = type === 'success' ? 
        `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>` : 
        `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
    `;

    document.body.appendChild(toast);

    // Fade in
    setTimeout(() => {
        toast.classList.add('active');
    }, 10);

    // Auto remove
    setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

/**
 * Exibe um modal de confirmação customizado.
 * @param {string} title - Título da mensagem.
 * @param {string} message - Corpo da mensagem explicativa.
 * @param {function} onConfirm - Callback a ser executado no SIM.
 */
export function showConfirm(title, message, onConfirm) {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    
    overlay.innerHTML = `
        <div class="confirm-modal-box">
            <h3 class="confirm-title">${title}</h3>
            <p class="confirm-desc">${message}</p>
            <div class="confirm-actions">
                <button class="btn-confirm-cancel">CANCELAR</button>
                <button class="btn-confirm-ok">SIM, CONTINUAR</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Focus treatment (trap focus is good but maybe simple for now)
    const btnCancel = overlay.querySelector('.btn-confirm-cancel');
    const btnOk = overlay.querySelector('.btn-confirm-ok');

    const cleanUp = () => {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    };

    btnCancel.onclick = cleanUp;
    btnOk.onclick = () => {
        onConfirm();
        cleanUp();
    };

    // Fade in
    setTimeout(() => overlay.classList.add('active'), 10);
}
