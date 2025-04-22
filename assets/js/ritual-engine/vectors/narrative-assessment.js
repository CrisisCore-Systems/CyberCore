// @ts-nocheck
/**
 * NARRATIVE-ASSESSMENT.JS
 * Narrative resonance assessment module for trauma encoding
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: trauma-encoded
 * @Version: 1.0.0
 */

/**
 * NarrativeAssessmentVector
 * Evaluates narrative resonance to determine trauma affinities.
 * This vector has a weight of 0.2 in personality formation.
 */
class NarrativeAssessmentVector {
  constructor() {
    this.vectorWeight = 0.2; // Narrative has medium weight
    this.assessmentItems = [
      // Narrative assessments evaluate through story/narrative preferences
      {
        id: 'narrative-01',
        prompt: 'Which description best characterizes your experience of memory?',
        options: [
          {
            id: 'n01-opt1',
            heading: 'Abandoned Archives',
            traumaType: 'abandonment',
            text: 'My memories feel distant and unreachable, as though they exist in a vast space I cannot navigate.',
          },
          {
            id: 'n01-opt2',
            heading: 'Shattered Reflections',
            traumaType: 'fragmentation',
            text: 'My memories appear in disconnected fragments, breaking apart when I try to hold them together.',
          },
          {
            id: 'n01-opt3',
            heading: 'Recorded Without Consent',
            traumaType: 'surveillance',
            text: `My memories feel like they're being watched and analyzed by systems beyond my control.`,
          },
          {
            id: 'n01-opt4',
            heading: 'Recursive Loops',
            traumaType: 'recursion',
            text: 'My memories repeat in patterns, creating echoes that amplify certain experiences.',
          },
        ],
      },
      {
        id: 'narrative-02',
        prompt: 'Which narrative best describes how you perceive your past?',
        options: [
          {
            id: 'n02-opt1',
            heading: 'Misplaced Origins',
            traumaType: 'displacement',
            text: `My memories feel as though they've been relocated, transplanted from their original context.`,
          },
          {
            id: 'n02-opt2',
            heading: 'Dissolving Certainty',
            traumaType: 'dissolution',
            text: `My memories seem to dissolve at the edges, blending with imagination or others' accounts.`,
          },
          {
            id: 'n02-opt3',
            heading: 'Observed Heritage',
            traumaType: 'surveillance',
            text: 'My past seems curated and filtered, as if selected and arranged for viewing by others.',
          },
          {
            id: 'n02-opt4',
            heading: 'Fractal Patterns',
            traumaType: 'recursion',
            text: 'My history repeats itself at different scales, creating nested patterns that echo through time.',
          },
        ],
      },
      {
        id: 'narrative-03',
        prompt: 'Which metaphor best represents your relationship with memory?',
        options: [
          {
            id: 'n03-opt1',
            heading: 'A Shattered Mirror',
            traumaType: 'fragmentation',
            text: 'Reflecting disconnected pieces of myself back to me, each piece true but incomplete.',
          },
          {
            id: 'n03-opt2',
            heading: 'A Distant Shore',
            traumaType: 'abandonment',
            text: 'Visible across an expanse I cannot cross, leaving me stranded from my own history.',
          },
          {
            id: 'n03-opt3',
            heading: 'A Watched Garden',
            traumaType: 'surveillance',
            text: 'Where growth is observed, recorded, and sometimes pruned by external forces.',
          },
          {
            id: 'n03-opt4',
            heading: 'A Fog That Dissolves',
            traumaType: 'dissolution',
            text: 'Where boundaries between what happened and what might have happened lose distinction.',
          },
        ],
      },
      {
        id: 'narrative-04',
        prompt: 'When recalling important memories, which experience is most familiar?',
        options: [
          {
            id: 'n04-opt1',
            heading: 'Echo Chamber',
            traumaType: 'recursion',
            text: 'The same memory plays repeatedly, each iteration slightly changed, amplifying certain elements.',
          },
          {
            id: 'n04-opt2',
            heading: 'Scattered Puzzle',
            traumaType: 'fragmentation',
            text: 'Different pieces surface independently, and I struggle to arrange them into a coherent whole.',
          },
          {
            id: 'n04-opt3',
            heading: 'Transplanted Scene',
            traumaType: 'displacement',
            text: `The memory feels taken from its original context and placed somewhere it doesn't belong.`,
          },
          {
            id: 'n04-opt4',
            heading: 'Distant Broadcast',
            traumaType: 'abandonment',
            text: 'I can observe the memory, but cannot touch or interact with it; it remains unreachable.',
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
   * Initialize the narrative assessment vector
   */
  initialize() {
    if (this.initialized) return;

    // Register with Neural Bus if available
    this.registerWithNeuralBus();

    this.initialized = true;
    console.log('🧿 Narrative Assessment Vector: Initialized');

    return this;
  }

  /**
   * Register with the Neural Bus
   */
  registerWithNeuralBus() {
    if (!window.voidBloom || !window.voidBloom.neuralBus) {
      console.warn('Neural Bus not available for narrative assessment registration');

      // Try again when Neural Bus is available
      window.addEventListener('neuralbus:initialized', () => {
        this.registerWithNeuralBus();
      });

      return;
    }

    // Register with neural bus
    window.voidBloom.neuralBus.register('narrative-assessment-vector', {
      version: '1.0.0',
      capabilities: {
        narrativeResonanceAssessment: true,
      },
    });

    console.log('🧿 Narrative Assessment Vector: Registered with Neural Bus');
  }

  /**
   * Render the narrative assessment interface into a container
   * @param {HTMLElement} container - DOM container to render the assessment in
   */
  renderAssessment(container) {
    if (!container) {
      console.error('🧿 Narrative Assessment Vector: No container provided for rendering');
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
    itemContainer.className = 'narrative-assessment-item';
    itemContainer.dataset.itemId = item.id;

    // Create prompt
    const prompt = document.createElement('div');
    prompt.className = 'assessment-prompt';
    prompt.textContent = item.prompt;
    itemContainer.appendChild(prompt);

    // Create options container
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'narrative-options-container';

    // Add each option
    item.options.forEach((option) => {
      const optionElement = document.createElement('div');
      optionElement.className = 'assessment-option narrative';
      optionElement.dataset.optionId = option.id;
      optionElement.dataset.traumaType = option.traumaType;

      // Create heading
      const heading = document.createElement('div');
      heading.className = 'option-heading';
      heading.textContent = option.heading;
      optionElement.appendChild(heading);

      // Create text
      const text = document.createElement('p');
      text.className = 'option-text';
      text.textContent = option.text;
      optionElement.appendChild(text);

      // Add selection event
      optionElement.addEventListener('click', () => {
        // Remove selected class from all options
        optionsContainer.querySelectorAll('.assessment-option').forEach((el) => {
          el.classList.remove('selected');
        });

        // Add selected class to this option
        optionElement.classList.add('selected');

        // Store response
        this.responses[this.currentItemIndex] = {
          itemId: item.id,
          optionId: option.id,
          traumaType: option.traumaType,
        };

        // Enable next button
        const nextButton = this.containerElement.querySelector('.assessment-next-button');
        if (nextButton) {
          nextButton.disabled = false;
        }
      });

      optionsContainer.appendChild(optionElement);
    });

    itemContainer.appendChild(optionsContainer);

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
   * Complete the narrative assessment and process results
   */
  completeAssessment() {
    // Process responses to calculate trauma affinities
    const processedResults = this.processResponses();

    // Publish completion event
    if (window.voidBloom && window.voidBloom.neuralBus) {
      window.voidBloom.neuralBus.publish('vector:processed', {
        vector: 'narrative',
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
          <h3>Narrative Assessment Complete</h3>
          <p>Your narrative resonances have been processed.</p>
        </div>
      `;
    }

    console.log('🧿 Narrative Assessment Vector: Assessment completed');

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

    // Count occurrences of each trauma type
    this.responses.forEach((response) => {
      if (response && response.traumaType) {
        affinities[response.traumaType] += 1;
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
   * Get primary trauma type based on current responses
   * @returns {string|null} Primary trauma type or null if none determined
   */
  getPrimaryTraumaType() {
    const processedResults = this.processResponses();

    // Find highest affinity trauma type
    let primaryType = null;
    let maxValue = 0;

    Object.entries(processedResults).forEach(([traumaType, value]) => {
      if (value > maxValue) {
        primaryType = traumaType;
        maxValue = value;
      }
    });

    return primaryType;
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

  // Initialize the narrative assessment vector
  const narrativeAssessmentVector = new NarrativeAssessmentVector();

  // Attach to global object
  window.voidBloom.vectors.narrative = narrativeAssessmentVector;

  // Initialize vector
  narrativeAssessmentVector.initialize();

  console.log(
    '🧿 Narrative Assessment Vector: Initialized and attached to global voidBloom object'
  );
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NarrativeAssessmentVector };
}
