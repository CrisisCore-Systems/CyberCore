/**
 * SECURITY-UTILS.TS
 * Security utility functions for the VoidBloom theme
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * @Version: 1.0.0
 */

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param html The HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  // Create a virtual document element
  const doc = document.implementation.createHTMLDocument();
  const div = doc.createElement('div');

  // Set the HTML content
  div.innerHTML = html;

  // Remove potentially dangerous elements
  const dangerousTags = [
    'script',
    'style',
    'iframe',
    'object',
    'embed',
    'form',
    'input',
    'button',
    'textarea',
    'select',
    'option',
    'meta',
    'link',
    'base',
    'applet',
    'frameset',
  ];

  dangerousTags.forEach((tag) => {
    const elements = div.getElementsByTagName(tag);
    for (let i = elements.length - 1; i >= 0; i--) {
      elements[i].parentNode?.removeChild(elements[i]);
    }
  });

  // Remove dangerous attributes from all remaining elements
  const elements = div.getElementsByTagName('*');
  const dangerousAttrs = [
    'onerror',
    'onload',
    'onunload',
    'onclick',
    'ondblclick',
    'onmousedown',
    'onmouseup',
    'onmouseover',
    'onmousemove',
    'onmouseout',
    'onkeypress',
    'onkeydown',
    'onkeyup',
    'onsubmit',
    'onreset',
    'onabort',
    'onfocus',
    'onblur',
    'onchange',
    'onresize',
    'onscroll',
    'formaction',
    'href',
    'xlink:href',
    'action',
    'src',
    'data',
    'dynsrc',
    'lowsrc',
  ];

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];

    // Only allow specific tags with specific attributes
    if (el.tagName.toLowerCase() === 'a') {
      // Only allow http/https links
      const href = el.getAttribute('href');
      if (
        href &&
        !href.startsWith('http:') &&
        !href.startsWith('https:') &&
        !href.startsWith('/') &&
        !href.startsWith('#')
      ) {
        el.removeAttribute('href');
      }

      // Force links to open in new tab and add noopener
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    } else if (el.tagName.toLowerCase() === 'img') {
      // Only allow http/https image sources
      const src = el.getAttribute('src');
      if (src && !src.startsWith('http:') && !src.startsWith('https:') && !src.startsWith('/')) {
        el.removeAttribute('src');
      }
    }

    // Remove all dangerous attributes
    for (let j = 0; j < dangerousAttrs.length; j++) {
      const attr = dangerousAttrs[j];
      if (attr === 'href' || attr === 'src') continue; // We handle these specially above
      el.removeAttribute(attr);
    }
  }

  return div.innerHTML;
}

/**
 * Encode text to prevent XSS (use for text nodes)
 * @param text Text to encode
 * @returns Encoded text safe for insertion in HTML
 */
export function encodeHTML(text: string): string {
  if (!text) return '';

  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitize an object by encoding all string properties
 * @param obj Object to sanitize
 * @returns Sanitized object
 */
export function sanitizeObject<T>(obj: T): T {
  if (!obj) return obj;

  if (typeof obj === 'string') {
    // For string values, encode HTML entities
    return encodeHTML(obj) as unknown as T;
  } else if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      // For arrays, recursively sanitize each element
      return obj.map((item) => sanitizeObject(item)) as unknown as T;
    } else {
      // For objects, recursively sanitize each property
      const result: Record<string, any> = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          result[key] = sanitizeObject((obj as Record<string, any>)[key]);
        }
      }
      return result as T;
    }
  }

  // Non-object types are returned as-is
  return obj;
}

/**
 * Parse and sanitize JSON content
 * @param json JSON string to parse and sanitize
 * @returns Sanitized object or null if invalid
 */
export function safeJSONParse<T>(json: string): T | null {
  try {
    const parsed = JSON.parse(json);
    return sanitizeObject<T>(parsed);
  } catch (e) {
    console.error('Error parsing JSON', e);
    return null;
  }
}

/**
 * Validates a URL to ensure it's safe
 * @param url URL to validate
 * @returns True if URL is safe, false otherwise
 */
export function isValidURL(url: string): boolean {
  if (!url) return false;

  try {
    const parsedUrl = new URL(url);
    // Only allow http:// and https:// protocols
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch (e) {
    // If URL is relative, it's considered safe
    return url.startsWith('/') || url.startsWith('./') || url.startsWith('#');
  }
}

/**
 * Creates a random token for security purposes
 * @param length Length of the token
 * @returns Random token string
 */
export function generateSecurityToken(length: number = 32): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  // Use crypto API if available
  if (window.crypto && window.crypto.getRandomValues) {
    const values = new Uint32Array(length);
    window.crypto.getRandomValues(values);

    for (let i = 0; i < length; i++) {
      result += characters.charAt(values[i] % characters.length);
    }
  } else {
    // Fallback to Math.random (less secure but still usable)
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  }

  return result;
}

/**
 * Create a hash of a string using a simple algorithm
 * For non-cryptographic purposes only!
 * @param str String to hash
 * @returns Hashed string
 */
export function simpleHash(str: string): string {
  let hash = 0;

  if (str.length === 0) return hash.toString(16);

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return Math.abs(hash).toString(16);
}

/**
 * Check if current page is HTTPS
 * @returns True if HTTPS, false otherwise
 */
export function isHttps(): boolean {
  return window.location.protocol === 'https:';
}

/**
 * Sets secure cookies
 * @param name Cookie name
 * @param value Cookie value
 * @param days Days until expiration
 */
export function setSecureCookie(name: string, value: string, days: number = 30): void {
  const secure = isHttps() ? '; Secure' : '';
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${date.toUTCString()}; path=/; SameSite=Lax${secure}`;
}

/**
 * Get a cookie by name
 * @param name Cookie name
 * @returns Cookie value or empty string if not found
 */
export function getCookie(name: string): string {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }

    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }

  return '';
}

/**
 * Delete a cookie
 * @param name Cookie name
 */
export function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/**
 * Validate an email address
 * @param email Email to validate
 * @returns True if email is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return re.test(email);
}

/**
 * Strip all HTML tags from a string
 * @param html HTML string
 * @returns Plain text string
 */
export function stripHtml(html: string): string {
  if (!html) return '';

  // Create a virtual element
  const doc = document.implementation.createHTMLDocument();
  const div = doc.createElement('div');
  div.innerHTML = html;

  // Extract text content
  return div.textContent || div.innerText || '';
}
