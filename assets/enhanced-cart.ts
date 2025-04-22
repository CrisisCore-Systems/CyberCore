/**
 * TypeScript wrapper for enhanced-cart.js
 * Provides type safety while maintaining compatibility with the original cart system
 */

// Import the original JavaScript file using ES module syntax
import * as EnhancedCartJS from './enhanced-cart.js';

// Define TypeScript interfaces for the EnhancedCart
export interface CartItem {
  id: string;
  variantId?: string;
  quantity: number;
  price: number;
  title: string;
  options?: Record<string, string>;
  properties?: Record<string, unknown>;
  quantumProperties?: {
    glitchFactor?: number;
    traumaIndex?: number;
    mutationProfile?: string;
  };
}

export interface CartState {
  items: CartItem[];
  totalPrice: number;
  totalQuantity: number;
  currency: string;
  lastModified: number;
}

export interface CartInitOptions {
  useHolographicPreviews?: boolean;
  useQuantumEffects?: boolean;
  useWebGL?: boolean;
  useWorkers?: boolean;
  profile?: string;
  intensity?: number;
  debug?: boolean;
  persistenceKey?: string;
  autoSync?: boolean;
  [key: string]: unknown;
}

export interface EnhancedCartInterface {
  // Core Methods
  initialize(options?: CartInitOptions): typeof EnhancedCartJS;
  addToCart(product: any, options?: any): Promise<any>;
  applyProfile(profile: string): typeof EnhancedCartJS;
  setTraumaCodes(traumaCodes: string[]): typeof EnhancedCartJS;

  // Additional properties (static in the original implementation)
  // These would typically be accessed through the static class
}

// Export the JavaScript module with TypeScript types
export const EnhancedCart: EnhancedCartInterface = EnhancedCartJS;
