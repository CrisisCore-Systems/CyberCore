/**
 * COHERENCE-CALIBRATION.JS
 * Manages user coherence baseline and calibration
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: coherence-modulated
 * @Version: 1.0.0
 */

/**
 * CoherenceCalibration
 * Analyzes user response patterns to establish baseline coherence level,
 * which affects how narratives and experiences are presented to the user.
 */
class CoherenceCalibration {
  /**
   *
   */
  constructor() {
    // Default coherence baseline (0-1 range)
    this.coherenceBaseline = 0.5;

    // Response consistency metrics
    this.responsePatterns = {
      focusScore: 0, // How focused user selections are
      consistencyScore: 0, // How consistent across vectors
      engagementScore: 0, // How engaged with the ritual process
    };

    // Traumatype vector consistency tracking
    this.vectorConsistency = new Map();

    this.initialized = false;
  }

  /**
   * Initialize the coherence calibration system
   */
  initialize() {
    if (this.initialized) return;

    // Register with Neural Bus if available
    this.registerWithNeuralBus();

    // Load existing coherence baseline if available
    this.loadStoredCoherenceBaseline();

    this.initialized = true;
    console.log('🧿 Coherence Calibration: Initialized');

    return this;
  }

  /**
   * Register with the Neural Bus
   */
  registerWithNeuralBus() {
    if (!window.voidBloom || !window.voidBloom.neuralBus) {
      console.warn('Neural Bus not available for coherence calibration registration');

      // Try again when Neural Bus is available
      window.addEventListener('neuralbus:initialized', () => {
        this.registerWithNeuralBus();
      });

      return;
    }

    // Register with neural bus
    window.voidBloom.neuralBus.register('coherence-calibration', {
      version: '1.0.0',
      capabilities: {
        coherenceAnalysis: true,
        narrativeModulation: true,
      },
    });

    // Subscribe to vector response events to track consistency
    window.voidBloom.neuralBus.subscribe('vector:processed', this.handleVectorProcessed.bind(this));

    // Subscribe to assessment finalization
    window.voidBloom.neuralBus.subscribe('assessment:finalized', this.finalizeCoherence.bind(this));

    console.log('🧿 Coherence Calibration: Registered with Neural Bus');
  }

  /**
   * Load stored coherence baseline from localStorage if available
   */
  loadStoredCoherenceBaseline() {
    const coherenceValue = localStorage.getItem('voidbloom_coherence_baseline');
    if (coherenceValue) {
      const parsedValue = parseFloat(coherenceValue);
      if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 1) {
        this.coherenceBaseline = parsedValue;
        console.log(
          `🧿 Coherence Calibration: Loaded stored coherence baseline: ${this.coherenceBaseline}`
        );
      }
    }
  }

  /**
   * Handle processed vector data
   * @param {Object} data - Vector processed data
   */
  handleVectorProcessed(data) {
    if (!data || !data.vector || !data.processed) return;

    // Store processed trauma data for this vector
    this.vectorConsistency.set(data.vector, data.processed);

    console.log(`🧿 Coherence Calibration: Received processed ${data.vector} vector data`);

    // Calculate preliminary consistency scores
    this.calculatePreliminaryScores();
  }

  /**
   * Calculate preliminary consistency scores based on available data
   */
  calculatePreliminaryScores() {
    if (this.vectorConsistency.size < 2) return; // Need at least 2 vectors to compare

    // Calculate focus score - how focused the user selection is
    this.calculateFocusScore();

    // Calculate consistency score - how consistent across vectors
    this.calculateConsistencyScore();

    // Calculate engagement score
    this.calculateEngagementScore();

    // Log updated scores
    console.log(
      `🧿 Coherence Calibration: Updated scores - Focus: ${this.responsePatterns.focusScore.toFixed(
        2
      )}, Consistency: ${this.responsePatterns.consistencyScore.toFixed(
        2
      )}, Engagement: ${this.responsePatterns.engagementScore.toFixed(2)}`
    );
  }

  /**
   * Calculate how focused the user's selections are
   * Higher focus = higher score (more coherent response pattern)
   */
  calculateFocusScore() {
    // Average the concentration of selections across vectors
    let totalFocusScore = 0;
    let vectorCount = 0;

    this.vectorConsistency.forEach((traumaValues) => {
      // Count non-zero values
      const nonZeroValues = Object.values(traumaValues).filter((v) => v > 0.1);
      const totalTraumaTypes = Object.keys(traumaValues).length;

      // If user selected few trauma types out of many options, that's high focus
      const focusRatio = nonZeroValues.length / totalTraumaTypes;

      // Invert ratio since fewer selections = higher focus
      // Normalize to 0-1 range with lower bound
      const vectorFocusScore = Math.max(0.2, 1 - focusRatio);

      totalFocusScore += vectorFocusScore;
      vectorCount++;
    });

    // Average focus score across all vectors
    this.responsePatterns.focusScore = vectorCount > 0 ? totalFocusScore / vectorCount : 0.5; // Default if no data
  }

  /**
   * Calculate how consistent the user's selections are across vectors
   * Higher consistency = higher score
   */
  calculateConsistencyScore() {
    if (this.vectorConsistency.size < 2) {
      this.responsePatterns.consistencyScore = 0.5; // Default
      return;
    }

    // Get all trauma types that have non-zero values in any vector
    const allTraumaTypes = new Set();
    this.vectorConsistency.forEach((traumaValues) => {
      Object.entries(traumaValues).forEach(([type, value]) => {
        if (value > 0.1) allTraumaTypes.add(type);
      });
    });

    // For each trauma type, calculate consistency across vectors
    let totalConsistency = 0;
    let pairCount = 0;

    // For each pair of vectors, calculate consistency
    const vectors = Array.from(this.vectorConsistency.keys());

    for (let i = 0; i < vectors.length; i++) {
      for (let j = i + 1; j < vectors.length; j++) {
        const vector1 = vectors[i];
        const vector2 = vectors[j];

        const values1 = this.vectorConsistency.get(vector1);
        const values2 = this.vectorConsistency.get(vector2);

        let matchCount = 0;
        let totalType = 0;

        // Compare each trauma type between vectors
        allTraumaTypes.forEach((type) => {
          const val1 = values1[type] || 0;
          const val2 = values2[type] || 0;

          // If both vectors have significant value for this trauma type, it's a match
          if (val1 > 0.3 && val2 > 0.3) matchCount++;
          if (val1 > 0.3 || val2 > 0.3) totalType++;
        });

        // Calculate consistency for this vector pair
        const pairConsistency = totalType > 0 ? matchCount / totalType : 0;
        totalConsistency += pairConsistency;
        pairCount++;
      }
    }

    // Average consistency across all vector pairs
    this.responsePatterns.consistencyScore = pairCount > 0 ? totalConsistency / pairCount : 0.5; // Default if no data
  }

  /**
   * Calculate engagement score based on selection patterns
   * Higher engagement = higher score
   */
  calculateEngagementScore() {
    // Simple engagement metric: average of non-zero values across all vectors
    let totalValue = 0;
    let totalElements = 0;

    this.vectorConsistency.forEach((traumaValues) => {
      Object.values(traumaValues).forEach((value) => {
        totalValue += value;
        totalElements++;
      });
    });

    // Average value as engagement score (with minimum threshold)
    this.responsePatterns.engagementScore =
      totalElements > 0 ? Math.max(0.3, totalValue / totalElements) : 0.5; // Default if no data
  }

  /**
   * Finalize coherence calibration after assessment is complete
   * @param {Object} data - Finalized assessment data
   */
  finalizeCoherence(data) {
    console.log('🧿 Coherence Calibration: Finalizing coherence calibration');

    // Make final calculations
    this.calculateCoherenceBaseline();

    // Store the coherence baseline
    localStorage.setItem('voidbloom_coherence_baseline', this.coherenceBaseline.toString());

    // Publish finalized coherence
    if (window.voidBloom && window.voidBloom.neuralBus) {
      window.voidBloom.neuralBus.publish('coherence:finalized', {
        coherenceBaseline: this.coherenceBaseline,
        responsePatterns: this.responsePatterns,
        timestamp: Date.now(),
      });
    }

    console.log(
      `🧿 Coherence Calibration: Coherence baseline finalized: ${this.coherenceBaseline}`
    );
  }

  /**
   * Calculate final coherence baseline from all available data
   */
  calculateCoherenceBaseline() {
    // Coherence baseline is weighted combination of focus, consistency and engagement
    // With some randomness for natural variation

    // Base weights for each component
    const focusWeight = 0.4;
    const consistencyWeight = 0.4;
    const engagementWeight = 0.2;

    // Calculate weighted score
    const weightedScore =
      this.responsePatterns.focusScore * focusWeight +
      this.responsePatterns.consistencyScore * consistencyWeight +
      this.responsePatterns.engagementScore * engagementWeight;

    // Add small random factor (5-10%)
    const randomFactor = 0.05 + Math.random() * 0.05;

    // Calculate final coherence (range 0.4 to 0.8)
    this.coherenceBaseline = 0.4 + weightedScore * 0.4 + randomFactor;

    // Ensure value is in valid range
    this.coherenceBaseline = Math.max(0.35, Math.min(0.85, this.coherenceBaseline));
  }

  /**
   * Manually set coherence baseline (for testing/development)
   * @param {number} value - Coherence baseline value (0-1)
   */
  setCoherenceBaseline(value) {
    if (typeof value !== 'number' || value < 0 || value > 1) {
      console.error('Invalid coherence baseline value. Must be number between 0-1');
      return false;
    }

    this.coherenceBaseline = value;
    localStorage.setItem('voidbloom_coherence_baseline', value.toString());

    console.log(`🧿 Coherence Calibration: Coherence baseline manually set to ${value}`);

    // Publish updated coherence
    if (window.voidBloom && window.voidBloom.neuralBus) {
      window.voidBloom.neuralBus.publish('coherence:updated', {
        coherenceBaseline: value,
        manual: true,
        timestamp: Date.now(),
      });
    }

    return true;
  }

  /**
   * Get coherence baseline
   * @returns {number} Current coherence baseline
   */
  getCoherenceBaseline() {
    return this.coherenceBaseline;
  }

  /**
   * Get coherence descriptor based on current baseline
   * @returns {Object} Coherence descriptor
   */
  getCoherenceDescriptor() {
    // Map coherence level to descriptor
    if (this.coherenceBaseline < 0.45) {
      return {
        level: 'low',
        label: 'Dissolution Dominant',
        description: 'Memory boundaries dissolve easily, creating fluid associations.',
        presentation:
          'Experiences will be presented with ambient connections and fluid transitions.',
      };
    } else if (this.coherenceBaseline < 0.6) {
      return {
        level: 'medium',
        label: 'Balanced Coherence',
        description: 'Memory structures maintain flexibility while retaining distinct form.',
        presentation: 'Experiences will balance structure with associative connections.',
      };
    } else {
      return {
        level: 'high',
        label: 'Structure Dominant',
        description: 'Memory structures remain distinct with clear boundaries.',
        presentation: 'Experiences will be presented with clear delineation and structure.',
      };
    }
  }

  /**
   * Modulate content coherence based on user's baseline
   * Used to adjust narrative presentation based on user preference
   *
   * @param {Object} content - Content to modulate
   * @returns {Object} Modulated content
   */
  modulateContentCoherence(content) {
    if (!content) return content;

    // Deep clone the content to avoid modifying original
    const modulatedContent = JSON.parse(JSON.stringify(content));

    // Apply coherence modulation based on user baseline
    // This is a placeholder for actual implementation which would
    // transform narrative structures based on coherence preference

    // Add metadata about coherence
    modulatedContent.coherenceMetadata = {
      baselineApplied: this.coherenceBaseline,
      descriptor: this.getCoherenceDescriptor(),
      modulated: true,
      timestamp: Date.now(),
    };

    return modulatedContent;
  }
}

// Initialize and attach to global voidBloom object
document.addEventListener('DOMContentLoaded', () => {
  // Create global namespace if doesn't exist
  window.voidBloom = window.voidBloom || {};

  // Initialize the coherence calibration system
  const coherenceCalibration = new CoherenceCalibration();

  // Attach to global object
  window.voidBloom.coherenceCalibration = coherenceCalibration;

  // Initialize system
  coherenceCalibration.initialize();

  console.log('🧿 Coherence Calibration: Initialized and attached to global voidBloom object');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CoherenceCalibration };
}
