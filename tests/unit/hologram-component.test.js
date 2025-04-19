// Import the mock objects from our setup
jest.mock('../../assets/hologram-component');
const HologramComponent = require('../../assets/hologram-component');

describe('Hologram Component', () => {
    describe('Initialization', () => {
        it('should initialize with default settings', () => {
            const hologram = new HologramComponent();
            
            expect(hologram).toBeInstanceOf(HologramComponent);
            expect(hologram.initialized).toBe(true);
            expect(hologram.intensity).toBe(1.0);
            expect(hologram.renderMode).toBe('standard');
        });
        
        it('should accept custom configuration options', () => {
            const config = {
                intensity: 0.75,
                renderMode: 'quantum',
                enableGlitch: true
            };
            
            const hologram = new HologramComponent(config);
            
            expect(hologram.intensity).toBe(config.intensity);
            expect(hologram.renderMode).toBe(config.renderMode);
            expect(hologram.glitchEnabled).toBe(true);
        });
    });
    
    describe('Rendering', () => {
        it('should render hologram elements', () => {
            const hologram = new HologramComponent();
            const renderSpy = jest.spyOn(hologram, 'render');
            const containerElement = document.createElement('div');
            
            hologram.render(containerElement);
            
            expect(renderSpy).toHaveBeenCalledTimes(1);
            expect(renderSpy).toHaveBeenCalledWith(containerElement);
        });
        
        it('should apply quantum effects when in quantum mode', () => {
            const hologram = new HologramComponent({ renderMode: 'quantum' });
            const applyQuantumEffectsSpy = jest.spyOn(hologram, 'applyQuantumEffects');
            
            hologram.render(document.createElement('div'));
            
            expect(applyQuantumEffectsSpy).toHaveBeenCalledTimes(1);
        });
    });
    
    describe('Event Handling', () => {
        it('should trigger onInteraction callback when interacted with', () => {
            const interactionCallback = jest.fn();
            const hologram = new HologramComponent({ 
                onInteraction: interactionCallback 
            });
            
            hologram.handleInteraction({ type: 'hover' });
            
            expect(interactionCallback).toHaveBeenCalledTimes(1);
            expect(interactionCallback).toHaveBeenCalledWith({ type: 'hover' });
        });
    });
});