/*
 * auth.js
 *
 * This module handles a simplified login flow for LUNARA using a
 * modal. In this skeleton there is no real authentication backend.
 * When the user submits the login form, a success toast is shown
 * and the modal closes. Replace the placeholder logic with a
 * Supabase Magic Link implementation when a backend is available.
 */

(function(window) {
    let loggedIn = false;

    function init() {
        const loginBtn = document.querySelector('.login-btn');
        const loginModalOverlay = document.querySelector('#login-modal');
        const closeBtn = document.querySelector('#login-modal .modal-close');
        const form = document.querySelector('#login-form');

        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                loginModalOverlay.classList.add('active');
            });
        }
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                loginModalOverlay.classList.remove('active');
            });
        }
        if (loginModalOverlay) {
            loginModalOverlay.addEventListener('click', (e) => {
                if (e.target === loginModalOverlay) {
                    loginModalOverlay.classList.remove('active');
                }
            });
        }
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const emailInput = form.querySelector('input[name="email"]');
                const email = emailInput.value.trim();
                if (email === '') {
                    showToast('Bitte gib eine gültige E-Mail ein.', 'error');
                    return;
                }
                // Placeholder success
                loggedIn = true;
                loginModalOverlay.classList.remove('active');
                showToast('Login erfolgreich (Demo).', 'success');
                updateAccountUI();
            });
        }
        updateAccountUI();
    }

    function updateAccountUI() {
        const accountLink = document.querySelector('.account-link');
        const loginBtn = document.querySelector('.login-btn');
        if (!accountLink || !loginBtn) return;
        if (loggedIn) {
            accountLink.style.display = 'block';
            loginBtn.style.display = 'none';
        } else {
            accountLink.style.display = 'none';
            loginBtn.style.display = 'block';
        }
    }

    window.auth = {
        init
    };
})(window);
