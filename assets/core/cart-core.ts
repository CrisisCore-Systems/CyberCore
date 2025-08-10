/**
 * CART-CORE.TS
 * Core cart functionality for CyberCore theme
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * @Version: 3.0.0
 */

import { CartExtension } from './cart-extension-interface';
import { NeuralBus } from './neural-bus';

/**
 * CartCore
 * Core cart management system with extension support
 */
export class CartCore {
  // Configuration and state
  static config = {
    cartDrawerSelector: '#cart-drawer',
    cartIconSelector: '#cart-icon-bubble',
    cartCountSelector: '#cart-count',
    cartTotalSelector: '#cart-total',
    addToCartFormSelector: 'form[action="/cart/add"]',
    cartItemSelector: '.cart-item',
    cartItemRemoveSelector: '.cart-item__remove',
    cartItemQuantitySelector: '.cart-item__quantity-input',
    cartDrawerToggleSelector: '[data-cart-toggle]',
    cartEmptyMessageSelector: '.cart-empty-message',
    cartErrorSelector: '.cart-error',
    cartRecommendationsSelector: '.cart-recommendations',
    cartCheckoutButtonSelector: '#cart-checkout-button',
    continueShoppingSelector: '#continue-shopping',
    cartPreviewContainerSelector: '#cart-preview-container',
    neuralSynced: true,
    debug: false,
    apiEndpoints: {
      cartAdd: '/cart/add.js',
      cartUpdate: '/cart/update.js',
      cartChange: '/cart/change.js',
      cartGet: '/cart.js',
      cartClear: '/cart/clear.js',
    },
  };

  static instance: CartCore | null = null;
  static eventHandlersAttached = false;
  static isOpen = false;
  static cartData: any = null;
  static neuralBusConnected = false;
  static extensions: CartExtension[] = [];
  static initialized = false;

  /**
   * Initialize the cart system
   * @param {Object} options - Configuration overrides
   */
  static initialize(options: Partial<typeof CartCore.config> = {}): CartCore {
    if (this.initialized) return this.instance!;

    Object.assign(this.config, options);
    this.attachEventHandlers();
    this.fetchCart().then(() => this.updateCartUI());

    if (this.config.neuralSynced) {
      this.connectToNeuralBus();
    }

    if (this.config.debug) {
      console.log('[CartCore] Initialized', this.config);
    }

    this.initialized = true;
    this.instance = new CartCore();
    return this.instance;
  }

  /**
   * Register an extension with the cart system
   * @param extension - The extension to register
   */
  static registerExtension(extension: CartExtension): void {
    // Check if extension is already registered
    if (this.extensions.some((ext) => ext.name === extension.name)) {
      if (this.config.debug) {
        console.warn(`[CartCore] Extension '${extension.name}' already registered.`);
      }
      return;
    }

    // Add to extensions list
    this.extensions.push(extension);

    // Initialize the extension if cart is already initialized
    if (this.initialized) {
      try {
        extension.initialize(this);
        if (this.config.debug) {
          console.log(`[CartCore] Extension '${extension.name}' initialized.`);
        }
      } catch (error) {
        console.error(`[CartCore] Failed to initialize extension '${extension.name}':`, error);
      }
    }
  }

  /**
   * Get the current cart data
   * @returns Cart data
   */
  static getCart(): any {
    
    // @crisiscore-hardened: return immutable snapshot
    const clone = (v:any) => JSON.parse(JSON.stringify(v ?? null));
    const deepFreeze = (o:any) => { if(!o||typeof o!=='object'||Object.isFrozen(o)) return o; Object.freeze(o); for(const k of Object.keys(o)) deepFreeze(o[k]); return o; };
    return deepFreeze(clone(this.cartData));

}

// Auto-initialize when loaded if in browser environment
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    CartCore.initialize({ debug: window.location.search.includes('debug=true') });
    (window as any).CartCore = CartCore;
  });
}
