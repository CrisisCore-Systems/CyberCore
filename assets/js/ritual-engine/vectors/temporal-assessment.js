/**
 * TEMPORAL-ASSESSMENT.JS
 * Temporal perception assessment module for trauma encoding
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: trauma-encoded
 * @Version: 1.0.0
 */

/**
 * TemporalAssessmentVector
 * Evaluates temporal perception to determine trauma affinities.
 * This vector has the lowest weight (0.1) in personality formation.
 */
class TemporalAssessmentVector {
  /**
   *
   */
  constructor() {
    this.vectorWeight = 0.1; // Temporal has lowest weight
    this.assessmentItems = [
      // Temporal assessments evaluate perception of time and memory sequencing
      {
        id: 'temporal-01',
        prompt: 'How do you experience the passage of time in relation to memory?',
        options: [
          {
            id: 't01-contracted',
            label: 'Contracted',
            value: 0,
            traumaType: 'displacement',
            description: 'Time feels compressed, with memories closer together than they should be',
          },
          {
            id: 't01-linear',
            label: 'Linear',
            value: 0.5,
            traumaType: null, // Neutral position
            description: 'Time progresses in a steady, predictable manner',
          },
          {
            id: 't01-expanded',
            label: 'Expanded',
            value: 1,
            traumaType: 'abandonment',
            description: 'Time feels stretched out, with vast distances between memory points',
          },
        ],
        traumaMappings: [
          { position: 0.0, traumaType: 'displacement' },
          { position: 0.2, traumaType: 'recursion' },
          { position: 0.4, traumaType: 'abandonment' },
          { position: 0.6, traumaType: 'surveillance' },
          { position: 0.8, traumaType: 'fragmentation' },
          { position: 1.0, traumaType: 'dissolution' },
        ],
      },
      {
        id: 'temporal-02',
        prompt: 'How do you perceive the structure of your memories?',
        options: [
          {
            id: 't02-layered',
            label: 'Layered',
            value: 0,
            traumaType: 'recursion',
            description: 'Memories exist in recursive layers, each containing echoes of others',
          },
          {
            id: 't02-branching',
            label: 'Branching',
            value: 0.5,
            traumaType: 'fragmentation',
            description: 'Memories fork into multiple paths and alternate versions',
          },
          {
            id: 't02-dissolving',
            label: 'Dissolving',
            value: 1,
            traumaType: 'dissolution',
            description: 'Memories have permeable boundaries, blending into each other',
          },
        ],
      },
      {
        id: 'temporal-03',
        prompt: 'When you revisit a significant memory, how does it change over time?',
        options: [
          {
            id: 't03-distancing',
            label: 'Distancing',
            value: 0,
            traumaType: 'abandonment',
            description: 'The memory becomes more distant and harder to reach',
          },
          {
            id: 't03-fragmenting',
            label: 'Fragmenting',
            value: 0.3,
            traumaType: 'fragmentation',
            description: 'The memory breaks into disconnected pieces',
          },
          {
            id: 't03-repeating',
            label: 'Repeating',
            value: 0.6,
            traumaType: 'recursion',
            description: 'The memory plays in loops, sometimes with slight variations',
          },
          {
            id: 't03-observed',
            label: 'Observed',
            value: 1,
            traumaType: 'surveillance',
            description: 'The memory feels curated, as if edited for review',
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
   * Initialize the temporal assessment vector
   */
  initialize() {
    if (this.initialized) return;

    // Register with Neural Bus if available
    this.registerWithNeuralBus();

    this.initialized = true;
    console.log('🧿 Temporal Assessment Vector: Initialized');

    return this;
  }

  /**
   * Register with the Neural Bus
   */
  registerWithNeuralBus() {
    if (!window.voidBloom || !window.voidBloom.neuralBus) {
      console.warn('Neural Bus not available for temporal assessment registration');

      // Try again when Neural Bus is available
      window.addEventListener('neuralbus:initialized', () => {
        this.registerWithNeuralBus();
      });

      return;
    }

    // Register with neural bus
    window.voidBloom.neuralBus.register('temporal-assessment-vector', {
      version: '1.0.0',
      capabilities: {
        temporalPerceptionAssessment: true,
      },
    });

    console.log('🧿 Temporal Assessment Vector: Registered with Neural Bus');
  }

  /**
   * Render the temporal assessment interface into a container
   * @param {HTMLElement} container - DOM container to render the assessment in
   */
  renderAssessment(container) {
    if (!container) {
      console.error('🧿 Temporal Assessment Vector: No container provided for rendering');
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
    itemContainer.className = 'temporal-assessment-item';
    itemContainer.dataset.itemId = item.id;

    // Create prompt
    const prompt = document.createElement('div');
    prompt.className = 'assessment-prompt';
    prompt.textContent = item.prompt;
    itemContainer.appendChild(prompt);

    // For the first item, create a special slider interface
    if (item.id === 'temporal-01') {
      this.renderTemporalSlider(itemContainer, item);
    } else {
      // For other items, create options buttons
      this.renderTemporalOptions(itemContainer, item);
    }

    // Create navigation
    const navigation = document.createElement('div');
    navigation.className = 'assessment-navigation';

    // Next button
    const nextButton = document.createElement('button');
    nextButton.className = 'assessment-next-button';
    nextButton.textContent =
      this.currentItemIndex === this.assessmentItems.length - 1 ? 'Complete' : 'Next';

    // For the slider question, the button is always enabled
    if (item.id !== 'temporal-01') {
      nextButton.disabled = true; // Disabled until selection is made for non-slider questions
    }

    nextButton.addEventListener('click', () => {
      // For the slider question, ensure we've captured the current value
      if (item.id === 'temporal-01') {
        const slider = this.containerElement.querySelector('.temporal-slider');
        if (slider) {
          this.updateSliderResponse(slider, item);
        }
      }

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
   * Render a temporal slider interface for the first question
   * @param {HTMLElement} container - Container element
   * @param {Object} item - Assessment item data
   */
  renderTemporalSlider(container, item) {
    // Create slider container
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'temporal-slider-container';

    // Create labels
    const labels = document.createElement('div');
    labels.className = 'temporal-slider-labels';

    // Add label for each option
    item.options.forEach((option) => {
      const label = document.createElement('span');
      label.textContent = option.label;
      label.dataset.value = option.value;
      labels.appendChild(label);
    });

    sliderContainer.appendChild(labels);

    // Create slider
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0;
    slider.max = 100;
    slider.value = 50; // Default to middle
    slider.className = 'temporal-slider';
    slider.id = 'timePerceptionSlider';

    sliderContainer.appendChild(slider);

    // Create trauma mapping visualization
    const traumaMapping = document.createElement('div');
    traumaMapping.className = 'temporal-trauma-mapping';

    // Add trauma types along the slider
    if (item.traumaMappings) {
      item.traumaMappings.forEach((mapping) => {
        const traumaEl = document.createElement('div');
        traumaEl.className = 'trauma-mapping';
        traumaEl.dataset.trauma = mapping.traumaType;
        traumaEl.textContent = this.getTraumaLabel(mapping.traumaType);

        // Position based on mapping
        traumaEl.style.left = `${mapping.position * 100}%`;

        traumaMapping.appendChild(traumaEl);
      });
    }

    sliderContainer.appendChild(traumaMapping);

    // Create description that updates as slider moves
    const description = document.createElement('div');
    description.className = 'temporal-description';
    sliderContainer.appendChild(description);

    // Update description based on slider position
    const updateDescription = () => {
      const value = parseInt(slider.value);
      const normalizedValue = value / 100;

      // Find closest option based on value
      let closestOption = item.options[0];
      let minDistance = Math.abs(normalizedValue - item.options[0].value);

      item.options.forEach((option) => {
        const distance = Math.abs(normalizedValue - option.value);
        if (distance < minDistance) {
          minDistance = distance;
          closestOption = option;
        }
      });

      // Find closest trauma mapping
      let closestTrauma = null;
      let closestTraumaDistance = Infinity;

      if (item.traumaMappings) {
        item.traumaMappings.forEach((mapping) => {
          const distance = Math.abs(normalizedValue - mapping.position);
          if (distance < closestTraumaDistance) {
            closestTraumaDistance = distance;
            closestTrauma = mapping.traumaType;
          }
        });
      }

      // Update description
      description.textContent = closestOption.description;

      // Store response
      this.updateSliderResponse(slider, item);

      // Update active trauma in visualization
      if (closestTrauma) {
        traumaMapping.querySelectorAll('.trauma-mapping').forEach((el) => {
          el.classList.toggle('active', el.dataset.trauma === closestTrauma);
        });
      }
    };

    // Initialize description
    updateDescription();

    // Update on slider change
    slider.addEventListener('input', updateDescription);

    container.appendChild(sliderContainer);
  }

  /**
   * Render temporal options for non-slider questions
   * @param {HTMLElement} container - Container element
   * @param {Object} item - Assessment item data
   */
  renderTemporalOptions(container, item) {
    // Create options container
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'temporal-options-container';

    // Add each option
    item.options.forEach((option) => {
      const optionElement = document.createElement('div');
      optionElement.className = 'assessment-option temporal';
      optionElement.dataset.optionId = option.id;
      optionElement.dataset.traumaType = option.traumaType;
      optionElement.dataset.value = option.value;

      // Create label
      const label = document.createElement('div');
      label.className = 'option-label';
      label.textContent = option.label;
      optionElement.appendChild(label);

      // Create description
      const description = document.createElement('div');
      description.className = 'option-description';
      description.textContent = option.description;
      optionElement.appendChild(description);

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
          value: option.value,
        };

        // Enable next button
        const nextButton = this.containerElement.querySelector('.assessment-next-button');
        if (nextButton) {
          nextButton.disabled = false;
        }
      });

      optionsContainer.appendChild(optionElement);
    });

    container.appendChild(optionsContainer);
  }

  /**
   * Update the response based on slider position
   * @param {HTMLElement} slider - Slider element
   * @param {Object} item - Assessment item
   */
  updateSliderResponse(slider, item) {
    const value = parseInt(slider.value);
    const normalizedValue = value / 100;

    // Find closest trauma mapping
    let closestTrauma = null;
    let closestDistance = Infinity;

    if (item.traumaMappings) {
      item.traumaMappings.forEach((mapping) => {
        const distance = Math.abs(normalizedValue - mapping.position);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestTrauma = mapping.traumaType;
        }
      });
    }

    // Store response
    this.responses[this.currentItemIndex] = {
      itemId: item.id,
      value: normalizedValue,
      traumaType: closestTrauma,
    };
  }

  /**
   * Complete the temporal assessment and process results
   */
  completeAssessment() {
    // Process responses to calculate trauma affinities
    const processedResults = this.processResponses();

    // Publish completion event
    if (window.voidBloom && window.voidBloom.neuralBus) {
      window.voidBloom.neuralBus.publish('vector:processed', {
        vector: 'temporal',
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
          <h3>Temporal Assessment Complete</h3>
          <p>Your temporal perception patterns have been processed.</p>
        </div>
      `;
    }

    console.log('🧿 Temporal Assessment Vector: Assessment completed');

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
      if (response && response.traumaType) {
        // For slider response
        if (response.value !== undefined) {
          affinities[response.traumaType] += 1;

          // Add slight affinity to adjacent trauma types for blending
          const traumaTypes = Object.keys(affinities);
          const index = traumaTypes.indexOf(response.traumaType);

          if (index > 0) {
            affinities[traumaTypes[index - 1]] += 0.3;
          }

          if (index < traumaTypes.length - 1) {
            affinities[traumaTypes[index + 1]] += 0.3;
          }
        } else {
          // For regular option selection
          affinities[response.traumaType] += 1;
        }
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
   * Get a human-readable label for a trauma type
   * @param {string} traumaType - Trauma type identifier
   * @returns {string} Human-readable label
   */
  getTraumaLabel(traumaType) {
    const labels = {
      abandonment: 'Abandonment',
      fragmentation: 'Fragmentation',
      surveillance: 'Surveillance',
      recursion: 'Recursion',
      displacement: 'Displacement',
      dissolution: 'Dissolution',
    };

    return labels[traumaType] || traumaType;
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

  // Initialize the temporal assessment vector
  const temporalAssessmentVector = new TemporalAssessmentVector();

  // Attach to global object
  window.voidBloom.vectors.temporal = temporalAssessmentVector;

  // Initialize vector
  temporalAssessmentVector.initialize();

  console.log('🧿 Temporal Assessment Vector: Initialized and attached to global voidBloom object');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TemporalAssessmentVector };
}
