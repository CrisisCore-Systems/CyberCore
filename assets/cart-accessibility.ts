/**
 * CART-ACCESSIBILITY.TS
 * Accessibility enhancements for the cart system
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * @Version: 1.0.0
 */

import { domCache } from './dom-cache-manager';

/**
 * CartAccessibility
 * Enhances the cart system with accessibility features for assistive technologies
 */
export class CartAccessibility {
  private static instance: CartAccessibility | null = null;
  private initialized: boolean = false;
  private announcementsContainer: HTMLElement | null = null;
  private debugMode: boolean = false;

  // Current active element before cart open (for returning focus)
  private activeElementBeforeOpen: Element | null = null;

  // Keyboard trap elements for modal behavior
  private firstFocusableElement: HTMLElement | null = null;
  private lastFocusableElement: HTMLElement | null = null;

  // Cart drawer selector (configurable)
  private cartDrawerSelector: string = '#cart-drawer';

  // Selectors for focusable elements
  private focusableElementsString: string =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  /**
   * Private constructor for singleton pattern
   */
  private constructor() {}

  /**
   * Get the singleton instance
   */
  public static getInstance(): CartAccessibility {
    if (!CartAccessibility.instance) {
      CartAccessibility.instance = new CartAccessibility();
    }
    return CartAccessibility.instance;
  }

  /**
   * Initialize accessibility features
   */
  public initialize(options: { cartDrawerSelector?: string; debug?: boolean } = {}): void {
    if (this.initialized) return;

    // Apply configuration
    if (options.cartDrawerSelector) {
      this.cartDrawerSelector = options.cartDrawerSelector;
    }

    this.debugMode = options.debug || false;

    // Create screen reader announcements container
    this.createAnnouncementsContainer();

    // Set up listeners
    this.setupEventListeners();

    this.initialized = true;

    if (this.debugMode) {
      console.log('[CartAccessibility] Initialized with options:', options);
    }
  }

  /**
   * Create a container for screen reader announcements
   */
  private createAnnouncementsContainer(): void {
    // Check if container already exists
    const existingContainer = document.getElementById('a11y-announcer');
    if (existingContainer) {
      this.announcementsContainer = existingContainer;
      return;
    }

    // Create container for announcements
    this.announcementsContainer = document.createElement('div');
    this.announcementsContainer.id = 'a11y-announcer';
    this.announcementsContainer.setAttribute('aria-live', 'polite');
    this.announcementsContainer.setAttribute('aria-atomic', 'true');
    this.announcementsContainer.className = 'sr-only';
    this.announcementsContainer.style.cssText =
      'position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0, 0, 0, 0); border: 0;';

    document.body.appendChild(this.announcementsContainer);
  }

  /**
   * Set up event listeners for cart accessibility
   */
  private setupEventListeners(): void {
    // Listen for cart opened event
    document.addEventListener('cart:opened', this.handleCartOpened.bind(this));

    // Listen for cart closed event
    document.addEventListener('cart:closed', this.handleCartClosed.bind(this));

    // Listen for cart updates
    document.addEventListener('cart:updated', this.handleCartUpdated.bind(this));

    // Listen for item additions
    document.addEventListener('cart:item-added', this.handleItemAdded.bind(this));

    // Listen for item removals
    document.addEventListener('cart:item-removed', this.handleItemRemoved.bind(this));

    // Listen for keydown events (for modal trap behavior)
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  /**
   * Handle cart opened event
   */
  private handleCartOpened(event: Event): void {
    // Store currently focused element
    this.activeElementBeforeOpen = document.activeElement;

    // Get cart drawer element
    const cartDrawer = domCache.getElement(this.cartDrawerSelector);
    if (!cartDrawer) return;

    // Ensure it has proper ARIA attributes
    this.setCartDrawerAttributes(cartDrawer as HTMLElement);

    // Capture all focusable elements in the cart
    this.captureDrawerFocusableElements(cartDrawer as HTMLElement);

    // Focus the first focusable element
    if (this.firstFocusableElement) {
      this.firstFocusableElement.focus();
    }

    // Announce to screen readers
    this.announce('Cart opened. Use tab to navigate and escape to close.');
  }

  /**
   * Handle cart closed event
   */
  private handleCartClosed(): void {
    // Return focus to the element that was focused before opening
    if (this.activeElementBeforeOpen && this.activeElementBeforeOpen instanceof HTMLElement) {
      this.activeElementBeforeOpen.focus();
    }

    // Reset focus trap elements
    this.firstFocusableElement = null;
    this.lastFocusableElement = null;

    // Announce to screen readers
    this.announce('Cart closed.');
  }

  /**
   * Handle cart updated event
   */
  private handleCartUpdated(event: CustomEvent): void {
    const detail = event.detail || {};

    // Create meaningful announcement based on cart data
    let message = 'Cart updated.';

    if (detail.cartData) {
      const itemCount = detail.cartData.item_count || 0;

      if (itemCount === 0) {
        message = 'Cart is now empty.';
      } else {
        const itemText = itemCount === 1 ? 'item' : 'items';
        message = `Cart updated. You now have ${itemCount} ${itemText} in your cart.`;
      }
    }

    this.announce(message);
  }

  /**
   * Handle item added event
   */
  private handleItemAdded(event: CustomEvent): void {
    const detail = event.detail || {};
    const item = detail.item || {};

    let message = 'Item added to cart.';

    if (item.title) {
      const quantity = item.quantity || 1;
      message = `${quantity} ${quantity === 1 ? 'item' : 'items'} of ${item.title} added to cart.`;
    }

    this.announce(message);
  }

  /**
   * Handle item removed event
   */
  private handleItemRemoved(event: CustomEvent): void {
    const detail = event.detail || {};
    const item = detail.item || {};

    let message = 'Item removed from cart.';

    if (item.title) {
      message = `${item.title} removed from cart.`;
    }

    this.announce(message);
  }

  /**
   * Handle keydown events for modal behavior
   */
  private handleKeyDown(event: KeyboardEvent): void {
    // Check if cart drawer is open
    const cartDrawer = domCache.getElement(this.cartDrawerSelector) as HTMLElement;
    if (!cartDrawer || !cartDrawer.classList.contains('open')) return;

    // ESC key closes the cart
    if (event.key === 'Escape') {
      event.preventDefault();
      // Dispatch an event that the cart system can listen for
      document.dispatchEvent(new CustomEvent('cart:request-close'));
      return;
    }

    // Implement focus trap for the modal
    if (event.key === 'Tab') {
      // If we don't have our focus trap elements, recapture them
      if (!this.firstFocusableElement || !this.lastFocusableElement) {
        this.captureDrawerFocusableElements(cartDrawer);
      }

      // Nothing to trap focus on
      if (!this.firstFocusableElement || !this.lastFocusableElement) return;

      // SHIFT + TAB
      if (event.shiftKey) {
        // If on first element, loop to last
        if (document.activeElement === this.firstFocusableElement) {
          event.preventDefault();
          this.lastFocusableElement.focus();
        }
      }
      // TAB
      else {
        // If on last element, loop to first
        if (document.activeElement === this.lastFocusableElement) {
          event.preventDefault();
          this.firstFocusableElement.focus();
        }
      }
    }
  }

  /**
   * Set proper ARIA attributes on cart drawer
   */
  private setCartDrawerAttributes(cartDrawer: HTMLElement): void {
    // Modal role for screen readers
    cartDrawer.setAttribute('role', 'dialog');
    cartDrawer.setAttribute('aria-modal', 'true');
    cartDrawer.setAttribute('aria-label', 'Shopping Cart');

    // Ensure it has a label/heading
    let heading = cartDrawer.querySelector('h2, [role="heading"]');
    if (!heading) {
      heading = cartDrawer.querySelector('.cart-drawer__title, .cart-drawer-header, .cart-title');
    }

    if (heading && heading.id) {
      cartDrawer.setAttribute('aria-labelledby', heading.id);
    } else if (heading) {
      // Create an ID if one doesn't exist
      const headingId = 'cart-heading-' + Date.now();
      heading.id = headingId;
      cartDrawer.setAttribute('aria-labelledby', headingId);
    }

    // Ensure proper focus order: close button should be first or last
    const closeButton = cartDrawer.querySelector(
      '[data-cart-close], .cart-close, .cart-drawer__close'
    );
    if (closeButton instanceof HTMLElement) {
      // Check if the close button has accessible text
      if (!closeButton.getAttribute('aria-label') && !closeButton.textContent?.trim()) {
        closeButton.setAttribute('aria-label', 'Close cart');
      }
    }
  }

  /**
   * Capture all focusable elements in the cart drawer
   */
  private captureDrawerFocusableElements(cartDrawer: HTMLElement): void {
    const focusableElements = cartDrawer.querySelectorAll(this.focusableElementsString);

    if (focusableElements.length > 0) {
      this.firstFocusableElement = focusableElements[0] as HTMLElement;
      this.lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    } else {
      // If no focusable elements, default to the drawer itself
      cartDrawer.setAttribute('tabindex', '0');
      this.firstFocusableElement = cartDrawer;
      this.lastFocusableElement = cartDrawer;
    }
  }

  /**
   * Make an announcement for screen readers
   */
  public announce(message: string): void {
    if (!this.announcementsContainer) {
      this.createAnnouncementsContainer();
    }

    if (!this.announcementsContainer) return;

    // Set the text content of the announcer
    this.announcementsContainer.textContent = message;

    if (this.debugMode) {
      console.log('[CartAccessibility] Announced:', message);
    }
  }

  /**
   * Add accessibility attributes to cart items
   */
  public enhanceCartItem(itemElement: HTMLElement, item: any): void {
    if (!itemElement) return;

    // Ensure the item has a role
    itemElement.setAttribute('role', 'group');

    // Set accessible name for the item
    itemElement.setAttribute(
      'aria-label',
      `${item.title}, quantity: ${item.quantity}, price: ${this.formatMoney(item.price)}`
    );

    // Enhance quantity controls
    const quantityInput = itemElement.querySelector('input[type="number"]');
    if (quantityInput instanceof HTMLInputElement) {
      // Ensure it has a proper label
      if (!quantityInput.getAttribute('aria-label')) {
        quantityInput.setAttribute('aria-label', `Quantity for ${item.title}`);
      }

      // Find increment/decrement buttons
      const decrementBtn = itemElement.querySelector('[data-action="decrease"]');
      const incrementBtn = itemElement.querySelector('[data-action="increase"]');

      // Enhance decrement button
      if (decrementBtn instanceof HTMLElement) {
        decrementBtn.setAttribute('aria-label', `Decrease quantity of ${item.title}`);
      }

      // Enhance increment button
      if (incrementBtn instanceof HTMLElement) {
        incrementBtn.setAttribute('aria-label', `Increase quantity of ${item.title}`);
      }
    }

    // Enhance remove button
    const removeBtn = itemElement.querySelector('.cart-item__remove, [data-cart-item-remove]');
    if (removeBtn instanceof HTMLElement) {
      removeBtn.setAttribute('aria-label', `Remove ${item.title} from cart`);
    }
  }

  /**
   * Format money value (simple version)
   */
  private formatMoney(cents: number): string {
    const dollars = (cents / 100).toFixed(2);
    return `$${dollars}`;
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    // Remove event listeners
    document.removeEventListener('cart:opened', this.handleCartOpened.bind(this));
    document.removeEventListener('cart:closed', this.handleCartClosed.bind(this));
    document.removeEventListener('cart:updated', this.handleCartUpdated.bind(this));
    document.removeEventListener('cart:item-added', this.handleItemAdded.bind(this));
    document.removeEventListener('cart:item-removed', this.handleItemRemoved.bind(this));
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));

    // Remove announcements container
    if (this.announcementsContainer && this.announcementsContainer.parentNode) {
      this.announcementsContainer.parentNode.removeChild(this.announcementsContainer);
    }

    this.initialized = false;
    this.announcementsContainer = null;
    this.firstFocusableElement = null;
    this.lastFocusableElement = null;
    this.activeElementBeforeOpen = null;
  }
}

// Export singleton instance
export const cartAccessibility = CartAccessibility.getInstance();
export default cartAccessibility;
