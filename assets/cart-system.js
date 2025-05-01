/**
 * VoidBloom Cart System
 * Trauma-encoded e-commerce processing engine with fallback support
 *
 * Version: 2.0.1
 */

class CartSystem {
  constructor() {
    // Private configuration
    this._config = {
      apiEndpoints: {
        cartGet: '/cart.js',
        cartAdd: '/cart/add.js',
        cartUpdate: '/cart/update.js',
        cartChange: '/cart/change.js',
        cartClear: '/cart/clear.js',
      },
      selectors: {
        cartDrawerSelector: '#cart-drawer',
        cartToggleSelector: '.cart-toggle, [data-cart-toggle]',
        cartCloseSelector: '.cart-close, [data-cart-close]',
        cartQuantityElements: '.cart-count',
        addToCartFormSelector: 'form[action="/cart/add"]',
        productFormSelector: 'form.product-form',
        cartItemSelector: '.cart-item',
        cartItemRemoveSelector: '.cart-item__remove',
        cartItemQuantitySelector: '.cart-item__quantity-input',
        cartDrawerToggleSelector: '[data-cart-toggle]',
        cartEmptyMessageSelector: '.cart-empty-message',
        cartErrorSelector: '.cart-error',
      },
      useQuantumEffects: true,
      useHolographicPreviews: false,
    };

    // Internal state
    this._cartData = null;
    this._lastRequestTimestamp = 0;
    this._pendingRequests = [];
    this._requestThrottleMs = 300;
    this._processing = false;
    this._eventHandlersAttached = false;
    this._holographicPreviewsSupported = false;

    // Create a global reference
    if (!window.cartSystem) {
      window.cartSystem = this;
    }

    console.log('Cart System initialized');
  }

  /**
   * Initialize the cart system with event handlers and initial data
   */
  initialize(config = {}) {
    // Merge configuration
    Object.assign(this._config, config);

    // Initialize immediately if DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this._initializeSystem());
    } else {
      this._initializeSystem();
    }

    // Connect to neural bus if available
    this._connectToNeuralBus();

    return this;
  }

  /**
   * Initialize the core system
   */
  _initializeSystem() {
    // Fetch initial cart data
    this.fetchCart()
      .then(() => {
        // Attach event listeners if not already attached
        if (!this._eventHandlersAttached) {
          this._attachEventHandlers();
          this._eventHandlersAttached = true;
        }

        // Check for holographic preview support
        if (this._config.useHolographicPreviews) {
          this._checkHolographicSupport();
        }

        // Update cart UI with current data
        this._updateCartUI();
      })
      .catch((error) => {
        console.error('Error initializing cart system:', error);

        // Try one more time with a delay
        setTimeout(() => {
          this.fetchCart()
            .then(() => this._updateCartUI())
            .catch((e) => console.error('Failed to fetch cart on retry:', e));
        }, 2000);
      });
  }

  /**
   * Attach all event handlers for cart functionality
   */
  _attachEventHandlers() {
    // Cart drawer toggle buttons
    const toggleButtons = document.querySelectorAll(this._config.selectors.cartToggleSelector);
    toggleButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleCartDrawer();
      });
    });

    // Cart close buttons
    const closeButtons = document.querySelectorAll(this._config.selectors.cartCloseSelector);
    closeButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeCartDrawer();
      });
    });

    // Add to cart forms
    const addToCartForms = document.querySelectorAll(this._config.selectors.addToCartFormSelector);
    addToCartForms.forEach((form) => {
      form.addEventListener('submit', this._handleFormSubmit.bind(this));
    });

    // Background overlay click
    const overlay = document.querySelector('.cart-overlay');
    if (overlay) {
      overlay.addEventListener('click', () => this.closeCartDrawer());
    }

    // Listen for cart:open and cart:close custom events
    window.addEventListener('cart:open', () => this.openCartDrawer());
    window.addEventListener('cart:close', () => this.closeCartDrawer());
    window.addEventListener('cart:toggle', () => this.toggleCartDrawer());

    console.log('Cart event handlers attached');
  }

  /**
   * Connect to the neural bus if available
   */
  _connectToNeuralBus() {
    if (window.NeuralBus) {
      window.NeuralBus.registerSystem('cart', this);

      // Listen for quantum effects
      window.NeuralBus.subscribe('quantum', (message) => {
        if (message.action === 'effect' && this._config.useQuantumEffects) {
          // Apply quantum effects to cart items
          const cartItems = document.querySelectorAll(this._config.selectors.cartItemSelector);
          cartItems.forEach((item) => {
            item.setAttribute('data-quantum-affected', 'true');
            setTimeout(() => {
              item.removeAttribute('data-quantum-affected');
            }, 1000);
          });
        }
      });

      console.log('Connected to Neural Bus');
    }
  }

  /**
   * Check for holographic preview support
   */
  _checkHolographicSupport() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      this._holographicPreviewsSupported = !!gl;

      if (this._holographicPreviewsSupported) {
        // Dynamically load the hologram renderer if supported
        const script = document.createElement('script');
        script.src = this._getAssetUrl('hologram-renderer.js');
        script.onload = () => {
          console.log('Holographic previews enabled');
        };
        document.head.appendChild(script);
      }
    } catch (e) {
      this._holographicPreviewsSupported = false;
      console.warn('Holographic previews not supported on this device');
    }
  }

  /**
   * Get asset URL with fallbacks
   */
  _getAssetUrl(filename) {
    // Recursive path determination for maximum resilience
    if (window.themeAssetURL) {
      return `${window.themeAssetURL}${filename}`;
    }

    // Check if we're in Shopify context
    if (typeof Shopify !== 'undefined' && Shopify.theme) {
      return `${Shopify.theme.assets_url || '/cdn/shop/t/5/assets'}/${filename}`;
    }

    return `/cdn/shop/t/5/assets/${filename}`;
  }

  /**
   * Handle form submission for add to cart
   */
  _handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    // Add loading state
    form.classList.add('adding');
    const submitButton = form.querySelector('[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.setAttribute('aria-busy', 'true');
    }

    this.addItemFromForm(formData)
      .then(() => {
        // Open cart drawer on success
        this.openCartDrawer();

        // Emit success event
        const successEvent = new CustomEvent('cart:added', {
          bubbles: true,
          detail: { formData },
        });
        form.dispatchEvent(successEvent);

        // Reset form if needed
        const resetOnAdd = form.dataset.resetOnAdd === 'true';
        if (resetOnAdd) {
          form.reset();
        }

        // Apply quantum effects if available
        if (this._config.useQuantumEffects && window.NeuralBus) {
          window.NeuralBus.publish('quantum', {
            action: 'effect',
            intensity: 0.7,
            duration: 800,
            type: 'cart-add',
          });
        }
      })
      .catch((error) => {
        console.error('Error adding to cart:', error);

        // Display error
        const errorMessage = error.message || 'Could not add item to cart';
        const errorContainer =
          form.querySelector('.form-error') || form.querySelector('.product-form__error');

        if (errorContainer) {
          errorContainer.textContent = errorMessage;
          errorContainer.style.display = 'block';

          // Hide error after 5 seconds
          setTimeout(() => {
            errorContainer.textContent = '';
            errorContainer.style.display = 'none';
          }, 5000);
        }
      })
      .finally(() => {
        // Remove loading state
        form.classList.remove('adding');
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.setAttribute('aria-busy', 'false');
        }
      });
  }

  /**
   * Update all cart UI elements
   */
  _updateCartUI() {
    if (!this._cartData) return;

    // Update cart count
    const countElements = document.querySelectorAll(this._config.selectors.cartQuantityElements);
    const itemCount = this._cartData.item_count || 0;

    countElements.forEach((element) => {
      element.textContent = itemCount.toString();

      // Add animation
      element.setAttribute('data-animate', '');
      setTimeout(() => {
        element.removeAttribute('data-animate');
      }, 1000);
    });

    // Update cart items if drawer is open
    const cartDrawer = document.querySelector(this._config.selectors.cartDrawerSelector);
    if (cartDrawer && cartDrawer.classList.contains('open')) {
      this._updateCartItems();
    }
  }

  /**
   * Update cart items in the drawer
   */
  _updateCartItems() {
    // Implementation would update the cart items in the drawer
    // This would depend on your specific cart drawer implementation

    // Notify neural bus of update
    if (window.NeuralBus) {
      window.NeuralBus.publish('cart', {
        action: 'updated',
        itemCount: this._cartData.item_count,
        totalPrice: this._cartData.total_price,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Fetch current cart data
   */
  async fetchCart() {
    try {
      const response = await fetch(this._config.apiEndpoints.cartGet);

      if (!response.ok) {
        throw new Error(`Failed to fetch cart: ${response.status}`);
      }

      this._cartData = await response.json();
      this._updateCartUI();

      return this._cartData;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  }

  /**
   * Post data to Shopify API
   */
  async _postToShopify(endpoint, data) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Request to ${endpoint} failed: ${response.status}`);
    }

    const responseData = await response.json();

    // Update local cart data
    await this.fetchCart();

    return responseData;
  }

  /**
   * Add item from form data
   */
  async addItemFromForm(formData) {
    const formObj = {};
    const properties = {};

    // Convert FormData to object
    formData.forEach((value, key) => {
      if (key.startsWith('properties[') && key.endsWith(']')) {
        const propName = key.slice(11, -1);
        properties[propName] = value;
      } else {
        formObj[key] = value;
      }
    });

    // Create cart item from form data
    const cartItem = {
      id: formObj.id || formObj.variant_id,
      quantity: parseInt(formObj.quantity, 10) || 1,
    };

    // Add properties if any
    if (Object.keys(properties).length > 0) {
      cartItem.properties = properties;
    }

    // Add selling plan if present
    if (formObj.selling_plan) {
      cartItem.selling_plan = formObj.selling_plan;
    }

    // Add item to cart
    return this.addItem(cartItem);
  }

  /**
   * Add item to cart
   */
  async addItem(item) {
    try {
      return await this._postToShopify(this._config.apiEndpoints.cartAdd, item);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  }

  /**
   * Update item quantity
   */
  async updateItem(key, quantity) {
    try {
      return await this._postToShopify(this._config.apiEndpoints.cartChange, {
        id: key,
        quantity: quantity,
      });
    } catch (error) {
      console.error('Error updating item quantity:', error);
      throw error;
    }
  }

  /**
   * Remove item from cart
   */
  async removeItem(key) {
    return this.updateItem(key, 0);
  }

  /**
   * Clear cart
   */
  async clearCart() {
    try {
      return await this._postToShopify(this._config.apiEndpoints.cartClear, {});
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  /**
   * Open cart drawer
   */
  openCartDrawer() {
    const drawer = document.querySelector(this._config.selectors.cartDrawerSelector);
    const overlay = document.querySelector('.cart-overlay');

    if (drawer) {
      drawer.classList.add('open');
      document.body.classList.add('cart-drawer-open');

      if (overlay) {
        overlay.classList.add('active');
      }

      // Ensure cart contents are up to date
      this.fetchCart().then(() => this._updateCartItems());

      // Announce for screen readers
      const announcer = document.querySelector('.visually-hidden.cart-announcement');
      if (announcer) {
        announcer.textContent = 'Cart drawer opened';
      }
    }
  }

  /**
   * Close cart drawer
   */
  closeCartDrawer() {
    const drawer = document.querySelector(this._config.selectors.cartDrawerSelector);
    const overlay = document.querySelector('.cart-overlay');

    if (drawer) {
      drawer.classList.remove('open');
      document.body.classList.remove('cart-drawer-open');

      if (overlay) {
        overlay.classList.remove('active');
      }

      // Announce for screen readers
      const announcer = document.querySelector('.visually-hidden.cart-announcement');
      if (announcer) {
        announcer.textContent = 'Cart drawer closed';
      }
    }
  }

  /**
   * Toggle cart drawer
   */
  toggleCartDrawer() {
    const drawer = document.querySelector(this._config.selectors.cartDrawerSelector);

    if (drawer && drawer.classList.contains('open')) {
      this.closeCartDrawer();
    } else {
      this.openCartDrawer();
    }
  }

  /**
   * Neural Bus message handler
   */
  onMessage(message) {
    if (message.action === 'refresh') {
      this.fetchCart();
    } else if (message.action === 'open') {
      this.openCartDrawer();
    } else if (message.action === 'close') {
      this.closeCartDrawer();
    }
  }
}

// Initialize cart system
const cartSystem = new CartSystem();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CartSystem, cartSystem };
}

// Also support ES modules
if (typeof exports !== 'undefined') {
  exports.CartSystem = CartSystem;
  exports.default = cartSystem;
}
