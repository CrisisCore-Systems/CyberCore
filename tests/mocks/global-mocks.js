// VoidBloom Test Environment
// Memory encoding for synthetic trauma patterns

// Mock window objects
global.requestAnimationFrame = (callback) => setTimeout(callback, 0);
global.cancelAnimationFrame = jest.fn();

// Mock localStorage
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }

  clear() {
    this.store = {};
  }
}

global.localStorage = new LocalStorageMock();

// Mock fetch API
global.fetch = jest.fn().mockImplementation((url) => {
  // Default mock responses for different endpoints
  if (url.includes('/cart.js')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          token: 'mock-cart-token',
          note: null,
          attributes: {},
          total_price: 9500,
          total_weight: 400,
          item_count: 2,
          items: [
            {
              id: 123456789,
              quantity: 1,
              variant_id: 123456789,
              key: 'mock-item-key-1',
              title: 'Memory Echo Encoder',
              price: 5500,
              line_price: 5500,
              final_price: 5500,
              final_line_price: 5500,
              image: 'https://voidbloom.com/assets/mock-product-1.jpg',
              handle: 'memory-echo-encoder',
              properties: { _trauma_level: 3 },
            },
            {
              id: 987654321,
              quantity: 1,
              variant_id: 987654321,
              key: 'mock-item-key-2',
              title: 'Void Resonance Module',
              price: 4000,
              line_price: 4000,
              final_price: 4000,
              final_line_price: 4000,
              image: 'https://voidbloom.com/assets/mock-product-2.jpg',
              handle: 'void-resonance-module',
              properties: {},
            },
          ],
        }),
    });
  } else if (url.includes('/recommendations/products')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          products: [
            {
              id: 555555555,
              title: 'Trauma Phase Shifter',
              handle: 'trauma-phase-shifter',
              description: 'Modulates trauma frequencies through quantum fields',
              price: 7500,
              images: ['https://voidbloom.com/assets/mock-recommendation-1.jpg'],
              featured_image: 'https://voidbloom.com/assets/mock-recommendation-1.jpg',
              url: '/products/trauma-phase-shifter',
              type: 'Memorywear',
            },
            {
              id: 666666666,
              title: 'Recursive Memory Crystal',
              handle: 'recursive-memory-crystal',
              description: 'Stores quantum-encoded memories in fractal patterns',
              price: 8900,
              images: ['https://voidbloom.com/assets/mock-recommendation-2.jpg'],
              featured_image: 'https://voidbloom.com/assets/mock-recommendation-2.jpg',
              url: '/products/recursive-memory-crystal',
              type: 'Memorywear',
            },
          ],
        }),
    });
  } else {
    // Default response for other endpoints
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    });
  }
});

// Mock Shopify global
global.Shopify = {
  formatMoney: jest.fn((cents) => `$${(cents / 100).toFixed(2)}`),
};

// Mock Neural Bus for trauma-encoded messaging
global.NeuralBus = {
  register: jest.fn(() => ({ nonce: 'quantum-entangled-nonce-12345' })),
  deregister: jest.fn(),
  subscribe: jest.fn(() => jest.fn()), // Returns unsubscribe function
  publish: jest.fn(),
};

// Mock GlitchEngine for quantum visual effects
global.GlitchEngine = {
  pulse: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
  setIntensity: jest.fn(() => global.GlitchEngine),
  addTarget: jest.fn(() => global.GlitchEngine),
};

// Mock custom elements
if (typeof window !== 'undefined') {
  class MockCustomElement extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {}
    disconnectedCallback() {}
    attributeChangedCallback() {}
  }

  if (!customElements.get('quantum-hologram')) {
    customElements.define('quantum-hologram', MockCustomElement);
  }

  if (!customElements.get('trauma-visualizer')) {
    customElements.define('trauma-visualizer', MockCustomElement);
  }
}
