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
    return this.cartData;
  }

  /**
   * Add an item to the cart
   * @param {Object} item - Item to add
   * @returns {Promise} Promise that resolves when the item is added
   */
  static async addItem(item: {
    id: string | number;
    quantity: number;
    properties?: Record<string, any>;
  }): Promise<any> {
    try {
      const data = await this.postToShopify(this.config.apiEndpoints.cartAdd, item);
      await this.fetchCart();
      this.updateCartUI();

      // Notify extensions
      this.notifyExtensions('itemAdded', item);

      if (this.neuralBusConnected) {
        NeuralBus.publish('cart:item-added', { item, cart: this.cartData });
      }

      return data;
    } catch (error) {
      console.error('[CartCore] Error adding item to cart:', error);
      throw error;
    }
  }

  /**
   * Update an item's quantity in the cart
   * @param {string} id - Item ID
   * @param {number} quantity - New quantity
   * @returns {Promise} Promise that resolves when the item is updated
   */
  static async updateItemQuantity(id: string, quantity: number): Promise<any> {
    try {
      const data = await this.postToShopify(this.config.apiEndpoints.cartChange, {
        id,
        quantity,
      });
      await this.fetchCart();
      this.updateCartUI();

      // Notify extensions
      this.notifyExtensions('itemUpdated', { id, quantity });

      if (this.neuralBusConnected) {
        NeuralBus.publish('cart:item-updated', { id, quantity, cart: this.cartData });
      }

      return data;
    } catch (error) {
      console.error('[CartCore] Error updating item quantity:', error);
      throw error;
    }
  }

  /**
   * Remove an item from the cart
   * @param {string} id - Item ID
   * @returns {Promise} Promise that resolves when the item is removed
   */
  static async removeItem(id: string): Promise<any> {
    try {
      const data = await this.postToShopify(this.config.apiEndpoints.cartChange, {
        id,
        quantity: 0,
      });
      await this.fetchCart();
      this.updateCartUI();

      // Notify extensions
      this.notifyExtensions('itemRemoved', { id });

      if (this.neuralBusConnected) {
        NeuralBus.publish('cart:item-removed', { id, cart: this.cartData });
      }

      return data;
    } catch (error) {
      console.error('[CartCore] Error removing item from cart:', error);
      throw error;
    }
  }

  /**
   * Clear the cart
   * @returns {Promise} Promise that resolves when the cart is cleared
   */
  static async clearCart(): Promise<any> {
    try {
      const data = await this.postToShopify(this.config.apiEndpoints.cartClear, {});
      await this.fetchCart();
      this.updateCartUI();

      // Notify extensions
      this.notifyExtensions('cartCleared', {});

      if (this.neuralBusConnected) {
        NeuralBus.publish('cart:cleared', { cart: this.cartData });
      }

      return data;
    } catch (error) {
      console.error('[CartCore] Error clearing cart:', error);
      throw error;
    }
  }

  /**
   * Open the cart drawer
   */
  static openCartDrawer(): void {
    const drawer = document.querySelector(this.config.cartDrawerSelector);
    if (!drawer) return;

    drawer.classList.add('cart-drawer--open');
    document.body.classList.add('cart-drawer-open');
    this.isOpen = true;

    // Notify extensions
    this.notifyExtensions('cartOpened', {});

    if (this.neuralBusConnected) {
      NeuralBus.publish('cart:opened', {});
    }
  }

  /**
   * Close the cart drawer
   */
  static closeCartDrawer(): void {
    const drawer = document.querySelector(this.config.cartDrawerSelector);
    if (!drawer) return;

    drawer.classList.remove('cart-drawer--open');
    document.body.classList.remove('cart-drawer-open');
    this.isOpen = false;

    // Notify extensions
    this.notifyExtensions('cartClosed', {});

    if (this.neuralBusConnected) {
      NeuralBus.publish('cart:closed', {});
    }
  }

  /**
   * Toggle the cart drawer
   */
  static toggleCartDrawer(): void {
    if (this.isOpen) {
      this.closeCartDrawer();
    } else {
      this.openCartDrawer();
    }
  }

  /**
   * Check if the cart drawer is open
   * @returns {boolean} Whether the cart drawer is open
   */
  static isCartDrawerOpen(): boolean {
    return this.isOpen;
  }

  /**
   * Attach DOM event handlers
   */
  private static attachEventHandlers(): void {
    if (this.eventHandlersAttached) return;

    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll(this.config.cartDrawerToggleSelector).forEach((btn) =>
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggleCartDrawer();
        })
      );

      // Add to cart form handling
      document.querySelectorAll(this.config.addToCartFormSelector).forEach((form) =>
        form.addEventListener('submit', async (e) => {
          e.preventDefault();

          const formData = new FormData(form as HTMLFormElement);
          const id = formData.get('id')?.toString();
          const quantity = parseInt(formData.get('quantity')?.toString() || '1');

          if (!id) return;

          try {
            await this.addItem({ id, quantity });
            this.openCartDrawer();
          } catch (error) {
            console.error('[CartCore] Error adding item from form:', error);
          }
        })
      );

      // Cart item quantity changes
      document.querySelectorAll(this.config.cartItemQuantitySelector).forEach((input) =>
        input.addEventListener('change', async (e) => {
          const target = e.target as HTMLInputElement;
          const quantity = parseInt(target.value);
          const id = target.dataset.id;

          if (!id) return;

          try {
            await this.updateItemQuantity(id, quantity);
          } catch (error) {
            console.error('[CartCore] Error updating quantity from input:', error);
          }
        })
      );

      // Cart item remove buttons
      document.querySelectorAll(this.config.cartItemRemoveSelector).forEach((btn) =>
        btn.addEventListener('click', async (e) => {
          e.preventDefault();

          const target = e.target as HTMLElement;
          const id = target.dataset.id;

          if (!id) return;

          try {
            await this.removeItem(id);
          } catch (error) {
            console.error('[CartCore] Error removing item from button:', error);
          }
        })
      );

      this.eventHandlersAttached = true;
    });
  }

  /**
   * Fetch current cart
   */
  private static async fetchCart(): Promise<any> {
    const res = await fetch(this.config.apiEndpoints.cartGet);
    if (!res.ok) throw new Error('Cart fetch failed');
    this.cartData = await res.json();
    return this.cartData;
  }

  /**
   * Post data to Shopify API
   */
  private static async postToShopify(endpoint: string, data: any): Promise<any> {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Request to ${endpoint} failed`);
    return res.json();
  }

  /**
   * Update cart UI elements
   */
  private static updateCartUI(): void {
    if (!this.cartData) return;

    const countEl = document.querySelector(this.config.cartCountSelector);
    if (countEl) {
      countEl.textContent = this.cartData.item_count;
      countEl.classList.toggle('hidden', !this.cartData.item_count);
    }

    const totalEl = document.querySelector(this.config.cartTotalSelector);
    if (totalEl) {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      });
      totalEl.textContent = formatter.format(this.cartData.total_price / 100);
    }

    // Update cart items
    const cartItems = document.querySelector(this.config.cartDrawerSelector);
    if (cartItems && typeof cartItems.innerHTML !== 'undefined') {
      // This could be refactored into a template rendering system
      // For now, we're just using a simple approach to demonstrate the concept

      if (this.cartData.items.length === 0) {
        const emptyMessage = document.querySelector(this.config.cartEmptyMessageSelector);
        if (emptyMessage) {
          emptyMessage.classList.remove('hidden');
        }
      } else {
        const emptyMessage = document.querySelector(this.config.cartEmptyMessageSelector);
        if (emptyMessage) {
          emptyMessage.classList.add('hidden');
        }
      }
    }

    // Notify extensions
    this.notifyExtensions('cartUpdated', { cart: this.cartData });
  }

  /**
   * Connect to NeuralBus
   */
  private static connectToNeuralBus(): void {
    if (typeof NeuralBus === 'undefined') return;

    const reg = NeuralBus.register('cart-core', { version: '3.0.0' });
    this.neuralBusConnected = true;

    NeuralBus.subscribe('cart:refresh', () => this.fetchCart().then(() => this.updateCartUI()));

    // Other event subscriptions
    NeuralBus.subscribe('cart:open', () => this.openCartDrawer());
    NeuralBus.subscribe('cart:close', () => this.closeCartDrawer());
    NeuralBus.subscribe('cart:toggle', () => this.toggleCartDrawer());
  }

  /**
   * Notify all extensions of an event
   */
  private static notifyExtensions(event: string, data: any): void {
    this.extensions.forEach((extension) => {
      try {
        if (typeof extension.onEvent === 'function') {
          extension.onEvent(event, data);
        }
      } catch (error) {
        console.error(
          `[CartCore] Error notifying extension '${extension.name}' of event '${event}':`,
          error
        );
      }
    });
  }
}

// Auto-initialize when loaded if in browser environment
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    CartCore.initialize({ debug: window.location.search.includes('debug=true') });
    (window as any).CartCore = CartCore;
  });
}
