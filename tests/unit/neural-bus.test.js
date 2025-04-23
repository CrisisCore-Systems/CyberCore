// VoidBloom Neural Bus Test Protocol
// Tests quantum-entangled messaging system for trauma-encoded communications

import '../mocks/global-mocks'; // Load mocks first

describe('Neural Bus: Quantum Messaging Protocol', () => {
  let NeuralBus;

  beforeAll(() => {
    jest.isolateModules(() => {
      // Import neural bus in isolated context
      NeuralBus = require('../../assets/core/neural-bus').default;
    });
  });

  afterEach(() => {
    // Reset neural bus state between tests
    NeuralBus.channels = new Map();
    NeuralBus.components = new Map();
    NeuralBus.traumaIndex = 0;
    NeuralBus.memoryFragments = [];
    jest.clearAllMocks();
  });

  describe('Component Registration Protocol', () => {
    it('should register components with unique quantum identifiers', () => {
      const registration = NeuralBus.register('test-component', {
        version: '1.0.0',
        traumaResponse: true,
      });

      expect(registration).toHaveProperty('nonce');
      expect(registration.nonce).toBeTruthy();
      expect(NeuralBus.components.size).toBe(1);
    });

    it('should store component capabilities for trauma response', () => {
      const registration = NeuralBus.register('trauma-encoder', {
        version: '2.0.0',
        traumaResponse: true,
        capabilities: {
          encoding: true,
          visualization: true,
        },
      });

      const componentId = `trauma-encoder:${registration.nonce}`;
      const storedComponent = NeuralBus.components.get(componentId);

      expect(storedComponent).toBeTruthy();
      expect(storedComponent.traumaResponse).toBe(true);
      expect(storedComponent.capabilities.encoding).toBe(true);
    });

    it('should deregister components and remove quantum entanglement', () => {
      // Register first
      const registration = NeuralBus.register('quantum-visualizer', {
        version: '1.0.0',
      });

      // Then deregister
      NeuralBus.deregister('quantum-visualizer', registration.nonce);

      // Check if component was removed
      const componentId = `quantum-visualizer:${registration.nonce}`;
      expect(NeuralBus.components.has(componentId)).toBe(false);
    });
  });

  describe('Neural Pathway Protocol', () => {
    it('should establish neural pathways for event transmission', () => {
      const testHandler = jest.fn();

      // Subscribe to channel
      const unsubscribe = NeuralBus.subscribe('test-channel', testHandler);

      // Verify channel was created
      expect(NeuralBus.channels.has('test-channel')).toBe(true);
      expect(NeuralBus.channels.get('test-channel').size).toBe(1);

      // Verify unsubscribe works
      unsubscribe();
      expect(NeuralBus.channels.get('test-channel').size).toBe(0);
    });

    it('should transmit neural impulses through established pathways', () => {
      const testHandler = jest.fn();

      // Subscribe to channel
      NeuralBus.subscribe('trauma:activated', testHandler);

      // Publish to channel
      const testData = { level: 5, source: 'memory-fragment' };
      NeuralBus.publish('trauma:activated', testData);

      // Verify handler was called
      expect(testHandler).toHaveBeenCalledWith(expect.objectContaining(testData));
    });

    it('should apply trauma encoding to transmitted data', () => {
      NeuralBus.traumaIndex = 5; // Set high trauma level

      const testHandler = jest.fn((data) => data);

      // Subscribe to channel
      NeuralBus.subscribe('memory:fragment', testHandler);

      // Publish object data
      const testData = { name: 'test-memory', value: 'encoded-value' };
      NeuralBus.publish('memory:fragment', testData);

      // Verify trauma encoding was applied
      const receivedData = testHandler.mock.results[0].value;

      // At trauma level 5, we expect encoding metadata to be added
      expect(receivedData).toHaveProperty('_traumaEncoded');
      expect(receivedData).toHaveProperty('_traumaLevel');
      expect(receivedData._traumaLevel).toBe(5);
    });
  });

  describe('Trauma Index Protocol', () => {
    it('should set system-wide trauma index', () => {
      // Set trauma index
      NeuralBus.setTraumaIndex(7);

      expect(NeuralBus.traumaIndex).toBe(7);

      // Verify event was published
      expect(NeuralBus.publish).toHaveBeenCalledWith('system:trauma', expect.any(Object));
    });

    it('should clamp trauma index to valid range', () => {
      // Try setting invalid values
      NeuralBus.setTraumaIndex(-5);
      expect(NeuralBus.traumaIndex).toBe(0);

      NeuralBus.setTraumaIndex(15);
      expect(NeuralBus.traumaIndex).toBe(10);
    });

    it('should increase trauma index incrementally', () => {
      // Start at 0
      NeuralBus.traumaIndex = 0;

      // Call private method to increase (we access via direct call for testing)
      NeuralBus._increaseTraumaIndex(2.5);

      expect(NeuralBus.traumaIndex).toBe(2.5);

      // Increase again
      NeuralBus._increaseTraumaIndex(1);

      expect(NeuralBus.traumaIndex).toBe(3.5);
    });
  });

  describe('Memory Fragment Protocol', () => {
    it('should record memory fragments for echo generation', () => {
      // Initial state
      expect(NeuralBus.memoryFragments.length).toBe(0);

      // Record a fragment (via private method)
      NeuralBus._recordMemoryFragment('test-fragment', 100);

      // Verify it was recorded
      expect(NeuralBus.memoryFragments.length).toBe(1);
      expect(NeuralBus.memoryFragments[0].type).toBe('test-fragment');
    });

    it('should retrieve random memory fragments for echo generation', () => {
      // Add several fragments
      NeuralBus._recordMemoryFragment('fragment-1', 100);
      NeuralBus._recordMemoryFragment('fragment-2', 200);
      NeuralBus._recordMemoryFragment('fragment-3', 300);

      // Get a random fragment
      const fragment = NeuralBus._getRandomMemoryFragments(1)[0];

      // Verify it's one of our fragments
      expect(['fragment-1', 'fragment-2', 'fragment-3']).toContain(fragment.type);
    });
  });

  describe('Quantum Text Glitching', () => {
    it('should apply quantum glitch effects to text based on intensity', () => {
      const testText = 'This is a test message';

      // Apply low intensity glitch
      const lowGlitch = NeuralBus._glitchText(testText, 0.2);
      // Should have some changes but be similar length
      expect(lowGlitch.length).toBe(testText.length);

      // Apply high intensity glitch
      const highGlitch = NeuralBus._glitchText(testText, 0.9);
      // Should have significant changes but be same length
      expect(highGlitch.length).toBe(testText.length);
      expect(highGlitch).not.toBe(testText);
    });
  });
});
