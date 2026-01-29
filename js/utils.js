/*
 * utils.js
 *
 * Contains helper functions used across multiple pages, such as
 * showToast for displaying brief toast notifications. A toast
 * container must exist in the DOM for the messages to appear.
 */

(function(window) {
    /**
     * Displays a toast notification. Requires an element with the
     * class 'toast-container' somewhere in the DOM. Toasts will
     * automatically fade out after a few seconds.
     * @param {string} message - The message to display.
     * @param {string} type - The style of the toast ('success', 'error').
     */
    function showToast(message, type = 'success') {
        const container = document.querySelector('.toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        // Fade out after a delay
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 600);
        }, 4000);
    }
    window.showToast = showToast;
})(window);