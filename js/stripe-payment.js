/**
 * LUNARA Stripe Payment Integration
 *
 * Vollständige Stripe-Integration für echte Zahlungsabwicklung.
 * Unterstützt Kreditkarten, SEPA, Klarna, PayPal und mehr.
 */

const StripePayment = (function() {
    'use strict';

    // Stripe Public Key - ERSETZEN MIT EIGENEM KEY
    const STRIPE_PUBLIC_KEY = 'pk_test_DEIN_STRIPE_PUBLIC_KEY';

    let stripe = null;
    let elements = null;
    let cardElement = null;
    let paymentIntentClientSecret = null;

    // Konfiguration
    const config = {
        currency: 'eur',
        country: 'DE',
        appearance: {
            theme: 'night',
            variables: {
                colorPrimary: '#d19fae',
                colorBackground: '#15151f',
                colorText: '#e4e4e7',
                colorDanger: '#e57a7a',
                fontFamily: 'Montserrat, sans-serif',
                spacingUnit: '4px',
                borderRadius: '12px'
            },
            rules: {
                '.Input': {
                    backgroundColor: '#0f0f18',
                    border: '2px solid #15151f'
                },
                '.Input:focus': {
                    borderColor: '#d19fae',
                    boxShadow: '0 0 0 4px rgba(209, 159, 174, 0.4)'
                },
                '.Label': {
                    color: '#c4c4c8'
                }
            }
        }
    };

    /**
     * Initialisiere Stripe
     */
    function init() {
        if (typeof Stripe === 'undefined') {
            console.warn('Stripe.js nicht geladen. Lade es nach...');
            loadStripeScript();
            return;
        }

        stripe = Stripe(STRIPE_PUBLIC_KEY);
        console.log('Stripe initialisiert');
    }

    /**
     * Lade Stripe.js dynamisch
     */
    function loadStripeScript() {
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.async = true;
        script.onload = () => {
            stripe = Stripe(STRIPE_PUBLIC_KEY);
            console.log('Stripe.js geladen und initialisiert');
        };
        document.head.appendChild(script);
    }

    /**
     * Erstelle Payment Elements
     */
    function createPaymentElement(containerId) {
        if (!stripe) {
            console.error('Stripe nicht initialisiert');
            return null;
        }

        elements = stripe.elements({
            appearance: config.appearance,
            locale: 'de'
        });

        // Payment Element (unterstützt alle Zahlungsmethoden)
        const paymentElement = elements.create('payment', {
            layout: {
                type: 'tabs',
                defaultCollapsed: false
            },
            paymentMethodOrder: ['card', 'sepa_debit', 'klarna', 'paypal'],
            fields: {
                billingDetails: {
                    address: {
                        country: 'auto'
                    }
                }
            }
        });

        const container = document.getElementById(containerId);
        if (container) {
            paymentElement.mount(`#${containerId}`);
        }

        return paymentElement;
    }

    /**
     * Erstelle Card Element (Fallback)
     */
    function createCardElement(containerId) {
        if (!stripe) {
            console.error('Stripe nicht initialisiert');
            return null;
        }

        elements = stripe.elements({
            appearance: config.appearance,
            locale: 'de'
        });

        cardElement = elements.create('card', {
            style: {
                base: {
                    fontSize: '16px',
                    color: '#e4e4e7',
                    '::placeholder': {
                        color: '#8a8a99'
                    }
                },
                invalid: {
                    color: '#e57a7a'
                }
            },
            hidePostalCode: false
        });

        const container = document.getElementById(containerId);
        if (container) {
            cardElement.mount(`#${containerId}`);
        }

        // Event Listener für Fehler
        cardElement.on('change', (event) => {
            const errorElement = document.getElementById('card-errors');
            if (errorElement) {
                if (event.error) {
                    errorElement.textContent = event.error.message;
                    errorElement.style.display = 'block';
                } else {
                    errorElement.textContent = '';
                    errorElement.style.display = 'none';
                }
            }
        });

        return cardElement;
    }

    /**
     * Erstelle Payment Intent auf dem Server
     */
    async function createPaymentIntent(amount, metadata = {}) {
        try {
            const response = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: Math.round(amount * 100), // In Cents
                    currency: config.currency,
                    metadata: {
                        ...metadata,
                        store: 'LUNARA'
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Fehler beim Erstellen des Payment Intent');
            }

            const data = await response.json();
            paymentIntentClientSecret = data.clientSecret;
            return data;
        } catch (error) {
            console.error('Payment Intent Error:', error);
            throw error;
        }
    }

    /**
     * Verarbeite Zahlung
     */
    async function processPayment(billingDetails) {
        if (!stripe || !elements) {
            throw new Error('Stripe nicht initialisiert');
        }

        if (!paymentIntentClientSecret) {
            throw new Error('Kein Payment Intent vorhanden');
        }

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                clientSecret: paymentIntentClientSecret,
                confirmParams: {
                    return_url: `${window.location.origin}/checkout/success`,
                    payment_method_data: {
                        billing_details: billingDetails
                    }
                },
                redirect: 'if_required'
            });

            if (error) {
                throw new Error(error.message);
            }

            return paymentIntent;
        } catch (error) {
            console.error('Payment Error:', error);
            throw error;
        }
    }

    /**
     * Verarbeite Kartenzahlung (Fallback)
     */
    async function processCardPayment(billingDetails) {
        if (!stripe || !cardElement) {
            throw new Error('Stripe nicht initialisiert');
        }

        if (!paymentIntentClientSecret) {
            throw new Error('Kein Payment Intent vorhanden');
        }

        try {
            const { error, paymentIntent } = await stripe.confirmCardPayment(
                paymentIntentClientSecret,
                {
                    payment_method: {
                        card: cardElement,
                        billing_details: billingDetails
                    }
                }
            );

            if (error) {
                throw new Error(error.message);
            }

            return paymentIntent;
        } catch (error) {
            console.error('Card Payment Error:', error);
            throw error;
        }
    }

    /**
     * Formatiere Preis für Anzeige
     */
    function formatPrice(amount, currency = 'EUR') {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    /**
     * Validiere Adresse
     */
    function validateAddress(address) {
        const required = ['line1', 'city', 'postal_code', 'country'];
        const missing = required.filter(field => !address[field]);

        if (missing.length > 0) {
            return {
                valid: false,
                missing: missing
            };
        }

        return { valid: true };
    }

    /**
     * Demo-Modus für Testzwecke (ohne echten Server)
     */
    async function processDemoPayment(amount, billingDetails) {
        return new Promise((resolve, reject) => {
            // Simuliere Verarbeitungszeit
            setTimeout(() => {
                // Demo: Erfolgreiche Zahlung simulieren
                const demoPaymentIntent = {
                    id: 'pi_demo_' + Math.random().toString(36).substr(2, 9),
                    status: 'succeeded',
                    amount: Math.round(amount * 100),
                    currency: config.currency,
                    created: Date.now(),
                    payment_method: 'pm_demo_card',
                    receipt_email: billingDetails.email
                };

                console.log('Demo-Zahlung erfolgreich:', demoPaymentIntent);
                resolve(demoPaymentIntent);
            }, 2000);
        });
    }

    /**
     * Checkout Session erstellen (für Stripe Checkout)
     */
    async function createCheckoutSession(items, successUrl, cancelUrl) {
        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    items: items.map(item => ({
                        price_data: {
                            currency: config.currency,
                            product_data: {
                                name: item.name,
                                images: item.images || []
                            },
                            unit_amount: Math.round(item.price * 100)
                        },
                        quantity: item.quantity
                    })),
                    success_url: successUrl,
                    cancel_url: cancelUrl,
                    mode: 'payment',
                    locale: 'de'
                })
            });

            const session = await response.json();

            // Redirect zu Stripe Checkout
            const { error } = await stripe.redirectToCheckout({
                sessionId: session.id
            });

            if (error) {
                throw new Error(error.message);
            }
        } catch (error) {
            console.error('Checkout Session Error:', error);
            throw error;
        }
    }

    // Public API
    return {
        init,
        createPaymentElement,
        createCardElement,
        createPaymentIntent,
        processPayment,
        processCardPayment,
        processDemoPayment,
        createCheckoutSession,
        formatPrice,
        validateAddress,
        get isReady() {
            return stripe !== null;
        }
    };
})();

// Auto-Init wenn DOM ready
document.addEventListener('DOMContentLoaded', () => {
    StripePayment.init();
});

// Export für Module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StripePayment;
}
