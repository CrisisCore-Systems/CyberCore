/**
 * CyberCore Entry Point
 *
 * This file imports and exports all components for use in the bundle
 * Version: 2.0.0
 * Date: April 19, 2025
 */

// Import Web Components
export { HologramComponent } from './HologramComponent';

// Import core services
export { EnhancedCart } from './enhanced-cart';
export { NeuralBus } from './neural-bus';
export { QuantumWebGLController } from './quantum-webgl';

// Import WebGL bridge
export { QEARWebGLBridge } from './qear-webgl-bridge';

// Import utilities
export { GlitchEngine } from './glitch-engine';
export { LoreGenerator } from './LoreGenerator';
export { MemoryProtocol } from './memory-protocol';
export { TraumaIndex } from './TraumaIndex';

// Register Web Components if not already registered
if (!customElements.get('quantum-hologram')) {
  customElements.define('quantum-hologram', HologramComponent as any);
}

// Initialize services with webpack environment variables
const DEBUG_MODE = process.env.NODE_ENV !== 'production';

// Auto-initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.info('CyberCore initialized in ' + (DEBUG_MODE ? 'development' : 'production') + ' mode');

  // Initialize the NeuralBus event system
  NeuralBus.initialize();

  // Register all components with the NeuralBus
  NeuralBus.register('hologram-component', { version: '2.0.0' });
  NeuralBus.register('enhanced-cart', { version: '2.0.0' });
  NeuralBus.register('quantum-webgl', { version: '2.0.0' });

  // Publish initialization event
  NeuralBus.publish('cybercore:initialized', {
    timestamp: Date.now(),
    environment: DEBUG_MODE ? 'development' : 'production',
    components: ['hologram-component', 'enhanced-cart', 'quantum-webgl'],
  });
});
