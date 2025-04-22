// @ts-nocheck
/**
 * TRAUMA-ASSESSMENT.JS
 * Core trauma assessment and calculation module
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: trauma-encoded
 * @Version: 1.0.0
 */

/**
 * TraumaAssessment
 * Processes and evaluates user responses to trauma vectors,
 * calculating trauma type affinities and weightings.
 */
class TraumaAssessment {
  constructor() {
    // Trauma types supported by the system
    this.traumaTypes = [
      'abandonment',
      'fragmentation',
      'surveillance',
      'recursion',
      'displacement',
      'dissolution',
    ];

    // Maps vector names to their weight in the assessment
    this.vectorWeights = {
      visual: 0.4, // Visual assessment (highest weight)
      interactive: 0.3, // Interactive assessment
      narrative: 0.2, // Narrative assessment
      temporal: 0.1, // Temporal assessment (lowest weight)
    };

    // Store trauma affinities (traumaType -> affinity value)
    this.traumaAffinities = new Map();

    // Track which vectors have been processed
    this.processedVectors = new Set();

    this.initialized = false;
  }

  /**
   * Initialize the trauma assessment system
   */
  initialize() {
    if (this.initialized) return;

    // Register with Neural Bus if available
    this.registerWithNeuralBus();

    // Load existing trauma affinities if available
    this.loadStoredTraumaAffinities();

    this.initialized = true;
    console.log('🧿 Trauma Assessment: Initialized');

    return this;
  }

  /**
   * Register with the Neural Bus
   */
  registerWithNeuralBus() {
    if (!window.voidBloom || !window.voidBloom.neuralBus) {
      console.warn('Neural Bus not available for trauma assessment registration');

      // Try again when Neural Bus is available
      window.addEventListener('neuralbus:initialized', () => {
        this.registerWithNeuralBus();
      });

      return;
    }

    // Register with neural bus
    window.voidBloom.neuralBus.register('trauma-assessment', {
      version: '1.0.0',
      capabilities: {
        traumaAnalysis: true,
        traumaCalculation: true,
      },
    });

    // Subscribe to vector response events
    window.voidBloom.neuralBus.subscribe('vector:response', this.handleVectorResponse.bind(this));

    console.log('🧿 Trauma Assessment: Registered with Neural Bus');
  }

  /**
   * Load stored trauma affinities from localStorage if available
   */
  loadStoredTraumaAffinities() {
    const affinitiesJson = localStorage.getItem('voidbloom_trauma_affinities');
    if (!affinitiesJson) return;

    try {
      const affinities = JSON.parse(affinitiesJson);

      // Populate trauma affinities map
      Object.entries(affinities).forEach(([type, value]) => {
        if (this.traumaTypes.includes(type)) {
          this.traumaAffinities.set(type, value);
        }
      });

      console.log('🧿 Trauma Assessment: Loaded stored trauma affinities');
    } catch (e) {
      console.error('Error parsing stored trauma affinities', e);
    }
  }

  /**
   * Handle vector response event
   * @param {Object} data - Vector response data
   */
  handleVectorResponse(data) {
    if (!data || !data.vector || !data.responses) return;

    // Validate that this is a recognized vector
    if (!this.vectorWeights[data.vector]) {
      console.warn(`Unknown assessment vector: ${data.vector}`);
      return;
    }

    console.log(`🧿 Trauma Assessment: Processing responses from ${data.vector} vector`);

    // Process responses for this vector
    const processedTraumas = this.processVectorResponses(data.vector, data.responses);

    // Mark vector as processed
    this.processedVectors.add(data.vector);

    // Publish processed results
    if (window.voidBloom && window.voidBloom.neuralBus) {
      window.voidBloom.neuralBus.publish('vector:processed', {
        vector: data.vector,
        weight: this.vectorWeights[data.vector],
        processed: processedTraumas,
        timestamp: Date.now(),
      });
    }

    // Check if all vectors have been processed
    if (this.allVectorsProcessed()) {
      this.finalizeAssessment();
    }
  }

  /**
   * Process responses from a specific vector
   * @param {string} vector - Vector name
   * @param {Array} responses - Array of response objects
   * @returns {Object} Processed trauma affinities for this vector
   */
  processVectorResponses(vector, responses) {
    // Skip if no responses
    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      return {};
    }

    // Initialize trauma counts for this vector
    const traumaCounts = {};
    this.traumaTypes.forEach((type) => {
      traumaCounts[type] = 0;
    });

    // Count trauma responses
    responses.forEach((response) => {
      if (response && this.traumaTypes.includes(response.traumaType)) {
        const value = response.value || 1;
        traumaCounts[response.traumaType] += value;
      }
    });

    // Convert counts to normalized values (0-1 range)
    // Find the maximum value for normalization
    const maxValue = Math.max(1, ...Object.values(traumaCounts));

    // Normalize values
    const normalizedTraumas = {};
    Object.entries(traumaCounts).forEach(([type, count]) => {
      normalizedTraumas[type] = count / maxValue;
    });

    // Update global affinities with weighted values
    const vectorWeight = this.vectorWeights[vector];

    Object.entries(normalizedTraumas).forEach(([type, value]) => {
      // If already exists, add weighted value
      if (this.traumaAffinities.has(type)) {
        const existingValue = this.traumaAffinities.get(type);
        this.traumaAffinities.set(type, existingValue + value * vectorWeight);
      } else {
        // Otherwise set initial weighted value
        this.traumaAffinities.set(type, value * vectorWeight);
      }
    });

    return normalizedTraumas;
  }

  /**
   * Check if all vectors have been processed
   * @returns {boolean} True if all vectors have been processed
   */
  allVectorsProcessed() {
    return Object.keys(this.vectorWeights).every((vector) => this.processedVectors.has(vector));
  }

  /**
   * Finalize the assessment after all vectors are processed
   */
  finalizeAssessment() {
    console.log('🧿 Trauma Assessment: Finalizing assessment');

    // Normalize final values
    let totalWeight = 0;

    // Calculate total weight of processed vectors
    this.processedVectors.forEach((vector) => {
      totalWeight += this.vectorWeights[vector];
    });

    // Default to sum of all weights if no vectors processed
    if (totalWeight === 0) {
      totalWeight = Object.values(this.vectorWeights).reduce((sum, weight) => sum + weight, 0);
    }

    // Normalize values
    const normalizedAffinities = {};
    this.traumaAffinities.forEach((value, type) => {
      normalizedAffinities[type] = value / totalWeight;
    });

    // Determine primary trauma type (highest affinity)
    let primaryType = null;
    let highestValue = 0;

    Object.entries(normalizedAffinities).forEach(([type, value]) => {
      if (value > highestValue) {
        highestValue = value;
        primaryType = type;
      }
    });

    // Store finalized values
    localStorage.setItem('voidbloom_trauma_affinities', JSON.stringify(normalizedAffinities));
    localStorage.setItem('voidbloom_primary_trauma', primaryType);

    // Publish finalized assessment
    if (window.voidBloom && window.voidBloom.neuralBus) {
      window.voidBloom.neuralBus.publish('assessment:finalized', {
        traumaAffinities: normalizedAffinities,
        primaryTrauma: primaryType,
        timestamp: Date.now(),
      });
    }

    console.log(`🧿 Trauma Assessment: Assessment finalized. Primary trauma: ${primaryType}`);
  }

  /**
   * Manually set trauma affinities (for testing/development)
   * @param {Object} affinities - Trauma affinities object
   */
  setTraumaAffinities(affinities) {
    this.traumaAffinities.clear();

    Object.entries(affinities).forEach(([type, value]) => {
      if (this.traumaTypes.includes(type)) {
        this.traumaAffinities.set(type, value);
      }
    });

    // Store updated values
    localStorage.setItem('voidbloom_trauma_affinities', JSON.stringify(affinities));

    // Determine primary trauma type
    let primaryType = null;
    let highestValue = 0;

    this.traumaAffinities.forEach((value, type) => {
      if (value > highestValue) {
        highestValue = value;
        primaryType = type;
      }
    });

    localStorage.setItem('voidbloom_primary_trauma', primaryType);

    console.log(
      `🧿 Trauma Assessment: Trauma affinities manually set. Primary trauma: ${primaryType}`
    );

    // Publish updated affinities
    if (window.voidBloom && window.voidBloom.neuralBus) {
      window.voidBloom.neuralBus.publish('assessment:updated', {
        traumaAffinities: Object.fromEntries(this.traumaAffinities),
        primaryTrauma: primaryType,
        manual: true,
        timestamp: Date.now(),
      });
    }

    return primaryType;
  }

  /**
   * Get trauma descriptor text for a specific trauma type
   * @param {string} traumaType - Trauma type to get descriptor for
   * @returns {Object} Trauma descriptor object
   */
  getTraumaDescriptor(traumaType) {
    const descriptors = {
      abandonment: {
        label: 'Abandonment Encoding',
        shortDesc: 'Isolation in Vastness',
        longDesc: 'A profound spatial distance between experience and recollection.',
        narrativeFraming:
          'Your memories feel distant and unreachable, as though they exist in a vast space you cannot navigate.',
      },
      fragmentation: {
        label: 'Fragmentation Pattern',
        shortDesc: 'Dissolution of Self',
        longDesc: 'Disconnected memory fragments breaking apart when attempting coherence.',
        narrativeFraming:
          'Your memories appear in disconnected fragments, breaking apart when you try to hold them together.',
      },
      surveillance: {
        label: 'Surveillance Protocol',
        shortDesc: 'Observed Experience',
        longDesc: 'Perception of memory being watched and analyzed by external systems.',
        narrativeFraming: `Your memories feel like they're being watched and analyzed by systems beyond your control.`,
      },
      recursion: {
        label: 'Recursive Loop',
        shortDesc: 'Cyclical Patterns',
        longDesc: 'Recurring memory patterns that create echoes and amplify experiences.',
        narrativeFraming:
          'Your memories repeat in patterns, creating echoes that amplify certain experiences.',
      },
      displacement: {
        label: 'Displacement Vectors',
        shortDesc: 'Dislocation of Perception',
        longDesc: 'Memory experiences transplanted from their original context.',
        narrativeFraming: `Your memories feel as though they've been relocated, transplanted from their original context.`,
      },
      dissolution: {
        label: 'Boundary Dissolution',
        shortDesc: 'Fading Boundaries',
        longDesc: "Memory edges that dissolve, blending with imagination or others' accounts.",
        narrativeFraming: `Your memories seem to dissolve at the edges, blending with imagination or others' accounts.`,
      },
    };

    return (
      descriptors[traumaType] || {
        label: 'Unknown Pattern',
        shortDesc: 'Unclassified Experience',
        longDesc: 'An unrecognized memory encoding pattern.',
        narrativeFraming: 'Your memory patterns follow an unrecognized configuration.',
      }
    );
  }

  /**
   * Calculate trauma response match score for content
   * Determines how well content matches user's trauma profile
   *
   * @param {Object} content - Content to evaluate
   * @returns {number} Match score (0-1)
   */
  calculateTraumaMatchScore(content) {
    if (!content || !content.traumaTypes || this.traumaAffinities.size === 0) {
      return 0.5; // Default to neutral if no data
    }

    let totalScore = 0;
    let totalWeight = 0;

    // Calculate weighted match score across all content trauma types
    Object.entries(content.traumaTypes).forEach(([traumaType, intensity]) => {
      if (this.traumaAffinities.has(traumaType)) {
        const userAffinity = this.traumaAffinities.get(traumaType);
        totalScore += userAffinity * intensity;
        totalWeight += intensity;
      }
    });

    // If no matching trauma types, return neutral score
    if (totalWeight === 0) return 0.5;

    // Return normalized score
    return totalScore / totalWeight;
  }
}

// Initialize and attach to global voidBloom object
document.addEventListener('DOMContentLoaded', () => {
  // Create global namespace if doesn't exist
  window.voidBloom = window.voidBloom || {};

  // Initialize the trauma assessment system
  const traumaAssessment = new TraumaAssessment();

  // Attach to global object
  window.voidBloom.traumaAssessment = traumaAssessment;

  // Initialize system
  traumaAssessment.initialize();

  console.log('🧿 Trauma Assessment: Initialized and attached to global voidBloom object');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TraumaAssessment };
}
