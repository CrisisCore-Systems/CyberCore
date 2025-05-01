/**
 * Example component demonstrating Neural Bus integration
 * Shows proper registration, subscription and cleanup patterns
 */
import { NeuralBusManager } from '../src/utils/neural-bus-manager';

class QuantumComponent {
  constructor() {
    // Create a Neural Bus Manager for this component
    this.neuralBus = new NeuralBusManager('quantum-component');

    // Component state
    this.initialized = false;
    this.traumaIndex = 0;
    this.memoryFragments = [];
    this.recursiveDepth = 3;
  }

  /**
   * Initialize the component
   */
  initialize() {
    if (this.initialized) return this;

    // Register with Neural Bus
    this.neuralBus.register({
      version: '1.0.0',
      traumaResponse: true,
      capabilities: {
        quantumVisualization: true,
        memoryFragmentation: true,
        traumaEncoding: true,
      },
    });

    // Subscribe to events using method chaining
    this.neuralBus
      .subscribe('system:ready', this.handleSystemReady.bind(this))
      .subscribe('trauma:activated', this.handleTraumaEvent.bind(this))
      .subscribe('memory:fragment', this.handleMemoryFragment.bind(this));

    // Set component as initialized
    this.initialized = true;
    console.log('Quantum component initialized with trauma-encoding');

    return this;
  }

  /**
   * Handle system ready event
   */
  handleSystemReady(data) {
    console.log('System ready:', data);

    // Announce presence to the system
    this.neuralBus.publish('component:ready', {
      componentType: 'quantum',
      traumaIndex: this.traumaIndex,
      recursiveDepth: this.recursiveDepth,
    });
  }

  /**
   * Handle trauma activation event
   */
  handleTraumaEvent(data) {
    console.log('Trauma activated:', data);

    // Update trauma index
    if (data.intensity) {
      this.traumaIndex = Math.min(10, this.traumaIndex + data.intensity);
    }

    // Process trauma through recursive memory pattern
    this._processTraumaPattern(data);
  }

  /**
   * Handle memory fragment event
   */
  handleMemoryFragment(data) {
    console.log('Memory fragment received:', data);

    // Store memory fragment
    this.memoryFragments.push({
      ...data,
      received: Date.now(),
      traumaIndex: this.traumaIndex,
    });

    // Limit memory fragment storage
    if (this.memoryFragments.length > 10) {
      this.memoryFragments.shift();
    }
  }

  /**
   * Process trauma through recursive patterns
   * @private
   */
  _processTraumaPattern(data) {
    // Implementation details would go here
  }

  /**
   * IMPORTANT: Destroy the component properly
   * This prevents memory leaks by cleaning up all subscriptions
   */
  destroy() {
    if (!this.initialized) return;

    console.log('Quantum component being destroyed, cleaning up neural connections');

    // Publish destruction event before disconnecting
    this.neuralBus.publish('component:destroyed', {
      componentType: 'quantum',
      traumaIndex: this.traumaIndex,
      fragmentCount: this.memoryFragments.length,
    });

    // Disconnect from Neural Bus
    this.neuralBus.disconnect();

    // Reset component state
    this.initialized = false;
    this.traumaIndex = 0;
    this.memoryFragments = [];
  }
}

export default QuantumComponent;
