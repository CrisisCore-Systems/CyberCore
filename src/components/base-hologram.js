import { mutationHandler } from '../core/mutation-handler.js';
import { getProfileColor } from '../core/mutation-profiles.js';
import { NeuralBus } from '../core/neural-bus.js';

/**
 * Base Hologram Component
 * Common functionality for all hologram components
 */
export class BaseHologram {
  #mutationProfile = 'CyberLotus';
  #mutationUnsubscribe = null;
  #neuralBusSubscriptions = [];

  /**
   * Constructor
   * @param {string} initialProfile - Initial mutation profile
   */
  constructor(initialProfile = 'CyberLotus') {
    this.#mutationProfile = initialProfile;
  }

  /**
   * Initialize hologram
   */
  initialize() {
    // Subscribe to mutation handler
    this.#mutationUnsubscribe = mutationHandler.subscribe({
      updateProfile: this.updateProfile.bind(this),
    });

    // Connect to neural bus for other events
    this.connectToNeuralBus();

    return this;
  }

  /**
   * Connect to neural bus
   */
  connectToNeuralBus() {
    // Common event subscriptions
    this.#neuralBusSubscriptions.push(
      NeuralBus.subscribe('hologram:update', this.handleHologramUpdate.bind(this))
    );
  }

  /**
   * Disconnect from neural bus
   */
  disconnectFromNeuralBus() {
    this.#neuralBusSubscriptions.forEach((sub) => {
      if (sub && typeof sub.unsubscribe === 'function') {
        sub.unsubscribe();
      }
    });

    this.#neuralBusSubscriptions = [];
  }

  /**
   * Update profile
   * @param {string} profile - New profile name
   * @param {Object} data - Additional mutation data
   */
  updateProfile(profile, data = {}) {
    this.#mutationProfile = profile;

    // Override in subclasses to apply profile-specific changes
  }

  /**
   * Handle hologram update event
   * @param {Object} data - Update data
   */
  handleHologramUpdate(data) {
    // Override in subclasses
  }

  /**
   * Get current profile
   * @returns {string} Current profile name
   */
  getProfile() {
    return this.#mutationProfile;
  }

  /**
   * Get profile color
   * @returns {string} Current profile color
   */
  getProfileColor() {
    return getProfileColor(this.#mutationProfile);
  }

  /**
   * Dispose and clean up
   */
  dispose() {
    if (this.#mutationUnsubscribe) {
      this.#mutationUnsubscribe();
      this.#mutationUnsubscribe = null;
    }

    this.disconnectFromNeuralBus();
  }
}
