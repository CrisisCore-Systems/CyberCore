/**
 * theme.js
 * Main theme logic for VoidBloom Designs - CyberCore theme
 * @version 1.0.0-updated
 */

// Wait for DOM ready
window.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initDesktopDropdowns();
  initMobileMenu();
  initBackdrop();
  initGlitchEffect();
});

/**
 * Initialize base theme settings
 */
function initTheme() {
  // Apply reduced-motion class if set
  if (window.innerWidth && document.body.classList.contains('reduce-motion')) {
    document.body.classList.add('reduce-motion');
  }
  // Other theme initialization logic can go here
}

/**
 * Initialize desktop dropdown menus
 */
function initDesktopDropdowns() {
  const dropdownToggles = document.querySelectorAll('[data-dropdown-toggle]');
  dropdownToggles.forEach(toggle => {
    const menu = document.querySelector(toggle.getAttribute('data-dropdown-toggle'));
    if (!menu) return;
    toggle.addEventListener('mouseenter', () => menu.classList.add('open'));
    toggle.addEventListener('mouseleave', () => menu.classList.remove('open'));
    menu.addEventListener('mouseenter', () => menu.classList.add('open'));
    menu.addEventListener('mouseleave', () => menu.classList.remove('open'));
  });
}

/**
 * Initialize mobile menu drawer
 */
function initMobileMenu() {
  const mobileDrawer = document.querySelector('.mobile-menu-drawer');
  const toggles = document.querySelectorAll('[data-quantum-trigger="mobile-menu"]');
  toggles.forEach(btn => {
    btn.addEventListener('click', event => {
      event.stopPropagation();
      openMobileMenu();
    });
  });
}

/**
 * Ensure a backdrop exists and wire up close handlers
 */
function initBackdrop() {
  let backdrop = document.querySelector('.drawer-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'drawer-backdrop';
    document.body.appendChild(backdrop);
  }
  // Close drawers on backdrop click
  backdrop.addEventListener('click', () => {
    closeCartDrawer();
    closeMobileMenu();
  });
  // Close on Escape key
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeCartDrawer();
      closeMobileMenu();
    }
  });
}

/**
 * Open the cart drawer
 */
function openCartDrawer() {
  const cartDrawer = document.querySelector('[data-quantum-drawer="cart"]');
  const backdrop = document.querySelector('.drawer-backdrop');
  if (cartDrawer) cartDrawer.classList.add('open');
  if (backdrop) backdrop.classList.add('active');
  document.body.classList.add('cart-drawer-open');
}

/**
 * Close the cart drawer
 */
function closeCartDrawer() {
  const cartDrawer = document.querySelector('[data-quantum-drawer="cart"]');
  const backdrop = document.querySelector('.drawer-backdrop');
  if (cartDrawer) cartDrawer.classList.remove('open');
  if (backdrop) backdrop.classList.remove('active');
  document.body.classList.remove('cart-drawer-open');
}

/**
 * Open the mobile menu drawer
 */
function openMobileMenu() {
  const mobileDrawer = document.querySelector('.mobile-menu-drawer');
  const backdrop = document.querySelector('.drawer-backdrop');
  if (!mobileDrawer) return;
  mobileDrawer.classList.add('open');
  if (backdrop) backdrop.classList.add('active');
}

/**
 * Close the mobile menu drawer
 */
function closeMobileMenu() {
  const mobileDrawer = document.querySelector('.mobile-menu-drawer');
  const backdrop = document.querySelector('.drawer-backdrop');
  if (!mobileDrawer) return;
  mobileDrawer.classList.remove('open');
  if (backdrop) backdrop.classList.remove('active');
}

/**
 * Initialize glitch effect
 * (Assumes window.GlitchEngine already loaded)
 */
function initGlitchEffect() {
  if (window.GlitchEngine) {
    const level = parseFloat(document.body.dataset.glitchLevel) || 0.5;
    window.GlitchEngine.init({ intensity: level });
  }
}
