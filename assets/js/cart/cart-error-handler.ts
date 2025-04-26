/**
 * CART-ERROR-HANDLER.TS
 * Error handling system for cart operations
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * @Version: 1.0.0
 */

/**
 * Error context information
 */
export interface ErrorContext {
  component: string;
  method?: string;
  operation?: string;
  additionalInfo?: Record<string, any>;
}

/**
 * Error handling options
 */
export interface ErrorHandlingOptions {
  retryCount?: number;
  fallbackValue?: any;
  criticalOperation?: boolean;
  silentError?: boolean;
}

/**
 * CartErrorHandler
 * Provides standardized error handling for cart operations
 */
export class CartErrorHandler {
  // Error storage
  private static errorLog: Array<{
    error: any;
    context: ErrorContext;
    timestamp: number;
  }> = [];

  // Error reporting endpoint
  private static errorReportingEndpoint: string | null = null;

  // Debug mode
  private static debugMode: boolean = false;

  // Max number of errors to store in memory
  private static readonly MAX_ERROR_LOG_SIZE = 100;

  // Known error types and their user-friendly messages
  private static readonly ERROR_MESSAGES = {
    // Network errors
    NETWORK_ERROR:
      'Connection issue detected. Please check your internet connection and try again.',
    TIMEOUT_ERROR: 'The request took too long to complete. Please try again.',

    // Cart errors
    ITEM_NOT_AVAILABLE: 'This item is currently not available.',
    INSUFFICIENT_STOCK: 'Insufficient stock available for the requested quantity.',
    INVALID_CART_TOKEN: 'Your cart session has expired. Please refresh the page.',

    // Validation errors
    INVALID_QUANTITY: 'Please enter a valid quantity.',
    MINIMUM_QUANTITY: 'The minimum order quantity for this item is {min}.',
    MAXIMUM_QUANTITY: 'The maximum order quantity for this item is {max}.',

    // API errors
    API_ERROR: 'There was an issue processing your request.',
    RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again in a few moments.',

    // General errors
    GENERAL_ERROR:
      'Something went wrong. Please try again or contact support if the issue persists.',
    CRITICAL_ERROR: 'We encountered a problem. Please refresh the page and try again.',
  };

  /**
   * Initialize the error handler
   */
  public static initialize(
    options: {
      errorReportingEndpoint?: string;
      debug?: boolean;
    } = {}
  ): void {
    // Set error reporting endpoint
    if (options.errorReportingEndpoint) {
      this.errorReportingEndpoint = options.errorReportingEndpoint;
    }

    // Set debug mode
    this.debugMode = !!options.debug;

    // Set up global error handlers
    if (typeof window !== 'undefined') {
      window.addEventListener('error', this.handleGlobalError.bind(this));
      window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
    }

    if (this.debugMode) {
      console.log('[CartErrorHandler] Initialized');
    }
  }

  /**
   * Handle a global error event
   */
  private static handleGlobalError(event: ErrorEvent): void {
    // Only handle cart-related errors
    if (
      event.message &&
      (event.message.includes('cart') ||
        event.message.includes('checkout') ||
        event.filename?.includes('cart'))
    ) {
      this.handleError(event.error || event.message, {
        component: 'global',
        operation: 'runtime',
        additionalInfo: {
          fileName: event.filename,
          lineNumber: event.lineno,
          columnNumber: event.colno,
        },
      });
    }
  }

  /**
   * Handle an unhandled promise rejection
   */
  private static handlePromiseRejection(event: PromiseRejectionEvent): void {
    // Check if this is a cart-related error by examining the reason
    const reason = event.reason;
    const reasonStr = String(reason);

    if (
      reasonStr.includes('cart') ||
      reasonStr.includes('checkout') ||
      (reason instanceof Error && reason.stack?.includes('cart'))
    ) {
      this.handleError(reason, {
        component: 'global',
        operation: 'async',
      });
    }
  }

  /**
   * Process error based on type and context
   */
  private static processError(
    error: any,
    context: ErrorContext
  ): {
    type: string;
    message: string;
    status?: number;
    retry?: boolean;
    critical?: boolean;
  } {
    let errorType = 'GENERAL_ERROR';
    let isRetryable = true;
    let isCritical = false;
    let status = null;

    // Handle different error types
    if (error instanceof Error) {
      // Network errors
      if (
        error.name === 'NetworkError' ||
        error.message.includes('network') ||
        error.message.includes('connection')
      ) {
        errorType = 'NETWORK_ERROR';
      }
      // Timeout errors
      else if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
        errorType = 'TIMEOUT_ERROR';
      }
      // Parse error message for known patterns
      else if (error.message.includes('not available')) {
        errorType = 'ITEM_NOT_AVAILABLE';
        isRetryable = false;
      } else if (
        error.message.includes('insufficient stock') ||
        error.message.includes('out of stock')
      ) {
        errorType = 'INSUFFICIENT_STOCK';
        isRetryable = false;
      } else if (error.message.includes('cart token')) {
        errorType = 'INVALID_CART_TOKEN';
        isCritical = true;
      } else if (error.message.includes('quantity')) {
        if (error.message.includes('minimum')) {
          errorType = 'MINIMUM_QUANTITY';
        } else if (error.message.includes('maximum')) {
          errorType = 'MAXIMUM_QUANTITY';
        } else {
          errorType = 'INVALID_QUANTITY';
        }
        isRetryable = false;
      }
    }
    // Handle Response or FetchError with status code
    else if (error && (error.status || error.statusCode)) {
      status = error.status || error.statusCode;

      // Handle based on HTTP status
      if (status === 429) {
        errorType = 'RATE_LIMIT_EXCEEDED';
        isRetryable = true;
      } else if (status === 404) {
        errorType = 'ITEM_NOT_AVAILABLE';
        isRetryable = false;
      } else if (status === 422) {
        // Validation error
        if (error.body && error.body.includes('quantity')) {
          errorType = 'INVALID_QUANTITY';
        } else {
          errorType = 'API_ERROR';
        }
        isRetryable = false;
      } else if (status >= 500) {
        errorType = 'API_ERROR';
        isRetryable = true;
      } else if (status === 403) {
        errorType = 'API_ERROR';
        isRetryable = false;
      }
    }

    // Format the error message
    let message = this.ERROR_MESSAGES[errorType] || this.ERROR_MESSAGES.GENERAL_ERROR;

    // Replace placeholders in the message if needed
    if (error.min) {
      message = message.replace('{min}', error.min);
    }
    if (error.max) {
      message = message.replace('{max}', error.max);
    }

    // For critical cart operations, use a more serious message
    if (context.operation === 'checkout' || context.method === 'checkout') {
      isCritical = true;
    }

    return {
      type: errorType,
      message,
      status,
      retry: isRetryable,
      critical: isCritical,
    };
  }

  /**
   * Handle and process an error
   */
  public static handleError(
    error: any,
    context: ErrorContext,
    options: ErrorHandlingOptions = {}
  ): void {
    // Process the error
    const processedError = this.processError(error, context);

    // Log error
    this.logError(error, context);

    // Report error (if enabled and not silent)
    if (this.errorReportingEndpoint && !options.silentError) {
      this.reportError(error, context, processedError);
    }

    // Log to console in debug mode
    if (this.debugMode) {
      console.error(
        `[CartErrorHandler] ${processedError.type} (${context.component}/${
          context.method || context.operation
        }):`,
        processedError.message,
        error
      );
    }

    // Show user message for critical errors
    if (processedError.critical || options.criticalOperation) {
      this.displayErrorMessage(processedError.message, true);
    }
    // Show regular error if not silent
    else if (!options.silentError) {
      this.displayErrorMessage(processedError.message, false);
    }
  }

  /**
   * Log an error to the internal error log
   */
  private static logError(error: any, context: ErrorContext): void {
    // Add to error log
    this.errorLog.push({
      error,
      context,
      timestamp: Date.now(),
    });

    // Trim log if it exceeds maximum size
    if (this.errorLog.length > this.MAX_ERROR_LOG_SIZE) {
      this.errorLog = this.errorLog.slice(-this.MAX_ERROR_LOG_SIZE);
    }
  }

  /**
   * Report an error to the server
   */
  private static reportError(
    error: any,
    context: ErrorContext,
    processedError: { type: string; status?: number }
  ): void {
    if (!this.errorReportingEndpoint) return;

    try {
      // Structure the error report
      const errorReport = {
        timestamp: new Date().toISOString(),
        errorType: processedError.type,
        message: error.message || String(error),
        stack: error.stack,
        status: processedError.status,
        context: {
          ...context,
          url: window.location.href,
          userAgent: navigator.userAgent,
        },
      };

      // Send the error report
      fetch(this.errorReportingEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorReport),
        // Use keepalive to ensure the request completes even if the page navigates away
        keepalive: true,
      }).catch(() => {
        // Silently fail if error reporting fails
        if (this.debugMode) {
          console.warn('[CartErrorHandler] Failed to report error to endpoint');
        }
      });
    } catch (reportingError) {
      // Silently fail if error reporting fails
      if (this.debugMode) {
        console.warn('[CartErrorHandler] Error during error reporting:', reportingError);
      }
    }
  }

  /**
   * Display an error message to the user
   */
  private static displayErrorMessage(message: string, isCritical: boolean): void {
    try {
      // Try to find a cart error element
      const cartErrorElement = document.querySelector('.cart-error');

      if (cartErrorElement) {
        // Set error message
        cartErrorElement.textContent = message;
        cartErrorElement.classList.add('visible');

        // Add critical class if needed
        if (isCritical) {
          cartErrorElement.classList.add('critical');
        } else {
          cartErrorElement.classList.remove('critical');
        }

        // Hide after delay unless critical
        if (!isCritical) {
          setTimeout(() => {
            cartErrorElement.classList.remove('visible');
          }, 5000);
        }
      } else {
        // Create an error toast if error element not found
        this.createErrorToast(message, isCritical);
      }

      // Dispatch error event for other listeners
      document.dispatchEvent(
        new CustomEvent('cart:error', {
          detail: {
            message,
            critical: isCritical,
          },
        })
      );
    } catch (displayError) {
      // Fallback to console if display fails
      console.error(`Cart Error: ${message}`);
    }
  }

  /**
   * Create a toast notification for error message
   */
  private static createErrorToast(message: string, isCritical: boolean): void {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('cart-error-toast-container');

    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'cart-error-toast-container';
      toastContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        max-width: 300px;
      `;
      document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'cart-error-toast';
    toast.classList.toggle('critical', isCritical);
    toast.textContent = message;

    // Style the toast
    toast.style.cssText = `
      background-color: ${isCritical ? '#f44336' : '#333'};
      color: white;
      padding: 12px 16px;
      border-radius: 4px;
      margin-bottom: 10px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      font-size: 14px;
      opacity: 0;
      transform: translateY(-10px);
      transition: opacity 0.3s, transform 0.3s;
    `;

    // Add to container
    toastContainer.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 10);

    // Remove after delay unless critical
    if (!isCritical) {
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';

        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 300);
      }, 5000);
    } else {
      // Add close button for critical errors
      const closeBtn = document.createElement('button');
      closeBtn.textContent = '×';
      closeBtn.style.cssText = `
        position: absolute;
        top: 5px;
        right: 5px;
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
      `;
      toast.style.position = 'relative';
      toast.appendChild(closeBtn);

      closeBtn.addEventListener('click', () => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';

        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 300);
      });
    }
  }

  /**
   * Clear the error log
   */
  public static clearErrorLog(): void {
    this.errorLog = [];

    if (this.debugMode) {
      console.log('[CartErrorHandler] Error log cleared');
    }
  }

  /**
   * Get the error log
   */
  public static getErrorLog(): Array<{
    error: any;
    context: ErrorContext;
    timestamp: number;
  }> {
    return [...this.errorLog];
  }

  /**
   * Set debug mode
   */
  public static setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
  }

  /**
   * Safely execute a function with retry logic and error handling
   */
  public static async safeExecute<T>(
    operation: () => Promise<T>,
    context: ErrorContext,
    options: ErrorHandlingOptions = {}
  ): Promise<T | null> {
    const retryCount = options.retryCount ?? 3;
    let attempts = 0;

    while (attempts <= retryCount) {
      try {
        const result = await operation();
        return result;
      } catch (error) {
        attempts++;

        // Process the error to determine if it's retryable
        const processedError = this.processError(error, context);

        // Always log the error
        this.logError(error, context);

        // If this is the last attempt or error is not retryable, handle the error
        if (attempts > retryCount || !processedError.retry) {
          this.handleError(error, context, options);
          return options.fallbackValue !== undefined ? options.fallbackValue : null;
        }

        // Log retry attempt in debug mode
        if (this.debugMode) {
          console.warn(`[CartErrorHandler] Retrying operation (${attempts}/${retryCount})...`);
        }

        // Wait before retrying (exponential backoff)
        await new Promise((resolve) =>
          setTimeout(resolve, Math.min(1000 * Math.pow(2, attempts - 1), 5000))
        );
      }
    }

    // This should not be reached, but return fallback value just in case
    return options.fallbackValue !== undefined ? options.fallbackValue : null;
  }
}

// Initialize error handler
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    CartErrorHandler.initialize({
      debug: window.location.search.includes('debug=true'),
      errorReportingEndpoint: '/api/report-cart-error',
    });
  });
}

// Export for module usage
export default CartErrorHandler;
