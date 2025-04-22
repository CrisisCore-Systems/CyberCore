/**
 * Neural Bus TypeScript Implementation
 * Manages neural network communication within the CyberCore system
 */

// Import the original JavaScript file using ES module syntax
import * as NeuralBusJS from './neural-bus.js';

// Define TypeScript interfaces for the NeuralBus
export interface EventCallback<T = unknown> {
  (data: T): void;
}

export interface ComponentRegistration {
  version: string;
  options?: Record<string, unknown>;
}

export interface NeuralBusInterface {
  // Core Methods
  initialize(): void;
  register(componentName: string, info: ComponentRegistration): void;
  unregister(componentName: string): void;

  // Event Methods
  subscribe<T = unknown>(eventName: string, callback: EventCallback<T>): string;
  unsubscribe(subscriptionId: string): boolean;
  publish<T = unknown>(eventName: string, data: T): void;

  // Utility Methods
  getRegisteredComponents(): string[];
  getComponentInfo(componentName: string): ComponentRegistration | null;
  clearAllSubscriptions(): void;
  dispose(): void;
}

// Export the JavaScript module with TypeScript types
export const NeuralBus: NeuralBusInterface = NeuralBusJS;
