/**
 * CSRF-PROTECTION.TS
 * Enhanced Cross-Site Request Forgery protection utility
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * @Version: 1.0.0
 * @Date: April 26, 2025
 */

/**
 * Configuration options for CSRF protection
 */
interface CSRFOptions {
  cookieName?: string; // Name of the CSRF cookie
  headerName?: string; // Name of the CSRF header
  metaName?: string; // Name of the CSRF meta tag
  parameterName?: string; // Name of the CSRF parameter in forms
  tokenLength?: number; // Length of the generated token
  expiration?: number; // Token expiration time in milliseconds
  sameSite?: 'Strict' | 'Lax' | 'None'; // SameSite cookie attribute
  secure?: boolean; // Whether cookies should be secure
  detectDynamicForms?: boolean; // Whether to detect dynamically added forms
  refreshToken?: boolean; // Whether to refresh token after form submission
  debug?: boolean; // Whether to enable debug logging
}

/**
 * Token generation method options
 */
type TokenGenerationMethod = 'crypto' | 'random' | 'uuid';

/**
 * Enum for token source
 */
enum TokenSource {
  COOKIE = 'cookie',
  META = 'meta',
  STORAGE = 'storage',
  GENERATED = 'generated',
}

/**
 * Default configuration options
 */
const DEFAULT_OPTIONS: CSRFOptions = {
  cookieName: 'cybercore_csrf_token',
  headerName: 'X-CSRF-Token',
  metaName: 'csrf-token',
  parameterName: 'csrf_token',
  tokenLength: 48,
  expiration: 4 * 60 * 60 * 1000, // 4 hours
  sameSite: 'Strict',
  secure: true,
  detectDynamicForms: true,
  refreshToken: false,
  debug: false,
};

/**
 * Enhanced CSRF Protection class
 * Provides comprehensive CSRF protection for web applications
 */
export class CSRFProtection {
  // Singleton instance
  private static instance: CSRFProtection;

  // Options
  private options: CSRFOptions;

  // Token source
  private tokenSource: TokenSource = TokenSource.GENERATED;

  // MutationObserver for dynamic forms
  private formObserver: MutationObserver | null = null;

  /**
   * Private constructor to enforce singleton pattern
   * @param options Configuration options
   */
  private constructor(options: CSRFOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.log('CSRFProtection instance created');
  }

  /**
   * Get singleton instance
   * @param options Configuration options
   * @returns CSRFProtection instance
   */
  public static getInstance(options: CSRFOptions = {}): CSRFProtection {
    if (!CSRFProtection.instance) {
      CSRFProtection.instance = new CSRFProtection(options);
    } else if (Object.keys(options).length > 0) {
      // Update options if provided
      CSRFProtection.instance.updateOptions(options);
    }
    return CSRFProtection.instance;
  }

  /**
   * Update configuration options
   * @param options New configuration options
   */
  public updateOptions(options: Partial<CSRFOptions>): void {
    this.options = { ...this.options, ...options };
    this.log('Options updated', this.options);
  }

  /**
   * Initialize CSRF protection
   * This sets up token and protects all forms
   */
  public initialize(): void {
    // Generate or retrieve token
    const token = this.getToken();

    // Protect all forms
    this.protectAllForms();

    // Set up dynamic form detection if enabled
    if (this.options.detectDynamicForms) {
      this.observeDynamicForms();
    }

    // Set up fetch and XHR interceptors
    this.setupFetchInterceptor();
    this.setupXHRInterceptor();

    this.log('CSRF protection initialized with token:', this.maskToken(token));
  }

  /**
   * Generate a new CSRF token
   * @param method Token generation method to use
   * @returns Generated token
   */
  public generateToken(method: TokenGenerationMethod = 'crypto'): string {
    let token: string;

    switch (method) {
      case 'crypto':
        token = this.generateCryptoToken();
        break;
      case 'uuid':
        token = this.generateUuidToken();
        break;
      case 'random':
      default:
        token = this.generateRandomToken();
        break;
    }

    // Store token in cookie
    this.setCSRFCookie(token);

    // Store token in meta tag
    this.setCSRFMeta(token);

    this.tokenSource = TokenSource.GENERATED;
    this.log('Generated new CSRF token:', this.maskToken(token));

    return token;
  }

  /**
   * Get current CSRF token or generate a new one
   * @returns The current CSRF token
   */
  public getToken(): string {
    // Try to get token from meta tag (fastest)
    const metaToken = this.getTokenFromMeta();
    if (metaToken) {
      this.tokenSource = TokenSource.META;
      return metaToken;
    }

    // If not in meta, try cookie
    const cookieToken = this.getTokenFromCookie();
    if (cookieToken) {
      // If found in cookie but not in meta, set meta
      this.setCSRFMeta(cookieToken);
      this.tokenSource = TokenSource.COOKIE;
      return cookieToken;
    }

    // If no token exists, generate a new one
    const newToken = this.generateToken('crypto');
    this.log('No existing token found, generated new one');
    return newToken;
  }

  /**
   * Add CSRF token to a form
   * @param form Form to protect
   */
  public protectForm(form: HTMLFormElement): void {
    if (!form) return;

    const { parameterName } = this.options;
    const token = this.getToken();

    // Check if token input already exists
    let tokenInput = form.querySelector(`input[name="${parameterName}"]`) as HTMLInputElement;

    if (!tokenInput) {
      // Create token input if it doesn't exist
      tokenInput = document.createElement('input');
      tokenInput.type = 'hidden';
      tokenInput.name = parameterName;
      form.appendChild(tokenInput);
      this.log('Added CSRF input to form:', form.id || form.action);
    }

    // Update token value
    tokenInput.value = token;
  }

  /**
   * Protect all forms in the document
   */
  public protectAllForms(): void {
    const forms = document.querySelectorAll('form');
    this.log(`Found ${forms.length} forms to protect`);

    forms.forEach((form) => {
      this.protectForm(form as HTMLFormElement);
    });
  }

  /**
   * Observe DOM for dynamically added forms
   */
  private observeDynamicForms(): void {
    // Clean up existing observer if any
    if (this.formObserver) {
      this.formObserver.disconnect();
    }

    // Create new observer
    this.formObserver = new MutationObserver((mutations) => {
      let formAdded = false;

      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Handle direct form additions
              if ((node as Element).tagName === 'FORM') {
                this.protectForm(node as HTMLFormElement);
                formAdded = true;
              }

              // Check for forms within added nodes
              const forms = (node as Element).querySelectorAll('form');
              if (forms.length > 0) {
                forms.forEach((form) => this.protectForm(form as HTMLFormElement));
                formAdded = true;
              }
            }
          });
        }
      });

      if (formAdded) {
        this.log('Protected dynamically added forms');
      }
    });

    // Start observing document
    this.formObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    // Add event listener for form submission
    document.addEventListener(
      'submit',
      (event) => {
        const form = event.target as HTMLFormElement;
        this.protectForm(form);

        // Refresh token after form submission if configured
        if (this.options.refreshToken) {
          setTimeout(() => {
            const newToken = this.generateToken('crypto');
            this.log('Refreshed CSRF token after form submission');

            // Update all forms with new token
            document.querySelectorAll('form').forEach((formElement) => {
              const input = formElement.querySelector(
                `input[name="${this.options.parameterName}"]`
              ) as HTMLInputElement;
              if (input) {
                input.value = newToken;
              }
            });
          }, 0);
        }
      },
      true
    );

    this.log('Dynamic form observation enabled');
  }

  /**
   * Add CSRF token to request headers
   * @param headers Headers object or record
   * @returns Updated headers
   */
  public addTokenToHeaders(
    headers: Headers | Record<string, string>
  ): Headers | Record<string, string> {
    const token = this.getToken();
    const { headerName } = this.options;

    if (headers instanceof Headers) {
      if (!headers.has(headerName)) {
        headers.set(headerName, token);
      }
    } else {
      headers[headerName] = token;
    }

    return headers;
  }

  /**
   * Set up fetch interceptor to add CSRF token
   */
  private setupFetchInterceptor(): void {
    const originalFetch = window.fetch;
    const self = this;

    window.fetch = function (input: RequestInfo, init?: RequestInit) {
      // Skip for GET or HEAD requests
      if (init && init.method && ['GET', 'HEAD'].includes(init.method.toUpperCase())) {
        return originalFetch.call(window, input, init);
      }

      // For all other requests, add CSRF token
      const newInit = init ? { ...init } : {};
      newInit.headers = newInit.headers || {};
      newInit.headers = self.addTokenToHeaders(newInit.headers as Record<string, string>);

      self.log('Added CSRF token to fetch request');
      return originalFetch.call(window, input, newInit);
    };

    this.log('Fetch interceptor set up');
  }

  /**
   * Set up XMLHttpRequest interceptor to add CSRF token
   */
  private setupXHRInterceptor(): void {
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    const self = this;
    const { headerName } = this.options;

    // Override open method to track HTTP method
    XMLHttpRequest.prototype.open = function (method: string, url: string) {
      (this as any)._csrfMethod = method;
      return originalOpen.apply(this, arguments as any);
    };

    // Override send method to add CSRF token header
    XMLHttpRequest.prototype.send = function (body: Document | BodyInit | null) {
      const method = (this as any)._csrfMethod ? (this as any)._csrfMethod.toUpperCase() : 'GET';

      // Skip for GET or HEAD requests
      if (!['GET', 'HEAD'].includes(method)) {
        const token = self.getToken();
        this.setRequestHeader(headerName, token);
        self.log('Added CSRF token to XHR request');
      }

      return originalSend.apply(this, arguments as any);
    };

    this.log('XMLHttpRequest interceptor set up');
  }

  /**
   * Validate CSRF token
   * @param token Token to validate
   * @returns True if token is valid
   */
  public validateToken(token: string): boolean {
    // If no token provided, it's invalid
    if (!token) return false;

    // Get stored token
    const storedToken = this.getToken();

    // Check if tokens match
    const isValid = storedToken === token;

    if (!isValid) {
      this.log('CSRF token validation failed');
    }

    return isValid;
  }

  /**
   * Add CSRF token to a URL
   * @param url URL to add token to
   * @returns URL with token parameter
   */
  public addTokenToUrl(url: string): string {
    const { parameterName } = this.options;
    const token = this.getToken();
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${parameterName}=${encodeURIComponent(token)}`;
  }

  // === Private utility methods ===

  /**
   * Generate a token using the Crypto API
   * @returns Cryptographically strong random token
   */
  private generateCryptoToken(): string {
    const { tokenLength } = this.options;
    if (window.crypto && window.crypto.getRandomValues) {
      const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
      const values = new Uint32Array(tokenLength);
      window.crypto.getRandomValues(values);

      let result = '';
      for (let i = 0; i < tokenLength; i++) {
        result += charset[values[i] % charset.length];
      }
      return result;
    } else {
      // Fallback to other methods if Crypto API is not available
      this.log('Crypto API not available, falling back to UUID');
      return this.generateUuidToken();
    }
  }

  /**
   * Generate a token based on UUID v4
   * @returns UUID v4 token with hyphens removed
   */
  private generateUuidToken(): string {
    // Simple UUID v4 implementation
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
      .replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      })
      .replace(/-/g, '');
  }

  /**
   * Generate a token using Math.random
   * @returns Random token
   */
  private generateRandomToken(): string {
    const { tokenLength } = this.options;
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < tokenLength; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return result;
  }

  /**
   * Get token from meta tag
   * @returns Token from meta tag or empty string
   */
  private getTokenFromMeta(): string {
    const { metaName } = this.options;
    const meta = document.querySelector(`meta[name="${metaName}"]`);
    return meta && meta.getAttribute('content') ? meta.getAttribute('content') || '' : '';
  }

  /**
   * Get token from cookie
   * @returns Token from cookie or empty string
   */
  private getTokenFromCookie(): string {
    const { cookieName } = this.options;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${cookieName}=`);

    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || '';
    }

    return '';
  }

  /**
   * Set CSRF token in a cookie
   * @param token Token to set
   */
  private setCSRFCookie(token: string): void {
    const { cookieName, expiration, sameSite, secure } = this.options;

    // Calculate expiration date
    const expires = new Date();
    expires.setTime(expires.getTime() + expiration);

    // Set secure cookie with SameSite attribute
    document.cookie = `${cookieName}=${token}; expires=${expires.toUTCString()}; path=/; SameSite=${sameSite}${
      secure ? '; Secure' : ''
    }`;
  }

  /**
   * Set CSRF token in a meta tag
   * @param token Token to set
   */
  private setCSRFMeta(token: string): void {
    const { metaName } = this.options;

    // Check if meta tag exists
    let meta = document.querySelector(`meta[name="${metaName}"]`);

    if (!meta) {
      // Create meta tag if it doesn't exist
      meta = document.createElement('meta');
      meta.setAttribute('name', metaName);
      document.head.appendChild(meta);
    }

    // Set token as content attribute
    meta.setAttribute('content', token);
  }

  /**
   * Log debug message
   * @param message Message to log
   * @param args Additional arguments
   */
  private log(message: string, ...args: any[]): void {
    if (this.options.debug) {
      console.log(`[CSRFProtection] ${message}`, ...args);
    }
  }

  /**
   * Mask token for logging
   * @param token Token to mask
   * @returns Masked token
   */
  private maskToken(token: string): string {
    if (!token) return '';
    if (token.length <= 8) return '****';
    return token.substring(0, 4) + '****' + token.substring(token.length - 4);
  }
}

// Export singleton instance with default configuration
export const csrfProtection = CSRFProtection.getInstance();
export default csrfProtection;
