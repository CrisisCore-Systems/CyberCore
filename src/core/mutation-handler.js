import { NeuralBus } from './neural-bus.js';

/**
 * Centralized handler for quantum mutations
 */
export class MutationHandler {
  #subscribers = new Set();
  #currentProfile = 'CyberLotus';
  #neuralBusSubscription = null;

  /**
   * Initialize the mutation handler
   */
  initialize() {
    // Connect to Neural Bus
    this.#neuralBusSubscription = NeuralBus.subscribe(
      'quantum:mutation',
      this.handleMutation.bind(this)
    );
    return this;
  }

  /**
   * Subscribe a component to mutation updates
   * @param {Object} component - Component with update method
   * @returns {Function} Unsubscribe function
   */
  subscribe(component) {
    if (!component || typeof component.updateProfile !== 'function') {
      console.error('Component must have an updateProfile method');
      return () => {};
    }

    this.#subscribers.add(component);

    // Return unsubscribe function
    return () => {
      this.#subscribers.delete(component);
    };
  }

  /**
   * Handle a mutation event
   * @param {Object} data - Mutation data
   */
  handleMutation(data) {
    if (!data || !data.profile) return;

    this.#currentProfile = data.profile;

    // Notify all subscribers
    this.#subscribers.forEach((subscriber) => {
      try {
        subscriber.updateProfile(data.profile, data);
      } catch (error) {
        console.error('Error updating subscriber:', error);
      }
    });

    // Log mutation
    console.log(`Mutation applied: ${data.profile}`, data);
  }

  /**
   * Get current profile
   * @returns {string} Current profile name
   */
  getCurrentProfile() {
    return this.#currentProfile;
  }

  /**
   * Dispose and clean up
   */
  dispose() {
    if (this.#neuralBusSubscription) {
      this.#neuralBusSubscription.unsubscribe();
      this.#neuralBusSubscription = null;
    }

    this.#subscribers.clear();
  }
}

// Singleton instance
export const mutationHandler = new MutationHandler().initialize();
