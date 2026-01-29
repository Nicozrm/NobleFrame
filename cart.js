/*
 * cart.js
 *
 * Handles the user interface of the shopping cart drawer. It pulls
 * product information from products.json via the global `appData`
 * loaded in app.js, displays items from the cart state (store.js),
 * updates quantities and handles removal. The cart UI also updates
 * the cart badge count in the navigation.
 */

(function(window) {
    const overlaySelector = '.cart-overlay';
    const drawerSelector = '.cart-drawer';
    const countSelector = '.cart-count';

    let products = [];

    function init(productData) {
        products = productData;
        const overlay = document.querySelector(overlaySelector);
        const drawer = document.querySelector(drawerSelector);
        if (!overlay || !drawer) return;

        // Close cart on overlay click
        overlay.addEventListener('click', closeCart);
        // Close button in header
        const closeBtn = drawer.querySelector('.close-cart');
        if (closeBtn) closeBtn.addEventListener('click', closeCart);

        // Delegate quantity and remove buttons
        drawer.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-item')) {
                const index = parseInt(e.target.dataset.index);
                store.removeFromCart(index);
                renderCart();
            }
            if (e.target.classList.contains('qty-minus')) {
                const index = parseInt(e.target.dataset.index);
                const cart = store.getCart();
                const newQty = cart[index].quantity - 1;
                store.updateQuantity(index, newQty);
                renderCart();
            }
            if (e.target.classList.contains('qty-plus')) {
                const index = parseInt(e.target.dataset.index);
                const cart = store.getCart();
                const newQty = cart[index].quantity + 1;
                store.updateQuantity(index, newQty);
                renderCart();
            }
        });

        renderCart();
    }

    function renderCart() {
        const cart = store.getCart();
        const drawer = document.querySelector(drawerSelector);
        const content = drawer.querySelector('.cart-content');
        const totalEl = drawer.querySelector('.cart-total-amount');
        const countEl = document.querySelector(countSelector);
        content.innerHTML = '';
        let total = 0;
        cart.forEach((item, index) => {
            const product = products.find(p => p.id === item.productId);
            if (!product) return;
            const itemTotal = product.price * item.quantity;
            total += itemTotal;
            const variantText = `${item.variant.size.toUpperCase()} / ${item.variant.color}`;
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <img src="${product.images[0]}" alt="${product.name}">
                <div class="cart-item-details">
                    <div class="cart-item-name">${product.name}</div>
                    <div class="cart-item-variant">${variantText}</div>
                    <div class="cart-item-price">€${itemTotal.toFixed(2)}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn qty-minus" data-index="${index}">−</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn qty-plus" data-index="${index}">+</button>
                    <button class="remove-item" data-index="${index}" title="Remove item">×</button>
                </div>
            `;
            content.appendChild(div);
        });
        totalEl.textContent = `€${total.toFixed(2)}`;
        if (countEl) countEl.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    function openCart() {
        document.querySelector(overlaySelector).classList.add('active');
        document.querySelector(drawerSelector).classList.add('active');
    }

    function closeCart() {
        document.querySelector(overlaySelector).classList.remove('active');
        document.querySelector(drawerSelector).classList.remove('active');
    }

    window.cartUI = {
        init,
        render: renderCart,
        open: openCart,
        close: closeCart
    };
})(window);
