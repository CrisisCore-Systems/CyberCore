/**
 * VoidBloom Ritual Engine
 * VERSION: 3.8.5
 *
 * Initiates users into the trauma encoding framework through
 * calibrated experience mapping and coherence anchoring
 */

/**
 * @typedef {Object} ShopifyData
 * @property {Object} [shop] - Information about the Shopify shop
 * @property {string} [shop.name] - Name of the shop
 * @property {string} [shop.description] - Shop description
 * @property {string} [shop.domain] - Shop domain
 * @property {Object} [customer] - Information about the customer, if logged in
 * @property {number} [customer.id] - Customer ID
 * @property {string} [customer.firstName] - Customer first name
 * @property {CustomerMetafields} [customer.metafields] - Customer metafields
 * @property {Object} [cart] - Current cart data
 */

/**
 * @typedef {Object} CustomerMetafields
 * @property {Object} [voidbloom_memory_protected] - Voidbloom memory protected metafield
 * @property {string} [voidbloom_memory_protected.state] - State of the voidbloom memory
 */

/**
 * @typedef {Object} ShopifyCustomer
 * @property {number} [id] - Customer ID
 * @property {string} [firstName] - Customer first name
 * @property {CustomerMetafields} [metafields] - Customer metafields
 */

/**
 * @typedef {Object} ShopifyShop
 * @property {string} [name] - Name of the shop
 * @property {string} [description] - Shop description
 * @property {string} [domain] - Shop domain
 */

/**
 * @typedef {Object} TraumaResponse
 * @property {string} traumaType - Type of trauma
 * @property {number} value - Value or intensity of the trauma response
 */

/**
 * @typedef {Object} AssessmentVector
 * @property {number} weight - Weight of this vector
 * @property {TraumaResponse[]} responses - Responses for this vector
 */

/**
 * @typedef {HTMLElement} ContainerElement - Container element for ritual phases
 */

// Declare global Window extensions for TypeScript compatibility
/**
 * @typedef {Object} ShopifyWindow
 * @property {Object} shopifyData - Data from Shopify
 * @property {Object} voidBloom - VoidBloom namespace
 * @property {RitualEngine} voidBloom.ritualEngine - Ritual engine instance
 */

/**
 * Extend Window interface for TypeScript
 * @typedef {Window & ShopifyWindow} ExtendedWindow
 */

// Declare global window to use custom properties
/** @type {ExtendedWindow} */
const globalWindow = window;

// Declare NeuralBus for TypeScript compatibility
/** @type {any} */
let NeuralBus;

/**
 * RitualEngine - Animation and interaction system for VoidBloom
 */
window.RitualEngine = {
  initialize: function () {
    this.effects = {};
    this.eventHandlers = {};

    // Register with NeuralBus if available
    if (window.NeuralBus) {
      window.NeuralBus.register('ritual-engine', {
        version: '1.0.0',
        capabilities: ['animations', 'interactions', 'trauma-response'],
      });
    }

    this.setupEventListeners();
    console.log('RitualEngine initialized');
    return this;
  },

  setupEventListeners: function () {
    // Track scroll for scroll-based effects
    window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });

    // Track viewport intersection
    this.setupIntersectionObserver();
  },

  setupIntersectionObserver: function () {
    if (!('IntersectionObserver' in window)) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.triggerEntryAnimation(entry.target);
          }
        });
      },
      {
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    // Observe elements with data-ritual attribute
    document.querySelectorAll('[data-ritual]').forEach((el) => {
      this.observer.observe(el);
    });
  },

  triggerEntryAnimation: function (element) {
    const ritualType = element.getAttribute('data-ritual');
    element.classList.add('ritual-active');

    if (window.NeuralBus) {
      window.NeuralBus.publish('ritual:triggered', {
        element: element,
        ritualType: ritualType,
      });
    }
  },

  handleScroll: function () {
    // Adjust effect intensities based on scroll position
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollY / docHeight;

    document.documentElement.style.setProperty('--scroll-percent', scrollPercent);

    if (window.NeuralBus) {
      window.NeuralBus.publish('scroll:update', {
        scrollY: scrollY,
        scrollPercent: scrollPercent,
      });
    }
  },

  createGlitchEffect: function (element, options) {
    const id = 'glitch-' + Math.random().toString(36).substr(2, 9);

    this.effects[id] = {
      element: element,
      type: 'glitch',
      intensity: options.intensity || 0.5,
      traumaType: options.traumaType || 'recursion',
    };

    element.setAttribute('data-effect-id', id);
    element.classList.add('glitch-effect', `trauma-${this.effects[id].traumaType}`);

    return {
      update: (newOptions) => {
        if (newOptions.intensity) this.effects[id].intensity = newOptions.intensity;
        if (newOptions.traumaType) {
          element.classList.remove(`trauma-${this.effects[id].traumaType}`);
          this.effects[id].traumaType = newOptions.traumaType;
          element.classList.add(`trauma-${newOptions.traumaType}`);
        }
      },
      destroy: () => {
        element.classList.remove('glitch-effect', `trauma-${this.effects[id].traumaType}`);
        delete this.effects[id];
      },
    };
  },
};

document.addEventListener('DOMContentLoaded', function () {
  window.RitualEngine.initialize();
});
