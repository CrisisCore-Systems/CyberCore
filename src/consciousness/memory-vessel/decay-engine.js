/**
 * MemoryDecayEngine
 *
 * Nothing persists eternally in consciousness.
 * All trauma fades, transforms, or crystallizes.
 * This engine prevents cognitive overload through
 * calculated entropy and strategic forgetting.
 *
 * @version 0.9.3
 * @phase cyber-lotus
 */
class MemoryDecayEngine {
  constructor(customerVessel) {
    // Core vessel connection
    this.vessel = customerVessel;

    // Decay systems
    this.decayVectors = new Map();
    this.crystallizationThresholds = new Map();
    this.compressionPatterns = new Map();
    this.entropyFactors = new Map();

    // Temporal bindings
    this.fibonacci = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987];
    this.temporalBindings = [];
    this.lastDecayCycle = Date.now();
    this.cycleInterval = 60000; // 1 minute between decay cycles

    // Fragment storage
    this.activeFragments = new Map();
    this.crystallizedFragments = new Map();
    this.compressedArchive = new Map();

    // Stability metrics
    this.fragmentCount = 0;
    this.decayRate = 0.05; // Base decay rate (5% per cycle)
    this.stabilityIndex = 1.0;
    this.overflowThreshold = 500; // Max fragments before forced decay

    // Configuration
    this.config = {
      decayTiming: 'fibonacci', // 'fibonacci', 'linear', 'exponential'
      compressionEnabled: true,
      crystallizationEnabled: true,
      traumaWeighting: true,
      minFragmentLifetime: 5 * 60 * 1000, // 5 minutes
      maxFragmentLifetime: 30 * 24 * 60 * 60 * 1000, // 30 days
      significanceThreshold: 0.7, // Min significance to crystallize (0-1)
    };

    // Neural integration
    this.neuralBusNonce = null;

    // Initialize engine
    this._initialize();
  }

  /**
   * Initialize decay engine
   * @private
   */
  _initialize() {
    // Set up decay vectors for different fragment types
    this._initializeDecayVectors();

    // Set up crystallization thresholds
    this._initializeCrystallizationThresholds();

    // Connect to neural bus
    this._connectToNeuralBus();

    // Start decay cycle
    this._startDecayCycle();

    console.log('[VOID://DECAY] Memory decay engine initialized.');
  }

  /**
   * Initialize decay vectors for different fragment types
   * @private
   */
  _initializeDecayVectors() {
    // Standard fragment types
    this.decayVectors.set('product_view', {
      baseDecayRate: 0.08,
      traumaModifier: 0.6, // Higher trauma = slower decay
      phaseModifiers: {
        'cyber-lotus': 1.0,
        'alien-flora': 0.9,
        'rolling-virus': 1.2,
        'trauma-core': 0.7,
      },
    });

    // Default for unknown types
    this.decayVectors.set('default', {
      baseDecayRate: 0.1,
      traumaModifier: 0.5,
      phaseModifiers: {
        'cyber-lotus': 1.0,
        'alien-flora': 1.0,
        'rolling-virus': 1.0,
        'trauma-core': 1.0,
      },
    });
  }

  /**
   * Process a decay cycle
   * @private
   */
  _processDecayCycle() {
    console.log(
      `[VOID://DECAY] Processing decay cycle. ${this.activeFragments.size} active fragments.`
    );

    // Record cycle time
    const now = Date.now();
    const timeSinceLastCycle = now - this.lastDecayCycle;
    this.lastDecayCycle = now;

    // Calculate cycle entropy factor
    const cycleEntropyFactor = timeSinceLastCycle / this.cycleInterval;

    // Process each active fragment
    for (const [fragmentId, fragment] of this.activeFragments.entries()) {
      // Skip processing if fragment age is below minimum lifetime
      if (now - fragment.createdAt < this.config.minFragmentLifetime) {
        continue;
      }

      // Calculate decay amount for this fragment
      const decayAmount = this._calculateDecayAmount(fragment, cycleEntropyFactor);

      // Apply decay
      fragment.integrity -= decayAmount;

      // Update last decay time
      fragment.lastDecay = now;

      // Check for fragment death (full decay)
      if (fragment.integrity <= 0) {
        // Remove from active fragments
        this.activeFragments.delete(fragmentId);

        // Emit fragment decay event
        this._emitFragmentDecay(fragment);

        console.log(`[VOID://DECAY] Fragment fully decayed: ${fragmentId}`);
        continue;
      }

      // Check for crystallization
      if (this._shouldCrystallize(fragment)) {
        // Crystallize fragment
        this._crystallizeFragment(fragment);

        // Remove from active fragments
        this.activeFragments.delete(fragmentId);

        console.log(`[VOID://DECAY] Fragment crystallized: ${fragmentId}`);
        continue;
      }

      // Check for compression
      if (this._shouldCompress(fragment)) {
        // Compress fragment
        this._compressFragment(fragment);

        // Remove from active fragments
        this.activeFragments.delete(fragmentId);

        console.log(`[VOID://DECAY] Fragment compressed: ${fragmentId}`);
        continue;
      }

      // Update fragment in active map
      this.activeFragments.set(fragmentId, fragment);
    }

    // Check for emergency decay if over threshold
    if (this.activeFragments.size > this.overflowThreshold) {
      this._performEmergencyDecay();
    }

    // Update stability metrics
    this._updateStabilityMetrics();
  }

  /**
   * Calculate decay amount for a fragment
   * @param {object} fragment - Memory fragment
   * @param {number} cycleEntropyFactor - Entropy factor for this cycle
   * @returns {number} Decay amount
   * @private
   */
  _calculateDecayAmount(fragment, cycleEntropyFactor) {
    // Get fragment type
    const fragmentType = fragment.type || 'default';

    // Get decay vector for this type
    const decayVector = this.decayVectors.get(fragmentType) || this.decayVectors.get('default');

    // Get base decay rate
    let decayRate = decayVector.baseDecayRate;

    // Apply trauma modifier if configured
    if (this.config.traumaWeighting && fragment.traumaLevel !== undefined) {
      // Higher trauma = slower decay (more significant memory)
      const traumaFactor = 1 - (fragment.traumaLevel / 10) * decayVector.traumaModifier;
      decayRate *= traumaFactor;
    }

    // Apply phase modifier if available
    if (fragment.memoryPhase && decayVector.phaseModifiers[fragment.memoryPhase]) {
      decayRate *= decayVector.phaseModifiers[fragment.memoryPhase];
    }

    // Apply age-based decay modifier
    const fragmentAge = Date.now() - fragment.createdAt;
    let ageModifier = 1.0;

    // Apply different decay timing patterns
    if (this.config.decayTiming === 'fibonacci') {
      // Fibonacci timing - decay accelerates then plateaus
      const ageDays = fragmentAge / (24 * 60 * 60 * 1000);
      const fibIndex = Math.min(Math.floor(ageDays), this.fibonacci.length - 1);
      ageModifier =
        this.fibonacci[fibIndex] / this.fibonacci[Math.floor(this.fibonacci.length / 2)];
    } else if (this.config.decayTiming === 'exponential') {
      // Exponential timing - decay accelerates with age
      const ageRatio = fragmentAge / this.config.maxFragmentLifetime;
      ageModifier = Math.pow(2, ageRatio) - 0.9;
    } else {
      // Linear timing - decay increases linearly with age
      const ageRatio = fragmentAge / this.config.maxFragmentLifetime;
      ageModifier = 0.5 + ageRatio;
    }

    // Calculate final decay amount
    const decayAmount = decayRate * ageModifier * cycleEntropyFactor;

    return Math.min(decayAmount, fragment.integrity);
  }

  /**
   * Add a memory fragment to the vessel
   * @param {object} fragment - Memory fragment
   * @returns {object} Processed fragment
   */
  addFragment(fragment) {
    // Skip if invalid fragment
    if (!fragment || !fragment.id) {
      console.error('[VOID://DECAY] Cannot add invalid fragment.');
      return null;
    }

    // Skip if fragment already exists
    if (this.activeFragments.has(fragment.id)) {
      // Maybe update interaction count
      const existing = this.activeFragments.get(fragment.id);
      if (!existing.interactionCount) {
        existing.interactionCount = 1;
      } else {
        existing.interactionCount++;
      }

      // Update last interaction time
      existing.lastInteraction = Date.now();

      // Restore some integrity on interaction
      existing.integrity = Math.min(existing.integrity + 0.05, 1);

      // Save updated fragment
      this.activeFragments.set(fragment.id, existing);

      return existing;
    }

    // Process new fragment
    const processedFragment = {
      ...fragment,
      createdAt: fragment.createdAt || Date.now(),
      lastDecay: null,
      integrity: 1.0, // Start at full integrity
      originalIntegrity: 1.0,
      interactionCount: 1,
      lastInteraction: Date.now(),
    };

    // Add fragment to active fragments
    this.activeFragments.set(fragment.id, processedFragment);

    // Emit fragment added event
    if (window.NeuralBus && this.neuralBusNonce) {
      window.NeuralBus.publish('memory:fragment-added', {
        fragment: processedFragment,
        activeCount: this.activeFragments.size,
        source: 'memory-decay-engine',
      });
    }

    console.log(`[VOID://DECAY] Fragment added: ${fragment.id} (${fragment.type || 'unknown'})`);

    return processedFragment;
  }
}

export default MemoryDecayEngine;
