/**
 * QUANTUM-SECURITY.JS
 * Security utilities for protecting against XSS, CSRF, and other vulnerabilities
 *
 * @Version: 1.2.0 (Enhanced Hidden Fields Audit + CSRF Protection)
 * @Date: April 26, 2025
 */

// Import our enhanced CSRF protection
// This will be transpiled correctly when processed by the build system
// @ts-ignore
import { csrfProtection } from './js/utils/csrf-protection';
// @ts-ignore
import { hiddenFieldsAuditor } from './js/utils/hidden-fields-auditor';
// @ts-ignore
import { hiddenFieldsAuditorUI } from './js/utils/hidden-fields-auditor-ui';

// Add typings for Window properties
/**
 * @typedef {Object} WindowExtended
 * @property {boolean} [QUANTUM_DEBUG] - Debug flag for quantum security features
 * @property {Object} [NeuralBus] - Global event bus
 * @property {Function} [NeuralBus.publish] - Function to publish events on the bus
 */

/**
 * QuantumSecurity
 * Security utilities for protecting against XSS, CSRF, and other vulnerabilities
 */
export class QuantumSecurity {
  // Private static properties
  static #initialized = false;
  static #cspNonce = null;
  static #version = '1.2.0';
  static #debugMode = false;
  static #auditIntervalId = null;
  static #auditIntervalMinutes = 15;
  static #highRiskFields = [];

  /**
   * Initialize the security module
   * @param {Object} options - Configuration options
   * @param {boolean} [options.debug=false] - Enable debug mode
   * @param {boolean} [options.autoAudit=true] - Automatically audit hidden fields periodically
   * @param {number} [options.auditInterval=15] - Interval in minutes between automated audits
   * @param {boolean} [options.refreshToken=true] - Refresh CSRF token after form submit
   * @param {boolean} [options.showAuditorUI=false] - Show hidden fields auditor UI
   */
  static initialize(options = {}) {
    if (this.#initialized) return;

    this.#debugMode = options.debug || false;
    const autoAudit = options.autoAudit !== false; // true by default
    this.#auditIntervalMinutes = options.auditInterval || 15;
    const showAuditorUI = options.showAuditorUI || false;

    // Capture CSP nonce from meta tag
    const nonceElement = document.querySelector('meta[property="csp-nonce"]');
    if (nonceElement) {
      this.#cspNonce = nonceElement.getAttribute('content');
    }

    // Initialize CSRF protection with our options
    if (typeof csrfProtection !== 'undefined') {
      csrfProtection.updateOptions({
        debug: this.#debugMode,
        refreshToken: options.refreshToken !== false,
        detectDynamicForms: true,
        sameSite: 'Strict',
        secure: true,
      });
      csrfProtection.initialize();
      this.#log('Enhanced CSRF protection initialized');
    } else {
      // Apply legacy protection if enhanced module not available
      this.#applyLegacyCSRFProtection();
    }

    // Apply input sanitization to all forms
    this.#applyFormSanitization();

    // Hook into DOM mutations to sanitize any new content
    this.#observeDOMChanges();

    // Initialize hidden fields auditor
    if (typeof hiddenFieldsAuditor !== 'undefined') {
      hiddenFieldsAuditor.setDebugMode(this.#debugMode);

      // Perform initial audit
      this.#performHiddenFieldsAudit();

      // Set up periodic audits if enabled
      if (autoAudit) {
        this.#startAutomatedAudits();
      }

      // Initialize UI component if requested
      if (showAuditorUI && typeof hiddenFieldsAuditorUI !== 'undefined') {
        hiddenFieldsAuditorUI.initialize();
        this.#log('Hidden fields auditor UI initialized');
      }
    }

    // Patch NeuralBus if it exists to sanitize all published data
    if (typeof window.NeuralBus !== 'undefined') {
      this.#patchNeuralBus();
    }

    this.#initialized = true;
    this.#log('QuantumSecurity initialized', 'version', this.#version);
  }

  /**
   * Perform a hidden fields audit and process the results
   */
  static #performHiddenFieldsAudit() {
    if (typeof hiddenFieldsAuditor === 'undefined') return;

    const auditResults = hiddenFieldsAuditor.auditAllHiddenFields();
    const highRiskFields = hiddenFieldsAuditor.getHighRiskFields();

    // Store high risk fields for later reference
    this.#highRiskFields = highRiskFields;

    if (highRiskFields.length > 0) {
      console.warn('[QuantumSecurity] Found high risk hidden fields:', highRiskFields);

      // Emit warning event that can be captured by monitoring systems
      const event = new CustomEvent('quantum-security:risk-detected', {
        detail: {
          type: 'hidden-fields',
          fields: highRiskFields,
          timestamp: new Date().toISOString(),
        },
      });
      document.dispatchEvent(event);
    }

    this.#log('Hidden fields audit completed', auditResults.length + ' fields analyzed');
    return { results: auditResults, highRiskFields };
  }

  /**
   * Start automated periodic audits of hidden fields
   */
  static #startAutomatedAudits() {
    // Clear any existing interval
    if (this.#auditIntervalId) {
      clearInterval(this.#auditIntervalId);
    }

    // Set up new interval
    const intervalMs = this.#auditIntervalMinutes * 60 * 1000;
    this.#auditIntervalId = setInterval(() => {
      this.#performHiddenFieldsAudit();
    }, intervalMs);

    this.#log(
      `Automated hidden fields audits started (every ${this.#auditIntervalMinutes} minutes)`
    );
  }

  /**
   * Stop automated audits
   */
  static stopAutomatedAudits() {
    if (this.#auditIntervalId) {
      clearInterval(this.#auditIntervalId);
      this.#auditIntervalId = null;
      this.#log('Automated hidden fields audits stopped');
    }
  }

  /**
   * Apply legacy CSRF protection for backward compatibility
   */
  static #applyLegacyCSRFProtection() {
    // Get or create CSRF token
    let csrfToken = this.#getCookie('cybercore_csrf_token');

    if (!csrfToken) {
      // Generate a new token
      csrfToken = this.#generateCSRFToken();

      // Store token in cookie
      const expires = new Date();
      expires.setTime(expires.getTime() + 4 * 60 * 60 * 1000); // 4 hours
      document.cookie = `cybercore_csrf_token=${csrfToken}; expires=${expires.toUTCString()}; path=/; SameSite=Strict; Secure`;
    }

    // Add meta tag for easy access
    let metaTag = document.querySelector('meta[name="csrf-token"]');
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', 'csrf-token');
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute('content', csrfToken);

    // Protect all forms
    document.querySelectorAll('form').forEach((form) => {
      let tokenInput = form.querySelector('input[name="csrf_token"]');
      if (!tokenInput) {
        tokenInput = document.createElement('input');
        tokenInput.setAttribute('type', 'hidden');
        tokenInput.setAttribute('name', 'csrf_token');
        form.appendChild(tokenInput);
      }
      /** @type {HTMLInputElement} */ (tokenInput).value = csrfToken;
    });

    // Protect dynamically added forms
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = /** @type {Element} */ (node);
              if (element.tagName === 'FORM') {
                this.#protectForm(/** @type {HTMLFormElement} */ (element));
              }

              const forms = element.querySelectorAll('form');
              forms.forEach((form) => this.#protectForm(/** @type {HTMLFormElement} */ (form)));
            }
          });
        }
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    // Add form submission handler to refresh token
    document.addEventListener(
      'submit',
      (event) => {
        // Refresh token after submission
        setTimeout(() => {
          const newToken = this.#generateCSRFToken();

          // Update meta tag
          const metaTag = document.querySelector('meta[name="csrf-token"]');
          if (metaTag) {
            metaTag.setAttribute('content', newToken);
          }

          // Update cookie
          const expires = new Date();
          expires.setTime(expires.getTime() + 4 * 60 * 60 * 1000); // 4 hours
          document.cookie = `cybercore_csrf_token=${newToken}; expires=${expires.toUTCString()}; path=/; SameSite=Strict; Secure`;

          // Update all forms
          document.querySelectorAll('form').forEach((form) => {
            const tokenInput = form.querySelector('input[name="csrf_token"]');
            if (tokenInput) {
              /** @type {HTMLInputElement} */ (tokenInput).value = newToken;
            }
          });
        }, 100);
      },
      true
    );

    this.#log('Legacy CSRF protection applied');
  }

  /**
   * Protect a form with CSRF token
   * @param {HTMLFormElement} form - Form to protect
   */
  static #protectForm(form) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (!csrfToken) return;

    let tokenInput = form.querySelector('input[name="csrf_token"]');
    if (!tokenInput) {
      tokenInput = document.createElement('input');
      tokenInput.setAttribute('type', 'hidden');
      tokenInput.setAttribute('name', 'csrf_token');
      form.appendChild(tokenInput);
    }
    /** @type {HTMLInputElement} */ (tokenInput).value = csrfToken;
  }

  /**
   * Generate a CSRF token
   * @returns {string} Generated token
   */
  static #generateCSRFToken() {
    if (window.crypto && window.crypto.getRandomValues) {
      const array = new Uint8Array(32);
      window.crypto.getRandomValues(array);
      return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
    } else {
      // Fallback for older browsers
      let token = '';
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < 64; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return token;
    }
  }

  /**
   * Get a cookie value
   * @param {string} name - Cookie name
   * @returns {string} Cookie value or empty string
   */
  static #getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
  }

  /**
   * Apply input sanitization to all forms
   */
  static #applyFormSanitization() {
    document.querySelectorAll('form').forEach((form) => {
      form.addEventListener('submit', (event) => {
        const inputs = form.querySelectorAll('input[type="text"], input[type="search"], textarea');

        inputs.forEach((input) => {
          const inputElement = /** @type {HTMLInputElement} */ (input);
          inputElement.value = this.sanitizeInput(inputElement.value);
        });
      });
    });

    this.#log('Form sanitization applied');
  }

  /**
   * Observe DOM changes to sanitize new content
   */
  static #observeDOMChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.#sanitizeElement(/** @type {HTMLElement} */ (node));
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    this.#log('DOM mutation observer initialized');
  }

  /**
   * Sanitize a DOM element and its children
   * @param {HTMLElement} element - Element to sanitize
   */
  static #sanitizeElement(element) {
    // Check for potentially dangerous attributes
    const dangerousAttrs = [
      'onclick',
      'onload',
      'onerror',
      'onmouseover',
      'onmouseout',
      'onkeyup',
      'onkeydown',
      'onkeypress',
      'onfocus',
      'onblur',
      'onsubmit',
      'onreset',
      'onselect',
      'onchange',
    ];

    dangerousAttrs.forEach((attr) => {
      if (element.hasAttribute(attr)) {
        element.removeAttribute(attr);
      }
    });

    // Sanitize URLs
    if (element.hasAttribute('href')) {
      const href = element.getAttribute('href');
      if (
        href &&
        (href.toLowerCase().startsWith('javascript:') ||
          href.toLowerCase().startsWith('data:') ||
          href.includes('&#'))
      ) {
        element.setAttribute('href', '#');
      }
    }

    if (element.hasAttribute('src')) {
      const src = element.getAttribute('src');
      if (
        src &&
        (src.toLowerCase().startsWith('javascript:') ||
          src.toLowerCase().startsWith('data:text/html'))
      ) {
        element.removeAttribute('src');
      }
    }

    // Sanitize inline styles
    if (element.hasAttribute('style')) {
      const style = element.getAttribute('style');
      if (
        style &&
        (style.toLowerCase().includes('expression') ||
          style.toLowerCase().includes('javascript') ||
          style.toLowerCase().includes('behavior') ||
          style.toLowerCase().includes('url('))
      ) {
        element.removeAttribute('style');
      }
    }

    // Check for forms and add CSRF protection
    if (element.tagName === 'FORM') {
      if (typeof csrfProtection !== 'undefined') {
        csrfProtection.protectForm(/** @type {HTMLFormElement} */ (element));
      } else {
        this.#protectForm(/** @type {HTMLFormElement} */ (element));
      }

      // Re-audit hidden fields when a new form is added
      if (typeof hiddenFieldsAuditor !== 'undefined') {
        setTimeout(() => {
          hiddenFieldsAuditor.auditFormHiddenFields(/** @type {HTMLFormElement} */ (element));
        }, 0);
      }
    }

    // Recursively sanitize child elements
    Array.from(element.children).forEach((child) => {
      this.#sanitizeElement(/** @type {HTMLElement} */ (child));
    });
  }

  /**
   * Patch NeuralBus to sanitize all published data
   */
  static #patchNeuralBus() {
    // @ts-ignore
    const originalPublish = window.NeuralBus.publish;

    // @ts-ignore
    window.NeuralBus.publish = (event, data, options = {}) => {
      // Sanitize data before publishing
      const sanitizedData = this.sanitizeObject(data);

      // @ts-ignore
      return originalPublish.call(window.NeuralBus, event, sanitizedData, options);
    };

    this.#log('NeuralBus patched for data sanitization');
  }

  /**
   * Sanitize user input to prevent XSS
   * @param {string} input - User input to sanitize
   * @returns {string} Sanitized input
   */
  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;

    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/`/g, '&#96;')
      .replace(/\$/g, '&#36;');
  }

  /**
   * Sanitize an HTML string
   * @param {string} html - HTML string to sanitize
   * @returns {string} Sanitized HTML
   */
  static sanitizeHTML(html) {
    if (typeof html !== 'string') return html;

    // Create a temporary element
    const temp = document.createElement('div');
    temp.textContent = html;

    // Return the sanitized HTML
    return temp.innerHTML;
  }

  /**
   * Sanitize an object or array recursively
   * @param {Object|Array} obj - Object to sanitize
   * @returns {Object|Array} Sanitized object
   */
  static sanitizeObject(obj) {
    if (!obj || typeof obj !== 'object') return obj;

    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeObject(item));
    }

    // Handle objects
    const sanitized = {};

    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'string') {
        // Sanitize string values
        sanitized[key] = this.sanitizeInput(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        // Recursively sanitize objects
        sanitized[key] = this.sanitizeObject(obj[key]);
      } else {
        // Pass through other types
        sanitized[key] = obj[key];
      }
    });

    return sanitized;
  }

  /**
   * Get the current CSP nonce for inline scripts
   * @returns {string|null} CSP nonce
   */
  static getNonce() {
    return this.#cspNonce;
  }

  /**
   * Add security headers to AJAX requests
   * @param {Object} options - Fetch options or XMLHttpRequest
   * @returns {Object} Options with security headers
   */
  static secureRequest(options = {}) {
    const secureOptions = { ...options };

    if (!secureOptions.headers) {
      secureOptions.headers = {};
    }

    // Add CSRF token if available - prefer enhanced implementation
    if (typeof csrfProtection !== 'undefined') {
      secureOptions.headers = csrfProtection.addTokenToHeaders(secureOptions.headers);
    } else {
      const csrfToken = document.querySelector('meta[name="csrf-token"]');
      if (csrfToken) {
        secureOptions.headers['X-CSRF-Token'] = csrfToken.getAttribute('content');
      }
    }

    // Set secure headers
    secureOptions.headers['X-Content-Type-Options'] = 'nosniff';

    return secureOptions;
  }

  /**
   * Audit all hidden form fields in the document
   * @param {boolean} [includeValues=false] - Include field values in results
   * @returns {Object} Audit results
   */
  static auditHiddenFields(includeValues = false) {
    if (typeof hiddenFieldsAuditor !== 'undefined') {
      const results = hiddenFieldsAuditor.auditAllHiddenFields();

      // Generate a report if requested
      if (includeValues) {
        return {
          results,
          report: hiddenFieldsAuditor.generateReport(true),
          highRiskCount: hiddenFieldsAuditor.getHighRiskFields().length,
        };
      }

      return {
        results,
        highRiskCount: hiddenFieldsAuditor.getHighRiskFields().length,
      };
    }

    // Fallback implementation if auditor not available
    const results = [];

    document.querySelectorAll('input[type="hidden"]').forEach((input) => {
      const form = input.closest('form');
      const inputElement = /** @type {HTMLInputElement} */ (input);
      results.push({
        form: form ? form.id || form.name || 'unknown-form' : 'no-form',
        name: inputElement.name || 'unnamed-field',
        value: includeValues
          ? inputElement.value
          : inputElement.value
          ? inputElement.value.length > 20
            ? inputElement.value.substring(0, 17) + '...'
            : inputElement.value
          : '',
        hasValue: !!inputElement.value,
        valueLength: inputElement.value ? inputElement.value.length : 0,
      });
    });

    return { results };
  }

  /**
   * Get high risk hidden fields
   * @returns {Array} High risk fields
   */
  static getHighRiskHiddenFields() {
    if (typeof hiddenFieldsAuditor !== 'undefined') {
      return hiddenFieldsAuditor.getHighRiskFields();
    }

    return this.#highRiskFields;
  }

  /**
   * Shows the hidden fields auditor UI
   * @returns {boolean} Whether the UI was successfully shown
   */
  static showHiddenFieldsAuditorUI() {
    if (typeof hiddenFieldsAuditorUI !== 'undefined') {
      hiddenFieldsAuditorUI.initialize();
      return true;
    }
    return false;
  }

  /**
   * Log debug messages
   * @param {...any} args - Arguments to log
   */
  static #log(...args) {
    if (this.#debugMode) {
      console.log('[QuantumSecurity]', ...args);
    }
  }
}

// Create and initialize QUANTUM_DEBUG property on window if it doesn't exist
// @ts-ignore
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.QUANTUM_DEBUG = window.QUANTUM_DEBUG || false;
}

// Auto-initialize if QuantumSecurity is loaded dynamically
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    // @ts-ignore - Accessing QUANTUM_DEBUG
    const isDebug = typeof window.QUANTUM_DEBUG === 'boolean' ? window.QUANTUM_DEBUG : false;

    QuantumSecurity.initialize({
      debug: isDebug,
      autoAudit: true,
      auditInterval: 15,
      refreshToken: true,
      showAuditorUI: isDebug,
    });
  });
}

// Export for ESM or CommonJS
export default QuantumSecurity;
