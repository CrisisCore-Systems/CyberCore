/**
 * VoidBloom Ritual Engine
 * VERSION: 3.8.5
 *
 * Initiates users into the trauma encoding framework through
 * calibrated experience mapping and coherence anchoring
 */

class RitualEngine {
  constructor() {
    this.initiationPhases = ['recognition', 'resonance', 'recursion', 'integration'];
    this.currentPhase = 0;
    this.traumaResponses = new Map();
    this.coherenceBaseline = 0.5;
    this.narrativeSeeds = [];

    // Trauma assessment vectors - calibrate user's inherent affinities
    this.assessmentVectors = {
      visual: { weight: 0.4, responses: [] },
      interactive: { weight: 0.3, responses: [] },
      narrative: { weight: 0.2, responses: [] },
      temporal: { weight: 0.1, responses: [] },
    };

    this.bindEvents();
  }

  bindEvents() {
    document.addEventListener('DOMContentLoaded', () => {
      if (this.shouldInitiateRitual()) {
        this.beginInitiationSequence();
      }
    });
  }

  shouldInitiateRitual() {
    // Check if user has completed ritual or needs initiation
    return (
      !localStorage.getItem('voidbloom_initiated') &&
      !sessionStorage.getItem('voidbloom_ritual_in_progress')
    );
  }

  beginInitiationSequence() {
    console.log('🧿 Ritual Initiation Sequence: Beginning');
    sessionStorage.setItem('voidbloom_ritual_in_progress', 'true');

    // Create ritual container
    const ritualContainer = document.createElement('div');
    ritualContainer.className = 'voidbloom-ritual-container phase-recognition';
    ritualContainer.innerHTML = this.buildRitualInterface();
    document.body.appendChild(ritualContainer);

    // Start with subtle entrance
    setTimeout(() => {
      ritualContainer.classList.add('active');
      this.progressToPhase(0);
    }, 1000);
  }

  buildRitualInterface() {
    return `
      <div class="ritual-interface">
        <div class="ritual-header">
          <div class="ritual-symbol"></div>
          <h1 class="ritual-title">Memory Calibration Protocol</h1>
        </div>

        <div class="ritual-phases">
          ${this.initiationPhases
            .map(
              (phase, index) =>
                `<div class="ritual-phase ${index === 0 ? 'current' : ''}" data-phase="${phase}">
              <div class="phase-indicator"></div>
              <div class="phase-name">${phase}</div>
            </div>`
            )
            .join('')}
        </div>

        <div class="ritual-content">
          <!-- Phase content will be injected here -->
        </div>

        <div class="ritual-actions">
          <button class="ritual-button next-button">Proceed</button>
        </div>
      </div>
    `;
  }

  progressToPhase(phaseIndex) {
    if (phaseIndex >= this.initiationPhases.length) {
      this.completeRitual();
      return;
    }

    this.currentPhase = phaseIndex;
    const phaseName = this.initiationPhases[phaseIndex];
    const container = document.querySelector('.voidbloom-ritual-container');

    // Update phase UI
    container.className = `voidbloom-ritual-container phase-${phaseName}`;
    document.querySelectorAll('.ritual-phase').forEach((el, i) => {
      el.classList.toggle('current', i === phaseIndex);
      el.classList.toggle('completed', i < phaseIndex);
    });

    // Load phase content
    const contentContainer = document.querySelector('.ritual-content');

    switch (phaseName) {
      case 'recognition':
        this.loadRecognitionPhase(contentContainer);
        break;
      case 'resonance':
        this.loadResonancePhase(contentContainer);
        break;
      case 'recursion':
        this.loadRecursionPhase(contentContainer);
        break;
      case 'integration':
        this.loadIntegrationPhase(contentContainer);
        break;
    }

    // Update button
    const nextButton = document.querySelector('.next-button');
    nextButton.textContent =
      phaseIndex === this.initiationPhases.length - 1 ? 'Complete' : 'Continue';

    // Bind next button
    nextButton.onclick = () => {
      this.collectPhaseData(phaseName);
      this.progressToPhase(phaseIndex + 1);
    };
  }

  loadRecognitionPhase(container) {
    container.innerHTML = `
      <div class="phase-content recognition-phase">
        <h2>Trauma Recognition</h2>
        <p>Select images that resonate with your experience of memory:</p>

        <div class="trauma-selection-grid">
          <div class="trauma-selection" data-trauma="abandonment" data-vector="visual">
            <div class="selection-image abandonment"></div>
            <div class="selection-label">Isolation in Vastness</div>
          </div>
          <div class="trauma-selection" data-trauma="fragmentation" data-vector="visual">
            <div class="selection-image fragmentation"></div>
            <div class="selection-label">Dissolution of Self</div>
          </div>
          <div class="trauma-selection" data-trauma="surveillance" data-vector="visual">
            <div class="selection-image surveillance"></div>
            <div class="selection-label">Observed Experience</div>
          </div>
          <div class="trauma-selection" data-trauma="recursion" data-vector="visual">
            <div class="selection-image recursion"></div>
            <div class="selection-label">Cyclical Patterns</div>
          </div>
          <div class="trauma-selection" data-trauma="displacement" data-vector="visual">
            <div class="selection-image displacement"></div>
            <div class="selection-label">Dislocation of Perception</div>
          </div>
          <div class="trauma-selection" data-trauma="dissolution" data-vector="visual">
            <div class="selection-image dissolution"></div>
            <div class="selection-label">Fading Boundaries</div>
          </div>
        </div>

        <p class="selection-instruction">Select all that apply. These will calibrate your visual recognition system.</p>
      </div>
    `;

    // Bind selection events
    container.querySelectorAll('.trauma-selection').forEach((selection) => {
      selection.addEventListener('click', () => {
        selection.classList.toggle('selected');
      });
    });
  }

  loadResonancePhase(container) {
    container.innerHTML = `
      <div class="phase-content resonance-phase">
        <h2>Memory Resonance</h2>
        <p>How would you describe your relationship with memory?</p>

        <div class="trauma-narrative-selections">
          <div class="trauma-selection narrative" data-trauma="abandonment" data-vector="narrative">
            <div class="selection-heading">Abandoned Archives</div>
            <p>My memories feel distant and unreachable, as though they exist in a vast space I cannot navigate.</p>
          </div>
          <div class="trauma-selection narrative" data-trauma="fragmentation" data-vector="narrative">
            <div class="selection-heading">Shattered Reflections</div>
            <p>My memories appear in disconnected fragments, breaking apart when I try to hold them together.</p>
          </div>
          <div class="trauma-selection narrative" data-trauma="surveillance" data-vector="narrative">
            <div class="selection-heading">Recorded Without Consent</div>
            <p>My memories feel like they're being watched and analyzed by systems beyond my control.</p>
          </div>
          <div class="trauma-selection narrative" data-trauma="recursion" data-vector="narrative">
            <div class="selection-heading">Recursive Loops</div>
            <p>My memories repeat in patterns, creating echoes that amplify certain experiences.</p>
          </div>
          <div class="trauma-selection narrative" data-trauma="displacement" data-vector="narrative">
            <div class="selection-heading">Misplaced Origins</div>
            <p>My memories feel as though they've been relocated, transplanted from their original context.</p>
          </div>
          <div class="trauma-selection narrative" data-trauma="dissolution" data-vector="narrative">
            <div class="selection-heading">Dissolving Certainty</div>
            <p>My memories seem to dissolve at the edges, blending with imagination or others' accounts.</p>
          </div>
        </div>

        <p class="selection-instruction">Select the narrative that most resonates with your experience.</p>
      </div>
    `;

    // Bind selection events - allow only one selection for narrative
    const narrativeSelections = container.querySelectorAll('.trauma-selection.narrative');
    narrativeSelections.forEach((selection) => {
      selection.addEventListener('click', () => {
        narrativeSelections.forEach((s) => s.classList.remove('selected'));
        selection.classList.add('selected');
      });
    });
  }

  loadRecursionPhase(container) {
    container.innerHTML = `
      <div class="phase-content recursion-phase">
        <h2>Pattern Recognition</h2>
        <p>Select the interaction patterns that feel familiar to you:</p>

        <div class="trauma-interaction-selections">
          <div class="trauma-selection interaction" data-trauma="abandonment" data-vector="interactive">
            <div class="interaction-demo abandonment"></div>
            <div class="selection-label">Reaching Without Response</div>
          </div>
          <div class="trauma-selection interaction" data-trauma="fragmentation" data-vector="interactive">
            <div class="interaction-demo fragmentation"></div>
            <div class="selection-label">Reassembling Pieces</div>
          </div>
          <div class="trauma-selection interaction" data-trauma="surveillance" data-vector="interactive">
            <div class="interaction-demo surveillance"></div>
            <div class="selection-label">Performing For Observers</div>
          </div>
          <div class="trauma-selection interaction" data-trauma="recursion" data-vector="interactive">
            <div class="interaction-demo recursion"></div>
            <div class="selection-label">Repeating Patterns</div>
          </div>
          <div class="trauma-selection interaction" data-trauma="displacement" data-vector="interactive">
            <div class="interaction-demo displacement"></div>
            <div class="selection-label">Relocating Centers</div>
          </div>
          <div class="trauma-selection interaction" data-trauma="dissolution" data-vector="interactive">
            <div class="interaction-demo dissolution"></div>
            <div class="selection-label">Dissolving Boundaries</div>
          </div>
        </div>

        <p class="selection-instruction">Interact with each pattern. Select those that feel most natural to you.</p>
      </div>
    `;

    // Set up interaction demos
    this.initializeInteractionDemos(container);

    // Bind selection events
    container.querySelectorAll('.trauma-selection.interaction').forEach((selection) => {
      selection.addEventListener('click', () => {
        selection.classList.toggle('selected');
      });
    });
  }

  initializeInteractionDemos(container) {
    // Basic interaction demos - these would be more sophisticated in production
    const demos = container.querySelectorAll('.interaction-demo');

    // Abandonment - fading element that responds to hover by moving away
    const abandonmentDemo = container.querySelector('.interaction-demo.abandonment');
    if (abandonmentDemo) {
      abandonmentDemo.addEventListener('mouseover', function () {
        this.classList.add('avoiding');
        setTimeout(() => this.classList.remove('avoiding'), 1000);
      });
    }

    // Fragmentation - breaks into pieces on click
    const fragmentationDemo = container.querySelector('.interaction-demo.fragmentation');
    if (fragmentationDemo) {
      fragmentationDemo.addEventListener('click', function () {
        this.classList.add('fragmenting');
        setTimeout(() => this.classList.remove('fragmenting'), 1500);
      });
    }

    // More interaction patterns would be implemented here
  }

  loadIntegrationPhase(container) {
    container.innerHTML = `
      <div class="phase-content integration-phase">
        <h2>Temporal Integration</h2>
        <p>How do you experience the passage of time in relation to memory?</p>

        <div class="temporal-slider-container">
          <div class="temporal-slider-labels">
            <span>Contracted</span>
            <span>Linear</span>
            <span>Expanded</span>
          </div>
          <input type="range" min="0" max="100" value="50" class="temporal-slider" id="timePerceptionSlider">

          <div class="temporal-trauma-mapping">
            <div class="trauma-mapping" data-trauma="displacement">Displacement</div>
            <div class="trauma-mapping" data-trauma="recursion">Recursion</div>
            <div class="trauma-mapping" data-trauma="abandonment">Abandonment</div>
            <div class="trauma-mapping" data-trauma="surveillance">Surveillance</div>
            <div class="trauma-mapping" data-trauma="fragmentation">Fragmentation</div>
            <div class="trauma-mapping" data-trauma="dissolution">Dissolution</div>
          </div>
        </div>

        <div class="calibration-summary">
          <h3>Calibration Summary</h3>
          <p>Based on your responses, we've identified these primary memory patterns:</p>
          <div class="trauma-summary-container">
            <!-- Will be populated dynamically -->
          </div>
        </div>
      </div>
    `;

    // Set up temporal slider
    const slider = container.querySelector('.temporal-slider');
    const mappingContainer = container.querySelector('.temporal-trauma-mapping');

    if (slider && mappingContainer) {
      slider.addEventListener('input', () => {
        const value = parseInt(slider.value);
        const position = (value / 100) * (mappingContainer.offsetWidth - 30);

        // Find closest trauma type based on position
        const traumaMappings = container.querySelectorAll('.trauma-mapping');
        let closestTrauma = null;
        let closestDistance = Infinity;

        traumaMappings.forEach((traumaEl) => {
          const rect = traumaEl.getBoundingClientRect();
          const distance = Math.abs(rect.left + rect.width / 2 - position);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestTrauma = traumaEl.getAttribute('data-trauma');
          }
        });

        // Record temporal response
        if (closestTrauma) {
          this.assessmentVectors.temporal.responses = [
            {
              traumaType: closestTrauma,
              value: value / 100,
            },
          ];
        }
      });
    }

    // Generate and display summary based on selections so far
    this.generateCalibrationSummary(container.querySelector('.trauma-summary-container'));
  }

  generateCalibrationSummary(container) {
    // Calculate trauma affinities based on selections
    const affinities = {};

    // Process all vectors
    Object.entries(this.assessmentVectors).forEach(([vectorName, vector]) => {
      vector.responses.forEach((response) => {
        if (!response.traumaType) return;

        if (!affinities[response.traumaType]) {
          affinities[response.traumaType] = 0;
        }

        affinities[response.traumaType] += vector.weight * (response.value || 1);
      });
    });

    // Add all selected trauma types from the DOM
    document.querySelectorAll('.trauma-selection.selected').forEach((selection) => {
      const traumaType = selection.getAttribute('data-trauma');
      const vector = selection.getAttribute('data-vector');
      const vectorWeight = this.assessmentVectors[vector]?.weight || 0.25;

      if (!affinities[traumaType]) {
        affinities[traumaType] = 0;
      }

      affinities[traumaType] += vectorWeight;
    });

    // Normalize values
    let total = 0;
    Object.values(affinities).forEach((v) => (total += v));

    const normalizedAffinities = {};
    Object.entries(affinities).forEach(([trauma, value]) => {
      normalizedAffinities[trauma] = value / total;
    });

    // Store for final processing
    this.traumaAffinities = normalizedAffinities;

    // Get top 3 trauma types
    const sortedTraumas = Object.entries(normalizedAffinities)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    // Generate summary HTML
    let summaryHTML = '';
    sortedTraumas.forEach(([trauma, value], index) => {
      const percentage = Math.round(value * 100);
      summaryHTML += `
        <div class="trauma-summary ${trauma} ${index === 0 ? 'primary' : 'secondary'}">
          <div class="trauma-label">${this.getTraumaLabel(trauma)}</div>
          <div class="trauma-bar">
            <div class="trauma-bar-fill" style="width: ${percentage}%"></div>
          </div>
          <div class="trauma-percentage">${percentage}%</div>
        </div>
      `;
    });

    // Update container
    if (container) {
      container.innerHTML = summaryHTML;
    }
  }

  getTraumaLabel(traumaType) {
    const labels = {
      abandonment: 'Abandonment Encoding',
      fragmentation: 'Fragmentation Pattern',
      surveillance: 'Surveillance Protocol',
      recursion: 'Recursive Loop',
      displacement: 'Displacement Vectors',
      dissolution: 'Boundary Dissolution',
    };

    return labels[traumaType] || traumaType;
  }

  collectPhaseData(phaseName) {
    // Collect data from the current phase
    switch (phaseName) {
      case 'recognition':
        this.collectRecognitionData();
        break;
      case 'resonance':
        this.collectResonanceData();
        break;
      case 'recursion':
        this.collectRecursionData();
        break;
      case 'integration':
        this.collectIntegrationData();
        break;
    }

    // Transmit phase completion to Neural Bus
    if (typeof NeuralBus !== 'undefined') {
      NeuralBus.publish('ritual:phase:completed', {
        phase: phaseName,
        phaseIndex: this.currentPhase,
        timestamp: Date.now(),
      });
    }
  }

  collectRecognitionData() {
    // Collect visual trauma selections
    const visualSelections = document.querySelectorAll(
      '.trauma-selection[data-vector="visual"].selected'
    );
    this.assessmentVectors.visual.responses = Array.from(visualSelections).map((el) => ({
      traumaType: el.getAttribute('data-trauma'),
      value: 1,
    }));
  }

  collectResonanceData() {
    // Collect narrative trauma selection (only one should be selected)
    const narrativeSelection = document.querySelector(
      '.trauma-selection[data-vector="narrative"].selected'
    );
    if (narrativeSelection) {
      this.assessmentVectors.narrative.responses = [
        {
          traumaType: narrativeSelection.getAttribute('data-trauma'),
          value: 1,
        },
      ];
    }
  }

  collectRecursionData() {
    // Collect interactive trauma selections
    const interactiveSelections = document.querySelectorAll(
      '.trauma-selection[data-vector="interactive"].selected'
    );
    this.assessmentVectors.interactive.responses = Array.from(interactiveSelections).map((el) => ({
      traumaType: el.getAttribute('data-trauma'),
      value: 1,
    }));
  }

  collectIntegrationData() {
    // Temporal data already collected via slider
    // Final calculations for trauma affinities are done

    // Calculate coherence baseline based on response consistency
    this.calculateCoherenceBaseline();
  }

  calculateCoherenceBaseline() {
    // Calculate coherence based on consistency of selections
    // Higher consistency = higher baseline coherence

    // Get count of unique trauma types selected
    const traumaTypesSelected = new Set();

    Object.values(this.assessmentVectors).forEach((vector) => {
      vector.responses.forEach((response) => {
        if (response.traumaType) {
          traumaTypesSelected.add(response.traumaType);
        }
      });
    });

    // More focused selection = higher coherence
    const traumaTypeCount = traumaTypesSelected.size;
    const maxTypes = 6; // Total possible trauma types

    // Base coherence starts higher for more focused selection
    const focusFactor = 1 - traumaTypeCount / maxTypes;

    // Add some randomness for natural variation
    const randomFactor = 0.1 + Math.random() * 0.1;

    // Calculate final coherence (range 0.4 to 0.8)
    this.coherenceBaseline = 0.4 + focusFactor * 0.4 + randomFactor;
  }

  completeRitual() {
    // Find primary trauma type
    let primaryTrauma = null;
    let highestAffinity = 0;

    Object.entries(this.traumaAffinities).forEach(([trauma, affinity]) => {
      if (affinity > highestAffinity) {
        primaryTrauma = trauma;
        highestAffinity = affinity;
      }
    });

    // Save ritual results
    localStorage.setItem('voidbloom_initiated', 'true');
    localStorage.setItem('voidbloom_trauma_affinities', JSON.stringify(this.traumaAffinities));
    localStorage.setItem('voidbloom_primary_trauma', primaryTrauma);
    localStorage.setItem('voidbloom_coherence_baseline', this.coherenceBaseline.toString());

    // Clean up session state
    sessionStorage.removeItem('voidbloom_ritual_in_progress');

    // Fade out ritual interface
    const container = document.querySelector('.voidbloom-ritual-container');
    container.classList.add('completing');

    // Announce ritual completion via Neural Bus
    if (typeof NeuralBus !== 'undefined') {
      NeuralBus.publish('ritual:completed', {
        traumaAffinities: this.traumaAffinities,
        primaryTrauma: primaryTrauma,
        coherenceBaseline: this.coherenceBaseline,
        timestamp: Date.now(),
      });
    }

    // Remove ritual interface after transition
    setTimeout(() => {
      container.remove();
      this.triggerWelcomeNarrative(primaryTrauma);
    }, 2000);
  }

  triggerWelcomeNarrative(traumaType) {
    // Generate narrative based on trauma type
    const narrative = this.generateNarrative(traumaType);

    // Create welcome modal
    const welcomeContainer = document.createElement('div');
    welcomeContainer.className = `voidbloom-welcome trauma-${traumaType}`;
    welcomeContainer.innerHTML = `
      <div class="welcome-card">
        <div class="welcome-header">
          <h2>Welcome to VoidBloom</h2>
          <div class="trauma-indicator ${traumaType}"></div>
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
    welcomeContainer.querySelector('.welcome-dismiss').addEventListener('click', () => {
      welcomeContainer.classList.remove('visible');

      // Publish the welcome acknowledgment
      if (typeof NeuralBus !== 'undefined') {
        NeuralBus.publish('ritual:welcome:acknowledged', {
          traumaType: traumaType,
          timestamp: Date.now(),
        });
      }

      setTimeout(() => welcomeContainer.remove(), 500);
    });
  }

  generateNarrative(traumaType) {
    // Simple narratives based on trauma type
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
      narratives[traumaType] ||
      `
      <p>Welcome to VoidBloom, where memory becomes a living medium.</p>
      <p>Our system has calibrated to your unique memory patterns.</p>
      <p>Explore our collection to develop your personal narrative.</p>
    `
    );
  }

  // Connect to Neural Bus for event handling
  connectToNeuralBus() {
    if (typeof NeuralBus === 'undefined') return;

    // Register with Neural Bus
    const { nonce } = NeuralBus.register('ritual-engine', {
      version: '3.8.5',
      capabilities: {
        traumaAssessment: true,
        coherenceCalibration: true,
        narrativeGeneration: true,
      },
    });

    this.nonce = nonce;

    // Subscribe to relevant events
    NeuralBus.subscribe('user:new', this.handleNewUser.bind(this));
    NeuralBus.subscribe('ritual:start', this.handleRitualStart.bind(this));
    NeuralBus.subscribe('ritual:skip', this.handleRitualSkip.bind(this));

    console.log('🧿 Ritual Engine connected to Neural Bus');
  }

  handleNewUser(data) {
    // Check if we should auto-start the ritual for new users
    if (data.autoInitiate && this.shouldInitiateRitual()) {
      this.beginInitiationSequence();
    }
  }

  handleRitualStart() {
    if (this.shouldInitiateRitual()) {
      this.beginInitiationSequence();
    }
  }

  handleRitualSkip(data) {
    // For development/testing - skip ritual with predefined trauma profile
    localStorage.setItem('voidbloom_initiated', 'true');
    localStorage.setItem('voidbloom_primary_trauma', data.traumaType || 'recursion');
    localStorage.setItem('voidbloom_coherence_baseline', (data.coherence || 0.5).toString());

    const traumaAffinities = {};
    traumaAffinities[data.traumaType || 'recursion'] = 0.7;

    // Add some secondary traumas
    const secondaryTypes = [
      'abandonment',
      'fragmentation',
      'surveillance',
      'displacement',
      'dissolution',
    ];
    secondaryTypes.forEach((type) => {
      if (type !== data.traumaType) {
        traumaAffinities[type] = Math.random() * 0.3;
      }
    });

    localStorage.setItem('voidbloom_trauma_affinities', JSON.stringify(traumaAffinities));

    // Announce ritual completion
    if (typeof NeuralBus !== 'undefined') {
      NeuralBus.publish('ritual:completed', {
        traumaAffinities: traumaAffinities,
        primaryTrauma: data.traumaType || 'recursion',
        coherenceBaseline: data.coherence || 0.5,
        skipped: true,
        timestamp: Date.now(),
      });
    }
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  window.voidBloom = window.voidBloom || {};
  window.voidBloom.ritualEngine = new RitualEngine();

  // Connect to Neural Bus if available
  if (typeof NeuralBus !== 'undefined') {
    window.voidBloom.ritualEngine.connectToNeuralBus();
  } else {
    // Try again when Neural Bus might be loaded
    window.addEventListener('neuralbus:initialized', () => {
      window.voidBloom.ritualEngine.connectToNeuralBus();
    });
  }
});
