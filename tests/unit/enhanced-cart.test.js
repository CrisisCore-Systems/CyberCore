/**
 * @jest-environment jsdom
 */

import { CartSystem } from '../../assets/cart-system';
import { EnhancedCart } from '../../assets/enhanced-cart';
import { NeuralBus } from '../../assets/neural-bus';

// Mock dependencies
jest.mock('../../assets/neural-bus', () => ({
  NeuralBus: {
    publish: jest.fn(),
    subscribe: jest.fn(),
    register: jest.fn(),
  },
}));

jest.mock('../../assets/cart-system', () => ({
  CartSystem: {
    initialize: jest.fn(),
    addItem: jest.fn(),
    initialized: false,
  },
}));

describe('EnhancedCart', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();

    // Set up document body with necessary elements
    document.body.innerHTML = `
      <quantum-hologram></quantum-hologram>
    `;

    // Mock Worker implementation
    global.Worker = class MockWorker {
      constructor() {
        this.addEventListener = jest.fn();
        this.postMessage = jest.fn();
        this.terminate = jest.fn();
      }
    };

    // Setup customElements mock
    if (!window.customElements) {
      window.customElements = {
        define: jest.fn(),
        get: jest.fn(() => undefined),
      };
    }
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('should initialize with default configuration', () => {
    EnhancedCart.initialize();

    expect(CartSystem.initialize).toHaveBeenCalled();
    expect(NeuralBus.register).toHaveBeenCalledWith('enhanced-cart', expect.any(Object));
  });

  test('should apply profile to document and components', () => {
    // Setup
    const originalClassList = document.documentElement.classList;
    document.documentElement.classList = {
      remove: jest.fn(),
      add: jest.fn(),
    };

    // Test
    EnhancedCart.initialize();
    EnhancedCart.applyProfile('VoidBloom');

    // Assertions
    expect(document.documentElement.classList.remove).toHaveBeenCalledWith(
      'profile-cyberlotus',
      'profile-obsidianbloom',
      'profile-voidbloom',
      'profile-neonvortex'
    );

    expect(document.documentElement.classList.add).toHaveBeenCalledWith('profile-voidbloom');
    expect(NeuralBus.publish).toHaveBeenCalledWith(
      'enhanced-cart:profile-changed',
      expect.any(Object)
    );

    // Restore
    document.documentElement.classList = originalClassList;
  });

  test('should set trauma codes and apply them to the document', () => {
    // Setup
    const originalClassList = document.documentElement.classList;
    document.documentElement.classList = {
      remove: jest.fn(),
      add: jest.fn(),
    };

    // Test
    EnhancedCart.initialize();
    EnhancedCart.setTraumaCodes(['glitch-0.7', 'void-0.5']);

    // Assertions
    expect(document.documentElement.classList.remove).toHaveBeenCalledWith(
      'trauma-state-glitch',
      'trauma-state-void',
      'trauma-state-echo',
      'trauma-state-fracture'
    );

    expect(document.documentElement.classList.add).toHaveBeenCalledWith('trauma-state-glitch');
    expect(document.documentElement.classList.add).toHaveBeenCalledWith('trauma-state-void');

    // Restore
    document.documentElement.classList = originalClassList;
  });

  test('should add product to cart with quantum effects', async () => {
    // Setup
    const mockProduct = { id: 'test-123', title: 'Quantum Test Product' };
    CartSystem.addItem.mockResolvedValue({ success: true });

    // Test
    EnhancedCart.initialize({ useQuantumEffects: true });
    await EnhancedCart.addToCart(mockProduct);

    // Assertions
    expect(CartSystem.addItem).toHaveBeenCalledWith({
      id: mockProduct.id,
      quantity: 1,
      properties: {},
    });

    expect(NeuralBus.publish).toHaveBeenCalledWith(
      'enhanced-cart:item-added',
      expect.objectContaining({
        product: mockProduct,
      })
    );
  });
});
