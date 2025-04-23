import { NeuralBus } from './neural-bus.js';

/**
 * Centralized error handling
 */
export class ErrorHandler {
  #errorTypes = new Map();
  #defaultHandler = null;

  /**
   * Register error handler for specific error type
   * @param {string} errorType - Type of error
   * @param {Function} handler - Handler function
   * @returns {ErrorHandler} This instance for chaining
   */
  register(errorType, handler) {
    if (typeof handler !== 'function') {
      console.error('Error handler must be a function');
      return this;
    }

    this.#errorTypes.set(errorType, handler);
    return this;
  }

  /**
   * Set default error handler
   * @param {Function} handler - Default handler function
   * @returns {ErrorHandler} This instance for chaining
   */
  setDefaultHandler(handler) {
    if (typeof handler !== 'function') {
      console.error('Default error handler must be a function');
      return this;
    }

    this.#defaultHandler = handler;
    return this;
  }

  /**
   * Handle an error
   * @param {Error|Object} error - Error object
   * @param {string} context - Context where error occurred
   * @returns {boolean} Whether error was handled
   */
  handle(error, context = 'unknown') {
    // Extract error type
    const errorType = error.name || error.type || 'general';

    // Get handler for this type
    const handler = this.#errorTypes.get(errorType) || this.#defaultHandler;

    if (handler) {
      try {
        handler(error, context);

        // Publish error to NeuralBus for logging/monitoring
        NeuralBus.publish('system:error', {
          type: errorType,
          message: error.message || 'Unknown error',
          context,
          timestamp: Date.now(),
          stack: error.stack,
        });

        return true;
      } catch (handlerError) {
        console.error('Error in error handler:', handlerError);
      }
    }

    // Log unhandled error
    console.error(`[${context}] Unhandled error:`, error);
    return false;
  }
}

// Singleton instance
export const errorHandler = new ErrorHandler();

// Default setup
errorHandler.setDefaultHandler((error, context) => {
  console.error(`[${context}] Error:`, error.message || error);
});

// Global error handling
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    errorHandler.handle(event.error || event, 'window.onerror');
  });

  window.addEventListener('unhandledrejection', (event) => {
    errorHandler.handle(event.reason, 'unhandledrejection');
  });
}
