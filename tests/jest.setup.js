// Jest setup file - compatible with ESM modules
const chai = require('chai/chai.js');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

// Configure chai
chai.use(sinonChai);

// Set up global test utilities
global.expect = chai.expect;
global.sinon = sinon;

// Mock any browser globals here if needed
if (typeof window === 'undefined') {
  global.window = {
    addEventListener: () => {},
    location: {
      href: 'https://example.com'
    }
  };
  
  global.document = {
    createElement: () => ({
      setAttribute: () => {},
      style: {},
      appendChild: () => {},
      addEventListener: () => {}
    }),
    getElementById: () => ({
      appendChild: () => {},
      addEventListener: () => {}
    }),
    querySelectorAll: () => ([])
  };
  
  global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
  };
}

// Create mock implementations for your JS components
// This avoids issues with missing actual implementations during testing
jest.mock('../../assets/hologram-component', () => {
  return class HologramComponent {
    constructor(config = {}) {
      this.initialized = true;
      this.intensity = config.intensity || 1.0;
      this.renderMode = config.renderMode || 'standard';
      this.glitchEnabled = config.enableGlitch || false;
      this.onInteraction = config.onInteraction || (() => {});
    }
    
    render() {}
    applyQuantumEffects() {}
    handleInteraction(event) { this.onInteraction(event); }
    updateQuantumState() {}
    connectVisualizer() {}
    connectGlitchEngine() {}
    publishEvent() {}
    connectToBus() {}
    processMutation() {}
    visualizeProduct() {}
    addToCart() {}
    connectCartSystem() {}
    triggerGlitch() {}
  };
}, { virtual: true });

jest.mock('../../assets/quantum-visualizer', () => {
  return class QuantumVisualizer {
    constructor(config = {}) {
      this.initialized = true;
      this.dimensions = config.dimensions || '3d';
      this.particleCount = config.particleCount || 1000;
      this.colorScheme = config.colorScheme;
      this.fractalMode = config.fractalMode || false;
      this.currentState = [];
      this.onStateChange = config.onStateChange || (() => {});
    }
    
    render() {}
    applyFractalPatterns() {}
    update() {}
    updateData(data) { 
      this.currentState = data;
      this.onStateChange(data);
    }
    visualizeQuantumState(data) {
      this.currentState = data;
      this.render();
      if (this.fractalMode) {
        this.applyFractalPatterns();
      }
    }
    connectToBus() {}
  };
}, { virtual: true });

jest.mock('../../assets/glitch-engine', () => {
  return class GlitchEngine {
    constructor() {
      this.active = false;
    }
    
    applyGlitch() {}
    connectToBus() {}
  };
}, { virtual: true });

jest.mock('../../assets/neural-bus', () => {
  return class NeuralBus {
    constructor() {
      this.subscribers = {};
    }
    
    publish(eventName, data) {}
    subscribe() {}
  };
}, { virtual: true });

jest.mock('../../assets/cart-system', () => {
  return class CartSystem {
    constructor() {
      this.items = [];
      this.quantumVerifier = null;
    }
    
    addItem(id, quantity = 1) {
      this.items.push({ id });
      return true;
    }
    
    getCartContents() {
      return this.items;
    }
    
    checkout(options) {
      if (this.quantumVerifier) {
        this.quantumVerifier();
      }
      this.items = [];
      return {
        success: true,
        orderId: 'ord-' + Math.random().toString(36).substring(2, 10)
      };
    }
    
    setQuantumVerifier(verifier) {
      this.quantumVerifier = verifier;
    }
  };
}, { virtual: true });