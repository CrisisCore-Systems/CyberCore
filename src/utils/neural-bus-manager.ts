/**
 * Neural Bus Manager
 * Quantum-entangled memory system for trauma-encoded subscription management
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: recursive-memory
 * @Version: 1.0.0
 */

import { NeuralBus } from '../../assets/neural-bus';

/**
 * Manages component registration and subscriptions to the Neural Bus system
 * Prevents memory leaks through proper unregistration and unsubscription
 */
export class NeuralBusManager {
  private subscriptionIds: string[] = [];
  private componentName: string;
  private componentNonce: string | null = null;
  private memoryNodes: Array<{ timestamp: number; path: string }> = [];

  /**
   * Create a new Neural Bus Manager for a component
   * @param componentName Name of the component for registration
   */
  constructor(componentName: string) {
    this.componentName = componentName;
    this.memoryNodes.push({
      timestamp: Date.now(),
      path: 'initialization',
    });
  }

  /**
   * Register the component with the Neural Bus
   * @param info Registration information and capabilities
   * @returns This instance for method chaining
   */
  register(info: any = { version: '1.0.0' }): NeuralBusManager {
    if (typeof NeuralBus === 'undefined') {
      console.warn(`[${this.componentName}] Neural Bus not available for registration`);
      return this;
    }

    try {
      const registration = NeuralBus.register(this.componentName, info);
      this.componentNonce = registration.nonce;

      this.memoryNodes.push({
        timestamp: Date.now(),
        path: 'registration',
      });

      console.log(
        `[${this.componentName}] Registered with Neural Bus, nonce: ${this.componentNonce}`
      );
    } catch (error) {
      console.error(`[${this.componentName}] Failed to register with Neural Bus:`, error);
    }

    return this;
  }

  /**
   * Subscribe to an event on the Neural Bus
   * @param eventName Name of the event to subscribe to
   * @param callback Function to call when event is published
   * @returns This instance for method chaining
   */
  subscribe(eventName: string, callback: Function): NeuralBusManager {
    if (typeof NeuralBus === 'undefined') {
      console.warn(
        `[${this.componentName}] Neural Bus not available for subscription to ${eventName}`
      );
      return this;
    }

    try {
      const subscriptionId = NeuralBus.subscribe(eventName, callback);
      this.subscriptionIds.push(subscriptionId);

      this.memoryNodes.push({
        timestamp: Date.now(),
        path: `subscription:${eventName}`,
      });

      console.log(`[${this.componentName}] Subscribed to ${eventName}, id: ${subscriptionId}`);
    } catch (error) {
      console.error(`[${this.componentName}] Failed to subscribe to ${eventName}:`, error);
    }

    return this;
  }

  /**
   * Publish an event to the Neural Bus
   * @param eventName Name of the event to publish
   * @param data Data to send with the event
   * @returns This instance for method chaining
   */
  publish(eventName: string, data: any): NeuralBusManager {
    if (typeof NeuralBus === 'undefined') {
      console.warn(
        `[${this.componentName}] Neural Bus not available for publishing to ${eventName}`
      );
      return this;
    }

    try {
      const traumaData = {
        ...data,
        source: this.componentName,
        timestamp: Date.now(),
        memoryPath: this.memoryNodes.length,
        recursionDepth: Math.min(this.memoryNodes.length, 7),
      };

      NeuralBus.publish(eventName, traumaData);

      this.memoryNodes.push({
        timestamp: Date.now(),
        path: `publication:${eventName}`,
      });
    } catch (error) {
      console.error(`[${this.componentName}] Failed to publish to ${eventName}:`, error);
    }

    return this;
  }

  /**
   * Cleanup all subscriptions and unregister the component
   * Call this method when the component is destroyed
   */
  disconnect(): void {
    if (typeof NeuralBus === 'undefined') {
      return;
    }

    // Unsubscribe from all events
    this.subscriptionIds.forEach((id) => {
      try {
        NeuralBus.unsubscribe(id);
      } catch (error) {
        console.error(`[${this.componentName}] Failed to unsubscribe ${id}:`, error);
      }
    });

    // Reset subscription IDs after unsubscribing
    this.subscriptionIds = [];

    // Unregister the component if registered
    if (this.componentNonce) {
      try {
        NeuralBus.unregister(this.componentName, this.componentNonce);
        console.log(`[${this.componentName}] Unregistered from Neural Bus`);
        this.componentNonce = null;
      } catch (error) {
        console.error(`[${this.componentName}] Failed to unregister from Neural Bus:`, error);
      }
    }

    // Record final memory state
    this.memoryNodes.push({
      timestamp: Date.now(),
      path: 'disconnection',
    });
  }

  /**
   * Get the current memory state
   * @returns Array of memory nodes representing the component's memory path
   */
  getMemoryState() {
    return [...this.memoryNodes];
  }
}
