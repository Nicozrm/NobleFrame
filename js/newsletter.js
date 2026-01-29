/**
 * LUNARA Newsletter System
 *
 * Vollständige Newsletter-Integration mit Mailchimp/Brevo (Sendinblue) API.
 * Unterstützt Double-Opt-In, Segmentierung und automatische Willkommens-Emails.
 */

const Newsletter = (function() {
    'use strict';

    // Konfiguration - ERSETZEN MIT EIGENEN WERTEN
    const config = {
        // Mailchimp Konfiguration
        mailchimp: {
            apiEndpoint: '/api/newsletter/subscribe',
            listId: 'YOUR_LIST_ID'
        },
        // Brevo (Sendinblue) Konfiguration
        brevo: {
            apiEndpoint: 'https://api.brevo.com/v3/contacts',
            apiKey: 'YOUR_BREVO_API_KEY',
            listId: 1
        },
        // Allgemeine Einstellungen
        provider: 'demo', // 'mailchimp', 'brevo', oder 'demo'
        doubleOptIn: true,
        welcomeEmail: true,
        tags: ['lunara', 'newsletter'],
        segments: {
            newSubscriber: 'new-subscriber',
            vip: 'vip-customer',
            rewards: 'rewards-member'
        }
    };

    // State
    let isSubmitting = false;

    /**
     * Validiere E-Mail-Adresse
     */
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Sanitize Input
     */
    function sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        return input.trim().replace(/[<>]/g, '');
    }

    /**
     * Subscribe via Mailchimp
     */
    async function subscribeMailchimp(email, userData = {}) {
        const response = await fetch(config.mailchimp.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email_address: email,
                status: config.doubleOptIn ? 'pending' : 'subscribed',
                merge_fields: {
                    FNAME: userData.firstName || '',
                    LNAME: userData.lastName || ''
                },
                tags: config.tags,
                marketing_permissions: [{
                    marketing_permission_id: 'email',
                    enabled: true
                }]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Anmeldung fehlgeschlagen');
        }

        return await response.json();
    }

    /**
     * Subscribe via Brevo (Sendinblue)
     */
    async function subscribeBrevo(email, userData = {}) {
        const response = await fetch(config.brevo.apiEndpoint, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'api-key': config.brevo.apiKey
            },
            body: JSON.stringify({
                email: email,
                listIds: [config.brevo.listId],
                updateEnabled: true,
                attributes: {
                    FIRSTNAME: userData.firstName || '',
                    LASTNAME: userData.lastName || '',
                    SOURCE: 'website',
                    SIGNUP_DATE: new Date().toISOString()
                }
            })
        });

        if (!response.ok && response.status !== 201) {
            const error = await response.json();
            throw new Error(error.message || 'Anmeldung fehlgeschlagen');
        }

        // Sende Willkommens-Email wenn aktiviert
        if (config.welcomeEmail) {
            await sendWelcomeEmail(email, userData);
        }

        return { success: true, email };
    }

    /**
     * Demo Subscribe (ohne echte API)
     */
    async function subscribeDemo(email, userData = {}) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Speichere in localStorage für Demo
                const subscribers = JSON.parse(localStorage.getItem('lunara_subscribers') || '[]');

                if (subscribers.some(s => s.email === email)) {
                    reject(new Error('Diese E-Mail ist bereits angemeldet'));
                    return;
                }

                const subscriber = {
                    id: 'sub_' + Math.random().toString(36).substr(2, 9),
                    email: email,
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    subscribedAt: new Date().toISOString(),
                    status: config.doubleOptIn ? 'pending' : 'subscribed',
                    tags: config.tags,
                    rewardsPoints: 50 // Bonus für Newsletter-Anmeldung
                };

                subscribers.push(subscriber);
                localStorage.setItem('lunara_subscribers', JSON.stringify(subscribers));

                // Bonus Rewards-Punkte vergeben
                if (typeof Rewards !== 'undefined') {
                    Rewards.addPoints(50, 'Newsletter-Anmeldung');
                }

                console.log('Demo Newsletter Anmeldung:', subscriber);
                resolve(subscriber);
            }, 1500);
        });
    }

    /**
     * Sende Willkommens-Email
     */
    async function sendWelcomeEmail(email, userData = {}) {
        if (config.provider === 'brevo') {
            const response = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'api-key': config.brevo.apiKey
                },
                body: JSON.stringify({
                    sender: {
                        name: 'LUNARA',
                        email: 'newsletter@lunara.de'
                    },
                    to: [{ email: email, name: userData.firstName || '' }],
                    templateId: 1, // Willkommens-Template ID
                    params: {
                        FIRSTNAME: userData.firstName || 'Liebe/r Kunde/in',
                        DISCOUNT_CODE: 'WELCOME10'
                    }
                })
            });

            return response.ok;
        }

        return true;
    }

    /**
     * Hauptfunktion: Subscribe
     */
    async function subscribe(email, userData = {}, formElement = null) {
        if (isSubmitting) {
            return { success: false, message: 'Bitte warten...' };
        }

        // Validierung
        email = sanitizeInput(email);

        if (!email) {
            return { success: false, message: 'Bitte gib eine E-Mail-Adresse ein.' };
        }

        if (!validateEmail(email)) {
            return { success: false, message: 'Bitte gib eine gültige E-Mail-Adresse ein.' };
        }

        isSubmitting = true;

        // Button-Status ändern
        if (formElement) {
            const submitBtn = formElement.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner"></span> Wird gesendet...';
            }
        }

        try {
            let result;

            switch (config.provider) {
                case 'mailchimp':
                    result = await subscribeMailchimp(email, userData);
                    break;
                case 'brevo':
                    result = await subscribeBrevo(email, userData);
                    break;
                default:
                    result = await subscribeDemo(email, userData);
            }

            // Erfolgs-Tracking
            trackSubscription(email);

            // Erfolgs-Nachricht
            const message = config.doubleOptIn
                ? 'Fast geschafft! Bitte bestätige deine Anmeldung in der E-Mail, die wir dir gesendet haben.'
                : 'Willkommen im LUNARA Kosmos! Du erhältst in Kürze deine erste E-Mail.';

            return {
                success: true,
                message,
                data: result
            };

        } catch (error) {
            console.error('Newsletter Error:', error);
            return {
                success: false,
                message: error.message || 'Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.'
            };
        } finally {
            isSubmitting = false;

            // Button zurücksetzen
            if (formElement) {
                const submitBtn = formElement.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Anmelden';
                }
            }
        }
    }

    /**
     * Track Subscription für Analytics
     */
    function trackSubscription(email) {
        // Google Analytics Event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'newsletter_signup', {
                event_category: 'engagement',
                event_label: 'Newsletter Anmeldung'
            });
        }

        // Facebook Pixel Event
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                content_name: 'Newsletter',
                content_category: 'Subscription'
            });
        }

        // Custom Event für andere Tracking-Tools
        window.dispatchEvent(new CustomEvent('lunara:newsletter:subscribed', {
            detail: { email }
        }));
    }

    /**
     * Unsubscribe
     */
    async function unsubscribe(email) {
        if (config.provider === 'demo') {
            const subscribers = JSON.parse(localStorage.getItem('lunara_subscribers') || '[]');
            const filtered = subscribers.filter(s => s.email !== email);
            localStorage.setItem('lunara_subscribers', JSON.stringify(filtered));
            return { success: true };
        }

        // Für echte Provider: API-Call zum Abmelden
        const response = await fetch('/api/newsletter/unsubscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        return await response.json();
    }

    /**
     * Prüfe ob E-Mail bereits angemeldet
     */
    function isSubscribed(email) {
        if (config.provider === 'demo') {
            const subscribers = JSON.parse(localStorage.getItem('lunara_subscribers') || '[]');
            return subscribers.some(s => s.email === email);
        }
        return false;
    }

    /**
     * Initialisiere Newsletter-Formulare
     */
    function initForms() {
        const forms = document.querySelectorAll('[data-newsletter-form], #newsletter-form');

        forms.forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const emailInput = form.querySelector('input[type="email"], input[name="email"], input[name="newsletter-email"]');
                const firstNameInput = form.querySelector('input[name="firstName"], input[name="first-name"]');
                const lastNameInput = form.querySelector('input[name="lastName"], input[name="last-name"]');

                const email = emailInput?.value || '';
                const userData = {
                    firstName: firstNameInput?.value || '',
                    lastName: lastNameInput?.value || ''
                };

                const result = await subscribe(email, userData, form);

                // Zeige Ergebnis
                if (typeof showToast !== 'undefined') {
                    showToast(result.message, result.success ? 'success' : 'error');
                }

                // Formular zurücksetzen bei Erfolg
                if (result.success) {
                    form.reset();

                    // Erfolgs-Animation
                    const successIcon = document.createElement('div');
                    successIcon.className = 'newsletter-success-icon';
                    successIcon.innerHTML = '✓';
                    form.appendChild(successIcon);

                    setTimeout(() => {
                        successIcon.remove();
                    }, 3000);
                }
            });
        });
    }

    /**
     * Popup Newsletter Modal
     */
    function showPopup(delay = 5000, showOnce = true) {
        if (showOnce && localStorage.getItem('lunara_newsletter_popup_shown')) {
            return;
        }

        setTimeout(() => {
            // Prüfe ob Benutzer bereits subscribed ist
            const existingEmail = localStorage.getItem('lunara_user_email');
            if (existingEmail && isSubscribed(existingEmail)) {
                return;
            }

            // Erstelle Modal
            const modal = document.createElement('div');
            modal.className = 'newsletter-popup modal-overlay active';
            modal.innerHTML = `
                <div class="modal newsletter-popup-content">
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                    <div class="newsletter-popup-icon">✨</div>
                    <h2>Werde Teil des LUNARA Kosmos</h2>
                    <p>Erhalte exklusive Angebote, Early Access zu neuen Kollektionen und <strong>10% Rabatt</strong> auf deine erste Bestellung!</p>
                    <form class="newsletter-popup-form" data-newsletter-form>
                        <input type="email" name="email" placeholder="Deine E-Mail-Adresse" required>
                        <button type="submit" class="btn">Jetzt anmelden</button>
                    </form>
                    <p class="newsletter-popup-note">Kein Spam. Jederzeit abbestellbar.</p>
                </div>
            `;

            document.body.appendChild(modal);

            // Schließen bei Klick auf Overlay
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });

            // Form Handler
            initForms();

            // Markiere als gezeigt
            if (showOnce) {
                localStorage.setItem('lunara_newsletter_popup_shown', 'true');
            }
        }, delay);
    }

    // Auto-Init
    document.addEventListener('DOMContentLoaded', () => {
        initForms();
    });

    // Public API
    return {
        subscribe,
        unsubscribe,
        isSubscribed,
        initForms,
        showPopup,
        validateEmail,
        config
    };
})();

// Export für Module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Newsletter;
}
