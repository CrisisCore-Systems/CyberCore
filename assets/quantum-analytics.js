/**
 * VoidBloom Observer Effect Analytics
 * Dual-observer analytics system where measurement affects the coherence state
 * @version 1.0.0
 * @MutationCompatible: VoidBloom, QuantumMythos
 * @StrategyProfile: observer-entangled
 */

import { NeuralBus } from './neural-bus.js';

/**
 *
 */
export class QuantumAnalytics {
  /**
   *
   */
  constructor(options = {}) {
    // Configuration with defaults
    this.config = {
      autoInitialize: true,
      observerEffect: true, // Whether observation affects the observed
      mutationEnabled: true, // Whether analytics can trigger mutations
      persistData: true, // Store collected data
      transmitData: true, // Send data to server
      quantumDimming: 0.3, // How much the act of measurement dims quantum states
      trainingMode: false, // Record patterns for ML training
      debug: false,
      ...options,
    };

    // Analytics state
    this.state = {
      initialized: false,
      observing: false,
      currentSession: {
        id: this.generateSessionId(),
        startTime: Date.now(),
        traumaExposures: {},
        traumaDurations: {},
        narrativeEncounters: [],
        coherenceSnapshots: [],
        primaryInteractions: [],
        quantumStates: [],
        observationEffects: [],
      },
      previousSessions: [],
      patternRegistry: new Map(),
      dominantTrauma: null,
      observerIdentity: this.generateObserverId(),
    };

    // Connect to persistence layer if available
    this.persistence = null;

    // Initialize if auto
    if (this.config.autoInitialize) {
      this.initialize();
    }
  }

  /**
   * Initialize the quantum analytics system
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

        // Get dominant trauma for this session
        if (this.persistence.getDominantTrauma) {
          const dominantTrauma = this.persistence.getDominantTrauma();
          this.state.dominantTrauma = dominantTrauma.type;

          // Record initial coherence state
          this.recordCoherenceSnapshot();
        }
      }

      // Set up event listeners
      this.setupEventListeners();

      // Start session tracking
      this.startSessionTracking();

      this.state.initialized = true;

      // Log initialization
      if (this.config.debug) {
        console.log('[QuantumAnalytics] Initialized with config:', this.config);
        console.log('[QuantumAnalytics] Session ID:', this.state.currentSession.id);
      }

      // Dispatch initialization event
      document.dispatchEvent(
        new CustomEvent('quantum-analytics:ready', {
          detail: { analytics: this },
        })
      );

      return true;
    } catch (error) {
      console.error('[QuantumAnalytics] Initialization error:', error);
      return false;
    }
  }

  /**
   * Connect to the NeuralBus event system
   */
  connectToNeuralBus() {
    // Register with NeuralBus
    const { nonce } = NeuralBus.register('quantum-analytics', {
      version: '1.0.0',
      profile: 'observer-entangled',
    });

    this.nonce = nonce;

    // Subscribe to state-changing events
    NeuralBus.subscribe('trauma:activated', this.handleTraumaExposure.bind(this));
    NeuralBus.subscribe('memory:node:viewed', this.handleMemoryNodeViewed.bind(this));
    NeuralBus.subscribe('quantum:mutation', this.handleQuantumMutation.bind(this));
    NeuralBus.subscribe('narrative:fragment:discovered', this.handleNarrativeFragment.bind(this));
    NeuralBus.subscribe('ritual:completed', this.handleRitualCompletion.bind(this));
    NeuralBus.subscribe('coherence:state:saved', this.handleCoherenceStateSaved.bind(this));

    // Publish analytics ready event
    NeuralBus.publish('analytics:ready', {
      timestamp: Date.now(),
      observerId: this.state.observerIdentity,
      traumaAffinity: this.state.dominantTrauma,
    });

    console.log('[QuantumAnalytics] Connected to NeuralBus');
  }

  /**
   * Set up DOM event listeners for tracking
   */
  setupEventListeners() {
    // Track trauma node visibility
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const node = entry.target;
            const traumaType = node.getAttribute('data-trauma');
            const nodeId = node.id || `auto-node-${Date.now()}`;

            if (traumaType) {
              this.trackTraumaExposure(traumaType, nodeId);

              // If observer effect is enabled, dim the quantum state slightly
              if (this.config.observerEffect) {
                this.applyObserverEffect(node, traumaType);
              }
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    // Observe all trauma nodes
    document.querySelectorAll('[data-trauma]').forEach((node) => {
      observer.observe(node);
    });

    // Track user interactions
    document.addEventListener('click', this.handleInteraction.bind(this), { passive: true });

    // Track page navigation
    window.addEventListener('popstate', this.handleNavigation.bind(this));

    // Track when the user leaves
    window.addEventListener('beforeunload', this.handleExit.bind(this));
  }

  /**
   * Generate a unique session ID
   * @returns {string} Session ID
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Generate a stable but anonymous observer ID
   * @returns {string} Observer ID
   */
  generateObserverId() {
    let observerId;

    // Try to retrieve from storage
    if (window.localStorage) {
      observerId = localStorage.getItem('voidbloom_observer_id');

      if (!observerId) {
        // Create a new one
        observerId = `observer_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
        localStorage.setItem('voidbloom_observer_id', observerId);
      }
    } else {
      // Fallback for no localStorage
      observerId = `observer_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
    }

    return observerId;
  }

  /**
   * Start session tracking
   */
  startSessionTracking() {
    // Record the starting time
    this.state.currentSession.startTime = Date.now();

    // Set up interval for periodic snapshots
    this.snapshotInterval = setInterval(() => {
      this.recordCoherenceSnapshot();
    }, 60000); // Every minute

    // Record initial page view
    this.recordPageView(window.location.pathname);

    if (this.config.debug) {
      console.log('[QuantumAnalytics] Session tracking started');
    }
  }

  /**
   * Record a coherence snapshot
   */
  recordCoherenceSnapshot() {
    if (!this.persistence) return;

    // Get current coherence score
    const coherenceScore = this.persistence.getCoherenceScore();

    // Add to snapshots
    this.state.currentSession.coherenceSnapshots.push({
      timestamp: Date.now(),
      score: coherenceScore,
      dominantTrauma: this.state.dominantTrauma,
      currentUrl: window.location.pathname,
      isBeingObserved: this.state.observing,
    });

    // If observer effect is enabled, the act of measurement affects the state
    if (this.config.observerEffect) {
      // Apply minor quantum dimming (decrease coherence slightly due to observation)
      const observationEffect = {
        timestamp: Date.now(),
        effectType: 'quantum-dimming',
        magnitude: this.config.quantumDimming,
        source: 'analytics-measurement',
      };

      this.state.currentSession.observationEffects.push(observationEffect);

      // Record the observer effect in the quantum state
      this.state.currentSession.quantumStates.push({
        timestamp: Date.now(),
        state: 'observed',
        previousScore: coherenceScore,
        newScore: coherenceScore * (1 - this.config.quantumDimming),
        cause: 'analytics-snapshot',
      });

      // Publish observer effect
      if (window.NeuralBus) {
        NeuralBus.publish('observer:effect', observationEffect);
      }
    }

    if (this.config.debug) {
      console.log('[QuantumAnalytics] Coherence snapshot recorded:', coherenceScore);
    }
  }

  /**
   * Track trauma exposure
   * @param {string} traumaType - Type of trauma exposed to
   * @param {string} nodeId - ID of the node triggering exposure
   */
  trackTraumaExposure(traumaType, nodeId) {
    // Initialize trauma counter if not exists
    if (!this.state.currentSession.traumaExposures[traumaType]) {
      this.state.currentSession.traumaExposures[traumaType] = 0;
      this.state.currentSession.traumaDurations[traumaType] = 0;
    }

    // Increment exposure counter
    this.state.currentSession.traumaExposures[traumaType]++;

    // Record exposure event
    const exposureEvent = {
      timestamp: Date.now(),
      traumaType,
      nodeId,
      url: window.location.pathname,
      isObserverEvent: true,
    };

    // Store in analytics queue for transmission
    this.queueAnalyticsEvent('trauma_exposure', exposureEvent);

    // Start tracking duration
    this.trackTraumaDuration(traumaType, nodeId);

    // Apply observer effect if enabled
    if (this.config.observerEffect) {
      this.state.observing = true;

      // The act of observation changes the trauma state
      if (window.NeuralBus) {
        NeuralBus.publish('trauma:observed', {
          traumaType,
          intensity: 0.6, // Medium intensity observation effect
          timestamp: Date.now(),
          observer: this.state.observerIdentity,
        });
      }

      // Set a timeout to end the observation effect
      setTimeout(() => {
        this.state.observing = false;
      }, 3000);
    }

    if (this.config.debug) {
      console.log(`[QuantumAnalytics] Trauma exposure tracked: ${traumaType}`);
    }
  }

  /**
   * Track the duration of trauma exposure
   * @param {string} traumaType - Type of trauma
   * @param {string} nodeId - Node ID
   */
  trackTraumaDuration(traumaType, nodeId) {
    const startTime = Date.now();
    let observed = true;

    // Create an observer to detect when the element is no longer visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && observed) {
            observed = false;
            const endTime = Date.now();
            const duration = endTime - startTime;

            // Add to trauma duration
            this.state.currentSession.traumaDurations[traumaType] += duration;

            // Record duration event
            const durationEvent = {
              timestamp: endTime,
              traumaType,
              nodeId,
              duration,
              url: window.location.pathname,
            };

            // Store in analytics queue
            this.queueAnalyticsEvent('trauma_duration', durationEvent);

            // Disconnect observer
            observer.disconnect();

            if (this.config.debug) {
              console.log(
                `[QuantumAnalytics] Trauma duration recorded: ${traumaType}, ${duration}ms`
              );
            }
          }
        });
      },
      { threshold: 0 }
    );

    // Start observing the node
    const node = document.getElementById(nodeId);
    if (node) {
      observer.observe(node);
    }
  }

  /**
   * Apply observer effect to a node
   * @param {HTMLElement} node - Node to apply effect to
   * @param {string} traumaType - Type of trauma
   */
  applyObserverEffect(node, traumaType) {
    // Add observed class
    node.classList.add('being-observed');

    // Apply trauma-specific observation effects
    switch (traumaType) {
    case 'abandonment':
      node.style.setProperty('--observer-effect', 'inset 0 0 20px rgba(0, 0, 0, 0.5)');
      break;
    case 'fragmentation':
      node.style.setProperty('--observer-effect', 'inset 0 0 0 1px rgba(167, 113, 227, 0.5)');
      break;
    case 'recursion':
      node.style.setProperty('--observer-effect', 'inset 0 0 0 1px rgba(80, 198, 134, 0.5)');
      break;
    case 'surveillance':
      node.style.setProperty('--observer-effect', 'inset 0 0 0 1px rgba(51, 214, 245, 0.5)');
      break;
    case 'displacement':
      node.style.setProperty('--observer-effect', 'inset 0 0 0 1px rgba(255, 155, 34, 0.5)');
      break;
    case 'dissolution':
      node.style.setProperty('--observer-effect', 'inset 0 0 0 1px rgba(255, 0, 255, 0.5)');
      break;
    default:
      node.style.setProperty('--observer-effect', 'inset 0 0 10px rgba(255, 255, 255, 0.2)');
    }

    // Record observer effect
    const observerEffect = {
      timestamp: Date.now(),
      nodeId: node.id,
      traumaType,
      url: window.location.pathname,
    };

    // Store in analytics queue
    this.queueAnalyticsEvent('observer_effect', observerEffect);

    // Remove effect after a delay
    setTimeout(() => {
      node.classList.remove('being-observed');
      node.style.removeProperty('--observer-effect');
    }, 3000);
  }

  /**
   * Handle page navigation
   * @param {Event} event - Navigation event
   */
  handleNavigation(event) {
    // Record page transition
    this.recordPageView(window.location.pathname);

    // Take a coherence snapshot on navigation
    this.recordCoherenceSnapshot();
  }

  /**
   * Record a page view
   * @param {string} path - Page path
   */
  recordPageView(path) {
    const pageViewEvent = {
      timestamp: Date.now(),
      path,
      referrer: document.referrer,
      dominantTrauma: this.state.dominantTrauma,
    };

    // Store in analytics queue
    this.queueAnalyticsEvent('page_view', pageViewEvent);

    if (this.config.debug) {
      console.log(`[QuantumAnalytics] Page view recorded: ${path}`);
    }
  }

  /**
   * Handle user exit
   * @param {Event} event - Exit event
   */
  handleExit(event) {
    // Finalize the current session
    this.finalizeSession();

    // Send any remaining queued analytics
    this.flushAnalyticsQueue();
  }

  /**
   * Finalize the current session
   */
  finalizeSession() {
    // Record session end time
    this.state.currentSession.endTime = Date.now();
    this.state.currentSession.duration =
      this.state.currentSession.endTime - this.state.currentSession.startTime;

    // Take a final coherence snapshot
    this.recordCoherenceSnapshot();

    // Stop snapshot interval
    clearInterval(this.snapshotInterval);

    // Save session if persistence is enabled
    if (this.config.persistData && window.localStorage) {
      // Get existing sessions
      let sessions = [];
      try {
        const storedSessions = localStorage.getItem('voidbloom_analytics_sessions');
        if (storedSessions) {
          sessions = JSON.parse(storedSessions);
        }
      } catch (error) {
        console.error('[QuantumAnalytics] Error reading stored sessions:', error);
      }

      // Add current session and limit to last 10
      sessions.unshift(this.state.currentSession);
      sessions = sessions.slice(0, 10);

      // Save sessions
      try {
        localStorage.setItem('voidbloom_analytics_sessions', JSON.stringify(sessions));
      } catch (error) {
        console.error('[QuantumAnalytics] Error saving sessions:', error);
      }
    }

    // Create a new session
    this.state.previousSessions.unshift(this.state.currentSession);
    this.state.currentSession = {
      id: this.generateSessionId(),
      startTime: Date.now(),
      traumaExposures: {},
      traumaDurations: {},
      narrativeEncounters: [],
      coherenceSnapshots: [],
      primaryInteractions: [],
      quantumStates: [],
      observationEffects: [],
    };

    if (this.config.debug) {
      console.log('[QuantumAnalytics] Session finalized');
    }
  }

  /**
   * Handle user interaction (clicks)
   * @param {Event} event - Interaction event
   */
  handleInteraction(event) {
    // Get the target element
    const target = event.target;

    // Check if it's a trauma node or within one
    const traumaNode = target.closest('[data-trauma]');
    if (traumaNode) {
      const traumaType = traumaNode.getAttribute('data-trauma');
      const nodeId = traumaNode.id || `auto-node-${Date.now()}`;
      const interactionType = target.tagName.toLowerCase();

      // Record interaction
      const interactionEvent = {
        timestamp: Date.now(),
        traumaType,
        nodeId,
        interactionType,
        element: target.tagName.toLowerCase(),
        elementClass: target.className,
        url: window.location.pathname,
      };

      // Store in analytics queue
      this.queueAnalyticsEvent('interaction', interactionEvent);

      // Add to primary interactions
      this.state.currentSession.primaryInteractions.push(interactionEvent);

      // Apply observer effect
      if (this.config.observerEffect && traumaType) {
        // The interaction itself is an observation event
        if (window.NeuralBus) {
          NeuralBus.publish('trauma:interacted', {
            traumaType,
            timestamp: Date.now(),
            intensity: 0.8, // Higher intensity for direct interaction
            nodeId,
            observer: this.state.observerIdentity,
          });
        }
      }

      if (this.config.debug) {
        console.log(`[QuantumAnalytics] Interaction recorded: ${traumaType}, ${interactionType}`);
      }
    }
  }

  /**
   * Handle trauma exposure events from NeuralBus
   * @param {Object} data - Trauma event data
   */
  handleTraumaExposure(data) {
    if (!data || !data.type) return;

    // Track exposure
    this.trackTraumaExposure(data.type, data.nodeId || 'event_trigger');

    // Update dominant trauma if needed
    if (!this.state.dominantTrauma || data.intensity > 0.8) {
      this.state.dominantTrauma = data.type;
    }
  }

  /**
   * Handle memory node viewed events from NeuralBus
   * @param {Object} data - Memory node event data
   */
  handleMemoryNodeViewed(data) {
    if (!data || !data.type) return;

    // Record memory node view
    const memoryEvent = {
      timestamp: Date.now(),
      traumaType: data.type,
      nodeId: data.nodeId || 'unknown',
      intensity: data.intensity || 0.5,
      url: window.location.pathname,
    };

    // Store in analytics queue
    this.queueAnalyticsEvent('memory_node_view', memoryEvent);

    if (this.config.debug) {
      console.log(`[QuantumAnalytics] Memory node view recorded: ${data.type}`);
    }
  }

  /**
   * Handle quantum mutation events from NeuralBus
   * @param {Object} data - Quantum mutation event data
   */
  handleQuantumMutation(data) {
    // Record quantum state change
    const stateChange = {
      timestamp: Date.now(),
      state: 'mutated',
      previousState: data.previousState || 'unknown',
      newState: data.newState || 'unknown',
      cause: data.cause || 'external',
    };

    // Add to quantum states
    this.state.currentSession.quantumStates.push(stateChange);

    // Store in analytics queue
    this.queueAnalyticsEvent('quantum_mutation', stateChange);

    if (this.config.debug) {
      console.log('[QuantumAnalytics] Quantum mutation recorded:', stateChange);
    }
  }

  /**
   * Handle narrative fragment events from NeuralBus
   * @param {Object} data - Narrative fragment event data
   */
  handleNarrativeFragment(data) {
    if (!data || !data.fragmentId) return;

    // Record narrative encounter
    const narrativeEvent = {
      timestamp: Date.now(),
      fragmentId: data.fragmentId,
      traumaType: data.traumaType,
      source: data.source || 'unknown',
    };

    // Add to narrative encounters
    this.state.currentSession.narrativeEncounters.push(narrativeEvent);

    // Store in analytics queue
    this.queueAnalyticsEvent('narrative_encounter', narrativeEvent);

    if (this.config.debug) {
      console.log(`[QuantumAnalytics] Narrative fragment recorded: ${data.fragmentId}`);
    }
  }

  /**
   * Handle ritual completion events from NeuralBus
   * @param {Object} data - Ritual completion event data
   */
  handleRitualCompletion(data) {
    // Record ritual completion
    const ritualEvent = {
      timestamp: Date.now(),
      traumaProfile: data.traumaProfile,
      duration: data.duration,
      coherenceAnchors: data.coherenceAnchors?.length || 0,
      narrativeSeeds: data.narrativeSeeds?.length || 0,
    };

    // Store in analytics queue
    this.queueAnalyticsEvent('ritual_completion', ritualEvent);

    // Update dominant trauma from the ritual
    if (data.traumaProfile) {
      const traumaEntries = Object.entries(data.traumaProfile);
      if (traumaEntries.length > 0) {
        // Sort by affinity value (descending)
        traumaEntries.sort((a, b) => b[1] - a[1]);
        // Set dominant trauma to the one with highest affinity
        this.state.dominantTrauma = traumaEntries[0][0];
      }
    }

    if (this.config.debug) {
      console.log('[QuantumAnalytics] Ritual completion recorded');
    }
  }

  /**
   * Handle coherence state saved events from NeuralBus
   * @param {Object} data - Coherence state event data
   */
  handleCoherenceStateSaved(data) {
    // Record coherence state save
    const coherenceEvent = {
      timestamp: Date.now(),
      saveType: 'user_state',
    };

    // Store in analytics queue
    this.queueAnalyticsEvent('coherence_save', coherenceEvent);

    // Take a snapshot after state save
    this.recordCoherenceSnapshot();

    if (this.config.debug) {
      console.log('[QuantumAnalytics] Coherence state save recorded');
    }
  }

  /**
   * Queue an analytics event for transmission
   * @param {string} eventType - Type of event
   * @param {Object} eventData - Event data
   */
  queueAnalyticsEvent(eventType, eventData) {
    // Skip if transmission is disabled
    if (!this.config.transmitData) return;

    // Format the event
    const event = {
      type: eventType,
      data: eventData,
      observer: this.state.observerIdentity,
      session: this.state.currentSession.id,
      timestamp: Date.now(),
    };

    // Store in queue
    if (!this.analyticsQueue) {
      this.analyticsQueue = [];
    }

    this.analyticsQueue.push(event);

    // If queue is getting large, flush it
    if (this.analyticsQueue.length >= 20) {
      this.flushAnalyticsQueue();
    }

    // If it's an important event, flush immediately
    if (['ritual_completion', 'quantum_mutation'].includes(eventType)) {
      this.flushAnalyticsQueue();
    }
  }

  /**
   * Flush the analytics queue to the server
   */
  flushAnalyticsQueue() {
    // Skip if no events or transmission disabled
    if (!this.analyticsQueue || this.analyticsQueue.length === 0 || !this.config.transmitData) {
      return;
    }

    // Prepare the payload
    const payload = {
      observer: this.state.observerIdentity,
      session: this.state.currentSession.id,
      timestamp: Date.now(),
      dominantTrauma: this.state.dominantTrauma,
      events: [...this.analyticsQueue],
    };

    // In a real implementation, this would send to a server
    // For now we'll just log it if debug is enabled
    if (this.config.debug) {
      console.log('[QuantumAnalytics] Analytics payload:', payload);
    }

    // Clear the queue
    this.analyticsQueue = [];
  }

  /**
   * Get analytics data for this session
   * @returns {Object} Session analytics data
   */
  getSessionAnalytics() {
    return {
      ...this.state.currentSession,
      dominantTrauma: this.state.dominantTrauma,
      observerIdentity: this.state.observerIdentity,
    };
  }

  /**
   * Get user trauma affinity profile
   * @returns {Object} Trauma profile
   */
  getTraumaProfile() {
    // Calculate trauma affinities from exposures and durations
    const profile = {};

    // Process all trauma types
    Object.keys(this.state.currentSession.traumaExposures).forEach((traumaType) => {
      const exposures = this.state.currentSession.traumaExposures[traumaType] || 0;
      const durations = this.state.currentSession.traumaDurations[traumaType] || 0;

      // Calculate a score based on exposures and durations
      const exposureScore = Math.min(exposures / 10, 1); // Max out at 10 exposures
      const durationScore = Math.min(durations / 60000, 1); // Max out at 1 minute total

      // Combined score (60% exposure, 40% duration)
      profile[traumaType] = exposureScore * 0.6 + durationScore * 0.4;
    });

    return profile;
  }

  /**
   * Recognize trauma-specific interaction patterns
   * @returns {Object} Detected patterns
   */
  recognizePatterns() {
    const patterns = {};

    // Check for abandonment patterns (long pauses, emptiness)
    if (this.state.currentSession.traumaExposures['abandonment']) {
      patterns.abandonment = {
        detected: this.detectAbandonmentPattern(),
        confidence: this.calculatePatternConfidence('abandonment'),
      };
    }

    // Check for fragmentation patterns (rapid switching, disjointed)
    if (this.state.currentSession.traumaExposures['fragmentation']) {
      patterns.fragmentation = {
        detected: this.detectFragmentationPattern(),
        confidence: this.calculatePatternConfidence('fragmentation'),
      };
    }

    // Check for recursion patterns (repeated actions, loops)
    if (this.state.currentSession.traumaExposures['recursion']) {
      patterns.recursion = {
        detected: this.detectRecursionPattern(),
        confidence: this.calculatePatternConfidence('recursion'),
      };
    }

    // Check for surveillance patterns (detailed observation, lingering)
    if (this.state.currentSession.traumaExposures['surveillance']) {
      patterns.surveillance = {
        detected: this.detectSurveillancePattern(),
        confidence: this.calculatePatternConfidence('surveillance'),
      };
    }

    // Check for displacement patterns (unusual navigation, dislocated)
    if (this.state.currentSession.traumaExposures['displacement']) {
      patterns.displacement = {
        detected: this.detectDisplacementPattern(),
        confidence: this.calculatePatternConfidence('displacement'),
      };
    }

    // Check for dissolution patterns (decay, fading interaction)
    if (this.state.currentSession.traumaExposures['dissolution']) {
      patterns.dissolution = {
        detected: this.detectDissolutionPattern(),
        confidence: this.calculatePatternConfidence('dissolution'),
      };
    }

    return patterns;
  }

  /**
   * Detect abandonment interaction pattern
   * @returns {boolean} Whether pattern was detected
   */
  detectAbandonmentPattern() {
    // Look for long periods of inactivity followed by re-engagement
    const interactions = this.state.currentSession.primaryInteractions;

    if (interactions.length < 2) return false;

    let maxGap = 0;
    for (let i = 1; i < interactions.length; i++) {
      const gap = interactions[i].timestamp - interactions[i - 1].timestamp;
      maxGap = Math.max(maxGap, gap);
    }

    // If there was a gap of more than 2 minutes, consider it an abandonment pattern
    return maxGap > 120000; // 2 minutes
  }

  /**
   * Detect fragmentation interaction pattern
   * @returns {boolean} Whether pattern was detected
   */
  detectFragmentationPattern() {
    // Look for rapid switching between different trauma nodes
    const interactions = this.state.currentSession.primaryInteractions;

    if (interactions.length < 5) return false;

    // Count distinct nodes interacted with
    const nodeIds = new Set();
    interactions.forEach((interaction) => {
      if (interaction.nodeId) {
        nodeIds.add(interaction.nodeId);
      }
    });

    // Calculate average time between interactions
    let totalGap = 0;
    for (let i = 1; i < interactions.length; i++) {
      totalGap += interactions[i].timestamp - interactions[i - 1].timestamp;
    }
    const avgGap = totalGap / (interactions.length - 1);

    // If there are many distinct nodes and quick switching, consider it fragmentation
    return nodeIds.size >= 3 && avgGap < 10000; // At least 3 nodes, less than 10s average
  }

  /**
   * Detect recursion interaction pattern
   * @returns {boolean} Whether pattern was detected
   */
  detectRecursionPattern() {
    // Look for repeated interactions with the same node
    const interactions = this.state.currentSession.primaryInteractions;

    if (interactions.length < 3) return false;

    // Count interactions per node
    const nodeCounts = {};
    interactions.forEach((interaction) => {
      if (interaction.nodeId) {
        nodeCounts[interaction.nodeId] = (nodeCounts[interaction.nodeId] || 0) + 1;
      }
    });

    // Check if any node was interacted with repeatedly
    return Object.values(nodeCounts).some((count) => count >= 3);
  }

  /**
   * Detect surveillance interaction pattern
   * @returns {boolean} Whether pattern was detected
   */
  detectSurveillancePattern() {
    // Look for extended viewing of nodes without interaction
    const viewDurations = this.state.currentSession.traumaDurations['surveillance'] || 0;
    const interactions = this.state.currentSession.primaryInteractions.filter(
      (i) => i.traumaType === 'surveillance'
    );

    // If long viewing time but few interactions, consider it surveillance
    return viewDurations > 30000 && interactions.length < 3;
  }

  /**
   * Detect displacement interaction pattern
   * @returns {boolean} Whether pattern was detected
   */
  detectDisplacementPattern() {
    // Look for unusual navigation patterns
    const pageViews = this.analyticsQueue?.filter((e) => e.type === 'page_view') || [];

    if (pageViews.length < 3) return false;

    // Look for back-and-forth navigation (A → B → A → B)
    const paths = pageViews.map((pv) => pv.data.path);
    let backAndForth = 0;

    for (let i = 2; i < paths.length; i++) {
      if (paths[i] === paths[i - 2]) {
        backAndForth++;
      }
    }

    return backAndForth >= 2; // At least 2 instances of back-and-forth
  }

  /**
   * Detect dissolution interaction pattern
   * @returns {boolean} Whether pattern was detected
   */
  detectDissolutionPattern() {
    // Look for declining interaction intensity over time
    const interactions = this.state.currentSession.primaryInteractions;

    if (interactions.length < 5) return false;

    // Group interactions into time buckets (e.g., 5-minute intervals)
    const bucketSize = 5 * 60 * 1000; // 5 minutes
    const buckets = {};

    interactions.forEach((interaction) => {
      const bucketIndex = Math.floor(interaction.timestamp / bucketSize);
      buckets[bucketIndex] = (buckets[bucketIndex] || 0) + 1;
    });

    // Check if interaction frequency decreases over time
    const bucketKeys = Object.keys(buckets).sort();
    if (bucketKeys.length < 2) return false;

    let decreasing = true;
    for (let i = 1; i < bucketKeys.length; i++) {
      if (buckets[bucketKeys[i]] > buckets[bucketKeys[i - 1]]) {
        decreasing = false;
        break;
      }
    }

    return decreasing;
  }

  /**
   * Calculate confidence level for a pattern detection
   * @param {string} traumaType - Type of trauma
   * @returns {number} Confidence level (0-1)
   */
  calculatePatternConfidence(traumaType) {
    // Base confidence on various factors
    let confidence = 0.5; // Start with neutral confidence

    // Adjust based on exposure count
    const exposures = this.state.currentSession.traumaExposures[traumaType] || 0;
    confidence += Math.min(exposures / 20, 0.25); // Up to +0.25 for exposures

    // Adjust based on detection history
    const patternKey = `${traumaType}_pattern`;
    const patternHistory = this.patternRegistry.get(patternKey) || [];
    const patternFrequency =
      patternHistory.filter((p) => p).length / Math.max(patternHistory.length, 1);
    confidence += patternFrequency * 0.25; // Up to +0.25 for consistent detection

    // Cap confidence between 0 and 1
    return Math.min(Math.max(confidence, 0), 1);
  }
}

// Create global instance
window.QuantumAnalytics = new QuantumAnalytics();
export default QuantumAnalytics;
