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
    navItemHasDropdown: '.nav-item.has-dropdown', // Modified for better compatibility
    dropdownMenu: '.quantum-dropdown',
    glitchTextElements: '.glitch-text',
    cartCount: '[data-neural-node="cart-count"]',
    cartDrawer: '#CartDrawer', // Updated to match your actual markup
    mobileMenuDrawer: '#MobileMenuDrawer', // Updated to match your actual markup
    footer: '.voidbloom-footer',
    newsletterForm: '.newsletter-form'
  };

  const CLASSES = {
    mobileMenuOpen: 'mobile-menu-is-open',
    cartDrawerOpen: 'cart-drawer-is-open',
    dropdownOpen: 'dropdown-is-open',
    glitchActive: 'glitch-active',
    bodyLock: 'quantum-body-lock' // To prevent background scrolling when modals are open
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
  }

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
    const cartDrawer = document.querySelector(SELECTORS.cartDrawer);
    const mobileMenuDrawer = document.querySelector(SELECTORS.mobileMenuDrawer);
    const footer = document.querySelector(SELECTORS.footer);

    // Initialize components
    if (mobileMenuToggle && mobileMenuDrawer) {
      initMobileMenu(mobileMenuToggle, mobileMenuDrawer);
    } else {
      console.warn('Mobile menu elements not found.');
    }

    if (cartToggle && cartDrawer) {
      initCartInteraction(cartToggle, cartDrawer);
    } else {
      console.warn('Cart elements not found.');
    }

    // Initialize other features
    initDesktopDropdowns();
    initGlitchEffect();
    
    // Initialize footer functionality if needed
    if (footer) {
      initFooterInteractions(footer);
    }

    // Add resize listener for responsive adjustments
    window.addEventListener('resize', debounce(onWindowResize, 250));
    
    // Initial cart count update
    fetchCartCount();
  }

  /**
   * Handles window resize events (e.g., closing mobile menu on larger screens).
   */
  function onWindowResize() {
    const mobileBreakpoint = 768; // Example breakpoint in pixels
    if (window.innerWidth >= mobileBreakpoint) {
      document.body.classList.remove(CLASSES.mobileMenuOpen, CLASSES.bodyLock);
      
      const mobileMenuToggle = document.querySelector(SELECTORS.mobileMenuToggle);
      if (mobileMenuToggle) {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      }
      
      // Reset any drawer states
      const mobileMenuDrawer = document.querySelector(SELECTORS.mobileMenuDrawer);
      if (mobileMenuDrawer) {
        mobileMenuDrawer.setAttribute('aria-hidden', 'true');
      }
    }
  }

  /**
   * Initializes the mobile menu toggle functionality.
   * @param {HTMLElement} toggleButton - The button that triggers the menu.
   * @param {HTMLElement} menuDrawer - The mobile menu drawer element.
   */
  function initMobileMenu(toggleButton, menuDrawer) {
    toggleButton.addEventListener('click', (event) => {
      event.preventDefault();
      
      const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
      document.body.classList.toggle(CLASSES.mobileMenuOpen);
      document.body.classList.toggle(CLASSES.bodyLock);
      
      toggleButton.setAttribute('aria-expanded', !isExpanded);
      menuDrawer.setAttribute('aria-hidden', isExpanded);
      
      // Trap focus within the menu when open
      if (!isExpanded) {
        // Focus the first focusable element in the drawer
        const focusableElements = menuDrawer.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length) {
          setTimeout(() => {
            focusableElements[0].focus();
          }, 100);
        }
      }
    });
    
    // Close the drawer when clicking outside
    document.addEventListener('click', (event) => {
      if (document.body.classList.contains(CLASSES.mobileMenuOpen) &&
          !menuDrawer.contains(event.target) &&
          !toggleButton.contains(event.target)) {
        toggleButton.click();
      }
    });
    
    // Add escape key support
    menuDrawer.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        toggleButton.click();
      }
    });
  }

  /**
   * Initializes the cart interaction (opening a drawer/modal).
   * @param {HTMLElement} toggleButton - The button that triggers the cart view.
   * @param {HTMLElement} cartDrawer - The cart drawer element.
   */
  function initCartInteraction(toggleButton, cartDrawer) {
    toggleButton.addEventListener('click', (event) => {
      event.preventDefault();
      
      const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
      document.body.classList.toggle(CLASSES.cartDrawerOpen);
      document.body.classList.toggle(CLASSES.bodyLock);
      
      toggleButton.setAttribute('aria-expanded', !isExpanded);
      cartDrawer.setAttribute('aria-hidden', isExpanded);
      
      // Trap focus within cart when open
      if (!isExpanded) {
        // Load cart content if needed
        loadCartContent(cartDrawer);
        
        // Focus the first focusable element in the drawer
        const focusableElements = cartDrawer.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length) {
          setTimeout(() => {
            focusableElements[0].focus();
          }, 100);
        }
      }
    });
    
    // Close the drawer when clicking outside
    document.addEventListener('click', (event) => {
      if (document.body.classList.contains(CLASSES.cartDrawerOpen) &&
          !cartDrawer.contains(event.target) &&
          !toggleButton.contains(event.target)) {
        toggleButton.click();
      }
    });
    
    // Add escape key support
    cartDrawer.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        toggleButton.click();
      }
    });
    
    // Listen for Shopify Cart API updates to refresh count
    document.addEventListener('cart:updated', (event) => {
      if (event.detail && event.detail.cart) {
        updateCartCount(event.detail.cart.item_count);
      } else {
        fetchCartCount();
      }
    });
  }

  /**
   * Loads cart content via AJAX
   * @param {HTMLElement} cartDrawer - The cart drawer element.
   */
  function loadCartContent(cartDrawer) {
    fetch('/cart?view=drawer')
      .then(response => response.text())
      .then(html => {
        cartDrawer.innerHTML = html;
        
        // Initialize quantity changes and removal buttons
        initCartItemControls(cartDrawer);
      })
      .catch(error => {
        console.error('Error loading cart:', error);
        cartDrawer.innerHTML = '<div class="cart-drawer-error">Error loading cart. Please try again.</div>';
      });
  }

  /**
   * Initialize event handlers for cart item controls
   * @param {HTMLElement} cartDrawer - The cart drawer element.
   */
  function initCartItemControls(cartDrawer) {
    // Quantity adjustment buttons
    const quantityButtons = cartDrawer.querySelectorAll('.quantity-button');
    quantityButtons.forEach(button => {
      button.addEventListener('click', handleQuantityChange);
    });
    
    // Remove buttons
    const removeButtons = cartDrawer.querySelectorAll('.cart-item-remove');
    removeButtons.forEach(button => {
      button.addEventListener('click', handleItemRemove);
    });
  }

  /**
   * Handle quantity change on cart items
   * @param {Event} event - The click event
   */
  function handleQuantityChange(event) {
    const button = event.currentTarget;
    const input = button.closest('.quantity-selector').querySelector('input');
    const lineItem = button.closest('[data-line-item]');
    const lineId = lineItem?.dataset.lineItem;
    const isIncrease = button.classList.contains('quantity-increase');
    
    let newValue = parseInt(input.value, 10) + (isIncrease ? 1 : -1);
    newValue = Math.max(1, newValue); // Ensure minimum value is 1
    
    if (lineId) {
      updateCartItem(lineId, newValue);
    }
  }

  /**
   * Handle item removal from cart
   * @param {Event} event - The click event
   */
  function handleItemRemove(event) {
    const button = event.currentTarget;
    const lineItem = button.closest('[data-line-item]');
    const lineId = lineItem?.dataset.lineItem;
    
    if (lineId) {
      updateCartItem(lineId, 0);
    }
  }

  /**
   * Update cart item via Shopify Cart API
   * @param {string} lineId - The line item id
   * @param {number} quantity - The new quantity
   */
  function updateCartItem(lineId, quantity) {
    fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: lineId,
        quantity: quantity
      })
    })
    .then(response => response.json())
    .then(cart => {
      // Refresh cart drawer
      const cartDrawer = document.querySelector(SELECTORS.cartDrawer);
      if (cartDrawer) {
        loadCartContent(cartDrawer);
      }
      
      // Update cart count
      updateCartCount(cart.item_count);
      
      // Trigger cart:updated event
      document.dispatchEvent(new CustomEvent('cart:updated', {
        detail: { cart: cart }
      }));
    })
    .catch(error => {
      console.error('Error updating cart:', error);
    });
  }

  /**
   * Fetches current cart count from Shopify Cart API
   */
  function fetchCartCount() {
    fetch('/cart.js')
      .then(response => response.json())
      .then(cart => {
        updateCartCount(cart.item_count);
      })
      .catch(error => {
        console.error('Error fetching cart:', error);
      });
  }

  /**
   * Updates the cart count indicator in the header.
   * @param {number} count - The new item count.
   */
  function updateCartCount(count) {
    const cartCountElement = document.querySelector(SELECTORS.cartCount);
    if (cartCountElement) {
      cartCountElement.textContent = count;
      cartCountElement.classList.toggle('empty', count === 0);
    }
  }

  /**
   * Initializes hover/focus behaviour for desktop dropdown menus.
   */
  function initDesktopDropdowns() {
    const navItems = document.querySelectorAll(SELECTORS.navItemHasDropdown);
    
    if (navItems.length === 0) {
      console.warn('No dropdown menu items found. Check your nav structure and CSS classes.');
      return;
    }

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
    });
  }

  /**
   * Initializes the glitch text effect.
   * This is a basic example; customize as needed.
   */
  function initGlitchEffect() {
    const elements = document.querySelectorAll(SELECTORS.glitchTextElements);
    
    if (elements.length === 0) {
      console.warn('No glitch text elements found. Check your HTML and CSS classes.');
      return;
    }
    
    const header = document.querySelector(SELECTORS.header);
    const glitchIntensity = header?.dataset?.glitchLevel || 'medium'; // Get from header or default

    elements.forEach(el => {
      const originalText = el.dataset.text || el.textContent;
      el.setAttribute('data-text', originalText); // Ensure data-text is set

      // Implement glitch effect based on intensity
      switch (glitchIntensity) {
        case 'none':
          // No JavaScript effect, rely on CSS only
          break;
          
        case 'light':
          // Occasional subtle glitch
          setInterval(() => {
            if (Math.random() > 0.95) { // 5% chance
              applyGlitchEffect(el, originalText, 1);
            }
          }, 5000); // Check every 5 seconds
          break;
          
        case 'medium':
          // More frequent moderate glitch
          setInterval(() => {
            if (Math.random() > 0.85) { // 15% chance
              applyGlitchEffect(el, originalText, 2);
            }
          }, 3000); // Check every 3 seconds
          break;
          
        case 'heavy':
          // Frequent intense glitch
          setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance
              applyGlitchEffect(el, originalText, 3);
            }
          }, 2000); // Check every 2 seconds
          break;
      }
    });

    console.log(`Glitch effect initialized with level: ${glitchIntensity}`);
  }
  
  /**
   * Apply glitch effect to an element
   * @param {HTMLElement} element - The element to apply the effect to
   * @param {string} originalText - The original text content
   * @param {number} intensity - The glitch intensity (1-3)
   */
  function applyGlitchEffect(element, originalText, intensity) {
    // Save original content
    const originalContent = element.innerHTML;
    
    // Apply visual class
    element.classList.add(CLASSES.glitchActive);
    
    // For text nodes, we can shuffle the text
    if (element.childElementCount === 0) {
      element.textContent = shuffleText(originalText, intensity);
    }
    
    // Schedule multiple flickers for a more realistic effect
    const flickerCount = intensity;
    let flickersDone = 0;
    
    const flicker = () => {
      // Toggle visibility or apply another visual effect
      element.style.opacity = Math.random() > 0.5 ? '0.8' : '1';
      
      flickersDone++;
      if (flickersDone < flickerCount) {
        setTimeout(flicker, Math.random() * 50 + 20);
      } else {
        // Restore original state
        setTimeout(() => {
          element.classList.remove(CLASSES.glitchActive);
          element.style.opacity = '1';
          if (element.childElementCount === 0) {
            element.innerHTML = originalContent;
          }
        }, Math.random() * 100 + 50);
      }
    };
    
    // Start the flicker effect
    flicker();
  }

  // Helper for JS glitch example
  function shuffleText(text, intensity) {
    const chars = '!<>-_\\/[]{}—=+*^?#________'; // Characters to inject
    let shuffled = '';
    
    // Adjust probability based on intensity
    const glitchProbability = 0.6 + (intensity * 0.1); // 0.7, 0.8, or 0.9
    
    for (let i = 0; i < text.length; i++) {
      shuffled += Math.random() > glitchProbability ? 
        chars.charAt(Math.floor(Math.random() * chars.length)) : 
        text[i];
    }
    return shuffled;
  }
  
  /**
   * Initializes footer-specific interactions
   * @param {HTMLElement} footer - The footer element
   */
  function initFooterInteractions(footer) {
    // Mobile footer accordion functionality
    const headings = footer.querySelectorAll('.footer-heading');
    const mobileBreakpoint = 768;
    
    headings.forEach(heading => {
      heading.addEventListener('click', () => {
        if (window.innerWidth < mobileBreakpoint) {
          const content = heading.nextElementSibling;
          if (content) {
            const isExpanded = heading.getAttribute('aria-expanded') === 'true';
            heading.setAttribute('aria-expanded', !isExpanded);
            content.style.maxHeight = isExpanded ? null : `${content.scrollHeight}px`;
          }
        }
      });
    });
    
    // Newsletter form validation
    const form = footer.querySelector(SELECTORS.newsletterForm);
    if (form) {
      form.addEventListener('submit', (event) => {
        const emailInput = form.querySelector('input[type="email"]');
        if (emailInput && !validateEmail(emailInput.value)) {
          event.preventDefault();
          showFormError(emailInput, 'Please enter a valid email address');
        }
      });
    }
  }
  
  /**
   * Validates an email address
   * @param {string} email - The email to validate
   * @returns {boolean} Whether the email is valid
   */
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
  
  /**
   * Shows a form error
   * @param {HTMLElement} input - The input element
   * @param {string} message - The error message
   */
  function showFormError(input, message) {
    input.classList.add('error');
    
    // Create or update error message
    let errorEl = input.nextElementSibling;
    if (!errorEl || !errorEl.classList.contains('form-error')) {
      errorEl = document.createElement('div');
      errorEl.classList.add('form-error');
      input.parentNode.insertBefore(errorEl, input.nextSibling);
    }
    
    errorEl.textContent = message;
    
    // Clear error on input change
    input.addEventListener('input', () => {
      input.classList.remove('error');
      if (errorEl) {
        errorEl.textContent = '';
      }
    }, { once: true });
  }
// --- Announcement Matrix Logic --- //
// Make sure this runs after the DOM is ready, e.g., inside
// document.addEventListener('DOMContentLoaded', () => { ... });
// or your theme's existing JS initialization structure.

class AnnouncementMatrix {
  constructor(container) {
    // Accept the container element during instantiation
    if (!container) return;
    this.container = container;
    this.alerts = []; // Keep track of active AnnouncementBar instances if needed
    this.dynamicEndpoint = '/apps/voidbloom-alerts'; // Or get from data attribute
    this.loadDynamic = this.container.dataset.loadDynamic === 'true';

    // Assumes AnnouncementBar class is defined elsewhere and accessible
    // This class would handle individual bar logic (expiration, dismiss, etc.)
    // Example: import AnnouncementBar from './announcement-bar.js';

    this.init();
  }

  init() {
    // Register any alerts already rendered by Liquid server-side
    this.container.querySelectorAll('[data-announcement-bar]').forEach(el => {
      this.registerAlert(el);
    });

    // Only fetch dynamic alerts if the setting is enabled
    if (this.loadDynamic) {
      this.loadDynamicAlerts();
    }

    // Optional: Observe for future DOM additions if needed,
    // but usually dynamic ones come from the fetch.
    // this.observeMutations();
  }

  registerAlert(element) {
     // Check if AnnouncementBar class exists before trying to use it
     if (typeof AnnouncementBar !== 'undefined') {
        try {
            const alertInstance = new AnnouncementBar(element);
            this.alerts.push(alertInstance);
        } catch (e) {
            console.error("Failed to initialize AnnouncementBar for element:", element, e);
        }
     } else {
        console.warn("AnnouncementBar class not found. Cannot register alert:", element);
     }
  }

  async loadDynamicAlerts() {
    try {
      const response = await fetch(this.dynamicEndpoint);
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Assuming the endpoint returns { alerts: [...] }
      // If it returns just the array, adjust accordingly
      const data = await response.json();
      const alerts = data.alerts || data; // Handle both object or array response

      if (Array.isArray(alerts)) {
        this.renderDynamicAlerts(alerts);
      } else {
        console.error('Dynamic alerts data is not an array:', alerts);
      }

    } catch (error) {
      console.error('Failed to load or parse dynamic alerts:', error);
      // Optionally display a user-facing error in the UI
    }
  }

  // --- CRITICAL FIX: Render HTML directly, DO NOT use Liquid render tag ---
  renderDynamicAlerts(alerts) {
    const fragment = document.createDocumentFragment(); // More efficient for multiple appends

    alerts.forEach((alertData, index) => {
      // We need to replicate the structure and content of 'announcement-card.liquid' here using JS
      // This is a simplified example - **You MUST adapt this** to match your actual snippet's HTML structure and data attributes

      const cardElement = document.createElement('div');
      // --- >> ** IMPORTANT: Adapt this element creation to match your snippet ** << ---
      cardElement.classList.add('announcement-card', 'dynamic-alert'); // Add appropriate classes
      cardElement.dataset.announcementBar = ''; // Add necessary data attributes
      cardElement.dataset.priority = alertData.priority || '0';
      if (alertData.expires) {
         cardElement.dataset.expires = alertData.expires;
      }
      // Add more data attributes as needed by AnnouncementBar class

      // Inner structure (Example - adapt to your snippet)
      const messageElement = document.createElement('p');
      messageElement.classList.add('announcement-message'); // Use classes from your snippet
      messageElement.textContent = alertData.message || ''; // Basic text content
      // If your snippet uses complex HTML/Liquid inside, replicate that structure here

      // Example: Apply pulse color if provided
      if (alertData.color) {
         cardElement.style.setProperty('--pulse-color', alertData.color); // Example CSS variable
      }
      // Add logic for glitch effect based on alertData.glitch if needed

      cardElement.appendChild(messageElement);
      // Append other elements (like close button if needed)

      // --- >> ** End of adaptation section ** << ---

      fragment.appendChild(cardElement);
    });

    this.container.appendChild(fragment);

    // After appending, register the new elements with the AnnouncementBar class
    this.container.querySelectorAll('.dynamic-alert:not([data-initialized])').forEach(newEl => {
       this.registerAlert(newEl);
       newEl.dataset.initialized = true; // Mark as initialized to avoid re-registering
    });
  }

  // Optional: Mutation observer if needed for non-fetch additions
  /*
  observeMutations() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach(node => {
          // Check if it's the correct element and not already initialized
          if (node.nodeType === Node.ELEMENT_NODE && node.matches?.('[data-announcement-bar]:not([data-initialized])')) {
             console.log('Registering mutated alert:', node);
             this.registerAlert(node);
             node.dataset.initialized = true;
          }
        });
      });
    });
    observer.observe(this.container, { childList: true });
  }
  */
}

// --- Initialization ---
// Find all matrix containers on the page (in case section is added multiple times)
// and initialize each one.
document.querySelectorAll('[data-announcement-matrix]').forEach(container => {
  new AnnouncementMatrix(container);
});

// --- End Announcement Matrix Logic --- //
  // --- Initialization ---

  // Wait for the DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    // DOMContentLoaded has already fired
    initTheme();
  }

})(); // End IIFE