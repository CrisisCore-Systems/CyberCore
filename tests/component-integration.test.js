// Integration tests for CyberCore components
import { ConfigDomain, ConfigManager, ConfigPriority } from '../assets/config-manager.js';
import { ErrorHandler } from '../assets/error-handler.js';
import { NeuralBus } from '../assets/neural-bus.js';
import { OptimizationLevel, PerformanceMonitor } from '../assets/performance-monitor.js';
import { QuantumWebGLController } from '../assets/quantum-webgl.js';

describe('CyberCore Component Integration', () => {
  let errorHandler;
  let configManager;
  let performanceMonitor;
  let visualizer;
  let container;

  beforeEach(() => {
    // Create a container element for the visualizer
    container = document.createElement('div');
    container.style.width = '800px';
    container.style.height = '600px';
    document.body.appendChild(container);

    // Initialize core components
    errorHandler = new ErrorHandler({ componentName: 'test-integration' });
    configManager = new ConfigManager();
    performanceMonitor = new PerformanceMonitor();

    // Reset NeuralBus subscription cache if needed
    if (typeof NeuralBus.reset === 'function') {
      NeuralBus.reset();
    }

    // Initialize visualization component
    visualizer = new QuantumWebGLController();
  });

  afterEach(() => {
    // Clean up
    if (visualizer) {
      visualizer.dispose();
    }

    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }

    container = null;
    visualizer = null;
    performanceMonitor = null;
    configManager = null;
    errorHandler = null;
  });

  // Test configuration system integration
  describe('Configuration System Integration', () => {
    it('should propagate config changes to visualization component', async () => {
      // Arrange
      await visualizer.initialize(container, {
        width: 800,
        height: 600,
        particleCount: 2000
      });

      // Create spy to check if setGlitchIntensity is called
      const spy = jest.spyOn(visualizer, 'setGlitchIntensity');

      // Act - change configuration through config manager
      configManager.set(ConfigDomain.VISUALIZATION, 'glitchIntensity', 0.75, ConfigPriority.OVERRIDE);

      // Allow time for event propagation
      await new Promise(resolve => setTimeout(resolve, 50));

      // Assert
      expect(spy).toHaveBeenCalledWith(0.75);
      expect(visualizer.glitchIntensity).toBe(0.75);
    });

    it('should use configuration priorities correctly', async () => {
      // Arrange
      await visualizer.initialize(container);

      // Act - set configuration at different priority levels
      configManager.set(ConfigDomain.VISUALIZATION, 'traumaFactor', 0.3, ConfigPriority.DEFAULT);
      configManager.set(ConfigDomain.VISUALIZATION, 'traumaFactor', 0.5, ConfigPriority.COHERENCE);
      configManager.set(ConfigDomain.VISUALIZATION, 'traumaFactor', 0.1, ConfigPriority.DEFAULT); // Should be ignored (lower priority)

      // Assert
      expect(configManager.get(ConfigDomain.VISUALIZATION, 'traumaFactor')).toBe(0.5);
      expect(visualizer.traumaFactor).toBe(0.5);

      // Act - set a higher priority
      configManager.set(ConfigDomain.VISUALIZATION, 'traumaFactor', 0.8, ConfigPriority.OVERRIDE);

      // Assert
      expect(configManager.get(ConfigDomain.VISUALIZATION, 'traumaFactor')).toBe(0.8);
      expect(visualizer.traumaFactor).toBe(0.8);
    });
  });

  // Test error handling integration
  describe('Error Handling Integration', () => {
    it('should recover from initialization errors', async () => {
      // Arrange - prepare a bad container to trigger error
      container.style.display = 'none'; // This might cause issues with WebGL initialization

      // Mock the recover method to check if it gets called
      const recoverSpy = jest.spyOn(visualizer, 'recover').mockResolvedValue(true);

      // Act & Assert - initialization should call recover
      try {
        await visualizer.initialize(container);
      } catch (e) {
        // Expected error, we're testing recovery mechanisms
      }

      // Check if recover was called
      expect(recoverSpy).toHaveBeenCalled();
    });

    it('should publish error events to NeuralBus', async () => {
      // Arrange
      const neuralBusSpy = jest.spyOn(NeuralBus, 'publish');
      await visualizer.initialize(container);

      // Act - trigger an error
      try {
        // Force an error by calling a method with invalid arguments
        visualizer.applyMutation(null);
      } catch (e) {
        // Expected error
      }

      // Assert - check if error was published to NeuralBus
      expect(neuralBusSpy).toHaveBeenCalledWith(
        expect.stringContaining('error'),
        expect.objectContaining({
          category: expect.any(String),
          componentName: 'quantum-webgl',
        })
      );
    });
  });

  // Test performance monitoring integration
  describe('Performance Monitoring Integration', () => {
    it('should apply optimizations to visualization component', async () => {
      // Arrange
      await visualizer.initialize(container, {
        particleCount: 2000,
        performanceMonitoring: {
          enabled: true,
          autoOptimize: true
        }
      });

      const originalParticleCount = visualizer.particleCount;

      // Act - trigger performance optimization
      performanceMonitor.applyOptimizations(OptimizationLevel.MEDIUM);

      // Allow time for event propagation and optimization application
      await new Promise(resolve => setTimeout(resolve, 100));

      // Assert - particle count should be reduced
      expect(visualizer.particleCount).toBeLessThan(originalParticleCount);
    });

    it('should measure component operations correctly', async () => {
      // Arrange
      await visualizer.initialize(container);

      // Start performance monitoring
      performanceMonitor.start();

      // Act - create a transaction to measure
      const endMeasure = performanceMonitor.startMeasure('test-component', 'complex-operation');

      // Simulate work (e.g., 50ms of processing)
      await new Promise(resolve => setTimeout(resolve, 50));

      // Complete measurement
      const duration = endMeasure();

      // Assert
      expect(duration).toBeGreaterThanOrEqual(45); // Allow some flexibility in timing

      // Check that the component performance data was stored
      const componentPerformance = performanceMonitor.getComponentPerformance('test-component');
      expect(componentPerformance).toBeDefined();
      expect(componentPerformance['complex-operation']).toBeDefined();
      expect(componentPerformance['complex-operation'].lastTime).toBeGreaterThanOrEqual(45);
    });
  });

  // Test neural bus event communication
  describe('NeuralBus Event Communication', () => {
    it('should handle trauma activation events correctly', async () => {
      // Arrange
      await visualizer.initialize(container);

      // Create spy to check if setTraumaFactor is called
      const spy = jest.spyOn(visualizer, 'setTraumaFactor');

      // Act - publish trauma event
      NeuralBus.publish('trauma:activated', {
        intensity: 0.85,
        type: 'quantum-rift',
        timestamp: Date.now()
      });

      // Allow time for event propagation
      await new Promise(resolve => setTimeout(resolve, 50));

      // Assert
      expect(spy).toHaveBeenCalledWith(0.85);
      expect(visualizer.traumaFactor).toBe(0.85);
    });

    it('should handle coherence state events correctly', async () => {
      // Arrange
      await visualizer.initialize(container);

      // Create spy to check if setGlitchIntensity is called
      const spy = jest.spyOn(visualizer, 'setGlitchIntensity');

      // Act - publish coherence event
      // Note: Lower coherence means higher glitch intensity (inverted)
      NeuralBus.publish('coherence:state:saved', {
        coherenceLevel: 0.3, // 30% coherence
        timestamp: Date.now()
      });

      // Allow time for event propagation
      await new Promise(resolve => setTimeout(resolve, 50));

      // Assert - glitch intensity should be 0.7 (1.0 - 0.3)
      expect(spy).toHaveBeenCalledWith(0.7);
      expect(visualizer.glitchIntensity).toBe(0.7);
    });

    it('should publish visualization events when state changes', async () => {
      // Arrange
      const neuralBusSpy = jest.spyOn(NeuralBus, 'publish');
      await visualizer.initialize(container);

      // Reset spy to clear initialization events
      neuralBusSpy.mockClear();

      // Act - start visualization
      visualizer.start();

      // Assert - check if started event was published
      expect(neuralBusSpy).toHaveBeenCalledWith(
        'quantum:visualization:started',
        expect.objectContaining({
          timestamp: expect.any(Number)
        })
      );

      // Reset spy again
      neuralBusSpy.mockClear();

      // Act - stop visualization
      visualizer.stop();

      // Assert - check if stopped event was published
      expect(neuralBusSpy).toHaveBeenCalledWith(
        'quantum:visualization:stopped',
        expect.objectContaining({
          timestamp: expect.any(Number)
        })
      );
    });
  });

  // End-to-end test of the complete system
  describe('Complete System Integration', () => {
    it('should handle a complete workflow correctly', async () => {
      // Arrange
      await visualizer.initialize(container, {
        performanceMonitoring: { enabled: true, autoOptimize: true }
      });
      visualizer.start();

      // Spies for key methods
      const traumaSpy = jest.spyOn(visualizer, 'setTraumaFactor');
      const glitchSpy = jest.spyOn(visualizer, 'setGlitchIntensity');
      const mutationSpy = jest.spyOn(visualizer, 'applyMutation');

      // Act - simulate a sequence of events

      // 1. Coherence state changes
      NeuralBus.publish('coherence:state:saved', {
        coherenceLevel: 0.4,
        timestamp: Date.now()
      });

      await new Promise(resolve => setTimeout(resolve, 30));

      // 2. Trauma is activated
      NeuralBus.publish('trauma:activated', {
        intensity: 0.75,
        type: 'reality-shift',
        timestamp: Date.now()
      });

      await new Promise(resolve => setTimeout(resolve, 30));

      // 3. Quantum mutation occurs
      NeuralBus.publish('quantum:mutation', {
        profile: {
          intensity: 0.6,
          pattern: 'fractal-dissociation',
          colorShift: 0.3
        },
        timestamp: Date.now()
      });

      await new Promise(resolve => setTimeout(resolve, 30));

      // 4. Performance optimization is requested
      NeuralBus.publish('performance:optimize:request', {
        level: OptimizationLevel.LOW,
        target: 'visualization',
        timestamp: Date.now()
      });

      // Allow time for all events to process
      await new Promise(resolve => setTimeout(resolve, 100));

      // Assert - verify all events were handled correctly
      expect(glitchSpy).toHaveBeenCalledWith(0.6); // 1 - 0.4 coherence
      expect(traumaSpy).toHaveBeenCalledWith(0.75);
      expect(mutationSpy).toHaveBeenCalledWith(expect.objectContaining({
        intensity: 0.6,
        pattern: 'fractal-dissociation'
      }));

      // Performance optimization should have reduced particle count
      const originalParticleCount = 2000; // Default value
      expect(visualizer.particleCount).toBeLessThan(originalParticleCount);

      // Clean up
      visualizer.stop();
    });
  });
});
