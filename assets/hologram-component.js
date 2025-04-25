// hologram-component.js
// Defines <cart-preview-hologram> web component for 3D holographic cart previews

/**
 * HologramComponent
 * A custom element that renders a 3D holographic preview of cart items using the HologramRenderer.
 */
import { HologramRenderer } from './hologram-renderer.js';

class HologramComponent extends HTMLElement {
  constructor() {
    super();
    // Attach shadow DOM for encapsulation
    this.attachShadow({ mode: 'open' });
    this._initialized = false;
  }

  connectedCallback() {
    // Create container for hologram
    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.height = '300px'; // default height, can be overridden via CSS
    this.shadowRoot.appendChild(container);

    this._container = container;

    // Initialize renderer
    this._initializeRenderer();
    this._initialized = true;
  }

  async _initializeRenderer() {
    if (!this._container) return;

    try {
      // Try to use already loaded HologramRenderer or import it
      let renderer = HologramRenderer;

      if (!renderer && typeof window.HologramRenderer === 'undefined') {
        const module = await import('./hologram-renderer.js');
        renderer = module.HologramRenderer;
      } else if (!renderer) {
        renderer = window.HologramRenderer;
      }

      // Initialize renderer if available
      if (renderer && typeof renderer.init === 'function') {
        renderer.init(this._container, {
          intensity: parseFloat(this.getAttribute('data-intensity')) || 0.5,
          color: this.getAttribute('data-color') || '#00ffcc',
          failIfMajorPerformanceCaveat: true,
        });
      } else {
        this._showFallback();
      }
    } catch (error) {
      console.error('Failed to load HologramRenderer:', error);
      this._showFallback();
    }
  }

  _showFallback() {
    console.warn('HologramRenderer not found. HologramComponent will display fallback.');
    // Fallback: simple placeholder
    const placeholder = document.createElement('div');
    placeholder.textContent = '🔮 Hologram Unavailable';
    placeholder.style.color = '#aaa';
    placeholder.style.textAlign = 'center';
    placeholder.style.paddingTop = '130px';
    this._container.appendChild(placeholder);
  }

  disconnectedCallback() {
    // Clean up renderer if it exposes a destroy method
    if (window.HologramRenderer && typeof window.HologramRenderer.destroy === 'function') {
      window.HologramRenderer.destroy(this._container);
    }
  }
}

// Define the custom element if not already registered
if (!customElements.get('cart-preview-hologram')) {
  customElements.define('cart-preview-hologram', HologramComponent);
}

// Expose to global scope for debugging but as a named export as well
export { HologramComponent };
