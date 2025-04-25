/**
 * HOLOGRAM-RENDERER.D.TS
 * TypeScript declarations for unified hologram renderer
 */

// Export all types and interfaces from the core implementation
export * from './core/hologram-renderer';

// Re-export the default export from the core implementation
import HologramRenderer from './core/hologram-renderer';
export default HologramRenderer;
