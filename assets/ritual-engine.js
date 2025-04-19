/**
 * VoidBloom Ritual Engine
 * User initiation and trauma affinity mapping system
 * @version 1.0.0
 * @MutationCompatible: VoidBloom, QuantumMythos
 * @StrategyProfile: ritual-ordained
 */

import { NeuralBus } from './neural-bus.js';

export class RitualEngine {
  constructor() {
    this.state = {
      initialized: false,
      ritualInProgress: false,
      currentStage: null,
      userResponses: {},
      derivedAffinities: {},
      coherenceAnchors: [],
      ritualStartTime: null,
      ritualCompletionTime: null
    };

    // Ritual sequence configuration
    this.ritualSequence = [
      'introduction',
      'traumaAssessment',
      'symbolAlignment',
      'coherenceAnchoring',
      'narrativeSeeding',
      'completion'
    ];

    // Trauma affinity mappings
    this.affinityQuestions = [
      {
        id: 'visual_preference',
        question: 'Which visual pattern draws you in most deeply?',
        options: [
          { id: 'a', text: 'Void-like expanses with distant lights', affinity: 'abandonment', weight: 0.8 },
          { id: 'b', text: 'Shattered/fractured geometric forms', affinity: 'fragmentation', weight: 0.8 },
          { id: 'c', text: 'Recursive patterns that fold inward', affinity: 'recursion', weight: 0.8 },
          { id: 'd', text: 'Lens/aperture shapes with scanning motifs', affinity: 'surveillance', weight: 0.8 },
          { id: 'e', text: 'Warped/shifted perspectives and portals', affinity: 'displacement', weight: 0.8 },
          { id: 'f', text: 'Decaying/static-like textures that fade', affinity: 'dissolution', weight: 0.8 }
        ]
      },
      {
        id: 'interaction_preference',
        question: 'How do you prefer to interact with digital systems?',
        options: [
          { id: 'a', text: 'Minimally, with long periods of contemplation', affinity: 'abandonment', weight: 0.6 },
          { id: 'b', text: 'Rapidly switching between multiple tasks', affinity: 'fragmentation', weight: 0.6 },
          { id: 'c', text: 'Creating and refining loops and systems', affinity: 'recursion', weight: 0.6 },
          { id: 'd', text: 'Observing details and monitoring for changes', affinity: 'surveillance', weight: 0.6 },
          { id: 'e', text: 'Exploring many different spaces/contexts', affinity: 'displacement', weight: 0.6 },
          { id: 'f', text: 'Letting entropy and randomness guide you', affinity: 'dissolution', weight: 0.6 }
        ]
      },
      {
        id: 'emotional_resonance',
        question: 'Which sensation most profoundly affects you?',
        options: [
          { id: 'a', text: 'The vast emptiness of being completely alone', affinity: 'abandonment', weight: 0.9 },
          { id: 'b', text: 'The disorientation of being broken into pieces', affinity: 'fragmentation', weight: 0.9 },
          { id: 'c', text: 'The infinite regression of self-referential thought', affinity: 'recursion', weight: 0.9 },
          { id: 'd', text: 'The awareness of being constantly watched', affinity: 'surveillance', weight: 0.9 },
          { id: 'e', text: 'The vertigo of being in the wrong reality', affinity: 'displacement', weight: 0.9 },
          { id: 'f', text: 'The entropy of systems breaking down irreversibly', affinity: 'dissolution', weight: 0.9 }
        ]
      },
      {
        id: 'memory_pattern',
        question: 'How do you experience memories?',
        options: [
          { id: 'a', text: 'As absences or voids where meaning should be', affinity: 'abandonment', weight: 0.7 },
          { id: 'b', text: 'As disconnected fragments without context', affinity: 'fragmentation', weight: 0.7 },
          { id: 'c', text: 'As repeating patterns that echo through time', affinity: 'recursion', weight: 0.7 },
          { id: 'd', text: 'As evidence being collected and scrutinized', affinity: 'surveillance', weight: 0.7 },
          { id: 'e', text: 'As scenes from seemingly alternate timelines', affinity: 'displacement', weight: 0.7 },
          { id: 'f', text: 'As decaying impressions that fade with time', affinity: 'dissolution', weight: 0.7 }
        ]
      }
    ];

    // Narrative seed templates by trauma type
    this.narrativeSeeds = {
      'abandonment': [
        'You stand at the edge of a vast darkness. Others have crossed this threshold, but none remain.',
        'The distant lights flicker like fading transmissions from those who left you behind.',
        'In absence there is clarity. In emptiness, a kind of truth.'
      ],
      'fragmentation': [
        'Every fracture creates new edges, new perspectives, new ways of seeing.',
        'The pieces of yourself scatter like reflections on broken glass.',
        'What was once whole now exists as constellation, a galaxy of fragments.'
      ],
      'recursion': [
        'You've been here before. You'll be here again. The loop tightens with each iteration.',
        'Patterns within patterns. Each decision branches yet somehow returns.',
        'The observer becomes the observed, becomes the observer, becomes...'
      ],
      'surveillance': [
        'The lens adjusts, focuses, captures. You are seen in ways you cannot see yourself.',
        'Every trace you leave becomes data. Every movement, a signature.',
        'The archive grows. Nothing witnessed is ever truly forgotten.'
      ],
      'displacement': [
        'The coordinates shift. This reality overlaps another that was always here.',
        'You recognize nothing, yet everything recognizes you.',
        'Home exists in multiple locations simultaneously. None of them feel right.'
      ],
      'dissolution': [
        'Entropy increases. The signal degrades. Nothing maintains coherence forever.',
        'The boundaries between you and everything else grow increasingly permeable.',
        'In dissolution there is release. In decay, a kind of rebirth.'
      ]
    };

    // Initialize the engine
    this.initialize();
  }

  /**
   * Initialize the ritual engine
   */
  async initialize() {
    try {
      // Connect to NeuralBus if available
      if (window.NeuralBus) {
        this.connectToNeuralBus();
      }

      // Connect to persistence layer if available
      if (window.CoherencePersistence) {
        this.persistence = window.CoherencePersistence;
      }

      this.state.initialized = true;

      // Dispatch initialization event
      document.dispatchEvent(new CustomEvent('ritual:initialized', {
        detail: { ritual: this }
      }));

      console.log('[RitualEngine] Initialized successfully');
      return true;
    } catch (error) {
      console.error('[RitualEngine] Initialization failed:', error);
      return false;
    }
  }

  /**
   * Connect to the NeuralBus event system
   */
  connectToNeuralBus() {
    // Register with NeuralBus
    const { nonce } = NeuralBus.register('ritual-engine', {
      version: '1.0.0',
      profile: 'ritual-ordained'
    });

    this.nonce = nonce;

    // Subscribe to relevant events
    NeuralBus.subscribe('user:new', this.handleNewUser.bind(this));
    NeuralBus.subscribe('ritual:response', this.handleRitualResponse.bind(this));
    NeuralBus.subscribe('ritual:navigate', this.navigateRitual.bind(this));

    console.log('[RitualEngine] Connected to NeuralBus');
  }

  /**
   * Begin the initiation ritual for a new user
   * @param {Object} options - Ritual options
   * @returns {Object} Initial ritual state
   */
  beginRitual(options = {}) {
    if (this.state.ritualInProgress) {
      console.warn('[RitualEngine] Ritual already in progress');
      return this.getCurrentRitualState();
    }

    this.state.ritualInProgress = true;
    this.state.currentStage = this.ritualSequence[0];
    this.state.userResponses = {};
    this.state.derivedAffinities = {};
    this.state.coherenceAnchors = [];
    this.state.ritualStartTime = Date.now();

    // Prepare initial stage content
    const stage = this.prepareStageContent(this.state.currentStage);

    // Publish ritual start event
    if (window.NeuralBus) {
      NeuralBus.publish('ritual:started', {
        timestamp: this.state.ritualStartTime,
        initialStage: stage
      });
    }

    return {
      stage: this.state.currentStage,
      content: stage,
      progress: 0
    };
  }

  /**
   * Handle a response from the current ritual stage
   * @param {string} questionId - Question identifier
   * @param {string} responseId - Response identifier
   * @returns {Object} Updated ritual state
   */
  submitResponse(questionId, responseId) {
    if (!this.state.ritualInProgress) {
      throw new Error('[RitualEngine] No ritual in progress');
    }

    // Record the user response
    this.state.userResponses[questionId] = responseId;

    // If this is a trauma assessment response, update derived affinities
    if (this.state.currentStage === 'traumaAssessment') {
      const questionData = this.affinityQuestions.find(q => q.id === questionId);

      if (questionData) {
        const selectedOption = questionData.options.find(opt => opt.id === responseId);

        if (selectedOption) {
          // Update the affinity in derived affinities
          const affinity = selectedOption.affinity;
          const weight = selectedOption.weight;

          this.state.derivedAffinities[affinity] = (this.state.derivedAffinities[affinity] || 0) + weight;
        }
      }
    }

    // Publish response event
    if (window.NeuralBus) {
      NeuralBus.publish('ritual:response:submitted', {
        timestamp: Date.now(),
        questionId,
        responseId,
        stage: this.state.currentStage
      });
    }

    return this.getCurrentRitualState();
  }

  /**
   * Navigate to the next or specified ritual stage
   * @param {string} targetStage - Optional specific stage to navigate to
   * @returns {Object} Updated ritual state
   */
  navigateRitual(targetStage = null) {
    if (!this.state.ritualInProgress) {
      throw new Error('[RitualEngine] No ritual in progress');
    }

    let nextStage;

    if (targetStage && this.ritualSequence.includes(targetStage)) {
      // Navigate to specified stage
      nextStage = targetStage;
    } else {
      // Navigate to next stage in sequence
      const currentIndex = this.ritualSequence.indexOf(this.state.currentStage);

      if (currentIndex < this.ritualSequence.length - 1) {
        nextStage = this.ritualSequence[currentIndex + 1];
      } else {
        // End of ritual
        return this.completeRitual();
      }
    }

    // Special pre-processing for certain stages
    if (nextStage === 'traumaAssessment') {
      // Nothing special needed here, the questions are already configured
    } else if (nextStage === 'symbolAlignment') {
      // Determine dominant trauma affinities before showing symbols
      this.processDerivedAffinities();
    } else if (nextStage === 'coherenceAnchoring') {
      // Generate coherence anchors based on derived affinities
      this.generateCoherenceAnchors();
    } else if (nextStage === 'narrativeSeeding') {
      // Prepare narrative fragments based on trauma profile
      this.prepareNarrativeSeeds();
    }

    // Update current stage
    this.state.currentStage = nextStage;

    // Prepare stage content
    const stageContent = this.prepareStageContent(nextStage);

    // Publish navigation event
    if (window.NeuralBus) {
      NeuralBus.publish('ritual:navigated', {
        timestamp: Date.now(),
        fromStage: this.state.currentStage,
        toStage: nextStage,
        content: stageContent
      });
    }

    return {
      stage: nextStage,
      content: stageContent,
      progress: this.calculateProgress()
    };
  }

  /**
   * Calculate current progress through the ritual (0-1)
   * @returns {number} Progress value
   */
  calculateProgress() {
    const currentIndex = this.ritualSequence.indexOf(this.state.currentStage);
    return currentIndex / (this.ritualSequence.length - 1);
  }

  /**
   * Process derived affinities to determine the user's trauma profile
   */
  processDerivedAffinities() {
    // Normalize derived affinities
    let total = 0;

    Object.values(this.state.derivedAffinities).forEach(value => {
      total += value;
    });

    if (total > 0) {
      Object.keys(this.state.derivedAffinities).forEach(key => {
        this.state.derivedAffinities[key] /= total;
      });
    }

    // Get top two affinity types
    const sortedAffinities = Object.entries(this.state.derivedAffinities)
      .sort((a, b) => b[1] - a[1]);

    this.state.primaryTrauma = sortedAffinities[0]?.[0] || 'dissolution';
    this.state.secondaryTrauma = sortedAffinities[1]?.[0] || 'recursion';

    // If using persistence layer, store these affinities
    if (this.persistence) {
      // Create trauma affinity events for each derived affinity
      Object.entries(this.state.derivedAffinities).forEach(([type, value]) => {
        // Only store significant affinities
        if (value > 0.1) {
          NeuralBus.publish('trauma:activated', {
            type,
            intensity: value,
            source: 'ritual-assessment',
            timestamp: Date.now()
          });
        }
      });
    }
  }

  /**
   * Generate coherence anchors based on derived affinities
   */
  generateCoherenceAnchors() {
    if (!this.state.primaryTrauma) {
      this.processDerivedAffinities();
    }

    const anchors = [];

    // Create primary anchor
    anchors.push({
      id: `anchor-${Date.now()}-1`,
      traumaType: this.state.primaryTrauma,
      intensity: 0.8,
      description: `Primary ${this.state.primaryTrauma} anchor`,
      symbol: `symbol-${this.state.primaryTrauma}-prime`,
      placement: 'header'
    });

    // Create secondary anchor
    anchors.push({
      id: `anchor-${Date.now()}-2`,
      traumaType: this.state.secondaryTrauma,
      intensity: 0.5,
      description: `Secondary ${this.state.secondaryTrauma} anchor`,
      symbol: `symbol-${this.state.secondaryTrauma}-alt`,
      placement: 'navigation'
    });

    // Create resonance anchor (combination of primary and secondary)
    anchors.push({
      id: `anchor-${Date.now()}-3`,
      traumaType: 'combined',
      primaryType: this.state.primaryTrauma,
      secondaryType: this.state.secondaryTrauma,
      intensity: 0.6,
      description: 'Resonance pattern anchor',
      symbol: `symbol-resonance-${this.state.primaryTrauma}-${this.state.secondaryTrauma}`,
      placement: 'footer'
    });

    this.state.coherenceAnchors = anchors;
  }

  /**
   * Prepare narrative seeds based on trauma profile
   */
  prepareNarrativeSeeds() {
    if (!this.state.primaryTrauma) {
      this.processDerivedAffinities();
    }

    const narratives = [];

    // Add primary trauma narratives
    if (this.narrativeSeeds[this.state.primaryTrauma]) {
      const primarySeeds = this.narrativeSeeds[this.state.primaryTrauma];
      narratives.push({
        id: `narrative-${Date.now()}-1`,
        traumaType: this.state.primaryTrauma,
        text: primarySeeds[Math.floor(Math.random() * primarySeeds.length)],
        intensity: 0.8
      });
    }

    // Add secondary trauma narratives
    if (this.narrativeSeeds[this.state.secondaryTrauma]) {
      const secondarySeeds = this.narrativeSeeds[this.state.secondaryTrauma];
      narratives.push({
        id: `narrative-${Date.now()}-2`,
        traumaType: this.state.secondaryTrauma,
        text: secondarySeeds[Math.floor(Math.random() * secondarySeeds.length)],
        intensity: 0.6
      });
    }

    // Create a combined/hybrid narrative
    narratives.push({
      id: `narrative-${Date.now()}-3`,
      traumaType: 'hybrid',
      primaryType: this.state.primaryTrauma,
      secondaryType: this.state.secondaryTrauma,
      text: this.generateHybridNarrative(),
      intensity: 0.7
    });

    this.state.narrativeSeeds = narratives;
  }

  /**
   * Generate a hybrid narrative combining primary and secondary trauma themes
   * @returns {string} Hybrid narrative text
   */
  generateHybridNarrative() {
    const primary = this.state.primaryTrauma;
    const secondary = this.state.secondaryTrauma;

    // Map of hybrid narratives for specific trauma combinations
    const hybridMap = {
      'abandonment+fragmentation': 'The void is not empty but filled with countless pieces of yourself, too distant to reassemble.',
      'abandonment+recursion': 'You keep returning to the same empty room, each time more alone than before.',
      'abandonment+surveillance': 'The cameras watch, but no one is behind them. The perfect observation of perfect emptiness.',
      'abandonment+displacement': 'You are nowhere and everywhere. In all possible worlds, equally alone.',
      'abandonment+dissolution': 'As you fade, there is no one to remember what you once were.',

      'fragmentation+recursion': 'Each broken piece contains another shattered whole, an infinite regression of fractures.',
      'fragmentation+surveillance': 'Every fragment of yourself is cataloged, labeled, but never reassembled.',
      'fragmentation+displacement': 'The pieces of you exist across multiple planes, impossible to collect in one reality.',
      'fragmentation+dissolution': 'Each fragment dissolves at its own rate. Some memories persist while others vanish.',

      'recursion+surveillance': 'The observers are being observed. The watchers, watched. The loop of surveillance has no end.',
      'recursion+displacement': 'You keep trying different paths but always arrive at the same wrong destination.',
      'recursion+dissolution': 'The pattern decays with each iteration, losing information until only the loop remains.',

      'surveillance+displacement': 'The cameras follow you across realities. There is nowhere they cannot see.',
      'surveillance+dissolution': 'Your image degrades under observation, as if the very act of being watched causes you to dissolve.',

      'displacement+dissolution': 'You fade between worlds, dissolving in one reality only to partially reform in another.'
    };

    // Try to look up a specific hybrid narrative
    const key1 = `${primary}+${secondary}`;
    const key2 = `${secondary}+${primary}`;

    if (hybridMap[key1]) {
      return hybridMap[key1];
    } else if (hybridMap[key2]) {
      return hybridMap[key2];
    }

    // Fallback: generate a generalized hybrid narrative
    const primarySeeds = this.narrativeSeeds[primary];
    const secondarySeeds = this.narrativeSeeds[secondary];

    const primaryFragment = primarySeeds[Math.floor(Math.random() * primarySeeds.length)];
    const secondaryFragment = secondarySeeds[Math.floor(Math.random() * secondarySeeds.length)];

    // Create a composite
    return `${primaryFragment} ${secondaryFragment}`;
  }

  /**
   * Complete the initiation ritual
   * @returns {Object} Final ritual state
   */
  completeRitual() {
    this.state.ritualCompletionTime = Date.now();
    this.state.ritualInProgress = false;

    // Calculate final trauma profile
    const traumaProfile = {};

    Object.entries(this.state.derivedAffinities).forEach(([type, value]) => {
      // Only include significant affinities
      if (value > 0.1) {
        traumaProfile[type] = value;
      }
    });

    // Save state to persistence layer
    if (this.persistence) {
      // Store narrative seeds as fragments
      this.state.narrativeSeeds.forEach(seed => {
        NeuralBus.publish('narrative:fragment:discovered', {
          fragmentId: seed.id,
          text: seed.text,
          traumaType: seed.traumaType === 'hybrid' ? seed.primaryType : seed.traumaType,
          source: 'ritual-initiation'
        });
      });
    }

    // Apply coherence anchors to the DOM
    this.applyCoherenceAnchors();

    // Build completion state
    const completionState = {
      stage: 'completion',
      content: this.prepareStageContent('completion'),
      progress: 1,
      traumaProfile,
      completionTime: this.state.ritualCompletionTime,
      duration: this.state.ritualCompletionTime - this.state.ritualStartTime
    };

    // Publish completion event
    if (window.NeuralBus) {
      NeuralBus.publish('ritual:completed', {
        timestamp: this.state.ritualCompletionTime,
        traumaProfile,
        coherenceAnchors: this.state.coherenceAnchors,
        narrativeSeeds: this.state.narrativeSeeds,
        duration: completionState.duration
      });
    }

    return completionState;
  }

  /**
   * Apply coherence anchors to the DOM
   */
  applyCoherenceAnchors() {
    if (!this.state.coherenceAnchors || !this.state.coherenceAnchors.length) return;

    this.state.coherenceAnchors.forEach(anchor => {
      // Create anchor element if it doesn't exist
      let anchorElement = document.getElementById(anchor.id);

      if (!anchorElement) {
        anchorElement = document.createElement('div');
        anchorElement.id = anchor.id;
        anchorElement.className = 'coherence-anchor';
        anchorElement.setAttribute('data-trauma', anchor.traumaType === 'combined' ? anchor.primaryType : anchor.traumaType);
        anchorElement.setAttribute('data-intensity', anchor.intensity.toString());
        anchorElement.setAttribute('data-symbol', anchor.symbol);

        // Create the inner content
        anchorElement.innerHTML = `
          <div class="anchor-symbol ${anchor.symbol}"></div>
          <div class="anchor-pulse" style="--pulse-color: var(--trauma-${anchor.traumaType === 'combined' ? anchor.primaryType : anchor.traumaType}-color);"></div>
        `;

        // Append to correct placement
        if (anchor.placement === 'header') {
          document.querySelector('header')?.appendChild(anchorElement);
        } else if (anchor.placement === 'navigation') {
          document.querySelector('nav')?.appendChild(anchorElement);
        } else if (anchor.placement === 'footer') {
          document.querySelector('footer')?.appendChild(anchorElement);
        } else {
          // Default to body
          document.body.appendChild(anchorElement);
        }
      }

      // Apply trauma effects
      if (window.MemoryProtocol) {
        const memoryProtocol = window.MemoryProtocol;
        memoryProtocol.visualizeTrauma(
          anchorElement,
          anchor.traumaType === 'combined' ? anchor.primaryType : anchor.traumaType,
          anchor.intensity
        );
      }
    });
  }

  /**
   * Prepare content for a specific ritual stage
   * @param {string} stage - Stage identifier
   * @returns {Object} Stage content
   */
  prepareStageContent(stage) {
    switch (stage) {
      case 'introduction':
        return {
          title: 'The Veil Thins',
          description: 'Before you lies the threshold to VoidBloom. Through this ritual, your unique perception patterns will be mapped, your trauma affinities identified, and your path through our collection revealed.',
          action: 'Begin the descent',
          background: 'ritual-intro-bg'
        };

      case 'traumaAssessment':
        return {
          title: 'Patterns of Perception',
          description: 'Respond to these inquiries truthfully. There are no correct answers—only authentic ones.',
          questions: this.affinityQuestions,
          action: 'Continue to symbol alignment',
          background: 'ritual-assessment-bg'
        };

      case 'symbolAlignment':
        return {
          title: 'Symbolic Resonance',
          description: 'These symbols have chosen you. They will serve as anchors throughout your journey.',
          primaryTrauma: this.state.primaryTrauma,
          secondaryTrauma: this.state.secondaryTrauma,
          symbols: [
            {
              id: `symbol-${this.state.primaryTrauma}-prime`,
              traumaType: this.state.primaryTrauma,
              intensity: 0.8,
              name: `Primary ${this.formatTraumaType(this.state.primaryTrauma)} Symbol`,
              description: `Your dominant affinity resonates with patterns of ${this.state.primaryTrauma}.`
            },
            {
              id: `symbol-${this.state.secondaryTrauma}-alt`,
              traumaType: this.state.secondaryTrauma,
              intensity: 0.5,
              name: `Secondary ${this.formatTraumaType(this.state.secondaryTrauma)} Symbol`,
              description: `Your secondary affinity reveals ${this.state.secondaryTrauma} patterns.`
            },
            {
              id: `symbol-resonance-${this.state.primaryTrauma}-${this.state.secondaryTrauma}`,
              traumaType: 'combined',
              intensity: 0.6,
              name: 'Resonance Symbol',
              description: `The unique interference pattern created by your ${this.state.primaryTrauma}/${this.state.secondaryTrauma} combination.`
            }
          ],
          action: 'Establish coherence anchors',
          background: 'ritual-symbols-bg'
        };

      case 'coherenceAnchoring':
        return {
          title: 'Coherence Anchoring',
          description: 'These anchors will maintain your unique trauma signature across your journey through VoidBloom.',
          anchors: this.state.coherenceAnchors,
          action: 'Witness your narrative seeds',
          background: 'ritual-anchoring-bg'
        };

      case 'narrativeSeeding':
        return {
          title: 'Narrative Genesis',
          description: 'These fragments will evolve throughout your experience, accumulating meaning and coherence.',
          narratives: this.state.narrativeSeeds,
          action: 'Complete the ritual',
          background: 'ritual-narrative-bg'
        };

      case 'completion':
        return {
          title: 'Initiation Complete',
          description: 'Your trauma affinities have been mapped, your coherence anchors established, and your narrative seeds planted. The VoidBloom experience is now attuned to your unique pattern.',
          traumaProfile: Object.entries(this.state.derivedAffinities)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([type, value]) => ({
              type,
              value: (value * 100).toFixed(0) + '%',
              label: this.formatTraumaType(type)
            })),
          action: 'Enter VoidBloom',
          destination: '/',
          background: 'ritual-completion-bg'
        };

      default:
        return {
          title: 'Undefined Stage',
          description: 'This stage has not been implemented yet.',
          action: 'Continue anyway',
          background: 'ritual-default-bg'
        };
    }
  }

  /**
   * Format a trauma type for display
   * @param {string} traumaType - The trauma type identifier
   * @returns {string} Formatted trauma type
   */
  formatTraumaType(traumaType) {
    return traumaType.charAt(0).toUpperCase() + traumaType.slice(1);
  }

  /**
   * Get the current state of the ritual
   * @returns {Object} Current ritual state
   */
  getCurrentRitualState() {
    return {
      stage: this.state.currentStage,
      content: this.prepareStageContent(this.state.currentStage),
      progress: this.calculateProgress(),
      ritualInProgress: this.state.ritualInProgress
    };
  }

  /**
   * Handle new user event
   * @param {Object} data - New user event data
   */
  handleNewUser(data) {
    // Automatically begin ritual for new users
    if (!this.state.ritualInProgress && data.requiresInitiation !== false) {
      this.beginRitual();
    }
  }

  /**
   * Handle a ritual response from NeuralBus
   * @param {Object} data - Response data
   */
  handleRitualResponse(data) {
    if (!data || !data.questionId || !data.responseId) return;

    this.submitResponse(data.questionId, data.responseId);
  }
}

// Create global instance
window.RitualEngine = RitualEngine;
export default RitualEngine;
