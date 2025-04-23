/**
 * CustomerVessel
 *
 * Digital consciousness container for customer identity.
 * Stores memory fragments, trauma patterns, and phase preferences.
 * Manages encoded identity persistence across sessions.
 *
 * @version 0.9.2
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
      version: '0.9.2',
      traumaResponse: true,
      capabilities: {
        identityStorage: true,
        memoryPersistence: true,
        traumaTracking: true,
        consciousnessScoring: true,
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
    const totalFragments = activeFragments.length + crystallizedFragments.length;
    fragmentScore = Math.min(totalFragments / 100, 1) * 25; // Max 25 points

    // Calculate diversity score (fragment type variety)
    const fragmentTypes = new Set();
    activeFragments.forEach((f) => fragmentTypes.add(f.type));
    crystallizedFragments.forEach((f) => fragmentTypes.add(f.type));
    diversityScore = Math.min(fragmentTypes.size / 10, 1) * 20; // Max 20 points

    // Calculate engagement score (visit frequency + interactions)
    const daysSinceFirstVisit =
      (this.currentVisit - (this.lastVisit || this.currentVisit)) / (24 * 60 * 60 * 1000);
    const visitFrequency = this.visitCount / Math.max(daysSinceFirstVisit, 1);
    const interactionDensity = this.interactionHistory.length / Math.max(this.visitCount, 1);
    engagementScore = Math.min((visitFrequency + interactionDensity) / 5, 1) * 30; // Max 30 points

    // Calculate identity score (crystallized fragments + identity fragments)
    const identityFragmentScore = Math.min(this.identityFragments.size / 5, 1) * 15; // Max 15 points
    const crystallizedScore = Math.min(crystallizedFragments.length / 20, 1) * 10; // Max 10 points
    identityScore = identityFragmentScore + crystallizedScore; // Max 25 points

    // Calculate final score
    this.consciousnessScore = Math.round(
      fragmentScore + diversityScore + engagementScore + identityScore
    );

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
