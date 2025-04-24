// hologram-component.js
// Defines <cart-preview-hologram> web component for 3D holographic cart previews

/**
 * HologramComponent
 * A custom element that renders a 3D holographic preview of cart items using the HologramRenderer.
 */
export class HologramComponent extends HTMLElement {
  constructor() {
    super();
    // Attach shadow DOM for encapsulation
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // Create container for hologram
    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.height = '300px'; // default height, can be overridden via CSS
    this.shadowRoot.appendChild(container);

    // Initialize renderer if available
    if (window.HologramRenderer && typeof window.HologramRenderer.init === 'function') {
      window.HologramRenderer.init(container, {
        intensity: parseFloat(this.getAttribute('data-intensity')) || 0.5,
        color: this.getAttribute('data-color') || '#00ffcc'
      });
    } else {
      console.warn('HologramRenderer not found. HologramComponent will display fallback.');
      // Fallback: simple placeholder
      const placeholder = document.createElement('div');
      placeholder.textContent = '🔮 Hologram Unavailable';
      placeholder.style.color = '#aaa';
      placeholder.style.textAlign = 'center';
      placeholder.style.paddingTop = '130px';
      container.appendChild(placeholder);
    }
  }

  disconnectedCallback() {
    // Clean up renderer if it exposes a destroy method
    if (window.HologramRenderer && typeof window.HologramRenderer.destroy === 'function') {
      window.HologramRenderer.destroy(this.shadowRoot);
    }
  }
}

// Define the custom element if not already registered
if (!customElements.get('cart-preview-hologram')) {
  customElements.define('cart-preview-hologram', HologramComponent);
}
