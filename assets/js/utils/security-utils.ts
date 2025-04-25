/**
 * SECURITY-UTILS.TS
 * Security utilities for the CyberCore theme
 * 
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * @Version: 1.0.0
 */

/**
 * Security utilities for the CyberCore theme
 * Provides functions for XSS prevention, sanitization, and security validation
 */
export class SecurityUtils {
  // Singleton instance
  private static instance: SecurityUtils;

  // HTML sanitization patterns
  private static readonly SCRIPT_PATTERN = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  private static readonly EVENT_HANDLER_PATTERN = /\bon\w+=\s*?["']?[^"']*["']/gi;
  private static readonly DANGEROUS_TAGS_PATTERN = /<(iframe|object|embed|form|input|button|textarea|select|option|applet|meta|link|style|base|body|html|script|frame|frameset|ilayer|layer|bgsound|title|head)\b[^>]*>/gi;
  private static readonly DATA_PATTERNS = /(data:text\/html[^,]*,)/gi;
  private static readonly JAVASCRIPT_URI_PATTERN = /(javascript:.*?)/gi;
  private static readonly VBSCRIPT_URI_PATTERN = /(vbscript:.*?)/gi;
  
  // Allowed protocols
  private static readonly ALLOWED_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];
  
  // Debug mode
  private debugMode = false;

  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {}

  /**
   * Get the singleton instance
   */
  public static getInstance(): SecurityUtils {
    if (!SecurityUtils.instance) {
      SecurityUtils.instance = new SecurityUtils();
    }
    return SecurityUtils.instance;
  }

  /**
   * Set debug mode
   */
  public setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
  }

  /**
   * Sanitize HTML string to prevent XSS attacks
   * @param html HTML string to sanitize
   * @returns Sanitized HTML string
   */
  public sanitizeHTML(html: string): string {
    if (!html) return '';
    
    // Make a copy to avoid modification of the original
    let sanitized = String(html);

    // Log original if in debug mode
    if (this.debugMode) {
      console.log('[SecurityUtils] Sanitizing HTML:', html);
    }
    
    // Remove script tags and their contents
    sanitized = sanitized.replace(SecurityUtils.SCRIPT_PATTERN, '');
    
    // Remove event handlers (onclick, onload, etc.)
    sanitized = sanitized.replace(SecurityUtils.EVENT_HANDLER_PATTERN, '');
    
    // Remove dangerous tags
    sanitized = sanitized.replace(SecurityUtils.DANGEROUS_TAGS_PATTERN, '');
    
    // Remove data: URIs
    sanitized = sanitized.replace(SecurityUtils.DATA_PATTERNS, '');
    
    // Remove javascript: URIs
    sanitized = sanitized.replace(SecurityUtils.JAVASCRIPT_URI_PATTERN, '');
    
    // Remove vbscript: URIs
    sanitized = sanitized.replace(SecurityUtils.VBSCRIPT_URI_PATTERN, '');
    
    // Log sanitized output if in debug mode
    if (this.debugMode && sanitized !== html) {
      console.log('[SecurityUtils] Sanitized to:', sanitized);
    }
    
    return sanitized;
  }

  /**
   * Escape HTML special characters
   * @param text Text to escape
   * @returns Escaped text safe for insertion in HTML
   */
  public escapeHTML(text: string): string {
    if (!text) return '';
    
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Sanitize URL to prevent javascript: or other malicious protocols
   * @param url URL to sanitize
   * @param defaultUrl Default URL to use if the provided one is unsafe
   * @returns Sanitized URL
   */
  public sanitizeURL(url: string, defaultUrl: string = '#'): string {
    if (!url) return defaultUrl;
    
    try {
      // Try to parse the URL
      const urlObj = new URL(url, window.location.origin);
      
      // Check protocol
      const protocol = urlObj.protocol.toLowerCase();
      
      // If protocol is not allowed, return the default URL
      if (!SecurityUtils.ALLOWED_PROTOCOLS.includes(protocol)) {
        if (this.debugMode) {
          console.warn(`[SecurityUtils] Blocked URL with unsafe protocol: ${protocol}`);
        }
        return defaultUrl;
      }
      
      return urlObj.toString();
    } catch (e) {
      // If the URL is invalid, try to see if it's a relative path
      if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
        // Simple path validation to prevent injection
        if (/^[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+$/.test(url)) {
          return url;
        }
      }
      
      // Invalid URL, return the default
      if (this.debugMode) {
        console.warn(`[SecurityUtils] Invalid URL: ${url}`);
      }
      return defaultUrl;
    }
  }

  /**
   * Validate and clean content before inserting into DOM
   * @param content Content to validate
   * @returns Validated content
   */
  public validateContent(content: string): string {
    return this.sanitizeHTML(content);
  }

  /**
   * Validate form input to prevent injection attacks
   * @param input Input value to validate
   * @param type Type of input (text, email, url, etc.)
   * @returns Validated input
   */
  public validateInput(input: string, type: string = 'text'): string {
    if (!input) return '';
    
    // Make a copy to avoid modification of the original
    let validated = String(input);
    
    switch (type.toLowerCase()) {
      case 'email':
        // Basic email validation
        validated = validated.replace(/[^\w.@+-]/g, '');
        break;
        
      case 'url':
        // Use the URL sanitizer
        validated = this.sanitizeURL(validated, '');
        break;
        
      case 'number':
        // Allow only digits and decimal point
        validated = validated.replace(/[^\d.-]/g, '');
        break;
        
      case 'tel':
        // Allow only digits, spaces, and common phone symbols
        validated = validated.replace(/[^\d\s+()-]/g, '');
        break;
        
      case 'text':
      default:
        // Escape HTML special characters for text inputs
        validated = this.escapeHTML(validated);
        break;
    }
    
    return validated;
  }

  /**
   * Check if a string contains potentially malicious content
   * @param content Content to check
   * @returns True if the content is potentially malicious
   */
  public isMalicious(content: string): boolean {
    if (!content) return false;
    
    // Check for script tags
    if (SecurityUtils.SCRIPT_PATTERN.test(content)) {
      return true;
    }
    
    // Check for event handlers
    if (SecurityUtils.EVENT_HANDLER_PATTERN.test(content)) {
      return true;
    }
    
    // Check for dangerous tags
    if (SecurityUtils.DANGEROUS_TAGS_PATTERN.test(content)) {
      return true;
    }
    
    // Check for data: URIs
    if (SecurityUtils.DATA_PATTERNS.test(content)) {
      return true;
    }
    
    // Check for javascript: URIs
    if (SecurityUtils.JAVASCRIPT_URI_PATTERN.test(content)) {
      return true;
    }
    
    // Check for vbscript: URIs
    if (SecurityUtils.VBSCRIPT_URI_PATTERN.test(content)) {
      return true;
    }
    
    return false;
  }

  /**
   * Secure JSON parse to prevent prototype pollution
   * @param json JSON string to parse
   * @returns Parsed JSON object
   */
  public secureJSONParse(json: string): any {
    if (!json) return null;
    
    try {
      // Parse the JSON
      const parsed = JSON.parse(json);
      
      // Freeze the object to prevent modification
      if (parsed && typeof parsed === 'object') {
        Object.freeze(parsed);
        
        // Recursively freeze nested objects
        const freezeDeep = (obj: any) => {
          Object.keys(obj).forEach(prop => {
            if (
              obj[prop] !== null &&
              (typeof obj[prop] === 'object' || typeof obj[prop] === 'function') &&
              !Object.isFrozen(obj[prop])
            ) {
              Object.freeze(obj[prop]);
              freezeDeep(obj[prop]);
            }
          });
        };
        
        freezeDeep(parsed);
      }
      
      return parsed;
    } catch (e) {
      if (this.debugMode) {
        console.error('[SecurityUtils] Failed to parse JSON:', e);
      }
      return null;
    }
  }

  /**
   * Create a safe DOM element with sanitized attributes
   * @param tagName Tag name of the element
   * @param attributes Attributes to set on the element
   * @param content Text content for the element
   * @returns Created DOM element
   */
  public createSafeElement(
    tagName: string,
    attributes: Record<string, string> = {},
    content: string = ''
  ): HTMLElement {
    // Create the element
    const element = document.createElement(tagName);
    
    // Add sanitized attributes
    Object.keys(attributes).forEach(attr => {
      // Skip potentially dangerous attributes
      if (attr.startsWith('on') || attr === 'href' || attr === 'src' || attr === 'style') {
        if (attr === 'href' || attr === 'src') {
          // Sanitize URLs
          element.setAttribute(attr, this.sanitizeURL(attributes[attr]));
        } else if (attr === 'style') {
          // Sanitize style to prevent JavaScript execution
          const sanitizedStyle = attributes[attr].replace(/(expression|javascript|vbscript):/gi, '');
          element.setAttribute(attr, sanitizedStyle);
        }
        // Skip event handlers completely
      } else {
        // Set other attributes normally after escaping
        element.setAttribute(attr, this.escapeHTML(attributes[attr]));
      }
    });
    
    // Set content if provided (as text, not HTML)
    if (content) {
      element.textContent = content;
    }
    
    return element;
  }
}

// Export singleton instance
export const securityUtils = SecurityUtils.getInstance();
export default securityUtils;