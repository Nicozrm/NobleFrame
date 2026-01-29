/*
 * app.js
 *
 * Entry point for the LUNARA site. Loads product data, renders
 * product cards, initialises UI modules and defines global helpers
 * such as showToast. This file ties together the store, cartUI,
 * checkout, auth and motion modules.
 */

(function(window) {
    const productsContainerSelector = '#products-container';
    let products = [];
    // State variables for filtering, searching and sorting
    let currentFilter = 'All';
    let currentSearch = '';
    let currentSort = 'name';

    async function loadProducts() {
        try {
            const response = await fetch('data/products.json');
            products = await response.json();
            return products;
        } catch (e) {
            console.error('Fehler beim Laden der Produktdaten:', e);
            showToast('Produkte konnten nicht geladen werden.', 'error');
            return [];
        }
    }

    /**
     * Render products with current filter, search and sort settings.
     * @param {string} filterCategory Category to filter by. Defaults to current state.
     */
    function renderProducts(filterCategory = currentFilter) {
        currentFilter = filterCategory;
        const container = document.querySelector(productsContainerSelector);
        if (!container) return;
        container.innerHTML = '';
        // Filter by category
        let filtered = currentFilter === 'All'
            ? products.slice()
            : products.filter(p => p.category.toLowerCase() === currentFilter.toLowerCase());
        // Filter by search string
        const query = currentSearch.toLowerCase();
        if (query) {
            filtered = filtered.filter(p => {
                const haystack = (p.name + ' ' + (p.shortDesc || '') + ' ' + (p.longDesc || '')).toLowerCase();
                return haystack.includes(query);
            });
        }
        // Sort
        filtered.sort((a, b) => {
            switch (currentSort) {
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'name':
                default:
                    return a.name.localeCompare(b.name);
            }
        });
        // Render cards
        filtered.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card reveal';
            const badge = product.tags && product.tags.length > 0 ? `<div class="badge">${product.tags[0]}</div>` : '';
            card.innerHTML = `
                ${badge}
                <img src="${product.images[0]}" alt="${product.name}">
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-price">€${product.price.toFixed(2)}</div>
                    <div class="product-actions">
                        <button class="btn add-cart" data-id="${product.id}">In den Warenkorb</button>
                        <button class="btn-secondary quick-view-btn" data-id="${product.id}">Quick View</button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
        // After rendering, update motion observer for new elements
        if (window.motion && typeof window.motion.init === 'function') {
            window.motion.init();
        }
    }

    function handleProductClick(e) {
        const addBtn = e.target.closest('.add-cart');
        const quickBtn = e.target.closest('.quick-view-btn');
        if (addBtn) {
            const id = parseInt(addBtn.dataset.id);
            const product = products.find(p => p.id === id);
            if (!product) return;
            // For demo, choose first variant
            const variant = product.variants[0];
            store.addToCart(product.id, variant);
            cartUI.render();
            showToast(`${product.name} wurde zum Warenkorb hinzugefügt.`, 'success');
            cartUI.open();
        }
        if (quickBtn) {
            const id = parseInt(quickBtn.dataset.id);
            openQuickView(id);
        }
    }

    function openQuickView(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        const modalOverlay = document.getElementById('product-modal');
        const modal = modalOverlay.querySelector('.modal');
        // Build variants options
        const options = product.variants.map((v, index) => `<option value="${index}">${v.size.toUpperCase()} / ${v.color}</option>`).join('');
        // Build quality score HTML for modal
        const qualityLabels = {
            zustand: 'Zustand',
            duft: 'Duft',
            waschzustand: 'Waschzustand',
            materialqualitaet: 'Materialqualität',
            materialqualität: 'Materialqualität',
            tragedauer: 'Tragedauer',
            extras: 'Extras'
        };
        let qualityHtml = '';
        if (product.qualityScore) {
            const items = Object.keys(product.qualityScore);
            qualityHtml = `<div class="quality-list">` +
                items.map(key => {
                    const score = product.qualityScore[key];
                    const label = qualityLabels[key] || key;
                    return `
                        <div class="quality-item">
                            <div class="quality-label">${label}</div>
                            <div class="quality-bar">
                                <div class="quality-bar-fill" data-score="${score}"></div>
                            </div>
                        </div>
                    `;
                }).join('') +
            `</div>`;
        }

        modal.innerHTML = `
            <div class="modal-header">
                <h2 class="modal-title">${product.name}</h2>
                <button class="modal-close">×</button>
            </div>
            <img src="${product.images[0]}" alt="${product.name}" style="width:100%; height:300px; object-fit:cover; border-radius: var(--radius-sm); margin-bottom:1rem;">
            <p>${product.longDesc}</p>
            <p><strong>Preis: </strong>€${product.price.toFixed(2)}</p>
            ${qualityHtml}
            <label>Variante:</label>
            <select class="variant-select">${options}</select>
            <div style="margin-top:1rem; text-align:right;">
                <button class="btn add-to-cart-detail">In den Warenkorb</button>
            </div>
        `;
        modalOverlay.classList.add('active');
        // Close modal events
        modalOverlay.addEventListener('click', function(event) {
            if (event.target === modalOverlay || event.target.classList.contains('modal-close')) {
                modalOverlay.classList.remove('active');
            }
        }, { once: true });
        // Add to cart from detail
        modal.querySelector('.add-to-cart-detail').addEventListener('click', () => {
            const select = modal.querySelector('.variant-select');
            const variantIndex = parseInt(select.value);
            const variant = product.variants[variantIndex] || product.variants[0];
            store.addToCart(product.id, variant);
            cartUI.render();
            showToast(`${product.name} wurde zum Warenkorb hinzugefügt.`, 'success');
            modalOverlay.classList.remove('active');
            cartUI.open();
        });
    }

    // Toast notification helper
    function showToast(message, type = 'success') {
        const container = document.querySelector('.toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        // Automatically remove toast after 4 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 600);
        }, 4000);
    }

    // Expose showToast globally so other modules can use it
    window.showToast = showToast;

    // Initialize the app
    document.addEventListener('DOMContentLoaded', async () => {
        products = await loadProducts();
        renderProducts();
        const productsContainer = document.querySelector(productsContainerSelector);
        if (productsContainer) {
            productsContainer.addEventListener('click', handleProductClick);
        }
        cartUI.init(products);
        auth.init();
        motion.init();
        // Filter buttons
        const filterButtons = document.querySelectorAll('[data-filter]');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.filter;
                renderProducts(category);
                // Update active state
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        // Search and sort controls
        const searchInput = document.getElementById('product-search');
        const sortSelect = document.getElementById('product-sort');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                currentSearch = e.target.value;
                renderProducts(currentFilter);
            });
        }
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                currentSort = e.target.value;
                renderProducts(currentFilter);
            });
        }
    });

})(window);
