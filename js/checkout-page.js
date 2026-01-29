/*
 * checkout-page.js
 *
 * Provides basic checkout functionality on the checkout page. It
 * summarizes the cart contents, calculates the total and handles
 * the submission of a demo checkout form. When the user completes
 * the checkout, points are awarded via the rewards module and the
 * cart is cleared. Finally, the user is redirected to the account
 * page.
 */

(function(window) {
    let productMap = [];

    async function init() {
        // Load product data locally so we can map cart items to names/prices
        try {
            const response = await fetch('data/products.json');
            productMap = await response.json();
        } catch (e) {
            console.error('Fehler beim Laden der Produktdaten im Checkout:', e);
            // fallback to global productsData if available
            if (window.productsData && Array.isArray(window.productsData)) {
                productMap = window.productsData;
            }
        }
        renderCartSummary();
        const form = document.getElementById('checkout-form');
        if (form) {
            form.addEventListener('submit', completeCheckout);
        }
    }

    function renderCartSummary() {
        const container = document.getElementById('checkout-items');
        const totalEl = document.getElementById('checkout-total');
        const cart = store.getCart();
        let total = 0;
        if (!container) return;
        container.innerHTML = '';
        if (!cart || cart.length === 0) {
            container.innerHTML = '<p>Dein Warenkorb ist leer.</p>';
        } else {
            cart.forEach(item => {
                const product = productMap.find(p => p.id === item.productId);
                if (!product) return;
                const itemTotal = product.price * item.quantity;
                total += itemTotal;
                const variantText = item.variant ? `${item.variant.size.toUpperCase()} / ${item.variant.color}` : '';
                const div = document.createElement('div');
                div.className = 'checkout-item';
                div.innerHTML = `<span>${product.name} (${variantText}) × ${item.quantity}</span><span>€${itemTotal.toFixed(2)}</span>`;
                container.appendChild(div);
            });
        }
        if (totalEl) {
            totalEl.textContent = `€${total.toFixed(2)}`;
        }
    }

    function completeCheckout(e) {
        e.preventDefault();
        const cart = store.getCart();
        if (!cart || cart.length === 0) {
            showToast('Dein Warenkorb ist leer.', 'error');
            return;
        }
        let total = 0;
        cart.forEach(item => {
            const product = productMap.find(p => p.id === item.productId);
            if (product) {
                total += product.price * item.quantity;
            }
        });
        const points = rewards.computePointsFromAmount(total);
        rewards.addPoints(points);
        store.clearCart();
        showToast(`Checkout abgeschlossen! Du hast ${points} Punkte verdient.`, 'success');
        setTimeout(() => {
            window.location.href = 'account.html';
        }, 1500);
    }

    window.checkoutPage = {
        init,
        complete: completeCheckout
    };
})(window);