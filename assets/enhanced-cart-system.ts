/**
 * ENHANCED-CART-SYSTEM.TS
 * Consolidated cart functionality for CyberCore theme
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * @Version: 3.0.0
 */

import { NeuralBus } from './neural-bus';
import { CartErrorHandler } from './cart-error-handler';

// Type definitions
export interface CartItem {
  id: string;
  key?: string;
  variantId?: string;
  quantity: number;
  price: number;
  title: string;
  image?: string;
  url?: string;
  options?: Record<string, string>;
  properties?: Record<string, unknown>;
  quantumProperties?: {
    glitchFactor?: number;
    traumaIndex?: number;
    mutationProfile?: string;
  };
}

export interface CartData {
  items: CartItem[];
  item_count: number;
  total_price: number;
  original_total_price?: number;
  total_discount?: number;
  currency: string;
  items_subtotal_price?: number;
}

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
 * Unified implementation combining cart-system.js and enhanced-cart.ts
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
  #offlineQueue: Array<any> = [];
  #isOnline: boolean = navigator.onLine;
  #eventHandlersAttached: boolean = false;
  #traumaCodes: string[] = [];
  #activeProduct: any = null;
  #productMutationRegistry = new Map<string, any>();
  #originalConfig: CartSystemConfig | null = null;
  #experimentVariants = new Map<string, string>();
  #worker: Worker | null = null;

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
        // Apply mutations
        break;
      case 'glitch':
        // Apply glitch effect
        break;
      case 'holographic':
        // Apply holographic effect
        break;
    }
  }

  /**
   * Connect to NeuralBus
   */
  #connectToNeuralBus(): void {
    if (typeof NeuralBus === 'undefined') return;

    try {
      NeuralBus.register('cart-system', { version: '3.0.0' });
      this.#neuralBusConnected = true;

      // Subscribe to relevant events
      NeuralBus.subscribe('cart:refresh', () => {
        this.fetchCart().then(() => this.#updateCartUI());
      });

      // Other subscriptions...
    } catch (e) {
      console.warn('Failed to connect to NeuralBus:', e);
      this.#neuralBusConnected = false;
    }
  }

  /**
   * Handle online/offline status changes
   */
  #handleOnlineStatus(): void {
    const wasOffline = !this.#isOnline;
    this.#isOnline = navigator.onLine;

    if (this.#isOnline && wasOffline) {
      this.#syncOfflineChanges();
    }

    // Dispatch event
    this.#triggerEvent('connectivity:changed', {
      online: this.#isOnline
    });
  }

  /**
   * Sync changes made offline
   */
  async #syncOfflineChanges(): Promise<void> {
    if (!this.#isOnline || this.#offlineQueue.length === 0) return;

    this.#triggerEvent('cart:sync-start', {
      operations: this.#offlineQueue.length
    });

    let successCount = 0;
    const totalOperations = this.#offlineQueue.length;

    // Process offline operations in order
    for (const operation of [...this.#offlineQueue]) {
      try {
        await operation.execute();
        // Remove from queue if successful
        this.#offlineQueue.shift();
        successCount++;
      } catch (error) {
        CartErrorHandler.handleError(error, {
          component: 'cart-system',
          method: 'syncOfflineChanges',
          operation: operation.type
        });
        break; // Stop on first error
      }
    }

    // Update cart UI after sync
    if (successCount > 0) {
      await this.fetchCart();
      this.#updateCartUI();
    }

    this.#triggerEvent('cart:sync-complete', {
      success: this.#offlineQueue.length === 0,
      operationsCompleted: successCount,
      operationsFailed: totalOperations - successCount
    });
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
    } else if (this.#deviceCapabilities.tier === 'medium') {
      // Use simplified effects for medium tier
      this.#config.traumaVisualization = 'minimal';
    }

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

    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach(key => {
        if (isObject(source[key])) {
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

    function isObject(item: any): boolean {
      return item && typeof item === 'object' && !Array.isArray(item);
    }
  }

  /**
   * Process the request queue
   */
  async #processRequestQueue(): Promise<void> {
    if (this.#isProcessingRequests || this.#pendingRequests.length === 0) return;

    this.#isProcessingRequests = true;

    try {
      // Sort by priority (higher first)
      this.#pendingRequests.sort((a, b) => b.priority - a.priority);

      // Take the first request and process it
      const request = this.#pendingRequests.shift();

      try {
        // Execute the request
        const response = await fetch(request.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request.data)
        });

        if (!response.ok) {
          throw new Error(`Request to ${request.endpoint} failed: ${response.status}`);
        }

        const data = await response.json();
        request.resolve(data);
      } catch (error) {
        request.reject(error);
      }
    } finally {
      this.#isProcessingRequests = false;

      // Schedule next request after throttle time
      if (this.#pendingRequests.length > 0) {
        setTimeout(() => {
          this.#processRequestQueue();
        }, this.#config.requestThrottleMs);
      }
    }
  }

  /**
   * Queue a request to the Shopify API
   */
  #queueRequest(endpoint: string, data: any, priority: number = 1): Promise<any> {
    return new Promise((resolve, reject) => {
      // Add request to queue
      this.#pendingRequests.push({
        endpoint,
        data,
        resolve,
        reject,
        timestamp: Date.now(),
        priority
      });

      // Start processing if not already processing
      if (!this.#isProcessingRequests) {
        this.#processRequestQueue();
      }
    });
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
  }

  /**
   * Create a cart item element
   */
  #createCartItemElement(item: CartItem): HTMLElement {
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.setAttribute('data-key', item.key || '');

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
      this.#applyQuantumPropertiesToElement(itemEl, item.quantumProperties);
    }

    // Apply trauma visualization if item has trauma properties
    if (item.properties && item.properties._trauma_level) {
      this.#applyTraumaVisualization(
        itemEl,
        parseInt(item.properties._trauma_level as string, 10)
      );
    }

    return itemEl;
  }

  /**
   * Apply quantum properties to element
   */
  #applyQuantumPropertiesToElement(element: HTMLElement, properties: any): void {
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
   * Apply trauma visualization to element
   */
  #applyTraumaVisualization(element: HTMLElement, traumaLevel: number): void {
    if (traumaLevel < 1 || traumaLevel > 5) return;

    // Add trauma level data attribute
    element.dataset.traumaLevel = traumaLevel.toString();

    // Add CSS classes based on visualization level
    element.classList.add('trauma-encoded');
    element.classList.add(`trauma-level-${traumaLevel}`);

    // Apply visualization based on configured level
    switch (this.#config.traumaVisualization) {
      case 'minimal':
        // Basic visual indicators only
        break;

      case 'standard':
        // Add standard visual distortions
        if (traumaLevel >= 3) {
          element.classList.add('trauma-distortion');
        }
        break;

      case 'enhanced':
        // Add enhanced visual and interactive effects
        if (traumaLevel >= 3) {
          element.classList.add('trauma-distortion');

          // Add pulsing element for higher trauma levels
          const pulseElement = document.createElement('div');
          pulseElement.className = 'trauma-pulse';
          pulseElement.style.opacity = `${0.2 * traumaLevel}`;
          element.appendChild(pulseElement);
        }

        if (traumaLevel >= 4) {
          element.classList.add('quantum-unstable');

          // Generate glitch effect occasionally
          const glitchInterval = setInterval(() => {
            element.classList.add('glitching');
            setTimeout(() => {
              element.classList.remove('glitching');
            }, 200 + Math.random() * 300);
          }, 5000 + Math.random() * 10000);

          // Store interval ID for cleanup
          element.dataset.glitchIntervalId = glitchInterval.toString();
        }
        break;
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
      const res = await fetch(this.#config.apiEndpoints.cartGet);
      if (!res.ok) throw new Error('Cart fetch failed');
      this.#cartData = await res.json();
      return this.#cartData;
    }, 'fetchCart', { fallbackValue: this.#cartData });
  }

  /**
   * Add an item to the cart
   */
  public async addToCart(formDataOrItem: FormData | any): Promise<any> {
    if (!this.#isOnline && this.#config.features.useOfflineSupport) {
      // Store in offline queue
      const item = formDataOrItem instanceof FormData
        ? Object.fromEntries(formDataOrItem.entries())
        : formDataOrItem;

      this.#offlineQueue.push({
        type: 'addToCart',
        data: item,
        execute: () => this.#addItemOnline(formDataOrItem)
      });

      // Generate optimistic response
      const response = {
        ...item,
        id: `offline-${Date.now()}`,
        offline: true
      };

      this.#triggerEvent('cart:item-added', {
        item: response,
        offline: true
      });

      return response;
    }

    return this.#addItemOnline(formDataOrItem);
  }

  /**
   * Add item to cart online
   */
  private async #addItemOnline(formDataOrItem: FormData | any): Promise<any> {
    return this.#safeCartOperation(async () => {
      let data;

      if (formDataOrItem instanceof FormData) {
        // Convert FormData to JSON
        data = Object.fromEntries(formDataOrItem.entries());
      } else {
        data = formDataOrItem;
      }

      // Process through request queue
      const result = await this.#queueRequest(
        this.#config.apiEndpoints.cartAdd,
        data,
        2 // High priority
      );

      // Update cart data
      await this.fetchCart();
      this.#updateCartUI();

      // Open cart drawer
      this.openCartDrawer();

      // Trigger event
      this.#triggerEvent('cart:item-added', {
        item: result,
        cartData: this.#cartData
      });

      return result;
    }, 'addToCart');
  }

  /**
   * Update item quantity
   */
  public async updateItemQuantity(key: string, quantity: number): Promise<any> {
    if (!key) return null;

    if (!this.#isOnline && this.#config.features.useOfflineSupport) {
      // Store in offline queue
      this.#offlineQueue.push({
        type: 'updateItemQuantity',
        data: { key, quantity },
        execute: () => this.#updateItemQuantityOnline(key, quantity)
      });

      // Update local cart data optimistically
      if (this.#cartData && this.#cartData.items) {
        const itemIndex = this.#cartData.items.findIndex(item => item.key === key);

        if (itemIndex >= 0) {
          const item = this.#cartData.items[itemIndex];
          const oldQuantity = item.quantity;

          // Update item quantity
          item.quantity = quantity;

          // Update cart totals
          this.#cartData.item_count += (quantity - oldQuantity);
          this.#cartData.total_price += (quantity - oldQuantity) * item.price;

          // Update UI
          this.#updateCartUI();

          // Trigger event
          this.#triggerEvent('cart:item-updated', {
            key,
            quantity,
            item,
            offline: true
          });
        }
      }

      return this.#cartData;
    }

    return this.#updateItemQuantityOnline(key, quantity);
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

      // Process through request queue
      const result = await this.#queueRequest(
        this.#config.apiEndpoints.cartChange,
        data,
        1 // Normal priority
      );

      // Update cart data and UI
      this.#cartData = result;
      this.#updateCartUI();

      // Trigger event
      this.#triggerEvent('cart:item-updated', {
        key,
        quantity,
        cartData: this.#cartData
      });

      return result;
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
    return this.#safeCartOperation(async () => {
      // Process through request queue
      const result = await this.#queueRequest(
        this.#config.apiEndpoints.cartClear,
        {},
        2 // High priority
      );

      // Update cart data and UI
      this.#cartData = result;
      this.#updateCartUI();

      // Trigger event
      this.#triggerEvent('cart:cleared', {
        cartData: this.#cartData
      });

      return result;
    }, 'clearCart');
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

    const properties = {
      _trauma_level: traumaLevel.toString(),
      _trauma_timestamp: Date.now().toString(),
      _trauma_pattern: this.#generateTraumaPattern(traumaLevel)
    };

    const quantumProperties = {
      glitchFactor: traumaLevel * 0.2,
      traumaIndex: traumaLevel,
      mutationProfile: `trauma-level-${traumaLevel}`
    };

    return this.addToCart({
      id: productId,
      quantity,
      properties,
      quantumProperties
    });
  }

  /**
   * Generate trauma pattern
   */
  #generateTraumaPattern(level: number): string {
    const patterns = [
      'void-sequence',
      'quantum-drift',
      'temporal-echo',
      'neural-imprint',
      'memory-fracture'
    ];

    const patternIndex = Math.min(level - 1, patterns.length - 1);
    return patterns[patternIndex];
  }

  /**
   * Set trauma codes
   */
  public setTraumaCodes(codes: string[]): void {
    this.#traumaCodes = [...codes];

    // Publish to NeuralBus
    if (this.#neuralBusConnected) {
      NeuralBus.publish('cart:trauma-codes-set', {
        codes: this.#traumaCodes
      });
    }
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
   * Cleans up the cart system
   */
  public destroy(): void {
    // Clean up intervals, workers, etc.
    if (this.#worker) {
      this.#terminateWorker();
    }

    // Remove event listeners
    window.removeEventListener('online', this.#handleOnlineStatus.bind(this));
    window.removeEventListener('offline', this.#handleOnlineStatus.bind(this));
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
