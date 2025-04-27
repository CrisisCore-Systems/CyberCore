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
  rootMargin: '500px 0px', // Load when within 500px of viewport (increased margin)
  threshold: 0.01, // Start loading when 1% visible
  idleTimeout: 5000, // 5 second timeout for requestIdleCallback (increased for lower priority)
  useIdleCallback: true, // Use requestIdleCallback if available
  loadingClass: 'vb-quantum-loading',
  loadedClass: 'vb-quantum-loaded',
  idleOnly: false, // If true, only load during idle periods
  maxConcurrentLoads: 2, // Limit concurrent loads to prevent excessive CPU usage
};

// Track current loads to limit them
let currentLoads = 0;
let pendingLoads = [];

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
    // Skip if already loaded or loading
    if (
      element.dataset.quantumLoaded === 'true' ||
      element.classList.contains(config.loadingClass)
    ) {
      return;
    }

    // Check if we've exceeded concurrent load limit
    if (currentLoads >= config.maxConcurrentLoads) {
      // Queue this element for later
      pendingLoads.push(element);
      return;
    }

    // Track current loading count
    currentLoads++;

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
      } finally {
        // Decrement current load count
        currentLoads--;

        // Check if we can process any pending loads
        if (pendingLoads.length > 0 && currentLoads < config.maxConcurrentLoads) {
          const nextElement = pendingLoads.shift();
          loadElement(nextElement);
        }
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
        setTimeout(() => loadElement(element), 500 * index); // Increased delay for staggered loading
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
  lazyLoadQuantum(
    quantumElements,
    (element) => {
      // Only load if element is visible and user has interacted with page
      if (!document.hidden && window.hasUserInteraction) {
        import(/* webpackChunkName: "quantum-visualizer" */ '../assets/quantum-visualizer.js')
          .then((module) => {
            const QuantumVisualizer = module.default || module;
            new QuantumVisualizer(element, JSON.parse(element.dataset.options || '{}'));
          })
          .catch((error) => {
            console.error('Failed to load quantum visualizer:', error);
            element.dataset.quantumError = error.message;
          });
      } else {
        // Defer until user interacts
        const loadOnInteraction = () => {
          import(/* webpackChunkName: "quantum-visualizer" */ '../assets/quantum-visualizer.js')
            .then((module) => {
              const QuantumVisualizer = module.default || module;
              new QuantumVisualizer(element, JSON.parse(element.dataset.options || '{}'));
            })
            .catch((error) => {
              console.error('Failed to load quantum visualizer:', error);
              element.dataset.quantumError = error.message;
            });
          window.removeEventListener('click', loadOnInteraction);
        };
        window.addEventListener('click', loadOnInteraction, { once: true });
      }
    },
    {
      rootMargin: '300px 0px',
      idleOnly: true, // Only load during idle time
      useIdleCallback: true,
    }
  );
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
      // First check if we need the hologram at all based on performance
      if (window.voidbloomPerformance && window.voidbloomPerformance.settings.lowPerformanceMode) {
        // Skip 3D holograms on low-performance devices
        if (!element.hasAttribute('data-priority-effect')) {
          console.log('Skipping hologram in low performance mode');
          return;
        }
      }

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
      rootMargin: '300px 0px', // Load holograms when closer to viewport
      idleOnly: true, // Only load during idle periods
      useIdleCallback: true,
    }
  );
}

// Track user interaction for better load decisions
window.hasUserInteraction = false;
['click', 'scroll', 'keydown'].forEach((event) => {
  window.addEventListener(
    event,
    () => {
      window.hasUserInteraction = true;
    },
    { once: true }
  );
});

// Make functions available globally
window.VoidBloom = window.VoidBloom || {};
window.VoidBloom.lazyLoadQuantum = lazyLoadQuantum;
window.VoidBloom.initQuantumVisualizers = initQuantumVisualizers;
window.VoidBloom.initQuantumHolograms = initQuantumHolograms;

// Auto-initialize on page load, but delay to prioritize critical content
document.addEventListener('DOMContentLoaded', () => {
  // Delay initialization to improve initial load performance
  setTimeout(() => {
    // Only initialize if the page has been visible for a while
    if (!document.hidden) {
      initQuantumVisualizers();
    }
  }, 2000); // 2 second delay

  // Further delay the hologram initialization
  setTimeout(() => {
    if (!document.hidden) {
      initQuantumHolograms();
    }
  }, 5000); // 5 second delay
});

// Export for module usage
export { initQuantumHolograms, initQuantumVisualizers, lazyLoadQuantum };
