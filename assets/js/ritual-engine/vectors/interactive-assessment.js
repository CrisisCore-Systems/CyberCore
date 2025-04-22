/**
 * INTERACTIVE-ASSESSMENT.JS
 * Interaction pattern assessment module for trauma encoding
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: trauma-encoded
 * @Version: 1.0.0
 */

/**
 * InteractiveAssessmentVector
 * Evaluates user interaction patterns to determine trauma affinities.
 * This vector has the second highest weight (0.3) in personality formation.
 */
class InteractiveAssessmentVector {
  /**
   *
   */
  constructor() {
    this.vectorWeight = 0.3; // Interactive has second highest weight
    this.assessmentItems = [
      // Interactive assessments evaluate behavior through interactions
      {
        id: 'interactive-01',
        prompt: 'Interact with each pattern. Select those that feel most natural to you.',
        options: [
          {
            id: 'i01-opt1',
            label: 'Reaching Without Response',
            traumaType: 'abandonment',
            interactionType: 'fading',
            description: 'Elements that fade away when approached',
          },
          {
            id: 'i01-opt2',
            label: 'Reassembling Pieces',
            traumaType: 'fragmentation',
            interactionType: 'shatter',
            description: 'Elements that break apart and can be reassembled',
          },
          {
            id: 'i01-opt3',
            label: 'Performing For Observers',
            traumaType: 'surveillance',
            interactionType: 'observe',
            description: 'Elements that follow your movements and record actions',
          },
          {
            id: 'i01-opt4',
            label: 'Repeating Patterns',
            traumaType: 'recursion',
            interactionType: 'loop',
            description: 'Elements that create repeating patterns from your actions',
          },
        ],
      },
      {
        id: 'interactive-02',
        prompt: 'How do you prefer to navigate memory spaces? Test each navigation style.',
        options: [
          {
            id: 'i02-opt1',
            label: 'Dissolving Boundaries',
            traumaType: 'dissolution',
            interactionType: 'blend',
            description: 'Dissolving boundaries between distinct sections',
          },
          {
            id: 'i02-opt2',
            label: 'Relocating Centers',
            traumaType: 'displacement',
            interactionType: 'shift',
            description: 'Shifting focal points while maintaining connections',
          },
          {
            id: 'i02-opt3',
            label: 'Recursive Exploration',
            traumaType: 'recursion',
            interactionType: 'nest',
            description: 'Diving deeper into nested structures',
          },
          {
            id: 'i02-opt4',
            label: 'Observed Movement',
            traumaType: 'surveillance',
            interactionType: 'trace',
            description: 'Moving while being traced and recorded',
          },
        ],
      },
      {
        id: 'interactive-03',
        prompt: 'Test how you prefer to organize information by interacting with these systems.',
        options: [
          {
            id: 'i03-opt1',
            label: 'Fragment and Connect',
            traumaType: 'fragmentation',
            interactionType: 'connect',
            description: 'Breaking into pieces and establishing new connections',
          },
          {
            id: 'i03-opt2',
            label: 'Distance and Retrieve',
            traumaType: 'abandonment',
            interactionType: 'reach',
            description: 'Placing items at a distance and retrieving them',
          },
          {
            id: 'i03-opt3',
            label: 'Blend and Merge',
            traumaType: 'dissolution',
            interactionType: 'merge',
            description: 'Allowing categories to blend into each other',
          },
          {
            id: 'i03-opt4',
            label: 'Reposition and Orient',
            traumaType: 'displacement',
            interactionType: 'reorient',
            description: 'Changing the relationship between connected elements',
          },
        ],
      },
    ];

    this.responses = [];
    this.containerElement = null;
    this.currentItemIndex = 0;
    this.initialized = false;
    this.interactionDemos = new Map();
  }

  /**
   * Initialize the interactive assessment vector
   */
  initialize() {
    if (this.initialized) return;

    // Register with Neural Bus if available
    this.registerWithNeuralBus();

    this.initialized = true;
    console.log('🧿 Interactive Assessment Vector: Initialized');

    return this;
  }

  /**
   * Register with the Neural Bus
   */
  registerWithNeuralBus() {
    if (!window.voidBloom || !window.voidBloom.neuralBus) {
      console.warn('Neural Bus not available for interactive assessment registration');

      // Try again when Neural Bus is available
      window.addEventListener('neuralbus:initialized', () => {
        this.registerWithNeuralBus();
      });

      return;
    }

    // Register with neural bus
    window.voidBloom.neuralBus.register('interactive-assessment-vector', {
      version: '1.0.0',
      capabilities: {
        interactionPatternAssessment: true,
      },
    });

    console.log('🧿 Interactive Assessment Vector: Registered with Neural Bus');
  }

  /**
   * Render the interactive assessment interface into a container
   * @param {HTMLElement} container - DOM container to render the assessment in
   */
  renderAssessment(container) {
    if (!container) {
      console.error('🧿 Interactive Assessment Vector: No container provided for rendering');
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
    itemContainer.className = 'interactive-assessment-item';
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
      optionElement.className = 'assessment-option interactive';
      optionElement.dataset.optionId = option.id;
      optionElement.dataset.traumaType = option.traumaType;
      optionElement.dataset.interactionType = option.interactionType;

      // Create interaction demo container
      const demoContainer = document.createElement('div');
      demoContainer.className = `interaction-demo ${option.traumaType}`;
      demoContainer.dataset.interactionType = option.interactionType;
      optionElement.appendChild(demoContainer);

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

      // Add toggle selection on click
      optionElement.addEventListener('click', () => {
        optionElement.classList.toggle('selected');

        // Update responses
        this.updateResponses();
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

    // Initialize interaction demos
    this.initializeInteractionDemos();
  }

  /**
   * Initialize interactive demos for the current item
   */
  initializeInteractionDemos() {
    const demoElements = this.containerElement.querySelectorAll('.interaction-demo');

    demoElements.forEach((demo) => {
      const interactionType = demo.dataset.interactionType;
      const traumaType = demo.parentElement.dataset.traumaType;

      // Clear any existing interaction handlers
      if (this.interactionDemos.has(demo)) {
        const oldHandlers = this.interactionDemos.get(demo);
        if (oldHandlers.cleanup) {
          oldHandlers.cleanup();
        }
      }

      // Initialize based on interaction type
      switch (interactionType) {
      case 'fading':
        this.initializeFadingInteraction(demo, traumaType);
        break;
      case 'shatter':
        this.initializeShatterInteraction(demo, traumaType);
        break;
      case 'observe':
        this.initializeObserveInteraction(demo, traumaType);
        break;
      case 'loop':
        this.initializeLoopInteraction(demo, traumaType);
        break;
      case 'blend':
        this.initializeBlendInteraction(demo, traumaType);
        break;
      case 'shift':
        this.initializeShiftInteraction(demo, traumaType);
        break;
      case 'nest':
        this.initializeNestInteraction(demo, traumaType);
        break;
      case 'trace':
        this.initializeTraceInteraction(demo, traumaType);
        break;
      case 'connect':
        this.initializeConnectInteraction(demo, traumaType);
        break;
      case 'reach':
        this.initializeReachInteraction(demo, traumaType);
        break;
      case 'merge':
        this.initializeMergeInteraction(demo, traumaType);
        break;
      case 'reorient':
        this.initializeReorientInteraction(demo, traumaType);
        break;
      }
    });
  }

  /**
   * Initialize a fading interaction (abandonment)
   * @param {HTMLElement} element - Demo element
   * @param {string} traumaType - Trauma type
   */
  initializeFadingInteraction(element, traumaType) {
    // Create interactive element that fades away when approached
    element.innerHTML = `<div class="interactive-element fading"></div>`;
    const interactiveEl = element.querySelector('.interactive-element');

    const onMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate distance from center
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

      // Inverse opacity based on proximity (closer = more transparent)
      const maxDistance = Math.sqrt(Math.pow(rect.width / 2, 2) + Math.pow(rect.height / 2, 2));
      const opacity = Math.min(1, distance / maxDistance);

      interactiveEl.style.opacity = opacity;
    };

    const onMouseLeave = () => {
      interactiveEl.style.opacity = 1;
    };

    element.addEventListener('mousemove', onMouseMove);
    element.addEventListener('mouseleave', onMouseLeave);

    // Store handlers for cleanup
    this.interactionDemos.set(element, {
      cleanup: () => {
        element.removeEventListener('mousemove', onMouseMove);
        element.removeEventListener('mouseleave', onMouseLeave);
      },
    });
  }

  /**
   * Initialize a shatter interaction (fragmentation)
   * @param {HTMLElement} element - Demo element
   * @param {string} traumaType - Trauma type
   */
  initializeShatterInteraction(element, traumaType) {
    // Create interactive element that breaks apart and reassembles
    element.innerHTML = `
      <div class="interactive-element shatter">
        <div class="shatter-piece piece1"></div>
        <div class="shatter-piece piece2"></div>
        <div class="shatter-piece piece3"></div>
        <div class="shatter-piece piece4"></div>
      </div>
    `;

    const interactiveEl = element.querySelector('.interactive-element');
    let isShattered = false;

    const onClick = () => {
      if (isShattered) {
        // Reassemble
        interactiveEl.classList.remove('shattered');
        setTimeout(() => {
          isShattered = false;
        }, 500);
      } else {
        // Shatter
        interactiveEl.classList.add('shattered');
        isShattered = true;
      }
    };

    element.addEventListener('click', onClick);

    // Store handlers for cleanup
    this.interactionDemos.set(element, {
      cleanup: () => {
        element.removeEventListener('click', onClick);
      },
    });
  }

  /**
   * Initialize observation interaction (surveillance)
   * @param {HTMLElement} element - Demo element
   * @param {string} traumaType - Trauma type
   */
  initializeObserveInteraction(element, traumaType) {
    // Create interactive element that observes and records user actions
    element.innerHTML = `
      <div class="interactive-element observe">
        <div class="observer"></div>
        <div class="observation-log"></div>
      </div>
    `;

    const observer = element.querySelector('.observer');
    const log = element.querySelector('.observation-log');
    const observations = [];

    const onMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Move observer to follow mouse
      const observerWidth = observer.offsetWidth;
      const observerHeight = observer.offsetHeight;
      observer.style.left = `${Math.max(
        0,
        Math.min(rect.width - observerWidth, x - observerWidth / 2)
      )}px`;
      observer.style.top = `${Math.max(
        0,
        Math.min(rect.height - observerHeight, y - observerHeight / 2)
      )}px`;

      // Record observation
      if (Math.random() < 0.1) {
        // Only record some movements
        observations.push(`${Math.round(x)},${Math.round(y)}`);
        if (observations.length > 5) {
          observations.shift();
        }
        log.textContent = observations.join(' | ');
      }
    };

    element.addEventListener('mousemove', onMouseMove);

    // Store handlers for cleanup
    this.interactionDemos.set(element, {
      cleanup: () => {
        element.removeEventListener('mousemove', onMouseMove);
      },
    });
  }

  /**
   * Initialize a loop interaction (recursion)
   * @param {HTMLElement} element - Demo element
   * @param {string} traumaType - Trauma type
   */
  initializeLoopInteraction(element, traumaType) {
    // Create interactive element that creates patterns from user actions
    element.innerHTML = `
      <div class="interactive-element loop">
        <div class="loop-trace"></div>
      </div>
    `;

    const trace = element.querySelector('.loop-trace');
    const tracePoints = [];
    let loopInterval = null;

    const onMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Add point to trace
      tracePoints.push({ x, y });
      if (tracePoints.length > 20) {
        tracePoints.shift();
      }

      // Update trace visualization
      updateTraceDisplay();
    };

    const updateTraceDisplay = () => {
      if (tracePoints.length < 2) return;

      // Create SVG path
      let pathData = `M ${tracePoints[0].x} ${tracePoints[0].y}`;
      for (let i = 1; i < tracePoints.length; i++) {
        pathData += ` L ${tracePoints[i].x} ${tracePoints[i].y}`;
      }

      trace.innerHTML = `<svg width="100%" height="100%">
        <path d="${pathData}" class="loop-path" />
      </svg>`;
    };

    const startLooping = () => {
      if (loopInterval) clearInterval(loopInterval);

      // Loop back through the recorded points
      let index = 0;
      loopInterval = setInterval(() => {
        if (tracePoints.length > 0) {
          index = (index + 1) % tracePoints.length;
          const point = document.createElement('div');
          point.className = 'echo-point';
          point.style.left = `${tracePoints[index].x}px`;
          point.style.top = `${tracePoints[index].y}px`;
          element.appendChild(point);

          // Remove after animation
          setTimeout(() => {
            point.remove();
          }, 500);
        }
      }, 100);
    };

    element.addEventListener('mousemove', onMouseMove);
    element.addEventListener('mouseenter', startLooping);

    // Store handlers for cleanup
    this.interactionDemos.set(element, {
      cleanup: () => {
        element.removeEventListener('mousemove', onMouseMove);
        element.removeEventListener('mouseenter', startLooping);
        if (loopInterval) clearInterval(loopInterval);
      },
    });
  }

  // Additional interaction initializers would be implemented similarly

  /**
   * Placeholder for other interaction initializers
   * In a full implementation, each interaction type would have its own
   * implementation with appropriate visual effects and behavior
   */
  initializeBlendInteraction(element, traumaType) {
    element.innerHTML = `<div class="interactive-element blend">
      <div class="blend-region region1"></div>
      <div class="blend-region region2"></div>
    </div>`;
  }

  /**
   *
   */
  initializeShiftInteraction(element, traumaType) {
    element.innerHTML = `<div class="interactive-element shift">
      <div class="shift-center"></div>
    </div>`;
  }

  /**
   *
   */
  initializeNestInteraction(element, traumaType) {
    element.innerHTML = `<div class="interactive-element nest">
      <div class="nest-layer layer1"></div>
    </div>`;
  }

  /**
   *
   */
  initializeTraceInteraction(element, traumaType) {
    element.innerHTML = `<div class="interactive-element trace">
      <div class="trace-path"></div>
    </div>`;
  }

  /**
   *
   */
  initializeConnectInteraction(element, traumaType) {
    element.innerHTML = `<div class="interactive-element connect">
      <div class="connect-node node1"></div>
      <div class="connect-node node2"></div>
    </div>`;
  }

  /**
   *
   */
  initializeReachInteraction(element, traumaType) {
    element.innerHTML = `<div class="interactive-element reach">
      <div class="reach-target"></div>
    </div>`;
  }

  /**
   *
   */
  initializeMergeInteraction(element, traumaType) {
    element.innerHTML = `<div class="interactive-element merge">
      <div class="merge-entity entity1"></div>
      <div class="merge-entity entity2"></div>
    </div>`;
  }

  /**
   *
   */
  initializeReorientInteraction(element, traumaType) {
    element.innerHTML = `<div class="interactive-element reorient">
      <div class="reorient-element"></div>
    </div>`;
  }

  /**
   * Update responses based on selected options
   */
  updateResponses() {
    const currentItem = this.assessmentItems[this.currentItemIndex];
    const selectedOptions = this.containerElement.querySelectorAll('.assessment-option.selected');

    // Create response for current item
    this.responses[this.currentItemIndex] = {
      itemId: currentItem.id,
      selections: Array.from(selectedOptions).map((option) => ({
        optionId: option.dataset.optionId,
        traumaType: option.dataset.traumaType,
        value: 1.0,
      })),
    };
  }

  /**
   * Complete the interactive assessment and process results
   */
  completeAssessment() {
    // Process responses to calculate trauma affinities
    const processedResults = this.processResponses();

    // Publish completion event
    if (window.voidBloom && window.voidBloom.neuralBus) {
      window.voidBloom.neuralBus.publish('vector:processed', {
        vector: 'interactive',
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
          <h3>Interactive Assessment Complete</h3>
          <p>Your interaction patterns have been processed.</p>
        </div>
      `;
    }

    console.log('🧿 Interactive Assessment Vector: Assessment completed');

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
      if (response && response.selections && response.selections.length > 0) {
        // Process each selection
        response.selections.forEach((selection) => {
          if (selection.traumaType) {
            affinities[selection.traumaType] += selection.value;
          }
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

    // Count non-null responses with at least one selection
    const validResponses = this.responses.filter(
      (r) => r !== null && r.selections && r.selections.length > 0
    ).length;

    return validResponses / this.assessmentItems.length;
  }

  /**
   * Reset the assessment
   */
  reset() {
    this.responses = [];
    this.currentItemIndex = 0;

    // Cleanup any active interaction demos
    this.interactionDemos.forEach((handlers, element) => {
      if (handlers.cleanup) {
        handlers.cleanup();
      }
    });
    this.interactionDemos.clear();

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

  // Initialize the interactive assessment vector
  const interactiveAssessmentVector = new InteractiveAssessmentVector();

  // Attach to global object
  window.voidBloom.vectors.interactive = interactiveAssessmentVector;

  // Initialize vector
  interactiveAssessmentVector.initialize();

  console.log(
    '🧿 Interactive Assessment Vector: Initialized and attached to global voidBloom object'
  );
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { InteractiveAssessmentVector };
}
