/**
 * Hologram Component System
 * Manages holographic projections of products in the memory space
 * @version 3.1.0
 */

// Use global NeuralBus with fallback for module import
let NeuralBus;

class HologramSystem {
  constructor() {
    this.projections = [];
    this.intensity = 0.5;
    this.recursiveDepth = 3;
    this.initialized = false;

    // Get NeuralBus reference
    if (typeof window.NeuralBus !== 'undefined') {
      NeuralBus = window.NeuralBus;
    }
  }

  initialize() {
    if (this.initialized) return this;

    console.log('Initializing hologram system');

    // Register with NeuralBus if available
    if (NeuralBus && NeuralBus.registerSystem) {
      NeuralBus.registerSystem('hologram', this);

      // Subscribe to relevant events
      this._subscribeToEvents();
    } else {
      console.warn('NeuralBus not available for hologram system registration');
    }

    // Initialize hologram containers in the DOM
    this._initializeHologramContainers();

    this.initialized = true;
    return this;
  }

  _subscribeToEvents() {
    // Subscribe only if NeuralBus is available
    if (!NeuralBus || !NeuralBus.subscribe) return;

    NeuralBus.subscribe('product:view', this._handleProductView.bind(this));
    NeuralBus.subscribe('trauma:activated', this._handleTraumaActivation.bind(this));
  }

  _initializeHologramContainers() {
    // Find product containers to enhance
    const productContainers = document.querySelectorAll('.product-card, [data-hologram-container]');

    productContainers.forEach((container, index) => {
      // Enhance container with hologram capabilities
      container.setAttribute('data-hologram-index', index);
      container.classList.add('hologram-enhanced');

      // Set up hover interactions
      container.addEventListener('mouseenter', () => {
        this._activateHologram(index);
      });

      container.addEventListener('mouseleave', () => {
        this._deactivateHologram(index);
      });

      // Create projection data
      this.projections.push({
        index,
        active: false,
        element: container,
        intensity: Math.random() * 0.3 + 0.3,
        lastActive: 0,
      });
    });
  }

  _activateHologram(index) {
    const projection = this.projections[index];
    if (!projection) return;

    projection.active = true;
    projection.lastActive = Date.now();
    projection.element.classList.add('hologram-active');

    // Notify NeuralBus if available
    if (NeuralBus && NeuralBus.publish) {
      NeuralBus.publish('hologram:activated', {
        index,
        element: projection.element,
        intensity: projection.intensity,
        timestamp: Date.now(),
      });
    }
  }

  _deactivateHologram(index) {
    const projection = this.projections[index];
    if (!projection) return;

    projection.active = false;
    projection.element.classList.remove('hologram-active');

    // Notify NeuralBus if available
    if (NeuralBus && NeuralBus.publish) {
      NeuralBus.publish('hologram:deactivated', {
        index,
        element: projection.element,
        duration: Date.now() - projection.lastActive,
        timestamp: Date.now(),
      });
    }
  }

  _handleProductView(data) {
    // Handle product view events from neural bus
    console.log('Product view event received', data);

    // Find the product in our projections
    const projection = this.projections.find(
      (p) => p.element.getAttribute('data-product-id') === data.productId
    );

    if (projection) {
      this._activateHologram(projection.index);
    }
  }

  _handleTraumaActivation(data) {
    // Apply trauma effects to holograms
    if (typeof data.intensity === 'number') {
      this.intensity = data.intensity;

      // Apply to all projections
      this.projections.forEach((projection) => {
        const el = projection.element;
        el.style.setProperty('--hologram-trauma', this.intensity.toString());
      });
    }
  }
}

// Initialize and export
const hologramSystem = new HologramSystem();

// CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { hologramSystem };
}

// AMD
if (typeof define === 'function' && define.amd) {
  define([], function () {
    return { hologramSystem };
  });
}

// Global variable
if (typeof window !== 'undefined') {
  window.hologramSystem = hologramSystem;
}

// ES Module export
export { hologramSystem };
