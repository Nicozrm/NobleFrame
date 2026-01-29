/* =====================================================
   LUNARA - COOKIE CONSENT BANNER (DSGVO/TTDSG)
   Angepasst für diskrete Intimitäts-Plattform
   ===================================================== */

(function() {
    'use strict';
    
    const CONSENT_KEY = 'lunara_cookie_consent';
    const CONSENT_VERSION = '1.0';
    
    // Check if consent already given
    function getConsent() {
        try {
            const consent = localStorage.getItem(CONSENT_KEY);
            if (consent) {
                const parsed = JSON.parse(consent);
                if (parsed.version === CONSENT_VERSION) {
                    return parsed;
                }
            }
        } catch (e) {}
        return null;
    }
    
    // Save consent
    function saveConsent(preferences) {
        const consent = {
            version: CONSENT_VERSION,
            timestamp: new Date().toISOString(),
            preferences: preferences
        };
        localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    }
    
    // Create and inject styles
    function injectStyles() {
        const styles = `
            .cookie-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(250, 249, 247, 0.98);
                border-top: 1px solid rgba(212, 181, 173, 0.3);
                padding: 30px;
                z-index: 99999;
                font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
                box-shadow: 0 -10px 40px rgba(212, 181, 173, 0.2);
                transform: translateY(100%);
                transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }
            .cookie-banner.visible {
                transform: translateY(0);
            }
            .cookie-banner-inner {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                align-items: flex-start;
                gap: 35px;
                flex-wrap: wrap;
            }
            .cookie-banner-content {
                flex: 1;
                min-width: 300px;
            }
            .cookie-banner h3 {
                font-family: 'Cormorant Garamond', serif;
                font-size: 22px;
                font-weight: 400;
                color: #2A2A2A;
                margin-bottom: 12px;
            }
            .cookie-banner p {
                font-size: 14px;
                line-height: 1.7;
                color: #8A8A8A;
                margin-bottom: 18px;
            }
            .cookie-banner a {
                color: #D4B5AD;
                text-decoration: none;
                border-bottom: 1px solid rgba(212, 181, 173, 0.3);
                transition: border-color 0.3s ease;
            }
            .cookie-banner a:hover {
                border-color: #D4B5AD;
            }
            .cookie-options {
                display: flex;
                flex-wrap: wrap;
                gap: 22px;
                margin-bottom: 8px;
            }
            .cookie-option {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .cookie-option input[type="checkbox"] {
                width: 20px;
                height: 20px;
                accent-color: #D4B5AD;
                cursor: pointer;
                border: 1px solid rgba(212, 181, 173, 0.4);
            }
            .cookie-option label {
                font-size: 14px;
                color: #2A2A2A;
                cursor: pointer;
                user-select: none;
            }
            .cookie-option label span {
                color: #8A8A8A;
                font-size: 12px;
            }
            .cookie-banner-buttons {
                display: flex;
                gap: 15px;
                align-items: center;
                flex-wrap: wrap;
            }
            .cookie-btn {
                padding: 14px 32px;
                font-family: 'Montserrat', sans-serif;
                font-size: 13px;
                font-weight: 500;
                letter-spacing: 0.5px;
                text-transform: uppercase;
                border: none;
                cursor: pointer;
                transition: all 0.3s ease;
                border-radius: 0;
            }
            .cookie-btn-accept {
                background: #D4B5AD;
                color: white;
                border: 1px solid #D4B5AD;
            }
            .cookie-btn-accept:hover {
                background: #E8D5D0;
                border-color: #E8D5D0;
            }
            .cookie-btn-save {
                background: transparent;
                color: #D4B5AD;
                border: 1px solid #D4B5AD;
            }
            .cookie-btn-save:hover {
                background: #D4B5AD;
                color: white;
            }
            .cookie-btn-reject {
                background: transparent;
                color: #8A8A8A;
                border: 1px solid rgba(138, 138, 138, 0.3);
            }
            .cookie-btn-reject:hover {
                border-color: #8A8A8A;
                color: #2A2A2A;
            }
            @media (max-width: 768px) {
                .cookie-banner {
                    padding: 25px 20px;
                }
                .cookie-banner-inner {
                    flex-direction: column;
                    gap: 25px;
                }
                .cookie-banner-buttons {
                    width: 100%;
                    flex-direction: column;
                }
                .cookie-btn {
                    width: 100%;
                    text-align: center;
                    padding: 14px 25px;
                }
            }
        `;
        
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }
    
    // Create banner HTML
    function createBanner() {
        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.id = 'cookieBanner';
        banner.innerHTML = `
            <div class="cookie-banner-inner">
                <div class="cookie-banner-content">
                    <h3>Cookie-Einstellungen</h3>
                    <p>Wir respektieren Ihre Privatsphäre. Diese Website verwendet nur technisch notwendige Cookies für einen reibungslosen Betrieb. 
                       Weitere Informationen finden Sie in unserer 
                       <a href="datenschutz.html">Datenschutzerklärung</a>.</p>
                    <div class="cookie-options">
                        <div class="cookie-option">
                            <input type="checkbox" id="cookieEssential" checked disabled>
                            <label for="cookieEssential">Essenziell <span>(erforderlich)</span></label>
                        </div>
                        <div class="cookie-option">
                            <input type="checkbox" id="cookieAnalytics">
                            <label for="cookieAnalytics">Analyse <span>(optional)</span></label>
                        </div>
                        <div class="cookie-option">
                            <input type="checkbox" id="cookieMarketing">
                            <label for="cookieMarketing">Marketing <span>(optional)</span></label>
                        </div>
                    </div>
                </div>
                <div class="cookie-banner-buttons">
                    <button class="cookie-btn cookie-btn-accept" id="cookieAcceptAll">Alle akzeptieren</button>
                    <button class="cookie-btn cookie-btn-save" id="cookieSave">Auswahl speichern</button>
                    <button class="cookie-btn cookie-btn-reject" id="cookieReject">Nur Essenziell</button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);
        
        // Show banner with animation
        setTimeout(() => banner.classList.add('visible'), 100);
        
        // Event listeners
        document.getElementById('cookieAcceptAll').addEventListener('click', function() {
            saveConsent({ essential: true, analytics: true, marketing: true });
            hideBanner();
            loadOptionalScripts(true, true);
        });
        
        document.getElementById('cookieSave').addEventListener('click', function() {
            const analytics = document.getElementById('cookieAnalytics').checked;
            const marketing = document.getElementById('cookieMarketing').checked;
            saveConsent({ essential: true, analytics: analytics, marketing: marketing });
            hideBanner();
            loadOptionalScripts(analytics, marketing);
        });
        
        document.getElementById('cookieReject').addEventListener('click', function() {
            saveConsent({ essential: true, analytics: false, marketing: false });
            hideBanner();
        });
    }
    
    // Hide banner
    function hideBanner() {
        const banner = document.getElementById('cookieBanner');
        if (banner) {
            banner.classList.remove('visible');
            setTimeout(() => banner.remove(), 400);
        }
    }
    
    // Load optional scripts based on consent
    function loadOptionalScripts(analytics, marketing) {
        // Placeholder for future analytics/marketing scripts
        if (analytics) {
            console.log('Analytics consent granted - LUNARA respects your privacy');
        }
        
        if (marketing) {
            console.log('Marketing consent granted - LUNARA respects your privacy');
        }
    }
    
    // Initialize
    function init() {
        const existingConsent = getConsent();
        
        if (existingConsent) {
            // User already consented, load appropriate scripts
            loadOptionalScripts(
                existingConsent.preferences.analytics,
                existingConsent.preferences.marketing
            );
        } else {
            // Show cookie banner
            injectStyles();
            
            // Wait for DOM ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', createBanner);
            } else {
                createBanner();
            }
        }
    }
    
    // Expose functions globally for manual trigger
    window.LunaraCookies = {
        showBanner: function() {
            localStorage.removeItem(CONSENT_KEY);
            injectStyles();
            createBanner();
        },
        getConsent: getConsent
    };
    
    // Run
    init();
})();