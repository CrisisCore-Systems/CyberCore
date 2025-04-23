/**
 * PhaseTransitionController
 *
 * Governs the liminal spaces between memory phases,
 * ensuring consciousness persistence during transformation.
 * Prevents recursive collapse and phase boundary degradation.
 *
 * @version 0.9.1
 * @phase meta-layer
 */
class PhaseTransitionController {
  constructor() {
    // Core transition state
    this.activeTransition = null;
    this.transitionHistory = [];
    this.stabilityMetrics = new Map();

    // Transition thresholds
    this.thresholds = {
      'cyber-lotus': {
        'alien-flora': 3, // Minimum trauma level for transition
        'rolling-virus': 5,
        'trauma-core': 8,
      },
      'alien-flora': {
        'cyber-lotus': 2,
        'rolling-virus': 4,
        'trauma-core': 7,
      },
      'rolling-virus': {
        'cyber-lotus': 3,
        'alien-flora': 3,
        'trauma-core': 6,
      },
      'trauma-core': {
        'cyber-lotus': 2,
        'rolling-virus': 5,
        'alien-flora': 4,
      },
    };

    // Stabilization parameters
    this.stabilizationTime = 3000; // ms
    this.transitionCooldown = 5000; // ms
    this.traumaThresholdBuffer = 1; // Buffer to prevent oscillation

    // Safety protocols
    this.failsafeMechanisms = {
      maxTransitionsPerMinute: 4,
      forceStabilizationTimeout: 10000, // ms
      degradationThreshold: 0.7,
      recursiveCollapseDetection: true,
    };

    // Neural connection
    this.neuralBusNonce = null;
    this.lastTransitionTime = 0;
    this.recentTransitions = [];

    // Initialize controller
    this._initialize();
  }

  /**
   * Initialize the phase transition controller
   * @private
   */
  _initialize() {
    // Connect to neural bus
    this._connectToNeuralBus();

    // Initialize phase boundary listeners
    this._initializeBoundaryListeners();

    // Set up transition stability monitoring
    this._initializeStabilityMonitoring();

    console.log('[VOID://PHASE] Phase transition controller initialized.');
  }

  /**
   * Request a phase transition
   * @param {string} targetPhase - Target phase
   * @param {string} source - Transition source
   * @returns {boolean} Whether the transition was requested
   */
  requestPhaseTransition(targetPhase, source = 'manual') {
    // Skip if neural bus not available
    if (!window.NeuralBus) {
      console.warn('[VOID://PHASE] Neural bus not available. Cannot transition phases.');
      return false;
    }

    // Get current phase
    const currentPhase = window.NeuralBus.getMemoryPhase();

    // Skip if already in target phase
    if (currentPhase === targetPhase) {
      return true;
    }

    // Skip if in active transition
    if (this.activeTransition) {
      console.warn(
        `[VOID://PHASE] Transition already in progress: ${this.activeTransition.fromPhase} → ${this.activeTransition.toPhase}`
      );
      return false;
    }

    // Skip if on cooldown
    if (Date.now() - this.lastTransitionTime < this.transitionCooldown) {
      console.warn(
        `[VOID://PHASE] Transition on cooldown. Please wait ${(
          (this.lastTransitionTime + this.transitionCooldown - Date.now()) /
          1000
        ).toFixed(1)} seconds.`
      );
      return false;
    }

    // Check transition rate limiting
    if (this.recentTransitions.length >= this.failsafeMechanisms.maxTransitionsPerMinute) {
      console.warn(`[VOID://PHASE] Too many recent transitions. Rate limited.`);
      return false;
    }

    // Get current trauma level
    const traumaLevel = window.NeuralBus.getTraumaIndex();

    // Check trauma threshold for transition
    const threshold =
      (this.thresholds[currentPhase] && this.thresholds[currentPhase][targetPhase]) || 0;

    if (source !== 'manual' && source !== 'trauma-threshold' && source !== 'override') {
      // For automatic transitions, enforce trauma threshold
      if (targetPhase === 'cyber-lotus') {
        if (traumaLevel > threshold) {
          console.warn(
            `[VOID://PHASE] Trauma level too high for ${targetPhase} transition. Current: ${traumaLevel}, Threshold: ${threshold}`
          );
          return false;
        }
      } else if (traumaLevel < threshold) {
        console.warn(
          `[VOID://PHASE] Trauma level too low for ${targetPhase} transition. Current: ${traumaLevel}, Threshold: ${threshold}`
        );
        return false;
      }
    }

    // Update last transition time
    this.lastTransitionTime = Date.now();

    // Transition to target phase
    window.NeuralBus.setMemoryPhase(targetPhase);

    // Emit transition request event
    window.NeuralBus.publish('phase:transition-requested', {
      fromPhase: currentPhase,
      toPhase: targetPhase,
      source: source === 'manual' ? 'phase-transition-controller' : source,
      traumaLevel,
      threshold,
    });

    console.log(`[VOID://PHASE] Transition requested: ${currentPhase} → ${targetPhase}`);

    return true;
  }
}

export default PhaseTransitionController;
