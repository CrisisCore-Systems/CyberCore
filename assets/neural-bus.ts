/**
 * TypeScript wrapper for neural-bus.js
 * Provides type safety while maintaining compatibility with the original event system
 */

// Import the original JavaScript file
const NeuralBusJS = require('./neural-bus.js').default || require('./neural-bus.js');

// Define TypeScript interfaces for the NeuralBus
export interface EventCallback {
  (data: any): void;
}

export interface ComponentRegistration {
  version: string;
  options?: Record<string, any>;
}

export interface NeuralBusInterface {
  // Core Methods
  initialize(): void;
  register(componentName: string, info: ComponentRegistration): void;
  unregister(componentName: string): void;

  // Event Methods
  subscribe(eventName: string, callback: EventCallback): string;
  unsubscribe(subscriptionId: string): boolean;
  publish(eventName: string, data: any): void;

  // Utility Methods
  getRegisteredComponents(): string[];
  getComponentInfo(componentName: string): ComponentRegistration | null;
  clearAllSubscriptions(): void;
  dispose(): void;
}

// Export the JavaScript module with TypeScript types
export const NeuralBus: NeuralBusInterface = NeuralBusJS;
