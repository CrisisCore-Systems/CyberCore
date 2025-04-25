/**
 * GLITCH-ENGINE.D.TS
 * TypeScript declarations for unified visual glitch engine
 */

// Export all types and interfaces from the core implementation
export * from './core/glitch-engine';

// Re-export the default export from the core implementation
import GlitchEngine from './core/glitch-engine';
export default GlitchEngine;
