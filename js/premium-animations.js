/**
 * LUNARA Premium Animations
 *
 * Hochwertige Animationen, Micro-Interactions und visuelle Effekte
 * für ein einzigartiges Benutzererlebnis.
 */

const PremiumAnimations = (function() {
    'use strict';

    // Konfiguration
    const config = {
        particleCount: 30,
        cursorTrail: true,
        magneticButtons: true,
        parallax: true,
        smoothScroll: true,
        revealAnimations: true
    };

    /**
     * Initialisiere alle Animationen
     */
    function init() {
        if (config.revealAnimations) initRevealAnimations();
        if (config.magneticButtons) initMagneticButtons();
        if (config.parallax) initParallax();
        if (config.cursorTrail) initCursorEffects();
        initScrollProgress();
        initCounterAnimations();
        initTypingEffect();
        initImageLazyLoad();
        initSmoothAnchorScroll();

        console.log('Premium Animations initialisiert');
    }

    /**
     * Scroll Reveal Animationen
     */
    function initRevealAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Optional: Stop observing after reveal
                    if (entry.target.dataset.revealOnce !== 'false') {
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal, [data-reveal]').forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * Magnetische Buttons
     */
    function initMagneticButtons() {
        const buttons = document.querySelectorAll('.btn, .btn-magnetic');

        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    /**
     * Parallax Effekte
     */
    function initParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        if (parallaxElements.length === 0) return;

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;

            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.5;
                const offset = scrollY * speed;
                el.style.transform = `translateY(${offset}px)`;
            });
        }, { passive: true });
    }

    /**
     * Cursor Effekte
     */
    function initCursorEffects() {
        // Custom Cursor
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';
        document.body.appendChild(cursor);

        const cursorDot = cursor.querySelector('.cursor-dot');
        const cursorRing = cursor.querySelector('.cursor-ring');

        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        // Smooth ring follow
        function animateRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover effects
        const interactiveElements = document.querySelectorAll('a, button, .product-card, input, select');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
            });
        });

        // Cursor Trail
        if (config.cursorTrail) {
            let trail = [];
            const trailLength = 8;

            document.addEventListener('mousemove', (e) => {
                trail.push({ x: e.clientX, y: e.clientY });
                if (trail.length > trailLength) trail.shift();
            });

            function drawTrail() {
                const existingTrail = document.querySelectorAll('.cursor-trail-dot');
                existingTrail.forEach(dot => dot.remove());

                trail.forEach((point, i) => {
                    const dot = document.createElement('div');
                    dot.className = 'cursor-trail-dot';
                    dot.style.left = point.x + 'px';
                    dot.style.top = point.y + 'px';
                    dot.style.opacity = i / trailLength;
                    dot.style.transform = `scale(${i / trailLength})`;
                    document.body.appendChild(dot);
                });

                requestAnimationFrame(drawTrail);
            }
            // drawTrail(); // Auskommentiert für Performance
        }

        // CSS für Cursor
        const style = document.createElement('style');
        style.textContent = `
            .custom-cursor {
                pointer-events: none;
                position: fixed;
                z-index: 99999;
                mix-blend-mode: difference;
            }

            .cursor-dot {
                position: fixed;
                width: 8px;
                height: 8px;
                background: #d19fae;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: width 0.2s, height 0.2s, background 0.2s;
            }

            .cursor-ring {
                position: fixed;
                width: 40px;
                height: 40px;
                border: 2px solid rgba(209, 159, 174, 0.5);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: width 0.3s, height 0.3s, border-color 0.3s;
            }

            .cursor-hover .cursor-dot {
                width: 12px;
                height: 12px;
                background: #e7b9c9;
            }

            .cursor-hover .cursor-ring {
                width: 60px;
                height: 60px;
                border-color: rgba(209, 159, 174, 0.8);
            }

            .cursor-trail-dot {
                position: fixed;
                width: 6px;
                height: 6px;
                background: rgba(209, 159, 174, 0.5);
                border-radius: 50%;
                pointer-events: none;
                transform: translate(-50%, -50%);
            }

            @media (max-width: 768px) {
                .custom-cursor { display: none; }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Scroll Progress Indicator
     */
    function initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
        document.body.appendChild(progressBar);

        const progressFill = progressBar.querySelector('.scroll-progress-bar');

        window.addEventListener('scroll', () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / scrollHeight) * 100;
            progressFill.style.width = `${progress}%`;
        }, { passive: true });

        const style = document.createElement('style');
        style.textContent = `
            .scroll-progress {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: rgba(255, 255, 255, 0.1);
                z-index: 10000;
            }

            .scroll-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #d19fae, #e7b9c9);
                width: 0;
                transition: width 0.1s ease-out;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Counter Animationen
     */
    function initCounterAnimations() {
        const counters = document.querySelectorAll('[data-counter]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    function animateCounter(element) {
        const target = parseInt(element.dataset.counter);
        const duration = parseInt(element.dataset.duration) || 2000;
        const suffix = element.dataset.suffix || '';
        const prefix = element.dataset.prefix || '';

        let start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out-expo)
            const easeOut = 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(target * easeOut);

            element.textContent = prefix + current.toLocaleString('de-DE') + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    /**
     * Typing Effekt
     */
    function initTypingEffect() {
        const typingElements = document.querySelectorAll('[data-typing]');

        typingElements.forEach(el => {
            const text = el.dataset.typing || el.textContent;
            const speed = parseInt(el.dataset.typingSpeed) || 50;
            el.textContent = '';

            let i = 0;
            function type() {
                if (i < text.length) {
                    el.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            }

            // Start when in view
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    type();
                    observer.disconnect();
                }
            });
            observer.observe(el);
        });
    }

    /**
     * Lazy Load Images
     */
    function initImageLazyLoad() {
        const images = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, { rootMargin: '100px' });

        images.forEach(img => imageObserver.observe(img));
    }

    /**
     * Smooth Anchor Scroll
     */
    function initSmoothAnchorScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const navHeight = document.querySelector('nav')?.offsetHeight || 80;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Particle System für Hero
     */
    function createParticles(container, count = config.particleCount) {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'hero-particles';

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (10 + Math.random() * 10) + 's';
            particleContainer.appendChild(particle);
        }

        container.appendChild(particleContainer);
    }

    /**
     * Tilt Effect für Karten
     */
    function initTiltEffect() {
        const cards = document.querySelectorAll('.product-card, [data-tilt]');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
        });
    }

    /**
     * Ripple Effect für Buttons
     */
    function initRippleEffect() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                ripple.className = 'ripple';

                const rect = btn.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
                ripple.style.top = e.clientY - rect.top - size / 2 + 'px';

                btn.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });

        const style = document.createElement('style');
        style.textContent = `
            .btn { position: relative; overflow: hidden; }

            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: rippleEffect 0.6s ease-out;
                pointer-events: none;
            }

            @keyframes rippleEffect {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Navbar Scroll Effect
     */
    function initNavbarScroll() {
        const nav = document.querySelector('nav');
        if (!nav) return;

        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;

            if (currentScroll > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }

            // Hide/Show on scroll direction
            if (currentScroll > lastScroll && currentScroll > 200) {
                nav.style.transform = 'translateY(-100%)';
            } else {
                nav.style.transform = 'translateY(0)';
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }

    // Auto-Init
    document.addEventListener('DOMContentLoaded', () => {
        init();
        initTiltEffect();
        initRippleEffect();
        initNavbarScroll();

        // Particles für Hero
        const hero = document.querySelector('.hero');
        if (hero) createParticles(hero);
    });

    // Public API
    return {
        init,
        createParticles,
        initTiltEffect,
        initRippleEffect,
        animateCounter,
        config
    };
})();

// Export für Module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PremiumAnimations;
}
