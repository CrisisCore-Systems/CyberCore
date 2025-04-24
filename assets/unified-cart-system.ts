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
 * @Version: 4.0.0
 */

import { NeuralBus } from './neural-bus';
import CartErrorHandler, { ErrorCategory, ErrorSeverity, ErrorContext } from './cart-error-handler';
import { safeApiClient } from './safe-api-client';
import { memoryEncoder, TraumaLevel } from './memory-encoder';
import offlineCartManager, { OfflineOperationType, CartItem as OfflineCartItem, CartData, OfflineOperation } from './offline-cart-manager';

// Type definitions
export { CartData, CartItem } from './offline-cart-manager';

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
  };
  traumaVisualization: 'minimal' | 'standard' | 'enhanced';
  requestThrottleMs: number;
  debug: boolean;
  persistenceKey?: string;
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
        cartPreviewContainer: '#cart-preview-container'
      },
      apiEndpoints: {
        cartAdd: '/cart/add.js',
        cartUpdate: '/cart/update.js',
        cartChange: '/cart/change.js',
        cartGet: '/cart.js',
        cartClear: '/cart/clear.js'
      },
      features: {
        neuralSynced: true,
        useQuantumEffects: true,
        useHolographicPreviews: true,
        useOfflineSupport: true,
        useWorkers: true,
        batchRequests: true,
        adaptToDevice: true
      },
      traumaVisualization: 'standard',
      requestThrottleMs: 300,
      debug: false
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

      // Configure memory encoder with visualization mode
      memoryEncoder.setVisualizationMode(this.#config.traumaVisualization);
      memoryEncoder.setQuantumEffectsEnabled(this.#config.features.useQuantumEffects);

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

      // Attach DOM event handlers
      this.#attachEventHandlers();

      // Initial cart fetch
      await this.#safeCartOperation(async () => {
        await this.fetchCart();
        this.#updateCartUI();
      }, 'initialization');

      if (this.#config.debug) {
        console.log('[CartSystem] Initialized with config:', this.#config);
      }
    } catch (error) {
      CartErrorHandler.handleError(error, {
        component: 'cart-system',
        method: 'init'
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

      if (config.features.useWorkers !== undefined && config.features.useWorkers !== !!this.#worker) {
        if (config.features.useWorkers) {
          this.#initializeWorker();
        } else {
          this.#terminateWorker();
        }
      }

      // Update memory encoder quantum effects
      if (config.features.useQuantumEffects !== undefined) {
        memoryEncoder.setQuantumEffectsEnabled(config.features.useQuantumEffects);
      }
    }

    // Update memory encoder visualization mode if changed
    if (config.traumaVisualization) {
      memoryEncoder.setVisualizationMode(config.traumaVisualization);
    }
  }

  /**
   * Safely execute cart operations with error handling
   */
  async #safeCartOperation<T>(operation: () => Promise<T>, context: string, options: any = {}): Promise<T | null> {
    return CartErrorHandler.safeExecute(
      operation,
      { component: 'cart-system', operation: context },
      {
        retryCount: options.retryCount || 3,
        fallbackValue: options.fallbackValue || null,
        criticalOperation: options.critical || false
      }
    );
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
    if (!this.#config.features.useWorkers) return;

    try {
      if ('Worker' in window) {
        this.#worker = new Worker(new URL('./quantum-effects-worker.js', import.meta.url));

        this.#worker.addEventListener('message', (event) => {
          const { type, target, result } = event.data;

          // Handle worker responses
          switch (type) {
            case 'mutation':
            case 'glitch':
            case 'holographic':
              // Apply the processed effect to the target element
              this.#applyQuantumEffect(target, type, result);
              break;
            default:
              console.warn('Unknown worker message type:', type);
          }
        });
      }
    } catch (e) {
      console.warn('Failed to initialize worker:', e);
      this.#worker = null;
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
    const target = document.getElementById(targetId);
    if (!target) return;

    // Apply the effect based on type and data from worker
    switch (type) {
      case 'mutation':
        // Apply mutations (change appearance or behavior)
        target.classList.add('mutation-applied');
        if (effect.cssMutations) {
          Object.entries(effect.cssMutations).forEach(([prop, value]) => {
            target.style.setProperty(prop, value as string);
          });
        }
        break;

      case 'glitch':
        // Apply glitch effect (visual distortion)
        target.classList.add('glitch-applied');
        target.style.setProperty('--glitch-intensity', effect.intensity);
        if (effect.duration > 0) {
          setTimeout(() => {
            target.classList.remove('glitch-applied');
          }, effect.duration);
        }
        break;

      case 'holographic':
        // Apply holographic effect (3D/depth illusion)
        if (this.#holographicPreviewsSupported && this.#holographicRenderer) {
          target.classList.add('holographic-container');
          const hologramElement = document.createElement('div');
          hologramElement.className = 'hologram-overlay';
          target.appendChild(hologramElement);

          // Initialize hologram
          this.#holographicRenderer.init(hologramElement, effect.config);
        }
        break;
    }
  }

  /**
   * Connect to NeuralBus
   */
  #connectToNeuralBus(): void {
    if (typeof NeuralBus === 'undefined') return;

    try {
      NeuralBus.register('cart-system', { version: '4.0.0' });
      this.#neuralBusConnected = true;

      // Subscribe to relevant events
      NeuralBus.subscribe('cart:refresh', () => {
        this.fetchCart().then(() => this.#updateCartUI());
      });

      // Other NeuralBus subscriptions
      NeuralBus.subscribe('quantum:stability-update', (data) => {
        if (data.factor !== undefined) {
          // Apply stability changes if needed
        }
      });
    } catch (e) {
      console.warn('Failed to connect to NeuralBus:', e);
      this.#neuralBusConnected = false;
    }
  }

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
      isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
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
    memoryEncoder.setVisualizationMode(this.#config.traumaVisualization);
    memoryEncoder.setQuantumEffectsEnabled(this.#config.features.useQuantumEffects);

    // Log adaptation to NeuralBus
    if (this.#neuralBusConnected) {
      NeuralBus.publish('cart:adapted', {
        capabilities: this.#deviceCapabilities,
        adaptedConfig: {
          quantumEffects: this.#config.features.useQuantumEffects,
          holographicPreviews: this.#config.features.useHolographicPreviews,
          traumaVisualization: this.#config.traumaVisualization
        }
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
      document.querySelectorAll(this.#config.selectors.cartDrawerToggle)
        .forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleCartDrawer();
          });
        });

      // Add to cart forms
      document.querySelectorAll(this.#config.selectors.addToCartForm)
        .forEach(form => {
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
      Object.keys(source).forEach(key => {
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
      countEl.textContent = this.#cartData.item_count.toString();
      countEl.classList.toggle('hidden', this.#cartData.item_count === 0);
    }

    // Update cart total
    const totalEl = document.querySelector(this.#config.selectors.cartTotal);
    if (totalEl) {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: this.#cartData.currency || 'USD'
      });
      totalEl.textContent = formatter.format(this.#cartData.total_price / 100);
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
          this.#cartData.items.forEach(item => {
            const itemElement = this.#createCartItemElement(item);
            itemsContainer.appendChild(itemElement);
          });

          // Show cart items, hide empty message
          cartDrawer.querySelector(this.#config.selectors.cartEmptyMessage)?.classList.add('hidden');
          itemsContainer.classList.remove('hidden');
          cartDrawer.querySelector(this.#config.selectors.cartCheckoutButton)?.classList.remove('hidden');
        } else {
          // Show empty message, hide cart items
          cartDrawer.querySelector(this.#config.selectors.cartEmptyMessage)?.classList.remove('hidden');
          itemsContainer.classList.add('hidden');
          cartDrawer.querySelector(this.#config.selectors.cartCheckoutButton)?.classList.add('hidden');
        }
      }
    }

    // If user is offline, show indicator
    if (this.#config.features.useOfflineSupport && !offlineCartManager.isOnline()) {
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

    // Add item HTML
    itemEl.innerHTML = `
      <div class="cart-item__image">
        <img src="${item.image || ''}" alt="${item.title}">
      </div>
      <div class="cart-item__details">
        <h3 class="cart-item__title">${item.title}</h3>
        <div class="cart-item__price">${this.#formatMoney(item.price)}</div>
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
    if (!this.#config.features.useQuantumEffects) return;

    // Apply effects based on properties
    if (properties.glitchFactor) {
      element.style.setProperty('--glitch-factor', properties.glitchFactor.toString());
      element.classList.add('quantum-glitch');
    }

    if (properties.traumaIndex) {
      element.style.setProperty('--trauma-index', properties.traumaIndex.toString());
      element.classList.add('trauma-encoded');
    }

    if (properties.mutationProfile) {
      element.setAttribute('data-mutation-profile', properties.mutationProfile);
      element.classList.add('quantum-mutated');
    }

    // Process with worker if available
    if (this.#worker) {
      const elementId = `cart-item-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
      element.id = elementId;

      this.#worker.postMessage({
        type: 'process',
        elementId,
        properties
      });
    }
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
      indicator = document.createElement('div');
      indicator.className = 'cart-offline-indicator';
      indicator.innerHTML = `
        <div class="offline-icon">📴</div>
        <div class="offline-message">
          <p>You're currently offline</p>
          <p class="offline-submessage">Changes will sync when connection is restored</p>
        </div>
      `;

      // Add to cart drawer header
      const header = cartDrawer.querySelector('.cart-drawer__header') || cartDrawer.firstElementChild;
      if (header) {
        header.after(indicator);
      } else {
        cartDrawer.prepend(indicator);
      }
    }

    // Show indicator
    indicator.classList.remove('hidden');

    // Show sync status if there are pending operations
    if (offlineCartManager.hasOfflineOperations()) {
      const stats = offlineCartManager.getStorageStats();
      const pendingOps = document.createElement('div');
      pendingOps.className = 'offline-pending-operations';
      pendingOps.innerHTML = `
        <span>${stats.unsyncedCount} pending changes</span>
      `;

      // Add or update counter
      const existingCounter = indicator.querySelector('.offline-pending-operations');
      if (existingCounter) {
        existingCounter.replaceWith(pendingOps);
      } else {
        indicator.appendChild(pendingOps);
      }
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
      currency: this.#cartData?.currency || 'USD'
    });
    return formatter.format(cents / 100);
  }

  /**
   * Sync offline operations with the server
   */
  async #syncOfflineOperations(): Promise<boolean> {
    if (!this.#config.features.useOfflineSupport || !offlineCartManager.hasOfflineOperations()) {
      return true;
    }

    // If online and has pending operations, sync them
    if (offlineCartManager.isOnline() && !offlineCartManager.isSyncing()) {
      const syncCallback = async (operation: OfflineOperation): Promise<any> => {
        switch (operation.type) {
          case OfflineOperationType.ADD_ITEM:
            return this.#addItemOnline(operation.data);

          case OfflineOperationType.UPDATE_ITEM:
            return this.#updateItemQuantityOnline(
              operation.data.key,
              operation.data.quantity
            );

          case OfflineOperationType.REMOVE_ITEM:
            return this.#updateItemQuantityOnline(operation.data.key, 0);

          case OfflineOperationType.CLEAR_CART:
            return this.#clearCartOnline();
        }
      };

      this.#triggerEvent('cart:sync-start', {
        operations: offlineCartManager.getOfflineOperations().filter(op => !op.synced).length
      });

      const result = await offlineCartManager.syncOfflineOperations(syncCallback);

      this.#triggerEvent('cart:sync-complete', {
        success: result.success,
        operationsCompleted: result.completed,
        operationsFailed: result.failed
      });

      // Update cart UI after sync
      await this.fetchCart();
      this.#updateCartUI();

      return result.success;
    }

    return false;
  }

  // PUBLIC API METHODS

  /**
   * Get the current cart data
   */
  public async getCart(): Promise<CartData | null> {
    return this.fetchCart();
  }

  /**
   * Fetch the current cart from the API
   */
  public async fetchCart(): Promise<CartData | null> {
    return this.#safeCartOperation(async () => {
      // If offline and offline support is enabled, return offline cart
      if (this.#config.features.useOfflineSupport && !offlineCartManager.isOnline()) {
        const offlineCart = offlineCartManager.getCart();
        if (offlineCart) {
          this.#cartData = offlineCart;
          return this.#cartData;
        }
      }

      // Otherwise fetch from server
      try {
        const { data } = await this.#apiClient.get<CartData>(this.#config.apiEndpoints.cartGet);
        this.#cartData = data;

        // Update offline cart if online
        if (this.#config.features.useOfflineSupport && offlineCartManager.isOnline()) {
          offlineCartManager.updateWithServerCart(data);
        }

        return this.#cartData;
      } catch (error) {
        // If network error and offline support enabled, fall back to offline cart
        if (this.#config.features.useOfflineSupport) {
          const offlineCart = offlineCartManager.getCart();
          if (offlineCart) {
            this.#cartData = offlineCart;
            return this.#cartData;
          }
        }
        throw error;
      }
    }, 'fetchCart', { fallbackValue: this.#cartData });
  }

  /**
   * Add an item to the cart
   */
  public async addToCart(formDataOrItem: FormData | any): Promise<any> {
    // Check if offline and offline support is enabled
    if (this.#config.features.useOfflineSupport && !offlineCartManager.isOnline()) {
      return this.#addItemOffline(formDataOrItem);
    }

    return this.#addItemOnline(formDataOrItem);
  }

  /**
   * Add item to cart offline
   */
  private async #addItemOffline(formDataOrItem: FormData | any): Promise<any> {
    let item: OfflineCartItem;

    if (formDataOrItem instanceof FormData) {
      // Convert FormData to cart item format
      const formDataObject = Object.fromEntries(formDataOrItem.entries());
      const id = formDataObject.id || formDataObject.variant_id;
      const quantity = parseInt(formDataObject.quantity as string || '1', 10);

      // Basic item structure for offline mode
      item = {
        id: id as string,
        variantId: formDataObject.variant_id as string,
        quantity,
        price: 0, // Price will be estimated
        title: formDataObject.product_title as string || 'Product',
        properties: {}
      };

      // Check for properties
      for (const [key, value] of Object.entries(formDataObject)) {
        if (key.startsWith('properties[')) {
          if (!item.properties) item.properties = {};
          const propName = key.replace('properties[', '').replace(']', '');
          item.properties[propName] = value;
        }
      }
    } else {
      // Already in proper format
      item = formDataOrItem as OfflineCartItem;
    }

    // Add to offline cart manager
    const operation = offlineCartManager.addItem(item);

    // Get updated cart
    const cart = offlineCartManager.getCart();
    this.#cartData = cart;

    // Update UI
    this.#updateCartUI();

    // Open cart drawer
    this.openCartDrawer();

    // Trigger event
    this.#triggerEvent('cart:item-added', {
      item,
      offline: true,
      operationId: operation.id
    });

    return { item, operation };
  }

  /**
   * Add item to cart online
   */
  private async #addItemOnline(formDataOrItem: FormData | any): Promise<any> {
    return this.#safeCartOperation(async () => {
      let data: any;

      if (formDataOrItem instanceof FormData) {
        // Convert FormData to JSON
        data = Object.fromEntries(formDataOrItem.entries());
      } else {
        data = formDataOrItem;
      }

      // Make the API request
      const { data: response } = await this.#apiClient.post(this.#config.apiEndpoints.cartAdd, data);

      // Update cart data
      await this.fetchCart();
      this.#updateCartUI();

      // Open cart drawer
      this.openCartDrawer();

      // Trigger event
      this.#triggerEvent('cart:item-added', {
        item: response,
        cartData: this.#cartData
      });

      return response;
    }, 'addToCart');
  }

  /**
   * Update item quantity
   */
  public async updateItemQuantity(key: string, quantity: number): Promise<any> {
    if (!key) return null;

    // Check if offline and offline support is enabled
    if (this.#config.features.useOfflineSupport && !offlineCartManager.isOnline()) {
      return this.#updateItemQuantityOffline(key, quantity);
    }

    return this.#updateItemQuantityOnline(key, quantity);
  }

  /**
   * Update item quantity in offline mode
   */
  private async #updateItemQuantityOffline(key: string, quantity: number): Promise<any> {
    if (quantity <= 0) {
      // Remove item
      const operation = offlineCartManager.removeItem(key);

      // Get updated cart
      const cart = offlineCartManager.getCart();
      this.#cartData = cart;

      // Update UI
      this.#updateCartUI();

      // Trigger event
      this.#triggerEvent('cart:item-removed', {
        key,
        offline: true,
        operationId: operation.id
      });

      return { removed: true, operation };
    } else {
      // Update quantity
      const operation = offlineCartManager.updateItemQuantity(key, quantity);

      // Get updated cart
      const cart = offlineCartManager.getCart();
      this.#cartData = cart;

      // Update UI
      this.#updateCartUI();

      // Trigger event
      this.#triggerEvent('cart:item-updated', {
        key,
        quantity,
        offline: true,
        operationId: operation.id
      });

      return { updated: true, quantity, operation };
    }
  }

  /**
   * Update item quantity online
   */
  private async #updateItemQuantityOnline(key: string, quantity: number): Promise<any> {
    return this.#safeCartOperation(async () => {
      const data = {
        id: key,
        quantity
      };

      // Make API request
      const { data: response } = await this.#apiClient.post(this.#config.apiEndpoints.cartChange, data);

      // Update cart data and UI
      this.#cartData = response;
      this.#updateCartUI();

      // Trigger appropriate event
      if (quantity <= 0) {
        this.#triggerEvent('cart:item-removed', {
          key,
          cartData: this.#cartData
        });
      } else {
        this.#triggerEvent('cart:item-updated', {
          key,
          quantity,
          cartData: this.#cartData
        });
      }

      return response;
    }, 'updateItemQuantity');
  }

  /**
   * Remove an item from the cart
   */
  public async removeItem(key: string): Promise<any> {
    return this.updateItemQuantity(key, 0);
  }

  /**
   * Clear the cart
   */
  public async clearCart(): Promise<any> {
    // Check if offline and offline support is enabled
    if (this.#config.features.useOfflineSupport && !offlineCartManager.isOnline()) {
      return this.#clearCartOffline();
    }

    return this.#clearCartOnline();
  }

  /**
   * Clear cart in offline mode
   */
  private async #clearCartOffline(): Promise<any> {
    const operation = offlineCartManager.clearCart();

    // Get updated cart
    const cart = offlineCartManager.getCart();
    this.#cartData = cart;

    // Update UI
    this.#updateCartUI();

    // Trigger event
    this.#triggerEvent('cart:cleared', {
      offline: true,
      operationId: operation.id
    });

    return { cleared: true, operation };
  }

  /**
   * Clear cart online
   */
  private async #clearCartOnline(): Promise<any> {
    return this.#safeCartOperation(async () => {
      // Make API request
      const { data: response } = await this.#apiClient.post(this.#config.apiEndpoints.cartClear, {});

      // Update cart data and UI
      this.#cartData = response;
      this.#updateCartUI();

      // Trigger event
      this.#triggerEvent('cart:cleared', {
        cartData: this.#cartData
      });

      return response;
    }, 'clearCart');
  }

  /**
   * Sync offline cart changes with the server
   */
  public async syncOfflineCart(): Promise<boolean> {
    if (!this.#config.features.useOfflineSupport) {
      return false;
    }

    return this.#syncOfflineOperations();
  }

  /**
   * Open the cart drawer
   */
  public openCartDrawer(): void {
    const drawer = document.querySelector(this.#config.selectors.cartDrawer);
    if (!drawer) return;

    drawer.classList.add('open');
    document.body.classList.add('cart-drawer-open');
    this.#isOpen = true;

    // Trigger event
    this.#triggerEvent('cart:opened', {
      cartData: this.#cartData
    });
  }

  /**
   * Close the cart drawer
   */
  public closeCartDrawer(): void {
    const drawer = document.querySelector(this.#config.selectors.cartDrawer);
    if (!drawer) return;

    drawer.classList.remove('open');
    document.body.classList.remove('cart-drawer-open');
    this.#isOpen = false;

    // Trigger event
    this.#triggerEvent('cart:closed', {});
  }

  /**
   * Toggle the cart drawer
   */
  public toggleCartDrawer(): void {
    if (this.#isOpen) {
      this.closeCartDrawer();
    } else {
      this.openCartDrawer();
    }
  }

  /**
   * Check if cart drawer is open
   */
  public isCartDrawerOpen(): boolean {
    return this.#isOpen;
  }

  /**
   * Add trauma-encoded memory to cart
   */
  public async addTraumaMemory(productId: number, quantity: number, traumaLevel: number): Promise<any> {
    if (traumaLevel < 1 || traumaLevel > 5) {
      throw new Error(`Invalid trauma level: ${traumaLevel}. Must be between 1-5.`);
    }

    // Use memory encoder to generate encoded properties
    const product = { id: productId };
    const encodedProperties = memoryEncoder.encodeTrauma(product, traumaLevel);

    // Generate quantum properties for visualization
    const quantumProperties = {
      glitchFactor: traumaLevel * 0.2,
      traumaIndex: traumaLevel,
      mutationProfile: `trauma-level-${traumaLevel}`
    };

    // Add to cart with properties
    return this.addToCart({
      id: productId,
      quantity,
      properties: encodedProperties,
      quantumProperties
    });
  }

  /**
   * Apply a profile to the cart system
   */
  public applyProfile(profileName: string): void {
    // Implementation for profile application
    console.log(`Applied profile: ${profileName}`);
  }

  /**
   * Check if a feature is enabled
   */
  public isFeatureEnabled(feature: string): boolean {
    // Check experiments first
    if (this.#experimentVariants.has(feature)) {
      const variant = this.#experimentVariants.get(feature);
      return variant !== 'disabled';
    }

    // Then check config
    return !!this.#config.features[feature as keyof typeof this.#config.features];
  }

  /**
   * Get offline status and stats
   */
  public getOfflineStatus(): {
    isOnline: boolean;
    hasOfflineOperations: boolean;
    pendingOperationCount: number;
    storageStats: any;
  } {
    if (!this.#config.features.useOfflineSupport) {
      return {
        isOnline: true,
        hasOfflineOperations: false,
        pendingOperationCount: 0,
        storageStats: null
      };
    }

    return {
      isOnline: offlineCartManager.isOnline(),
      hasOfflineOperations: offlineCartManager.hasOfflineOperations(),
      pendingOperationCount: offlineCartManager.getOfflineOperations().filter(op => !op.synced).length,
      storageStats: offlineCartManager.getStorageStats()
    };
  }

  /**
   * Cleans up the cart system
   */
  public destroy(): void {
    // Clean up intervals, workers, etc.
    if (this.#worker) {
      this.#terminateWorker();
    }

    // Force sync any pending offline changes
    if (this.#config.features.useOfflineSupport && offlineCartManager.isOnline()) {
      this.syncOfflineCart();
    }
  }
}

// Compatibility with window global
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    // Create the cart system instance
    const cartSystem = CartSystem.getInstance({
      debug: window.location.search.includes('debug=true')
    });

    // Expose to window for backward compatibility
    (window as any).CartSystem = cartSystem;
  });
}

// Export for module usage
export default CartSystem;
