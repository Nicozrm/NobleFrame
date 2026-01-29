/**
 * LUNARA Rewards & Loyalty System
 *
 * Vollständiges Punkte- und Belohnungssystem mit 4 Stufen,
 * exklusiven Benefits und Gamification-Elementen.
 */

const Rewards = (function() {
    'use strict';

    // Tier-Konfiguration
    const TIERS = {
        mondlicht: {
            name: 'Mondlicht',
            minPoints: 0,
            maxPoints: 199,
            icon: '🌙',
            color: '#c0c0c0',
            multiplier: 1,
            benefits: [
                'Willkommensrabatt 5%',
                'Exklusive Newsletter',
                'Geburtstags-Überraschung',
                'Early Access Benachrichtigungen'
            ],
            perks: {
                discountPercent: 5,
                freeShippingThreshold: 100,
                earlyAccess: false,
                exclusiveProducts: false,
                personalStylist: false,
                vipEvents: false
            }
        },
        sternenlicht: {
            name: 'Sternenlicht',
            minPoints: 200,
            maxPoints: 499,
            icon: '⭐',
            color: '#ffd700',
            multiplier: 1.25,
            benefits: [
                'Alle Mondlicht-Vorteile',
                '10% Rabatt auf alle Bestellungen',
                'Kostenloser Versand ab 75€',
                'Exklusive Sternenlicht-Produkte',
                'Priority Kundensupport'
            ],
            perks: {
                discountPercent: 10,
                freeShippingThreshold: 75,
                earlyAccess: true,
                exclusiveProducts: true,
                personalStylist: false,
                vipEvents: false
            }
        },
        galaxie: {
            name: 'Galaxie',
            minPoints: 500,
            maxPoints: 999,
            icon: '🌌',
            color: '#9b59b6',
            multiplier: 1.5,
            benefits: [
                'Alle Sternenlicht-Vorteile',
                '15% Rabatt auf alle Bestellungen',
                'Kostenloser Express-Versand',
                'Exklusive Galaxie-Kollektion',
                'Persönliche Styling-Beratung',
                'Preview neuer Kollektionen'
            ],
            perks: {
                discountPercent: 15,
                freeShippingThreshold: 0,
                earlyAccess: true,
                exclusiveProducts: true,
                personalStylist: true,
                vipEvents: false
            }
        },
        supernova: {
            name: 'Supernova',
            minPoints: 1000,
            maxPoints: Infinity,
            icon: '💫',
            color: '#ff6b35',
            multiplier: 2,
            benefits: [
                'Alle Galaxie-Vorteile',
                '20% VIP-Rabatt permanent',
                'Kostenloser Premium-Versand weltweit',
                'Zugang zum geheimen VIP-Cabinet',
                'Limitierte Supernova-Editionen',
                'Einladungen zu exklusiven Events',
                'Persönlicher VIP-Concierge',
                'Jährliches Luxus-Geschenkpaket'
            ],
            perks: {
                discountPercent: 20,
                freeShippingThreshold: 0,
                earlyAccess: true,
                exclusiveProducts: true,
                personalStylist: true,
                vipEvents: true
            }
        }
    };

    // Punkte-Aktionen
    const POINT_ACTIONS = {
        purchase: { points: 1, perEuro: true, description: '1 Punkt pro 1€ Einkauf' },
        signup: { points: 50, perEuro: false, description: 'Kontoerstellung' },
        newsletter: { points: 50, perEuro: false, description: 'Newsletter-Anmeldung' },
        review: { points: 25, perEuro: false, description: 'Produktbewertung schreiben' },
        referral: { points: 100, perEuro: false, description: 'Freund werben' },
        birthday: { points: 100, perEuro: false, description: 'Geburtstags-Bonus' },
        socialShare: { points: 10, perEuro: false, description: 'Social Media Teilen' },
        firstPurchase: { points: 50, perEuro: false, description: 'Erste Bestellung' }
    };

    // State
    let userData = {
        points: 0,
        totalEarned: 0,
        tier: 'mondlicht',
        history: [],
        achievements: [],
        joinDate: null
    };

    /**
     * Initialisiere Rewards System
     */
    function init() {
        loadUserData();
        updateUI();

        console.log('Rewards System initialisiert:', userData);
    }

    /**
     * Lade Benutzerdaten aus localStorage
     */
    function loadUserData() {
        const saved = localStorage.getItem('lunara_rewards');
        if (saved) {
            try {
                userData = JSON.parse(saved);
            } catch (e) {
                console.error('Fehler beim Laden der Rewards-Daten:', e);
            }
        } else {
            // Neuer Benutzer
            userData.joinDate = new Date().toISOString();
            addPoints(POINT_ACTIONS.signup.points, 'Willkommen bei LUNARA');
        }
    }

    /**
     * Speichere Benutzerdaten
     */
    function saveUserData() {
        localStorage.setItem('lunara_rewards', JSON.stringify(userData));
    }

    /**
     * Berechne aktuelles Tier
     */
    function calculateTier(points) {
        if (points >= TIERS.supernova.minPoints) return 'supernova';
        if (points >= TIERS.galaxie.minPoints) return 'galaxie';
        if (points >= TIERS.sternenlicht.minPoints) return 'sternenlicht';
        return 'mondlicht';
    }

    /**
     * Punkte hinzufügen
     */
    function addPoints(points, reason = '', metadata = {}) {
        const currentTier = userData.tier;
        const tierConfig = TIERS[currentTier];

        // Multiplier anwenden
        const multipliedPoints = Math.round(points * tierConfig.multiplier);

        userData.points += multipliedPoints;
        userData.totalEarned += multipliedPoints;

        // History-Eintrag
        userData.history.unshift({
            id: 'txn_' + Math.random().toString(36).substr(2, 9),
            type: 'earn',
            points: multipliedPoints,
            originalPoints: points,
            multiplier: tierConfig.multiplier,
            reason: reason,
            metadata: metadata,
            timestamp: new Date().toISOString()
        });

        // Max 100 Einträge in History behalten
        if (userData.history.length > 100) {
            userData.history = userData.history.slice(0, 100);
        }

        // Tier Update prüfen
        const newTier = calculateTier(userData.points);
        if (newTier !== currentTier) {
            handleTierChange(currentTier, newTier);
        }

        userData.tier = newTier;
        saveUserData();
        updateUI();

        // Event dispatchen
        window.dispatchEvent(new CustomEvent('lunara:rewards:pointsAdded', {
            detail: { points: multipliedPoints, reason, newTotal: userData.points }
        }));

        // Toast anzeigen
        if (typeof showToast !== 'undefined') {
            const message = tierConfig.multiplier > 1
                ? `+${multipliedPoints} Punkte (${tierConfig.multiplier}x Bonus!)`
                : `+${multipliedPoints} Punkte`;
            showToast(message, 'success');
        }

        return multipliedPoints;
    }

    /**
     * Punkte für Einkauf hinzufügen
     */
    function addPurchasePoints(orderTotal, orderId) {
        const points = Math.floor(orderTotal);
        addPoints(points, 'Einkauf', { orderId, orderTotal });

        // Erste Bestellung Bonus
        if (userData.history.filter(h => h.metadata?.orderId).length === 1) {
            addPoints(POINT_ACTIONS.firstPurchase.points, 'Erste Bestellung Bonus');
        }
    }

    /**
     * Punkte einlösen
     */
    function redeemPoints(points, rewardType, rewardDetails = {}) {
        if (points > userData.points) {
            if (typeof showToast !== 'undefined') {
                showToast('Nicht genügend Punkte!', 'error');
            }
            return false;
        }

        userData.points -= points;

        userData.history.unshift({
            id: 'txn_' + Math.random().toString(36).substr(2, 9),
            type: 'redeem',
            points: -points,
            reason: `Eingelöst: ${rewardType}`,
            rewardDetails: rewardDetails,
            timestamp: new Date().toISOString()
        });

        // Tier könnte sich ändern
        userData.tier = calculateTier(userData.points);
        saveUserData();
        updateUI();

        window.dispatchEvent(new CustomEvent('lunara:rewards:pointsRedeemed', {
            detail: { points, rewardType, newTotal: userData.points }
        }));

        return true;
    }

    /**
     * Handle Tier-Änderung
     */
    function handleTierChange(oldTier, newTier) {
        const oldConfig = TIERS[oldTier];
        const newConfig = TIERS[newTier];

        const isUpgrade = newConfig.minPoints > oldConfig.minPoints;

        // Achievement hinzufügen
        if (isUpgrade) {
            userData.achievements.push({
                id: 'tier_' + newTier,
                type: 'tier_upgrade',
                tier: newTier,
                timestamp: new Date().toISOString()
            });

            // Celebration UI
            showTierCelebration(newConfig);
        }

        window.dispatchEvent(new CustomEvent('lunara:rewards:tierChanged', {
            detail: { oldTier, newTier, isUpgrade }
        }));
    }

    /**
     * Zeige Tier-Aufstieg Celebration
     */
    function showTierCelebration(tierConfig) {
        const celebration = document.createElement('div');
        celebration.className = 'tier-celebration';
        celebration.innerHTML = `
            <div class="tier-celebration-content">
                <div class="tier-celebration-icon">${tierConfig.icon}</div>
                <h2>Glückwunsch!</h2>
                <p>Du hast <strong style="color: ${tierConfig.color}">${tierConfig.name}</strong> erreicht!</p>
                <p class="tier-celebration-benefits">Neue Vorteile freigeschaltet</p>
                <button class="btn" onclick="this.closest('.tier-celebration').remove()">Fantastisch!</button>
            </div>
        `;
        celebration.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.5s ease-out;
        `;

        document.body.appendChild(celebration);

        // Confetti Effekt
        createConfetti(tierConfig.color);

        // Auto-Close nach 10 Sekunden
        setTimeout(() => {
            if (celebration.parentNode) {
                celebration.remove();
            }
        }, 10000);
    }

    /**
     * Confetti Effekt
     */
    function createConfetti(color) {
        const colors = [color, '#d19fae', '#ffd700', '#9b59b6'];

        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    left: ${Math.random() * 100}%;
                    top: -10px;
                    border-radius: 50%;
                    z-index: 10001;
                    animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
                `;
                document.body.appendChild(confetti);

                setTimeout(() => confetti.remove(), 4000);
            }, i * 50);
        }
    }

    /**
     * Verfügbare Rewards
     */
    function getAvailableRewards() {
        const rewards = [
            {
                id: 'discount_5',
                name: '5€ Rabatt',
                points: 100,
                type: 'discount',
                value: 5
            },
            {
                id: 'discount_10',
                name: '10€ Rabatt',
                points: 180,
                type: 'discount',
                value: 10
            },
            {
                id: 'discount_25',
                name: '25€ Rabatt',
                points: 400,
                type: 'discount',
                value: 25
            },
            {
                id: 'free_shipping',
                name: 'Kostenloser Versand',
                points: 150,
                type: 'shipping',
                value: 'free'
            },
            {
                id: 'mystery_gift',
                name: 'Mystery Geschenk',
                points: 300,
                type: 'gift',
                value: 'mystery'
            },
            {
                id: 'early_access',
                name: 'Early Access (30 Tage)',
                points: 250,
                type: 'access',
                value: 30
            }
        ];

        return rewards.map(reward => ({
            ...reward,
            available: userData.points >= reward.points
        }));
    }

    /**
     * Aktuellen Tier-Status holen
     */
    function getCurrentStatus() {
        const tier = TIERS[userData.tier];
        const nextTier = getNextTier();

        let progressPercent = 100;
        let pointsToNext = 0;

        if (nextTier) {
            const tierRange = nextTier.minPoints - tier.minPoints;
            const userProgress = userData.points - tier.minPoints;
            progressPercent = Math.min(100, (userProgress / tierRange) * 100);
            pointsToNext = nextTier.minPoints - userData.points;
        }

        return {
            tier: userData.tier,
            tierConfig: tier,
            points: userData.points,
            totalEarned: userData.totalEarned,
            nextTier: nextTier,
            progressPercent: Math.round(progressPercent),
            pointsToNext: pointsToNext,
            currentDiscount: tier.perks.discountPercent,
            history: userData.history.slice(0, 10),
            achievements: userData.achievements,
            memberSince: userData.joinDate
        };
    }

    /**
     * Nächstes Tier holen
     */
    function getNextTier() {
        const tierOrder = ['mondlicht', 'sternenlicht', 'galaxie', 'supernova'];
        const currentIndex = tierOrder.indexOf(userData.tier);

        if (currentIndex < tierOrder.length - 1) {
            const nextTierName = tierOrder[currentIndex + 1];
            return { name: nextTierName, ...TIERS[nextTierName] };
        }

        return null;
    }

    /**
     * UI aktualisieren
     */
    function updateUI() {
        const status = getCurrentStatus();

        // Punkte-Anzeigen aktualisieren
        document.querySelectorAll('[data-rewards-points]').forEach(el => {
            el.textContent = status.points.toLocaleString('de-DE');
        });

        // Tier-Anzeigen aktualisieren
        document.querySelectorAll('[data-rewards-tier]').forEach(el => {
            el.textContent = status.tierConfig.name;
            el.style.color = status.tierConfig.color;
        });

        // Tier-Icon aktualisieren
        document.querySelectorAll('[data-rewards-tier-icon]').forEach(el => {
            el.textContent = status.tierConfig.icon;
        });

        // Progress-Bars aktualisieren
        document.querySelectorAll('[data-rewards-progress]').forEach(el => {
            el.style.width = `${status.progressPercent}%`;
        });

        // Points to next Tier
        document.querySelectorAll('[data-rewards-points-to-next]').forEach(el => {
            if (status.nextTier) {
                el.textContent = `Noch ${status.pointsToNext} Punkte bis ${status.nextTier.name}`;
            } else {
                el.textContent = 'Höchste Stufe erreicht!';
            }
        });
    }

    /**
     * Rabatt-Code generieren
     */
    function generateDiscountCode(type, value) {
        const code = 'LUNARA' + type.toUpperCase() + value + '_' +
            Math.random().toString(36).substr(2, 6).toUpperCase();

        // Code speichern
        const codes = JSON.parse(localStorage.getItem('lunara_discount_codes') || '[]');
        codes.push({
            code,
            type,
            value,
            used: false,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 Tage
        });
        localStorage.setItem('lunara_discount_codes', JSON.stringify(codes));

        return code;
    }

    // CSS für Confetti und Celebration
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confettiFall {
            to {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .tier-celebration-content {
            text-align: center;
            padding: 3rem;
            background: var(--color-surface, #0f0f18);
            border-radius: 20px;
            max-width: 400px;
            animation: bounceIn 0.6s ease-out;
        }

        .tier-celebration-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            animation: float 2s ease-in-out infinite;
        }

        @keyframes bounceIn {
            0% { transform: scale(0); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }

        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        .tier-celebration-benefits {
            color: var(--color-accent, #d19fae);
            margin: 1rem 0 2rem;
        }
    `;
    document.head.appendChild(style);

    // Auto-Init
    document.addEventListener('DOMContentLoaded', init);

    // Public API
    return {
        init,
        addPoints,
        addPurchasePoints,
        redeemPoints,
        getCurrentStatus,
        getAvailableRewards,
        generateDiscountCode,
        TIERS,
        POINT_ACTIONS,
        get points() { return userData.points; },
        get tier() { return userData.tier; }
    };
})();

// Export für Module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Rewards;
}
