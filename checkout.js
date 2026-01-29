/*
 * checkout.js
 *
 * Provides a simple checkout flow for the static LUNARA site. The
 * actual payment integration (Stripe/Snipcart) is not implemented in
 * this skeleton. Instead, the `proceedToCheckout` function navigates
 * the user to the checkout page if the cart contains items. A real
 * integration would collect the cart contents and send them to
 * Stripe or another provider.
 */

(function(window) {
    function proceedToCheckout() {
        const cart = store.getCart();
        if (!cart || cart.length === 0) {
            showToast('Dein Warenkorb ist leer.', 'error');
            return;
        }
        // TODO: Replace with real Stripe/Snipcart integration
        window.location.href = 'checkout.html';
    }

    window.checkout = {
        proceed: proceedToCheckout
    };
})(window);
