jest.mock('../../assets/hologram-component');
jest.mock('../../assets/quantum-visualizer');
jest.mock('../../assets/glitch-engine');
jest.mock('../../assets/cart-system');

const HologramComponent = require('../../assets/hologram-component');
const QuantumVisualizer = require('../../assets/quantum-visualizer');
const GlitchEngine = require('../../assets/glitch-engine');
const CartSystem = require('../../assets/cart-system');

describe('CyberCore End-to-End Tests', () => {
  describe('PowerShell to JavaScript Integration', () => {
    it('should process quantum mutations from PowerShell to frontend', () => {
      // Create frontend components
      const hologram = new HologramComponent();
      const visualizer = new QuantumVisualizer();
            
      // Spy on frontend methods
      const hologramUpdateSpy = jest.spyOn(hologram, 'updateQuantumState');
      const visualizerRenderSpy = jest.spyOn(visualizer, 'render');
            
      // Connect components
      hologram.connectVisualizer(visualizer);
            
      // Create a mock handler for PowerShell output
      global.window.processQuantumMutation = (mutationData) => {
        hologram.updateQuantumState(JSON.parse(mutationData));
      };
            
      // Call mock handler with the data
      window.processQuantumMutation(JSON.stringify([
        { id: 'q1', state: 'mutated', probability: 0.85 }
      ]));
            
      // Verify frontend updates
      expect(hologramUpdateSpy).toHaveBeenCalledTimes(1);
      expect(visualizerRenderSpy).toHaveBeenCalledTimes(1);
    });
  });
    
  describe('Complete E-commerce Workflow', () => {
    it('should handle hologram product visualization and cart addition', () => {
      // Create system components
      const hologram = new HologramComponent();
      const cartSystem = new CartSystem();
            
      // Spy on methods
      const hologramRenderSpy = jest.spyOn(hologram, 'render');
      const cartAddSpy = jest.spyOn(cartSystem, 'addItem');
            
      // Connect components
      hologram.connectCartSystem(cartSystem);
            
      // Simulate product visualization
      const productData = {
        id: 'quantum-pendant',
        name: 'Quantum Pendant',
        price: 299.99,
        quantumProperties: {
          resonance: 0.92,
          entanglement: 'high',
          fractalDepth: 7
        }
      };
            
      hologram.visualizeProduct(productData);
      expect(hologramRenderSpy).toHaveBeenCalledTimes(1);
            
      // Simulate user adding product to cart
      hologram.addToCart(productData.id);
            
      // Verify cart integration
      expect(cartAddSpy).toHaveBeenCalledTimes(1);
      expect(cartAddSpy).toHaveBeenCalledWith(productData.id);
      expect(cartSystem.getCartContents()).toContainEqual({ id: productData.id });
    });
        
    it('should process a complete purchase with quantum verification', () => {
      // Create system components
      const cartSystem = new CartSystem();
            
      // Add mock product to cart
      cartSystem.addItem('quantum-pendant', 1);
            
      // Spy on checkout method
      const checkoutSpy = jest.spyOn(cartSystem, 'checkout');
      const verifyQuantumSpy = jest.fn().mockResolvedValue(true);
      cartSystem.setQuantumVerifier(verifyQuantumSpy);
            
      // Simulate checkout process
      const checkoutResult = cartSystem.checkout({
        customerId: 'cust-12345',
        paymentMethod: 'quantum-credit',
        securityNonce: 'a1b2c3d4'
      });
            
      // Verify checkout flow
      expect(checkoutSpy).toHaveBeenCalledTimes(1);
      expect(verifyQuantumSpy).toHaveBeenCalledTimes(1);
      expect(checkoutResult.success).toBe(true);
      expect(checkoutResult.orderId).toMatch(/^ord-/);
      expect(cartSystem.getCartContents().length).toBe(0);
    });
  });
});