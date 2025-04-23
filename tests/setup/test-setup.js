// Import appropriate modules
import '@testing-library/jest-dom';

// Mock window objects
global.requestAnimationFrame = (callback) => setTimeout(callback, 0);
global.cancelAnimationFrame = jest.fn();

// Mock custom elements
if (typeof window !== 'undefined') {
  // Define base class for custom elements
  class MockCustomElement extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    // Default lifecycle methods
    connectedCallback() {}
    disconnectedCallback() {}
    attributeChangedCallback() {}
  }

  // Register only if not already defined
  if (!customElements.get('quantum-hologram')) {
    customElements.define('quantum-hologram', MockCustomElement);
  }

  if (!customElements.get('trauma-visualizer')) {
    customElements.define('trauma-visualizer', MockCustomElement);
  }
}

// Mock WebGL context for hologram rendering
HTMLCanvasElement.prototype.getContext = function (contextType) {
  if (contextType === 'webgl' || contextType === 'webgl2') {
    return {
      // WebGL mock implementation
      createShader: jest.fn(),
      createProgram: jest.fn(),
      createBuffer: jest.fn(),
      // Add other WebGL methods as needed
    };
  }
  return null;
};
