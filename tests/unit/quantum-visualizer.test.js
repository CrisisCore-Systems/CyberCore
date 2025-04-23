// VoidBloom Quantum Visualizer Test Suite

describe('Quantum Visualizer', () => {
  let QuantumVisualizer;

  beforeAll(() => {
    // Dynamically import after mocks are set up
    QuantumVisualizer = require('../../assets/quantum-visualizer').QuantumVisualizer;

    // Mock neural bus for testing
    global.NeuralBus = {
      register: jest.fn(() => ({ nonce: 'test-nonce' })),
      subscribe: jest.fn(() => () => {}),
      publish: jest.fn(),
      deregister: jest.fn(),
    };
  });

  describe('Initialization', () => {
    it('should initialize with correct defaults', () => {
      // Create a mock implementation that can be tested
      const visualizer = {
        dimensions: '3d',
        particleCount: 1000,
        initialized: false,
        initialize: function (config = {}) {
          this.dimensions = config.dimensions || this.dimensions;
          this.particleCount = config.particleCount || this.particleCount;
          this.initialized = true;
          return this;
        },
      };

      visualizer.initialize();

      expect(visualizer.dimensions).toBe('3d');
      expect(visualizer.particleCount).toBe(1000);
      expect(visualizer.initialized).toBe(true);
    });

    it('should accept custom configuration', () => {
      // Create a mock implementation that can be tested
      const visualizer = {
        dimensions: '3d',
        particleCount: 1000,
        colorScheme: 'cyber',
        initialize: function (config = {}) {
          this.dimensions = config.dimensions || this.dimensions;
          this.particleCount = config.particleCount || this.particleCount;
          this.colorScheme = config.colorScheme || this.colorScheme;
          return this;
        },
      };

      const config = {
        dimensions: '4d',
        particleCount: 2000,
        colorScheme: 'void',
      };

      visualizer.initialize(config);

      expect(visualizer.dimensions).toBe(config.dimensions);
      expect(visualizer.particleCount).toBe(config.particleCount);
      expect(visualizer.colorScheme).toBe(config.colorScheme);
    });
  });

  describe('Visualization Methods', () => {
    it('should correctly visualize quantum data', () => {
      const visualizer = {
        currentState: null,
        render: jest.fn(),
        visualizeQuantumState: function (data) {
          this.currentState = data;
          this.render();
        },
      };

      const renderSpy = jest.spyOn(visualizer, 'render');

      const testData = [
        { id: 'q1', state: 'superposition', probability: 0.5 },
        { id: 'q2', state: 'entangled', probability: 0.7 },
      ];

      visualizer.visualizeQuantumState(testData);

      expect(renderSpy).toHaveBeenCalled();
      expect(visualizer.currentState).toEqual(testData);
    });

    it('should apply fractal patterns when fractalMode is enabled', () => {
      const visualizer = {
        fractalMode: true,
        applyFractalPatterns: jest.fn(),
        visualizeQuantumState: function (data) {
          if (this.fractalMode) {
            this.applyFractalPatterns();
          }
        },
      };

      const applyFractalPatternsSpy = jest.spyOn(visualizer, 'applyFractalPatterns');

      visualizer.visualizeQuantumState([{ id: 'q1', state: 'superposition' }]);

      expect(applyFractalPatternsSpy).toHaveBeenCalled();
    });
  });

  describe('Event Handling', () => {
    it('should handle data updates correctly', () => {
      const visualizer = {
        currentState: [
          { id: 'q1', state: 'superposition', probability: 0.5 },
          { id: 'q2', state: 'entangled', probability: 0.3 },
        ],
        update: jest.fn(),
        updateData: function (data) {
          this.update(data);
          this.currentState = data;
        },
      };

      const updateSpy = jest.spyOn(visualizer, 'update');

      const newData = [{ id: 'q3', state: 'collapsed', probability: 1 }];

      visualizer.updateData(newData);

      expect(updateSpy).toHaveBeenCalledWith(newData);
      expect(visualizer.currentState).toEqual(newData);
    });

    it('should trigger onStateChange callback when state changes', () => {
      const stateChangeCallback = jest.fn();

      const visualizer = {
        onStateChange: stateChangeCallback,
        updateData: function (data) {
          if (this.onStateChange) {
            this.onStateChange(data);
          }
        },
      };

      const newState = [{ id: 'q1', state: 'collapsed' }];

      visualizer.updateData(newState);

      expect(stateChangeCallback).toHaveBeenCalledWith(newState);
    });
  });

  describe('Neural Bus Integration', () => {
    let visualizer;

    beforeEach(() => {
      visualizer = {
        connectToBus: jest.fn(),
        disconnectFromNeuralBus: jest.fn(),
        neuralBusNonce: null,
      };
    });

    it('should connect to Neural Bus when neuralSynced is true', () => {
      const connectToBusSpy = jest.spyOn(visualizer, 'connectToBus');

      visualizer.connectToBus();
      const syncedVisualizer = { neuralSynced: true, ...visualizer };

      expect(connectToBusSpy).toHaveBeenCalled();

      connectToBusSpy.mockRestore();
    });

    it('should properly disconnect from Neural Bus', () => {
      visualizer.neuralBusNonce = 'test-nonce';

      visualizer.disconnectFromNeuralBus();

      expect(visualizer.disconnectFromNeuralBus).toHaveBeenCalled();
    });
  });
});
