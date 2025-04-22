/**
 * TypeScript wrapper for LoreGenerator.js
 * Provides type safety while maintaining compatibility with the original lore system
 */

// Import the original JavaScript file using ES module syntax
import * as LoreGeneratorJS from './LoreGenerator.js';

// Define TypeScript interfaces for the LoreGenerator
export interface LoreFragment {
  id: string;
  type: 'backstory' | 'encounter' | 'artifact' | 'character' | 'location' | 'event';
  content: string;
  timestamp: number;
  tags: string[];
  traumaIndex: number;
  glitchFactor: number;
  metadata?: Record<string, unknown>;
}

export interface LoreGeneratorOptions {
  baseTraumaLevel?: number;
  glitchIntensity?: number;
  seedPhrase?: string;
  useRandomization?: boolean;
  fragmentTypes?: string[];
}

export interface LoreGeneratorInterface {
  // Properties
  isInitialized: boolean;
  fragmentCount: number;
  options: LoreGeneratorOptions;

  // Methods
  initialize(options?: LoreGeneratorOptions): Promise<void>;
  generateFragment(
    type?: LoreFragment['type'],
    options?: Partial<LoreGeneratorOptions>
  ): LoreFragment;
  getFragmentById(id: string): LoreFragment | null;
  getAllFragments(): LoreFragment[];
  getFragmentsByType(type: LoreFragment['type']): LoreFragment[];
  getFragmentsByTag(tag: string): LoreFragment[];
  removeFragment(id: string): boolean;
  setTraumaLevel(level: number): void;
  setGlitchIntensity(level: number): void;
  dispose(): void;
}

// Export the JavaScript module with TypeScript types
export const LoreGenerator: LoreGeneratorInterface = LoreGeneratorJS;
