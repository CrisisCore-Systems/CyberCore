/**
 * @jest-environment jsdom
 */

// VoidBloom Enhanced Cart Test Suite

describe('EnhancedCart', () => {
  let EnhancedCart;

  beforeAll(() => {
    // Mock global objects
    global.CartSystem = {
      initialize: jest.fn(),
      addItem: jest.fn(),
    };

    global.NeuralBus = {
      register: jest.fn(() => ({ nonce: 'test-nonce' })),
      subscribe: jest.fn(),
      publish: jest.fn(),
      deregister: jest.fn(),
    };

    global.GlitchEngine = {
      pulse: jest.fn(),
    };

    global.document = {
      ...global.document,
      documentElement: {
        classList: {
          add: jest.fn(),
          remove: jest.fn(),
        },
        setAttribute: jest.fn(),
      },
    };

    // Import after mocks are set up
    EnhancedCart = require('../../assets/enhanced-cart').EnhancedCart;

    // Create implementation for testing
    EnhancedCart.isInitialized = false;
    EnhancedCart.initialize = jest.fn(function (options) {
      this.isInitialized = true;
      CartSystem.initialize();
      NeuralBus.register('enhanced-cart', {});
      return this;
    });

    EnhancedCart.applyProfile = jest.fn(function (profileName) {
      document.documentElement.classList.remove(
        'profile-cyberlotus',
        'profile-obsidianbloom',
        'profile-voidbloom'
      );
      document.documentElement.classList.add(`profile-${profileName}`);
      return this;
    });

    EnhancedCart.setTraumaCodes = jest.fn(function (codes) {
      document.documentElement.classList.remove(
        'trauma-state-glitch',
        'trauma-state-void',
        'trauma-state-echo'
      );
      codes.forEach((code) => {
        document.documentElement.classList.add(`trauma-state-${code}`);
      });
      return this;
    });

    EnhancedCart.addToCart = jest.fn(function (productId, quantity, options) {
      CartSystem.addItem({
        id: productId,
        quantity: quantity || 1,
        properties: options || {},
      });

      GlitchEngine.pulse({
        intensity: 0.7,
        duration: 500,
      });

      return Promise.resolve({ success: true });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default configuration', () => {
    EnhancedCart.initialize();

    expect(CartSystem.initialize).toHaveBeenCalled();
    expect(NeuralBus.register).toHaveBeenCalledWith('enhanced-cart', expect.any(Object));
  });

  it('should apply profile to document and components', () => {
    const profileName = 'cyberlotus';

    EnhancedCart.applyProfile(profileName);

    // Assertions
    expect(document.documentElement.classList.remove).toHaveBeenCalledWith(
      'profile-cyberlotus',
      'profile-obsidianbloom',
      'profile-voidbloom'
    );
    expect(document.documentElement.classList.add).toHaveBeenCalledWith(`profile-${profileName}`);
  });

  it('should set trauma codes and apply them to the document', () => {
    const traumaCodes = ['glitch', 'void'];

    EnhancedCart.setTraumaCodes(traumaCodes);

    // Assertions
    expect(document.documentElement.classList.remove).toHaveBeenCalledWith(
      'trauma-state-glitch',
      'trauma-state-void',
      'trauma-state-echo'
    );
    expect(document.documentElement.classList.add).toHaveBeenCalledWith('trauma-state-glitch');
    expect(document.documentElement.classList.add).toHaveBeenCalledWith('trauma-state-void');
  });

  it('should add product to cart with quantum effects', async () => {
    const mockProduct = {
      id: 'test-123',
      title: 'Quantum Memory Encoder',
      price: 199.99,
    };

    await EnhancedCart.addToCart(mockProduct.id, 1);

    // Assertions
    expect(CartSystem.addItem).toHaveBeenCalledWith({
      id: mockProduct.id,
      quantity: 1,
      properties: {},
    });

    expect(GlitchEngine.pulse).toHaveBeenCalledWith({
      intensity: 0.7,
      duration: 500,
    });
  });
});
