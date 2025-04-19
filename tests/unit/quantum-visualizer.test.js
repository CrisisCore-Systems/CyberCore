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
                colorScheme: 'cyberwave'
            };
            
            const visualizer = new QuantumVisualizer(config);
            
            expect(visualizer.dimensions).toBe(config.dimensions);
            expect(visualizer.particleCount).toBe(config.particleCount);
            expect(visualizer.colorScheme).toBe(config.colorScheme);
        });
    });
    
    describe('Visualization Methods', () => {
        it('should correctly visualize quantum data', () => {
            const visualizer = new QuantumVisualizer();
            const renderSpy = jest.spyOn(visualizer, 'render');
            const testData = [
                { id: 'q1', state: 'superposition', probability: 0.7 },
                { id: 'q2', state: 'entangled', probability: 0.5 }
            ];
            
            visualizer.visualizeQuantumState(testData);
            
            expect(renderSpy).toHaveBeenCalledTimes(1);
            expect(visualizer.currentState).toEqual(testData);
        });
        
        it('should apply fractal patterns when fractalMode is enabled', () => {
            const visualizer = new QuantumVisualizer({ fractalMode: true });
            const applyFractalPatternsSpy = jest.spyOn(visualizer, 'applyFractalPatterns');
            
            visualizer.visualizeQuantumState([{ id: 'q1', state: 'superposition' }]);
            
            expect(applyFractalPatternsSpy).toHaveBeenCalledTimes(1);
        });
    });
    
    describe('Event Handling', () => {
        it('should handle data updates correctly', () => {
            const visualizer = new QuantumVisualizer();
            const updateSpy = jest.spyOn(visualizer, 'update');
            
            const newData = [{ id: 'q3', state: 'collapsed', probability: 1.0 }];
            visualizer.updateData(newData);
            
            expect(updateSpy).toHaveBeenCalledTimes(1);
            expect(visualizer.currentState).toEqual(newData);
        });
        
        it('should trigger onStateChange callback when state changes', () => {
            const stateChangeCallback = jest.fn();
            const visualizer = new QuantumVisualizer({ 
                onStateChange: stateChangeCallback 
            });
            
            const newState = [{ id: 'q1', state: 'collapsed' }];
            visualizer.updateData(newState);
            
            expect(stateChangeCallback).toHaveBeenCalledTimes(1);
            expect(stateChangeCallback).toHaveBeenCalledWith(newState);
        });
    });
});