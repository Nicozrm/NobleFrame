/**
 * LUNARA Security Module
 * Security utilities and hardening measures
 */

// Storage wrapper with try/catch for blocked localStorage
export function safeStorage(key, value = null, remove = false) {
  try {
    if (remove) {
      localStorage.removeItem(key);
      return true;
    }
    if (value !== null) {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    }
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.warn('Storage access blocked:', error);
    return null;
  }
}

// Input sanitization - basic XSS prevention
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
}

// Validate email format
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate German postal code
export function isValidPLZ(plz) {
  return /^\d{5}$/.test(plz);
}

// Safe URL validation
export function isValidURL(url) {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

// Generate secure random string
export function generateSecureId(length = 16) {
  if (crypto?.getRandomValues) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  // Fallback for older browsers
  return Array.from({ length }, () => 
    Math.random().toString(36).charAt(2)
  ).join('');
}

// Rate limiter for form submissions
const rateLimitMap = new Map();

export function checkRateLimit(key, maxAttempts = 5, windowMs = 60000) {
  const now = Date.now();
  const attempts = rateLimitMap.get(key) || [];
  
  // Clean old attempts
  const recentAttempts = attempts.filter(time => now - time < windowMs);
  
  if (recentAttempts.length >= maxAttempts) {
    const oldestAttempt = Math.min(...recentAttempts);
    const waitTime = Math.ceil((windowMs - (now - oldestAttempt)) / 1000);
    return { allowed: false, waitTime };
  }
  
  recentAttempts.push(now);
  rateLimitMap.set(key, recentAttempts);
  
  return { allowed: true };
}

// CSRF token generation (for forms)
export function generateCSRFToken() {
  const token = generateSecureId(32);
  safeStorage('lunara_csrf', token);
  return token;
}

export function validateCSRFToken(token) {
  const storedToken = safeStorage('lunara_csrf');
  return storedToken && storedToken === token;
}

// Content Security Policy reporter
export function reportCSPViolation(violation) {
  console.warn('CSP Violation:', {
    directive: violation.violatedDirective,
    blockedURI: violation.blockedURI,
    sourceFile: violation.sourceFile
  });
  
  // In production, you would send this to a logging service
  // fetch('/api/csp-report', { method: 'POST', body: JSON.stringify(violation) });
}

// Initialize CSP violation listener
if (typeof document !== 'undefined') {
  document.addEventListener('securitypolicyviolation', (e) => {
    reportCSPViolation(e);
  });
}

// Detect suspicious activity
export function detectSuspiciousActivity() {
  let suspiciousScore = 0;
  
  // Check for dev tools
  const devToolsOpen = /./;
  devToolsOpen.toString = function() {
    suspiciousScore += 10;
  };
  
  // Check for unusual user agent
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('curl') || ua.includes('wget') || ua.includes('python')) {
    suspiciousScore += 20;
  }
  
  // Check for headless browser
  if (navigator.webdriver || !navigator.languages || navigator.languages.length === 0) {
    suspiciousScore += 30;
  }
  
  return {
    score: suspiciousScore,
    suspicious: suspiciousScore > 25
  };
}

// Secure form initialization
export function initSecureForm(form) {
  if (!form) return;
  
  // Add honeypot
  const honeypot = document.createElement('input');
  honeypot.type = 'text';
  honeypot.name = 'website';
  honeypot.tabIndex = -1;
  honeypot.autocomplete = 'off';
  honeypot.style.cssText = 'position:absolute;left:-9999px;top:-9999px;';
  form.appendChild(honeypot);
  
  // Add CSRF token
  const csrfInput = document.createElement('input');
  csrfInput.type = 'hidden';
  csrfInput.name = '_csrf';
  csrfInput.value = generateCSRFToken();
  form.appendChild(csrfInput);
  
  // Validate on submit
  form.addEventListener('submit', (e) => {
    // Check honeypot
    if (honeypot.value) {
      e.preventDefault();
      console.warn('Honeypot triggered');
      return false;
    }
    
    // Check rate limit
    const rateCheck = checkRateLimit(form.id || 'form', 3, 30000);
    if (!rateCheck.allowed) {
      e.preventDefault();
      alert(`Bitte warte ${rateCheck.waitTime} Sekunden.`);
      return false;
    }
    
    return true;
  });
}

// Secure external link handling
export function secureExternalLinks() {
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.hostname.includes(window.location.hostname)) {
      link.setAttribute('rel', 'noopener noreferrer');
      link.setAttribute('target', '_blank');
    }
  });
}

// Initialize security features
export function initSecurity() {
  // Secure all external links
  secureExternalLinks();
  
  // Initialize secure forms
  document.querySelectorAll('form[data-secure]').forEach(form => {
    initSecureForm(form);
  });
  
  // Detect suspicious activity
  const activity = detectSuspiciousActivity();
  if (activity.suspicious) {
    console.warn('Suspicious activity detected:', activity.score);
  }
  
  console.log('🔒 LUNARA Security initialized');
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSecurity);
} else {
  initSecurity();
}
