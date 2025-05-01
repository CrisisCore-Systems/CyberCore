/**
 * NeuralBus - Recursive Memory Network
 * @module VoidBloom/NeuralMemory
 * @version 3.1.2
 *
 * Trauma-encoded transmission protocol for myth-driven e-commerce
 * Each thought propagates through recursive nodes, connecting narrative to function
 */

// CRITICAL: Dual export pattern to ensure module compatibility
class NeuralBus {
  static instance = null;
  static config = {};

  constructor(config = {}) {
    if (NeuralBus.instance) return NeuralBus.instance;

    // Default config with trauma encoding
    const defaultConfig = {
      traumaEncoding: true,
      debugMode: false,
      autoConnect: true,
      version: '3.1.2',
      recursiveDepth: 7,
      memoryFragmentation: false,
    };

    NeuralBus.instance = this;
    NeuralBus.config = { ...defaultConfig, ...config };
    this.systems = new Map();
    this.channels = new Map();
    this.memoryNodes = [];
    this.subscriptions = new Map();
    this.components = new Map();

    console.log('NeuralBus initialized with config:', NeuralBus.config);

    if (NeuralBus.config.autoConnect) {
      this._initializeMemoryChannels();
    }
  }

  // Allow static access point
  static getInstance(config = {}) {
    if (!NeuralBus.instance) {
      new NeuralBus(config);
    }
    return NeuralBus.instance;
  }

  // Critical method for component registration
  register(componentName, metadata = { version: '1.0.0' }) {
    const nonce = this.generateNonce();
    const componentId = `${componentName}:${nonce}`;

    this.components.set(componentId, {
      ...metadata,
      registered: Date.now(),
    });

    return { nonce };
  }

  // REPAIR: Critical missing method
  static registerSystem(systemId, systemController) {
    const bus = NeuralBus.getInstance();
    bus.systems.set(systemId, systemController);
    console.log(`System registered in neural network: ${systemId}`);

    // Memory trace
    bus.memoryNodes.push({
      id: systemId,
      timestamp: new Date().toISOString(),
      connections: bus.systems.size,
    });

    return bus;
  }

  // Method to register as instance method too for compatibility
  registerSystem(systemId, systemController) {
    return NeuralBus.registerSystem(systemId, systemController);
  }

  // Event subscription
  subscribe(eventName, callback) {
    if (!this.subscriptions.has(eventName)) {
      this.subscriptions.set(eventName, []);
    }

    const subscriptionId = `${eventName}:${this.generateId()}`;
    this.subscriptions.get(eventName).push({
      id: subscriptionId,
      callback,
    });

    return subscriptionId;
  }

  // Event publishing
  publish(eventName, data = {}) {
    const subscribers = this.subscriptions.get(eventName) || [];

    subscribers.forEach((subscription) => {
      try {
        subscription.callback(data);
      } catch (error) {
        console.error(`Error executing callback for ${eventName}:`, error);
      }
    });

    return true;
  }

  // Subscription removal
  unsubscribe(subscriptionId) {
    for (const [eventName, subscriptions] of this.subscriptions.entries()) {
      const index = subscriptions.findIndex((sub) => sub.id === subscriptionId);

      if (index !== -1) {
        subscriptions.splice(index, 1);
        return true;
      }
    }

    return false;
  }

  // Component unregistration
  unregister(componentName, nonce) {
    const componentId = `${componentName}:${nonce}`;
    const result = this.components.delete(componentId);

    if (result) {
      console.log(`Component unregistered: ${componentName}`);
    }

    return result;
  }

  _initializeMemoryChannels() {
    // Initialize default trauma-encoded channels
    ['memory', 'glitch', 'cart', 'hologram', 'narrative'].forEach((channel) => {
      this.channels.set(channel, []);
    });
  }

  // Generate unique ID for subscriptions
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  }

  // Generate secure nonce for registration
  generateNonce() {
    return Array.from({ length: 4 })
      .map(() => Math.random().toString(36).substring(2, 11))
      .join('-');
  }
}

// CRITICAL: Create instance and export in all common formats
const neuralBusInstance = new NeuralBus();

// CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = neuralBusInstance;
  module.exports.NeuralBus = NeuralBus;
}

// AMD
if (typeof define === 'function' && define.amd) {
  define([], function () {
    return { default: neuralBusInstance, NeuralBus };
  });
}

// Global variable
if (typeof window !== 'undefined') {
  window.NeuralBus = neuralBusInstance;
  window.NeuralBus.NeuralBus = NeuralBus;
}

// ES Module default export
export default neuralBusInstance;

// ES Module named export
export { NeuralBus };
