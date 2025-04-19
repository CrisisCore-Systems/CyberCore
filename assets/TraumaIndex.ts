/**
 * TypeScript wrapper for TraumaIndex.js
 * Provides type safety while maintaining compatibility with the original trauma system
 */

// Import the original JavaScript file
const TraumaIndexJS = require('./TraumaIndex.js').default || require('./TraumaIndex.js');

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

export interface TraumaIndexInterface {
  // Properties
  currentLevel: number;
  baseLevel: number;
  profiles: TraumaProfile[];
  isActive: boolean;
  lastUpdated: number;

  // Methods
  initialize(options?: any): Promise<void>;
  getCurrentLevel(): number;
  addTraumaProfile(profile: Partial<TraumaProfile>): TraumaProfile;
  addModifier(modifier: TraumaModifier): void;
  removeModifier(modifierId: string): boolean;
  clearAllModifiers(): void;
  update(timestamp?: number): number;
  generateTraumaReport(): Record<string, any>;
  dispose(): void;
}

// Export the JavaScript module with TypeScript types
export const TraumaIndex: TraumaIndexInterface = TraumaIndexJS;
