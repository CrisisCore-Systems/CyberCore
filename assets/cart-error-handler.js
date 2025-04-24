/**
 * Cart Error Handler
 * Enhanced error handling and recovery system for the cart
 *
 * @MutationCompatible: All Variants
 * @Version: 1.0.0
 */

import { NeuralBus } from './neural-bus.js';

// Error severity levels
export enum ErrorSeverity {
  CRITICAL = 'critical',      // System-breaking errors requiring immediate attention
  HIGH = 'high',              // Serious errors that prevent cart functionality
  MEDIUM = 'medium',          // Errors that degrade cart functionality but don't prevent use
  LOW = 'low',                // Minor issues that don't significantly impact functionality
  INFO = 'info'               // Informational messages, not actual errors
}

// Error categories
export enum ErrorCategory {
  NETWORK = 'network',        // Network-related errors (e.g., API failures)
  PERSISTENCE = 'persistence', // Data storage/retrieval errors
  VALIDATION = 'validation',  // Data validation errors
  QUANTUM = 'quantum',        // Quantum effects subsystem errors
  HOLOGRAM = 'hologram',      // Holographic display errors
  MEMORY = 'memory',          // Memory-encoding related errors
  SYNC = 'sync',              // Synchronization errors
  RENDERING = 'rendering',    // UI rendering errors
  UNKNOWN = 'unknown'         // Unclassified errors
}

// Error context interface
export interface ErrorContext {
  component?: string;         // Component where the error occurred
  operation?: string;         // Operation that was being performed
  data?: any;                 // Data related to the error
  userId?: string;            // User ID if available
  sessionId?: string;         // Session ID if available
  timestamp?: number;         // When the error occurred
  retryCount?: number;        // Number of retry attempts
  [key: string]: any;         // Additional context fields
}

// Error state interface
export interface ErrorState {
  active: boolean;            // Whether there's an active error
  severity: ErrorSeverity;    // Current error severity
  message: string;            // Human-readable error message
  timestamp: number;          // When the error occurred
  retryAvailable: boolean;    // Whether retry is available
  recoveryOptions?: string[]; // Available recovery options
}

// Recovery strategy interface
interface RecoveryStrategy {
  name: string;
  description: string;
  canHandle: (error: Error, context?: ErrorContext) => boolean;
  execute: (error: Error, context?: ErrorContext) => Promise<boolean>;
}

/**
 * Handles cart errors with robust recovery mechanisms
 */
export class CartErrorHandler {
  // Error state
  private static errorState: ErrorState = {
    active: false,
    severity: ErrorSeverity.INFO,
    message: '',
    timestamp: 0,
    retryAvailable: false
  };

  // Error log - keeps track of recent errors
  private static errorLog: Array<{
    error: Error;
    context?: ErrorContext;
    severity: ErrorSeverity;
    category: ErrorCategory;
    timestamp: number;
    recovered: boolean;
  }> = [];

  // Maximum number of errors to keep in log
  private static readonly MAX_ERROR_LOG_SIZE = 50;

  // Recovery strategies
  private static recoveryStrategies: RecoveryStrategy[] = [];

  // Configuration
  private static config = {
    autoRetryCount: 3,
    autoRetryDelay: 1000,
    reportErrors: true,
    logToConsole: true,
    useNeuralBus: true,
    persistErrorLog: true,
    errorLogPrefix: 'cybercore-cart-error-',
    recoveryTimeout: 30000, // 30 seconds
    debugMode: false
  };

  /**
   * Initialize the error handler with custom configuration
   */
  public static initialize(config: Partial<typeof CartErrorHandler.config> = {}): void {
    // Merge configurations
    Object.assign(this.config, config);

    // Register default recovery strategies
    this.registerDefaultRecoveryStrategies();

    // Load persisted error log if enabled
    if (this.config.persistErrorLog) {
      this.loadErrorLog();
    }

    // Log initialization
    if (this.config.debugMode) {
      console.log('[CartErrorHandler] Initialized with config:', this.config);
    }
  }

  /**
   * Register default recovery strategies
   */
  private static registerDefaultRecoveryStrategies(): void {
    // Network error recovery strategy
    this.registerRecoveryStrategy({
      name: 'network-retry',
      description: 'Retries failed network requests',
      canHandle: (error, context) => {
        const isNetworkError = error instanceof TypeError &&
          (error.message.includes('network') ||
           error.message.includes('failed to fetch'));

        const isNetworkContext = context?.component?.includes('api') ||
                               context?.operation?.includes('fetch') ||
                               context?.category === ErrorCategory.NETWORK;

        return isNetworkError || isNetworkContext;
      },
      execute: async (error, context) => {
        // Determine retry count
        const retryCount = context?.retryCount || 0;

        // Check if we've already tried too many times
        if (retryCount >= this.config.autoRetryCount) {
          if (this.config.debugMode) {
            console.log(`[CartErrorHandler] Maximum retry attempts (${retryCount}) reached for network error`);
          }
          return false;
        }

        // Wait before retrying
        const delay = this.config.autoRetryDelay * Math.pow(2, retryCount);
        await new Promise(resolve => setTimeout(resolve, delay));

        if (this.config.debugMode) {
          console.log(`[CartErrorHandler] Retrying network operation (attempt ${retryCount + 1})`);
        }

        // TODO: Implement actual retry logic here
        // This would need access to the original request details

        return true;
      }
    });

    // Local storage error recovery
    this.registerRecoveryStrategy({
      name: 'storage-cleanup',
      description: 'Cleans up local storage to recover from storage errors',
      canHandle: (error, context) => {
        return error instanceof Error &&
               (error.message.includes('storage') ||
                error.message.includes('quota') ||
                error.name === 'QuotaExceededError' ||
                context?.category === ErrorCategory.PERSISTENCE);
      },
      execute: async (error, context) => {
        try {
          if (this.config.debugMode) {
            console.log('[CartErrorHandler] Attempting to clean up storage');
          }

          // Clear only cart-related items older than 30 days
          const keysToRemove = [];

          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            // Skip non-cart related items
            if (!key ||
               (!key.includes('cart') &&
                !key.includes('shopping') &&
                !key.startsWith(this.config.errorLogPrefix))) {
              continue;
            }

            try {
              const item = JSON.parse(localStorage.getItem(key) || '{}');

              // Check if the item has a timestamp older than 30 days
              if (item.timestamp &&
                 (Date.now() - item.timestamp > 30 * 24 * 60 * 60 * 1000)) {
                keysToRemove.push(key);
              }
            } catch (e) {
              // If we can't parse the item, it might be corrupted, so remove it
              keysToRemove.push(key);
            }
          }

          // Remove identified items
          keysToRemove.forEach(key => {
            try {
              localStorage.removeItem(key);
            } catch (e) {
              // Ignore errors while cleaning up
            }
          });

          if (this.config.debugMode) {
            console.log(`[CartErrorHandler] Cleaned up ${keysToRemove.length} storage items`);
          }

          return keysToRemove.length > 0;
        } catch (e) {
          if (this.config.debugMode) {
            console.error('[CartErrorHandler] Failed to clean up storage:', e);
          }
          return false;
        }
      }
    });

    // Validation error recovery
    this.registerRecoveryStrategy({
      name: 'validation-fix',
      description: 'Attempts to fix validation errors',
      canHandle: (error, context) => {
        return context?.category === ErrorCategory.VALIDATION ||
               error.message.includes('validation');
      },
      execute: async (error, context) => {
        try {
          if (this.config.debugMode) {
            console.log('[CartErrorHandler] Attempting to fix validation errors');
          }

          // Check if we have data to fix
          if (!context?.data) {
            return false;
          }

          // Sanitize item data
          if (context.data.items) {
            context.data.items = context.data.items.filter(item => {
              // Filter out items with invalid quantities
              if (typeof item.quantity !== 'number' ||
                  item.quantity <= 0 ||
                  isNaN(item.quantity)) {
                return false;
              }

              // Filter out items with missing IDs
              if (item.id === undefined || item.id === null) {
                return false;
              }

              return true;
            });

            // Make sure quantities are integers
            context.data.items.forEach(item => {
              item.quantity = Math.floor(item.quantity);
            });
          }

          return true;
        } catch (e) {
          if (this.config.debugMode) {
            console.error('[CartErrorHandler] Failed to fix validation error:', e);
          }
          return false;
        }
      }
    });
  }

  /**
   * Register a custom recovery strategy
   */
  public static registerRecoveryStrategy(strategy: RecoveryStrategy): void {
    // Check if strategy with same name already exists
    const existingIndex = this.recoveryStrategies.findIndex(s => s.name === strategy.name);

    if (existingIndex >= 0) {
      // Replace existing strategy
      this.recoveryStrategies[existingIndex] = strategy;
    } else {
      // Add new strategy
      this.recoveryStrategies.push(strategy);
    }

    if (this.config.debugMode) {
      console.log(`[CartErrorHandler] ${existingIndex >= 0 ? 'Updated' : 'Registered'} recovery strategy: ${strategy.name}`);
    }
  }

  /**
   * Handle an error with context
   */
  public static async handleError(
    error: Error | string,
    contextOrSeverity?: ErrorContext | ErrorSeverity,
    category?: ErrorCategory
  ): Promise<boolean> {
    // Start timing for performance tracking
    const startTime = performance.now();

    // Convert string errors to Error objects
    const errorObj = typeof error === 'string' ? new Error(error) : error;

    // Parse context and severity
    let context: ErrorContext = {};
    let severity: ErrorSeverity = ErrorSeverity.MEDIUM;

    if (typeof contextOrSeverity === 'string' && Object.values(ErrorSeverity).includes(contextOrSeverity as ErrorSeverity)) {
      severity = contextOrSeverity as ErrorSeverity;
    } else if (contextOrSeverity && typeof contextOrSeverity === 'object') {
      context = contextOrSeverity as ErrorContext;
    }

    // Set default category if not provided
    const errorCategory = category || this.determineErrorCategory(errorObj, context);

    // Add timestamp if not provided
    if (!context.timestamp) {
      context.timestamp = Date.now();
    }

    // Log error
    if (this.config.logToConsole) {
      const prefix = `[CartError][${errorCategory}][${severity}]`;
      console.error(`${prefix} ${errorObj.message}`, { error: errorObj, context });
    }

    // Update error state
    this.errorState = {
      active: true,
      severity,
      message: errorObj.message,
      timestamp: context.timestamp || Date.now(),
      retryAvailable: this.isRetryAvailable(errorObj, context, errorCategory)
    };

    // Add to error log
    this.logError(errorObj, context, severity, errorCategory);

    // Publish to NeuralBus if enabled
    if (this.config.useNeuralBus && typeof NeuralBus !== 'undefined') {
      NeuralBus.publish('cart:error', {
        message: errorObj.message,
        category: errorCategory,
        severity,
        timestamp: this.errorState.timestamp,
        context: { ...context, stack: errorObj.stack }
      });
    }

    // Attempt recovery
    let recovered = false;

    try {
      recovered = await this.attemptRecovery(errorObj, context, errorCategory);

      // Update the last error entry with recovery status
      if (this.errorLog.length > 0) {
        this.errorLog[0].recovered = recovered;
      }

      // Reset error state if recovered
      if (recovered) {
        this.clearErrorState();

        if (this.config.useNeuralBus && typeof NeuralBus !== 'undefined') {
          NeuralBus.publish('cart:error-recovered', {
            message: errorObj.message,
            category: errorCategory,
            severity,
            timestamp: Date.now()
          });
        }
      }
    } catch (recoveryError) {
      if (this.config.debugMode) {
        console.error('[CartErrorHandler] Recovery attempt failed:', recoveryError);
      }
    }

    // Measure handling duration
    const duration = performance.now() - startTime;

    if (this.config.debugMode) {
      console.log(`[CartErrorHandler] Error handling completed in ${duration.toFixed(2)}ms, recovered: ${recovered}`);
    }

    return recovered;
  }

  /**
   * Clear the current error state
   */
  public static clearErrorState(): void {
    this.errorState = {
      active: false,
      severity: ErrorSeverity.INFO,
      message: '',
      timestamp: Date.now(),
      retryAvailable: false
    };

    if (this.config.useNeuralBus && typeof NeuralBus !== 'undefined') {
      NeuralBus.publish('cart:error-cleared', {
        timestamp: Date.now()
      });
    }
  }

  /**
   * Get the current error state
   */
  public static getErrorState(): ErrorState {
    return { ...this.errorState };
  }

  /**
   * Check if there is an active error
   */
  public static hasActiveError(): boolean {
    return this.errorState.active;
  }

  /**
   * Check if an error type is retryable
   */
  private static isRetryAvailable(
    error: Error,
    context: ErrorContext,
    category: ErrorCategory
  ): boolean {
    // Network errors are typically retryable
    if (category === ErrorCategory.NETWORK) {
      return true;
    }

    // Check if we have a recovery strategy for this error
    return this.recoveryStrategies.some(strategy => strategy.canHandle(error, context));
  }

  /**
   * Determine the error category based on the error and context
   */
  private static determineErrorCategory(
    error: Error,
    context?: ErrorContext
  ): ErrorCategory {
    // If category is in the context, use that
    if (context?.category) {
      return context.category as ErrorCategory;
    }

    // Check for network errors
    if (error instanceof TypeError &&
       (error.message.includes('network') ||
        error.message.includes('fetch') ||
        error.message.includes('timeout'))) {
      return ErrorCategory.NETWORK;
    }

    // Check for storage errors
    if (error.name === 'QuotaExceededError' ||
        error.message.includes('storage') ||
        error.message.includes('quota')) {
      return ErrorCategory.PERSISTENCE;
    }

    // Check for component-specific errors
    if (context?.component) {
      const component = context.component.toLowerCase();

      if (component.includes('quantum')) {
        return ErrorCategory.QUANTUM;
      }

      if (component.includes('hologram')) {
        return ErrorCategory.HOLOGRAM;
      }

      if (component.includes('memory')) {
        return ErrorCategory.MEMORY;
      }

      if (component.includes('render') || component.includes('ui')) {
        return ErrorCategory.RENDERING;
      }

      if (component.includes('sync')) {
        return ErrorCategory.SYNC;
      }

      if (component.includes('valid')) {
        return ErrorCategory.VALIDATION;
      }
    }

    // Default to unknown
    return ErrorCategory.UNKNOWN;
  }

  /**
   * Log an error to the internal error log
   */
  private static logError(
    error: Error,
    context: ErrorContext,
    severity: ErrorSeverity,
    category: ErrorCategory
  ): void {
    // Add to the beginning of the log (newest first)
    this.errorLog.unshift({
      error,
      context,
      severity,
      category,
      timestamp: context.timestamp || Date.now(),
      recovered: false
    });

    // Trim log if it exceeds maximum size
    if (this.errorLog.length > this.MAX_ERROR_LOG_SIZE) {
      this.errorLog = this.errorLog.slice(0, this.MAX_ERROR_LOG_SIZE);
    }

    // Persist the error log if enabled
    if (this.config.persistErrorLog) {
      this.saveErrorLog();
    }
  }

  /**
   * Save the error log to localStorage
   */
  private static saveErrorLog(): void {
    try {
      // Create a serializable version of the error log
      const serializableLog = this.errorLog.map(entry => ({
        message: entry.error.message,
        name: entry.error.name,
        stack: entry.error.stack,
        context: entry.context,
        severity: entry.severity,
        category: entry.category,
        timestamp: entry.timestamp,
        recovered: entry.recovered
      }));

      // Save to localStorage with date-based key
      const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const key = `${this.config.errorLogPrefix}${date}`;

      localStorage.setItem(key, JSON.stringify(serializableLog));
    } catch (e) {
      if (this.config.debugMode) {
        console.error('[CartErrorHandler] Failed to save error log:', e);
      }
    }
  }

  /**
   * Load the error log from localStorage
   */
  private static loadErrorLog(): void {
    try {
      // Get today's date
      const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const key = `${this.config.errorLogPrefix}${date}`;

      const storedLog = localStorage.getItem(key);
      if (!storedLog) return;

      const parsedLog = JSON.parse(storedLog);

      // Convert back to Error objects
      this.errorLog = parsedLog.map((entry: any) => ({
        error: Object.assign(new Error(entry.message), {
          name: entry.name,
          stack: entry.stack
        }),
        context: entry.context,
        severity: entry.severity,
        category: entry.category,
        timestamp: entry.timestamp,
        recovered: entry.recovered
      }));

      if (this.config.debugMode) {
        console.log(`[CartErrorHandler] Loaded ${this.errorLog.length} errors from persistent storage`);
      }
    } catch (e) {
      if (this.config.debugMode) {
        console.error('[CartErrorHandler] Failed to load error log:', e);
      }

      // Initialize with empty log on failure
      this.errorLog = [];
    }
  }

  /**
   * Attempt to recover from an error
   */
  private static async attemptRecovery(
    error: Error,
    context: ErrorContext = {},
    category: ErrorCategory
  ): Promise<boolean> {
    // Find applicable recovery strategies
    const applicableStrategies = this.recoveryStrategies.filter(
      strategy => strategy.canHandle(error, context)
    );

    if (applicableStrategies.length === 0) {
      if (this.config.debugMode) {
        console.log('[CartErrorHandler] No applicable recovery strategies found');
      }
      return false;
    }

    if (this.config.debugMode) {
      console.log(`[CartErrorHandler] Found ${applicableStrategies.length} recovery strategies:`,
        applicableStrategies.map(s => s.name));
    }

    // Try each strategy until one succeeds
    for (const strategy of applicableStrategies) {
      try {
        if (this.config.debugMode) {
          console.log(`[CartErrorHandler] Attempting recovery with strategy: ${strategy.name}`);
        }

        // Set a timeout for the recovery attempt
        const recoveryPromise = strategy.execute(error, context);

        const timeoutPromise = new Promise<boolean>((_, reject) => {
          setTimeout(() => reject(new Error('Recovery timeout')), this.config.recoveryTimeout);
        });

        // Race the recovery against the timeout
        const recovered = await Promise.race([recoveryPromise, timeoutPromise]);

        if (recovered) {
          if (this.config.debugMode) {
            console.log(`[CartErrorHandler] Recovery successful with strategy: ${strategy.name}`);
          }
          return true;
        }
      } catch (e) {
        if (this.config.debugMode) {
          console.error(`[CartErrorHandler] Recovery strategy ${strategy.name} failed:`, e);
        }
        // Continue with next strategy
      }
    }

    // If we get here, all strategies failed
    if (this.config.debugMode) {
      console.log('[CartErrorHandler] All recovery strategies failed');
    }

    return false;
  }

  /**
   * Get a list of recent errors
   */
  public static getRecentErrors(maxCount: number = 10): Array<{
    message: string;
    category: ErrorCategory;
    severity: ErrorSeverity;
    timestamp: number;
    recovered: boolean;
  }> {
    return this.errorLog.slice(0, maxCount).map(entry => ({
      message: entry.error.message,
      category: entry.category,
      severity: entry.severity,
      timestamp: entry.timestamp,
      recovered: entry.recovered
    }));
  }

  /**
   * Clear the error log
   */
  public static clearErrorLog(): void {
    this.errorLog = [];

    // Clear persisted error logs
    if (this.config.persistErrorLog) {
      try {
        // Get all localStorage keys
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(this.config.errorLogPrefix)) {
            keys.push(key);
          }
        }

        // Remove all error log entries
        keys.forEach(key => localStorage.removeItem(key));

        if (this.config.debugMode) {
          console.log(`[CartErrorHandler] Cleared ${keys.length} persisted error logs`);
        }
      } catch (e) {
        if (this.config.debugMode) {
          console.error('[CartErrorHandler] Failed to clear persisted error logs:', e);
        }
      }
    }
  }

  /**
   * Get error statistics
   */
  public static getErrorStats(): {
    total: number;
    bySeverity: Record<ErrorSeverity, number>;
    byCategory: Record<ErrorCategory, number>;
    recoveryRate: number;
  } {
    const stats = {
      total: this.errorLog.length,
      bySeverity: {} as Record<ErrorSeverity, number>,
      byCategory: {} as Record<ErrorCategory, number>,
      recoveryRate: 0
    };

    // Initialize counters
    Object.values(ErrorSeverity).forEach(severity => {
      stats.bySeverity[severity] = 0;
    });

    Object.values(ErrorCategory).forEach(category => {
      stats.byCategory[category] = 0;
    });

    // Count errors
    let recoveredCount = 0;

    this.errorLog.forEach(entry => {
      stats.bySeverity[entry.severity]++;
      stats.byCategory[entry.category]++;

      if (entry.recovered) {
        recoveredCount++;
      }
    });

    // Calculate recovery rate
    stats.recoveryRate = this.errorLog.length > 0
      ? recoveredCount / this.errorLog.length
      : 0;

    return stats;
  }
}

// Initialize with default configuration
CartErrorHandler.initialize();

// Export default instance
export default CartErrorHandler;
