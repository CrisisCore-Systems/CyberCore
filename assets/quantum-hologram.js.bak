/**
 * Quantum Hologram Visualizer
 * Provides 3D holographic effects for product displays with quantum-themed
 * visual effects, dimensional shifts, and neural bus integration
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * @Version: 2.0.0
 */

import { NeuralBus } from './neural-bus.js';

/**
 *
 */
class QuantumHologram {
  /**
   *
   */
  constructor() {
    // Core properties
    this.container = document.querySelector('[data-hologram-container]');
    this.products = document.querySelectorAll('.hologram-product');
    this.isEnabled = window.innerWidth > 768;
    this.initialized = false;

    // Advanced properties
    this.mutationProfile = 'CyberLotus';
    this.dimensionalDepth = 0;
    this.traumaCodes = [];
    this.traumaCodesEnabled = true;
    this.neuralBusConnected = false;
    this.neuralBusSubscriptions = [];
    this.rendererRegistry = new Map();
    this.renderersInitialized = false;

    // Performance optimization
    this.rafId = null;
    this.lastFrameTime = 0;
    this.frameInterval = 1000 / 30; // Limit to 30fps for better performance

    // Initialize
    this.init();
  }

  /**
   *
   */
  init() {
    if (!this.container || this.products.length === 0) return;

    this.setupEventListeners();
    this.createQuantumGrid();
    this.connectToNeuralBus();
    this.initializeProducts();
    this.initializeResponsiveBehavior();

    this.initialized = true;

    // Initial animation
    setTimeout(() => {
      this.products.forEach((product, index) => {
        setTimeout(() => {
          product.classList.add('quantum-initialized');
          this.applyMutationProfile(product, this.mutationProfile);
        }, index * 150);
      });
    }, 300);

    console.log('QuantumHologram initialized with mutation profile:', this.mutationProfile);
  }

  /**
   * Initialize each product with quantum effects
   */
  initializeProducts() {
    this.products.forEach((product) => {
      // Create depth indicator
      const depthIndicator = document.createElement('div');
      depthIndicator.classList.add('quantum-depth-indicator');
      depthIndicator.innerHTML = `<span>◆${this.dimensionalDepth}</span>`;
      product.appendChild(depthIndicator);

      // Create quantum glow
      const quantumGlow = document.createElement('div');
      quantumGlow.classList.add('quantum-glow');
      product.appendChild(quantumGlow);

      // Set data attribute for profile
      product.setAttribute('data-mutation-profile', this.mutationProfile);
    });
  }

  /**
   * Set up responsive behavior
   */
  initializeResponsiveBehavior() {
    // Create media query observer
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    // Handler function
    const handleMediaChange = (e) => {
      this.isEnabled = !e.matches;

      if (!this.isEnabled) {
        this.resetAllProducts();
      } else {
        this.reactivateAllProducts();
      }
    };

    // Register listener
    mediaQuery.addEventListener('change', handleMediaChange);

    // Initialize based on current state
    handleMediaChange(mediaQuery);
  }

  /**
   * Reset all products to default state
   */
  resetAllProducts() {
    this.products.forEach((product) => {
      product.style.transform = '';

      const effect = product.querySelector('.hologram-effect');
      if (effect) {
        effect.style.opacity = '0.5';
        effect.style.background = 'none';
      }
    });

    // Cancel animation frame if running
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Reactivate all products after responsive change
   */
  reactivateAllProducts() {
    this.products.forEach((product) => {
      product.classList.add('quantum-initialized');
      this.applyMutationProfile(product, this.mutationProfile);
    });

    // Restart animation if needed
    this.startAnimationLoop();
  }

  /**
   * Connect to NeuralBus for inter-component communication
   */
  connectToNeuralBus() {
    try {
      if (typeof NeuralBus !== 'undefined') {
        // Register with Neural Bus
        const registration = NeuralBus.register('quantum-hologram', {
          version: '2.0.0',
          capabilities: {
            traumaCodes: this.traumaCodesEnabled,
            dimensionalDepth: this.dimensionalDepth,
          },
        });

        this.neuralBusConnected = true;

        // Subscribe to relevant events
        this.neuralBusSubscriptions.push(
          NeuralBus.subscribe('quantum:mutation', this.handleQuantumMutation.bind(this))
        );
        this.neuralBusSubscriptions.push(
          NeuralBus.subscribe('trauma:code', this.processTraumaCodes.bind(this))
        );
        this.neuralBusSubscriptions.push(
          NeuralBus.subscribe('dimensional:shift', this.setDimensionalDepth.bind(this))
        );
        this.neuralBusSubscriptions.push(
          NeuralBus.subscribe('cart:item:added', this.handleCartItemAdded.bind(this))
        );

        console.log('QuantumHologram connected to Neural Bus');
      }
    } catch (error) {
      console.warn('Failed to connect to Neural Bus:', error);
      this.neuralBusConnected = false;
    }
  }

  /**
   * Disconnect from NeuralBus
   */
  disconnectFromNeuralBus() {
    this.neuralBusSubscriptions.forEach((sub) => {
      if (sub && typeof sub.unsubscribe === 'function') {
        sub.unsubscribe();
      }
    });

    this.neuralBusSubscriptions = [];
    this.neuralBusConnected = false;
  }

  /**
   * Start the animation loop with throttling for performance
   */
  startAnimationLoop() {
    const animate = (timestamp) => {
      this.rafId = requestAnimationFrame(animate);

      // Throttle updates to specified frame rate
      const elapsed = timestamp - this.lastFrameTime;

      if (elapsed > this.frameInterval) {
        this.lastFrameTime = timestamp - (elapsed % this.frameInterval);
        this.updateAnimations(elapsed / 1000); // Convert to seconds
      }
    };

    this.rafId = requestAnimationFrame(animate);
  }

  /**
   * Update all animations - called by animation loop
   */
  updateAnimations(deltaTime) {
    if (!this.isEnabled) return;

    // Update quantum particles
    const particles = document.querySelectorAll('.quantum-particle');
    particles.forEach((particle) => {
      if (Math.random() > 0.95) {
        particle.style.opacity = (Math.random() * 0.7 + 0.3).toString();
      }
    });

    // Update depth indicators based on current dimensional depth
    const depthIndicators = document.querySelectorAll('.quantum-depth-indicator');
    depthIndicators.forEach((indicator) => {
      indicator.querySelector('span').textContent = `◆${this.dimensionalDepth}`;

      // Pulse effect for depth indicators
      if (Math.random() > 0.98) {
        indicator.classList.add('pulse');
        setTimeout(() => {
          indicator.classList.remove('pulse');
        }, 500);
      }
    });
  }

  /**
   *
   */
  setupEventListeners() {
    if (!this.isEnabled) return;

    // Add 3D hover effect to each product
    this.products.forEach((product) => {
      product.addEventListener('mousemove', this.handleMouseMove.bind(this));
      product.addEventListener('mouseleave', this.handleMouseLeave.bind(this));

      // Add quantum effect to add to cart buttons
      const addToCartBtn = product.querySelector('.add-to-vault');
      if (addToCartBtn) {
        addToCartBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const productId = addToCartBtn.getAttribute('data-product-id');
          const variantId = addToCartBtn.getAttribute('data-variant-id');

          if (productId !== 'placeholder') {
            this.addToVault(productId, variantId);
          } else {
            this.simulateAddToVault(product);
          }
        });
      }
    });
  }

  /**
   *
   */
  handleMouseMove(e) {
    if (!this.isEnabled) return;

    const product = e.currentTarget;
    const rect = product.getBoundingClientRect();

    // Calculate mouse position relative to the product
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate the tilt amount, enhanced by dimensional depth
    const depthFactor = 1 + this.dimensionalDepth * 0.2;
    const tiltX = -((y / rect.height) * 10 - 5) * depthFactor;
    const tiltY = ((x / rect.width) * 10 - 5) * depthFactor;

    // Apply the transform with enhanced dimensionality
    product.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-10px) translateZ(${
      this.dimensionalDepth * 5
    }px)`;

    // Move the hologram effect based on cursor position
    const effect = product.querySelector('.hologram-effect');
    if (effect) {
      effect.style.opacity = '1';

      // Get profile-specific color
      const profileColor = this.getProfileColor(this.mutationProfile);

      // Apply enhanced gradient with profile color
      effect.style.background = `radial-gradient(circle at ${x}px ${y}px, ${profileColor.replace(
        ')',
        ', 0.4)'
      )}, transparent 70%)`;
    }

    // Update quantum glow
    const glow = product.querySelector('.quantum-glow');
    if (glow) {
      glow.style.transform = `translate(${(x / rect.width - 0.5) * 20}px, ${
        (y / rect.height - 0.5) * 20
      }px)`;
      glow.style.opacity = '0.7';
    }
  }

  /**
   *
   */
  handleMouseLeave(e) {
    if (!this.isEnabled) return;

    const product = e.currentTarget;

    // Enhanced reset transform with dimensional depth
    product.style.transform = `translateY(-10px) translateZ(${this.dimensionalDepth * 2}px)`;

    // Reset the hologram effect
    const effect = product.querySelector('.hologram-effect');
    if (effect) {
      effect.style.opacity = '0.5';

      // Use profile color for base state
      const profileColor = this.getProfileColor(this.mutationProfile);
      effect.style.background = `radial-gradient(circle at center, ${profileColor.replace(
        ')',
        ', 0.2)'
      )}, transparent 70%)`;
    }

    // Reset glow
    const glow = product.querySelector('.quantum-glow');
    if (glow) {
      glow.style.transform = 'translate(0, 0)';
      glow.style.opacity = '0.3';
    }
  }

  /**
   *
   */
  createQuantumGrid() {
    // Create floating particles for the quantum grid effect
    const quantumFeatured = document.querySelector('.quantum-featured');
    if (!quantumFeatured) return;

    const gridWrapper = document.createElement('div');
    gridWrapper.classList.add('quantum-grid-particles');
    gridWrapper.style.position = 'absolute';
    gridWrapper.style.top = '0';
    gridWrapper.style.left = '0';
    gridWrapper.style.width = '100%';
    gridWrapper.style.height = '100%';
    gridWrapper.style.overflow = 'hidden';
    gridWrapper.style.pointerEvents = 'none';
    gridWrapper.style.zIndex = '1';

    // Create particles with improved visual effects
    const particleCount = this.isEnabled ? 70 : 30; // Reduce for mobile

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('quantum-particle');

      // Enhanced particle styling
      particle.style.position = 'absolute';
      particle.style.width = `${Math.random() * 3 + 1}px`;
      particle.style.height = particle.style.width;

      // Get profile color and apply to particles
      const profileColor = this.getProfileColor(this.mutationProfile);
      particle.style.background = profileColor;

      particle.style.borderRadius = '50%';
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.filter = 'blur(1px)';
      particle.style.boxShadow = `0 0 10px ${profileColor}`;

      // Improved animation with randomized parameters
      const duration = Math.random() * 50 + 20;
      const delay = Math.random() * 10;

      particle.style.animation = `floatParticle ${duration}s ${delay}s infinite alternate ease-in-out`;
      particle.style.opacity = (Math.random() * 0.5 + 0.1).toString();

      // Add the particle to the grid
      gridWrapper.appendChild(particle);
    }

    // Add enhanced animation keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes floatParticle {
        0% {
          transform: translate3d(0, 0, 0) scale(1);
          opacity: var(--start-opacity, 0.3);
          filter: blur(1px);
        }
        50% {
          transform: translate3d(
            ${Math.random() * 50 - 25}px,
            ${Math.random() * 50 - 25}px,
            ${this.dimensionalDepth * 10}px
          ) scale(${Math.random() + 0.5});
          opacity: var(--mid-opacity, 0.7);
          filter: blur(0.5px);
        }
        100% {
          transform: translate3d(
            ${Math.random() * 100 - 50}px,
            ${Math.random() * 100 - 50}px,
            0
          ) scale(${Math.random() * 1.5 + 0.5});
          opacity: var(--end-opacity, 0.2);
          filter: blur(1.5px);
        }
      }

      @keyframes quantumPulse {
        0% { transform: scale(1); opacity: 0.7; }
        50% { transform: scale(1.2); opacity: 1; }
        100% { transform: scale(1); opacity: 0.7; }
      }

      .quantum-depth-indicator {
        position: absolute;
        bottom: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.7);
        color: var(--profile-color, rgba(0, 255, 255, 1));
        border: 1px solid var(--profile-color, rgba(0, 255, 255, 1));
        font-family: 'Courier New', monospace;
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 3px;
        z-index: 10;
        pointer-events: none;
      }

      .quantum-depth-indicator.pulse {
        animation: quantumPulse 0.5s ease-in-out;
      }

      .quantum-glow {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        opacity: 0.3;
        background: radial-gradient(
          circle at center,
          var(--profile-color, rgba(0, 255, 255, 0.7)) 0%,
          transparent 70%
        );
        transition: opacity 0.3s ease, transform 0.2s ease;
        z-index: 1;
      }

      .quantum-initialized {
        animation: initializeProduct 0.8s ease-out forwards;
      }

      @keyframes initializeProduct {
        0% { transform: translateY(20px); opacity: 0; }
        100% { transform: translateY(-10px); opacity: 1; }
      }

      .trauma-effect {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        mix-blend-mode: overlay;
        background: repeating-linear-gradient(
          45deg,
          transparent,
          transparent 10px,
          rgba(255, 0, 100, 0.1) 10px,
          rgba(255, 0, 100, 0.1) 20px
        );
        z-index: 5;
        opacity: 0;
        transition: opacity 0.5s ease;
      }

      .trauma-effect.active {
        opacity: var(--trauma-intensity, 0.5);
        animation: traumaFlicker 1s linear infinite;
      }

      @keyframes traumaFlicker {
        0% { opacity: var(--trauma-intensity, 0.5); }
        50% { opacity: calc(var(--trauma-intensity, 0.5) * 0.7); }
        51% { opacity: calc(var(--trauma-intensity, 0.5) * 1.5); }
        52% { opacity: var(--trauma-intensity, 0.5); }
        100% { opacity: var(--trauma-intensity, 0.5); }
      }
    `;
    document.head.appendChild(style);

    // Add the grid to the section
    quantumFeatured.appendChild(gridWrapper);

    // Start animation loop
    this.startAnimationLoop();
  }

  /**
   * Handle quantum mutation events
   * @param {Object} data - Mutation data
   */
  handleQuantumMutation(data) {
    if (!data || !data.profile) return;

    // Update internal state
    this.mutationProfile = data.profile;

    // Apply to all products
    this.products.forEach((product) => {
      this.applyMutationProfile(product, data.profile);
    });

    // Trigger glitch effect
    this.triggerGlitchEffect(0.7, 600);

    // Publish event to console
    console.log(`Quantum mutation applied: ${data.profile}`);

    // Create a notification if appropriate
    this.showMutationNotification(data.profile);
  }

  /**
   * Display a mutation notification
   */
  showMutationNotification(profile) {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.quantum-notification');

    if (!notification) {
      notification = document.createElement('div');
      notification.classList.add('quantum-notification');
      document.body.appendChild(notification);

      // Add styles for notification
      const style = document.createElement('style');
      style.textContent = `
        .quantum-notification {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.8);
          color: var(--profile-color, #00ffff);
          border: 1px solid var(--profile-color, #00ffff);
          padding: 10px 15px;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          border-radius: 4px;
          z-index: 1000;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.3s ease, transform 0.3s ease;
          max-width: 300px;
        }

        .quantum-notification.active {
          opacity: 1;
          transform: translateY(0);
        }
      `;
      document.head.appendChild(style);
    }

    // Set content and show
    notification.innerHTML = `
      <div>Mutation Detected</div>
      <div style="font-size:16px;margin:5px 0;">${profile}</div>
      <div style="font-size:12px;opacity:0.7;">Quantum state stabilized</div>
    `;

    // Set profile-specific color
    notification.style.setProperty('--profile-color', this.getProfileColor(profile));

    // Show and auto-hide
    notification.classList.add('active');

    setTimeout(() => {
      notification.classList.remove('active');
    }, 4000);
  }

  /**
   * Apply mutation profile to a product
   * @param {HTMLElement} product - Product element
   * @param {string} profile - Mutation profile name
   */
  applyMutationProfile(product, profile) {
    // Update data attribute
    product.setAttribute('data-mutation-profile', profile);

    // Get profile color
    const profileColor = this.getProfileColor(profile);

    // Apply profile-specific CSS variables
    product.style.setProperty('--profile-color', profileColor);

    // Update effect elements
    const effect = product.querySelector('.hologram-effect');
    if (effect) {
      effect.style.background = `radial-gradient(circle at center, ${profileColor.replace(
        ')',
        ', 0.2)'
      )}, transparent 70%)`;
    }

    // Update quantum glow
    const glow = product.querySelector('.quantum-glow');
    if (glow) {
      glow.style.background = `radial-gradient(circle at center, ${profileColor.replace(
        ')',
        ', 0.3)'
      )}, transparent 70%)`;
    }

    // Update particles
    this.updateParticleColors(profile);
  }

  /**
   * Get color for a specific mutation profile
   * @param {string} profile - Mutation profile name
   * @returns {string} - Color in rgba format
   */
  getProfileColor(profile) {
    switch (profile) {
    case 'CyberLotus':
      return 'rgba(0, 255, 255, 1)'; // Cyan
    case 'ObsidianBloom':
      return 'rgba(255, 0, 255, 1)'; // Magenta
    case 'VoidBloom':
      return 'rgba(153, 0, 255, 1)'; // Purple
    case 'NeonVortex':
      return 'rgba(0, 255, 102, 1)'; // Neon green
    default:
      return 'rgba(0, 255, 255, 1)'; // Default cyan
    }
  }

  /**
   * Update particle colors based on mutation profile
   * @param {string} profile - Mutation profile
   */
  updateParticleColors(profile) {
    const profileColor = this.getProfileColor(profile);
    const particles = document.querySelectorAll('.quantum-particle');

    particles.forEach((particle) => {
      // Transition effect
      particle.style.transition = 'background-color 1s ease, box-shadow 1s ease';

      // Apply new color
      particle.style.backgroundColor = profileColor;
      particle.style.boxShadow = `0 0 10px ${profileColor}`;
    });
  }

  /**
   * Process trauma codes
   * @param {Array} codes - Trauma codes
   */
  processTraumaCodes(codes) {
    if (!this.traumaCodesEnabled || !Array.isArray(codes) || codes.length === 0) return;

    this.traumaCodes = codes;

    // Calculate trauma intensity based on number of codes
    const intensity = Math.min(0.9, codes.length * 0.15);

    this.products.forEach((product) => {
      // Find or create trauma effect element
      let traumaEffect = product.querySelector('.trauma-effect');

      if (!traumaEffect) {
        traumaEffect = document.createElement('div');
        traumaEffect.classList.add('trauma-effect');
        product.appendChild(traumaEffect);
      }

      // Set intensity and activate
      traumaEffect.style.setProperty('--trauma-intensity', intensity);
      traumaEffect.classList.add('active');

      // Apply strong glitch effect
      if (intensity > 0.5) {
        this.triggerGlitchEffect(intensity, 800);
      }

      // Remove after delay
      setTimeout(() => {
        traumaEffect.classList.remove('active');
      }, 5000);
    });

    // Log trauma codes for debugging
    console.log(`Processed ${codes.length} trauma codes with intensity ${intensity}`);
  }

  /**
   * Set dimensional depth
   * @param {number|Object} depth - Depth level or event object with depth property
   */
  setDimensionalDepth(depth) {
    // Handle both direct number or event object
    const depthValue = typeof depth === 'object' ? depth.depth : depth;

    // Validate
    if (typeof depthValue !== 'number') return;

    // Update internal state
    this.dimensionalDepth = Math.max(0, Math.min(5, depthValue)); // Clamp to 0-5

    // Update visual depth indicators
    const depthIndicators = document.querySelectorAll('.quantum-depth-indicator');
    depthIndicators.forEach((indicator) => {
      indicator.querySelector('span').textContent = `◆${this.dimensionalDepth}`;
      indicator.classList.add('pulse');

      setTimeout(() => {
        indicator.classList.remove('pulse');
      }, 500);
    });

    // Add depth effect to all products
    this.products.forEach((product) => {
      // Enhanced transform with depth
      if (this.isEnabled) {
        product.style.transform = `translateY(-10px) translateZ(${this.dimensionalDepth * 2}px)`;
      }
    });

    // Publish notification if significant change
    if (depthValue >= 3) {
      this.triggerGlitchEffect(0.5 + depthValue * 0.1, 700);
    }

    console.log(`Dimensional depth shifted to ${this.dimensionalDepth}`);
  }

  /**
   * Trigger a glitch visual effect
   * @param {number} intensity - Effect intensity (0-1)
   * @param {number} duration - Effect duration in ms
   */
  triggerGlitchEffect(intensity = 0.5, duration = 300) {
    // Publish to Neural Bus if connected
    if (this.neuralBusConnected) {
      NeuralBus.publish('glitch:trigger', {
        intensity: intensity,
        duration: duration,
        mode: 'rgb-shift',
        source: 'quantum-hologram',
      });
    }

    // Apply basic CSS glitch effect as fallback
    this.products.forEach((product) => {
      product.classList.add('glitch-active');
      product.style.setProperty('--glitch-intensity', intensity);

      setTimeout(() => {
        product.classList.remove('glitch-active');
      }, duration);
    });
  }

  /**
   * Handle cart item added event
   * @param {Object} data - Cart event data
   */
  handleCartItemAdded(data) {
    if (!data || !data.item) return;

    // Pulse cart icon
    this.pulseCartIcon();

    // Trigger quantum mutation
    if (this.neuralBusConnected) {
      const profiles = ['CyberLotus', 'ObsidianBloom', 'VoidBloom', 'NeonVortex'];
      const randomProfile = profiles[Math.floor(Math.random() * profiles.length)];

      // Only trigger mutation sometimes to avoid too frequent changes
      if (Math.random() > 0.7) {
        NeuralBus.publish('quantum:mutation', {
          source: 'quantum-hologram',
          profile: randomProfile,
          action: 'cart-add',
          timestamp: Date.now(),
        });
      }
    }
  }

  /**
   *
   */
  addToVault(productId, variantId) {
    // Check if enhanced cart is available
    if (typeof window.enhancedCart !== 'undefined') {
      window.enhancedCart.addItemWithQuantumEffect(variantId, 1);
    } else {
      // Fallback to standard cart API
      fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: variantId,
          quantity: 1,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          this.pulseCartIcon();

          // Trigger glitch effect
          this.triggerGlitchEffect(0.7, 800);

          // Try to update cart drawer if available
          if (typeof window.updateCartDrawer === 'function') {
            window.updateCartDrawer();
          }

          // Publish to Neural Bus if connected
          if (this.neuralBusConnected) {
            NeuralBus.publish('cart:item:added', {
              item: {
                product_id: productId,
                variant_id: variantId,
                quantity: 1,
              },
              source: 'quantum-hologram',
              timestamp: Date.now(),
            });
          }
        })
        .catch((error) => console.error('Error adding to cart:', error));
    }
  }

  /**
   *
   */
  simulateAddToVault(product) {
    // Create a clone of the product image for the animation
    const imageContainer = product.querySelector('.hologram-image');
    if (!imageContainer) return;

    const clone = imageContainer.cloneNode(true);
    clone.style.position = 'absolute';
    clone.style.top = `${imageContainer.offsetTop}px`;
    clone.style.left = `${imageContainer.offsetLeft}px`;
    clone.style.width = `${imageContainer.offsetWidth}px`;
    clone.style.height = `${imageContainer.offsetHeight}px`;
    clone.style.zIndex = '1000';
    clone.style.transition = 'all 0.8s cubic-bezier(0.17, 0.84, 0.44, 1)';
    clone.style.opacity = '1';

    // Add the clone to the document
    document.body.appendChild(clone);

    // Get the cart icon position
    const cartIcon = document.querySelector('.cart-icon');
    if (!cartIcon) {
      document.body.removeChild(clone);
      return;
    }

    const cartRect = cartIcon.getBoundingClientRect();

    // Animate the clone to the cart icon
    setTimeout(() => {
      clone.style.top = `${cartRect.top}px`;
      clone.style.left = `${cartRect.left}px`;
      clone.style.width = '20px';
      clone.style.height = '20px';
      clone.style.opacity = '0';
      clone.style.transform = 'scale(0.3)';

      // Add glitch effect to cart icon
      this.triggerGlitchEffect(0.5, 600);

      // Remove the clone after animation
      setTimeout(() => {
        document.body.removeChild(clone);
        this.pulseCartIcon();
      }, 800);
    }, 10);
  }

  /**
   *
   */
  pulseCartIcon() {
    const cartIcon = document.querySelector('.cart-icon');
    if (!cartIcon) return;

    // Enhanced quantum pulse effect
    cartIcon.classList.add('quantum-pulse');
    cartIcon.style.setProperty('--pulse-color', this.getProfileColor(this.mutationProfile));

    // Apply glitch effect
    this.triggerGlitchEffect(0.3, 500);

    setTimeout(() => {
      cartIcon.classList.remove('quantum-pulse');
    }, 1000);
  }

  /**
   * Destroy the component and clean up
   */
  destroy() {
    // Cancel animation frame if running
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    // Disconnect from Neural Bus
    this.disconnectFromNeuralBus();

    // Remove event listeners
    this.products.forEach((product) => {
      product.removeEventListener('mousemove', this.handleMouseMove.bind(this));
      product.removeEventListener('mouseleave', this.handleMouseLeave.bind(this));

      // Reset styles
      product.style.transform = '';
      product.removeAttribute('data-mutation-profile');
    });

    // Reset state
    this.initialized = false;
    this.rendererRegistry.clear();

    console.log('QuantumHologram destroyed');
  }
}

// Initialize the quantum hologram when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const quantumHologram = new QuantumHologram();

  // Make it globally accessible for debugging and extension
  window.quantumHologram = quantumHologram;
});

// Export for module use
export { QuantumHologram };
