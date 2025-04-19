/**
 * TypeScript wrapper for glitch-engine.js
 * Provides type safety while maintaining compatibility with the original glitch system
 */

// Import the original JavaScript file
const GlitchEngineJS = require('./glitch-engine.js').default || require('./glitch-engine.js');

// Define TypeScript interfaces for the GlitchEngine
export interface GlitchEffect {
  id: string;
  type: string;
  intensity: number;
  duration?: number; // in milliseconds
  expiresAt?: number; // timestamp
  target?: string; // CSS selector or element id
  options?: Record<string, any>;
}

export interface GlitchEngineInterface {
  // Properties
  isActive: boolean;
  currentEffects: GlitchEffect[];
  baseIntensity: number;
  lastUpdated: number;

  // Methods
  initialize(options?: any): Promise<void>;
  applyEffect(effect: Partial<GlitchEffect>): GlitchEffect;
  removeEffect(effectId: string): boolean;
  clearAllEffects(): void;
  setBaseIntensity(value: number): void;
  getCurrentIntensity(): number;
  update(timestamp?: number): void;
  dispose(): void;
}

// Export the JavaScript module with TypeScript types
export const GlitchEngine: GlitchEngineInterface = GlitchEngineJS;
