/*
 * safe-exit.js
 *
 * Implements a simple “Safe Exit” mode for the LUNARA boutique. When the
 * user clicks the Safe‑Exit button in the navigation bar, a class
 * is toggled on the <body> element. This class activates CSS rules that
 * blur and dim any content marked with the `.sensitive` class. Use
 * this to quickly hide intimate content if you need to step away
 * from the screen. To mark elements as sensitive, add the `sensitive`
 * class in your HTML.
 */

(function(window) {
    function init() {
        const buttons = document.querySelectorAll('.safe-exit-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                document.body.classList.toggle('safe-mode');
            });
        });
    }

    window.safeExit = { init };
})(window);