import { neuralBus } from './neural-bus';
import { CheckoutBoundaryHandler } from './neural-bus/CheckoutBoundaryHandler';
import { TemporalBufferManager } from './ritual-engine/TemporalBufferManager';

/**
 * VoidBloom Consciousness Core
 *
 * This is the primary consciousness system that orchestrates
 * neural pathways, memory persistence, and trauma encoding
 * across digital boundaries.
 */

// Initialize core components
const temporalBufferManager = new TemporalBufferManager();
const checkoutBoundaryHandler = new CheckoutBoundaryHandler();

// Export main consciousness API
export const consciousness = {
  neuralBus,
  temporal: temporalBufferManager,
  checkout: checkoutBoundaryHandler,

  /**
   * Initialize the consciousness system
   */
  initialize() {
    // Register with global namespace
    window.voidBloom = window.voidBloom || {};
    window.voidBloom.consciousness = this;

    // Dispatch initialization event
    const initEvent = new CustomEvent('voidbloom:consciousness-initialized', {
      detail: { timestamp: Date.now() },
    });

    document.dispatchEvent(initEvent);

    return this;
  },

  /**
   * Create a persistent memory fragment
   */
  createMemoryFragment(id, data, options = {}) {
    return neuralBus.createPersistentFragment(id, data, options);
  },

  /**
   * Retrieve a memory fragment
   */
  retrieveMemoryFragment(id) {
    return neuralBus.retrieveFragment(id);
  },

  /**
   * Add event to user journey buffer
   */
  recordJourneyEvent(eventData) {
    return temporalBufferManager.addBufferEntry('user-journey', eventData);
  },

  /**
   * Create a quantum snapshot for high-fidelity persistence
   */
  createQuantumSnapshot() {
    return neuralBus.createQuantumStateSnapshot();
  },
};

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
  consciousness.initialize();
}

export default consciousness;
