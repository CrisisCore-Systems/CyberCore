/**
 * CSRF-UTILS.TS
 * Cross-Site Request Forgery protection utilities
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * @Version: 1.0.0
 */

/**
 * CSRF Protection Utilities
 * Provides functions for preventing Cross-Site Request Forgery attacks
 */
export class CSRFUtils {
  // Singleton instance
  private static instance: CSRFUtils;

  // Cookie name for CSRF token
  private readonly CSRF_COOKIE_NAME = 'cybercore_csrf_token';

  // Header name for CSRF token
  private readonly CSRF_HEADER_NAME = 'X-CSRF-Token';

  // Meta tag name for CSRF token
  private readonly CSRF_META_NAME = 'csrf-token';

  // Token expiration time (2 hours)
  private readonly TOKEN_EXPIRATION = 2 * 60 * 60 * 1000;

  // Debug mode
  private debugMode = false;

  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {}

  /**
   * Get the singleton instance
   */
  public static getInstance(): CSRFUtils {
    if (!CSRFUtils.instance) {
      CSRFUtils.instance = new CSRFUtils();
    }
    return CSRFUtils.instance;
  }

  /**
   * Set debug mode
   */
  public setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
  }

  /**
   * Generate a new CSRF token
   */
  public generateToken(): string {
    // Generate a random token
    const token = this.generateRandomString(32);

    // Store the token in a cookie
    this.setCSRFCookie(token);

    // Store the token in a meta tag for easy access in JavaScript
    this.setCSRFMeta(token);

    if (this.debugMode) {
      console.log('[CSRFUtils] Generated new CSRF token');
    }

    return token;
  }

  /**
   * Set CSRF token in a cookie
   */
  private setCSRFCookie(token: string): void {
    // Calculate expiration date
    const expires = new Date();
    expires.setTime(expires.getTime() + this.TOKEN_EXPIRATION);

    // Set secure cookie with SameSite=Strict attribute
    document.cookie = `${
      this.CSRF_COOKIE_NAME
    }=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Strict; Secure`;
  }

  /**
   * Set CSRF token in a meta tag
   */
  private setCSRFMeta(token: string): void {
    // Check if meta tag already exists
    let meta = document.querySelector(`meta[name="${this.CSRF_META_NAME}"]`);

    if (!meta) {
      // Create meta tag if it doesn't exist
      meta = document.createElement('meta');
      meta.setAttribute('name', this.CSRF_META_NAME);
      document.head.appendChild(meta);
    }

    // Set token as content attribute
    meta.setAttribute('content', token);
  }

  /**
   * Get CSRF token from cookie or meta tag
   */
  public getToken(): string {
    // Try to get token from meta tag first (fastest)
    const meta = document.querySelector(`meta[name="${this.CSRF_META_NAME}"]`);
    if (meta && meta.getAttribute('content')) {
      return meta.getAttribute('content') || '';
    }

    // If not in meta tag, try to get from cookie
    const token = this.getCookie(this.CSRF_COOKIE_NAME);

    // If token exists in cookie but not in meta tag, set it in meta tag
    if (token && !meta) {
      this.setCSRFMeta(token);
    }

    // If no token exists, generate a new one
    if (!token) {
      return this.generateToken();
    }

    return token;
  }

  /**
   * Get a cookie value by name
   */
  private getCookie(name: string): string {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || '';
    }

    return '';
  }

  /**
   * Add CSRF token to a form
   */
  public protectForm(form: HTMLFormElement): void {
    if (!form) return;

    // Get CSRF token
    const token = this.getToken();

    // Check if form already has CSRF input
    let input = form.querySelector(`input[name="${this.CSRF_HEADER_NAME}"]`);

    if (!input) {
      // Create input if it doesn't exist
      input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', this.CSRF_HEADER_NAME);
      form.appendChild(input);
    }

    // Set token as input value
    input.setAttribute('value', token);

    if (this.debugMode) {
      console.log('[CSRFUtils] Added CSRF token to form:', form);
    }
  }

  /**
   * Add CSRF token to fetch or XMLHttpRequest headers
   */
  public appendToHeaders(
    headers: Headers | Record<string, string>
  ): Headers | Record<string, string> {
    // Get CSRF token
    const token = this.getToken();

    // Append token to headers
    if (headers instanceof Headers) {
      headers.append(this.CSRF_HEADER_NAME, token);
    } else {
      headers[this.CSRF_HEADER_NAME] = token;
    }

    return headers;
  }

  /**
   * Create fetch options with CSRF token
   */
  public createFetchOptions(options: RequestInit = {}): RequestInit {
    // Clone the options to avoid modifying the original
    const newOptions = { ...options };

    // Initialize headers if they don't exist
    newOptions.headers = newOptions.headers || {};

    // Add CSRF token to headers
    newOptions.headers = this.appendToHeaders(newOptions.headers as Record<string, string>);

    return newOptions;
  }

  /**
   * Validate CSRF token
   */
  public validateToken(token: string): boolean {
    // Get the stored token
    const storedToken = this.getToken();

    // Validate that the tokens match
    return token === storedToken;
  }

  /**
   * Protect all forms in the document
   */
  public protectAllForms(): void {
    // Get all forms in the document
    const forms = document.querySelectorAll('form');

    // Add CSRF token to each form
    forms.forEach((form) => {
      this.protectForm(form as HTMLFormElement);
    });

    if (this.debugMode) {
      console.log(`[CSRFUtils] Protected ${forms.length} forms with CSRF tokens`);
    }
  }

  /**
   * Set up a global fetch interceptor to automatically add CSRF tokens
   */
  public setupFetchInterceptor(): void {
    // Store the original fetch function
    const originalFetch = window.fetch;

    // Redefine fetch to include CSRF token
    window.fetch = (input: RequestInfo, init?: RequestInit) => {
      // Clone init to avoid modifying the original
      const newInit = init ? { ...init } : {};

      // Add CSRF token to headers
      newInit.headers = newInit.headers || {};
      newInit.headers = this.appendToHeaders(newInit.headers as Record<string, string>);

      // Call the original fetch with the modified init
      return originalFetch(input, newInit);
    };

    if (this.debugMode) {
      console.log('[CSRFUtils] Set up global fetch interceptor for CSRF protection');
    }
  }

  /**
   * Set up a global XMLHttpRequest interceptor to automatically add CSRF tokens
   */
  public setupXHRInterceptor(): void {
    // Store the original open method
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    const csrfHeaderName = this.CSRF_HEADER_NAME;
    const getToken = this.getToken.bind(this);
    const debugMode = this.debugMode;

    // Redefine open to track the method
    XMLHttpRequest.prototype.open = function (method: string, url: string) {
      // Store the method for later use
      (this as any)._csrfMethod = method;
      return originalOpen.apply(this, arguments as any);
    };

    // Redefine send to add CSRF token for unsafe methods
    XMLHttpRequest.prototype.send = function (body: Document | BodyInit | null) {
      // Add CSRF header for unsafe methods
      const method = (this as any)._csrfMethod ? (this as any)._csrfMethod.toUpperCase() : 'GET';

      if (method !== 'GET' && method !== 'HEAD') {
        this.setRequestHeader(csrfHeaderName, getToken());

        if (debugMode) {
          console.log(`[CSRFUtils] Added CSRF token to ${method} XHR request`);
        }
      }

      return originalSend.apply(this, arguments as any);
    };

    if (this.debugMode) {
      console.log('[CSRFUtils] Set up global XMLHttpRequest interceptor for CSRF protection');
    }
  }

  /**
   * Generate a random string of specified length
   */
  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    // Use crypto API if available for better randomness
    if (window.crypto && window.crypto.getRandomValues) {
      const values = new Uint32Array(length);
      window.crypto.getRandomValues(values);

      for (let i = 0; i < length; i++) {
        result += chars[values[i] % chars.length];
      }
    } else {
      // Fallback to Math.random() if crypto API is not available
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    }

    return result;
  }

  /**
   * Initialize CSRF protection for the entire page
   */
  public initialize(): void {
    // Generate a token if one doesn't exist
    this.getToken();

    // Protect all forms
    this.protectAllForms();

    // Set up interceptors
    this.setupFetchInterceptor();
    this.setupXHRInterceptor();

    // Set up form submission listener to protect dynamically added forms
    document.addEventListener(
      'submit',
      (event) => {
        const form = event.target as HTMLFormElement;

        // Protect the form
        this.protectForm(form);
      },
      true
    ); // Use capture phase to intercept before other handlers

    if (this.debugMode) {
      console.log('[CSRFUtils] CSRF protection initialized');
    }
  }
}

// Export singleton instance
export const csrfUtils = CSRFUtils.getInstance();
export default csrfUtils;
