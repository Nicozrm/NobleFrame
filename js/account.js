/*
 * account.js
 *
 * Handles the display of account-specific information on the account
 * page, including loyalty points, tier status and the wishlist. It
 * reads data from the rewards and wishlist modules and updates the
 * DOM accordingly. This module should be loaded only on
 * account.html.
 */

(function(window) {
    /**
     * Fetch product data from products.json. This allows the account page
     * to map wishlist IDs to product names without relying on app.js.
     * Returns a promise resolving to an array of products.
     */
    async function loadProducts() {
        try {
            const res = await fetch('data/products.json');
            return await res.json();
        } catch (e) {
            console.error('Fehler beim Laden der Produkte auf der Konto-Seite:', e);
            // Fallback: global productsData
            if (window.productsData && Array.isArray(window.productsData)) {
                return window.productsData;
            }
            return [];
        }
    }

    async function initAccountPage() {
        // Loyalty Points & Tier
        const points = rewards.getPoints();
        const tierInfo = rewards.getNextTierInfo(points);
        const currentTier = rewards.getTier(points);

        const pointsEl = document.getElementById('account-points');
        const tierEl = document.getElementById('account-tier');
        const progressFill = document.getElementById('points-progress-fill');
        if (pointsEl) pointsEl.textContent = points;
        if (tierEl) {
            // Insert badge if tier is Supernova
            if (currentTier.name.toLowerCase() === 'supernova') {
                tierEl.innerHTML = `${currentTier.name} <span class="supernova-badge">VIP</span>`;
            } else {
                tierEl.textContent = currentTier.name;
            }
        }
        if (progressFill) {
            const tierMin = currentTier.min;
            const nextThreshold = tierInfo.nextThreshold;
            const span = nextThreshold === 0 ? 1 : (points - tierMin) / (nextThreshold - tierMin);
            const pct = Math.min(1, Math.max(0, span)) * 100;
            progressFill.style.width = pct + '%';
        }

        // Load products to map wishlist IDs to names
        const products = await loadProducts();
        const wishlistContainer = document.getElementById('wishlist-container');
        if (wishlistContainer) {
            const ids = wishlist.getWishlist();
            wishlistContainer.innerHTML = '';
            if (!ids || ids.length === 0) {
                wishlistContainer.innerHTML = '<p>Keine Artikel in deiner Wunschliste.</p>';
            } else {
                ids.forEach(id => {
                    const product = products.find(p => p.id === id);
                    if (product) {
                        const itemDiv = document.createElement('div');
                        itemDiv.className = 'wishlist-item';
                        itemDiv.innerHTML = `<span>${product.name}</span>`;
                        wishlistContainer.appendChild(itemDiv);
                    }
                });
            }
        }
    }

    window.accountPage = {
        init: initAccountPage
    };
})(window);