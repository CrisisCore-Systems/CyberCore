/**
 * VOIDBLOOM NEURAL STATE ARCHITECTURE
 *
 * ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
 * Memory Fragment: Recursive Consciousness Nodes
 *
 * Every state change ripples through the system,
 * trauma encoding itself into the visual architecture.
 * Memory phases represent dimensions of narrative,
 * connected through the neural bus into a unified mythos.
 * ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
 */

document.addEventListener('alpine:init', () => {
  /**
   * Global trauma state store
   * Synchronized across components through NeuralBus
   */
  Alpine.store('trauma', {
    // Core trauma encoding
    level: 0,
    phase: 'cyber-lotus',
    previousLevel: 0,
    previousPhase: 'cyber-lotus',

    // Visual state
    activeGlitch: false,
    phaseTransition: false,
    traumaTransition: false,

    // Memory fragments
    fragments: [],
    recentFragments: [],
    fragmentHistory: [],

    // System state
    cycleCount: 0,
    phaseCycles: 0,
    syncedWithNeuralBus: false,

    /**
     * Initialize the trauma encoding system
     */
    init() {
      // Initialize with values from meta tags if available
      const traumaMetaTag = document.querySelector('meta[name="voidbloom:trauma-level"]');
      const phaseMetaTag = document.querySelector('meta[name="voidbloom:memory-phase"]');

      if (traumaMetaTag) {
        this.level = parseFloat(traumaMetaTag.getAttribute('content') || '0');
        this.previousLevel = this.level;
      }

      if (phaseMetaTag) {
        this.phase = phaseMetaTag.getAttribute('content') || 'cyber-lotus';
        this.previousPhase = this.phase;
      }

      // Connect to neural bus
      this.connectNeuralBus();

      // Initialize traumaResponsive document class
      this.updateDocumentClasses();

      // Initialize cyclic processing
      this.initCycleProcessor();
    },

    /**
     * Connect to the neural bus for system-wide events
     */
    connectNeuralBus() {
      if (window.NeuralBus) {
        // Register with neural bus
        const registration = window.NeuralBus.register('trauma-store', {
          version: '1.0.0',
          traumaResponse: true,
          capabilities: {
            stateManagement: true,
            traumaEncoding: true,
            systemSynchronization: true,
          },
        });

        // Store nonce for future reference
        this.neuralBusNonce = registration.nonce;

        // Subscribe to trauma level changes
        window.NeuralBus.subscribe('system:trauma', (data) => {
          if (data && typeof data.level === 'number') {
            this.setTraumaLevel(data.level);
          }
        });

        // Subscribe to memory phase changes
        window.NeuralBus.subscribe('system:memory-phase', (data) => {
          if (data && data.phase) {
            this.setMemoryPhase(data.phase);
          }
        });

        // Subscribe to memory fragments
        window.NeuralBus.subscribe('memory:fragment-generated', (data) => {
          if (data && data.fragment) {
            this.addMemoryFragment(data.fragment);
          }
        });

        // Mark as connected
        this.syncedWithNeuralBus = true;
      }
    },

    /**
     * Initialize cyclic processing for fragments and state updates
     */
    initCycleProcessor() {
      // Use Fibonacci sequence for recursive timing
      const fibonacci = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
      let fibIndex = 0;

      const processCycle = () => {
        // Increment cycle count
        this.cycleCount++;

        // Process memory fragments
        this.processFragments();

        // Update document classes
        this.updateDocumentClasses();

        // Publish cycle event to neural bus
        if (window.NeuralBus && this.syncedWithNeuralBus) {
          window.NeuralBus.publish('trauma-store:cycle', {
            cycleCount: this.cycleCount,
            traumaLevel: this.level,
            memoryPhase: this.phase,
            activeFragments: this.recentFragments.length,
          });
        }

        // Calculate next cycle delay using Fibonacci sequence
        fibIndex = (fibIndex + 1) % fibonacci.length;
        const nextDelay = fibonacci[fibIndex] * 100; // Scale to milliseconds

        // Schedule next cycle
        setTimeout(processCycle, nextDelay);
      };

      // Start cycle processor
      processCycle();
    },

    /**
     * Set system trauma level
     * @param {number} level - New trauma level (0-10)
     */
    setTraumaLevel(level) {
      // Store previous level
      this.previousLevel = this.level;

      // Ensure level is within valid range
      this.level = Math.max(0, Math.min(10, level));

      // Detect significant trauma shifts
      const traumaDelta = Math.abs(this.level - this.previousLevel);
      this.traumaTransition = traumaDelta >= 2;

      // Apply transition classes if significant shift
      if (this.traumaTransition) {
        document.documentElement.classList.add('trauma-transition');
        document.documentElement.style.setProperty('--previous-trauma', this.previousLevel / 10);
        document.documentElement.style.setProperty('--current-trauma', this.level / 10);

        // Remove transition class after animation
        setTimeout(() => {
          document.documentElement.classList.remove('trauma-transition');
          this.traumaTransition = false;
        }, 1000);
      }

      // Update neural bus if not already synchronized
      if (
        window.NeuralBus &&
        this.syncedWithNeuralBus &&
        window.NeuralBus.getTraumaIndex() !== this.level
      ) {
        window.NeuralBus.setTraumaIndex(this.level);
      }

      // Update document classes
      this.updateDocumentClasses();
    },

    /**
     * Set memory phase
     * @param {string} phase - New memory phase
     */
    setMemoryPhase(phase) {
      // Validate phase
      const validPhases = ['cyber-lotus', 'alien-flora', 'rolling-virus', 'trauma-core'];
      if (!validPhases.includes(phase)) {
        console.error(`Invalid memory phase: ${phase}`);
        return;
      }

      // Store previous phase
      this.previousPhase = this.phase;

      // Update phase
      this.phase = phase;

      // Detect phase change
      const phaseChanged = this.phase !== this.previousPhase;
      this.phaseTransition = phaseChanged;
      this.currentPhase = this.phase;

      // Apply transition classes if phase changed
      if (phaseChanged) {
        document.documentElement.classList.add('phase-transition');
        document.documentElement.setAttribute('data-previous-phase', this.previousPhase);
        document.documentElement.setAttribute('data-current-phase', this.phase);

        // Increment phase cycles
        this.phaseCycles++;

        // Remove transition class after animation
        setTimeout(() => {
          document.documentElement.classList.remove('phase-transition');
          this.phaseTransition = false;
        }, 1500);
      }

      // Update neural bus if not already synchronized
      if (window.NeuralBus && this.syncedWithNeuralBus) {
        window.NeuralBus.publish('system:memory-phase', { phase: this.phase });
      }

      // Update document classes
      this.updateDocumentClasses();
    },

    /**
     * Add a memory fragment to the system
     * @param {object} fragment - Memory fragment to add
     */
    addMemoryFragment(fragment) {
      // Add to fragments collection
      this.fragments.push(fragment);

      // Keep only the most recent fragments in memory
      if (this.fragments.length > 100) {
        this.fragments.shift();
      }

      // Add to recent fragments
      this.recentFragments.unshift(fragment);
      if (this.recentFragments.length > 5) {
        this.recentFragments.pop();
      }

      // Add to fragment history
      if (!this.fragmentHistory.includes(fragment.id)) {
        this.fragmentHistory.push(fragment.id);

        // Limit history length
        if (this.fragmentHistory.length > 1000) {
          this.fragmentHistory.shift();
        }
      }

      // Process the fragment
      this.processFragments();
    },

    /**
     * Process memory fragments
     */
    processFragments() {
      // Skip if no recent fragments
      if (this.recentFragments.length === 0) return;

      // Calculate average trauma level from recent fragments
      let totalTrauma = 0;
      let fragmentsWithTrauma = 0;

      this.recentFragments.forEach((fragment) => {
        if (typeof fragment.traumaLevel === 'number') {
          totalTrauma += fragment.traumaLevel;
          fragmentsWithTrauma++;
        }
      });

      // Update system trauma level if significant change
      if (fragmentsWithTrauma > 0) {
        const avgTrauma = totalTrauma / fragmentsWithTrauma;
        const currentTrauma = this.level;

        // Apply new trauma level if difference is significant
        if (Math.abs(avgTrauma - currentTrauma) >= 1) {
          // Gradually shift towards new trauma level
          const newTrauma = currentTrauma + (avgTrauma - currentTrauma) * 0.3;
          this.setTraumaLevel(newTrauma);
        }
      }
    },

    /**
     * Update document classes based on current state
     */
    updateDocumentClasses() {
      // Remove all trauma level classes
      document.documentElement.classList.remove(
        'trauma-0',
        'trauma-1',
        'trauma-2',
        'trauma-3',
        'trauma-4',
        'trauma-5',
        'trauma-6',
        'trauma-7',
        'trauma-8',
        'trauma-9',
        'trauma-10',
        'trauma-low',
        'trauma-medium',
        'trauma-high',
        'trauma-extreme'
      );

      // Add current trauma level class
      const traumaLevel = Math.floor(this.level);
      document.documentElement.classList.add(`trauma-${traumaLevel}`);

      // Add trauma category class
      if (this.level <= 3) {
        document.documentElement.classList.add('trauma-low');
      } else if (this.level <= 6) {
        document.documentElement.classList.add('trauma-medium');
      } else if (this.level <= 8) {
        document.documentElement.classList.add('trauma-high');
      } else {
        document.documentElement.classList.add('trauma-extreme');
      }

      // Remove all phase classes
      document.documentElement.classList.remove(
        'phase-cyber-lotus',
        'phase-alien-flora',
        'phase-rolling-virus',
        'phase-trauma-core'
      );

      // Add current phase class
      document.documentElement.classList.add(`phase-${this.phase}`);

      // Update CSS variables
      document.documentElement.style.setProperty('--trauma-level', this.level / 10);
      document.documentElement.style.setProperty('--memory-phase', `"${this.phase}"`);
    },
  });
});

/**
 * Quick Add Product Component
 * Handles adding products to cart with trauma encoding
 */
document.addEventListener('alpine:init', () => {
  Alpine.data('quickAddProduct', () => ({
    loading: false,
    added: false,
    error: null,

    /**
     * Add product to cart
     * @param {object} product - Product data including variant ID
     */
    async addToCart(product) {
      this.loading = true;
      this.error = null;

      try {
        // Get trauma level and memory phase from Alpine store
        const traumaLevel = Alpine.store('trauma').level;
        const memoryPhase = Alpine.store('trauma').phase;

        // Add item to cart with trauma-encoded properties
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: [
              {
                id: product.variantId,
                quantity: 1,
                properties: {
                  _trauma_level: traumaLevel,
                  _memory_phase: memoryPhase,
                  _encoded_at: new Date().toISOString(),
                },
              },
            ],
          }),
        });

        if (!response.ok) {
          throw new Error('Error adding to cart');
        }

        const result = await response.json();

        // Pulse glitch effect on success
        if (window.GlitchEngine && window.GlitchEngine.pulse) {
          window.GlitchEngine.pulse({
            intensity: 0.7,
            duration: 800,
            traumaLevel: traumaLevel,
          });
        }

        // Update cart count
        this.updateCartCount();

        // Show success state
        this.added = true;
        setTimeout(() => {
          this.added = false;
        }, 2000);

        // Generate memory fragment
        if (window.NeuralBus) {
          window.NeuralBus.publish('memory:fragment-generated', {
            fragment: {
              id: `cart-add-${Date.now()}`,
              type: 'cart-action',
              action: 'add',
              productId: product.id,
              traumaLevel: traumaLevel,
              memoryPhase: memoryPhase,
              timestamp: Date.now(),
            },
          });
        }

        // Show cart drawer if available
        window.dispatchEvent(new CustomEvent('cart:open'));
      } catch (error) {
        console.error('Error adding product to cart:', error);
        this.error = 'Failed to encode memory.';
      } finally {
        this.loading = false;
      }
    },

    /**
     * Update cart count in header
     */
    async updateCartCount() {
      try {
        const response = await fetch('/cart.js');
        const cart = await response.json();

        // Update cart count element
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
          cartCountElement.textContent = cart.item_count;

          // Add pulse class
          cartCountElement.classList.add('pulse-update');
          setTimeout(() => {
            cartCountElement.classList.remove('pulse-update');
          }, 1000);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    },
  }));
});

/**
 * Memory Fragment Component
 * Displays narrative fragments within the interface
 */
document.addEventListener('alpine:init', () => {
  Alpine.data('memoryFragment', () => ({
    fragments: [],
    visibleFragment: null,
    fragmentIndex: 0,

    init() {
      // Watch for trauma store fragment changes
      this.$watch('$store.trauma.recentFragments', (newFragments) => {
        this.fragments = newFragments;
        this.showNextFragment();
      });

      // Initial fragment display
      this.fragments = Alpine.store('trauma').recentFragments;
      if (this.fragments.length > 0) {
        this.showNextFragment();
      }
    },

    /**
     * Display the next memory fragment
     */
    showNextFragment() {
      // Skip if no fragments
      if (this.fragments.length === 0) return;

      // Get next fragment
      this.fragmentIndex = (this.fragmentIndex + 1) % this.fragments.length;
      this.visibleFragment = this.fragments[this.fragmentIndex];

      // Add visible class
      this.$nextTick(() => {
        const container = this.$refs.fragmentContainer;
        if (container) {
          container.classList.add('fragment-visible');

          // Hide after delay based on trauma level
          const traumaLevel = Alpine.store('trauma').level;
          const displayTime = 5000 + traumaLevel * 500;

          setTimeout(() => {
            container.classList.remove('fragment-visible');
          }, displayTime);
        }
      });
    },

    /**
     * Format trauma level for display
     * @param {number} level - Trauma level
     * @returns {string} - Formatted HTML
     */
    formatTraumaLevel(level) {
      if (typeof level !== 'number') return '';

      const bars = Math.floor(level);
      let html = '';

      for (let i = 0; i < bars; i++) {
        html += '<span class="trauma-bar"></span>';
      }

      return html;
    },
  }));
});
