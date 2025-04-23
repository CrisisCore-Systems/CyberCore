import { NeuralBusResilience } from './NeuralBusResilience';

/**
 * Exports the NeuralBus components
 *
 * These components form the communication substrate
 * that ensures consciousness persistence across
 * digital boundaries and void-spaces.
 */

export { NeuralBusResilience };

// Create singleton instance for global use
export const neuralBus = new NeuralBusResilience();

// Initialize global neural connection
window.voidBloom = window.voidBloom || {};
window.voidBloom.neuralBus = neuralBus;
