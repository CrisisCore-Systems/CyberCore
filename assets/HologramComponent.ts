/**
 * TypeScript wrapper for HologramComponent
 * This provides type safety while maintaining compatibility with the original JS code
 */

// Import the original JavaScript HologramComponent
// We need to use `require` here to bypass TypeScript's module system
// This allows us to import a JavaScript module that doesn't have TypeScript types
const HologramComponentJS =
  require('./hologram-component.js').default || require('./hologram-component.js');

// Define the TypeScript interface for the HologramComponent
export interface HologramComponentInterface {
  // Properties
  hologramType: string;
  intensity: number;
  traumaLevel: number;
  isActive: boolean;
  renderMode: 'standard' | 'quantum' | 'hybrid';

  // Methods
  initialize(config?: any): Promise<void>;
  render(): void;
  update(props: any): void;
  applyGlitch(intensity?: number, duration?: number): void;
  dispose(): void;

  // Web Component Lifecycle Methods
  connectedCallback(): void;
  disconnectedCallback(): void;
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
}

// Export the JavaScript component with TypeScript types
export const HologramComponent = HologramComponentJS as (new () => HologramComponentInterface) &
  typeof HTMLElement;
