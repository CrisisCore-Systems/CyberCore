/**
 * ResonanceFunctions - Utility library of specialized functions
 * for trauma resonance vector calculations
 */

/**
 * Specialized Z-dimension curve functions for emotional mapping
 */
const ZCurveFunctions = {
  /**
   * Linear Z-curve (no transformation)
   *
   * @param {number} t - Trauma value [0,1]
   * @returns {number} Z value [0,1]
   */
  linear: (t) => t,

  /**
   * Emphasizes lower trauma values
   * Good for subtle emotional states
   *
   * @param {number} t - Trauma value [0,1]
   * @returns {number} Z value [0,1]
   */
  earlyEmphasis: (t) => Math.pow(t, 0.7),

  /**
   * Emphasizes higher trauma values
   * Good for intense emotional states
   *
   * @param {number} t - Trauma value [0,1]
   * @returns {number} Z value [0,1]
   */
  lateEmphasis: (t) => Math.pow(t, 1.4),

  /**
   * S-curve for balanced emphasis with distinct mid-range
   *
   * @param {number} t - Trauma value [0,1]
   * @returns {number} Z value [0,1]
   */
  sCurve: (t) => 1 / (1 + Math.exp(-10 * (t - 0.5))),

  /**
   * Bifurcated curve with sharp transition
   * Creates binary emotional states
   *
   * @param {number} t - Trauma value [0,1]
   * @returns {number} Z value [0,1]
   */
  threshold: (t) => (t < 0.5 ? t * 0.5 : 0.25 + (t - 0.5) * 1.5),

  /**
   * Wave-modulated curve
   * Creates oscillating intensity
   *
   * @param {number} t - Trauma value [0,1]
   * @returns {number} Z value [0,1]
   */
  oscillating: (t) => {
    const base = t;
    const wave = 0.1 * Math.sin(t * Math.PI * 4);
    return Math.max(0, Math.min(1, base + wave));
  },

  /**
   * Dual peak curve
   * Creates two intensity peaks
   *
   * @param {number} t - Trauma value [0,1]
   * @returns {number} Z value [0,1]
   */
  dualPeak: (t) => {
    // Two gaussian peaks at t=0.3 and t=0.7
    const peak1 = Math.exp(-Math.pow((t - 0.3) / 0.15, 2));
    const peak2 = Math.exp(-Math.pow((t - 0.7) / 0.15, 2));
    return Math.max(peak1, peak2);
  },
};

/**
 * Specialized strength modulator functions
 */
const StrengthModulators = {
  /**
   * Default strength modulator (no modulation)
   *
   * @param {number} t - Trauma value [0,1]
   * @returns {number} Strength value (typically around 1.0)
   */
  default: () => 1.0,

  /**
   * Trauma-proportional strength
   * Higher trauma = stronger effect
   *
   * @param {number} t - Trauma value [0,1]
   * @returns {number} Strength value [0.6-1.4]
   */
  traumaProportional: (t) => 0.6 + 0.8 * t,

  /**
   * Inverse trauma-proportional strength
   * Lower trauma = stronger effect
   *
   * @param {number} t - Trauma value [0,1]
   * @returns {number} Strength value [0.6-1.4]
   */
  inverseTraumaProportional: (t) => 1.4 - 0.8 * t,

  /**
   * Pulsing strength modulator
   * Creates rhythmic intensity variations
   *
   * @param {number} t - Trauma value [0,1]
   * @param {string} component - Target component
   * @param {object} context - Context information
   * @returns {number} Strength value with pulsing effect
   */
  pulsing: (t, component, context = {}) => {
    const baseStrength = 0.9 + 0.2 * t;
    const pulseFrequency = context.pulseFrequency || 2000; // 2 second cycle
    const pulseAmplitude = context.pulseAmplitude || 0.2; // 20% variation
    const pulse = Math.sin((Date.now() / pulseFrequency) * Math.PI * 2) * pulseAmplitude;
    return baseStrength * (1 + pulse);
  },

  /**
   * Phase-adaptive strength modulator
   * Adapts strength based on system phase
   *
   * @param {number} t - Trauma value [0,1]
   * @param {string} component - Target component
   * @param {object} context - Context information with phase
   * @returns {number} Phase-appropriate strength value
   */
  phaseAdaptive: (t, component, context = {}) => {
    const phase = context.phase || 'cyber-lotus';
    let baseStrength = 1.0;

    switch (phase) {
      case 'trauma-core':
        baseStrength = 1.2 + 0.3 * t;
        break;
      case 'cyber-lotus':
        baseStrength = 0.8 + 0.3 * t;
        break;
      case 'rolling-virus':
        baseStrength = 1.0 + 0.5 * Math.sin(t * Math.PI * 2);
        break;
      case 'alien-flora':
        baseStrength = 0.9 + 0.4 * Math.pow(t, 1.5);
        break;
      case 'transcendent':
        baseStrength = 1.0;
        break;
    }

    return baseStrength;
  },
};

/**
 * Specialized coherence modulator functions
 */
const CoherenceModulators = {
  /**
   * Default coherence (perfect coherence)
   *
   * @returns {number} Coherence value (1.0)
   */
  perfect: () => 1.0,

  /**
   * Time-decay coherence
   * Coherence degrades over time
   *
   * @param {number} t - Trauma value [0,1]
   * @param {string} component - Target component
   * @param {object} context - Context with creation timestamp
   * @returns {number} Time-decayed coherence value
   */
  timeDecay: (t, component, context = {}) => {
    const creationTime = context.creationTime || Date.now();
    const elapsedMs = Date.now() - creationTime;
    const decayRate = context.decayRate || 0.0001; // 0.01% per ms
    const decayFactor = Math.max(0, 1 - elapsedMs * decayRate);
    return Math.max(0.8, decayFactor);
  },

  /**
   * Phase-transition coherence
   * Coherence is lower after phase transitions
   *
   * @param {number} t - Trauma value [0,1]
   * @param {string} component - Target component
   * @param {object} context - Context with timeSincePhaseTransition
   * @returns {number} Phase-appropriate coherence value
   */
  phaseTransition: (t, component, context = {}) => {
    const timeSinceTransition = context.timeSincePhaseTransition || 10000;
    const stabilizationTime = context.stabilizationTime || 5000; // 5 seconds to stabilize

    if (timeSinceTransition < stabilizationTime) {
      // Calculate coherence: 0.8 to 1.0 as time approaches stabilization
      return 0.8 + (0.2 * timeSinceTransition) / stabilizationTime;
    }

    return 1.0; // Fully coherent after stabilization
  },

  /**
   * Trauma-sensitive coherence
   * High trauma reduces coherence
   *
   * @param {number} t - Trauma value [0,1]
   * @returns {number} Trauma-dependent coherence value
   */
  traumaSensitive: (t) => {
    return Math.max(0.8, 1 - t * 0.2);
  },

  /**
   * Component-specific coherence
   * Different components have different baseline coherence
   *
   * @param {number} t - Trauma value [0,1]
   * @param {string} component - Target component
   * @returns {number} Component-appropriate coherence value
   */
  componentSpecific: (t, component) => {
    const baseCoherence =
      {
        'neural-architecture': 0.95,
        'memory-vessel': 0.98,
        'security-trauma': 0.9,
        'commerce-integration': 0.85,
        'prompt-engine': 0.92,
        'integration-layer': 0.88,
        all: 0.9,
      }[component] || 0.9;

    // Trauma slightly reduces coherence
    return Math.max(0.8, baseCoherence - t * 0.1);
  },
};

module.exports = {
  ZCurveFunctions,
  StrengthModulators,
  CoherenceModulators,
};
