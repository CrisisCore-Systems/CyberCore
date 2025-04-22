// Import the mock objects from our setup
jest.mock('../../assets/quantum-visualizer');
const QuantumVisualizer = require('../../assets/quantum-visualizer');

describe('Quantum Visualizer', () => {
  describe('Initialization', () => {
    it('should initialize with correct defaults', () => {
      const visualizer = new QuantumVisualizer();

      expect(visualizer).toBeInstanceOf(QuantumVisualizer);
      expect(visualizer.dimensions).toBe('3d');
      expect(visualizer.particleCount).toBe(1000);
      expect(visualizer.initialized).toBe(true);
    });

    it('should accept custom configuration', () => {
      const config = {
        dimensions: '4d',
        particleCount: 2500,
        colorScheme: 'cyberwave',
      };

      const visualizer = new QuantumVisualizer(config);

      expect(visualizer.dimensions).toBe(config.dimensions);
      expect(visualizer.particleCount).toBe(config.particleCount);
      expect(visualizer.colorScheme).toBe(config.colorScheme);
    });
  });

  describe('Visualization Methods', () => {
    let visualizer;
    let renderSpy;

    beforeEach(() => {
      visualizer = new QuantumVisualizer();
      renderSpy = jest.spyOn(visualizer, 'render');
    });

    afterEach(() => {
      renderSpy.mockRestore();
    });

    it('should correctly visualize quantum data', () => {
      const testData = [
        { id: 'q1', state: 'superposition', probability: 0.7 },
        { id: 'q2', state: 'entangled', probability: 0.5 },
      ];

      visualizer.visualizeQuantumState(testData);

      expect(renderSpy).toHaveBeenCalled();
      expect(visualizer.currentState).toEqual(testData);
    });

    it('should apply fractal patterns when fractalMode is enabled', () => {
      visualizer = new QuantumVisualizer({ fractalMode: true });
      const applyFractalPatternsSpy = jest.spyOn(visualizer, 'applyFractalPatterns');

      visualizer.visualizeQuantumState([{ id: 'q1', state: 'superposition' }]);

      expect(applyFractalPatternsSpy).toHaveBeenCalled();
    });
  });

  describe('Event Handling', () => {
    let visualizer;
    let updateSpy;

    beforeEach(() => {
      visualizer = new QuantumVisualizer();
      updateSpy = jest.spyOn(visualizer, 'update');
    });

    afterEach(() => {
      updateSpy.mockRestore();
    });

    it('should handle data updates correctly', () => {
      const newData = [{ id: 'q3', state: 'collapsed', probability: 1.0 }];
      visualizer.updateData(newData);

      expect(updateSpy).toHaveBeenCalledWith(newData);
      expect(visualizer.currentState).toEqual(newData);
    });

    it('should trigger onStateChange callback when state changes', () => {
      const stateChangeCallback = jest.fn();
      visualizer = new QuantumVisualizer({
        onStateChange: stateChangeCallback,
      });

      const newState = [{ id: 'q1', state: 'collapsed' }];
      visualizer.updateData(newState);

      expect(stateChangeCallback).toHaveBeenCalledWith(newState);
    });
  });

  describe('Neural Bus Integration', () => {
    let visualizer;

    beforeEach(() => {
      visualizer = new QuantumVisualizer({ neuralSynced: true });
    });

    afterEach(() => {
      // Clean up to prevent memory leaks
      if (visualizer.disconnectFromNeuralBus) {
        visualizer.disconnectFromNeuralBus();
      }
    });

    it('should connect to Neural Bus when neuralSynced is true', () => {
      const connectToBusSpy = jest.spyOn(visualizer, 'connectToBus');

      // Initialize with neuralSynced: true
      const syncedVisualizer = new QuantumVisualizer({ neuralSynced: true });

      expect(connectToBusSpy).toHaveBeenCalled();

      connectToBusSpy.mockRestore();
    });

    it('should handle quantum mutation events from Neural Bus', () => {
      const updateSpy = jest.spyOn(visualizer, 'update');

      // Mock the Neural Bus event handler
      if (visualizer.handleQuantumMutation) {
        visualizer.handleQuantumMutation({
          profile: 'VoidBloom',
          timestamp: Date.now(),
        });

        expect(updateSpy).toHaveBeenCalled();
      }

      updateSpy.mockRestore();
    });

    it('should properly disconnect from Neural Bus', () => {
      // Ensure the visualizer is connected
      expect(visualizer.disconnectFromNeuralBus).toBeDefined();

      // Create spy for disconnection method
      const disconnectSpy = jest.spyOn(visualizer, 'disconnectFromNeuralBus');

      // Call disconnect
      visualizer.disconnectFromNeuralBus();

      // Verify it was called
      expect(disconnectSpy).toHaveBeenCalled();

      // Clean up
      disconnectSpy.mockRestore();
    });

    it('should handle hologram update events', () => {
      const updateSpy = jest.spyOn(visualizer, 'update');

      const testQuantumState = [{ id: 'h1', state: 'superposition', probability: 0.8 }];

      visualizer.handleHologramUpdate({ quantumState: testQuantumState });

      expect(updateSpy).toHaveBeenCalledWith(testQuantumState);

      updateSpy.mockRestore();
    });

    it('should handle cart events', () => {
      const updateSpy = jest.spyOn(visualizer, 'update');

      const testItem = { id: 'product123', name: 'Quantum Processor' };

      visualizer.handleCartEvent({ item: testItem });

      expect(updateSpy).toHaveBeenCalled();
      // Check that the update contains an entry with the item ID
      const updateCall = updateSpy.mock.calls[0][0];
      expect(updateCall.some((item) => item.id === `item-${testItem.id}`)).toBe(true);

      updateSpy.mockRestore();
    });
  });

  describe('Hologram Integration', () => {
    let visualizer;
    let mockHologram;

    beforeEach(() => {
      visualizer = new QuantumVisualizer();
      // Create a mock hologram component
      mockHologram = {
        getQuantumState: jest
          .fn()
          .mockReturnValue([{ id: 'h1', state: 'superposition', probability: 0.8 }]),
        configure: jest.fn(),
      };
    });

    it('should connect to a hologram component', () => {
      const result = visualizer.connectHologram(mockHologram);

      // Should return this for chaining
      expect(result).toBe(visualizer);
    });

    it('should gracefully handle null/undefined hologram components', () => {
      const result = visualizer.connectHologram(null);

      // Should still return this for chaining
      expect(result).toBe(visualizer);

      // Should not throw an error
      expect(() => {
        visualizer.connectHologram(undefined);
      }).not.toThrow();
    });
  });
});
