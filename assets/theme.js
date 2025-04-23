/**
 * Voidbloom Theme JavaScript
 *
 * Handles interactive elements like navigation, cart, and visual effects.
 */

// Wrap the script in an IIFE to avoid polluting the global scope
(function() {
  'use strict';

  // --- Constants and Selectors ---
  const SELECTORS = {
    header: '.voidbloom-header',
    mobileMenuToggle: '[data-quantum-trigger="mobile-menu"]',
    cartToggle: '[data-quantum-trigger="cart"]',
    navigation: '.header-navigation',
    navMenu: '.nav-menu',
    navItemHasDropdown: '.nav-item:has(.quantum-dropdown)', // More modern selector
    dropdownMenu: '.quantum-dropdown',
    glitchTextElements: '.glitch-text',
    cartCount: '[data-neural-node="cart-count"]',
    // Add other selectors as needed
    cartDrawer: '#cart-drawer', // Example ID, adjust as needed
    mobileNavContainer: '#mobile-nav-container' // Example ID, adjust as needed
  };

  const CLASSES = {
    mobileMenuOpen: 'mobile-menu-is-open',
    cartDrawerOpen: 'cart-drawer-is-open',
    dropdownOpen: 'dropdown-is-open',
    glitchActive: 'glitch-active' // Class to activate JS glitch effect if needed
  };

  // Debounce utility for resize/scroll events
  function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
      const context = this;
      const args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  // --- Core Functions ---

  /**
   * Initializes all theme scripts.
   * Waits for the DOM to be fully loaded.
   */
  function initTheme() {
    console.log('Voidbloom Theme JS Initialized'); // For debugging

    // Find key elements
    const mobileMenuToggle = document.querySelector(SELECTORS.mobileMenuToggle);
    const cartToggle = document.querySelector(SELECTORS.cartToggle);
    const header = document.querySelector(SELECTORS.header);
    // const cartDrawer = document.querySelector(SELECTORS.cartDrawer); // Uncomment if using a cart drawer
    // const mobileNavContainer = document.querySelector(SELECTORS.mobileNavContainer); // Uncomment if using a mobile nav container

    // Initialize components
    if (mobileMenuToggle && header) { // Check if elements exist
      initMobileMenu(mobileMenuToggle, header);
    } else {
      console.warn('Mobile menu toggle or header not found.');
    }

    if (cartToggle) { // Check if element exists
      initCartInteraction(cartToggle);
    } else {
      console.warn('Cart toggle button not found.');
    }

    initDesktopDropdowns();
    initGlitchEffect();

    // Add resize listener for potential adjustments
    window.addEventListener('resize', debounce(onWindowResize, 250));
  }

  /**
   * Handles window resize events (e.g., closing mobile menu on larger screens).
   */
  function onWindowResize() {
    // Example: Close mobile menu if window becomes wider than mobile breakpoint
    const mobileBreakpoint = 768; // Example breakpoint in pixels
    if (window.innerWidth >= mobileBreakpoint) {
      document.body.classList.remove(CLASSES.mobileMenuOpen);
      const mobileMenuToggle = document.querySelector(SELECTORS.mobileMenuToggle);
      if (mobileMenuToggle) {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      }
      // Close any open dropdowns within the main nav if needed
    }
  }

  /**
   * Initializes the mobile menu toggle functionality.
   * @param {HTMLElement} toggleButton - The button that triggers the menu.
   * @param {HTMLElement} headerElement - The main header element.
   */
  function initMobileMenu(toggleButton, headerElement) {
    toggleButton.addEventListener('click', () => {
      const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
      document.body.classList.toggle(CLASSES.mobileMenuOpen); // Toggle class on body or header
      toggleButton.setAttribute('aria-expanded', !isExpanded);

      // Optional: Add focus management (trap focus within menu when open)
      // Optional: Handle sub-menu toggles within the mobile menu
    });

    // Add keyboard support for dropdowns within mobile menu if structured differently
  }

  /**
   * Initializes the cart interaction (e.g., opening a drawer/modal).
   * Placeholder function - customize based on actual cart implementation.
   * @param {HTMLElement} toggleButton - The button that triggers the cart view.
   */
  function initCartInteraction(toggleButton) {
    toggleButton.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent default if it's a link/button that might navigate

      // --- Implementation Options ---
      // 1. Toggle a class for a CSS-driven drawer/modal:
      // const cartDrawer = document.querySelector(SELECTORS.cartDrawer);
      // if (cartDrawer) {
      //   const isOpen = document.body.classList.toggle(CLASSES.cartDrawerOpen);
      //   toggleButton.setAttribute('aria-expanded', isOpen);
      //   // Add focus management if opening a modal/drawer
      // } else {
      //   console.warn('Cart drawer element not found:', SELECTORS.cartDrawer);
      // }

      // 2. Redirect to the cart page:
      // window.location.href = '/cart';

      // 3. Use Shopify's AJAX Cart API to open a theme-specific drawer/modal
      console.log('Cart interaction triggered. Implement cart opening logic here.');
      alert('Cart functionality not fully implemented in this example.'); // Replace with actual logic
    });

    // Optional: Listen for Shopify Cart API updates to refresh count
    // document.addEventListener('shopify:cart:update', (event) => {
    //   updateCartCount(event.detail.cart.item_count);
    // });
  }

  /**
   * Updates the cart count indicator in the header.
   * @param {number} count - The new item count.
   */
  function updateCartCount(count) {
    const cartCountElement = document.querySelector(SELECTORS.cartCount);
    if (cartCountElement) {
      cartCountElement.textContent = count;
      // Optional: Add/remove a class based on count (e.g., 'cart-is-empty')
    }
  }


  /**
   * Initializes hover/focus behaviour for desktop dropdown menus.
   */
  function initDesktopDropdowns() {
    const navItems = document.querySelectorAll(SELECTORS.navItemHasDropdown);

    navItems.forEach(item => {
      const link = item.querySelector('a'); // Get the main link
      const dropdown = item.querySelector(SELECTORS.dropdownMenu);

      if (!link || !dropdown) return;

      // Show on hover (for mouse users)
      item.addEventListener('mouseenter', () => {
        // Avoid triggering on mobile widths if nav is hidden/different
        if (window.innerWidth < 768) return; // Example breakpoint
        item.classList.add(CLASSES.dropdownOpen);
        link.setAttribute('aria-expanded', 'true');
      });

      item.addEventListener('mouseleave', () => {
        if (window.innerWidth < 768) return;
         item.classList.remove(CLASSES.dropdownOpen);
         link.setAttribute('aria-expanded', 'false');
      });

      // Show on focus for keyboard navigation accessibility
      link.addEventListener('focus', () => {
         // Check if focus is moving *within* the item to keep it open
         setTimeout(() => { // Timeout helps manage focus transitions
            if (item.contains(document.activeElement)) {
                item.classList.add(CLASSES.dropdownOpen);
                link.setAttribute('aria-expanded', 'true');
            }
         }, 10); // Small delay
      });

      // Handle focus leaving the entire nav item (link + dropdown)
      item.addEventListener('focusout', (event) => {
        // Use setTimeout to allow focus to move to a child element first
        setTimeout(() => {
          if (!item.contains(document.activeElement)) {
            item.classList.remove(CLASSES.dropdownOpen);
            link.setAttribute('aria-expanded', 'false');
          }
        }, 50); // Slightly longer delay for focusout
      });

      // Prevent default click on parent links if they only open dropdowns
      // link.addEventListener('click', (event) => {
      //    if (window.innerWidth >= 768 && item.classList.contains(CLASSES.dropdownOpen)) {
      //       // Optional: prevent click if it *only* opens the dropdown on desktop
      //       // event.preventDefault();
      //    }
      // });
    });
  }

  /**
   * Initializes the glitch text effect.
   * This is a basic example; customize as needed.
   */
  function initGlitchEffect() {
    const elements = document.querySelectorAll(SELECTORS.glitchTextElements);
    const glitchIntensity = document.querySelector(SELECTORS.header)?.dataset.glitchLevel || 'medium'; // Get from header or default

    elements.forEach(el => {
      const originalText = el.dataset.text || el.textContent;
      el.setAttribute('data-text', originalText); // Ensure data-text is set

      // Option 1: Pure CSS Glitch (requires CSS definitions for .glitch-text::before/after)
      // Add a class to trigger CSS animations if needed
      // el.classList.add(CLASSES.glitchActive);

      // Option 2: Basic JS Glitch (Example - customize heavily)
      // This is very basic and might impact performance if overused.
      // Consider requestAnimationFrame for smoother animation.
      // setInterval(() => {
      //   if (Math.random() > 0.85) { // Randomly trigger
      //     el.textContent = shuffleText(originalText);
      //     el.classList.add(CLASSES.glitchActive); // Add class for visual glitch
      //     setTimeout(() => {
      //       el.textContent = originalText;
      //       el.classList.remove(CLASSES.glitchActive); // Remove class
      //     }, Math.random() * 150 + 50); // Random duration
      //   }
      // }, Math.random() * 3000 + 1000); // Random interval
    });

    console.log(`Glitch effect initialized with level: ${glitchIntensity}`);
    // Add more sophisticated glitch logic based on glitchIntensity if desired
  }

  // Helper for JS glitch example (optional)
  function shuffleText(text) {
    const chars = '!<>-_\\/[]{}—=+*^?#________'; // Characters to inject
    let shuffled = '';
    for (let i = 0; i < text.length; i++) {
      shuffled += Math.random() > 0.8 ? chars.charAt(Math.floor(Math.random() * chars.length)) : text[i];
    }
    return shuffled;
  }


  // --- Initialization ---

  // Wait for the DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    // DOMContentLoaded has already fired
    initTheme();
  }

})(); // End IIFE
