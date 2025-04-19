/**
 * TypeScript wrapper for enhanced-cart.js
 * Provides type safety while maintaining compatibility with the original cart system
 */

// Import the original JavaScript file
const EnhancedCartJS = require('./enhanced-cart.js').default || require('./enhanced-cart.js');

// Define TypeScript interfaces for the EnhancedCart
export interface CartItem {
  id: string;
  variantId?: string;
  quantity: number;
  price: number;
  title: string;
  options?: Record<string, string>;
  properties?: Record<string, any>;
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

export interface EnhancedCartInterface {
  // Properties
  state: CartState;
  isReady: boolean;

  // Core Methods
  initialize(options?: any): Promise<void>;
  refresh(): Promise<CartState>;

  // Cart Manipulation Methods
  addItem(item: Partial<CartItem>): Promise<CartState>;
  updateItem(id: string, updates: Partial<CartItem>): Promise<CartState>;
  removeItem(id: string): Promise<CartState>;
  clearCart(): Promise<CartState>;

  // Additional Enhanced Methods
  applyQuantumProperties(
    itemId: string,
    properties: CartItem['quantumProperties']
  ): Promise<CartState>;
  generateMutationProfile(): Promise<string>;

  // Event Methods
  onUpdate(callback: (state: CartState) => void): string;
  offUpdate(callbackId: string): boolean;
}

// Export the JavaScript module with TypeScript types
export const EnhancedCart: EnhancedCartInterface = EnhancedCartJS;
