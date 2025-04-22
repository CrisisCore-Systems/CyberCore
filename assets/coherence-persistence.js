/**
 * VoidBloom Coherence Persistence Layer
 * VERSION: 2.7.3
 *
 * Maintains quantum state coherence across sessions
 * Implements memory trace decay and trauma affinity evolution
 */

/**
 *
 */
class CoherencePersistence {
  /**
   *
   */
  constructor() {
    this.storageKey = 'voidbloom_quantum_state';
    this.compressionEnabled = true;

    // State management
    this.stateData = {
      coherenceLevel: 0.5,
      activeTrauma: null,
      traumaAffinities: {},
      narrativeFragments: [],
      memoryTraces: [],
      lastCollapse: Date.now(),
      phaseState: 'cyber-lotus',
      sessionCount: 0,
      interactionDepth: 0,
    };

    // Advanced state tracking
    this.stateHistory = [];
    this.maxHistoryStates = 7;
    this.stateEntropy = 0;

    // Timers
    this.persistenceInterval = null;
    this.decayInterval = null;
    this.quantumFluctuationInterval = null;

    this.initialize();
  }

  /**
   *
   */
  initialize() {
    this.loadState();
    this.incrementSession();

    // Begin persistence cycle
    this.persistenceInterval = setInterval(() => {
      this.saveState();
    }, 30000); // Every 30 seconds

    // Begin decay cycle
    this.decayInterval = setInterval(() => {
      this.applyQuantumDecay();
    }, 120000); // Every 2 minutes

    // Begin quantum fluctuation cycle
    this.quantumFluctuationInterval = setInterval(() => {
      this.applyQuantumFluctuation();
    }, 180000); // Every 3 minutes

    // Listen for neural bus events
    if (window.voidBloom && window.voidBloom.neuralBus) {
      this.connectToNeuralBus();
    } else {
      // Wait for neural bus to be available
      const checkNeuralBus = setInterval(() => {
        if (window.voidBloom && window.voidBloom.neuralBus) {
          this.connectToNeuralBus();
          clearInterval(checkNeuralBus);
        } else if (typeof NeuralBus !== 'undefined') {
          this.connectToNeuralBus();
          clearInterval(checkNeuralBus);
        }
      }, 1000);
    }

    // Publish initial state
    this.publishState();
  }

  /**
   *
   */
  loadState() {
    try {
      const savedState = localStorage.getItem(this.storageKey);

      if (savedState) {
        const parsedState = JSON.parse(savedState);

        // Merge saved state with defaults
        this.stateData = {
          ...this.stateData,
          ...parsedState,
        };

        console.log('🔄 Coherence state reconstituted');
      } else {
        // Initialize from ritual data if available
        const traumaAffinities = localStorage.getItem('voidbloom_trauma_affinities');
        const primaryTrauma = localStorage.getItem('voidbloom_primary_trauma');
        const coherenceBaseline = localStorage.getItem('voidbloom_coherence_baseline');

        if (traumaAffinities && primaryTrauma) {
          this.stateData.traumaAffinities = JSON.parse(traumaAffinities);
          this.stateData.activeTrauma = primaryTrauma;

          if (coherenceBaseline) {
            this.stateData.coherenceLevel = parseFloat(coherenceBaseline);
          }
        }
      }
    } catch (error) {
      console.error('Error loading coherence state:', error);
    }
  }

  /**
   *
   */
  saveState() {
    try {
      // Add timestamp
      this.stateData.lastSaved = Date.now();

      // Archive current state to history
      this.archiveCurrentState();

      // Save to localStorage
      localStorage.setItem(this.storageKey, JSON.stringify(this.stateData));

      // Notify via NeuralBus
      if (typeof NeuralBus !== 'undefined') {
        NeuralBus.publish('coherence:state:saved', {
          timestamp: Date.now(),
          coherenceLevel: this.stateData.coherenceLevel,
          activeTrauma: this.stateData.activeTrauma,
          phaseState: this.stateData.phaseState,
        });
      }
    } catch (error) {
      console.error('Error saving coherence state:', error);
    }
  }

  /**
   *
   */
  archiveCurrentState() {
    // Create a snapshot of current state for quantum reconstruction
    const stateSnapshot = {
      timestamp: Date.now(),
      coherenceLevel: this.stateData.coherenceLevel,
      activeTrauma: this.stateData.activeTrauma,
      phaseState: this.stateData.phaseState,
      entropy: this.stateEntropy,
    };

    // Add to history
    this.stateHistory.unshift(stateSnapshot);

    // Limit history size
    if (this.stateHistory.length > this.maxHistoryStates) {
      this.stateHistory.pop();
    }
  }

  /**
   *
   */
  connectToNeuralBus() {
    try {
      // Register with NeuralBus
      if (typeof NeuralBus !== 'undefined') {
        const { nonce } = NeuralBus.register('coherence-persistence', {
          version: '2.7.3',
          profile: 'quantum-state-manager',
        });

        this.nonce = nonce;

        // Listen for coherence changes
        NeuralBus.subscribe('global', (data) => {
          if (data.action === 'coherence_shifted') {
            this.stateData.coherenceLevel = data.newCoherence;
            this.stateData.lastCollapse = Date.now();
            this.saveState();
          } else if (data.action === 'phase_changed') {
            this.stateData.phaseState = data.phase;
            this.saveState();
          }
        });

        // Listen for trauma activation
        NeuralBus.subscribe('trauma', (data) => {
          if (data.action === 'trauma_activated') {
            this.stateData.activeTrauma = data.traumaType;
            this.saveState();
          }
        });

        // Listen for narrative fragments
        NeuralBus.subscribe('narrative', (data) => {
          if (data.action === 'fragment_generated') {
            this.addNarrativeFragment(data.fragment);
          }
        });

        // Listen for memory traces
        NeuralBus.subscribe('memory', (data) => {
          if (data.action === 'memory_trace_created') {
            this.addMemoryTrace(data.trace);
          }
        });

        // Listen for user interactions
        NeuralBus.subscribe('user', (data) => {
          if (data.action === 'interaction') {
            this.stateData.interactionDepth++;

            // Check for trauma affinity updates
            if (data.details && data.details.traumaType) {
              this.incrementTraumaAffinity(data.details.traumaType, 0.01);
            }

            // Save every 10 interactions
            if (this.stateData.interactionDepth % 10 === 0) {
              this.saveState();
            }
          }
        });

        // Announce state availability
        NeuralBus.publish('global', {
          action: 'coherence_state_available',
          timestamp: Date.now(),
        });

        console.log('🔄 Coherence Persistence connected to Neural Bus');
      }
    } catch (error) {
      console.error('Error connecting to Neural Bus:', error);
    }
  }

  /**
   *
   */
  publishState() {
    if (typeof NeuralBus !== 'undefined') {
      // Publish coherence state
      NeuralBus.publish('global', {
        action: 'coherence_shifted',
        newCoherence: this.stateData.coherenceLevel,
        source: 'persistence_layer',
        timestamp: Date.now(),
      });

      // Publish active trauma
      if (this.stateData.activeTrauma) {
        NeuralBus.publish('trauma', {
          action: 'trauma_activated',
          traumaType: this.stateData.activeTrauma,
          source: 'persistence_layer',
          timestamp: Date.now(),
        });
      }

      // Publish phase
      NeuralBus.publish('global', {
        action: 'phase_changed',
        phase: this.stateData.phaseState,
        source: 'persistence_layer',
        timestamp: Date.now(),
      });
    }

    // Update HTML attributes
    document.documentElement.dataset.systemCoherence = this.stateData.coherenceLevel;
    document.documentElement.dataset.activeTrauma = this.stateData.activeTrauma || 'none';
    document.documentElement.dataset.memoryPhase = this.stateData.phaseState;
  }

  /**
   *
   */
  incrementSession() {
    this.stateData.sessionCount++;
    this.saveState();
  }

  /**
   *
   */
  addNarrativeFragment(fragment) {
    // Add to beginning of array
    this.stateData.narrativeFragments.unshift({
      content: fragment,
      timestamp: Date.now(),
      traumaType: this.stateData.activeTrauma,
      coherenceLevel: this.stateData.coherenceLevel,
    });

    // Limit to 25 fragments
    if (this.stateData.narrativeFragments.length > 25) {
      this.stateData.narrativeFragments.pop();
    }

    this.saveState();
  }

  /**
   *
   */
  addMemoryTrace(trace) {
    this.stateData.memoryTraces.push({
      ...trace,
      timestamp: Date.now(),
    });

    // Limit to 50 traces
    if (this.stateData.memoryTraces.length > 50) {
      this.stateData.memoryTraces.shift();
    }

    this.saveState();
  }

  /**
   *
   */
  incrementTraumaAffinity(traumaType, amount) {
    if (!traumaType) return;

    // Initialize if not exists
    if (!this.stateData.traumaAffinities[traumaType]) {
      this.stateData.traumaAffinities[traumaType] = 0;
    }

    // Increment affinity
    this.stateData.traumaAffinities[traumaType] = Math.min(
      1,
      this.stateData.traumaAffinities[traumaType] + amount
    );

    // Notify neural bus of significant changes
    if (amount >= 0.05 && typeof NeuralBus !== 'undefined') {
      NeuralBus.publish('trauma', {
        action: 'trauma_affinity_changed',
        traumaType: traumaType,
        newValue: this.stateData.traumaAffinities[traumaType],
        source: 'persistence_layer',
        timestamp: Date.now(),
      });
    }
  }

  /**
   *
   */
  applyQuantumDecay() {
    // Apply natural decay to coherence level
    const decayAmount = 0.005 + Math.random() * 0.01;
    this.stateData.coherenceLevel = Math.max(0.2, this.stateData.coherenceLevel - decayAmount);

    // Increase entropy
    this.stateEntropy += 0.01;

    // Publish updated state
    this.publishState();
  }

  /**
   *
   */
  applyQuantumFluctuation() {
    // Only fluctuate if no recent collapse
    const timeSinceCollapse = Date.now() - this.stateData.lastCollapse;

    if (timeSinceCollapse > 300000) {
      // 5 minutes
      // Generate fluctuation
      const fluctuation = Math.random() * 0.1 - 0.05;

      // Apply to coherence level
      this.stateData.coherenceLevel = Math.min(
        0.95,
        Math.max(0.2, this.stateData.coherenceLevel + fluctuation)
      );

      // Publish fluctuation
      this.publishState();

      // Potential phase shift if coherence very low or high
      if (this.stateData.coherenceLevel < 0.25) {
        this.considerPhaseShift('rolling-virus');
      } else if (this.stateData.coherenceLevel > 0.85) {
        this.considerPhaseShift('cyber-lotus');
      }
    }
  }

  /**
   *
   */
  considerPhaseShift(potentialPhase) {
    // Only shift phases rarely
    if (Math.random() < 0.1 && this.stateData.phaseState !== potentialPhase) {
      this.stateData.phaseState = potentialPhase;

      // Publish phase change
      if (typeof NeuralBus !== 'undefined') {
        NeuralBus.publish('global', {
          action: 'phase_changed',
          phase: potentialPhase,
          source: 'quantum_fluctuation',
          timestamp: Date.now(),
        });
      }

      this.saveState();
    }
  }

  // Provide access to state
  /**
   *
   */
  getCoherenceLevel() {
    return this.stateData.coherenceLevel;
  }

  /**
   *
   */
  getActiveTrauma() {
    return this.stateData.activeTrauma;
  }

  /**
   *
   */
  getTraumaAffinities() {
    return { ...this.stateData.traumaAffinities };
  }

  /**
   *
   */
  getNarrativeFragments() {
    return [...this.stateData.narrativeFragments];
  }

  /**
   *
   */
  getCurrentPhase() {
    return this.stateData.phaseState;
  }

  /**
   *
   */
  restoreFromSnapshot(index = 0) {
    if (index >= this.stateHistory.length) return false;

    const snapshot = this.stateHistory[index];

    // Restore key values
    this.stateData.coherenceLevel = snapshot.coherenceLevel;
    this.stateData.phaseState = snapshot.phaseState;

    // Only restore trauma if not already active
    if (snapshot.activeTrauma && !this.stateData.activeTrauma) {
      this.stateData.activeTrauma = snapshot.activeTrauma;
    }

    // Publish restored state
    this.publishState();
    this.saveState();

    return true;
  }

  /**
   *
   */
  resetState() {
    // For testing/debug - reset to initial state
    this.stateData = {
      coherenceLevel: 0.5,
      activeTrauma: null,
      traumaAffinities: {},
      narrativeFragments: [],
      memoryTraces: [],
      lastCollapse: Date.now(),
      phaseState: 'cyber-lotus',
      sessionCount: this.stateData.sessionCount, // Preserve session count
      interactionDepth: 0,
    };

    // Initialize from ritual data if available
    const traumaAffinities = localStorage.getItem('voidbloom_trauma_affinities');
    const primaryTrauma = localStorage.getItem('voidbloom_primary_trauma');
    const coherenceBaseline = localStorage.getItem('voidbloom_coherence_baseline');

    if (traumaAffinities && primaryTrauma) {
      this.stateData.traumaAffinities = JSON.parse(traumaAffinities);
      this.stateData.activeTrauma = primaryTrauma;

      if (coherenceBaseline) {
        this.stateData.coherenceLevel = parseFloat(coherenceBaseline);
      }
    }

    this.stateHistory = [];
    this.stateEntropy = 0;

    // Save and publish reset state
    this.saveState();
    this.publishState();
  }

  // Cleanup
  /**
   *
   */
  destroy() {
    clearInterval(this.persistenceInterval);
    clearInterval(this.decayInterval);
    clearInterval(this.quantumFluctuationInterval);

    // Deregister from Neural Bus
    if (typeof NeuralBus !== 'undefined' && this.nonce) {
      try {
        NeuralBus.deregister('coherence-persistence', this.nonce);
      } catch (e) {
        console.warn('Error deregistering from Neural Bus:', e);
      }
    }
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  window.voidBloom = window.voidBloom || {};
  window.voidBloom.coherencePersistence = new CoherencePersistence();
});
