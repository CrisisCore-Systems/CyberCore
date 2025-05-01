/**
 * Subscription Manager
 * Provides automatic cleanup of subscriptions to prevent memory leaks
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-resilient
 * @Version: 1.0.0
 */

import { NeuralBus } from '../../assets/neural-bus';

/**
 * Manages subscriptions to the Neural Bus for a component
 * Provides automatic cleanup when the component is destroyed
 */
export class SubscriptionManager {
  private subscriptionIds: string[] = [];
  private componentName: string;
  private nonce: string | null = null;

  /**
   * Create a subscription manager for a component
   * @param componentName Name of the component for registration
   */
  constructor(componentName: string) {
    this.componentName = componentName;
  }

  /**
   * Register the component with the Neural Bus
   * @param info Registration information and capabilities
   */
  register(info: any = { version: '1.0.0' }): SubscriptionManager {
    if (typeof NeuralBus === 'undefined') {
      console.warn(`[${this.componentName}] Neural Bus not available for registration`);
      return this;
    }

    try {
      const registration = NeuralBus.register(this.componentName, info);
      this.nonce = registration.nonce;
      console.log(`[${this.componentName}] Registered with Neural Bus, nonce: ${this.nonce}`);
    } catch (error) {
      console.error(`[${this.componentName}] Failed to register with Neural Bus:`, error);
    }

    return this;
  }

  /**
   * Subscribe to an event on the Neural Bus
   * @param eventName Name of the event to subscribe to
   * @param callback Callback function to handle the event
   */
  subscribe(eventName: string, callback: Function): SubscriptionManager {
    if (typeof NeuralBus === 'undefined') {
      console.warn(
        `[${this.componentName}] Neural Bus not available for subscription to ${eventName}`
      );
      return this;
    }

    try {
      const subscriptionId = NeuralBus.subscribe(eventName, callback);
      this.subscriptionIds.push(subscriptionId);
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
   */
  publish(eventName: string, data: any): SubscriptionManager {
    if (typeof NeuralBus === 'undefined') {
      console.warn(
        `[${this.componentName}] Neural Bus not available for publishing to ${eventName}`
      );
      return this;
    }

    try {
      NeuralBus.publish(eventName, {
        ...data,
        timestamp: Date.now(),
        source: this.componentName,
      });
    } catch (error) {
      console.error(`[${this.componentName}] Failed to publish to ${eventName}:`, error);
    }

    return this;
  }

  /**
   * Cleanup all subscriptions and unregister the component
   * Call this when the component is destroyed
   */
  cleanup(): void {
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

    // Unregister the component if registered
    if (this.nonce) {
      try {
        NeuralBus.unregister(this.componentName, this.nonce);
        console.log(`[${this.componentName}] Unregistered from Neural Bus`);
      } catch (error) {
        console.error(`[${this.componentName}] Failed to unregister from Neural Bus:`, error);
      }
    }

    // Reset subscription IDs
    this.subscriptionIds = [];
    this.nonce = null;
  }
}
