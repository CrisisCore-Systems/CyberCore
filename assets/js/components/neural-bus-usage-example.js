/**
 * Example component using Neural Bus with proper subscription management
 */
import { NeuralBusSubscriptionManager } from '../../../src/utils/neural-bus-extensions';

class ExampleComponent {
  constructor() {
    this.neuralBus = new NeuralBusSubscriptionManager('example-component');
    this.initialized = false;
  }

  initialize() {
    if (this.initialized) return;
    this.initialized = true;

    // Register with Neural Bus
    this.neuralBus.register({
      version: '1.0.0',
      capabilities: {
        exampleFeature: true,
      },
    });

    // Subscribe to events
    this.neuralBus
      .subscribe('system:ready', this.handleSystemReady.bind(this))
      .subscribe('user:interaction', this.handleUserInteraction.bind(this))
      .subscribe('trauma:activated', this.handleTraumaActivation.bind(this));

    console.log('Example component initialized');
  }

  handleSystemReady(data) {
    console.log('System ready:', data);
    // Implement system ready logic
  }

  handleUserInteraction(data) {
    console.log('User interaction:', data);
    // Implement user interaction logic
  }

  handleTraumaActivation(data) {
    console.log('Trauma activated:', data);
    // Implement trauma activation logic
  }

  // Publish an event
  triggerEvent(eventType, eventData) {
    this.neuralBus.publish(eventType, {
      ...eventData,
      timestamp: Date.now(),
      source: 'example-component',
    });
  }

  // IMPORTANT: Call this when the component is destroyed
  destroy() {
    console.log('Example component destroyed');
    this.neuralBus.cleanup();
    this.initialized = false;
  }
}

export default ExampleComponent;
