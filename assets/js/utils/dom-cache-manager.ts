/**
 * DOM-CACHE-MANAGER.TS
 * Performance optimization for DOM queries
 * 
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * @Version: 1.0.0
 */

/**
 * DOM Element Cache Manager
 * Caches DOM elements to avoid expensive repeated queries
 */
export class DOMCacheManager {
  private static instance: DOMCacheManager;
  private cache: Map<string, Element | null> = new Map();
  private collectionCache: Map<string, NodeListOf<Element>> = new Map();
  private isInitialized: boolean = false;
  private invalidationCallbacks: (() => void)[] = [];
  private mutationObserver: MutationObserver | null = null;
  private observedSelectors: Set<string> = new Set();
  private debugMode: boolean = false;

  /**
   * Private constructor for singleton pattern
   */
  private constructor() {
    this.setupMutationObserver();
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): DOMCacheManager {
    if (!DOMCacheManager.instance) {
      DOMCacheManager.instance = new DOMCacheManager();
    }
    return DOMCacheManager.instance;
  }

  /**
   * Set debug mode
   */
  public setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
  }

  /**
   * Initialize the cache manager
   */
  public initialize(): void {
    if (this.isInitialized) return;
    
    // Clear any existing cache
    this.clearCache();
    
    // Start the mutation observer
    this.startObserver();
    
    this.isInitialized = true;
    
    if (this.debugMode) {
      console.log('[DOMCacheManager] Initialized');
    }
  }

  /**
   * Set up mutation observer to watch for DOM changes
   */
  private setupMutationObserver(): void {
    if (typeof MutationObserver === 'undefined') return;
    
    this.mutationObserver = new MutationObserver((mutations) => {
      let shouldInvalidate = false;
      
      for (const mutation of mutations) {
        // Only process if it's a subtree or childList mutation
        if (mutation.type === 'childList' || mutation.type === 'subtree') {
          shouldInvalidate = true;
          break;
        }
      }
      
      if (shouldInvalidate) {
        this.invalidateCache();
      }
    });
  }

  /**
   * Start the mutation observer
   */
  private startObserver(): void {
    if (!this.mutationObserver || !document.body) return;
    
    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Stop the mutation observer
   */
  private stopObserver(): void {
    if (!this.mutationObserver) return;
    
    this.mutationObserver.disconnect();
  }

  /**
   * Get a DOM element by selector, using the cache
   */
  public getElement(selector: string): Element | null {
    // Check if the element is in the cache
    if (this.cache.has(selector)) {
      return this.cache.get(selector) || null;
    }
    
    // Element not in cache, query the DOM
    const element = document.querySelector(selector);
    
    // Store in cache (even if null)
    this.cache.set(selector, element);
    
    // Add to observed selectors for invalidation tracking
    this.observedSelectors.add(selector);
    
    return element;
  }

  /**
   * Get a collection of DOM elements by selector, using the cache
   */
  public getElements(selector: string): NodeListOf<Element> {
    // Check if the collection is in the cache
    if (this.collectionCache.has(selector)) {
      return this.collectionCache.get(selector)!;
    }
    
    // Collection not in cache, query the DOM
    const elements = document.querySelectorAll(selector);
    
    // Store in cache
    this.collectionCache.set(selector, elements);
    
    // Add to observed selectors for invalidation tracking
    this.observedSelectors.add(selector);
    
    return elements;
  }

  /**
   * Force get an element from DOM (bypass cache)
   */
  public forceGetElement(selector: string): Element | null {
    const element = document.querySelector(selector);
    this.cache.set(selector, element);
    return element;
  }

  /**
   * Force get elements from DOM (bypass cache)
   */
  public forceGetElements(selector: string): NodeListOf<Element> {
    const elements = document.querySelectorAll(selector);
    this.collectionCache.set(selector, elements);
    return elements;
  }

  /**
   * Invalidate the entire cache
   */
  public invalidateCache(): void {
    this.cache.clear();
    this.collectionCache.clear();
    
    // Run all invalidation callbacks
    for (const callback of this.invalidationCallbacks) {
      callback();
    }
    
    if (this.debugMode) {
      console.log('[DOMCacheManager] Cache invalidated');
    }
  }

  /**
   * Invalidate specific selectors
   */
  public invalidateSelectors(selectors: string[]): void {
    for (const selector of selectors) {
      this.cache.delete(selector);
      this.collectionCache.delete(selector);
    }
    
    if (this.debugMode && selectors.length > 0) {
      console.log('[DOMCacheManager] Invalidated selectors:', selectors);
    }
  }

  /**
   * Add a callback to run when cache is invalidated
   */
  public onInvalidate(callback: () => void): void {
    this.invalidationCallbacks.push(callback);
  }

  /**
   * Remove an invalidation callback
   */
  public removeInvalidateCallback(callback: () => void): void {
    const index = this.invalidationCallbacks.indexOf(callback);
    if (index !== -1) {
      this.invalidationCallbacks.splice(index, 1);
    }
  }

  /**
   * Clear the entire cache
   */
  public clearCache(): void {
    this.cache.clear();
    this.collectionCache.clear();
    this.observedSelectors.clear();
    
    if (this.debugMode) {
      console.log('[DOMCacheManager] Cache cleared');
    }
  }

  /**
   * Destroy the cache manager and clean up resources
   */
  public destroy(): void {
    this.clearCache();
    this.stopObserver();
    this.invalidationCallbacks = [];
    this.isInitialized = false;
    
    if (this.debugMode) {
      console.log('[DOMCacheManager] Destroyed');
    }
  }
}

// Export singleton instance
export const domCache = DOMCacheManager.getInstance();
export default domCache;