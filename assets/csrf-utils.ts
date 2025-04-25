/**
 * CSRF-UTILS.TS
 * Cross-Site Request Forgery protection utilities for the VoidBloom theme
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * @Version: 1.0.0
 */

import { generateSecurityToken, getCookie, setSecureCookie } from './security-utils';

// Token name in cookies and headers
const CSRF_TOKEN_NAME = 'x-voidbloom-csrf-token';
const CSRF_HEADER_NAME = 'X-CSRF-Token';

/**
 * Generate and store a CSRF token
 * @returns The generated CSRF token
 */
export function generateCSRFToken(): string {
  const token = generateSecurityToken(48);
  setSecureCookie(CSRF_TOKEN_NAME, token, 1); // Short lived - 1 day
  return token;
}

/**
 * Get the current CSRF token or generate a new one if none exists
 * @returns The current or newly generated CSRF token
 */
export function getCSRFToken(): string {
  let token = getCookie(CSRF_TOKEN_NAME);

  if (!token) {
    token = generateCSRFToken();
  }

  return token;
}

/**
 * Add CSRF token to a URL
 * @param url URL to add token to
 * @returns URL with token appended
 */
export function addCSRFToUrl(url: string): string {
  const token = getCSRFToken();
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${CSRF_TOKEN_NAME}=${encodeURIComponent(token)}`;
}

/**
 * Add CSRF token to a form
 * @param form Form element to add token to
 */
export function protectForm(form: HTMLFormElement): void {
  const token = getCSRFToken();

  // Check if token input already exists
  let tokenInput = form.querySelector(`input[name="${CSRF_TOKEN_NAME}"]`) as HTMLInputElement;

  if (!tokenInput) {
    // Create a new hidden input for the token
    tokenInput = document.createElement('input');
    tokenInput.type = 'hidden';
    tokenInput.name = CSRF_TOKEN_NAME;
    form.appendChild(tokenInput);
  }

  // Set or update the token value
  tokenInput.value = token;
}

/**
 * Verify that a request contains a valid CSRF token
 * @param token Token from request to verify
 * @returns True if token is valid, false otherwise
 */
export function verifyCSRFToken(token: string): boolean {
  const storedToken = getCookie(CSRF_TOKEN_NAME);
  return !!storedToken && storedToken === token;
}

/**
 * Add CSRF header to fetch options
 * @param options Fetch options object
 * @returns Updated fetch options with CSRF header
 */
export function addCSRFHeader(options: RequestInit = {}): RequestInit {
  const token = getCSRFToken();

  // Create or update headers
  const headers = options.headers || {};

  if (headers instanceof Headers) {
    headers.set(CSRF_HEADER_NAME, token);
  } else if (Array.isArray(headers)) {
    headers.push([CSRF_HEADER_NAME, token]);
  } else {
    (headers as Record<string, string>)[CSRF_HEADER_NAME] = token;
  }

  return {
    ...options,
    credentials: 'same-origin', // Always send cookies with request
    headers,
  };
}

/**
 * Initialize CSRF protection for all forms in the document
 */
export function initCSRFProtection(): void {
  // Generate a token if one doesn't exist
  getCSRFToken();

  // Protect all forms
  document.querySelectorAll('form').forEach((form) => {
    protectForm(form as HTMLFormElement);
  });

  // Watch for dynamically added forms
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // If the node is a form
            if ((node as Element).tagName === 'FORM') {
              protectForm(node as HTMLFormElement);
            }

            // Check for forms within the added node
            const forms = (node as Element).querySelectorAll('form');
            forms.forEach((form) => protectForm(form as HTMLFormElement));
          }
        });
      }
    });
  });

  // Start observing the document
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  // Add event listener for form submissions
  document.addEventListener(
    'submit',
    (event) => {
      const form = event.target as HTMLFormElement;
      protectForm(form);
    },
    true
  );
}

// Automatically initialize when imported in browser context
if (typeof document !== 'undefined') {
  // Initialize on DOM content loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCSRFProtection);
  } else {
    // DOM already loaded, initialize now
    initCSRFProtection();
  }
}
