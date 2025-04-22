/**
 * Glitch Engine TypeScript Implementation
 * Provides visual glitch effects for the CyberCore system
 */

// Import the original JavaScript file using ES module syntax
import * as GlitchEngineJS from './glitch-engine.js';

// Define TypeScript interfaces for the GlitchEngine
export interface GlitchEffect {
  id: string;
  type: string;
  intensity: number;
  duration?: number; // in milliseconds
  expiresAt?: number; // timestamp
  target?: string; // CSS selector or element id
  options?: Record<string, unknown>;
}

export interface GlitchEngineOptions {
  intensity?: number;
  targetSelector?: string | HTMLElement[] | HTMLElement;
  autoStart?: boolean;
  useWebGL?: boolean;
  fpsLimit?: number;
  glitchMode?: string;
  layerCount?: number;
  glitchTypes?: string[];
  textGlitch?: boolean;
  neuralSynced?: boolean;
  debug?: boolean;
  [key: string]: unknown;
}

export interface GlitchPulseOptions {
  intensity?: number;
  duration?: number;
  mode?: string;
}

export interface GlitchEngineInterface {
  // Properties
  config: GlitchEngineOptions;
  running: boolean;
  targets: HTMLElement[];

  // Methods
  start(options?: GlitchEngineOptions): GlitchEngineJS;
  stop(): GlitchEngineJS;
  pulse(options?: GlitchPulseOptions): Promise<void>;
  setIntensity(intensity: number): GlitchEngineJS;
  setMode(mode: string): GlitchEngineJS;
  addTarget(element: HTMLElement): GlitchEngineJS;
  removeTarget(element: HTMLElement): GlitchEngineJS;
}

// Export the JavaScript module with TypeScript types
export const GlitchEngine: GlitchEngineInterface = GlitchEngineJS;
