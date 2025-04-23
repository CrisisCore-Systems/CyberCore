/**
 * QEAR-WEBGL-BRIDGE.JS
 * Integration bridge between QEAR cognitive engine and WebGL visualization
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * @Version: 1.0.0
 */

import { NeuralBus } from './neural-bus.js';
import { QEARConnector } from './qear-connector.js';
import { QEARCore } from './qear-core.js';
import { QuantumWebGLController } from './quantum-webgl.js';

/**
 * QEARWebGLBridge
 * Synchronizes QEAR cognitive states with WebGL visualizations
 * and provides a unified API for the entire QEAR visual system
 */
export class QEARWebGLBridge {
  // Private properties
  #config = null;
  #initialized = false;
  #neuroBusConnected = false;
  #debug = false;

  // Components
  #qearCore = null;
  #qearConnector = null;
  #webglController = null;

  // State
  #state = {
    activeTrauma: null,
    currentProfile: 'CyberLotus',
    coherence: 1.0,
    activeMutations: [],
    targetNodes: new Set(),
    emotionalState: {
      anxiety: 0.2,
      curiosity: 0.7,
      fragility: 0.3,
      recursion: 0.5,
    },
  };

  /**
   * Constructor
   * @param {Object} config - Configuration options
   */
  constructor(config = {}) {
    this.#config = {
      autoInitialize: true,
      autoSyncState: true,
      syncInterval: 100, // 10 times per second
      debugMode: false,
      useExistingInstances: true,
      targetSelector: '[data-webgl-target], [data-trauma]',
      ...config,
    };

    this.#debug = this.#config.debugMode;

    if (this.#config.autoInitialize) {
      this.initialize();
    }
  }

  /**
   * Initialize the QEAR WebGL Bridge
   * @returns {QEARWebGLBridge} Reference to this instance
   */
  initialize() {
    if (this.#initialized) return this;

    this.#log('Initializing QEAR WebGL Bridge');

    // Initialize components
    this.initializeComponents();

    // Connect to Neural Bus
    this.connectToNeuralBus();

    // Scan for target nodes
    this.scanForTargetNodes();

    // Set up automatic state synchronization
    if (this.#config.autoSyncState) {
      this.startStateSync();
    }

    // Set up event listeners
    this.setupEventListeners();

    // Mark as initialized
    this.#initialized = true;

    // Make bridge globally accessible
    window.qearWebGLBridge = this;

    this.#log('QEAR WebGL Bridge initialized');

    return this;
  }

  /**
   * Initialize required components (QEAR Core, Connector, WebGL)
   */
  initializeComponents() {
    // Check for existing instances if configured to use them
    if (this.#config.useExistingInstances) {
      this.#qearCore = window.QEARCore
        ? window.qearCore instanceof QEARCore
          ? window.qearCore
          : new QEARCore()
        : new QEARCore({ debugMode: this.#debug });

      this.#qearConnector = window.QEARConnector
        ? window.qearConnector instanceof QEARConnector
          ? window.qearConnector
          : new QEARConnector({}, this.#qearCore)
        : new QEARConnector({ debugMode: this.#debug }, this.#qearCore);

      this.#webglController = window.quantumWebGL
        ? window.quantumWebGL
        : new QuantumWebGLController({ debug: this.#debug });
    } else {
      // Create new instances
      this.#qearCore = new QEARCore({ debugMode: this.#debug });
      this.#qearConnector = new QEARConnector({ debugMode: this.#debug }, this.#qearCore);
      this.#webglController = new QuantumWebGLController({ debug: this.#debug });
    }

    this.#log('Components initialized');
  }

  /**
   * Connect to Neural Bus for communication
   */
  connectToNeuralBus() {
    if (typeof NeuralBus !== 'undefined') {
      // Subscribe to relevant events
      NeuralBus.subscribe('qear:state', this.handleQEARStateUpdate.bind(this));
      NeuralBus.subscribe('trauma:activated', this.handleTraumaEvent.bind(this));
      NeuralBus.subscribe('coherence:changed', this.handleCoherenceChange.bind(this));
      NeuralBus.subscribe('quantum:mutation', this.handleQuantumMutation.bind(this));
      NeuralBus.subscribe('webgl:initialized', this.handleWebGLInitialized.bind(this));

      this.#neuroBusConnected = true;
      this.#log('Connected to Neural Bus');

      // Announce our presence
      NeuralBus.publish('bridge:initialized', {
        components: {
          qearCore: !!this.#qearCore,
          qearConnector: !!this.#qearConnector,
          webglController: !!this.#webglController,
        },
        timestamp: Date.now(),
      });
    } else {
      this.#log('Neural Bus not found - falling back to direct communication', 'warn');

      // Set up direct communication
      this.#neuroBusConnected = false;
    }
  }

  /**
   * Start automatic state synchronization
   */
  startStateSync() {
    // Set up interval for synchronizing state
    this.syncIntervalId = setInterval(() => {
      this.syncState();
    }, this.#config.syncInterval);

    this.#log('Automatic state synchronization started');
  }

  /**
   * Stop automatic state synchronization
   */
  stopStateSync() {
    if (this.syncIntervalId) {
      clearInterval(this.syncIntervalId);
      this.syncIntervalId = null;
      this.#log('Automatic state synchronization stopped');
    }
  }

  /**
   * Synchronize state between QEAR Core and WebGL Controller
   */
  syncState() {
    if (!this.#initialized || !this.#qearCore || !this.#webglController) return;

    try {
      // Get current state from QEAR Core
      const qearState = this.#qearCore.getState();

      // Update internal state
      this.#state.currentProfile = qearState.activeProfile;
      this.#state.coherence = qearState.coherence;

      if (qearState.activeTraumas && qearState.activeTraumas.length > 0) {
        // Get highest priority trauma
        const highestTrauma = qearState.activeTraumas.reduce((highest, current) => {
          return !highest || current.intensity > highest.intensity ? current : highest;
        }, null);

        if (highestTrauma) {
          this.#state.activeTrauma = highestTrauma.type;
        }
      }

      // Synchronize with WebGL Controller through Neural Bus
      if (this.#neuroBusConnected) {
        NeuralBus.publish('qear:state', {
          activeProfile: this.#state.currentProfile,
          coherence: this.#state.coherence,
          activeTrauma: this.#state.activeTrauma,
          emotionalState: this.#state.emotionalState,
          cognitiveState: qearState.activeDecisions ? 'processing' : 'observing',
          activeDecisions: qearState.pendingMutations || 0,
          timestamp: Date.now(),
        });
      } else if (this.#webglController) {
        // Direct update if Neural Bus is not available
        this.#webglController.handleQEARStateUpdate({
          emotionalState: this.#state.emotionalState,
          cognitiveState: qearState.activeDecisions ? 'processing' : 'observing',
          activeDecisions: qearState.pendingMutations || 0,
        });

        if (this.#state.activeTrauma) {
          this.#webglController.handleTraumaEvent({
            type: this.#state.activeTrauma,
            intensity: 0.7,
          });
        }

        this.#webglController.handleCoherenceChange({
          coherence: this.#state.coherence,
        });
      }
    } catch (error) {
      this.#log('Error during state sync:', error, 'error');
    }
  }

  /**
   * Scan for target nodes in the DOM
   */
  scanForTargetNodes() {
    if (typeof document === 'undefined') return;

    const targetNodes = document.querySelectorAll(this.#config.targetSelector);

    // Clear existing nodes
    this.#state.targetNodes.clear();

    // Register each target node
    targetNodes.forEach((node) => {
      const id =
        node.id ||
        node.dataset.webglTarget ||
        `target-${Math.random().toString(36).substring(2, 9)}`;

      // Ensure the node has an ID for reference
      if (!node.id) {
        node.id = id;
      }

      // Add webgl-target attribute if needed
      if (!node.dataset.webglTarget) {
        node.dataset.webglTarget = id;
      }

      // Add to tracked nodes
      this.#state.targetNodes.add(id);

      // Register any trauma types
      if (node.dataset.trauma) {
        node.dataset.traumaType = node.dataset.trauma;
      }
    });

    this.#log(`Found ${this.#state.targetNodes.size} target nodes`);

    // Trigger WebGL scan for nodes
    if (this.#webglController) {
      this.#webglController.scanForTargetNodes();
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    if (typeof document === 'undefined') return;

    // Set up mutation observer for DOM changes
    const observer = new MutationObserver((mutations) => {
      // Check if any mutations added or removed elements
      const domChanged = mutations.some((mutation) => {
        return (
          mutation.type === 'childList' &&
          (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)
        );
      });

      if (domChanged) {
        // Scan for target nodes
        this.scanForTargetNodes();
      }
    });

    // Observe the entire document for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    this.#log('Event listeners set up');
  }

  /**
   * Handle QEAR state updates
   * @param {Object} data - State data
   */
  handleQEARStateUpdate(data) {
    if (!data) return;

    // Update internal state with QEAR data
    if (data.activeProfile) {
      this.#state.currentProfile = data.activeProfile;
    }

    if (data.coherence !== undefined) {
      this.#state.coherence = data.coherence;
    }

    if (data.activeTrauma) {
      this.#state.activeTrauma = data.activeTrauma;
    }

    if (data.emotionalState) {
      this.#state.emotionalState = {
        ...this.#state.emotionalState,
        ...data.emotionalState,
      };
    }

    this.#log('QEAR state updated');
  }

  /**
   * Handle trauma events
   * @param {Object} data - Trauma event data
   */
  handleTraumaEvent(data) {
    if (!data || !data.type) return;

    // Update active trauma
    this.#state.activeTrauma = data.type;

    this.#log(`Trauma activated: ${data.type}`);
  }

  /**
   * Handle coherence change events
   * @param {Object} data - Coherence data
   */
  handleCoherenceChange(data) {
    if (!data || data.coherence === undefined) return;

    this.#state.coherence = data.coherence;

    this.#log(`Coherence changed: ${data.coherence}`);
  }

  /**
   * Handle quantum mutation events
   * @param {Object} data - Mutation data
   */
  handleQuantumMutation(data) {
    if (!data) return;

    // Add to active mutations
    this.#state.activeMutations.push({
      type: data.type,
      profile: data.profile,
      timestamp: data.timestamp || Date.now(),
      targetId: data.targetId,
    });

    // Limit to 10 most recent mutations
    if (this.#state.activeMutations.length > 10) {
      this.#state.activeMutations.shift();
    }

    // If this mutation has a target ID, ensure it's in our target nodes
    if (data.targetId && typeof document !== 'undefined') {
      const targetElement = document.getElementById(data.targetId);
      if (targetElement && !targetElement.dataset.webglTarget) {
        targetElement.dataset.webglTarget = data.targetId;
        this.#state.targetNodes.add(data.targetId);

        // Trigger WebGL scan for nodes
        if (this.#webglController) {
          this.#webglController.scanForTargetNodes();
        }
      }
    }

    this.#log(`Quantum mutation: ${data.type}`);
  }

  /**
   * Handle WebGL initialized events
   * @param {Object} data - WebGL init data
   */
  handleWebGLInitialized(data) {
    this.#log('WebGL initialized with capabilities:', data);

    // Force a state sync to ensure WebGL has current state
    this.syncState();
  }

  /**
   * Trigger a specific trauma visualization
   * @param {string} traumaType - Type of trauma
   * @param {number} intensity - Intensity (0-1)
   * @param {string} [targetId] - Optional target node ID
   * @returns {QEARWebGLBridge} Reference to this instance
   */
  triggerTrauma(traumaType, intensity = 0.7, targetId = null) {
    if (!this.#initialized) return this;

    const traumaData = {
      type: traumaType,
      intensity: intensity,
      timestamp: Date.now(),
    };

    if (targetId) {
      traumaData.targetId = targetId;
    }

    // Update internal state
    this.#state.activeTrauma = traumaType;

    // Publish to Neural Bus or update directly
    if (this.#neuroBusConnected) {
      NeuralBus.publish('trauma:activated', traumaData);
    } else if (this.#webglController) {
      this.#webglController.handleTraumaEvent(traumaData);
    }

    // Also trigger in QEAR Core if available
    if (this.#qearCore) {
      this.#qearCore.forceMutation(traumaType, intensity);
    }

    this.#log(`Triggered trauma: ${traumaType} (${intensity})`);
    return this;
  }

  /**
   * Set coherence level
   * @param {number} level - Coherence level (0-1)
   * @returns {QEARWebGLBridge} Reference to this instance
   */
  setCoherence(level) {
    if (!this.#initialized) return this;

    // Clamp value to 0-1 range
    const coherence = Math.max(0, Math.min(1, level));

    // Update internal state
    this.#state.coherence = coherence;

    // Publish to Neural Bus or update directly
    if (this.#neuroBusConnected) {
      NeuralBus.publish('coherence:changed', {
        coherence: coherence,
        timestamp: Date.now(),
      });
    } else if (this.#webglController) {
      this.#webglController.handleCoherenceChange({
        coherence: coherence,
      });
    }

    this.#log(`Set coherence: ${coherence}`);
    return this;
  }

  /**
   * Apply a specific mutation
   * @param {string} mutationType - Type of mutation
   * @param {string} [profile] - Optional profile name
   * @param {string} [targetId] - Optional target node ID
   * @returns {QEARWebGLBridge} Reference to this instance
   */
  applyMutation(mutationType, profile = null, targetId = null) {
    if (!this.#initialized) return this;

    // Use current profile if none provided
    const activeProfile = profile || this.#state.currentProfile;

    const mutationData = {
      type: mutationType,
      profile: activeProfile,
      timestamp: Date.now(),
    };

    if (targetId) {
      mutationData.targetId = targetId;
    }

    // Publish to Neural Bus or update directly
    if (this.#neuroBusConnected) {
      NeuralBus.publish('quantum:mutation', mutationData);
    } else if (this.#webglController) {
      this.#webglController.handleQuantumMutation(mutationData);
    }

    this.#log(`Applied mutation: ${mutationType} (${activeProfile})`);
    return this;
  }

  /**
   * Apply a visualization to a DOM element
   * @param {string|Element} target - Target element or selector
   * @param {string} effectType - Type of effect to apply
   * @param {Object} [options] - Effect options
   * @returns {QEARWebGLBridge} Reference to this instance
   */
  applyVisualization(target, effectType, options = {}) {
    if (!this.#initialized || typeof document === 'undefined') return this;

    // Get target element
    const element = typeof target === 'string' ? document.querySelector(target) : target;

    if (!element) {
      this.#log(`Target element not found: ${target}`, 'warn');
      return this;
    }

    // Ensure the element has an ID
    const id = element.id || `target-${Math.random().toString(36).substring(2, 9)}`;
    if (!element.id) {
      element.id = id;
    }

    // Add necessary attributes
    element.dataset.webglTarget = id;

    if (options.traumaType) {
      element.dataset.traumaType = options.traumaType;
    }

    if (options.intensity) {
      element.dataset.traumaIntensity = options.intensity;
    }

    // Update internal state
    this.#state.targetNodes.add(id);

    // Apply effect
    this.applyMutation(effectType, options.profile, id);

    // Trigger WebGL scan for nodes
    if (this.#webglController) {
      this.#webglController.scanForTargetNodes();
    }

    this.#log(`Applied visualization: ${effectType} to ${id}`);
    return this;
  }

  /**
   * Get current state
   * @returns {Object} Current state
   */
  getState() {
    return {
      currentProfile: this.#state.currentProfile,
      coherence: this.#state.coherence,
      activeTrauma: this.#state.activeTrauma,
      targetNodes: Array.from(this.#state.targetNodes),
      activeMutations: [...this.#state.activeMutations],
      emotionalState: { ...this.#state.emotionalState },
    };
  }

  /**
   * Set debug mode
   * @param {boolean} enabled - Whether debug mode should be enabled
   * @returns {QEARWebGLBridge} Reference to this instance
   */
  setDebugMode(enabled) {
    this.#debug = !!enabled;

    // Update components
    if (this.#qearCore) {
      this.#qearCore.setDebugMode(enabled);
    }

    if (this.#qearConnector) {
      this.#qearConnector.setDebugMode(enabled);
    }

    if (this.#webglController && this.#webglController.setDebugMode) {
      this.#webglController.setDebugMode(enabled);
    }

    this.#log(`Debug mode ${enabled ? 'enabled' : 'disabled'}`);
    return this;
  }

  /**
   * Clean up and dispose
   */
  dispose() {
    // Stop state sync
    this.stopStateSync();

    // Dispose of WebGL controller if available
    if (this.#webglController && this.#webglController.dispose) {
      this.#webglController.dispose();
    }

    // Unsubscribe from Neural Bus
    if (this.#neuroBusConnected && typeof NeuralBus !== 'undefined') {
      NeuralBus.unsubscribe('qear:state', this.handleQEARStateUpdate);
      NeuralBus.unsubscribe('trauma:activated', this.handleTraumaEvent);
      NeuralBus.unsubscribe('coherence:changed', this.handleCoherenceChange);
      NeuralBus.unsubscribe('quantum:mutation', this.handleQuantumMutation);
      NeuralBus.unsubscribe('webgl:initialized', this.handleWebGLInitialized);
    }

    this.#log('Disposed of QEAR WebGL Bridge');
  }

  /**
   * Log debug messages
   * @private
   * @param {string} message - Message to log
   * @param {string} [level='info'] - Log level
   */
  #log(message, level = 'info') {
    if (!this.#debug) return;

    const prefix = '[QEAR WebGL Bridge]';

    switch (level) {
      case 'error':
        console.error(`${prefix} ${message}`);
        break;
      case 'warn':
        console.warn(`${prefix} ${message}`);
        break;
      default:
        console.log(`${prefix} ${message}`);
    }
  }
}

// Auto-initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.qearWebGLBridge = new QEARWebGLBridge({ debugMode: true });
});

export default QEARWebGLBridge;
