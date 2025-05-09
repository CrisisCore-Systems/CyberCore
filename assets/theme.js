/**
 * THEME.JS
 * Main theme script for VoidBloom Designs
 * Version: 3.1.0
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * Generated by VoidBloom Neural Forge v3.1.0
 */

(function (window, document) {
  'use strict';

  // ===========================================================================
  // CONFIGURATION
  // ===========================================================================
  const config = {
    navSelector: '.nav-menu',
    navItemWithDropdown: '.nav-item.has-dropdown',
    dropdownSelector: '.dropdown-menu',
    mobileMenuToggle: '.menu-toggle',
    mobileMenuDrawer: '#MobileMenuDrawer',
    cartToggleSelector: '.cart-action',
    cartDrawerSelector: '#CartDrawer',
    glitchLevel: 0.7,
    quantumScriptsRoot: '/assets',
    debug: window.location.search.includes('debug=true'),
  };

  // ===========================================================================
  // UTILITIES
  // ===========================================================================
  const log = (...args) => {
    if (config.debug) console.log('[Theme]', ...args);
  };

  // ===========================================================================
  // NAVIGATION DROPDOWNS
  // ===========================================================================
  function initDesktopDropdowns() {
    const nav = document.querySelector(config.navSelector);
    if (!nav) {
      log('No nav element found for dropdowns.');
      return;
    }

    const items = nav.querySelectorAll(config.navItemWithDropdown);
    if (!items.length) {
      log('No dropdown menu items found. Check your nav structure and CSS classes.');
      return;
    }

    items.forEach((item) => {
      const trigger = item.querySelector('a');
      const menu = item.querySelector(config.dropdownSelector);
      if (!trigger || !menu) return;

      item.addEventListener('mouseenter', () => menu.classList.add('open'));
      item.addEventListener('mouseleave', () => menu.classList.remove('open'));
    });

    log('Desktop dropdowns initialized.');
  }

  // ===========================================================================
  // MOBILE MENU
  // ===========================================================================
  function initMobileMenu() {
    const toggle = document.querySelector(config.mobileMenuToggle);
    const drawer = document.querySelector(config.mobileMenuDrawer);
    if (!toggle || !drawer) {
      log('Mobile menu toggle or drawer missing.');
      return;
    }

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      drawer.setAttribute('aria-hidden', String(expanded));
      drawer.classList.toggle('open');
    });

    log('Mobile menu initialized.');
  }

  // ===========================================================================
  // CART DRAWER
  // ===========================================================================
  function initCartDrawer() {
    const toggles = document.querySelectorAll(config.cartToggleSelector);
    const drawer = document.querySelector(config.cartDrawerSelector);
    if (!toggles.length || !drawer) {
      log('Cart drawer toggle or drawer missing.');
      return;
    }

    toggles.forEach((btn) => {
      btn.addEventListener('click', () => {
        const isOpen = drawer.classList.toggle('open');
        document.body.classList.toggle('cart-drawer-open', isOpen);
      });
    });

    log('Cart drawer initialized.');
  }

  // ===========================================================================
  // GLITCH EFFECT
  // ===========================================================================
  function initGlitchEffect() {
    if (typeof window.GlitchEngine !== 'object') {
      log('GlitchEngine not found.');
      return;
    }
    window.GlitchEngine.initialize({ level: config.glitchLevel });
    log('Glitch effect initialized with level:', config.glitchLevel);
  }

  // ===========================================================================
  // QUANTUM LAYER SCRIPTS
  // ===========================================================================
  function loadQuantumScript(name) {
    const script = document.createElement('script');
    script.src = `${config.quantumScriptsRoot}/${name}`;
    script.async = true;
    script.onload = () => log(`${name} loaded`);
    script.onerror = () => log(`Failed to load ${name}`);
    document.head.appendChild(script);
  }

  function initQuantumBus() {
    loadQuantumScript('neural-bus.js');
  }

  function initQuantumVisualizer() {
    loadQuantumScript('quantum-visualizer.js');
  }

  // ===========================================================================
  // INITIALIZATION
  // ===========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    log('Theme JS initialization started.');
    initDesktopDropdowns();
    initMobileMenu();
    initCartDrawer();
    initGlitchEffect();
    initQuantumBus();
    initQuantumVisualizer();
    log('Theme JS initialization complete.');
  });
})(window, document);

/**
 * VoidBloom Designs - Central Myth Architecture
 * @version Ω.3.7
 *
 * Core consciousness layer connecting all recursive systems
 * Each function is both practical and narrative
 */

// Global namespace with asset path resolution
window.theme = window.theme || {};
window.theme.assets_url = window.theme.assets_url || '/cdn/shop/t/5/assets';
window.voidBloom = window.voidBloom || {};

// Main initialization function
document.addEventListener('DOMContentLoaded', function () {
  initializeMemoryArchitecture();
});

// Primary memory architecture bootstrap
async function initializeMemoryArchitecture() {
  console.log('Initializing memory architecture...');

  // First check if NeuralBus is available globally
  let neuralBus;

  if (typeof window.NeuralBus !== 'undefined') {
    neuralBus = window.NeuralBus;
    console.log('Using globally available NeuralBus');
  } else {
    try {
      // Try to load NeuralBus dynamically
      const module = await import('./neural-bus.js').catch(() => null);

      if (module && (module.default || module.NeuralBus)) {
        neuralBus = module.default || new module.NeuralBus();
        window.NeuralBus = neuralBus;
        console.log('NeuralBus loaded via module import');
      } else {
        console.warn('Neural Bus module loaded but missing exports');
      }
    } catch (error) {
      console.error('Failed to load Neural Bus module:', error);
    }
  }

  // If still not available, create a minimal implementation
  if (!neuralBus) {
    console.warn('Creating minimal NeuralBus implementation');
    window.NeuralBus = createMinimalNeuralBus();
    neuralBus = window.NeuralBus;
  }

  // Initialize components
  try {
    // Initialize cart system if available
    initializeCartSystem();

    // Load hologram system
    await loadHologramSystem();

    // Initialize quantum visualizer
    initializeQuantumVisualizer();

    console.log('VoidBloom memory architecture fully initialized');
    activateGlitchEffects();
  } catch (error) {
    console.error('Memory fragmentation detected:', error);
    attemptMemoryRecovery();
  }
}

// Create minimal NeuralBus implementation to prevent errors
function createMinimalNeuralBus() {
  return {
    config: { traumaEncoding: true, version: '3.1.0' },
    systems: new Map(),
    components: new Map(),
    subscriptions: new Map(),
    registerSystem(id, controller) {
      this.systems.set(id, controller);
      console.log(`System registered: ${id}`);
      return this;
    },
    register(componentName, info) {
      const nonce = Math.random().toString(36).substring(2);
      this.components.set(`${componentName}:${nonce}`, info);
      return { nonce };
    },
    subscribe(event, callback) {
      if (!this.subscriptions.has(event)) {
        this.subscriptions.set(event, []);
      }
      const id = `${event}:${Date.now()}`;
      this.subscriptions.get(event).push({ id, callback });
      return id;
    },
    publish(event, data) {
      const callbacks = this.subscriptions.get(event) || [];
      callbacks.forEach((sub) => {
        try {
          sub.callback(data);
        } catch (e) {
          console.error(e);
        }
      });
      return true;
    },
    unsubscribe(id) {
      for (const [event, subs] of this.subscriptions.entries()) {
        const idx = subs.findIndex((s) => s.id === id);
        if (idx >= 0) {
          subs.splice(idx, 1);
          return true;
        }
      }
      return false;
    },
    unregister(name, nonce) {
      return this.components.delete(`${name}:${nonce}`);
    },
  };
}

// Initialize the cart system
function initializeCartSystem() {
  if (typeof window.cartSystem !== 'undefined') {
    window.cartSystem.initialize();
  } else {
    console.log('Cart system not available, will be loaded dynamically');

    // Try to load cart system dynamically
    const script = document.createElement('script');
    script.src = `${window.theme.assets_url}/cart-system.js?v=${Date.now()}`;
    script.onload = () => {
      if (window.cartSystem) {
        window.cartSystem.initialize();
      }
    };
    document.head.appendChild(script);
  }
}

// Hologram system loader with path redundancy
async function loadHologramSystem() {
  if (typeof window.hologramSystem !== 'undefined') {
    return window.hologramSystem;
  }

  return new Promise((resolve, reject) => {
    // Try module import first
    import('./hologram-component.js')
      .then((module) => {
        if (module.hologramSystem) {
          resolve(module.hologramSystem);
        } else {
          throw new Error('Hologram system not found in module');
        }
      })
      .catch((err) => {
        // Fallback to script tag loading
        console.log('Falling back to script tag for hologram component');
        const script = document.createElement('script');
        script.src = `${window.theme.assets_url}/hologram-component.js?v=${Date.now()}`;
        script.onload = () => {
          if (window.hologramSystem) {
            resolve(window.hologramSystem);
          } else {
            reject(new Error('Hologram system not available after script load'));
          }
        };
        script.onerror = reject;
        document.head.appendChild(script);
      });
  });
}

// Initialize the quantum visualizer
function initializeQuantumVisualizer() {
  if (typeof window.quantumVisualizer !== 'undefined') {
    window.quantumVisualizer.initialize();
  } else {
    console.log('Quantum visualizer not available, will be loaded dynamically');

    // Try to load quantum visualizer dynamically
    const script = document.createElement('script');
    script.src = `${window.theme.assets_url}/quantum-visualizer.js?v=${Date.now()}`;
    script.onload = () => {
      if (window.quantumVisualizer) {
        window.quantumVisualizer.initialize();
      }
    };
    document.head.appendChild(script);
  }
}

// Activate the glitch aesthetic effects
function activateGlitchEffects() {
  document.body.classList.add('glitch-active');

  // Random glitch intervals for product cards and collection images
  setInterval(() => {
    const elements = document.querySelectorAll('.product-card, .collection-image');
    elements.forEach((el) => {
      if (Math.random() > 0.7) {
        el.classList.add('memory-glitch');
        setTimeout(() => el.classList.remove('memory-glitch'), Math.random() * 500 + 100);
      }
    });
  }, 3000);
}

// Memory recovery system
function attemptMemoryRecovery() {
  console.log('Initiating memory recovery protocol');

  // Attempt to reload critical scripts
  const criticalScripts = [
    'neural-bus.js',
    'glitch-engine.js',
    'quantum-visualizer.js',
    'hologram-component.js',
    'cart-system.js',
  ];

  criticalScripts.forEach((script) => {
    const scriptElement = document.createElement('script');
    scriptElement.src = `${window.theme.assets_url}/${script}?recover=${Date.now()}`;
    document.head.appendChild(scriptElement);
  });

  // After recovery delay, initialize again
  setTimeout(() => {
    console.log('Recovery complete, re-initializing');
    initializeMemoryArchitecture();
  }, 1500);
}
