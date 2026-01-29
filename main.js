// INTRO ANIMATION
document.addEventListener('DOMContentLoaded', () => {
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (6 + Math.random() * 4) + 's';
        particlesContainer.appendChild(particle);
    }
    setTimeout(() => document.getElementById('intro').classList.add('fade-out'), 2500);
    setTimeout(() => {
        if (!localStorage.getItem('cookieConsent')) {
            document.getElementById('cookieBanner').classList.add('show');
        }
    }, 3500);
});

// COOKIES
function acceptCookies() {
    localStorage.setItem('cookieConsent', 'accepted');
    document.getElementById('cookieBanner').classList.remove('show');
}
function declineCookies() {
    localStorage.setItem('cookieConsent', 'declined');
    document.getElementById('cookieBanner').classList.remove('show');
}

// NAVIGATION
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// CART
let cart = JSON.parse(localStorage.getItem('lunaraCart')) || [];

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartPointsPreview = document.getElementById('cartPointsPreview');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    if (cart.length > 0) {
        cartCount.textContent = cart.length;
        cartCount.classList.add('show');
        let total = 0;
        cartItems.innerHTML = cart.map((item, index) => {
            const itemTotal = item.price + (item.servicesTotal || 0) + (item.tip || 0);
            total += itemTotal;
            let extras = [];
            if (item.services && item.services.length > 0) extras.push(item.services.join(', '));
            if (item.tip > 0) extras.push(`Trinkgeld ${item.tip}€`);
            return `<div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    ${extras.length > 0 ? `<div class="cart-item-extras">${extras.join(' + ')}</div>` : ''}
                    <div class="cart-item-price">${itemTotal.toFixed(2).replace('.', ',')} €</div>
                    <button class="cart-item-remove" onclick="removeFromCart(${index})">Entfernen</button>
                </div>
            </div>`;
        }).join('');
        cartTotal.textContent = total.toFixed(2).replace('.', ',') + ' €';
        checkoutTotal.textContent = total.toFixed(2).replace('.', ',') + ' €';
        cartPointsPreview.innerHTML = `Du erhältst <strong>${Math.floor(total)} Punkte</strong> mit dieser Bestellung`;
    } else {
        cartCount.classList.remove('show');
        cartItems.innerHTML = `<div class="cart-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M6 6L5 3H2"/></svg><p>Dein Warenkorb ist leer</p></div>`;
        cartTotal.textContent = '0,00 €';
        checkoutTotal.textContent = '0,00 €';
        cartPointsPreview.innerHTML = `Du erhältst <strong>0 Punkte</strong> mit dieser Bestellung`;
    }
}

function addToCart(item) {
    cart.push(item);
    localStorage.setItem('lunaraCart', JSON.stringify(cart));
    updateCartUI();
    showToast('Zum Warenkorb hinzugefügt!');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('lunaraCart', JSON.stringify(cart));
    updateCartUI();
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Cart sidebar
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');

cartBtn.addEventListener('click', () => {
    cartSidebar.classList.add('show');
    cartOverlay.classList.add('show');
});

function closeCart() {
    cartSidebar.classList.remove('show');
    cartOverlay.classList.remove('show');
}

cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Checkout
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const checkoutClose = document.getElementById('checkoutClose');

checkoutBtn.addEventListener('click', () => {
    if (cart.length > 0) {
        closeCart();
        checkoutModal.classList.add('show');
    } else {
        showToast('Dein Warenkorb ist leer');
    }
});

checkoutClose.addEventListener('click', () => checkoutModal.classList.remove('show'));
checkoutModal.addEventListener('click', (e) => {
    if (e.target === checkoutModal) checkoutModal.classList.remove('show');
});

function processPayment(method) {
    const total = cart.reduce((sum, item) => sum + item.price + (item.servicesTotal || 0) + (item.tip || 0), 0);
    switch(method) {
        case 'paypal':
            window.open('https://paypal.me/LUNARA/' + total.toFixed(2), '_blank');
            break;
        case 'card':
            alert('Weiterleitung zum Kreditkarten-Zahlungsportal...\n\n(Stripe Integration folgt)');
            break;
        case 'sepa':
            alert(`SEPA-Überweisung\n\nEmpfänger: LUNARA\nIBAN: DE89 3704 0044 0532 0130 00\nBIC: COBADEFFXXX\nBetrag: ${total.toFixed(2).replace('.', ',')} €\nVerwendungszweck: LUNARA-${Date.now()}`);
            break;
        case 'revolut':
            window.open('https://revolut.me/lunara', '_blank');
            break;
    }
}

function sendTip(amount) {
    if (amount === 0) {
        const custom = prompt('Wie viel möchtest du geben?', '15');
        if (custom && !isNaN(custom)) amount = parseFloat(custom);
        else return;
    }
    window.open('https://paypal.me/LUNARA/' + amount, '_blank');
    showToast('Vielen Dank für dein Trinkgeld! 💝');
}

// FAQ
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.parentElement;
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
    });
});

// NEWSLETTER
const newsletterForm = document.getElementById('newsletterForm');
const agbCheckbox = document.getElementById('agbCheckbox');
const newsletterError = document.getElementById('newsletterError');
const newsletterSuccess = document.getElementById('newsletterSuccess');
const confettiContainer = document.getElementById('confetti');

newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!agbCheckbox.checked) {
        newsletterError.classList.add('show');
        return;
    }
    newsletterError.classList.remove('show');
    newsletterForm.style.display = 'none';
    newsletterSuccess.classList.add('show');
    createConfetti();
});

function createConfetti() {
    const colors = ['#C9A9A6', '#D4B5A8', '#E8DFD4', '#FAF8F5', '#B8968F'];
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = (Math.random() * 10 + 5) + 'px';
        confetti.style.height = (Math.random() * 10 + 5) + 'px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        const animation = confetti.animate([
            { transform: 'translateY(-20px) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], { duration: Math.random() * 2000 + 2000, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', delay: Math.random() * 500 });
        confettiContainer.appendChild(confetti);
        animation.onfinish = () => confetti.remove();
    }
}

// SCROLL ANIMATIONS
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in').forEach(el => observer.observe(el));

// Init
updateCartUI();
