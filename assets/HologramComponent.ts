/**
 * TypeScript wrapper for HologramComponent
 * This provides type safety while maintaining compatibility with the original JS code
 */

// Import the original JavaScript HologramComponent using ES module syntax
import { CartPreviewHologram } from './hologram-component.js';

// Define configuration interface for initialization
export interface HologramComponentConfig {
  hologramType?: string;
  intensity?: number;
  traumaLevel?: number;
  renderMode?: 'standard' | 'quantum' | 'hybrid';
  [key: string]: unknown;
}

// Define update props interface
export interface HologramComponentProps {
  hologramType?: string;
  intensity?: number;
  traumaLevel?: number;
  isActive?: boolean;
  renderMode?: 'standard' | 'quantum' | 'hybrid';
  [key: string]: unknown;
}

// Define the TypeScript interface for the HologramComponent
export interface HologramComponentInterface {
  // Properties
  hologramType: string;
  intensity: number;
  traumaLevel: number;
  isActive: boolean;
  renderMode: 'standard' | 'quantum' | 'hybrid';

  // Methods
  initialize(config?: HologramComponentConfig): Promise<void>;
  render(): void;
  update(props: HologramComponentProps): void;
  applyGlitch(intensity?: number, duration?: number): void;
  dispose(): void;

  // Web Component Lifecycle Methods
  connectedCallback(): void;
  disconnectedCallback(): void;
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
}

// Export the JavaScript component with TypeScript types
export const HologramComponent = CartPreviewHologram as (new () => HologramComponentInterface) &
  typeof HTMLElement;
