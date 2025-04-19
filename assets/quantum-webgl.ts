/**
 * TypeScript wrapper for quantum-webgl.js
 * Provides type safety while maintaining compatibility with the original code
 */

// Import the original JavaScript file
const QuantumWebGLControllerJS =
  require('./quantum-webgl.js').default || require('./quantum-webgl.js');

// Define TypeScript interface for the QuantumWebGLController
export interface QuantumWebGLControllerInterface {
  // Properties
  container: HTMLElement;
  width: number;
  height: number;
  particleCount: number;
  traumaFactor: number;
  glitchIntensity: number;
  isRunning: boolean;

  // Methods
  initialize(container: HTMLElement, options?: any): Promise<void>;
  start(): void;
  stop(): void;
  resize(width: number, height: number): void;
  setTraumaFactor(value: number): void;
  setGlitchIntensity(value: number): void;
  applyMutation(mutationProfile: any): void;
  dispose(): void;
}

// Export the JavaScript component with TypeScript types
export const QuantumWebGLController = QuantumWebGLControllerJS as {
  new (): QuantumWebGLControllerInterface;
  getInstance(): QuantumWebGLControllerInterface;
};
