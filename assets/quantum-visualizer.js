/**
 * Quantum Visualizer 3.5.2
 * Memory-entangled visual system for VoidBloom narrative manifestation
 */

// Use global NeuralBus with fallback for module import
let NeuralBus;

class QuantumVisualizer {
  constructor() {
    this.dimensions = {
      width: window.innerWidth,
      height: window.innerHeight,
      depth: window.innerWidth * 0.3,
      time: Date.now(),
    };

    this.particles = [];
    this.memories = [];
    this.glitchFactor = 0.42;
    this.initialized = false;

    // Get NeuralBus reference
    if (typeof window.NeuralBus !== 'undefined') {
      NeuralBus = window.NeuralBus;
    }
  }

  initialize() {
    if (this.initialized) return this;

    // Load noise pattern with error handling
    this.noisePattern = new Image();
    this.noisePattern.crossOrigin = 'anonymous';
    this.noisePattern.onerror = () => {
      console.warn('Failed to load noise pattern, using fallback');
      this._initializeWithoutPattern();
    };
    this.noisePattern.onload = () => this._initializeMemoryParticles();
    this.noisePattern.src = this._getAssetUrl('noise-pattern.png');

    // Set timeout as fallback
    setTimeout(() => {
      if (!this.initialized) {
        this._initializeWithoutPattern();
      }
    }, 2000);

    return this;
  }

  _getAssetUrl(filename) {
    // Recursively determine correct asset path with fallbacks
    if (window.theme && window.theme.assets_url) {
      return `${window.theme.assets_url}/${filename}`;
    }

    // Check if we're in Shopify context
    if (typeof Shopify !== 'undefined' && Shopify.theme) {
      return `${Shopify.theme.assets_url || '/cdn/shop/t/5/assets'}/${filename}`;
    }

    return `/cdn/shop/t/5/assets/${filename}`;
  }

  _initializeMemoryParticles() {
    if (this.initialized) return;

    // Generate memory-particle system
    console.log('Memory particle system initialized with quantum entanglement');

    // Initialize particles
    for (let i = 0; i < 25; i++) {
      this.particles.push({
        x: Math.random() * this.dimensions.width,
        y: Math.random() * this.dimensions.height,
        z: Math.random() * this.dimensions.depth,
        size: Math.random() * 5 + 2,
        speed: Math.random() * 0.5 + 0.2,
      });
    }

    // Register with NeuralBus if available
    if (NeuralBus && NeuralBus.registerSystem) {
      NeuralBus.registerSystem('visualizer', this);
    } else {
      console.warn('NeuralBus not available for visualization system registration');
    }

    this.initialized = true;
    this.startRenderLoop();
  }

  _initializeWithoutPattern() {
    if (this.initialized) return;

    console.warn('Initializing visualizer without noise pattern');
    this.noisePattern = null;
    this._initializeMemoryParticles();
  }

  startRenderLoop() {
    if (!this.initialized) return;

    // Basic render loop
    const renderFrame = () => {
      // Update particle positions
      this.particles.forEach((particle) => {
        particle.z -= particle.speed;
        if (particle.z < 0) {
          particle.z = this.dimensions.depth;
          particle.x = Math.random() * this.dimensions.width;
          particle.y = Math.random() * this.dimensions.height;
        }
      });

      requestAnimationFrame(renderFrame);
    };

    renderFrame();
  }

  // API for neural bus integration
  applyTraumaEffect(intensity) {
    this.glitchFactor = Math.min(0.8, intensity * 0.1);
    return this;
  }
}

// Initialize and export
const visualizer = new QuantumVisualizer();

// CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { visualizer };
}

// AMD
if (typeof define === 'function' && define.amd) {
  define([], function () {
    return { visualizer };
  });
}

// Global variable
if (typeof window !== 'undefined') {
  window.quantumVisualizer = visualizer;
}

// ES Module export
export { visualizer };
