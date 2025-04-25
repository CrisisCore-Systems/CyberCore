/**
 * OFFLINE-CART-MANAGER.TS
 * Manages cart data offline for the VoidBloom theme
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * @Version: 1.0.0
 */

import cartApi from './cart-api';
import CartErrorHandler, { ErrorCategory } from './cart-error-handler';
import { sanitizeObject } from './security-utils';

/**
 * Cart item interface
 */
export interface CartItem {
  id: string | number;
  quantity: number;
  title?: string;
  price?: number;
  product_id?: number | string;
  variant_id?: number | string;
  key?: string;
  properties?: Record<string, any>;
  [key: string]: any;
}

/**
 * Cart data interface
 */
export interface CartData {
  token?: string;
  note?: string | null;
  attributes?: Record<string, string>;
  total_price?: number;
  items: CartItem[];
  item_count?: number;
  currency?: string;
  lastUpdated?: number;
  items_subtotal_price?: number;
  original_total_price?: number;
}

/**
 * Offline operation type
 */
enum OfflineOperationType {
  ADD = 'add',
  UPDATE = 'update',
  REMOVE = 'remove',
  CLEAR = 'clear',
}

/**
 * Offline operation interface
 */
interface OfflineOperation {
  type: OfflineOperationType;
  timestamp: number;
  data: any;
  id: string;
}

/**
 * Manages the cart data when offline
 */
class OfflineCartManager {
  private storageKey: string = 'voidbloom_offline_cart';
  private operationsKey: string = 'voidbloom_offline_operations';
  private cart: CartData | null = null;
  private pendingOperations: OfflineOperation[] = [];
  private isInitialized: boolean = false;
  private maxOperations: number = 100;

  /**
   * Initialize the offline cart manager
   */
  constructor() {
    this.init();

    // Listen for online/offline events
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline.bind(this));
      window.addEventListener('offline', this.handleOffline.bind(this));
    }
  }

  /**
   * Initialize manager
   */
  private init(): void {
    try {
      // Load cart from storage
      const storedCart = localStorage.getItem(this.storageKey);
      if (storedCart) {
        this.cart = JSON.parse(storedCart);
      } else {
        // Create empty cart
        this.cart = {
          items: [],
          item_count: 0,
          total_price: 0,
          lastUpdated: Date.now(),
        };
      }

      // Load pending operations
      const storedOperations = localStorage.getItem(this.operationsKey);
      if (storedOperations) {
        this.pendingOperations = JSON.parse(storedOperations);
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize offline cart:', error);

      // Reset to safe defaults
      this.cart = {
        items: [],
        item_count: 0,
        total_price: 0,
        lastUpdated: Date.now(),
      };
      this.pendingOperations = [];
    }
  }

  /**
   * Save cart to local storage
   */
  private saveCart(): void {
    try {
      // Update timestamp
      if (this.cart) {
        this.cart.lastUpdated = Date.now();
      }

      localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
    } catch (error) {
      // Handle storage errors (quota exceeded, etc)
      CartErrorHandler.handleError(error instanceof Error ? error : new Error(String(error)), {
        component: 'offline-cart-manager',
        method: 'saveCart',
        category: ErrorCategory.INTERNAL,
      });
    }
  }

  /**
   * Save pending operations to local storage
   */
  private saveOperations(): void {
    try {
      localStorage.setItem(this.operationsKey, JSON.stringify(this.pendingOperations));
    } catch (error) {
      // Handle storage errors
      CartErrorHandler.handleError(error instanceof Error ? error : new Error(String(error)), {
        component: 'offline-cart-manager',
        method: 'saveOperations',
        category: ErrorCategory.INTERNAL,
      });
    }
  }

  /**
   * Add a pending operation
   */
  private addOperation(type: OfflineOperationType, data: any): void {
    // Create operation
    const operation: OfflineOperation = {
      type,
      timestamp: Date.now(),
      data: sanitizeObject(data),
      id: Math.random().toString(36).substring(2, 15),
    };

    // Add to pending operations
    this.pendingOperations.push(operation);

    // Limit number of operations
    if (this.pendingOperations.length > this.maxOperations) {
      // Remove oldest operations
      this.pendingOperations = this.pendingOperations.slice(-this.maxOperations);
    }

    // Save operations
    this.saveOperations();
  }

  /**
   * Recalculate cart totals
   */
  private recalculateCart(): void {
    if (!this.cart) return;

    // Recalculate item count and total price
    let itemCount = 0;
    let totalPrice = 0;

    for (const item of this.cart.items) {
      itemCount += item.quantity;
      if (item.price) {
        totalPrice += item.price * item.quantity;
      }
    }

    this.cart.item_count = itemCount;
    this.cart.total_price = totalPrice;
    this.cart.items_subtotal_price = totalPrice;
    this.cart.original_total_price = totalPrice;
  }

  /**
   * Handle going online
   */
  private async handleOnline(): Promise<void> {
    // Auto-sync when coming back online
    if (this.hasOfflineOperations()) {
      try {
        await this.syncWithServer();
      } catch (error) {
        CartErrorHandler.handleError(error instanceof Error ? error : new Error(String(error)), {
          component: 'offline-cart-manager',
          method: 'handleOnline',
          category: ErrorCategory.NETWORK,
        });
      }
    }
  }

  /**
   * Handle going offline
   */
  private handleOffline(): void {
    // Just log the offline state - we'll handle operations as they come
    console.info('OfflineCartManager: Device is offline, cart operations will be queued');
  }

  // PUBLIC API

  /**
   * Add an item to the cart
   */
  public addItem(item: CartItem): CartData {
    if (!this.cart) this.init();

    // Check if item already exists in cart
    const existingIndex = this.cart!.items.findIndex((i) => String(i.id) === String(item.id));

    if (existingIndex >= 0) {
      // Update quantity
      const existingItem = this.cart!.items[existingIndex];
      existingItem.quantity += item.quantity;

      // Add operation
      this.addOperation(OfflineOperationType.UPDATE, {
        key: existingItem.key || String(existingItem.id),
        quantity: existingItem.quantity,
      });
    } else {
      // Add new item
      if (!item.key) {
        item.key = String(item.id);
      }

      this.cart!.items.push(item);

      // Add operation
      this.addOperation(OfflineOperationType.ADD, item);
    }

    // Update cart
    this.recalculateCart();
    this.saveCart();

    return this.cart!;
  }

  /**
   * Update item quantity
   */
  public updateItemQuantity(key: string, quantity: number): CartData {
    if (!this.cart) this.init();

    // Find item
    const itemIndex = this.cart!.items.findIndex((i) => i.key === key || String(i.id) === key);

    if (itemIndex >= 0) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return this.removeItem(key);
      } else {
        // Update quantity
        this.cart!.items[itemIndex].quantity = quantity;

        // Add operation
        this.addOperation(OfflineOperationType.UPDATE, {
          key,
          quantity,
        });
      }
    }

    // Update cart
    this.recalculateCart();
    this.saveCart();

    return this.cart!;
  }

  /**
   * Remove an item from the cart
   */
  public removeItem(key: string): CartData {
    if (!this.cart) this.init();

    // Find item
    const itemIndex = this.cart!.items.findIndex((i) => i.key === key || String(i.id) === key);

    if (itemIndex >= 0) {
      // Remove item
      this.cart!.items.splice(itemIndex, 1);

      // Add operation
      this.addOperation(OfflineOperationType.REMOVE, {
        key,
      });
    }

    // Update cart
    this.recalculateCart();
    this.saveCart();

    return this.cart!;
  }

  /**
   * Clear the cart
   */
  public clearCart(): CartData {
    // Create empty cart
    this.cart = {
      items: [],
      item_count: 0,
      total_price: 0,
      lastUpdated: Date.now(),
    };

    // Add operation
    this.addOperation(OfflineOperationType.CLEAR, {});

    // Save cart
    this.saveCart();

    return this.cart;
  }

  /**
   * Get the current cart
   */
  public getCart(): CartData {
    if (!this.cart) this.init();
    return this.cart!;
  }

  /**
   * Update with server cart
   */
  public updateWithServerCart(serverCart: CartData): void {
    this.cart = serverCart;

    // Add timestamp
    this.cart.lastUpdated = Date.now();

    // Save to local storage
    this.saveCart();
  }

  /**
   * Check if there are pending offline operations
   */
  public hasOfflineOperations(): boolean {
    return this.pendingOperations.length > 0;
  }

  /**
   * Get the count of pending operations
   */
  public getPendingOperationsCount(): number {
    return this.pendingOperations.length;
  }

  /**
   * Get the pending operations
   */
  public getPendingOperations(): OfflineOperation[] {
    return [...this.pendingOperations];
  }

  /**
   * Sync offline operations with the server
   */
  public async syncWithServer(): Promise<boolean> {
    if (!this.hasOfflineOperations()) {
      return true;
    }

    // Check if online
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return false;
    }

    try {
      // Clone operations to process
      const operations = [...this.pendingOperations];

      // Sort by timestamp
      operations.sort((a, b) => a.timestamp - b.timestamp);

      // Process operations
      for (const operation of operations) {
        switch (operation.type) {
          case OfflineOperationType.ADD:
            await cartApi.addItem(operation.data);
            break;

          case OfflineOperationType.UPDATE:
            await cartApi.updateItemQuantity(operation.data.key, operation.data.quantity);
            break;

          case OfflineOperationType.REMOVE:
            await cartApi.removeItem(operation.data.key);
            break;

          case OfflineOperationType.CLEAR:
            await cartApi.clearCart();
            break;
        }

        // Remove operation from pending list
        const index = this.pendingOperations.findIndex((op) => op.id === operation.id);
        if (index >= 0) {
          this.pendingOperations.splice(index, 1);
          this.saveOperations();
        }
      }

      // Get latest cart from server
      const serverCart = await cartApi.getCart();
      this.updateWithServerCart(serverCart);

      return true;
    } catch (error) {
      // Handle sync error
      CartErrorHandler.handleError(error instanceof Error ? error : new Error(String(error)), {
        component: 'offline-cart-manager',
        method: 'syncWithServer',
        category: ErrorCategory.NETWORK,
      });

      return false;
    }
  }

  /**
   * Check if cart is stale (older than specified time)
   */
  public isCartStale(maxAgeMs: number = 3600000): boolean {
    if (!this.cart || !this.cart.lastUpdated) return true;

    const now = Date.now();
    const age = now - this.cart.lastUpdated;

    return age > maxAgeMs;
  }

  /**
   * Clean up old data
   */
  public cleanup(): void {
    // Remove very old operations (>30 days)
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    this.pendingOperations = this.pendingOperations.filter((op) => op.timestamp > thirtyDaysAgo);

    this.saveOperations();
  }
}

// Create and export singleton instance
const offlineCartManager = new OfflineCartManager();
export default offlineCartManager;
