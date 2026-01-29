/*
 * rewards.js
 *
 * Handles the loyalty points system for LUNARA. Points are stored in
 * localStorage under a dedicated key. This module exposes functions
 * to retrieve and add points, determine the current tier and compute
 * progress towards the next tier. Points are awarded based on the
 * total amount spent in the cart (1 Punkt pro 10€). Use after
 * completing a checkout.
 */

(function(window) {
    const POINTS_KEY = 'lunara_points';

    function getPoints() {
        const raw = localStorage.getItem(POINTS_KEY);
        return raw ? parseInt(raw, 10) : 0;
    }

    function addPoints(points) {
        const current = getPoints();
        const newPoints = current + (points || 0);
        localStorage.setItem(POINTS_KEY, newPoints.toString());
        return newPoints;
    }

    function clearPoints() {
        localStorage.removeItem(POINTS_KEY);
    }

    // Define loyalty tiers with thresholds
    const tiers = [
        { name: 'Mondlicht', min: 0, max: 19 },
        { name: 'Sternenlicht', min: 20, max: 49 },
        { name: 'Galaxie', min: 50, max: 99 },
        { name: 'Supernova', min: 100, max: Infinity }
    ];

    function getTier(points) {
        points = points !== undefined ? points : getPoints();
        return tiers.find(t => points >= t.min && points <= t.max) || tiers[0];
    }

    function getNextTierInfo(points) {
        points = points !== undefined ? points : getPoints();
        const currentTier = getTier(points);
        const index = tiers.indexOf(currentTier);
        if (index === tiers.length - 1) {
            // Already at highest tier
            return { tier: currentTier.name, remaining: 0, nextThreshold: currentTier.max };
        }
        const nextTier = tiers[index + 1];
        return {
            tier: currentTier.name,
            remaining: Math.max(0, nextTier.min - points),
            nextThreshold: nextTier.min
        };
    }

    function computePointsFromAmount(amount) {
        // 1 Punkt pro 10€ ausgegeben
        return Math.floor((amount || 0) / 10);
    }

    window.rewards = {
        getPoints,
        addPoints,
        clearPoints,
        getTier,
        getNextTierInfo,
        computePointsFromAmount
    };
})(window);