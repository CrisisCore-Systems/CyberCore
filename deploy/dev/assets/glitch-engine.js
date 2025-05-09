/**
 * GLITCH-ENGINE.JS
 * Unified visual glitch engine with WebGL and CSS effects
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * @Version: 4.0.0
 */
// Generated by CyberCore Neural Forge v3.0.0 //

/**
 * This file serves as an entry point to the unified TypeScript implementation
 * in the core directory. It exposes the same API to maintain backward compatibility
 * while leveraging the enhanced unified implementation.
 */
(function () {
  const isBrowser = typeof window !== 'undefined';

  // Import the unified implementation as a module when using webpack/bundlers
  if (typeof module !== 'undefined' && module.exports) {
    // In a module environment, we export the TypeScript implementation
    module.exports = require('./core/glitch-engine');
  }

  // In a browser environment with no module system, the TypeScript bundle will
  // already have exposed GlitchEngine on the window object, so we don't need
  // to do anything special here. The unified implementation already provides
  // backward compatibility by exposing both static and instance methods.

  // Apply Canvas2D optimization for willReadFrequently if not already applied
  // This maintains compatibility with the original implementation
  if (
    isBrowser &&
    typeof HTMLCanvasElement !== 'undefined' &&
    !HTMLCanvasElement.prototype.__willReadFrequentlyPatched
  ) {
    try {
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, options) {
        if (type === '2d') {
          // Preserve existing options and add/override willReadFrequently
          const mergedOptions = { ...options, willReadFrequently: true };
          return originalGetContext.call(this, type, mergedOptions);
        }
        return originalGetContext.call(this, type, options);
      };
      HTMLCanvasElement.prototype.__willReadFrequentlyPatched = true;
      console.log('Applied Canvas2D willReadFrequently optimization patch');
    } catch (e) {
      console.warn('Failed to apply Canvas2D optimization patch', e);
    }
  }

  // Notify initialization in console for debugging
  if (isBrowser && window.console && window.console.log) {
    console.log(
      'Glitch Engine 4.0.0 initialized with unified implementation (WebGL + CSS effects)'
    );
  }
})();
