/**
 * CustomerVessel
 *
 * Digital consciousness container for customer identity.
 * Stores memory fragments, trauma patterns, and phase preferences.
 * Manages encoded identity persistence across sessions.
 *
 * @version 0.9.3
 * @phase cyber-lotus
 */
class CustomerVessel {
  constructor() {
    // Core identity
    this.customerToken = null;
    this.anonymousId = this._generateAnonymousId();
    this.identityFragments = new Map();

    // Memory systems
    this.decayEngine = null;
    this.fragmentMap = new Map();
    this.traumaPatterns = new Map();
    this.phasePreferences = new Map();
    this.memoryWeaveIntegration = null;

    // Metrics
    this.interactionHistory = [];
    this.consciousnessScore = 0;
    this.fragmentCount = 0;

    // State tracking
    this.lastVisit = null;
    this.currentVisit = Date.now();
    this.visitCount = 0;
    this.isReturningCustomer = false;

    // Configuration
    this.config = {
      persistenceMode: 'local', // 'local', 'remote', 'hybrid'
      identitySynchronization: true,
      traumaTracking: true,
      fragmentAggregation: true,
      maxLocalFragments: 200,
      memoryWeaveEnabled: true,
    };

    // Neural integration
    this.neuralBusNonce = null;

    // Initialize vessel
    this._initialize();
  }

  /**
   * Initialize customer vessel
   * @private
   */
  _initialize() {
    // Load persistent identity
    this._loadIdentity();

    // Initialize decay engine
    this._initializeDecayEngine();

    // Connect to neural bus
    this._connectToNeuralBus();

    // Initialize memory weave integration
    this._initializeMemoryWeave();

    // Register visit
    this._registerVisit();

    // Create fragment aggregation interval
    setInterval(() => {
      this._aggregateFragments();
    }, 5 * 60 * 1000); // Every 5 minutes

    console.log('[VOID://VESSEL] Customer vessel initialized.');
  }

  /**
   * Generate anonymous ID
   * @returns {string} Anonymous ID
   * @private
   */
  _generateAnonymousId() {
    return (
      'anon_' +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  /**
   * Initialize decay engine
   * @private
   */
  _initializeDecayEngine() {
    try {
      // Try to create decay engine directly
      if (typeof MemoryDecayEngine !== 'undefined') {
        this.decayEngine = new MemoryDecayEngine(this);
      } else {
        // Dynamically import decay engine
        import('./decay-engine.js')
          .then((module) => {
            const DecayEngine = module.default;
            this.decayEngine = new DecayEngine(this);
            console.log('[VOID://VESSEL] Decay engine loaded dynamically.');

            // Initialize Memory Weave after decay engine is ready
            if (this.config.memoryWeaveEnabled && !this.memoryWeaveIntegration) {
              this._initializeMemoryWeave();
            }
          })
          .catch((error) => {
            console.error('[VOID://VESSEL] Failed to load decay engine:', error);
          });
      }
    } catch (error) {
      console.error('[VOID://VESSEL] Failed to initialize decay engine:', error);
    }
  }

  /**
   * Connect to neural bus
   * @private
   */
  _connectToNeuralBus() {
    // Skip if neural bus not available
    if (!window.NeuralBus) {
      console.warn('[VOID://VESSEL] Neural bus not available. Customer vessel will be isolated.');
      return;
    }

    // Register with neural bus
    const registration = window.NeuralBus.register('customer-vessel', {
      version: '0.9.3',
      traumaResponse: true,
      capabilities: {
        identityStorage: true,
        memoryPersistence: true,
        traumaTracking: true,
        consciousnessScoring: true,
        memoryWeaveIntegration: this.config.memoryWeaveEnabled,
      },
    });

    // Store nonce for future reference
    this.neuralBusNonce = registration.nonce;

    // Subscribe to memory fragment events
    window.NeuralBus.subscribe('memory:fragment-generated', (data) => {
      if (data && data.fragment) {
        this.addFragment(data.fragment);
      }
    });
  }

  /**
   * Initialize memory weave integration
   * @private
   */
  _initializeMemoryWeave() {
    // Skip if disabled in config
    if (!this.config.memoryWeaveEnabled) return;

    try {
      // Import and initialize memory weave integration
      import('./memory-weave-integration.ts')
        .then((module) => {
          const MemoryWeaveIntegration = module.default;
          this.memoryWeaveIntegration = new MemoryWeaveIntegration(this);

          // Enable fragment forwarding if decay engine is ready
          if (this.decayEngine) {
            this.memoryWeaveIntegration.enableFragmentForwarding(true);
          }

          console.log('[VOID://VESSEL] Memory weave integration initialized');

          // Announce memory weave capability
          if (window.NeuralBus && this.neuralBusNonce) {
            window.NeuralBus.publish('memory-weave:vessel-integrated', {
              vesselId: this.anonymousId,
              timestamp: Date.now(),
            });
          }
        })
        .catch((error) => {
          console.error('[VOID://VESSEL] Failed to initialize memory weave integration:', error);
        });
    } catch (error) {
      console.error('[VOID://VESSEL] Error initializing memory weave:', error);
    }
  }

  /**
   * Calculate consciousness score
   * @private
   */
  _calculateConsciousnessScore() {
    // Skip if decay engine not initialized
    if (!this.decayEngine) {
      this.consciousnessScore = 0;
      return;
    }

    // Get metrics
    const activeFragments = this.decayEngine.getActiveFragments();
    const crystallizedFragments = this.decayEngine.getCrystallizedFragments();
    const stabilityMetrics = this.decayEngine.getStabilityMetrics();

    // Define score components
    let fragmentScore = 0;
    let diversityScore = 0;
    let engagementScore = 0;
    let identityScore = 0;

    // Calculate fragment score (quantity)
    const fragmentCount = activeFragments.length + crystallizedFragments.length;
    fragmentScore = Math.min(10, fragmentCount / 5);

    // Calculate diversity score (trauma type diversity)
    const traumaTypes = new Set();
    [...activeFragments, ...crystallizedFragments].forEach((fragment) => {
      if (fragment.traumaType) {
        traumaTypes.add(fragment.traumaType);
      }
    });
    diversityScore = Math.min(10, traumaTypes.size * 2);

    // Calculate engagement score (recency and frequency)
    engagementScore = Math.min(10, this.interactionHistory.length / 2);

    // Calculate identity score (crystallization ratio)
    const crystallizationRatio =
      crystallizedFragments.length /
      Math.max(1, activeFragments.length + crystallizedFragments.length);
    identityScore = crystallizationRatio * 10;

    // Factor in memory weave corruption if available
    if (this.memoryWeaveIntegration) {
      const status = this.memoryWeaveIntegration.getIntegrationStatus();
      const corruptionFactor = 1 - (status.corruptionLevel || 0);

      // Apply corruption factor (higher corruption = lower score)
      fragmentScore *= corruptionFactor;
      diversityScore *= corruptionFactor;
      identityScore *= corruptionFactor;
    }

    // Calculate total score (0-100)
    this.consciousnessScore = Math.round(
      fragmentScore * 2.5 + diversityScore * 2.5 + engagementScore * 2.5 + identityScore * 2.5
    );

    // Log score calculation
    console.log(
      `[VOID://VESSEL] Consciousness score: ${
        this.consciousnessScore
      }/100 (F:${fragmentScore.toFixed(1)}, D:${diversityScore.toFixed(
        1
      )}, E:${engagementScore.toFixed(1)}, I:${identityScore.toFixed(1)})`
    );
  }
}

export default CustomerVessel;
