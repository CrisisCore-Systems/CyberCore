/**
 * TypeScript wrapper for TraumaIndex.js
 * Provides type safety while maintaining compatibility with the original trauma system
 */

// Import the original JavaScript file using ES module syntax
import * as TraumaIndexJS from './TraumaIndex.js';

// Define TypeScript interfaces for the TraumaIndex
export interface TraumaProfile {
  id: string;
  baseLevel: number;
  modifiers: TraumaModifier[];
  timestamp: number;
  source: string;
}

export interface TraumaModifier {
  type: string;
  value: number;
  duration?: number; // in milliseconds
  expiresAt?: number; // timestamp
  source?: string;
}

export interface TraumaInitOptions {
  baseLevel?: number;
  initialProfiles?: Partial<TraumaProfile>[];
  autoUpdate?: boolean;
  updateInterval?: number;
  [key: string]: unknown;
}

export interface TraumaIndexInterface {
  // Properties
  currentLevel: number;
  baseLevel: number;
  profiles: TraumaProfile[];
  isActive: boolean;
  lastUpdated: number;

  // Methods
  initialize(options?: TraumaInitOptions): Promise<void>;
  getCurrentLevel(): number;
  addTraumaProfile(profile: Partial<TraumaProfile>): TraumaProfile;
  addModifier(modifier: TraumaModifier): void;
  removeModifier(modifierId: string): boolean;
  clearAllModifiers(): void;
  update(timestamp?: number): number;
  generateTraumaReport(): Record<string, unknown>;
  dispose(): void;
}

// Export the JavaScript module with TypeScript types
export const TraumaIndex: TraumaIndexInterface = TraumaIndexJS;
