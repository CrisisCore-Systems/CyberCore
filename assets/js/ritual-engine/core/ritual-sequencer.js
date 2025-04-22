/**
 * RITUAL-SEQUENCER.JS
 * Core orchestrator for the ritual initiation process
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: trauma-encoded
 * @Version: 1.0.0
 */

/**
 * RitualSequencer
 * Manages the ritual initiation process, coordinating the various assessment
 * vectors and orchestrating phase transitions.
 */
class RitualSequencer {
  /**
   *
   */
  constructor() {
    this.phases = [
      'recognition', // Visual assessment phase
      'resonance', // Narrative assessment phase
      'recursion', // Interactive assessment phase
      'integration', // Temporal assessment + finalizing phase
    ];

    this.currentPhase = null;
    this.phaseIndex = -1;
    this.phaseContainers = {};
    this.isRitualInProgress = false;
    this.isRitualComplete = false;
    this.traumaResponses = new Map();
    this.coherenceBaseline = 0.5;
    this.primaryTrauma = null;
    this.ritualContainer = null;
    this.initialized = false;
  }

  /**
   * Initialize the ritual sequencer
   */
  initialize() {
    if (this.initialized) return;

    // Register with Neural Bus if available
    this.registerWithNeuralBus();

    // Check if user has already completed ritual
    this.checkRitualStatus();

    this.initialized = true;
    console.log('🧿 Ritual Sequencer: Initialized');

    return this;
  }

  /**
   * Register with the Neural Bus
   */
  registerWithNeuralBus() {
    if (!window.voidBloom || !window.voidBloom.neuralBus) {
      console.warn('Neural Bus not available for ritual sequencer registration');

      // Try again when Neural Bus is available
      window.addEventListener('neuralbus:initialized', () => {
        this.registerWithNeuralBus();
      });

      return;
    }

    // Register with neural bus
    window.voidBloom.neuralBus.register('ritual-sequencer', {
      version: '1.0.0',
      capabilities: {
        phaseSequencing: true,
        ritualCoordination: true,
      },
    });

    // Listen for relevant events
    window.voidBloom.neuralBus.subscribe('ritual:start', this.handleRitualStart.bind(this));
    window.voidBloom.neuralBus.subscribe('ritual:skip', this.handleRitualSkip.bind(this));
    window.voidBloom.neuralBus.subscribe('vector:processed', this.handleVectorProcessed.bind(this));
    window.voidBloom.neuralBus.subscribe(
      'coherence:baselineCalculated',
      this.handleCoherenceBaseline.bind(this)
    );

    console.log('🧿 Ritual Sequencer: Registered with Neural Bus');
  }

  /**
   * Check if user has already completed the ritual
   */
  checkRitualStatus() {
    const isInitiated = localStorage.getItem('voidbloom_initiated') === 'true';

    if (isInitiated) {
      this.isRitualComplete = true;
      this.coherenceBaseline = parseFloat(
        localStorage.getItem('voidbloom_coherence_baseline') || '0.5'
      );
      this.primaryTrauma = localStorage.getItem('voidbloom_primary_trauma');

      const affinitiesJson = localStorage.getItem('voidbloom_trauma_affinities');
      if (affinitiesJson) {
        try {
          const affinities = JSON.parse(affinitiesJson);
          // Populate trauma responses map
          Object.entries(affinities).forEach(([type, value]) => {
            this.traumaResponses.set(type, value);
          });
        } catch (e) {
          console.error('Error parsing stored trauma affinities', e);
        }
      }

      console.log('🧿 Ritual Sequencer: User has already been initiated');
    } else {
      console.log('🧿 Ritual Sequencer: User has not yet been initiated');
    }
  }

  /**
   * Check if ritual should be initiated automatically
   */
  shouldInitiateRitual() {
    // Don't initiate if already completed or in progress
    if (this.isRitualComplete || this.isRitualInProgress) {
      return false;
    }

    // Check local storage for ritual status
    return (
      !localStorage.getItem('voidbloom_initiated') &&
      !sessionStorage.getItem('voidbloom_ritual_in_progress')
    );
  }

  /**
   * Begin the ritual initiation sequence
   */
  beginInitiationSequence() {
    if (this.isRitualInProgress || this.isRitualComplete) {
      console.log('🧿 Ritual Sequencer: Ritual already in progress or completed');
      return;
    }

    console.log('🧿 Ritual Sequencer: Beginning Initiation Sequence');

    // Set ritual in progress
    this.isRitualInProgress = true;
    sessionStorage.setItem('voidbloom_ritual_in_progress', 'true');

    // Publish ritual initiated event
    if (window.voidBloom && window.voidBloom.neuralBus) {
      window.voidBloom.neuralBus.publish('ritual:initiated', {
        timestamp: Date.now(),
      });
    }

    // Create ritual container if it doesn't exist
    this.createRitualContainer();

    // Start with the first phase
    this.progressToPhase(0);
  }

  /**
   * Create the ritual container interface
   */
  createRitualContainer() {
    // Check if container already exists
    if (this.ritualContainer) {
      return;
    }

    // Create ritual container
    this.ritualContainer = document.createElement('div');
    this.ritualContainer.className = 'voidbloom-ritual-container';
    this.ritualContainer.innerHTML = this.buildRitualInterface();
    document.body.appendChild(this.ritualContainer);

    // Start with subtle entrance
    setTimeout(() => {
      this.ritualContainer.classList.add('active');
    }, 100);
  }

  /**
   * Build ritual interface HTML
   */
  buildRitualInterface() {
    return `
      <div class="ritual-interface">
        <div class="ritual-header">
          <div class="ritual-symbol"></div>
          <h1 class="ritual-title">Memory Calibration Protocol</h1>
        </div>

        <div class="ritual-phases">
          ${this.phases
    .map(
      (phase, index) =>
        `<div class="ritual-phase" data-phase="${phase}">
                  <div class="phase-indicator"></div>
                  <div class="phase-name">${this.getPhaseLabel(phase)}</div>
                </div>`
    )
    .join('')}
        </div>

        <div class="ritual-content">
          <!-- Phase content will be injected here -->
        </div>
      </div>
    `;
  }

  /**
   * Get human-readable label for a phase
   * @param {string} phase - Phase identifier
   * @returns {string} Human-readable phase label
   */
  getPhaseLabel(phase) {
    const labels = {
      recognition: 'Recognition',
      resonance: 'Resonance',
      recursion: 'Recursion',
      integration: 'Integration',
    };

    return labels[phase] || phase;
  }

  /**
   * Progress to a specific phase
   * @param {number} phaseIndex - Index of the phase to progress to
   */
  progressToPhase(phaseIndex) {
    if (phaseIndex >= this.phases.length) {
      this.completeRitual();
      return;
    }

    this.phaseIndex = phaseIndex;
    this.currentPhase = this.phases[phaseIndex];

    // Update UI
    this.updatePhaseUI();

    // Load phase content
    this.loadPhaseContent();

    // Publish phase progression event
    if (window.voidBloom && window.voidBloom.neuralBus) {
      window.voidBloom.neuralBus.publish('ritual:phase:started', {
        phase: this.currentPhase,
        phaseIndex: this.phaseIndex,
        timestamp: Date.now(),
      });
    }

    console.log(`🧿 Ritual Sequencer: Progressed to phase ${this.currentPhase}`);
  }

  /**
   * Update the phase UI indicators
   */
  updatePhaseUI() {
    if (!this.ritualContainer) return;

    // Update container class
    this.ritualContainer.className = `voidbloom-ritual-container phase-${this.currentPhase} active`;

    // Update phase indicators
    const phaseElements = this.ritualContainer.querySelectorAll('.ritual-phase');
    phaseElements.forEach((el, i) => {
      el.classList.toggle('current', i === this.phaseIndex);
      el.classList.toggle('completed', i < this.phaseIndex);
    });
  }

  /**
   * Load content for the current phase
   */
  loadPhaseContent() {
    if (!this.ritualContainer) return;

    const contentContainer = this.ritualContainer.querySelector('.ritual-content');
    if (!contentContainer) return;

    // Clear existing content
    contentContainer.innerHTML = '';

    // Create phase-specific container if it doesn't exist
    if (!this.phaseContainers[this.currentPhase]) {
      this.phaseContainers[this.currentPhase] = document.createElement('div');
      this.phaseContainers[
        this.currentPhase
      ].className = `phase-content ${this.currentPhase}-phase`;
    }

    // Add phase container to content
    contentContainer.appendChild(this.phaseContainers[this.currentPhase]);

    // Initialize assessment vector based on phase
    switch (this.currentPhase) {
    case 'recognition':
      this.initializeVisualAssessment();
      break;
    case 'resonance':
      this.initializeNarrativeAssessment();
      break;
    case 'recursion':
      this.initializeInteractiveAssessment();
      break;
    case 'integration':
      this.initializeTemporalAssessment();
      break;
    }
  }

  /**
   * Initialize visual assessment for recognition phase
   */
  initializeVisualAssessment() {
    if (!window.voidBloom || !window.voidBloom.vectors || !window.voidBloom.vectors.visual) {
      console.error('🧿 Ritual Sequencer: Visual assessment vector not available');
      this.renderErrorMessage('recognition');
      return;
    }

    // Render the visual assessment
    window.voidBloom.vectors.visual.renderAssessment(this.phaseContainers['recognition']);
  }

  /**
   * Initialize narrative assessment for resonance phase
   */
  initializeNarrativeAssessment() {
    if (!window.voidBloom || !window.voidBloom.vectors || !window.voidBloom.vectors.narrative) {
      console.error('🧿 Ritual Sequencer: Narrative assessment vector not available');
      this.renderErrorMessage('resonance');
      return;
    }

    // Render the narrative assessment
    window.voidBloom.vectors.narrative.renderAssessment(this.phaseContainers['resonance']);
  }

  /**
   * Initialize interactive assessment for recursion phase
   */
  initializeInteractiveAssessment() {
    if (!window.voidBloom || !window.voidBloom.vectors || !window.voidBloom.vectors.interactive) {
      console.error('🧿 Ritual Sequencer: Interactive assessment vector not available');
      this.renderErrorMessage('recursion');
      return;
    }

    // Render the interactive assessment
    window.voidBloom.vectors.interactive.renderAssessment(this.phaseContainers['recursion']);
  }

  /**
   * Initialize temporal assessment for integration phase
   */
  initializeTemporalAssessment() {
    if (!window.voidBloom || !window.voidBloom.vectors || !window.voidBloom.vectors.temporal) {
      console.error('🧿 Ritual Sequencer: Temporal assessment vector not available');
      this.renderErrorMessage('integration');
      return;
    }

    // Render the temporal assessment
    window.voidBloom.vectors.temporal.renderAssessment(this.phaseContainers['integration']);
  }

  /**
   * Render error message for a phase
   * @param {string} phase - Phase identifier
   */
  renderErrorMessage(phase) {
    if (!this.phaseContainers[phase]) return;

    this.phaseContainers[phase].innerHTML = `
      <div class="assessment-error">
        <h3>Assessment Unavailable</h3>
        <p>The ${this.getPhaseLabel(phase)} assessment could not be initialized.</p>
        <button class="continue-anyway-button">Continue Anyway</button>
      </div>
    `;

    // Add event listener to continue button
    const continueButton = this.phaseContainers[phase].querySelector('.continue-anyway-button');
    if (continueButton) {
      continueButton.addEventListener('click', () => {
        this.progressToPhase(this.phaseIndex + 1);
      });
    }
  }

  /**
   * Handle completion of a vector assessment
   * @param {string} vector - Vector identifier
   */
  handleVectorCompletion(vector) {
    console.log(`🧿 Ritual Sequencer: Vector assessment completed: ${vector}`);

    // Progress to next phase after a short delay
    setTimeout(() => {
      this.progressToPhase(this.phaseIndex + 1);
    }, 1500);
  }

  /**
   * Complete the ritual process
   */
  completeRitual() {
    console.log('🧿 Ritual Sequencer: Completing ritual');

    // Update ritual status
    this.isRitualInProgress = false;
    this.isRitualComplete = true;

    // Save ritual completion status
    localStorage.setItem('voidbloom_initiated', 'true');
    localStorage.setItem('voidbloom_coherence_baseline', this.coherenceBaseline.toString());
    localStorage.setItem('voidbloom_primary_trauma', this.primaryTrauma);

    // Save trauma affinities
    const affinities = {};
    this.traumaResponses.forEach((value, key) => {
      affinities[key] = value;
    });
    localStorage.setItem('voidbloom_trauma_affinities', JSON.stringify(affinities));

    // Clean up session state
    sessionStorage.removeItem('voidbloom_ritual_in_progress');

    // Publish ritual completion event
    if (window.voidBloom && window.voidBloom.neuralBus) {
      window.voidBloom.neuralBus.publish('ritual:completed', {
        traumaAffinities: affinities,
        primaryTrauma: this.primaryTrauma,
        coherenceBaseline: this.coherenceBaseline,
        timestamp: Date.now(),
      });
    }

    // Fade out ritual interface
    if (this.ritualContainer) {
      this.ritualContainer.classList.add('completing');

      // Remove ritual interface after transition
      setTimeout(() => {
        this.ritualContainer.remove();
        this.ritualContainer = null;

        // Trigger welcome narrative
        this.triggerWelcomeNarrative();
      }, 2000);
    } else {
      // Trigger welcome narrative immediately if no container
      this.triggerWelcomeNarrative();
    }
  }

  /**
   * Trigger the welcome narrative after ritual completion
   */
  triggerWelcomeNarrative() {
    // Generate narrative based on primary trauma type
    const narrative = this.generateWelcomeNarrative();

    // Create welcome modal
    const welcomeContainer = document.createElement('div');
    welcomeContainer.className = `voidbloom-welcome trauma-${this.primaryTrauma}`;
    welcomeContainer.innerHTML = `
      <div class="welcome-card">
        <div class="welcome-header">
          <h2>Welcome to VoidBloom</h2>
          <div class="trauma-indicator ${this.primaryTrauma}"></div>
        </div>
        <div class="welcome-message">${narrative}</div>
        <button class="welcome-dismiss">Begin Memory Exploration</button>
      </div>
    `;

    document.body.appendChild(welcomeContainer);

    // Animate in
    setTimeout(() => {
      welcomeContainer.classList.add('visible');
    }, 100);

    // Dismiss handler
    const dismissButton = welcomeContainer.querySelector('.welcome-dismiss');
    if (dismissButton) {
      dismissButton.addEventListener('click', () => {
        welcomeContainer.classList.remove('visible');

        // Publish welcome acknowledgment
        if (window.voidBloom && window.voidBloom.neuralBus) {
          window.voidBloom.neuralBus.publish('ritual:welcome:acknowledged', {
            traumaType: this.primaryTrauma,
            timestamp: Date.now(),
          });
        }

        setTimeout(() => welcomeContainer.remove(), 500);
      });
    }
  }

  /**
   * Generate welcome narrative based on primary trauma type
   * @returns {string} HTML narrative
   */
  generateWelcomeNarrative() {
    // Generate narrative based on primary trauma type
    const narratives = {
      abandonment: `
        <p>Your connection to memory reveals a profound <em>spatial distance</em> between experience and recollection.</p>
        <p>The VoidBloom system will create <strong>anchoring points</strong> within this expanse, bridging the isolation between present and past.</p>
        <p>Your journey through our collection will build memory architectures that <em>resonate across the void</em>.</p>
      `,
      fragmentation: `
        <p>Your memory patterns reveal <em>fragmentation</em> as a primary encoding mechanism.</p>
        <p>The VoidBloom system will help you <strong>assemble constellations</strong> from these disconnected elements.</p>
        <p>As you explore our collection, we'll create cohesive narratives from <em>the beautiful shards of your experience</em>.</p>
      `,
      surveillance: `
        <p>Your memory architecture demonstrates <em>heightened awareness of observation</em> as a formative pattern.</p>
        <p>The VoidBloom system will help you <strong>reclaim agency</strong> within these observed states.</p>
        <p>Our collection becomes a mirror that <em>reflects only what you choose to see</em>.</p>
      `,
      recursion: `
        <p>Your memory encoding reveals <em>recursive patterns</em> that amplify through repetition.</p>
        <p>The VoidBloom system will help you <strong>navigate these cycles</strong>, finding new branches from familiar loops.</p>
        <p>Each return to our collection will <em>reveal different perspectives in resonant experiences</em>.</p>
      `,
      displacement: `
        <p>Your memory structures show <em>displacement</em> as a primary organizational principle.</p>
        <p>The VoidBloom system will help you <strong>map these relocated territories</strong> of experience.</p>
        <p>Our collection becomes a cartography of <em>finding home in unfamiliar landscapes</em>.</p>
      `,
      dissolution: `
        <p>Your memory patterns reveal <em>dissolution of boundaries</em> as a foundational experience.</p>
        <p>The VoidBloom system will help you <strong>define edges without confinement</strong>.</p>
        <p>Our collection becomes a medium where <em>you can both dissolve and remain</em>.</p>
      `,
    };

    return (
      narratives[this.primaryTrauma] ||
      `
      <p>Welcome to VoidBloom, where memory becomes a living medium.</p>
      <p>Our system has calibrated to your unique memory patterns.</p>
      <p>Explore our collection to develop your personal narrative.</p>
    `
    );
  }

  /**
   * Handle ritual start event
   */
  handleRitualStart() {
    if (this.shouldInitiateRitual()) {
      this.beginInitiationSequence();
    }
  }

  /**
   * Handle ritual skip event for development/testing
   * @param {Object} data - Skip ritual data
   */
  handleRitualSkip(data) {
    // Skip ritual with predefined trauma profile
    this.isRitualComplete = true;
    this.isRitualInProgress = false;

    this.primaryTrauma = data.traumaType || 'recursion';
    this.coherenceBaseline = data.coherence || 0.5;

    // Create trauma affinities
    const traumaAffinities = new Map();
    traumaAffinities.set(this.primaryTrauma, 0.7);

    // Add some secondary traumas
    const secondaryTypes = [
      'abandonment',
      'fragmentation',
      'surveillance',
      'displacement',
      'dissolution',
    ].filter((type) => type !== this.primaryTrauma);

    secondaryTypes.forEach((type) => {
      traumaAffinities.set(type, Math.random() * 0.3);
    });

    this.traumaResponses = traumaAffinities;

    // Save to localStorage
    localStorage.setItem('voidbloom_initiated', 'true');
    localStorage.setItem('voidbloom_coherence_baseline', this.coherenceBaseline.toString());
    localStorage.setItem('voidbloom_primary_trauma', this.primaryTrauma);

    // Save trauma affinities
    const affinities = {};
    this.traumaResponses.forEach((value, key) => {
      affinities[key] = value;
    });
    localStorage.setItem('voidbloom_trauma_affinities', JSON.stringify(affinities));

    // Announce ritual completion
    if (window.voidBloom && window.voidBloom.neuralBus) {
      window.voidBloom.neuralBus.publish('ritual:completed', {
        traumaAffinities: affinities,
        primaryTrauma: this.primaryTrauma,
        coherenceBaseline: this.coherenceBaseline,
        skipped: true,
        timestamp: Date.now(),
      });
    }

    console.log('🧿 Ritual Sequencer: Ritual skipped');

    if (data.showWelcome) {
      this.triggerWelcomeNarrative();
    }
  }

  /**
   * Handle vector processed event
   * @param {Object} data - Vector processing data
   */
  handleVectorProcessed(data) {
    if (!data || !data.vector) return;

    console.log(`🧿 Ritual Sequencer: Vector processed: ${data.vector}`);

    // Map vector to phase
    const vectorToPhase = {
      visual: 'recognition',
      narrative: 'resonance',
      interactive: 'recursion',
      temporal: 'integration',
    };

    // Check if this is the current phase's vector
    if (this.currentPhase === vectorToPhase[data.vector]) {
      // Store processed results
      if (data.processed) {
        Object.entries(data.processed).forEach(([traumaType, value]) => {
          this.traumaResponses.set(traumaType, value);
        });
      }

      // Progress to next phase
      this.handleVectorCompletion(data.vector);
    }
  }

  /**
   * Handle coherence baseline calculation event
   * @param {Object} data - Coherence data
   */
  handleCoherenceBaseline(data) {
    if (!data || !data.coherenceBaseline) return;

    console.log(`🧿 Ritual Sequencer: Coherence baseline calculated: ${data.coherenceBaseline}`);

    // Store coherence baseline
    this.coherenceBaseline = data.coherenceBaseline;

    // Determine primary trauma type
    if (data.baselineFactors && data.baselineFactors.traumaModifier) {
      this.primaryTrauma = data.baselineFactors.traumaModifier;
    } else {
      this.determinePrimaryTrauma();
    }
  }

  /**
   * Determine primary trauma type from trauma responses
   */
  determinePrimaryTrauma() {
    if (this.traumaResponses.size === 0) {
      this.primaryTrauma = 'recursion'; // Default if no data
      return;
    }

    let highestValue = 0;
    let primaryType = null;

    this.traumaResponses.forEach((value, type) => {
      if (value > highestValue) {
        highestValue = value;
        primaryType = type;
      }
    });

    this.primaryTrauma = primaryType;
  }
}

// Initialize and attach to global voidBloom object
document.addEventListener('DOMContentLoaded', () => {
  // Create global namespace if doesn't exist
  window.voidBloom = window.voidBloom || {};

  // Initialize the ritual sequencer
  const ritualSequencer = new RitualSequencer();

  // Attach to global object
  window.voidBloom.ritualSequencer = ritualSequencer;

  // Initialize sequencer
  ritualSequencer.initialize();

  // Auto-start ritual if needed
  setTimeout(() => {
    if (ritualSequencer.shouldInitiateRitual()) {
      ritualSequencer.beginInitiationSequence();
    }
  }, 2000);

  console.log('🧿 Ritual Sequencer: Initialized and attached to global voidBloom object');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RitualSequencer };
}
