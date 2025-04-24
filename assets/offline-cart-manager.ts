/**
 * OFFLINE-CART-MANAGER.TS
 * Offline support for the cart system with sync capabilities
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: persistence
 * @Version: 2.0.0
 */

/**
 * Enum for offline operation types
 */
export enum OfflineOperationType {
  ADD_ITEM = 'ADD_ITEM',
  UPDATE_ITEM = 'UPDATE_ITEM',
  REMOVE_ITEM = 'REMOVE_ITEM',
  CLEAR_CART = 'CLEAR_CART',
}

/**
 * Type for cart item
 */
export interface CartItem {
  id: string | number;
  key?: string;
  quantity: number;
  title: string;
  price: number;
  variant_id?: string | number;
  variantId?: string | number;
  product_id?: string | number;
  productId?: string | number;
  image?: string;
  url?: string;
  properties?: {
    [key: string]: string | number | boolean;
  };
  quantumProperties?: {
    glitchFactor?: number;
    traumaIndex?: number;
    mutationProfile?: string;
    [key: string]: any;
  };
}

/**
 * Type for cart data
 */
export interface CartData {
  items: CartItem[];
  item_count: number;
  total_price: number;
  original_total_price?: number;
  total_weight?: number;
  currency?: string;
  note?: string;
  attributes?: { [key: string]: string };
  token?: string;
  requires_shipping?: boolean;
}

/**
 * Type for offline operations
 */
export interface OfflineOperation {
  id: string;
  type: OfflineOperationType;
  data: any;
  timestamp: number;
  synced: boolean;
  syncAttempts: number;
  error?: string;
}

/**
 * Type for storage statistics
 */
export interface StorageStats {
  totalSize: number;
  operationsCount: number;
  cartSize: number;
  unsyncedCount: number;
  oldestOperationDate: Date | null;
}

/**
 * Offline operation status
 */
export interface OfflineSyncStatus {
  success: boolean;
  completed: number;
  failed: number;
  errors: Array<{ id: string; error: string }>;
}

/**
 * Type for sync operation callback
 */
type SyncCallback = (operation: OfflineOperation) => Promise<any>;

class OfflineCartManager {
  private static instance: OfflineCartManager | null = null;

  // Storage keys
  private readonly STORAGE_KEY_CART = 'cybercore_offline_cart';
  private readonly STORAGE_KEY_OPERATIONS = 'cybercore_offline_operations';
  private readonly STORAGE_VERSION = '2.0.0';

  // Private properties
  private cartData: CartData | null = null;
  private offlineOperations: OfflineOperation[] = [];
  private isSyncingOperations: boolean = false;
  private isOnlineState: boolean = true;
  private initCompleted: boolean = false;
  private lastSyncTimestamp: number = 0;

  /**
   * Private constructor (use getInstance)
   */
  private constructor() {
    this.init();
  }

  /**
   * Initialize the offline cart manager
   */
  private async init(): Promise<void> {
    try {
      // Check online status
      this.isOnlineState = navigator.onLine;

      // Load stored cart and operations
      await this.loadFromStorage();

      // Set up online/offline event listeners
      window.addEventListener('online', this.handleOnlineStatus.bind(this));
      window.addEventListener('offline', this.handleOnlineStatus.bind(this));

      // Check if there are any unsynced operations when coming back online
      window.addEventListener('online', this.handleComingBackOnline.bind(this));

      // Clean up old operations periodically
      setInterval(this.cleanupOldOperations.bind(this), 24 * 60 * 60 * 1000); // Once per day

      this.initCompleted = true;
    } catch (error) {
      console.error('Failed to initialize offline cart manager:', error);
      // Fall back to assuming online mode
      this.isOnlineState = true;
    }
  }

  /**
   * Load cart and operations from storage
   */
  private async loadFromStorage(): Promise<void> {
    try {
      // Load cart data
      const storedCartData = localStorage.getItem(this.STORAGE_KEY_CART);
      if (storedCartData) {
        this.cartData = JSON.parse(storedCartData);
      } else {
        // Initialize empty cart
        this.cartData = {
          items: [],
          item_count: 0,
          total_price: 0,
        };
      }

      // Load operations
      const storedOperations = localStorage.getItem(this.STORAGE_KEY_OPERATIONS);
      if (storedOperations) {
        this.offlineOperations = JSON.parse(storedOperations);
      }
    } catch (error) {
      console.error('Failed to load from storage:', error);
      // Initialize with empty data
      this.cartData = {
        items: [],
        item_count: 0,
        total_price: 0,
      };
      this.offlineOperations = [];
    }
  }

  /**
   * Save cart data to storage
   */
  private saveCartToStorage(): void {
    try {
      if (this.cartData) {
        localStorage.setItem(this.STORAGE_KEY_CART, JSON.stringify(this.cartData));
      }
    } catch (error) {
      console.error('Failed to save cart to storage:', error);
    }
  }

  /**
   * Save operations to storage
   */
  private saveOperationsToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY_OPERATIONS, JSON.stringify(this.offlineOperations));
    } catch (error) {
      console.error('Failed to save operations to storage:', error);
    }
  }

  /**
   * Clean up old operations from storage
   */
  private cleanupOldOperations(): void {
    try {
      // Keep only unsynced operations and recent synced operations (less than 7 days old)
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

      this.offlineOperations = this.offlineOperations.filter((op) => {
        // Keep all unsynced operations
        if (!op.synced) {
          return true;
        }

        // Keep recent synced operations
        return op.timestamp > sevenDaysAgo;
      });

      this.saveOperationsToStorage();
    } catch (error) {
      console.error('Failed to clean up old operations:', error);
    }
  }

  /**
   * Handle online status change
   */
  private handleOnlineStatus(event: Event): void {
    this.isOnlineState = navigator.onLine;

    // If coming back online, try to sync
    if (this.isOnlineState && event.type === 'online') {
      this.handleComingBackOnline();
    }
  }

  /**
   * Handle coming back online
   */
  private async handleComingBackOnline(): Promise<void> {
    // Prevent multiple sync attempts
    if (this.isSyncingOperations) {
      return;
    }

    // Check if there are unsynced operations
    const hasUnsyncedOperations = this.offlineOperations.some((op) => !op.synced);

    // Only try to sync if we have unsynced operations and haven't synced recently
    const currentTime = Date.now();
    const hasEnoughTimePassed = currentTime - this.lastSyncTimestamp > 5000; // 5 seconds

    if (hasUnsyncedOperations && hasEnoughTimePassed) {
      // Dispatch event that we're coming back online with pending operations
      window.dispatchEvent(
        new CustomEvent('cart:reconnected', {
          detail: {
            pendingOperations: this.offlineOperations.filter((op) => !op.synced).length,
          },
        })
      );

      // Auto-sync operations asynchronously
      this.syncOfflineOperations(async (operation) => {
        // Here we simply return a placeholder to indicate success
        // The actual cart data will be updated when fetchCart is called after
        return { success: true };
      }).then((result) => {
        if (result.success) {
          // Dispatch event that sync was successful
          window.dispatchEvent(
            new CustomEvent('cart:sync-complete', {
              detail: {
                success: true,
                operationsCompleted: result.completed,
                operationsFailed: result.failed,
              },
            })
          );
        }
      });

      this.lastSyncTimestamp = currentTime;
    }
  }

  /**
   * Generate a unique ID for operations
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  }

  /**
   * Add a new offline operation
   */
  private addOperation(type: OfflineOperationType, data: any): OfflineOperation {
    const operation: OfflineOperation = {
      id: this.generateId(),
      type,
      data,
      timestamp: Date.now(),
      synced: false,
      syncAttempts: 0,
    };

    this.offlineOperations.push(operation);
    this.saveOperationsToStorage();

    return operation;
  }

  /**
   * Mark an operation as synced
   */
  private markOperationSynced(id: string, error?: string): void {
    const operationIndex = this.offlineOperations.findIndex((op) => op.id === id);

    if (operationIndex !== -1) {
      if (error) {
        // Mark as failed
        this.offlineOperations[operationIndex].syncAttempts += 1;
        this.offlineOperations[operationIndex].error = error;
      } else {
        // Mark as synced
        this.offlineOperations[operationIndex].synced = true;
        this.offlineOperations[operationIndex].error = undefined;
      }

      this.saveOperationsToStorage();
    }
  }

  /**
   * Apply operation to local cart data
   */
  private applyOperationToLocalCart(operation: OfflineOperation): void {
    if (!this.cartData) {
      this.cartData = {
        items: [],
        item_count: 0,
        total_price: 0,
      };
    }

    switch (operation.type) {
      case OfflineOperationType.ADD_ITEM:
        this.applyAddItemOperation(operation.data);
        break;

      case OfflineOperationType.UPDATE_ITEM:
        this.applyUpdateItemOperation(operation.data.key, operation.data.quantity);
        break;

      case OfflineOperationType.REMOVE_ITEM:
        this.applyRemoveItemOperation(operation.data.key);
        break;

      case OfflineOperationType.CLEAR_CART:
        this.applyClearCartOperation();
        break;
    }

    // Save updated cart to storage
    this.saveCartToStorage();
  }

  /**
   * Apply add item operation to local cart
   */
  private applyAddItemOperation(item: CartItem): void {
    if (!this.cartData) return;

    // Generate a temporary key if needed
    if (!item.key) {
      item.key = `offline_${this.generateId()}`;
    }

    // Check if item exists in cart
    const existingItemIndex = this.cartData.items.findIndex(
      (i) => (i.key && i.key === item.key) || (i.id && i.id === item.id)
    );

    if (existingItemIndex !== -1) {
      // Update existing item
      this.cartData.items[existingItemIndex].quantity += item.quantity;
    } else {
      // Add new item
      this.cartData.items.push(item);
    }

    // Update cart totals
    this.updateCartTotals();
  }

  /**
   * Apply update item operation to local cart
   */
  private applyUpdateItemOperation(key: string, quantity: number): void {
    if (!this.cartData) return;

    const itemIndex = this.cartData.items.findIndex((i) => i.key === key);

    if (itemIndex !== -1) {
      // Update quantity
      this.cartData.items[itemIndex].quantity = quantity;

      // Update cart totals
      this.updateCartTotals();
    }
  }

  /**
   * Apply remove item operation to local cart
   */
  private applyRemoveItemOperation(key: string): void {
    if (!this.cartData) return;

    // Filter out the item
    this.cartData.items = this.cartData.items.filter((i) => i.key !== key);

    // Update cart totals
    this.updateCartTotals();
  }

  /**
   * Apply clear cart operation to local cart
   */
  private applyClearCartOperation(): void {
    if (!this.cartData) return;

    // Clear all items
    this.cartData.items = [];

    // Update cart totals
    this.updateCartTotals();
  }

  /**
   * Update cart totals
   */
  private updateCartTotals(): void {
    if (!this.cartData) return;

    // Update item count
    this.cartData.item_count = this.cartData.items.reduce(
      (total, item) => total + item.quantity,
      0
    );

    // Update total price
    this.cartData.total_price = this.cartData.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }

  // Public methods

  /**
   * Get the current cart data
   */
  public getCart(): CartData | null {
    return this.cartData;
  }

  /**
   * Update with server cart data
   */
  public updateWithServerCart(serverCart: CartData): void {
    this.cartData = serverCart;
    this.saveCartToStorage();
  }

  /**
   * Add item to offline cart
   */
  public addItem(item: CartItem): OfflineOperation {
    // Create the operation
    const operation = this.addOperation(OfflineOperationType.ADD_ITEM, item);

    // Apply operation to local cart
    this.applyOperationToLocalCart(operation);

    return operation;
  }

  /**
   * Update item quantity
   */
  public updateItemQuantity(key: string, quantity: number): OfflineOperation {
    // Create the operation
    const operation = this.addOperation(OfflineOperationType.UPDATE_ITEM, { key, quantity });

    // Apply operation to local cart
    this.applyOperationToLocalCart(operation);

    return operation;
  }

  /**
   * Remove item from cart
   */
  public removeItem(key: string): OfflineOperation {
    // Create the operation
    const operation = this.addOperation(OfflineOperationType.REMOVE_ITEM, { key });

    // Apply operation to local cart
    this.applyOperationToLocalCart(operation);

    return operation;
  }

  /**
   * Clear cart
   */
  public clearCart(): OfflineOperation {
    // Create the operation
    const operation = this.addOperation(OfflineOperationType.CLEAR_CART, {});

    // Apply operation to local cart
    this.applyOperationToLocalCart(operation);

    return operation;
  }

  /**
   * Get all offline operations
   */
  public getOfflineOperations(): OfflineOperation[] {
    return [...this.offlineOperations];
  }

  /**
   * Check if there are any unsynced operations
   */
  public hasOfflineOperations(): boolean {
    return this.offlineOperations.some((op) => !op.synced);
  }

  /**
   * Check if currently syncing operations
   */
  public isSyncing(): boolean {
    return this.isSyncingOperations;
  }

  /**
   * Check if device is online
   */
  public isOnline(): boolean {
    return this.isOnlineState;
  }

  /**
   * Sync offline operations with server
   */
  public async syncOfflineOperations(processOperation: SyncCallback): Promise<OfflineSyncStatus> {
    // Skip if already syncing or no operations to sync
    if (this.isSyncingOperations || !this.hasOfflineOperations() || !this.isOnlineState) {
      return {
        success: false,
        completed: 0,
        failed: 0,
        errors: [],
      };
    }

    this.isSyncingOperations = true;

    // Get unsynced operations
    const unsyncedOperations = this.offlineOperations
      .filter((op) => !op.synced)
      .sort((a, b) => a.timestamp - b.timestamp); // Process in order

    const result: OfflineSyncStatus = {
      success: true,
      completed: 0,
      failed: 0,
      errors: [],
    };

    try {
      // Process operations one by one
      for (const operation of unsyncedOperations) {
        try {
          await processOperation(operation);

          // Mark as synced
          this.markOperationSynced(operation.id);
          result.completed++;
        } catch (error) {
          // Mark as failed
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.markOperationSynced(operation.id, errorMessage);
          result.failed++;
          result.errors.push({ id: operation.id, error: errorMessage });

          // Mark overall sync as failed if any operation fails
          result.success = false;
        }
      }
    } finally {
      this.isSyncingOperations = false;
    }

    return result;
  }

  /**
   * Get storage statistics
   */
  public getStorageStats(): StorageStats {
    const cartJson = this.cartData ? JSON.stringify(this.cartData) : '';
    const operationsJson = JSON.stringify(this.offlineOperations);

    const unsyncedOperations = this.offlineOperations.filter((op) => !op.synced);

    const oldestOperation =
      this.offlineOperations.length > 0
        ? this.offlineOperations.reduce((oldest, current) =>
            current.timestamp < oldest.timestamp ? current : oldest
          )
        : null;

    return {
      totalSize: cartJson.length + operationsJson.length,
      operationsCount: this.offlineOperations.length,
      cartSize: cartJson.length,
      unsyncedCount: unsyncedOperations.length,
      oldestOperationDate: oldestOperation ? new Date(oldestOperation.timestamp) : null,
    };
  }

  /**
   * Clear all offline data
   */
  public clearOfflineData(): void {
    this.cartData = {
      items: [],
      item_count: 0,
      total_price: 0,
    };

    this.offlineOperations = [];

    this.saveCartToStorage();
    this.saveOperationsToStorage();
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): OfflineCartManager {
    if (!OfflineCartManager.instance) {
      OfflineCartManager.instance = new OfflineCartManager();
    }

    return OfflineCartManager.instance;
  }
}

// Export the singleton instance
const offlineCartManager = OfflineCartManager.getInstance();
export default offlineCartManager;
