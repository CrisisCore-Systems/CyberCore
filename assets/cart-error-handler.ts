/**
 * CART-ERROR-HANDLER.TS
 * Error handling for cart operations in VoidBloom theme
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * @Version: 1.0.0
 */

import { NeuralBus } from './neural-bus';
import { sanitizeHtml } from './security-utils';

/**
 * Error categories to help with organizing and filtering errors
 */
export enum ErrorCategory {
  API = 'api',
  VALIDATION = 'validation',
  NETWORK = 'network',
  INTERNAL = 'internal',
  SECURITY = 'security',
  UNKNOWN = 'unknown',
}

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

/**
 * Additional context for the error
 */
export interface ErrorContext {
  component?: string;
  method?: string;
  category?: ErrorCategory;
  severity?: ErrorSeverity;
  additionalData?: Record<string, unknown>;
  userId?: string;
  timestamp?: number;
  context?: string;
}

/**
 * Standardized error response format
 */
export interface ErrorResponseData {
  message: string;
  code?: string | number;
  details?: Record<string, unknown>;
  status?: number;
}

/**
 * Main cart error handler
 */
class CartErrorHandlerClass {
  private debugMode: boolean = false;
  private errorCount: number = 0;
  private maxErrorsDisplayed: number = 3;
  private errorContainer: HTMLElement | null = null;
  private neuralBusConnected: boolean = false;
  private errorLog: Array<{ error: Error | string; context: ErrorContext }> = [];
  private maxErrorLogSize: number = 50;

  /**
   * Initialize the error handler
   */
  constructor() {
    this.checkDebugMode();
    this.connectToNeuralBus();

    // Set error listener for uncaught errors
    if (typeof window !== 'undefined') {
      window.addEventListener('error', this.globalErrorHandler.bind(this));
    }
  }

  /**
   * Check if debug mode is enabled
   */
  private checkDebugMode(): void {
    this.debugMode =
      localStorage.getItem('voidbloom_debug') === 'true' ||
      window.location.search.includes('debug=true');
  }

  /**
   * Connect to neural bus for error reporting
   */
  private connectToNeuralBus(): void {
    if (typeof NeuralBus !== 'undefined') {
      try {
        NeuralBus.register('cart-error-handler', { version: '1.0.0' });
        this.neuralBusConnected = true;
      } catch (e) {
        console.warn('Failed to connect CartErrorHandler to NeuralBus');
        this.neuralBusConnected = false;
      }
    }
  }

  /**
   * Global error handler for uncaught errors
   */
  private globalErrorHandler(event: ErrorEvent): void {
    // Only handle cart-related errors
    if (event.message && (event.message.includes('cart') || event.message.includes('checkout'))) {
      this.handleError(event.error || event.message, {
        category: ErrorCategory.UNKNOWN,
        severity: ErrorSeverity.ERROR,
        context: 'Uncaught error',
      });
    }
  }

  /**
   * Get or create the error container for displaying errors
   */
  private getErrorContainer(): HTMLElement {
    if (!this.errorContainer) {
      // Look for existing container
      this.errorContainer = document.querySelector('.cart-error-container');

      // Create if it doesn't exist
      if (!this.errorContainer) {
        this.errorContainer = document.createElement('div');
        this.errorContainer.className = 'cart-error-container';
        document.body.appendChild(this.errorContainer);
      }
    }

    return this.errorContainer;
  }

  /**
   * Format the error message
   */
  private formatErrorMessage(error: Error | string): string {
    if (typeof error === 'string') {
      return error;
    }

    return error.message || 'An unknown error occurred';
  }

  /**
   * Add error to log
   */
  private logError(error: Error | string, context: ErrorContext): void {
    // Create error object
    const errorObj = {
      error,
      context: {
        ...context,
        timestamp: context.timestamp || Date.now(),
      },
    };

    // Add to log
    this.errorLog.unshift(errorObj);

    // Trim log if too large
    if (this.errorLog.length > this.maxErrorLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxErrorLogSize);
    }

    // Send to NeuralBus if connected
    if (this.neuralBusConnected) {
      NeuralBus.publish('cart:error-logged', {
        message: this.formatErrorMessage(error),
        category: context.category || ErrorCategory.UNKNOWN,
        severity: context.severity || ErrorSeverity.ERROR,
        component: context.component || 'unknown',
        method: context.method || 'unknown',
        timestamp: context.timestamp || Date.now(),
      });
    }
  }

  /**
   * Parse API error response
   */
  private parseApiError(error: any): ErrorResponseData {
    // Try to extract error data
    try {
      // If the error is already parsed
      if (error.message && (error.code || error.status)) {
        return {
          message: error.message,
          code: error.code || error.status,
          details: error.details || {},
          status: error.status || 500,
        };
      }

      // If the error has a response property (fetch/axios)
      if (error.response) {
        const response = error.response;
        return {
          message: response.data?.message || response.statusText || 'API Error',
          code: response.data?.code || response.status,
          details: response.data?.details || {},
          status: response.status,
        };
      }

      // If the error is a string, try to parse as JSON
      if (typeof error === 'string') {
        try {
          const parsedError = JSON.parse(error);
          return {
            message: parsedError.message || 'API Error',
            code: parsedError.code || parsedError.status,
            details: parsedError.details || {},
            status: parsedError.status || 500,
          };
        } catch (e) {
          // Not JSON, return as is
          return {
            message: error,
            status: 500,
          };
        }
      }

      // Default case
      return {
        message: error.message || 'Unknown API Error',
        code: error.code || 500,
        details: error.details || {},
        status: error.status || 500,
      };
    } catch (e) {
      // Fallback if parsing fails
      return {
        message: error.message || 'Error parsing API response',
        status: 500,
      };
    }
  }

  /**
   * Display error in UI
   */
  private displayError(message: string, severity: ErrorSeverity = ErrorSeverity.ERROR): void {
    // Don't display too many errors
    if (this.errorCount >= this.maxErrorsDisplayed) {
      return;
    }

    this.errorCount++;

    // Get container
    const container = this.getErrorContainer();

    // Create error element
    const errorElement = document.createElement('div');
    errorElement.className = `cart-error cart-error--${severity}`;
    errorElement.setAttribute('role', 'alert');

    // Sanitize message to prevent XSS
    const safeMessage = sanitizeHtml(message);

    // Add message
    errorElement.innerHTML = `
      <div class="cart-error__content">
        <div class="cart-error__message">${safeMessage}</div>
        <button class="cart-error__close" aria-label="Dismiss error">&times;</button>
      </div>
    `;

    // Add close button functionality
    const closeButton = errorElement.querySelector('.cart-error__close');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        errorElement.remove();
        this.errorCount--;
      });
    }

    // Auto-dismiss after delay for non-critical errors
    if (severity !== ErrorSeverity.CRITICAL) {
      setTimeout(() => {
        if (errorElement.parentNode) {
          errorElement.remove();
          this.errorCount--;
        }
      }, 5000);
    }

    // Add to container
    container.appendChild(errorElement);
  }

  /**
   * Handle API errors
   */
  private handleApiError(error: any, context: ErrorContext): void {
    const parsedError = this.parseApiError(error);

    // Log detailed error
    if (this.debugMode) {
      console.error('[CartErrorHandler] API Error:', parsedError, context);
    }

    // Determine appropriate user message
    let userMessage = '';

    switch (parsedError.status) {
      case 400:
        userMessage = 'The request was invalid. Please check your cart and try again.';
        break;
      case 401:
        userMessage = 'You need to be logged in to perform this action.';
        break;
      case 403:
        userMessage = "You don't have permission to perform this action.";
        break;
      case 404:
        userMessage = 'The requested item or resource was not found.';
        break;
      case 409:
        userMessage = 'There was a conflict with your cart. It may have been modified elsewhere.';
        break;
      case 422:
        userMessage = "We couldn't process your request. Please check your cart.";
        break;
      case 429:
        userMessage = 'Too many requests. Please wait a moment and try again.';
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        userMessage = 'A server error occurred. Our team has been notified.';
        break;
      default:
        userMessage = 'An error occurred with your cart. Please try again.';
    }

    // Add specific error message if available and in debug mode
    if (this.debugMode && parsedError.message) {
      userMessage += ` (${parsedError.message})`;
    }

    // Display to user
    this.displayError(userMessage, context.severity || ErrorSeverity.ERROR);
  }

  /**
   * Handle network errors
   */
  private handleNetworkError(error: any, context: ErrorContext): void {
    // Log error
    if (this.debugMode) {
      console.error('[CartErrorHandler] Network Error:', error, context);
    }

    // Check if offline
    const isOffline = !navigator.onLine;

    // Determine message
    let message = isOffline
      ? 'You appear to be offline. Your cart has been saved locally and will update when you reconnect.'
      : 'A network error occurred. Please check your connection and try again.';

    // Display to user
    this.displayError(message, isOffline ? ErrorSeverity.INFO : ErrorSeverity.WARNING);
  }

  /**
   * Handle validation errors
   */
  private handleValidationError(error: any, context: ErrorContext): void {
    // Log error
    if (this.debugMode) {
      console.error('[CartErrorHandler] Validation Error:', error, context);
    }

    // Extract validation message
    let message = 'Please check your cart details and try again.';

    if (typeof error === 'string') {
      message = error;
    } else if (error instanceof Error) {
      message = error.message;
    } else if (error.message) {
      message = error.message;
    }

    // Display to user
    this.displayError(message, ErrorSeverity.WARNING);
  }

  /**
   * Handle security errors
   */
  private handleSecurityError(error: any, context: ErrorContext): void {
    // Always log security errors
    console.error('[CartErrorHandler] Security Error:', error, context);

    // Generic message to avoid revealing security details
    const message = 'A security error occurred. Please refresh the page and try again.';

    // Display to user
    this.displayError(message, ErrorSeverity.ERROR);
  }

  /**
   * Main public error handler method
   */
  public handleError(error: Error | string, context: ErrorContext = {}): void {
    // Set default context values
    const fullContext: ErrorContext = {
      category: ErrorCategory.UNKNOWN,
      severity: ErrorSeverity.ERROR,
      timestamp: Date.now(),
      ...context,
    };

    // Log the error
    this.logError(error, fullContext);

    // Handle error based on category
    switch (fullContext.category) {
      case ErrorCategory.API:
        this.handleApiError(error, fullContext);
        break;
      case ErrorCategory.NETWORK:
        this.handleNetworkError(error, fullContext);
        break;
      case ErrorCategory.VALIDATION:
        this.handleValidationError(error, fullContext);
        break;
      case ErrorCategory.SECURITY:
        this.handleSecurityError(error, fullContext);
        break;
      case ErrorCategory.INTERNAL:
      case ErrorCategory.UNKNOWN:
      default:
        // Log internal errors
        if (this.debugMode) {
          console.error('[CartErrorHandler] Error:', error, fullContext);
        }

        // Format message
        const message =
          typeof error === 'string' ? error : error.message || 'An unknown error occurred';

        // Display to user
        this.displayError(message, fullContext.severity || ErrorSeverity.ERROR);
    }
  }

  /**
   * Get error log
   */
  public getErrorLog(): Array<{ error: Error | string; context: ErrorContext }> {
    return [...this.errorLog];
  }

  /**
   * Clear error log
   */
  public clearErrorLog(): void {
    this.errorLog = [];
  }

  /**
   * Set debug mode
   */
  public setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;

    if (enabled) {
      localStorage.setItem('voidbloom_debug', 'true');
    } else {
      localStorage.removeItem('voidbloom_debug');
    }
  }

  /**
   * Check if in debug mode
   */
  public isDebugMode(): boolean {
    return this.debugMode;
  }
}

// Create and export singleton instance
const CartErrorHandler = new CartErrorHandlerClass();
export default CartErrorHandler;
