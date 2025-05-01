/**
 * UNIFIED-CART-SYSTEM.TS
 * Consolidated cart functionality for CyberCore theme
 *
 * This file consolidates functionality from:
 * - cart-system.js
 * - enhanced-cart.ts
 * - enhanced-cart-system.ts
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * @Version: 4.1.0
 */

import { cartApi } from './cart-api';
import CartErrorHandler, { ErrorCategory, ErrorSeverity } from './cart-error-handler';
import { getCsrfToken } from './csrf-utils';
import { memoryEncoder } from './memory-encoder';
import { NeuralBus } from './neural-bus';
import offlineCartManager, {
  CartData,
  CartItem,
  CartItem as OfflineCartItem,
} from './offline-cart-manager';
import { safeApiClient } from './safe-api-client';
import { sanitizeHtml } from './security-utils';

// Type definitions
export type { CartData, CartItem } from './offline-cart-manager';

export interface CartSystemConfig {
  selectors: {
    cartDrawer: string;
    cartIcon: string;
    cartCount: string;
    cartTotal: string;
    addToCartForm: string;
    cartItem: string;
    cartItemRemove: string;
    cartItemQuantity: string;
    cartDrawerToggle: string;
    cartEmptyMessage: string;
    cartError: string;
    cartRecommendations: string;
    cartCheckoutButton: string;
    continueShoppingButton: string;
    cartPreviewContainer: string;
  };
  apiEndpoints: {
    cartAdd: string;
    cartUpdate: string;
    cartChange: string;
    cartGet: string;
    cartClear: string;
  };
  features: {
    neuralSynced: boolean;
    useQuantumEffects: boolean;
    useHolographicPreviews: boolean;
    useOfflineSupport: boolean;
    useWorkers: boolean;
    batchRequests: boolean;
    adaptToDevice: boolean;
    useSafeRenderingMode: boolean;
  };
  traumaVisualization: 'minimal' | 'standard' | 'enhanced';
  requestThrottleMs: number;
  debug: boolean;
}

export interface DeviceCapabilities {
  tier: 'low' | 'medium' | 'high';
  supportsWebGL: boolean;
  supportsDynamicEffects: boolean;
  pixelDensity: number;
  isLowPowerMode: boolean;
  isMobile: boolean;
}

export type CartEventType =
  | 'cart:updated'
  | 'cart:opened'
  | 'cart:closed'
  | 'cart:item-added'
  | 'cart:item-removed'
  | 'cart:item-updated'
  | 'cart:cleared'
  | 'cart:error'
  | 'cart:sync-start'
  | 'cart:sync-complete';

/**
 * CartSystem
 * Unified implementation combining all cart variants
 */
export class CartSystem {
  // Private properties with TypeScript private field syntax
  #config: CartSystemConfig;
  #cartData: CartData | null = null;
  #isOpen: boolean = false;
  #neuralBusConnected: boolean = false;
  #holographicPreviewsSupported: boolean = false;
  #holographicRenderer: any = null;
  #deviceCapabilities: DeviceCapabilities | null = null;
  #pendingRequests: Array<any> = [];
  #isProcessingRequests: boolean = false;
  #eventHandlersAttached: boolean = false;
  #traumaCodes: string[] = [];
  #activeProduct: any = null;
  #productMutationRegistry = new Map<string, any>();
  #originalConfig: CartSystemConfig | null = null;
  #experimentVariants = new Map<string, string>();
  #worker: Worker | null = null;
  #apiClient = safeApiClient;

  // Singleton implementation
  private static instance: CartSystem | null = null;

  /**
   * Private constructor - use getInstance() instead
   */
  private constructor(config: Partial<CartSystemConfig> = {}) {
    // Default configuration
    const defaultConfig: CartSystemConfig = {
      selectors: {
        cartDrawer: '#cart-drawer',
        cartIcon: '#cart-icon-bubble',
        cartCount: '#cart-count',
        cartTotal: '#cart-total',
        addToCartForm: 'form[action="/cart/add"]',
        cartItem: '.cart-item',
        cartItemRemove: '.cart-item__remove',
        cartItemQuantity: '.cart-item__quantity-input',
        cartDrawerToggle: '[data-cart-toggle]',
        cartEmptyMessage: '.cart-empty-message',
        cartError: '.cart-error',
        cartRecommendations: '.cart-recommendations',
        cartCheckoutButton: '#cart-checkout-button',
        continueShoppingButton: '#continue-shopping',
        cartPreviewContainer: '#cart-preview-container',
      },
      apiEndpoints: {
        cartAdd: '/cart/add.js',
        cartUpdate: '/cart/update.js',
        cartChange: '/cart/change.js',
        cartGet: '/cart.js',
        cartClear: '/cart/clear.js',
      },
      features: {
        neuralSynced: true,
        useQuantumEffects: true,
        useHolographicPreviews: true,
        useOfflineSupport: true,
        useWorkers: true,
        batchRequests: true,
        adaptToDevice: true,
        useSafeRenderingMode: true,
      },
      traumaVisualization: 'standard',
      requestThrottleMs: 300,
      debug: false,
    };

    // Merge configurations
    this.#config = this.#deepMerge(defaultConfig, config);

    // Initialize the system
    this.#init();
  }

  /**
   * Initialize all cart system components
   */
  async #init() {
    try {
      // Check device capabilities
      if (this.#config.features.adaptToDevice) {
        this.#detectDeviceCapabilities();
        this.#adaptToDevice();
      }

      // Check for holographic preview support
      if (this.#config.features.useHolographicPreviews) {
        await this.#checkHolographicSupport();
      }

      // Initialize workers if enabled
      if (this.#config.features.useWorkers) {
        this.#initializeWorker();
      }

      // Connect to NeuralBus if enabled
      if (this.#config.features.neuralSynced) {
        this.#connectToNeuralBus();
      }

      // Listen for online/offline events if offline support is enabled
      if (this.#config.features.useOfflineSupport) {
        window.addEventListener('online', this.#handleOnlineStatus.bind(this));
        window.addEventListener('offline', this.#handleOnlineStatus.bind(this));
      }

      this.#attachEventHandlers();

      // Initial cart fetch
      await this.#safeCartOperation(async () => {
        await this.fetchCart();
        this.#updateCartUI();
      }, 'initialization');

      if (this.#config.debug) {
        console.log('[CartSystem] Initialized with config:', this.#config);
      }
    } catch (error: any) {
      CartErrorHandler.handleError(error as Error, {
        component: 'cart-system',
        method: 'init',
      });
    }
  }

  /**
   * Get the CartSystem instance (singleton pattern)
   */
  public static getInstance(config?: Partial<CartSystemConfig>): CartSystem {
    if (!CartSystem.instance) {
      CartSystem.instance = new CartSystem(config);
    } else if (config) {
      // Update config if provided
      CartSystem.instance.#updateConfig(config);
    }

    return CartSystem.instance;
  }

  /**
   * Update configuration
   */
  #updateConfig(config: Partial<CartSystemConfig>): void {
    this.#config = this.#deepMerge(this.#config, config);

    // Re-evaluate features that may be affected by config changes
    if (config.features) {
      if (config.features.useHolographicPreviews !== undefined) {
        this.#checkHolographicSupport();
      }

      if (
        config.features.useWorkers !== undefined &&
        config.features.useWorkers !== !!this.#worker
      ) {
        if (config.features.useWorkers) {
          this.#initializeWorker();
        } else {
          this.#terminateWorker();
        }
      }

      if (config.features.adaptToDevice !== undefined && config.features.adaptToDevice) {
        this.#detectDeviceCapabilities();
        this.#adaptToDevice();
      }
    }

    // Update memory encoder visualization mode if needed
    if (config.traumaVisualization) {
      memoryEncoder.setVisualizationMode(config.traumaVisualization);
    }
  }

  /**
   * Safely execute cart operations with error handling
   */
  async #safeCartOperation<T>(
    operation: () => Promise<T>,
    context: string,
    options: any = {}
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error: any) {
      CartErrorHandler.handleError(error as Error, {
        component: 'cart-system',
        method: context,
        severity: options.severity || ErrorSeverity.ERROR,
        category: options.category || ErrorCategory.API,
      });

      if (options.fallbackValue !== undefined) {
        return options.fallbackValue;
      }

      throw error;
    }
  }

  /**
   * Check for holographic preview support
   */
  async #checkHolographicSupport(): Promise<boolean> {
    if (!this.#config.features.useHolographicPreviews) {
      this.#holographicPreviewsSupported = false;
      return false;
    }

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      this.#holographicPreviewsSupported = !!gl;

      if (this.#holographicPreviewsSupported) {
        try {
          const module = await import('./hologram-renderer.js');
          this.#holographicRenderer = module.HologramRenderer;
        } catch (e) {
          this.#holographicPreviewsSupported = false;
        }
      }
    } catch (e) {
      this.#holographicPreviewsSupported = false;
    }

    return this.#holographicPreviewsSupported;
  }

  /**
   * Initialize web worker for quantum effects processing
   */
  #initializeWorker(): void {
    if (this.#worker) return;

    try {
      this.#worker = new Worker('/assets/quantum-effects-worker.js');

      this.#worker.onmessage = (event) => {
        const { type, elementId, effect } = event.data;

        if (type === 'effect-ready') {
          const element = document.getElementById(elementId);
          if (element) {
            // Apply the generated effect to the element
            Object.assign(element.style, effect.styles || {});

            if (effect.className) {
              element.classList.add(effect.className);
            }

            if (effect.html && this.#config.features.useSafeRenderingMode) {
              element.innerHTML = sanitizeHtml(effect.html);
            }
          }
        }
      };

      this.#worker.onerror = (error) => {
        console.error('Quantum effects worker error:', error);
        this.#terminateWorker();
      };
    } catch (e) {
      console.warn('Could not initialize quantum effects worker:', e);
    }
  }

  /**
   * Terminate worker
   */
  #terminateWorker(): void {
    if (this.#worker) {
      this.#worker.terminate();
      this.#worker = null;
    }
  }

  /**
   * Apply quantum effect to element
   */
  #applyQuantumEffect(targetId: string, type: string, effect: any): void {
    if (!this.#worker) return;

    this.#worker.postMessage({
      type: 'generate-effect',
      targetId,
      effectType: type,
      parameters: effect,
    });
  }

  /**
   * Connect to NeuralBus
   */
  #connectToNeuralBus(): void {
    if (typeof NeuralBus === 'undefined') return;

    try {
      NeuralBus.register('cart-system', { version: '4.1.0' });
      this.#neuralBusConnected = true;

      // Subscribe to relevant events
      NeuralBus.subscribe('cart:refresh', () => {
        this.fetchCart().then(() => this.#updateCartUI());
      });

      // Other NeuralBus subscriptions
      NeuralBus.subscribe('quantum:stability-update', (data: any) => {
        if (data && data.factor !== undefined) {
          // Apply stability changes if needed
        }
      });
    } catch (e) {
      console.warn('Failed to connect to NeuralBus:', e);
      this.#neuralBusConnected = false;
    }
  }

  /**
   * Handle online/offline status changes
   */
  #handleOnlineStatus = async (): Promise<void> => {
    const isOnline = navigator.onLine;

    if (isOnline && this.#config.features.useOfflineSupport) {
      // If we're back online, sync any offline changes
      try {
        await this.syncOfflineCart();
      } catch (error: any) {
        // Handle sync errors
        CartErrorHandler.handleError(error as Error, {
          component: 'cart-system',
          method: 'handleOnlineStatus',
          context: 'Syncing offline cart',
        });
      }
    }

    // Update UI to reflect online/offline status
    this.#updateCartUI();
  };

  /**
   * Detect device capabilities
   */
  #detectDeviceCapabilities(): DeviceCapabilities {
    const capabilities: DeviceCapabilities = {
      tier: 'high',
      supportsWebGL: false,
      supportsDynamicEffects: true,
      pixelDensity: window.devicePixelRatio || 1,
      isLowPowerMode: false,
      isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ),
    };

    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      capabilities.supportsWebGL = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      capabilities.supportsWebGL = false;
    }

    // Check for low power mode (iOS)
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        capabilities.isLowPowerMode = battery.charging === false && battery.level < 0.2;

        // Update device tier if low power mode is detected after initial check
        if (capabilities.isLowPowerMode && this.#deviceCapabilities) {
          this.#deviceCapabilities.isLowPowerMode = true;
          this.#deviceCapabilities.tier = 'low';
          this.#deviceCapabilities.supportsDynamicEffects = false;

          // Re-adapt to device if capabilities change
          this.#adaptToDevice();
        }
      });
    }

    // Determine device performance tier
    if (capabilities.isMobile) {
      capabilities.tier = capabilities.pixelDensity > 2 ? 'medium' : 'low';
    } else {
      capabilities.tier = 'high';
    }

    // Adjust for low power mode
    if (capabilities.isLowPowerMode) {
      capabilities.tier = 'low';
      capabilities.supportsDynamicEffects = false;
    }

    this.#deviceCapabilities = capabilities;
    return capabilities;
  }

  /**
   * Adapt effects based on device capabilities
   */
  #adaptToDevice(): void {
    if (!this.#deviceCapabilities || !this.#config.features.adaptToDevice) return;

    // Store original config if not already stored
    if (!this.#originalConfig) {
      this.#originalConfig = { ...this.#config };
    }

    // Adapt quantum effects
    if (this.#deviceCapabilities.tier === 'low') {
      this.#config.features.useQuantumEffects = false;
      this.#config.features.useHolographicPreviews = false;
      this.#config.traumaVisualization = 'minimal';
    } else if (this.#deviceCapabilities.tier === 'medium') {
      // Use simplified effects for medium tier
      this.#config.traumaVisualization = 'standard';
      this.#config.features.useHolographicPreviews = false;
    }

    // Update memory encoder with new settings
    if (this.#config.features.neuralSynced) {
      NeuralBus.publish('cart:adaptation', {
        capabilities: this.#deviceCapabilities,
        adaptedConfig: {
          quantumEffects: this.#config.features.useQuantumEffects,
          holographicPreviews: this.#config.features.useHolographicPreviews,
          traumaVisualization: this.#config.traumaVisualization,
        },
      });
    }
  }

  /**
   * Attach DOM event handlers
   */
  #attachEventHandlers(): void {
    if (this.#eventHandlersAttached) return;

    const handleDOMReady = () => {
      // Cart toggle buttons
      document.querySelectorAll(this.#config.selectors.cartDrawerToggle).forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggleCartDrawer();
        });
      });

      // Add to cart forms
      document.querySelectorAll(this.#config.selectors.addToCartForm).forEach((form) => {
        form.addEventListener('submit', this.#handleAddToCartSubmit.bind(this));
      });

      // Cart item quantity changes
      document.addEventListener('change', (e) => {
        const target = e.target as HTMLElement;
        if (target.matches(this.#config.selectors.cartItemQuantity)) {
          this.#handleQuantityChange(target as HTMLInputElement);
        }
      });

      // Cart item remove buttons
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.matches(this.#config.selectors.cartItemRemove)) {
          e.preventDefault();
          this.#handleRemoveItem(target);
        }
      });

      this.#eventHandlersAttached = true;
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', handleDOMReady);
    } else {
      handleDOMReady();
    }
  }

  /**
   * Handle add to cart form submission
   */
  #handleAddToCartSubmit(e: Event): void {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    this.addToCart(formData);
  }

  /**
   * Handle quantity change for cart items
   */
  #handleQuantityChange(input: HTMLInputElement): void {
    const key = input.getAttribute('data-key');
    const quantity = parseInt(input.value, 10);

    if (key && !isNaN(quantity)) {
      this.updateItemQuantity(key, quantity);
    }
  }

  /**
   * Handle remove item button click
   */
  #handleRemoveItem(button: HTMLElement): void {
    const key = button.getAttribute('data-key');

    if (key) {
      this.removeItem(key);
    }
  }

  /**
   * Trigger custom event
   */
  #triggerEvent(name: string, detail: any = {}): void {
    // Dispatch DOM event
    document.dispatchEvent(new CustomEvent(name, { detail }));

    // Publish to NeuralBus if connected
    if (this.#neuralBusConnected) {
      NeuralBus.publish(name, detail);
    }
  }

  /**
   * Deep merge objects
   */
  #deepMerge(target: any, source: any): any {
    const output = { ...target };

    if (this.#isObject(target) && this.#isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (this.#isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = this.#deepMerge(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }

    return output;
  }

  /**
   * Check if value is an object
   */
  #isObject(item: any): boolean {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  /**
   * Update cart UI elements
   */
  #updateCartUI(): void {
    if (!this.#cartData) return;

    // Update cart count
    const countEl = document.querySelector(this.#config.selectors.cartCount);
    if (countEl) {
      countEl.textContent = this.#cartData.item_count?.toString() || '0';
      countEl.classList.toggle('hidden', !this.#cartData.item_count);
    }

    // Update cart total
    const totalEl = document.querySelector(this.#config.selectors.cartTotal);
    if (totalEl) {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: this.#cartData.currency || 'USD',
      });
      totalEl.textContent = formatter.format((this.#cartData.total_price || 0) / 100);
    }

    // Update cart items
    const cartDrawer = document.querySelector(this.#config.selectors.cartDrawer);
    if (cartDrawer) {
      const itemsContainer = cartDrawer.querySelector('.cart-items');

      if (itemsContainer) {
        // Clear existing items
        itemsContainer.innerHTML = '';

        // Add cart items
        if (this.#cartData.items && this.#cartData.items.length > 0) {
          this.#cartData.items.forEach((item) => {
            const itemElement = this.#createCartItemElement(item);
            itemsContainer.appendChild(itemElement);
          });

          // Show cart items, hide empty message
          cartDrawer
            .querySelector(this.#config.selectors.cartEmptyMessage)
            ?.classList.add('hidden');
          itemsContainer.classList.remove('hidden');
          cartDrawer
            .querySelector(this.#config.selectors.cartCheckoutButton)
            ?.classList.remove('hidden');
        } else {
          // Show empty message, hide cart items
          cartDrawer
            .querySelector(this.#config.selectors.cartEmptyMessage)
            ?.classList.remove('hidden');
          itemsContainer.classList.add('hidden');
          cartDrawer
            .querySelector(this.#config.selectors.cartCheckoutButton)
            ?.classList.add('hidden');
        }
      }
    }

    // If user is offline, show indicator
    if (this.#config.features.useOfflineSupport && navigator && !navigator.onLine) {
      this.#showOfflineIndicator();
    } else {
      this.#hideOfflineIndicator();
    }
  }

  /**
   * Create a cart item element
   */
  #createCartItemElement(item: OfflineCartItem): HTMLElement {
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.setAttribute('data-key', item.key || '');
    itemEl.setAttribute('data-id', item.id.toString());

    // Sanitize data before creating HTML (security enhancement)
    const safeTitle = sanitizeHtml(item.title || 'Product');
    const safeImage = sanitizeHtml(item.image || '');
    const safePrice = this.#formatMoney(item.price || 0);

    // Add item HTML
    itemEl.innerHTML = `
      <div class="cart-item__image">
        <img src="${safeImage}" alt="${safeTitle}">
      </div>
      <div class="cart-item__details">
        <h3 class="cart-item__title">${safeTitle}</h3>
        <div class="cart-item__price">${safePrice}</div>
        <div class="cart-item__quantity">
          <button class="cart-item__quantity-button" data-action="decrease">-</button>
          <input type="number" class="cart-item__quantity-input"
            value="${item.quantity}" min="1" max="99" data-key="${item.key || ''}">
          <button class="cart-item__quantity-button" data-action="increase">+</button>
        </div>
      </div>
      <button class="cart-item__remove" data-key="${item.key || ''}">×</button>
    `;

    // Add event listeners for quantity buttons
    const decreaseBtn = itemEl.querySelector('[data-action="decrease"]');
    const increaseBtn = itemEl.querySelector('[data-action="increase"]');
    const input = itemEl.querySelector('input');

    if (decreaseBtn && input) {
      decreaseBtn.addEventListener('click', () => {
        const newValue = Math.max(1, parseInt(input.value, 10) - 1);
        input.value = newValue.toString();
        this.updateItemQuantity(item.key || '', newValue);
      });
    }

    if (increaseBtn && input) {
      increaseBtn.addEventListener('click', () => {
        const newValue = Math.min(99, parseInt(input.value, 10) + 1);
        input.value = newValue.toString();
        this.updateItemQuantity(item.key || '', newValue);
      });
    }

    // Apply quantum effects if enabled and item has quantum properties
    if (this.#config.features.useQuantumEffects && item.quantumProperties) {
      this.#applyItemQuantumProperties(itemEl, item.quantumProperties);
    }

    // Apply trauma visualization if item has trauma properties
    if (item.properties && item.properties._trauma_level) {
      const traumaLevel = parseInt(item.properties._trauma_level as string, 10);
      memoryEncoder.applyTraumaPattern(itemEl, traumaLevel);
    }

    return itemEl;
  }

  /**
   * Apply quantum properties to the cart item
   */
  #applyItemQuantumProperties(element: HTMLElement, properties: any): void {
    if (!this.#worker || !properties) return;

    const elementId = `quantum-cart-item-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 7)}`;
    element.id = elementId;

    this.#applyQuantumEffect(elementId, 'cart-item', properties);
  }

  /**
   * Show offline indicator in the cart
   */
  #showOfflineIndicator(): void {
    const cartDrawer = document.querySelector(this.#config.selectors.cartDrawer);
    if (!cartDrawer) return;

    // Check if indicator already exists
    let indicator = cartDrawer.querySelector('.cart-offline-indicator');
    if (!indicator) {
      // Create the indicator
      indicator = document.createElement('div');
      indicator.className = 'cart-offline-indicator';
      indicator.setAttribute('role', 'status');
      indicator.innerHTML = `
        <div class="cart-offline-indicator__icon">📶</div>
        <div class="cart-offline-indicator__message">
          <p>You're currently offline. Cart changes will be synchronized when you're back online.</p>
        </div>
      `;

      // Add to cart drawer
      cartDrawer.prepend(indicator);
    } else {
      // Show existing indicator
      indicator.classList.remove('hidden');
    }
  }

  /**
   * Hide offline indicator
   */
  #hideOfflineIndicator(): void {
    const indicator = document.querySelector('.cart-offline-indicator');
    if (indicator) {
      indicator.classList.add('hidden');
    }
  }

  /**
   * Format money value
   */
  #formatMoney(cents: number): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.#cartData?.currency || 'USD',
    });

    return formatter.format(cents / 100);
  }

  // PUBLIC API

  /**
   * Fetch the current cart data from the server
   */
  public async fetchCart(): Promise<CartData | null> {
    try {
      // Check if we're offline
      if (this.#config.features.useOfflineSupport && !navigator.onLine) {
        // Use offline cart data
        this.#cartData = offlineCartManager.getCart();
        return this.#cartData;
      }

      // Use updated cart API
      this.#cartData = await cartApi.getCart();

      // Update offline cart manager with server data
      if (this.#config.features.useOfflineSupport) {
        offlineCartManager.updateWithServerCart(this.#cartData);
      }

      // If user is online but there are pending offline operations, sync them
      if (
        this.#config.features.useOfflineSupport &&
        navigator.onLine &&
        offlineCartManager.hasOfflineOperations()
      ) {
        await this.syncOfflineCart();
      }

      // Trigger event for cart update
      this.#triggerEvent('cart:updated', {
        cart: this.#cartData,
      });

      return this.#cartData;
    } catch (error) {
      // Handle error using the error handler
      CartErrorHandler.handleError(error as Error, {
        component: 'cart-system',
        method: 'fetchCart',
        category: ErrorCategory.API,
      });

      // If offline support is enabled, fall back to offline cart
      if (this.#config.features.useOfflineSupport) {
        this.#cartData = offlineCartManager.getCart();
        return this.#cartData;
      }

      return null;
    }
  }

  /**
   * Add item to cart using FormData
   */
  public async addToCart(formData: FormData): Promise<CartData | null> {
    try {
      // Add CSRF token for security
      if (this.#config.features.useSafeRenderingMode) {
        formData.append('csrf_token', getCsrfToken());
      }

      // Process form data securely
      if (this.#config.features.useOfflineSupport && !navigator.onLine) {
        // Create cart item from form data
        const formObject: Record<string, any> = {};
        const properties: Record<string, any> = {};

        formData.forEach((value, key) => {
          if (key.startsWith('properties[') && key.endsWith(']')) {
            const propName = key.slice(11, -1);
            properties[propName] = value;
          } else {
            formObject[key] = value;
          }
        });

        const cartItem: CartItem = {
          id: formObject.id || formObject.variant_id,
          quantity: parseInt(formObject.quantity, 10) || 1,
          title: formObject.product_title || 'Product',
          price: parseInt(formObject.price, 10) || 0,
          properties: Object.keys(properties).length > 0 ? properties : undefined,
        };

        // Add to offline cart
        offlineCartManager.addItem(cartItem);
        this.#cartData = offlineCartManager.getCart();
      } else {
        // Use cart API to process form
        this.#cartData = await cartApi.processForm(formData);
      }

      // Open cart drawer if not already open
      if (!this.#isOpen) {
        this.openCartDrawer();
      }

      // Update UI
      this.#updateCartUI();

      // Trigger event
      this.#triggerEvent('cart:item-added', {
        cart: this.#cartData,
      });

      return this.#cartData;
    } catch (error) {
      // Handle error
      CartErrorHandler.handleError(error as Error, {
        component: 'cart-system',
        method: 'addToCart',
        category: ErrorCategory.API,
      });

      return null;
    }
  }

  /**
   * Update the quantity of a cart item
   */
  public async updateItemQuantity(key: string, quantity: number): Promise<CartData | null> {
    try {
      if (this.#config.features.useOfflineSupport && !navigator.onLine) {
        // Update in offline cart
        offlineCartManager.updateItemQuantity(key, quantity);
        this.#cartData = offlineCartManager.getCart();
      } else {
        // Use cart API
        this.#cartData = await cartApi.updateItemQuantity(key, quantity);
      }

      // Update UI
      this.#updateCartUI();

      // Trigger event
      this.#triggerEvent('cart:item-updated', {
        cart: this.#cartData,
        itemKey: key,
        quantity,
      });

      return this.#cartData;
    } catch (error) {
      // Handle error
      CartErrorHandler.handleError(error as Error, {
        component: 'cart-system',
        method: 'updateItemQuantity',
        category: ErrorCategory.API,
      });

      return null;
    }
  }

  /**
   * Remove an item from the cart
   */
  public async removeItem(key: string): Promise<CartData | null> {
    try {
      if (this.#config.features.useOfflineSupport && !navigator.onLine) {
        // Remove from offline cart
        offlineCartManager.removeItem(key);
        this.#cartData = offlineCartManager.getCart();
      } else {
        // Use cart API
        this.#cartData = await cartApi.removeItem(key);
      }

      // Update UI
      this.#updateCartUI();

      // Trigger event
      this.#triggerEvent('cart:item-removed', {
        cart: this.#cartData,
        itemKey: key,
      });

      return this.#cartData;
    } catch (error) {
      // Handle error
      CartErrorHandler.handleError(error as Error, {
        component: 'cart-system',
        method: 'removeItem',
        category: ErrorCategory.API,
      });

      return null;
    }
  }

  /**
   * Clear the cart
   */
  public async clearCart(): Promise<CartData | null> {
    try {
      if (this.#config.features.useOfflineSupport && !navigator.onLine) {
        // Clear offline cart
        offlineCartManager.clearCart();
        this.#cartData = offlineCartManager.getCart();
      } else {
        // Use cart API
        this.#cartData = await cartApi.clearCart();
      }

      // Update UI
      this.#updateCartUI();

      // Trigger event
      this.#triggerEvent('cart:cleared', {
        cart: this.#cartData,
      });

      return this.#cartData;
    } catch (error) {
      // Handle error
      CartErrorHandler.handleError(error as Error, {
        component: 'cart-system',
        method: 'clearCart',
        category: ErrorCategory.API,
      });

      return null;
    }
  }

  /**
   * Toggle cart drawer open/closed
   */
  public toggleCartDrawer(): void {
    if (this.#isOpen) {
      this.closeCartDrawer();
    } else {
      this.openCartDrawer();
    }
  }

  /**
   * Open the cart drawer
   */
  public openCartDrawer(): void {
    const cartDrawer = document.querySelector(this.#config.selectors.cartDrawer);
    if (!cartDrawer) return;

    // Open drawer
    cartDrawer.classList.add('active');
    this.#isOpen = true;

    // Apply quantum effects if enabled
    if (this.#config.features.useQuantumEffects) {
      this.#applyQuantumEffect('cart-drawer', 'open', {
        timestamp: Date.now(),
      });
    }

    // Trigger event
    this.#triggerEvent('cart:opened', {
      cart: this.#cartData,
    });
  }

  /**
   * Close the cart drawer
   */
  public closeCartDrawer(): void {
    const cartDrawer = document.querySelector(this.#config.selectors.cartDrawer);
    if (!cartDrawer) return;

    // Close drawer
    cartDrawer.classList.remove('active');
    this.#isOpen = false;

    // Apply quantum effects if enabled
    if (this.#config.features.useQuantumEffects) {
      this.#applyQuantumEffect('cart-drawer', 'close', {
        timestamp: Date.now(),
      });
    }

    // Trigger event
    this.#triggerEvent('cart:closed', {
      cart: this.#cartData,
    });
  }

  /**
   * Sync offline cart operations with the server
   */
  public async syncOfflineCart(): Promise<boolean> {
    if (!this.#config.features.useOfflineSupport) return false;

    try {
      // Trigger sync start event
      this.#triggerEvent('cart:sync-start', {});

      // Perform sync
      const syncResult = await offlineCartManager.syncWithServer();

      // If sync was successful, refresh cart from server
      if (syncResult) {
        this.#cartData = await cartApi.getCart();
        this.#updateCartUI();
      }

      // Trigger sync complete event
      this.#triggerEvent('cart:sync-complete', {
        success: syncResult,
        cart: this.#cartData,
      });

      return syncResult;
    } catch (error) {
      // Handle error
      CartErrorHandler.handleError(error as Error, {
        component: 'cart-system',
        method: 'syncOfflineCart',
        category: ErrorCategory.NETWORK,
      });

      // Trigger sync complete event with failure
      this.#triggerEvent('cart:sync-complete', {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });

      return false;
    }
  }

  /**
   * Get the current cart data
   */
  public getCartData(): CartData | null {
    return this.#cartData;
  }

  /**
   * Apply trauma encoding to a product
   */
  public encodeProductTrauma(
    product: { id: number | string; [key: string]: any },
    traumaLevel: number
  ): Record<string, any> {
    if (!product || traumaLevel < 1 || traumaLevel > 5) {
      return {};
    }

    // Use memory encoder to apply trauma
    return memoryEncoder.encodeTrauma(product, traumaLevel);
  }

  /**
   * Get device capabilities
   */
  public getDeviceCapabilities(): DeviceCapabilities | null {
    return this.#deviceCapabilities;
  }

  /**
   * Check if cart drawer is open
   */
  public isCartOpen(): boolean {
    return this.#isOpen;
  }
}

// Compatibility with window global
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    // Create the cart system instance
    const cartSystem = CartSystem.getInstance({
      debug: window.location.search.includes('debug=true'),
    });

    // Expose to window for backward compatibility
    (window as any).CartSystem = cartSystem;
  });
}

// Export for module usage
export default CartSystem;
