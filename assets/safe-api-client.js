/**
 * SafeApiClient
 * Enhanced API client with robust error handling, retry logic, and recovery mechanisms for the CyberCore Cart System
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * @Version: 1.0.0
 */

import CartErrorHandler, { ErrorCategory, ErrorContext } from './cart-error-handler.js';
import { NeuralBus } from './neural-bus.js';

/**
 * Configuration options for SafeApiClient
 */
export interface SafeApiClientConfig {
  /** Default number of retry attempts */
  maxRetries?: number;
  /** Base delay between retries in ms (exponential backoff applied) */
  retryDelay?: number;
  /** Global request timeout in ms */
  timeout?: number;
  /** Whether to use NeuralBus for event broadcasting */
  useNeuralBus?: boolean;
  /** Custom headers to include with all requests */
  headers?: Record<string, string>;
  /** Enable debug logging */
  debug?: boolean;
  /** Whether to cache GET requests */
  cacheGet?: boolean;
  /** Cache TTL in ms (default: 5 minutes) */
  cacheTtl?: number;
}

/**
 * Response metadata for tracking and diagnostics
 */
export interface ResponseMetadata {
  /** Request start timestamp */
  requestStartTime: number;
  /** Total time to complete the request (including retries) */
  totalTime: number;
  /** Number of retries performed */
  retryCount: number;
  /** Request URL */
  url: string;
  /** Request method */
  method: string;
  /** Cache hit indicator (for GET requests when caching enabled) */
  fromCache?: boolean;
  /** Quantum state stabilization factor (0-1) */
  quantumStability?: number;
}

// Cache entry type
interface CacheEntry {
  data: any;
  expires: number;
}

/**
 * Safe API Client with comprehensive error handling and retry logic
 */
export class SafeApiClient {
  private config: SafeApiClientConfig;
  private cache: Map<string, CacheEntry> = new Map();
  private neuralBusConnected: boolean = false;
  private quantumStabilityFactor: number = 1.0;

  /**
   * Create a new SafeApiClient instance
   */
  constructor(config: Partial<SafeApiClientConfig> = {}) {
    // Default configuration
    this.config = {
      maxRetries: 3,
      retryDelay: 500,
      timeout: 10000,
      useNeuralBus: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      debug: false,
      cacheGet: true,
      cacheTtl: 5 * 60 * 1000, // 5 minutes
      ...config
    };

    // Try to connect to NeuralBus if enabled
    if (this.config.useNeuralBus && typeof NeuralBus !== 'undefined') {
      try {
        NeuralBus.register('safe-api-client', {
          version: '1.0.0',
          capabilities: ['retry', 'error-handling', 'caching']
        });
        this.neuralBusConnected = true;

        // Subscribe to stability updates
        NeuralBus.subscribe('quantum:stability-update', (data) => {
          if (typeof data.factor === 'number') {
            this.quantumStabilityFactor = Math.max(0, Math.min(1, data.factor));
          }
        });
      } catch (e) {
        this.log('Failed to connect to NeuralBus:', e);
      }
    }
  }

  /**
   * Make a GET request with error handling and retries
   */
  public async get<T = any>(url: string, options: RequestInit = {}): Promise<{data: T, metadata: ResponseMetadata}> {
    // Check cache first if enabled
    if (this.config.cacheGet) {
      const cacheKey = this.getCacheKey(url, options);
      const cached = this.cache.get(cacheKey);

      if (cached && cached.expires > Date.now()) {
        const metadata: ResponseMetadata = {
          requestStartTime: Date.now(),
          totalTime: 0,
          retryCount: 0,
          url,
          method: 'GET',
          fromCache: true,
          quantumStability: this.quantumStabilityFactor
        };

        this.log('Cache hit for:', url);
        return { data: cached.data, metadata };
      }
    }

    // Merge options with defaults
    const fetchOptions: RequestInit = {
      method: 'GET',
      headers: { ...this.config.headers, ...options.headers },
      ...options,
    };

    return this.safeRequest<T>(url, fetchOptions);
  }

  /**
   * Make a POST request with error handling and retries
   */
  public async post<T = any>(url: string, data: any, options: RequestInit = {}): Promise<{data: T, metadata: ResponseMetadata}> {
    // Merge options with defaults
    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: { ...this.config.headers, ...options.headers },
      body: typeof data === 'string' ? data : JSON.stringify(data),
      ...options,
    };

    return this.safeRequest<T>(url, fetchOptions);
  }

  /**
   * Make a PUT request with error handling and retries
   */
  public async put<T = any>(url: string, data: any, options: RequestInit = {}): Promise<{data: T, metadata: ResponseMetadata}> {
    // Merge options with defaults
    const fetchOptions: RequestInit = {
      method: 'PUT',
      headers: { ...this.config.headers, ...options.headers },
      body: typeof data === 'string' ? data : JSON.stringify(data),
      ...options,
    };

    return this.safeRequest<T>(url, fetchOptions);
  }

  /**
   * Make a DELETE request with error handling and retries
   */
  public async delete<T = any>(url: string, options: RequestInit = {}): Promise<{data: T, metadata: ResponseMetadata}> {
    // Merge options with defaults
    const fetchOptions: RequestInit = {
      method: 'DELETE',
      headers: { ...this.config.headers, ...options.headers },
      ...options,
    };

    return this.safeRequest<T>(url, fetchOptions);
  }

  /**
   * Clear the cache
   */
  public clearCache(): void {
    this.cache.clear();
    this.log('Cache cleared');
  }

  /**
   * Generate a cache key for a request
   */
  private getCacheKey(url: string, options: RequestInit): string {
    // Create a key based on URL and relevant options
    const queryParams = options.body ? JSON.stringify(options.body) : '';
    return `${url}_${queryParams}`;
  }

  /**
   * Execute a request with safety mechanisms
   */
  private async safeRequest<T>(url: string, options: RequestInit): Promise<{data: T, metadata: ResponseMetadata}> {
    const startTime = Date.now();
    let retryCount = 0;
    let lastError: Error | null = null;

    // Add stability factor to request headers
    if (this.quantumStabilityFactor !== 1.0) {
      const headers = options.headers as Record<string, string> || {};
      headers['X-Quantum-Stability'] = this.quantumStabilityFactor.toFixed(2);
      options.headers = headers;
    }

    // Try the request with retries
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      if (attempt > 0) {
        retryCount++;
        // Exponential backoff with jitter
        const delay = this.config.retryDelay * Math.pow(2, attempt - 1) * (0.8 + Math.random() * 0.4);
        this.log(`Retry ${attempt}/${this.config.maxRetries} after ${delay.toFixed(0)}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      try {
        // Add timeout to the request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
        const fetchOptions = { ...options, signal: controller.signal };

        // Execute the request
        const response = await fetch(url, fetchOptions);
        clearTimeout(timeoutId);

        if (!response.ok) {
          // Handle error response (4xx, 5xx)
          const errorData = await this.tryParseJson(response);
          const errorMessage = errorData?.message || `Request failed with status ${response.status}`;
          const error = new Error(errorMessage);
          Object.assign(error, {
            status: response.status,
            statusText: response.statusText,
            data: errorData
          });
          throw error;
        }

        // Parse the response
        const data = await this.tryParseJson(response);

        // Cache the result if it's a GET request and caching is enabled
        if (options.method === 'GET' && this.config.cacheGet) {
          const cacheKey = this.getCacheKey(url, options);
          this.cache.set(cacheKey, {
            data,
            expires: Date.now() + this.config.cacheTtl
          });
        }

        // Publish success to NeuralBus
        if (this.neuralBusConnected) {
          NeuralBus.publish('api:request-success', {
            url,
            method: options.method,
            duration: Date.now() - startTime,
            retryCount,
            timestamp: Date.now()
          });
        }

        // Return the data with metadata
        const metadata: ResponseMetadata = {
          requestStartTime: startTime,
          totalTime: Date.now() - startTime,
          retryCount,
          url,
          method: options.method as string,
          quantumStability: this.quantumStabilityFactor
        };

        return { data, metadata };
      } catch (error) {
        lastError = error as Error;

        // Check if we've been aborted due to timeout
        if (error.name === 'AbortError') {
          error.message = `Request timeout after ${this.config.timeout}ms`;
        }

        // Check if it's a network error
        const isNetworkError = error instanceof TypeError &&
          (error.message.includes('network') || error.message.includes('failed to fetch'));

        // Determine if we should retry
        const shouldRetry = attempt < this.config.maxRetries &&
          (isNetworkError || this.isRetryableHttpStatus(error.status));

        if (!shouldRetry) {
          // We won't retry, so log the final error
          this.log('Request failed after', retryCount, 'retries:', error);
          break;
        }
      }
    }

    // All retries failed
    const errorContext: ErrorContext = {
      component: 'SafeApiClient',
      operation: options.method as string,
      url,
      retryCount,
      timestamp: Date.now(),
      requestData: options.body ? JSON.parse(options.body as string) : undefined
    };

    // Handle the error through the CartErrorHandler
    CartErrorHandler.handleError(
      lastError,
      errorContext,
      ErrorCategory.NETWORK
    );

    // Publish failure to NeuralBus
    if (this.neuralBusConnected) {
      NeuralBus.publish('api:request-failed', {
        url,
        method: options.method,
        duration: Date.now() - startTime,
        retryCount,
        error: {
          message: lastError.message,
          status: lastError.status,
          name: lastError.name
        },
        timestamp: Date.now()
      });
    }

    // Rethrow the error with additional metadata
    const enhancedError = new Error(`Request failed after ${retryCount} retries: ${lastError.message}`);
    Object.assign(enhancedError, {
      originalError: lastError,
      retryCount,
      duration: Date.now() - startTime,
      url,
      method: options.method
    });
    throw enhancedError;
  }

  /**
   * Check if an HTTP status code is retryable
   */
  private isRetryableHttpStatus(status?: number): boolean {
    if (!status) return false;

    // Retry server errors (5xx) and specific client errors
    return (
      (status >= 500 && status < 600) || // Server errors
      status === 408 || // Request Timeout
      status === 429 // Too Many Requests
    );
  }

  /**
   * Try to parse JSON response, fallback to text if not valid JSON
   */
  private async tryParseJson(response: Response): Promise<any> {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        return await response.json();
      } catch (e) {
        // If JSON parsing fails, fall back to text
        return { text: await response.text() };
      }
    }
    return { text: await response.text() };
  }

  /**
   * Conditional logging based on debug setting
   */
  private log(...args: any[]): void {
    if (this.config.debug) {
      console.log('[SafeApiClient]', ...args);
    }
  }
}

// Export a default instance with default config
export const safeApiClient = new SafeApiClient();
export default safeApiClient;
