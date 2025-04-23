// scripts/lazy-quantum.js
/**
 * Lazy-loads quantum visualization components using Intersection Observer
 * or requestIdleCallback for optimal performance.
 *
 * This implements the VoidBloom Theme Audit requirement to defer quantum
 * initialization until the user needs it.
 */

// Feature detection for modern browser APIs
const supportsIntersectionObserver = 'IntersectionObserver' in window;
const supportsIdleCallback = 'requestIdleCallback' in window;

// Default options that can be overridden
const defaultOptions = {
  rootMargin: '200px 0px', // Load when within 200px of viewport
  threshold: 0.01, // Start loading when 1% visible
  idleTimeout: 3000, // 3 second timeout for requestIdleCallback
  useIdleCallback: true, // Use requestIdleCallback if available
  loadingClass: 'vb-quantum-loading',
  loadedClass: 'vb-quantum-loaded',
  idleOnly: false, // If true, only load during idle periods
};

/**
 * Lazy loads a quantum visualization component
 * @param {string|Element} selector - CSS selector or DOM element
 * @param {Function} loaderFunction - Function to call when element should be loaded
 * @param {Object} options - Optional configuration
 */
function lazyLoadQuantum(selector, loaderFunction, options = {}) {
  // Merge default options with provided options
  const config = { ...defaultOptions, ...options };

  // Get elements to observe
  const elements =
    typeof selector === 'string' ? Array.from(document.querySelectorAll(selector)) : [selector];

  if (elements.length === 0) {
    console.debug('No quantum elements found to lazy load');
    return;
  }

  // Function to actually load the quantum element
  const loadElement = (element) => {
    // Add loading class
    element.classList.add(config.loadingClass);

    // Function to execute when we want to load
    const executeLoad = () => {
      try {
        loaderFunction(element);
        element.classList.remove(config.loadingClass);
        element.classList.add(config.loadedClass);
        element.dataset.quantumLoaded = 'true';
      } catch (error) {
        console.error('Error initializing quantum component:', error);
        element.classList.remove(config.loadingClass);
        element.dataset.quantumError = error.message;
      }
    };

    // Use requestIdleCallback if available and desired
    if (supportsIdleCallback && config.useIdleCallback) {
      requestIdleCallback(() => executeLoad(), { timeout: config.idleTimeout });
    } else {
      // Fall back to setTimeout with a minimal delay
      setTimeout(executeLoad, 10);
    }
  };

  // If we're in an environment without IntersectionObserver or we only want idle loading
  if (!supportsIntersectionObserver || config.idleOnly) {
    if (supportsIdleCallback) {
      elements.forEach((element) => {
        requestIdleCallback(() => loadElement(element), { timeout: config.idleTimeout });
      });
    } else {
      // If no idle callback, stagger loading with setTimeout
      elements.forEach((element, index) => {
        setTimeout(() => loadElement(element), 100 * index);
      });
    }
    return;
  }

  // Create an intersection observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadElement(entry.target);
          observer.unobserve(entry.target); // Stop observing once loaded
        }
      });
    },
    {
      rootMargin: config.rootMargin,
      threshold: config.threshold,
    }
  );

  // Start observing elements
  elements.forEach((element) => {
    // Skip already loaded elements
    if (element.dataset.quantumLoaded === 'true') {
      return;
    }

    observer.observe(element);
  });

  return {
    observer,
    forceLoad: () => elements.forEach(loadElement),
  };
}

/**
 * Initialize quantum visualizer components with lazy loading
 */
function initQuantumVisualizers() {
  // Check for quantum visualizer components on the page
  const quantumElements = document.querySelectorAll(
    '.quantum-visualizer, [data-quantum-visualizer]'
  );

  if (quantumElements.length === 0) {
    return;
  }

  // Import the quantum visualizer dynamically
  lazyLoadQuantum(quantumElements, (element) => {
    import(/* webpackChunkName: "quantum-visualizer" */ '../assets/quantum-visualizer.js')
      .then((module) => {
        const QuantumVisualizer = module.default || module;
        new QuantumVisualizer(element, JSON.parse(element.dataset.options || '{}'));
      })
      .catch((error) => {
        console.error('Failed to load quantum visualizer:', error);
        element.dataset.quantumError = error.message;
      });
  });
}

/**
 * Initialize quantum holograms with lazy loading
 */
function initQuantumHolograms() {
  const hologramElements = document.querySelectorAll('.quantum-hologram, [data-quantum-hologram]');

  if (hologramElements.length === 0) {
    return;
  }

  // Import the hologram component dynamically
  lazyLoadQuantum(
    hologramElements,
    (element) => {
      // Start by dynamically importing Three.js
      import(/* webpackChunkName: "three" */ 'three')
        .then(() =>
          import(/* webpackChunkName: "hologram-component" */ '../assets/HologramComponent.js')
        )
        .then((module) => {
          const HologramComponent = module.default || module;
          new HologramComponent(element, JSON.parse(element.dataset.options || '{}'));
        })
        .catch((error) => {
          console.error('Failed to load hologram component:', error);
          element.dataset.quantumError = error.message;
        });
    },
    {
      rootMargin: '300px 0px', // Load holograms from further away
    }
  );
}

// Make functions available globally
window.VoidBloom = window.VoidBloom || {};
window.VoidBloom.lazyLoadQuantum = lazyLoadQuantum;
window.VoidBloom.initQuantumVisualizers = initQuantumVisualizers;
window.VoidBloom.initQuantumHolograms = initQuantumHolograms;

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initQuantumVisualizers();
  initQuantumHolograms();
});

// Export for module usage
export { initQuantumHolograms, initQuantumVisualizers, lazyLoadQuantum };
