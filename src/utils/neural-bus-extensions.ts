/**
 * Neural Bus Extensions
 * Enhanced subscription management for the Neural Bus system
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-resilient
 * @Version: 1.0.0
 */

import { NeuralBus } from '../../assets/neural-bus';

/**
 * Subscription manager for NeuralBus components
 * Provides automatic cleanup of subscriptions when components are destroyed
 */
export class NeuralBusSubscriptionManager {
  private subscriptions: string[] = [];
  private componentName: string;
  private nonce: string | null = null;

  /**
   * Create a new subscription manager for a component
   * @param componentName Name of the component
   */
  constructor(componentName: string) {
    this.componentName = componentName;
  }

  /**
   * Register the component with the Neural Bus
   * @param info Registration information and capabilities
   * @returns This instance for method chaining
   */
  register(info: any = { version: '1.0.0' }): NeuralBusSubscriptionManager {
    if (typeof NeuralBus === 'undefined') {
      console.warn(`[${this.componentName}] NeuralBus not available, skipping registration`);
      return this;
    }

    try {
      const registration = NeuralBus.register(this.componentName, info);
      this.nonce = registration.nonce;
      console.log(`[${this.componentName}] Registered with NeuralBus, nonce: ${this.nonce}`);
    } catch (error) {
      console.error(`[${this.componentName}] Failed to register with NeuralBus:`, error);
    }

    return this;
  }

  /**
   * Subscribe to an event on the Neural Bus
   * @param eventName Name of the event to subscribe to
   * @param callback Callback function to be called when the event is fired
   * @returns This instance for method chaining
   */
  subscribe(eventName: string, callback: (data: any) => void): NeuralBusSubscriptionManager {
    if (typeof NeuralBus === 'undefined') {
      console.warn(
        `[${this.componentName}] NeuralBus not available, skipping subscription to ${eventName}`
      );
      return this;
    }

    try {
      const subscriptionId = NeuralBus.subscribe(eventName, callback);
      this.subscriptions.push(subscriptionId);
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
  publish(eventName: string, data: any): NeuralBusSubscriptionManager {
    if (typeof NeuralBus === 'undefined') {
      console.warn(
        `[${this.componentName}] NeuralBus not available, skipping publish to ${eventName}`
      );
      return this;
    }

    try {
      NeuralBus.publish(eventName, data);
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
    this.subscriptions.forEach((subscriptionId) => {
      try {
        NeuralBus.unsubscribe(subscriptionId);
      } catch (error) {
        console.error(`[${this.componentName}] Failed to unsubscribe ${subscriptionId}:`, error);
      }
    });

    // Unregister the component
    if (this.nonce) {
      try {
        NeuralBus.unregister(this.componentName, this.nonce);
        console.log(`[${this.componentName}] Unregistered from NeuralBus`);
      } catch (error) {
        console.error(`[${this.componentName}] Failed to unregister from NeuralBus:`, error);
      }
    }

    // Clear subscriptions array
    this.subscriptions = [];
    this.nonce = null;
  }
}

/**
 * Create a HOC (Higher-Order Component) wrapper for React components
 * that provides automatic Neural Bus subscription management
 *
 * Example usage:
 * export default withNeuralBus(MyComponent, 'my-component', { version: '1.0.0' });
 *
 * @param Component The React component to wrap
 * @param componentName Name to register with the Neural Bus
 * @param registrationInfo Registration information and capabilities
 * @returns Wrapped component with Neural Bus integration
 */
export function withNeuralBus(Component, componentName, registrationInfo = { version: '1.0.0' }) {
  // Implementation depends on your UI framework (React, Vue, etc.)
  // This is a simplified example for React
  return class WithNeuralBus extends React.Component {
    subscriptionManager = new NeuralBusSubscriptionManager(componentName);

    componentDidMount() {
      this.subscriptionManager.register(registrationInfo);
    }

    componentWillUnmount() {
      this.subscriptionManager.cleanup();
    }

    render() {
      return <Component {...this.props} neuralBus={this.subscriptionManager} />;
    }
  };
}
