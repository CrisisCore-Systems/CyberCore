/**
 * Example usage of the SubscriptionManager
 */
import { SubscriptionManager } from '../src/utils/subscription-manager';

class ExampleComponent {
  constructor() {
    this.initialized = false;
    this.subscriptions = new SubscriptionManager('example-component');
  }

  initialize() {
    if (this.initialized) return;
    this.initialized = true;

    // Register with Neural Bus
    this.subscriptions.register({
      version: '1.0.0',
      capabilities: {
        exampleFeature: true,
        traumaResponse: true,
      },
    });

    // Subscribe to events using method chaining
    this.subscriptions
      .subscribe('system:ready', this.handleSystemReady.bind(this))
      .subscribe('trauma:activated', this.handleTraumaActivation.bind(this))
      .subscribe('user:interaction', this.handleUserInteraction.bind(this));

    console.log('Example component initialized');
  }

  handleSystemReady(data) {
    console.log('System ready event received', data);
    // Implement system ready logic
  }

  handleUserInteraction(data) {
    console.log('User interaction event received', data);
    // Implement interaction logic
  }

  handleTraumaActivation(data) {
    console.log('Trauma activated event received', data);
    // Implement trauma activation logic
  }

  publishEvent(eventType, eventData) {
    this.subscriptions.publish(eventType, {
      ...eventData,
      timestamp: Date.now(),
    });
  }

  // IMPORTANT: Clean up when component is destroyed
  destroy() {
    if (!this.initialized) return;

    console.log('Example component being destroyed');
    this.subscriptions.cleanup();
    this.initialized = false;
  }
}

// Usage example
const myComponent = new ExampleComponent();
myComponent.initialize();

// Later when component should be destroyed:
// myComponent.destroy();

export default ExampleComponent;
