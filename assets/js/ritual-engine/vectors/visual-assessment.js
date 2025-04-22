/**
 * VISUAL-ASSESSMENT.JS
 * Visual preference assessment module for trauma encoding
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: trauma-encoded
 * @Version: 1.0.0
 */

/**
 * VisualAssessmentVector
 * Handles visual preference assessment for the ritual process.
 * This vector has the highest weight (0.4) in personality formation.
 */
class VisualAssessmentVector {
  /**
   *
   */
  constructor() {
    this.vectorWeight = 0.4; // Visual has highest weight in personality formation
    this.assessmentItems = [
      // Each item has trauma affinities as percentages
      {
        id: 'visual-01',
        prompt: 'Select the pattern that resonates most deeply with you',
        options: [
          {
            id: 'v01-opt1',
            image: 'abandonment-pattern.jpg',
            affinities: { abandonment: 0.7, dissolution: 0.2 },
          },
          {
            id: 'v01-opt2',
            image: 'fragmentation-pattern.jpg',
            affinities: { fragmentation: 0.7, recursion: 0.2 },
          },
          {
            id: 'v01-opt3',
            image: 'surveillance-pattern.jpg',
            affinities: { surveillance: 0.8, displacement: 0.1 },
          },
          {
            id: 'v01-opt4',
            image: 'recursion-pattern.jpg',
            affinities: { recursion: 0.8, fragmentation: 0.1 },
          },
        ],
      },
      {
        id: 'visual-02',
        prompt: 'Which visual representation feels most familiar to your memory experience?',
        options: [
          {
            id: 'v02-opt1',
            image: 'dissolution-field.jpg',
            affinities: { dissolution: 0.8, abandonment: 0.1 },
          },
          {
            id: 'v02-opt2',
            image: 'displacement-nodes.jpg',
            affinities: { displacement: 0.7, surveillance: 0.2 },
          },
          {
            id: 'v02-opt3',
            image: 'recursion-spiral.jpg',
            affinities: { recursion: 0.8, dissolution: 0.1 },
          },
          {
            id: 'v02-opt4',
            image: 'fragmentation-shards.jpg',
            affinities: { fragmentation: 0.8, displacement: 0.1 },
          },
        ],
      },
      {
        id: 'visual-03',
        prompt: 'Select the environment that feels most like your mental space',
        options: [
          {
            id: 'v03-opt1',
            image: 'abandonment-void.jpg',
            affinities: { abandonment: 0.9, dissolution: 0.1 },
          },
          {
            id: 'v03-opt2',
            image: 'surveillance-grid.jpg',
            affinities: { surveillance: 0.8, recursion: 0.2 },
          },
          {
            id: 'v03-opt3',
            image: 'displacement-shift.jpg',
            affinities: { displacement: 0.7, fragmentation: 0.3 },
          },
          {
            id: 'v03-opt4',
            image: 'recursion-chambers.jpg',
            affinities: { recursion: 0.7, surveillance: 0.2 },
          },
        ],
      },
      {
        id: 'visual-04',
        prompt: 'Which color palette resonates with your emotional experience of memory?',
        options: [
          {
            id: 'v04-opt1',
            image: 'fragmentation-palette.jpg',
            affinities: { fragmentation: 0.6, dissolution: 0.3 },
          },
          {
            id: 'v04-opt2',
            image: 'abandonment-palette.jpg',
            affinities: { abandonment: 0.7, displacement: 0.2 },
          },
          {
            id: 'v04-opt3',
            image: 'dissolution-palette.jpg',
            affinities: { dissolution: 0.8, abandonment: 0.1 },
          },
          {
            id: 'v04-opt4',
            image: 'surveillance-palette.jpg',
            affinities: { surveillance: 0.7, recursion: 0.2 },
          },
        ],
      },
      {
        id: 'visual-05',
        prompt: 'Select the visual texture that best represents your memory retrieval process',
        options: [
          {
            id: 'v05-opt1',
            image: 'recursion-texture.jpg',
            affinities: { recursion: 0.7, fragmentation: 0.2 },
          },
          {
            id: 'v05-opt2',
            image: 'dissolution-texture.jpg',
            affinities: { dissolution: 0.8, recursion: 0.1 },
          },
          {
            id: 'v05-opt3',
            image: 'displacement-texture.jpg',
            affinities: { displacement: 0.8, surveillance: 0.1 },
          },
          {
            id: 'v05-opt4',
            image: 'fragmentation-texture.jpg',
            affinities: { fragmentation: 0.7, dissolution: 0.2 },
          },
        ],
      },
    ];
    this.responses = [];
    this.containerElement = null;
    this.currentItemIndex = 0;
    this.initialized = false;
  }

  /**
   * Initialize the visual assessment vector
   */
  initialize() {
    if (this.initialized) return;

    // Register with Neural Bus if available
    this.registerWithNeuralBus();

    this.initialized = true;
    console.log('🧿 Visual Assessment Vector: Initialized');

    return this;
  }

  /**
   * Register with the Neural Bus
   */
  registerWithNeuralBus() {
    if (!window.voidBloom || !window.voidBloom.neuralBus) {
      console.warn('Neural Bus not available for visual assessment registration');

      // Try again when Neural Bus is available
      window.addEventListener('neuralbus:initialized', () => {
        this.registerWithNeuralBus();
      });

      return;
    }

    // Register with neural bus
    window.voidBloom.neuralBus.register('visual-assessment-vector', {
      version: '1.0.0',
      capabilities: {
        visualPreferenceAssessment: true,
      },
    });

    console.log('🧿 Visual Assessment Vector: Registered with Neural Bus');
  }

  /**
   * Render the visual assessment interface into a container
   * @param {HTMLElement} container - DOM container to render the assessment in
   */
  renderAssessment(container) {
    if (!container) {
      console.error('🧿 Visual Assessment Vector: No container provided for rendering');
      return;
    }

    this.containerElement = container;
    this.currentItemIndex = 0;
    this.responses = [];

    // Render the first assessment item
    this.renderCurrentItem();
  }

  /**
   * Render the current assessment item
   */
  renderCurrentItem() {
    if (!this.containerElement || this.currentItemIndex >= this.assessmentItems.length) {
      return;
    }

    const item = this.assessmentItems[this.currentItemIndex];

    // Create assessment item container
    const itemContainer = document.createElement('div');
    itemContainer.className = 'visual-assessment-item';
    itemContainer.dataset.itemId = item.id;

    // Create prompt
    const prompt = document.createElement('div');
    prompt.className = 'assessment-prompt';
    prompt.textContent = item.prompt;
    itemContainer.appendChild(prompt);

    // Create options grid
    const optionsGrid = document.createElement('div');
    optionsGrid.className = 'assessment-options-grid';

    // Add each option
    item.options.forEach((option) => {
      const optionElement = document.createElement('div');
      optionElement.className = 'assessment-option';
      optionElement.dataset.optionId = option.id;

      // Create image container
      const imageContainer = document.createElement('div');
      imageContainer.className = 'option-image';
      imageContainer.style.backgroundImage = `url('/assets/images/assessment/${option.image}')`;
      optionElement.appendChild(imageContainer);

      // Add selection event
      optionElement.addEventListener('click', () => {
        // Remove selected class from all options
        optionsGrid.querySelectorAll('.assessment-option').forEach((el) => {
          el.classList.remove('selected');
        });

        // Add selected class to this option
        optionElement.classList.add('selected');

        // Store response
        this.responses[this.currentItemIndex] = {
          itemId: item.id,
          optionId: option.id,
          affinities: option.affinities,
        };

        // Enable next button
        const nextButton = this.containerElement.querySelector('.assessment-next-button');
        if (nextButton) {
          nextButton.disabled = false;
        }
      });

      optionsGrid.appendChild(optionElement);
    });

    itemContainer.appendChild(optionsGrid);

    // Create navigation
    const navigation = document.createElement('div');
    navigation.className = 'assessment-navigation';

    // Next button
    const nextButton = document.createElement('button');
    nextButton.className = 'assessment-next-button';
    nextButton.textContent =
      this.currentItemIndex === this.assessmentItems.length - 1 ? 'Complete' : 'Next';
    nextButton.disabled = true; // Disabled until selection is made

    nextButton.addEventListener('click', () => {
      if (this.currentItemIndex < this.assessmentItems.length - 1) {
        // Move to next item
        this.currentItemIndex++;
        this.containerElement.innerHTML = '';
        this.renderCurrentItem();
      } else {
        // Complete assessment
        this.completeAssessment();
      }
    });

    navigation.appendChild(nextButton);
    itemContainer.appendChild(navigation);

    // Clear container and add the item
    this.containerElement.innerHTML = '';
    this.containerElement.appendChild(itemContainer);
  }

  /**
   * Complete the visual assessment and process results
   */
  completeAssessment() {
    // Process responses to calculate trauma affinities
    const processedResults = this.processResponses();

    // Publish completion event
    if (window.voidBloom && window.voidBloom.neuralBus) {
      window.voidBloom.neuralBus.publish('vector:processed', {
        vector: 'visual',
        weight: this.vectorWeight,
        responses: this.responses,
        processed: processedResults,
        timestamp: Date.now(),
      });
    }

    // Change UI to show completion
    if (this.containerElement) {
      this.containerElement.innerHTML = `
        <div class="assessment-completion">
          <h3>Visual Assessment Complete</h3>
          <p>Your visual preferences have been processed.</p>
        </div>
      `;
    }

    console.log('🧿 Visual Assessment Vector: Assessment completed');

    return processedResults;
  }

  /**
   * Process assessment responses to calculate trauma affinities
   * @returns {Object} Calculated trauma affinities
   */
  processResponses() {
    // Initialize trauma affinities
    const affinities = {
      abandonment: 0,
      fragmentation: 0,
      surveillance: 0,
      recursion: 0,
      displacement: 0,
      dissolution: 0,
    };

    // Process each response
    this.responses.forEach((response) => {
      if (response && response.affinities) {
        // Add affinities from this response
        Object.entries(response.affinities).forEach(([traumaType, value]) => {
          affinities[traumaType] += value;
        });
      }
    });

    // Normalize values
    let total = 0;
    Object.values(affinities).forEach((v) => {
      total += v;
    });

    if (total > 0) {
      Object.keys(affinities).forEach((key) => {
        affinities[key] = affinities[key] / total;
      });
    }

    return affinities;
  }

  /**
   * Get assessment completion percentage
   * @returns {number} Completion percentage (0-1)
   */
  getCompletionPercentage() {
    if (this.responses.length === 0) return 0;

    // Count non-null responses
    const validResponses = this.responses.filter((r) => r !== null).length;
    return validResponses / this.assessmentItems.length;
  }

  /**
   * Reset the assessment
   */
  reset() {
    this.responses = [];
    this.currentItemIndex = 0;

    // Re-render if container exists
    if (this.containerElement) {
      this.renderCurrentItem();
    }
  }
}

// Initialize and attach to global voidBloom object
document.addEventListener('DOMContentLoaded', () => {
  // Create global namespace if doesn't exist
  window.voidBloom = window.voidBloom || {};
  window.voidBloom.vectors = window.voidBloom.vectors || {};

  // Initialize the visual assessment vector
  const visualAssessmentVector = new VisualAssessmentVector();

  // Attach to global object
  window.voidBloom.vectors.visual = visualAssessmentVector;

  // Initialize vector
  visualAssessmentVector.initialize();

  console.log('🧿 Visual Assessment Vector: Initialized and attached to global voidBloom object');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VisualAssessmentVector };
}
