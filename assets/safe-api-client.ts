/**
 * SAFE-API-CLIENT.TS
 * Secure API client for VoidBloom Theme
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * @Version: 1.0.0
 */

import CartErrorHandler from './cart-error-handler';
import { validateAuthenticityToken } from './security-utils';

// API Configuration
const API_CONFIG = {
  version: '2023-07', // Shopify API version
  maxRetries: 3,
  timeout: 10000, // 10 seconds
  baseUrl: '', // Will use relative URLs by default
};

// Request options interface
interface ApiClientOptions {
  headers?: Record<string, string>;
  timeout?: number;
  retry?: boolean;
  maxRetries?: number;
  validateCsrf?: boolean;
}

// Response interface
interface ApiResponse<T = any> {
  data: T;
  status: number;
  headers: Record<string, string>;
  error?: Error;
}

/**
 * Safe API Client with error handling, retries, and proper security
 */
class SafeApiClient {
  private defaultOptions: ApiClientOptions = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Shopify-API-Version': API_CONFIG.version,
    },
    timeout: API_CONFIG.timeout,
    retry: true,
    maxRetries: API_CONFIG.maxRetries,
    validateCsrf: true,
  };

  /**
   * Make a GET request
   */
  async get<T = any>(url: string, options: ApiClientOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, null, options);
  }

  /**
   * Make a POST request
   */
  async post<T = any>(
    url: string,
    data: any = null,
    options: ApiClientOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data, options);
  }

  /**
   * Make a PUT request
   */
  async put<T = any>(
    url: string,
    data: any = null,
    options: ApiClientOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data, options);
  }

  /**
   * Make a DELETE request
   */
  async delete<T = any>(url: string, options: ApiClientOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url, null, options);
  }

  /**
   * Make a request with error handling and retries
   */
  private async request<T = any>(
    method: string,
    url: string,
    data: any = null,
    options: ApiClientOptions = {}
  ): Promise<ApiResponse<T>> {
    const mergedOptions = { ...this.defaultOptions, ...options };
    const { headers, timeout, retry, maxRetries, validateCsrf } = mergedOptions;

    let retries = 0;

    while (true) {
      try {
        // Check CSRF token for mutations
        if (validateCsrf && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method.toUpperCase())) {
          const token =
            (data && data.authenticity_token) ||
            new URLSearchParams(data).get('authenticity_token');

          if (token && !validateAuthenticityToken(token)) {
            throw new Error('Invalid CSRF token');
          }
        }

        // Build the fetch options
        const fetchOptions: RequestInit = {
          method,
          headers,
          credentials: 'same-origin', // Include cookies for same-origin requests
        };

        // Add body for methods that support it
        if (data !== null && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
          fetchOptions.body = typeof data === 'string' ? data : JSON.stringify(data);
        }

        // Set up timeout
        const controller = new AbortController();
        fetchOptions.signal = controller.signal;

        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
          const response = await fetch(url, fetchOptions);
          clearTimeout(timeoutId);

          // Parse the response
          let responseData: any = null;
          const contentType = response.headers.get('content-type') || '';

          if (contentType.includes('application/json')) {
            responseData = await response.json();
          } else if (contentType.includes('text/')) {
            responseData = await response.text();
          } else {
            responseData = await response.blob();
          }

          // Convert headers to a plain object
          const responseHeaders: Record<string, string> = {};
          response.headers.forEach((value, key) => {
            responseHeaders[key] = value;
          });

          // Check if the response was successful
          if (!response.ok) {
            throw new Error(
              `Request failed with status ${response.status}: ${response.statusText}`
            );
          }

          // Return the response
          return {
            data: responseData,
            status: response.status,
            headers: responseHeaders,
          };
        } catch (error) {
          clearTimeout(timeoutId);
          throw error;
        }
      } catch (error) {
        retries++;

        // Log the error
        CartErrorHandler.handleError(error as Error, {
          component: 'safe-api-client',
          method: method,
          url: url,
          attempt: retries,
        });

        // Check if we should retry
        if (!retry || retries >= maxRetries) {
          return {
            data: null,
            status: 0,
            headers: {},
            error: error as Error,
          };
        }

        // Wait before retrying (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, retries - 1)));
      }
    }
  }

  /**
   * Update API version
   */
  setApiVersion(version: string): void {
    API_CONFIG.version = version;
    this.defaultOptions.headers['X-Shopify-API-Version'] = version;
  }

  /**
   * Get current API version
   */
  getApiVersion(): string {
    return API_CONFIG.version;
  }
}

// Export singleton instance
export const safeApiClient = new SafeApiClient();
export default safeApiClient;
