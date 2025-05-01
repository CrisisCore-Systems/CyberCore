/**
 * Type definitions for CartCore
 */
import { CartExtension } from './cart-extension-interface';

export interface CartConfig {
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
  debug: boolean;
  apiEndpoints: {
    cartAdd: string;
    cartUpdate: string;
    cartChange: string;
    cartGet: string;
    cartClear: string;
  };

  // Extension-specific configurations
  holographicOptions?: {
    containerSelector?: string;
    useQuantumEffects?: boolean;
    intensity?: number;
    traumaCodes?: string[];
    profile?: string;
    debug?: boolean;
  };

  quantumEffectsOptions?: {
    useWorker?: boolean;
    profile?: string;
    intensity?: number;
    traumaCodes?: string[];
    debug?: boolean;
  };
}

export declare class CartCore {
  static config: CartConfig;
  static instance: CartCore | null;
  static eventHandlersAttached: boolean;
  static isOpen: boolean;
  static cartData: any;
  static neuralBusConnected: boolean;
  static extensions: CartExtension[];
  static initialized: boolean;

  static initialize(options?: Partial<CartConfig>): CartCore;
  static registerExtension(extension: CartExtension): void;
  static getCart(): any;

  static addItem(item: {
    id: string | number;
    quantity: number;
    properties?: Record<string, any>;
  }): Promise<any>;

  static updateItemQuantity(id: string, quantity: number): Promise<any>;
  static removeItem(id: string): Promise<any>;
  static clearCart(): Promise<any>;
  static openCartDrawer(): void;
  static closeCartDrawer(): void;
  static toggleCartDrawer(): void;
  static isCartDrawerOpen(): boolean;
}
