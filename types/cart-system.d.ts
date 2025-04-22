// This file provides type declarations for the cart-system.js file
// to help TypeScript understand the private class fields syntax

interface CartSystemConfig {
  cartDrawerSelector: string;
  cartIconSelector: string;
  cartCountSelector: string;
  cartTotalSelector: string;
  addToCartFormSelector: string;
  cartItemSelector: string;
  cartItemRemoveSelector: string;
  cartItemQuantitySelector: string;
  cartDrawerToggleSelector: string;
  cartEmptyMessageSelector: string;
  cartErrorSelector: string;
  cartRecommendationsSelector: string;
  cartCheckoutButtonSelector: string;
  continueShoppingSelector: string;
  cartPreviewContainerSelector: string;
  neuralSynced: boolean;
  useQuantumEffects: boolean;
  useHolographicPreviews: boolean;
  debug: boolean;
  apiEndpoints: {
    cartAdd: string;
    cartUpdate: string;
    cartChange: string;
    cartGet: string;
    cartClear: string;
  };
}

/**
 *
 */
declare class CartSystem {
  /**
   *
   */
  static initialize(options?: Partial<CartSystemConfig>): CartSystem;
  /**
   *
   */
  static getCart(): Promise<any>;
  /**
   *
   */
  static addToCart(
    variantId: number | string,
    quantity?: number,
    properties?: Record<string, any>
  ): Promise<any>;
  /**
   *
   */
  static updateItemQuantity(key: string, quantity: number): Promise<any>;
  /**
   *
   */
  static removeItem(key: string): Promise<any>;
  /**
   *
   */
  static clearCart(): Promise<any>;
  /**
   *
   */
  static openCartDrawer(): void;
  /**
   *
   */
  static closeCartDrawer(): void;
  /**
   *
   */
  static toggleCartDrawer(): void;
  /**
   *
   */
  static setActiveProduct(product: any): void;
  /**
   *
   */
  static isCartDrawerOpen(): boolean;
}

// Global declarations
interface Window {
  CartSystem: typeof CartSystem;
  dynamicImport?: (path: string) => Promise<any>;
  QuantumVisualizer?: any;
  THREE?: any;
  voidBloom?: any;
}
