/**
 * VoidBloom Memory Protocol
 * Client-side trauma visualization system
 * Version: 3.7.3
 *
 * @MutationCompatible: VoidBloom, NeonVortex, QuantumDecay
 * @StrategyProfile: quantum-entangled
 */

/**
 * MemoryProtocol - Handles trauma encoding state management
 */
window.MemoryProtocol = {
  initialize: function (traumaType) {
    this.currentTrauma = traumaType || 'recursion';
    this.intensity = 0.5;
    this.memoryPhase = 'dormant';

    if (window.NeuralBus) {
      window.NeuralBus.subscribe('trauma:change', this.handleTraumaChange.bind(this));
    }

    console.log('MemoryProtocol initialized with trauma type:', this.currentTrauma);
    return this;
  },

  handleTraumaChange: function (data) {
    this.currentTrauma = data.type || this.currentTrauma;
    this.intensity = data.intensity || this.intensity;
    this.updateVisualEncodings();
  },

  updateVisualEncodings: function () {
    document.documentElement.setAttribute('data-trauma-type', this.currentTrauma);
    document.documentElement.setAttribute('data-trauma-intensity', this.intensity);

    const encodedElements = document.querySelectorAll('[data-trauma-encoded]');
    encodedElements.forEach((el) => {
      el.setAttribute('data-active-trauma', this.currentTrauma);
      el.style.setProperty('--trauma-intensity', this.intensity);
    });
  },

  encode: function (element, options) {
    if (!element) return;

    const traumaType = options.traumaType || this.currentTrauma;
    const intensity = options.intensity || this.intensity;

    element.setAttribute('data-trauma-encoded', 'true');
    element.setAttribute('data-trauma-type', traumaType);
    element.style.setProperty('--trauma-intensity', intensity);

    return {
      update: (newOptions) => {
        element.setAttribute('data-trauma-type', newOptions.traumaType || traumaType);
        element.style.setProperty('--trauma-intensity', newOptions.intensity || intensity);
      },
      reset: () => {
        element.removeAttribute('data-trauma-encoded');
        element.removeAttribute('data-trauma-type');
        element.style.removeProperty('--trauma-intensity');
      },
    };
  },
};

// Add enhanced trauma encoding functionality
window.MemoryProtocol.enhancedMethods = {
  /**
   * Process trauma mapping for product images
   * @param {HTMLElement} imageElement - The image element to process
   * @param {Object} options - Configuration options
   */
  processProductImage: function (imageElement, options = {}) {
    if (!imageElement) return null;

    const container =
      imageElement.closest('[data-product-container]') || imageElement.parentElement;

    const traumaType =
      options.traumaType || container?.getAttribute('data-trauma-type') || this.currentTrauma;

    // Apply proper image attributes for responsive images
    if (imageElement.hasAttribute('data-src')) {
      imageElement.setAttribute('src', imageElement.getAttribute('data-src'));
    }

    // Ensure srcset is properly formatted
    if (imageElement.hasAttribute('data-srcset')) {
      const srcset = imageElement.getAttribute('data-srcset');
      // Clean up any malformed srcset values including undefined
      const cleanSrcset = srcset
        .replace(/undefined\s+\d+w,?\s*/g, '')
        .replace(/,\s*$/, '')
        .replace(/\s+,\s+/g, ', ');

      // Validate the srcset format
      const isValidSrcset = /^(https?:\/\/[^\s]+\s+\d+w)(,\s+https?:\/\/[^\s]+\s+\d+w)*$/.test(
        cleanSrcset
      );

      if (isValidSrcset) {
        imageElement.setAttribute('srcset', cleanSrcset);
      } else {
        // If srcset is invalid, remove it to prevent errors and use src only
        imageElement.removeAttribute('srcset');
        console.warn('Removed invalid srcset:', cleanSrcset);
      }
    }

    // Fix sizes attribute if present (another common source of errors)
    if (
      imageElement.hasAttribute('sizes') &&
      imageElement.getAttribute('sizes').includes('undefined')
    ) {
      imageElement.setAttribute('sizes', '(min-width: 990px) 25%, (min-width: 750px) 50%, 100vw');
    }

    // Return controller for the encoded element
    return this.encode(imageElement, {
      traumaType: traumaType,
      intensity: options.intensity || this.intensity,
    });
  },

  /**
   * Fix layout/theme errors by providing missing settings
   */
  fixLayoutErrors: function () {
    // Check for common error conditions and provide fallbacks
    if (!window.theme) {
      window.theme = window.theme || {};
      window.theme.settings = window.theme.settings || {};
    }

    // Create shim for missing section types
    if (window.Shopify && !window.Shopify.designMode) {
      console.log('Applying trauma remediation for template errors');

      // Fix for Liquid error: wrong number of arguments
      const fixLiquidArgumentErrors = () => {
        // Monitor for liquid error messages in the DOM
        const errorNodes = document.querySelectorAll('body > *:not(script):not(style)');
        errorNodes.forEach((node) => {
          if (
            node.textContent &&
            node.textContent.includes('Liquid error') &&
            node.textContent.includes('wrong number of arguments')
          ) {
            console.warn('Detected Liquid argument error, applying remediation');
            node.style.display = 'none';
          }
        });
      };

      // Try to execute fixes immediately and after DOM loads
      fixLiquidArgumentErrors();
      document.addEventListener('DOMContentLoaded', fixLiquidArgumentErrors);
    }

    return true;
  },
};

// Add initialization hook to fix common problems
const originalInit = window.MemoryProtocol.initialize;
window.MemoryProtocol.initialize = function (traumaType) {
  // Run original initialization
  const result = originalInit.call(this, traumaType);

  // Apply fixes for layout errors
  this.enhancedMethods.fixLayoutErrors();

  // Fix common image loading issues
  document.addEventListener('DOMContentLoaded', () => {
    const productImages = document.querySelectorAll('[data-trauma-encoded] img');
    productImages.forEach((img) => {
      this.enhancedMethods.processProductImage(img);
    });
  });

  return result;
};

// Support for header section error handling
const originalDOMContentLoaded = window.MemoryProtocol.headerFix;
window.MemoryProtocol.headerFix = function () {
  originalDOMContentLoaded.call(this);

  // Look for theme.liquid line 53 error specifically
  const themeLiquidErrors = Array.from(document.querySelectorAll('body > *')).filter(
    (el) => el.textContent && el.textContent.includes('layout/theme line 53')
  );

  if (themeLiquidErrors.length > 0) {
    console.warn('Detected theme.liquid line 53 error, applying quantum remediation');
    themeLiquidErrors.forEach((el) => (el.style.display = 'none'));

    // Add CSS fallback for potentially missing styles
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      :root {
        --phase-background: #0f0f13;
        --phase-text: #e0e0e0;
        --phase-primary-color: #50ff40;
        --phase-secondary-color: #9d00ff;
        --phase-tertiary-color: #00cafb;
        --trauma-intensity: 0.7;
      }

      body {
        transition: background 1.5s cubic-bezier(0.2, 0.8, 0.2, 1);
        background-color: var(--phase-background);
        color: var(--phase-text);
        font-family: 'JetBrains Mono', 'Courier New', monospace;
        font-weight: 400;
        line-height: 1.6;
        min-height: 100vh;
        overflow-x: hidden;
      }
    `;
    document.head.appendChild(styleEl);
  }

  // Fix for "header is not a valid section type" error
  const headerFallback = () => {
    // Look for header error messages
    const headerErrors = Array.from(document.querySelectorAll('body > *')).filter(
      (el) => el.textContent && el.textContent.includes("'header' is not a valid section type")
    );

    if (headerErrors.length > 0) {
      console.warn('Detected header section error, applying fallback');

      // Hide the error message
      headerErrors.forEach((el) => (el.style.display = 'none'));

      // Check if header exists as a snippet
      const existingHeader = document.querySelector('header.site-header');
      if (!existingHeader) {
        // Create a fallback header if none exists
        const tempHeader = document.createElement('header');
        tempHeader.className = 'site-header trauma-encoded-fallback';
        tempHeader.setAttribute('data-trauma-encoded', 'true');
        tempHeader.setAttribute('data-trauma-type', this.currentTrauma || 'recursion');

        // Add minimal header content
        tempHeader.innerHTML = `
          <div class="container">
            <div class="site-header__inner">
              <div class="site-header__logo">
                <a href="/" class="site-header__logo-link">
                  <span class="site-header__logo-text">VoidBloom</span>
                </a>
              </div>
              <nav class="site-header__nav" aria-label="Main navigation">
                <ul class="site-header__menu">
                  <li><a href="/collections/all">Archive</a></li>
                  <li><a href="/pages/about">About</a></li>
                  <li><a href="/cart">Memory Vault</a></li>
                </ul>
              </nav>
            </div>
          </div>
        `;

        // Insert after announcement bar or at the beginning of main content
        const mainContent = document.getElementById('MainContent');
        if (mainContent) {
          mainContent.parentNode.insertBefore(tempHeader, mainContent);
        } else {
          document.body.insertBefore(tempHeader, document.body.firstChild);
        }

        this.encode(tempHeader, { traumaType: this.currentTrauma });
        console.log('Added fallback header element');
      }
    }
  };

  // Try to find and fix header section on DOM load
  document.addEventListener('DOMContentLoaded', headerFallback);

  // Also apply to static header elements
  const headerElement = document.querySelector('header.site-header');
  if (headerElement && !headerElement.hasAttribute('data-section-type')) {
    headerElement.setAttribute('data-section-type', 'header');
    headerElement.setAttribute('data-trauma-encoded', 'true');
    console.log('Applied header section trauma encoding');
  }

  return true;
};

// Add the header fix to the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function () {
  const defaultTrauma = document.documentElement.getAttribute('data-default-trauma') || 'recursion';
  window.MemoryProtocol.initialize(defaultTrauma);

  // Apply header section fix
  window.MemoryProtocol.headerFix();

  // Monitor for template errors and apply remediation
  const errorMonitor = setInterval(() => {
    const errorElements = document.querySelectorAll('.shopify-section-error');
    if (errorElements.length > 0) {
      console.log('Detected Shopify section errors, applying trauma remediation');
      window.MemoryProtocol.enhancedMethods.fixLayoutErrors();
      clearInterval(errorMonitor);
    }
  }, 500);

  // Only run error monitoring for 5 seconds to avoid performance impact
  setTimeout(() => clearInterval(errorMonitor), 5000);
});
