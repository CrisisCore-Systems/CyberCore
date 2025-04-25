/**
 * NEURAL-BUS.D.TS
 * TypeScript declarations for unified neural communication bus
 */

// Export all types and interfaces from the core implementation
export * from './core/neural-bus';

// Re-export the default export from the core implementation
import NeuralBus from './core/neural-bus';
export default NeuralBus;
