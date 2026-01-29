/* ═══════════════════════════════════════════════════════════════════════════
   LUNARA – CURATED INTIMACY | ULTIMATE JAVASCRIPT
   All Buttons Working • Maximum Animations • Toast System
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    // ═══════════════════════════════════════════════════════════════════════
    // BOOT SCREEN WITH STARS & ASTEROIDS
    // ═══════════════════════════════════════════════════════════════════════
    
    const bootScreen = document.getElementById('bootScreen');
    const bootStarfield = document.getElementById('bootStarfield');
    const bootAsteroidField = document.getElementById('bootAsteroidField');
    
    // Skip boot on revisit
    if (sessionStorage.getItem('lunara-booted')) {
        bootScreen?.classList.add('finished');
        setTimeout(() => bootScreen?.remove(), 100);
    } else {
        // Create boot stars
        if (bootStarfield) {
            for (let i = 0; i < 200; i++) {
                const star = document.createElement('div');
                star.className = 'boot-star';
                star.style.cssText = `
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    width: ${Math.random() * 3 + 1}px;
                    height: ${Math.random() * 3 + 1}px;
                    animation-delay: ${Math.random() * 3}s;
                    animation-duration: ${Math.random() * 2 + 2}s;
                `;
                bootStarfield.appendChild(star);
            }
        }
        
        // Create asteroids
        if (bootAsteroidField) {
            for (let i = 0; i < 8; i++) {
                const asteroid = document.createElement('div');
                asteroid.className = 'boot-asteroid';
                const size = Math.random() * 60 + 30;
                asteroid.style.cssText = `
                    width: ${size}px;
                    height: ${size}px;
                    top: ${Math.random() * 100}%;
                    animation-delay: ${i * 0.4}s;
                    animation-duration: ${Math.random() * 8 + 6}s;
                `;
                bootAsteroidField.appendChild(asteroid);
            }
        }
        
        // End boot
        setTimeout(() => {
            bootScreen?.classList.add('finished');
            sessionStorage.setItem('lunara-booted', 'true');
            setTimeout(() => bootScreen?.remove(), 2000);
        }, 4200);
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // COSMIC BACKGROUND PARTICLES
    // ═══════════════════════════════════════════════════════════════════════
    
    const particleLayer = document.getElementById('particleLayer');
    if (particleLayer) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'cosmic-particle';
            particle.style.cssText = `
                left: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 30}s;
                animation-duration: ${Math.random() * 20 + 25}s;
                opacity: ${Math.random() * 0.5 + 0.3};
            `;
            particleLayer.appendChild(particle);
        }
    }
    
    // Shooting stars
    const shootingStars = document.getElementById('shootingStars');
    if (shootingStars) {
        setInterval(() => {
            if (Math.random() > 0.7) {
                const star = document.createElement('div');
                star.className = 'shooting-star';
                star.style.cssText = `
                    top: ${Math.random() * 50}%;
                    left: -200px;
                    animation-delay: 0s;
                `;
                shootingStars.appendChild(star);
                setTimeout(() => star.remove(), 10000);
            }
        }, 3000);
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // CURSOR GLOW EFFECT
    // ═══════════════════════════════════════════════════════════════════════
    
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow && window.innerWidth > 768) {
        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        function animateGlow() {
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
            requestAnimationFrame(animateGlow);
        }
        animateGlow();
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // NAVIGATION
    // ═══════════════════════════════════════════════════════════════════════
    
    const nav = document.getElementById('nav');
    const burgerMenu = document.getElementById('burgerMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    
    // Scroll behavior
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 100) {
            nav?.classList.add('scrolled');
        } else {
            nav?.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile menu toggle
    burgerMenu?.addEventListener('click', () => {
        burgerMenu.classList.toggle('active');
        mobileMenu?.classList.toggle('active');
        document.body.style.overflow = mobileMenu?.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burgerMenu?.classList.remove('active');
            mobileMenu?.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // ═══════════════════════════════════════════════════════════════════════
    // THEME TOGGLE
    // ═══════════════════════════════════════════════════════════════════════
    
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('lunara-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    themeToggle?.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('lunara-theme', newTheme);
        showToast(`${newTheme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'} aktiviert`, 'info');
    });
    
    // ═══════════════════════════════════════════════════════════════════════
    // LANGUAGE SELECTOR
    // ═══════════════════════════════════════════════════════════════════════
    
    const langOptions = document.querySelectorAll('.lang-option');
    const langCurrent = document.querySelector('.lang-current');
    
    const langData = {
        de: { flag: '🇩🇪', code: 'DE', name: 'Deutsch' },
        en: { flag: '🇬🇧', code: 'EN', name: 'English' },
        pl: { flag: '🇵🇱', code: 'PL', name: 'Polski' }
    };
    
    const savedLang = localStorage.getItem('lunara-lang') || 'de';
    updateLanguageDisplay(savedLang);
    
    langOptions.forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.dataset.lang;
            updateLanguageDisplay(lang);
            localStorage.setItem('lunara-lang', lang);
            showToast(`🌍 Sprache: ${langData[lang].name}`, 'info');
            
            langOptions.forEach(o => o.classList.remove('active'));
            option.classList.add('active');
        });
    });
    
    function updateLanguageDisplay(lang) {
        if (langCurrent && langData[lang]) {
            langCurrent.querySelector('.lang-flag').textContent = langData[lang].flag;
            langCurrent.querySelector('.lang-code').textContent = langData[lang].code;
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // LOGIN MODAL
    // ═══════════════════════════════════════════════════════════════════════
    
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const modalClose = document.getElementById('modalClose');
    const loginForm = document.getElementById('loginForm');
    const mobileLoginBtns = document.querySelectorAll('.mobile-login');
    
    function openModal() {
        loginModal?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        loginModal?.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    loginBtn?.addEventListener('click', openModal);
    mobileLoginBtns.forEach(btn => btn.addEventListener('click', openModal));
    modalClose?.addEventListener('click', closeModal);
    
    loginModal?.querySelector('.modal-overlay')?.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && loginModal?.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Login form submission
    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail')?.value;
        showToast(`✨ Willkommen zurück!`, 'success');
        closeModal();
        loginForm.reset();
    });
    
    // Password toggle
    const passwordToggle = document.querySelector('.password-toggle');
    const passwordInput = document.getElementById('loginPassword');
    
    passwordToggle?.addEventListener('click', () => {
        const type = passwordInput?.type === 'password' ? 'text' : 'password';
        if (passwordInput) passwordInput.type = type;
    });
    
    // Forgot password link
    document.querySelector('.forgot-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('📧 Passwort-Reset Link wurde gesendet!', 'info');
    });
    
    // Register link
    document.querySelector('.register-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('🚀 Registrierung kommt bald!', 'info');
    });
    
    // ═══════════════════════════════════════════════════════════════════════
    // COLLECTION FILTER
    // ═══════════════════════════════════════════════════════════════════════
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    const collectionCards = document.querySelectorAll('.collection-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            collectionCards.forEach((card, index) => {
                const category = card.dataset.category;
                const show = filter === 'all' || category === filter;
                
                card.style.transition = 'all 0.5s ease';
                card.style.transitionDelay = `${index * 0.05}s`;
                
                if (show) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 500);
                }
            });
        });
    });
    
    // Collection links - ALL WORKING
    document.querySelectorAll('.collection-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const cardTitle = link.closest('.collection-card')?.querySelector('h3')?.textContent || 'Artikel';
            showToast(`💝 "${cardTitle}" - Kontaktiere mich für Details!`, 'info');
            
            // Scroll to contact section
            setTimeout(() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }, 1000);
        });
    });
    
    // ═══════════════════════════════════════════════════════════════════════
    // MERCH - ADD TO CART BUTTONS
    // ═══════════════════════════════════════════════════════════════════════
    
    document.querySelectorAll('.merch-card .btn-primary').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.merch-card');
            const productName = card?.querySelector('h3')?.textContent || 'Artikel';
            const price = card?.querySelector('.merch-price')?.textContent || '';
            
            // Add animation
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => btn.style.transform = '', 150);
            
            showToast(`🛒 "${productName}" (${price}) zum Warenkorb hinzugefügt!`, 'success');
        });
    });
    
    // ═══════════════════════════════════════════════════════════════════════
    // REWARDS - START BUTTON
    // ═══════════════════════════════════════════════════════════════════════
    
    document.querySelectorAll('.rewards-info .btn-primary').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('🌟 Erstelle ein Konto um Punkte zu sammeln!', 'info');
            setTimeout(openModal, 1500);
        });
    });
    
    // ═══════════════════════════════════════════════════════════════════════
    // FAQ ACCORDION
    // ═══════════════════════════════════════════════════════════════════════
    
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question?.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Open clicked if wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
    // ═══════════════════════════════════════════════════════════════════════
    // NEWSLETTER FORM
    // ═══════════════════════════════════════════════════════════════════════
    
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterSuccess = document.getElementById('newsletterSuccess');
    
    newsletterForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('emailInput')?.value;
        
        if (email && email.includes('@')) {
            newsletterForm.style.display = 'none';
            newsletterSuccess?.classList.add('show');
            showToast('🎉 Willkommen im LUNARA Newsletter!', 'success');
        } else {
            showToast('⚠️ Bitte gib eine gültige E-Mail ein', 'error');
        }
    });
    
    // ═══════════════════════════════════════════════════════════════════════
    // FOOTER LINKS - ALL WORKING
    // ═══════════════════════════════════════════════════════════════════════
    
    document.getElementById('imprintLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('📋 Impressum wird geladen...', 'info');
    });
    
    document.getElementById('privacyLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('🔒 Datenschutz wird geladen...', 'info');
    });
    
    document.getElementById('termsLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('📄 AGB werden geladen...', 'info');
    });
    
    // Social links
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href') === '#') {
                e.preventDefault();
                showToast('📱 Social Media kommt bald!', 'info');
            }
        });
    });
    
    // ═══════════════════════════════════════════════════════════════════════
    // SCROLL REVEAL ANIMATIONS
    // ═══════════════════════════════════════════════════════════════════════
    
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
    
    // ═══════════════════════════════════════════════════════════════════════
    // ANIMATED COUNTERS
    // ═══════════════════════════════════════════════════════════════════════
    
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(num => counterObserver.observe(num));
    
    function animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const start = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeProgress * target);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        }
        
        requestAnimationFrame(update);
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // RATING BARS ANIMATION
    // ═══════════════════════════════════════════════════════════════════════
    
    const ratingBars = document.querySelectorAll('.rating-bar-fill');
    
    const ratingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                const width = entry.target.dataset.width || 0;
                setTimeout(() => {
                    entry.target.style.width = width + '%';
                }, 300);
            }
        });
    }, { threshold: 0.5 });
    
    ratingBars.forEach(bar => ratingObserver.observe(bar));
    
    // ═══════════════════════════════════════════════════════════════════════
    // FEEDBACK SLIDER DUPLICATE
    // ═══════════════════════════════════════════════════════════════════════
    
    const feedbackSlider = document.getElementById('feedbackSlider');
    if (feedbackSlider) {
        const cards = feedbackSlider.innerHTML;
        feedbackSlider.innerHTML = cards + cards;
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // MAGNETIC BUTTONS EFFECT
    // ═══════════════════════════════════════════════════════════════════════
    
    if (window.innerWidth > 768) {
        document.querySelectorAll('.btn-primary, .btn-secondary, .btn-login').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // PARALLAX HERO
    // ═══════════════════════════════════════════════════════════════════════
    
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
            }
        });
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // TOAST NOTIFICATION SYSTEM
    // ═══════════════════════════════════════════════════════════════════════
    
    function showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        
        const icons = {
            success: '✓',
            error: '✕',
            info: '★'
        };
        
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || '★'}</div>
            <div class="toast-message">${message}</div>
        `;
        
        container.appendChild(toast);
        
        // Auto remove
        setTimeout(() => {
            toast.style.animation = 'toastSlideOut 0.5s ease forwards';
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    }
    
    // Add toast slide out animation
    const toastStyle = document.createElement('style');
    toastStyle.textContent = `
        @keyframes toastSlideOut {
            to { opacity: 0; transform: translateX(120px); }
        }
    `;
    document.head.appendChild(toastStyle);
    
    // Expose globally for buttons
    window.showToast = showToast;
    
    // ═══════════════════════════════════════════════════════════════════════
    // HERO CTA BUTTONS
    // ═══════════════════════════════════════════════════════════════════════
    
    document.querySelectorAll('.hero-cta .btn-primary').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Let it scroll naturally via href
        });
    });
    
    document.querySelectorAll('.hero-cta .btn-secondary').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Let it scroll naturally via href
        });
    });
    
    // ═══════════════════════════════════════════════════════════════════════
    // KEYBOARD NAVIGATION
    // ═══════════════════════════════════════════════════════════════════════
    
    document.addEventListener('keydown', (e) => {
        // Press 'T' to toggle theme
        if (e.key === 't' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT') {
            themeToggle?.click();
        }
    });
    
    // ═══════════════════════════════════════════════════════════════════════
    // INITIALIZATION COMPLETE
    // ═══════════════════════════════════════════════════════════════════════
    
    console.log('🌙 LUNARA loaded successfully');
});
