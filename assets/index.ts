/**
 * CyberCore Entry Point
 *
 * This file imports and exports all components for use in the bundle
 * Version: 2.0.0
 * Date: April 19, 2025
 */

// Import Web Components
import { HologramComponent } from './HologramComponent';

// Import the NeuralBus instance (not the type)
import NeuralBusInstance from './core/neural-bus';

// Import core services
// Commented out the missing enhanced-cart export
// export { EnhancedCart } from './enhanced-cart';
export { NeuralBus } from './neural-bus';
export { QuantumWebGL } from './quantum-webgl';

// Import WebGL bridge
export { LoreGenerator } from './LoreGenerator';
export { MemoryProtocol } from './memory-protocol';
export { QEARWebGLBridge } from './qear-webgl-bridge';
export { TraumaIndex } from './TraumaIndex';
export { GlitchEngine };

// Import utilities
// Fixed the GlitchEngine export to use default import
import GlitchEngine from './glitch-engine';

// Register Web Components if not already registered
if (!customElements.get('quantum-hologram')) {
  customElements.define('quantum-hologram', HologramComponent);
}

// Initialize services with webpack environment variables
const DEBUG_MODE = process.env.NODE_ENV !== 'production';

// Auto-initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.info('CyberCore initialized in ' + (DEBUG_MODE ? 'development' : 'production') + ' mode');

  // Initialize the NeuralBus event system
  NeuralBusInstance.initialize();

  // Register all components with the NeuralBus
  NeuralBusInstance.register('hologram-component', { version: '2.0.0' });
  NeuralBusInstance.register('enhanced-cart', { version: '2.0.0' });
  NeuralBusInstance.register('quantum-webgl', { version: '2.0.0' });

  // Publish initialization event
  NeuralBusInstance.publish('cybercore:initialized', {
    timestamp: Date.now(),
    environment: DEBUG_MODE ? 'development' : 'production',
    components: ['hologram-component', 'enhanced-cart', 'quantum-webgl'],
  });
});
