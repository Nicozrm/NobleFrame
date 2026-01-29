/*
 * wishlist.js
 *
 * Provides a simple wishlist functionality for the LUNARA shop. Users
 * can add product IDs to their wishlist. The list is persisted in
 * localStorage. This module exposes functions to get, add and remove
 * items from the wishlist.
 */

(function(window) {
    const WISHLIST_KEY = 'lunara_wishlist';

    function getWishlist() {
        try {
            const raw = localStorage.getItem(WISHLIST_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error('Error reading wishlist from localStorage', e);
            return [];
        }
    }

    function saveWishlist(list) {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    }

    function add(productId) {
        const list = getWishlist();
        if (!list.includes(productId)) {
            list.push(productId);
            saveWishlist(list);
        }
        return list;
    }

    function remove(productId) {
        let list = getWishlist();
        list = list.filter(id => id !== productId);
        saveWishlist(list);
        return list;
    }

    window.wishlist = {
        getWishlist,
        add,
        remove
    };
})(window);