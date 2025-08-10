/**
 * NeuralBus System - Core Memory Protocol v4.0.2
 * @module VoidBloom/CoreMemory
 * Memory-encoded e-commerce backbone with recursive thought patterns
 */

// DUAL EXPORT PATTERN FOR MAXIMUM COMPATIBILITY
// ==============================================

// Primary class definition with static interface
export class NeuralBus {
  static instance = null;
  static config = {};

  constructor(config = {}) {
    // Singleton pattern enforcement
    if (NeuralBus.instance) return NeuralBus.instance;

    // Default trauma-encoded configuration
    const defaultConfig = {
      traumaEncoding: true,
      debugMode: false,
      autoConnect: true,
      version: '4.0.2',
      recoveryProtocol: 'recursive',
    };

    NeuralBus.instance = this;
    NeuralBus.config = { ...defaultConfig, ...config };
    this.systems = new Map();
    this.channels = new Map();
    this.memoryNodes = [];

    console.log('NeuralBus initialized with config:', NeuralBus.config);

    // Auto-initialize
    if (NeuralBus.config.autoConnect) {
      this._initializeMemoryChannels();
    }

    // Expose globally for legacy access patterns
    window.NeuralBus = NeuralBus;
  }

  // Global access point
  static getInstance(config = {}) {
    if (!NeuralBus.instance) {
      new NeuralBus(config);
    }
    return NeuralBus.instance;
  }

  // SYSTEM REGISTRY - CRITICAL FOR HOLOGRAM FUNCTION
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

  // CHANNEL CREATION
  _initializeMemoryChannels() {
    ['memory', 'glitch', 'cart', 'hologram', 'quantum', 'viewer'].forEach((channel) => {
      this.channels.set(channel, []);
    });
  }

  // Publish to memory channel
  publish(channelId, message) {
    if (!this.channels.has(channelId)) {
      this.channels.set(channelId, []);
    }

    const channel = this.channels.get(channelId);
    channel.push({
      timestamp: Date.now(),
      message,
      trace: new Error().stack,
    });

    // Notify subscribers
    const subscribers = this._getSubscribers(channelId);
    subscribers.forEach((callback) => {
      try {
        callback(message);
      } catch (error) {
        console.error(`Error in NeuralBus subscriber (${channelId}):`, error);
      }
    });

    // Notify system controller if exists
    const system = this.systems.get(channelId);
    if (system && typeof system.onMessage === 'function') {
      try {
        system.onMessage(message);
      } catch (error) {
        console.error(`Error in system controller (${channelId}):`, error);
      }
    }

    return message;
  }

  // Subscribe to memory channel
  subscribe(channelId, callback) {
    if (typeof callback !== 'function') {
      console.error('NeuralBus.subscribe requires a callback function');
      return { unsubscribe: () => false };
    }

    const subscribers = this._getSubscribers(channelId);
    subscribers.push(callback);

    // Return unsubscribe function for cleaner cleanup
    return {
      unsubscribe: () => {
        const index = subscribers.indexOf(callback);
        if (index !== -1) {
          subscribers.splice(index, 1);
          return true;
        }
        return false;
      },
    };
  }

  // Get or create subscriber list for channel
  _getSubscribers(channelId) {
    const channel = `${channelId}_subscribers`;
    if (!this[channel]) {
      this[channel] = [];
    }
    return this[channel];
  }

  // Global registration of NeuralBus capabilities
  static initialize() {
    const bus = NeuralBus.getInstance();

    // Expose key methods on the global object for legacy support
    if (typeof window !== 'undefined') {
      window.NeuralBus = {
        ...window.NeuralBus,
        getInstance: NeuralBus.getInstance,
        registerSystem: NeuralBus.registerSystem,
        publish: (channel, message) => bus.publish(channel, message),
        subscribe: (channel, callback) => bus.subscribe(channel, callback),
        initialize: NeuralBus.initialize,
      };
    }

    return bus;
  }
}

// DEFAULT EXPORT FOR LEGACY SYSTEMS
export default NeuralBus;

// INITIALIZE SINGLETON ON LOAD
const bus = new NeuralBus();

// Support CommonJS environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NeuralBus, default: bus };
}
