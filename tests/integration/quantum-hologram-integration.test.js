// Import the mock objects from our setup
jest.mock('../../assets/hologram-component');
jest.mock('../../assets/quantum-visualizer');
jest.mock('../../assets/glitch-engine');
jest.mock('../../assets/neural-bus');

const HologramComponent = require('../../assets/hologram-component');
const QuantumVisualizer = require('../../assets/quantum-visualizer');
const GlitchEngine = require('../../assets/glitch-engine');
const NeuralBus = require('../../assets/neural-bus');

describe('Quantum Hologram System Integration', () => {
  describe('Component Integration', () => {
    it('should connect hologram with quantum visualizer', () => {
      // Create components
      const hologram = new HologramComponent();
      const visualizer = new QuantumVisualizer();
            
      // Spy on methods
      const hologramRenderSpy = jest.spyOn(hologram, 'render');
      const visualizerUpdateSpy = jest.spyOn(visualizer, 'updateData');
            
      // Connect components
      hologram.connectVisualizer(visualizer);
            
      // Simulate quantum state change
      const quantumState = [{ id: 'q1', state: 'superposition', probability: 0.7 }];
      hologram.updateQuantumState(quantumState);
            
      // Verify integration
      expect(visualizerUpdateSpy).toHaveBeenCalledTimes(1);
      expect(visualizerUpdateSpy).toHaveBeenCalledWith(quantumState);
      expect(hologramRenderSpy).toHaveBeenCalledTimes(1);
    });
        
    it('should apply glitch effects via the glitch engine', () => {
      const hologram = new HologramComponent();
      const glitchEngine = new GlitchEngine();
            
      // Spy on methods
      const applyGlitchSpy = jest.spyOn(glitchEngine, 'applyGlitch');
            
      // Connect components
      hologram.connectGlitchEngine(glitchEngine);
            
      // Trigger glitch
      hologram.triggerGlitch({ intensity: 0.8, duration: 500 });
            
      // Verify integration
      expect(applyGlitchSpy).toHaveBeenCalledTimes(1);
      expect(applyGlitchSpy).toHaveBeenCalledWith(expect.objectContaining({
        intensity: 0.8
      }));
    });
        
    it('should communicate via neural bus', () => {
      const hologram = new HologramComponent();
      const visualizer = new QuantumVisualizer();
      const neuralBus = new NeuralBus();
            
      // Spy on methods
      const publishSpy = jest.spyOn(neuralBus, 'publish');
      const subscribeSpy = jest.spyOn(neuralBus, 'subscribe');
            
      // Connect components to neural bus
      hologram.connectToBus(neuralBus);
      visualizer.connectToBus(neuralBus);
            
      // Verify connections
      expect(subscribeSpy).toHaveBeenCalledTimes(2);
            
      // Publish event
      hologram.publishEvent('quantum-shift', { level: 3 });
            
      // Verify event published
      expect(publishSpy).toHaveBeenCalledTimes(1);
      expect(publishSpy).toHaveBeenCalledWith('quantum-shift', { level: 3 });
    });
  });
    
  describe('End-to-End Workflow', () => {
    it('should process quantum mutations through the entire system', () => {
      // Create system components
      const hologram = new HologramComponent();
      const visualizer = new QuantumVisualizer();
      const glitchEngine = new GlitchEngine();
      const neuralBus = new NeuralBus();
            
      // Connect components
      hologram.connectVisualizer(visualizer);
      hologram.connectGlitchEngine(glitchEngine);
      hologram.connectToBus(neuralBus);
      visualizer.connectToBus(neuralBus);
      glitchEngine.connectToBus(neuralBus);
            
      // Spies
      const hologramProcessSpy = jest.spyOn(hologram, 'processMutation');
      const visualizerRenderSpy = jest.spyOn(visualizer, 'render');
      const glitchEffectSpy = jest.spyOn(glitchEngine, 'applyGlitch');
            
      // Simulate a full mutation workflow
      neuralBus.publish('initiate-mutation', {
        targetId: 'quantum-core',
        mutationType: 'fractal',
        intensity: 0.85
      });
            
      // Verify complete workflow
      expect(hologramProcessSpy).toHaveBeenCalledTimes(1);
      expect(visualizerRenderSpy).toHaveBeenCalledTimes(1);
      expect(glitchEffectSpy).toHaveBeenCalledTimes(1);
    });
  });
});