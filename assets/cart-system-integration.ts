/**
 * CART-SYSTEM-INTEGRATION.TS
 * Integration of cart system with extensions
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * @Version: 3.0.0
 */

import { CartCore } from './core/cart-core';
import { HolographicExtension } from './core/holographic-extension';
import { QuantumEffectsExtension } from './core/quantum-effects-extension';

/**
 * Initialize the CyberCore cart system with extensions
 */
export function initializeCartSystem(options = {}) {
  // Initialize core cart system
  const cart = CartCore.initialize({
    debug: options.debug || window.location.search.includes('debug=true'),
    neuralSynced: true,
    // Other configuration options can be passed here
    ...options,
  });

  // Register extensions
  if (options.useHolographicPreviews !== false) {
    CartCore.registerExtension(new HolographicExtension());
  }

  if (options.useQuantumEffects !== false) {
    CartCore.registerExtension(new QuantumEffectsExtension());
  }

  // Allow for third-party extensions
  if (options.extensions && Array.isArray(options.extensions)) {
    options.extensions.forEach((extension) => {
      CartCore.registerExtension(extension);
    });
  }

  return cart;
}

// Auto-initialize if in browser and not explicitly disabled
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    const shouldInit =
      !window.location.search.includes('disable-cart-system') &&
      document.body.dataset.cartSystem !== 'disabled';

    if (shouldInit) {
      const profile = document.body.dataset.profile || 'CyberLotus';

      initializeCartSystem({
        debug: window.location.search.includes('debug=true'),
        profile: profile,
        useHolographicPreviews: document.body.dataset.holographicPreviews !== 'disabled',
        useQuantumEffects: document.body.dataset.quantumEffects !== 'disabled',
      });

      // Expose to global scope
      (window as any).CartSystem = CartCore;
    }
  });
}

export default initializeCartSystem;
