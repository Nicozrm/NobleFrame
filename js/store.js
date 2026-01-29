/*
 * store.js
 *
 * Cart state management for the LUNARA boutique. The cart is stored
 * in localStorage to persist between page reloads. Each item in the
 * cart array is an object with productId, variant (object with size
 * and colour) and quantity. This module exposes functions to get,
 * modify and persist the cart, so other modules can use it.
 */

(function(window) {
    const CART_KEY = 'lunara_cart';

    function getCart() {
        try {
            const raw = localStorage.getItem(CART_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error('Error parsing cart from localStorage', e);
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    function addToCart(productId, variant) {
        const cart = getCart();
        // find if same product variant already exists
        const index = cart.findIndex(item => item.productId === productId && item.variant.size === variant.size && item.variant.color === variant.color);
        if (index > -1) {
            cart[index].quantity += 1;
        } else {
            cart.push({ productId, variant, quantity: 1 });
        }
        saveCart(cart);
        return cart;
    }

    function removeFromCart(index) {
        const cart = getCart();
        if (index >= 0 && index < cart.length) {
            cart.splice(index, 1);
            saveCart(cart);
        }
        return cart;
    }

    function updateQuantity(index, quantity) {
        const cart = getCart();
        if (index >= 0 && index < cart.length) {
            cart[index].quantity = Math.max(1, quantity);
            saveCart(cart);
        }
        return cart;
    }

    function clearCart() {
        localStorage.removeItem(CART_KEY);
    }

    window.store = {
        getCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
    };
})(window);
