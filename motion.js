/*
 * motion.js
 *
 * Provides simple scroll reveal and navbar transition effects. A more
 * sophisticated motion system can be implemented later (GSAP).
 */

(function(window) {
    function init() {
        // Reveal elements on scroll
        const revealElements = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(el => observer.observe(el));

        // Navbar background change on scroll
        const nav = document.querySelector('nav');
        if (nav) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            });
        }
    }

    window.motion = {
        init
    };
})(window);
