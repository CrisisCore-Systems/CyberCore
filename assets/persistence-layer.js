/**
 * VoidBloom Coherence Persistence Layer
 * Neurological backbone for persistent state maintenance
 * @version 1.0.0
 * @MutationCompatible: VoidBloom, QuantumMythos
 * @StrategyProfile: memory-persistent
 */

import { NeuralBus } from './neural-bus.js';

/**
 *
 */
export class CoherencePersistence {
  /**
   *
   */
  constructor(options = {}) {
    // Configuration with defaults
    this.config = {
      storageKey: 'voidbloom_coherence_state',
      compressionEnabled: true,
      encryptionSalt: 'quantum-salt-342',
      persistenceInterval: 5000, // 5 seconds
      decompositionRate: 0.0001, // Natural coherence decay
      maxSnapshots: 7,
      debounceInterval: 1000, // 1 second
      autoInitialize: true,
      debug: false,
      ...options,
    };

    // Core state
    this.state = {
      initialized: false,
      isDecaying: false,
      lastPersistenceTime: Date.now(),
      suspendDecay: false,
      memoryTraces: new Map(),
      traumaAffinities: new Map(),
      narrativeFragments: [],
      stateSnapshots: [],
      coherenceScore: 0.5, // Default starting score
      quantumState: 'superposition', // Default quantum state
      sessionStartTime: Date.now(),
      userInitialized: false,
      activeAnchors: [],
    };

    // Save timeout handle
    this.persistenceTimeout = null;
    this.decayInterval = null;

    // Pending changes queue to optimize storage
    this.pendingChanges = [];

    // Initialize if auto
    if (this.config.autoInitialize) {
      this.initialize();
    }
  }

  /**
   * Initialize the persistence layer
   * @returns {Promise<boolean>} Whether initialization was successful
   */
  async initialize() {
    try {
      // Attempt to load existing state
      const loadedSuccessfully = await this.loadState();

      if (loadedSuccessfully) {
        console.log('[CoherencePersistence] Loaded existing state');
      } else {
        console.log('[CoherencePersistence] No existing state, starting fresh');
      }

      // Start persistence cycle
      this.startPersistenceCycle();

      // Start natural decay process if enabled
      if (this.config.decompositionRate > 0) {
        this.startCoherenceDecay();
      }

      // Connect to NeuralBus if available
      if (window.NeuralBus) {
        this.connectToNeuralBus();
      }

      this.state.initialized = true;

      // Dispatch initialization event
      document.dispatchEvent(
        new CustomEvent('coherence:initialized', {
          detail: { persistence: this },
        })
      );

      return true;
    } catch (error) {
      console.error('[CoherencePersistence] Initialization failed:', error);
      return false;
    }
  }

  /**
   * Connect to the NeuralBus event system
   */
  connectToNeuralBus() {
    // Register with NeuralBus
    const { nonce } = NeuralBus.register('coherence-persistence', {
      version: '1.0.0',
      profile: 'memory-persistent',
    });

    this.nonce = nonce;

    // Subscribe to relevant events
    NeuralBus.subscribe('trauma:activated', this.handleTraumaActivation.bind(this));
    NeuralBus.subscribe('trauma:observed', this.handleTraumaObservation.bind(this));
    NeuralBus.subscribe('trauma:interacted', this.handleTraumaInteraction.bind(this));
    NeuralBus.subscribe('narrative:fragment:discovered', this.handleNarrativeFragment.bind(this));
    NeuralBus.subscribe('observer:effect', this.handleObserverEffect.bind(this));
    NeuralBus.subscribe('ritual:completed', this.handleRitualCompletion.bind(this));
    NeuralBus.subscribe('quantum:mutation', this.handleQuantumMutation.bind(this));

    // Publish persistence ready event
    NeuralBus.publish('coherence:ready', {
      timestamp: Date.now(),
      coherenceScore: this.state.coherenceScore,
      quantumState: this.state.quantumState,
    });

    console.log('[CoherencePersistence] Connected to NeuralBus');
  }

  /**
   * Start the persistence cycle
   */
  startPersistenceCycle() {
    // Clear any existing timeout
    if (this.persistenceTimeout) {
      clearTimeout(this.persistenceTimeout);
    }

    // Set up recurring persistence
    this.persistenceTimeout = setInterval(() => {
      this.persistState();
    }, this.config.persistenceInterval);

    console.log(
      `[CoherencePersistence] Persistence cycle started (${this.config.persistenceInterval}ms interval)`
    );
  }

  /**
   * Start the natural coherence decay process
   */
  startCoherenceDecay() {
    // Clear any existing interval
    if (this.decayInterval) {
      clearInterval(this.decayInterval);
    }

    // Set the state
    this.state.isDecaying = true;

    // Set up decay interval - faster than persistence to ensure smooth decay
    this.decayInterval = setInterval(() => {
      this.applyCoherenceDecay();
    }, 1000); // Check every second

    console.log(
      `[CoherencePersistence] Coherence decay started (rate: ${this.config.decompositionRate})`
    );
  }

  /**
   * Apply natural coherence decay
   */
  applyCoherenceDecay() {
    // Skip if decay is suspended
    if (this.state.suspendDecay) return;

    // Calculate time since last decay
    const now = Date.now();
    const timeSinceLastDecay = now - (this.state.lastDecayTime || this.state.sessionStartTime);
    const decaySeconds = timeSinceLastDecay / 1000;

    // Calculate decay amount
    const decayAmount = this.config.decompositionRate * decaySeconds;

    // Apply decay to coherence score
    const newScore = Math.max(0, this.state.coherenceScore - decayAmount);

    // Only update if there's a meaningful change
    if (Math.abs(newScore - this.state.coherenceScore) > 0.0001) {
      this.state.coherenceScore = newScore;
      this.state.lastDecayTime = now;

      // If coherence falls too low, trigger quantum state change
      if (newScore < 0.2 && this.state.quantumState !== 'decoherent') {
        this.state.quantumState = 'decoherent';

        // Publish quantum state change
        if (window.NeuralBus) {
          NeuralBus.publish('quantum:mutation', {
            timestamp: now,
            previousState: 'coherent',
            newState: 'decoherent',
            cause: 'natural-decay',
            coherenceScore: newScore,
          });
        }
      }

      // Queue for next persistence cycle
      this.queueStateChange('coherenceScore', newScore);
    }
  }

  /**
   * Temporarily suspend coherence decay
   * @param {number} durationMs - How long to suspend decay (ms)
   */
  suspendDecay(durationMs = 30000) {
    this.state.suspendDecay = true;

    // Set timeout to resume decay
    setTimeout(() => {
      this.state.suspendDecay = false;
    }, durationMs);

    if (this.config.debug) {
      console.log(`[CoherencePersistence] Decay suspended for ${durationMs}ms`);
    }
  }

  /**
   * Load state from storage
   * @returns {Promise<boolean>} Whether state was successfully loaded
   */
  async loadState() {
    try {
      // Try to get from localStorage first
      if (window.localStorage) {
        const storedState = localStorage.getItem(this.config.storageKey);

        if (storedState) {
          // Decompress and decrypt if needed
          const parsedState = this.config.compressionEnabled
            ? await this.decompressState(storedState)
            : JSON.parse(storedState);

          // Merge with current state
          this.mergeStoredState(parsedState);

          return true;
        }
      }

      // If localStorage failed or was empty, try IndexedDB
      if (window.indexedDB) {
        return new Promise((resolve) => {
          const request = indexedDB.open('VoidBloomPersistence', 1);

          request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('coherenceState')) {
              db.createObjectStore('coherenceState', { keyPath: 'id' });
            }
          };

          request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['coherenceState'], 'readonly');
            const store = transaction.objectStore('coherenceState');
            const getRequest = store.get('currentState');

            getRequest.onsuccess = () => {
              if (getRequest.result) {
                // Merge with current state
                this.mergeStoredState(getRequest.result.state);
                resolve(true);
              } else {
                resolve(false);
              }
            };

            getRequest.onerror = () => {
              console.error('[CoherencePersistence] IndexedDB load error');
              resolve(false);
            };
          };

          request.onerror = () => {
            console.error('[CoherencePersistence] IndexedDB open error');
            resolve(false);
          };
        });
      }

      return false;
    } catch (error) {
      console.error('[CoherencePersistence] Error loading state:', error);
      return false;
    }
  }

  /**
   * Persist state to storage
   * @returns {Promise<boolean>} Whether state was successfully saved
   */
  async persistState() {
    try {
      // Skip if no pending changes
      if (this.pendingChanges.length === 0) {
        return true;
      }

      // Take a snapshot first
      this.takeSnapshot();

      // Prepare state for storage
      const stateToStore = this.prepareStateForStorage();

      // Update last persistence time
      this.state.lastPersistenceTime = Date.now();

      // Try to store in localStorage first
      if (window.localStorage) {
        try {
          // Compress if enabled
          const storageValue = this.config.compressionEnabled
            ? await this.compressState(stateToStore)
            : JSON.stringify(stateToStore);

          localStorage.setItem(this.config.storageKey, storageValue);

          // Clear pending changes
          this.pendingChanges = [];

          // Publish persistence event
          if (window.NeuralBus) {
            NeuralBus.publish('coherence:state:saved', {
              timestamp: Date.now(),
              method: 'localStorage',
              compressed: this.config.compressionEnabled,
            });
          }

          return true;
        } catch (e) {
          console.warn('[CoherencePersistence] localStorage failed, trying IndexedDB', e);
          // Continue to IndexedDB if localStorage fails (e.g., quota exceeded)
        }
      }

      // Use IndexedDB as fallback
      if (window.indexedDB) {
        return new Promise((resolve) => {
          const request = indexedDB.open('VoidBloomPersistence', 1);

          request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('coherenceState')) {
              db.createObjectStore('coherenceState', { keyPath: 'id' });
            }
          };

          request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['coherenceState'], 'readwrite');
            const store = transaction.objectStore('coherenceState');

            const putRequest = store.put({
              id: 'currentState',
              state: stateToStore,
              timestamp: Date.now(),
            });

            putRequest.onsuccess = () => {
              // Clear pending changes
              this.pendingChanges = [];

              // Publish persistence event
              if (window.NeuralBus) {
                NeuralBus.publish('coherence:state:saved', {
                  timestamp: Date.now(),
                  method: 'indexedDB',
                });
              }

              resolve(true);
            };

            putRequest.onerror = () => {
              console.error('[CoherencePersistence] IndexedDB save error');
              resolve(false);
            };
          };

          request.onerror = () => {
            console.error('[CoherencePersistence] IndexedDB open error');
            resolve(false);
          };
        });
      }

      return false;
    } catch (error) {
      console.error('[CoherencePersistence] Error persisting state:', error);
      return false;
    }
  }

  /**
   * Decompress stored state
   * @param {string} compressedState - Compressed state string
   * @returns {Object} Decompressed state object
   */
  async decompressState(compressedState) {
    // In a real implementation, this would use actual compression
    // For simplicity, we're just using JSON parse here
    try {
      return JSON.parse(compressedState);
    } catch (error) {
      console.error('[CoherencePersistence] Decompression error:', error);
      return {};
    }
  }

  /**
   * Compress state for storage
   * @param {Object} state - State to compress
   * @returns {string} Compressed state string
   */
  async compressState(state) {
    // In a real implementation, this would use actual compression
    // For simplicity, we're just using JSON stringify here
    return JSON.stringify(state);
  }

  /**
   * Merge stored state with current state
   * @param {Object} storedState - State from storage
   */
  mergeStoredState(storedState) {
    if (!storedState) return;

    // Core state properties
    if (storedState.coherenceScore !== undefined) {
      this.state.coherenceScore = storedState.coherenceScore;
    }

    if (storedState.quantumState) {
      this.state.quantumState = storedState.quantumState;
    }

    if (storedState.lastPersistenceTime) {
      this.state.lastPersistenceTime = storedState.lastPersistenceTime;
    }

    // Memory traces
    if (storedState.memoryTraces) {
      this.state.memoryTraces = new Map(Object.entries(storedState.memoryTraces));
    }

    // Trauma affinities
    if (storedState.traumaAffinities) {
      this.state.traumaAffinities = new Map(Object.entries(storedState.traumaAffinities));
    }

    // Narrative fragments
    if (Array.isArray(storedState.narrativeFragments)) {
      this.state.narrativeFragments = storedState.narrativeFragments;
    }

    // State snapshots
    if (Array.isArray(storedState.stateSnapshots)) {
      this.state.stateSnapshots = storedState.stateSnapshots;
    }

    // Active anchors
    if (Array.isArray(storedState.activeAnchors)) {
      this.state.activeAnchors = storedState.activeAnchors;
    }

    // Mark as user initialized if this was a restore
    this.state.userInitialized = true;

    if (this.config.debug) {
      console.log('[CoherencePersistence] Merged stored state');
    }
  }

  /**
   * Prepare current state for storage
   * @returns {Object} State ready for storage
   */
  prepareStateForStorage() {
    // Create a storage-friendly state object
    return {
      coherenceScore: this.state.coherenceScore,
      quantumState: this.state.quantumState,
      lastPersistenceTime: Date.now(),

      // Convert Map to Object for storage
      memoryTraces: Object.fromEntries(this.state.memoryTraces),
      traumaAffinities: Object.fromEntries(this.state.traumaAffinities),

      narrativeFragments: this.state.narrativeFragments,
      stateSnapshots: this.state.stateSnapshots,
      activeAnchors: this.state.activeAnchors,
      version: '1.0.0',
    };
  }

  /**
   * Take a state snapshot for quantum reconstruction
   */
  takeSnapshot() {
    // Create a snapshot
    const snapshot = {
      timestamp: Date.now(),
      coherenceScore: this.state.coherenceScore,
      quantumState: this.state.quantumState,
      dominantTrauma: this.getDominantTrauma().type,
      narrativeCount: this.state.narrativeFragments.length,
      affinityCount: this.state.traumaAffinities.size,
    };

    // Add to snapshots array
    this.state.stateSnapshots.unshift(snapshot);

    // Limit to max snapshots
    if (this.state.stateSnapshots.length > this.config.maxSnapshots) {
      this.state.stateSnapshots = this.state.stateSnapshots.slice(0, this.config.maxSnapshots);
    }

    // Queue for storage
    this.queueStateChange('stateSnapshots', this.state.stateSnapshots);

    if (this.config.debug) {
      console.log('[CoherencePersistence] Snapshot taken:', snapshot);
    }
  }

  /**
   * Queue a state change for persistence
   * @param {string} property - Property that changed
   * @param {any} value - New value
   */
  queueStateChange(property, value) {
    // Add to pending changes
    this.pendingChanges.push({
      property,
      value,
      timestamp: Date.now(),
    });

    // Debounce persistence if many changes are happening
    this.debouncePersistence();
  }

  /**
   * Debounce persistence to avoid too many writes
   */
  debouncePersistence() {
    // Clear any existing timeout
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    // Set a new timeout
    this.debounceTimeout = setTimeout(() => {
      this.persistState();
    }, this.config.debounceInterval);
  }

  /**
   * Record a trauma activation event
   * @param {string} traumaType - Type of trauma
   * @param {number} intensity - Intensity of trauma (0-1)
   * @param {string} source - Source of activation
   */
  recordTraumaActivation(traumaType, intensity = 0.5, source = 'unknown') {
    // Ensure trauma type is valid
    if (!traumaType) return;

    // Get current affinity or initialize
    const current = this.state.traumaAffinities.get(traumaType) || {
      activations: 0,
      intensity: 0,
      lastActivation: null,
      sources: {},
    };

    // Update trauma affinity
    current.activations += 1;
    current.intensity = Math.max(current.intensity, intensity);
    current.lastActivation = Date.now();

    // Track activation source
    current.sources[source] = (current.sources[source] || 0) + 1;

    // Store updated value
    this.state.traumaAffinities.set(traumaType, current);

    // Add a memory trace for this activation
    this.recordMemoryTrace(traumaType, 'activation', {
      timestamp: Date.now(),
      intensity,
      source,
    });

    // Queue for storage
    this.queueStateChange('traumaAffinities', Object.fromEntries(this.state.traumaAffinities));

    // Increase coherence score
    this.modifyCoherenceScore(intensity * 0.1);

    if (this.config.debug) {
      console.log(
        `[CoherencePersistence] Trauma activation recorded: ${traumaType} (${intensity})`
      );
    }
  }

  /**
   * Record a memory trace
   * @param {string} traumaType - Type of trauma
   * @param {string} traceType - Type of trace
   * @param {Object} data - Trace data
   */
  recordMemoryTrace(traumaType, traceType, data) {
    // Generate trace ID
    const traceId = `trace-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Create trace object
    const trace = {
      id: traceId,
      traumaType,
      traceType,
      data,
      created: Date.now(),
    };

    // Store in memory traces
    this.state.memoryTraces.set(traceId, trace);

    // Limit memory traces to reasonable amount (last 100)
    if (this.state.memoryTraces.size > 100) {
      // Convert to array, sort by timestamp, take latest 100
      const traces = Array.from(this.state.memoryTraces.entries())
        .sort((a, b) => b[1].created - a[1].created)
        .slice(0, 100);

      // Convert back to map
      this.state.memoryTraces = new Map(traces);
    }

    // Queue for storage
    this.queueStateChange('memoryTraces', Object.fromEntries(this.state.memoryTraces));
  }

  /**
   * Record a narrative fragment
   * @param {string} fragmentId - Fragment identifier
   * @param {string} text - Fragment text
   * @param {string} traumaType - Associated trauma type
   * @param {string} source - Source of fragment
   */
  recordNarrativeFragment(fragmentId, text, traumaType, source = 'unknown') {
    // Create fragment object
    const fragment = {
      id: fragmentId,
      text,
      traumaType,
      source,
      discovered: Date.now(),
      exposures: 1,
      coherenceContribution: 0.05, // Initial contribution
    };

    // Check if fragment already exists
    const existingIndex = this.state.narrativeFragments.findIndex((f) => f.id === fragmentId);

    if (existingIndex >= 0) {
      // Update existing fragment
      this.state.narrativeFragments[existingIndex].exposures += 1;
      this.state.narrativeFragments[existingIndex].coherenceContribution += 0.01;
    } else {
      // Add new fragment
      this.state.narrativeFragments.push(fragment);
    }

    // Queue for storage
    this.queueStateChange('narrativeFragments', this.state.narrativeFragments);

    // Increase coherence score
    this.modifyCoherenceScore(0.05);

    if (this.config.debug) {
      console.log(`[CoherencePersistence] Narrative fragment recorded: ${fragmentId}`);
    }
  }

  /**
   * Add an active coherence anchor
   * @param {Object} anchor - Coherence anchor object
   */
  addCoherenceAnchor(anchor) {
    if (!anchor || !anchor.id) return;

    // Check if anchor already exists
    const existingIndex = this.state.activeAnchors.findIndex((a) => a.id === anchor.id);

    if (existingIndex >= 0) {
      // Update existing anchor
      this.state.activeAnchors[existingIndex] = {
        ...this.state.activeAnchors[existingIndex],
        ...anchor,
        lastActivation: Date.now(),
      };
    } else {
      // Add new anchor
      this.state.activeAnchors.push({
        ...anchor,
        created: Date.now(),
        lastActivation: Date.now(),
      });
    }

    // Queue for storage
    this.queueStateChange('activeAnchors', this.state.activeAnchors);

    // Significant coherence boost
    this.modifyCoherenceScore(0.1);

    if (this.config.debug) {
      console.log(`[CoherencePersistence] Coherence anchor added: ${anchor.id}`);
    }
  }

  /**
   * Remove a coherence anchor
   * @param {string} anchorId - Anchor identifier
   */
  removeCoherenceAnchor(anchorId) {
    if (!anchorId) return;

    // Find and remove the anchor
    const initialLength = this.state.activeAnchors.length;
    this.state.activeAnchors = this.state.activeAnchors.filter((a) => a.id !== anchorId);

    // If anchor was removed
    if (initialLength !== this.state.activeAnchors.length) {
      // Queue for storage
      this.queueStateChange('activeAnchors', this.state.activeAnchors);

      // Coherence drop from losing anchor
      this.modifyCoherenceScore(-0.1);

      if (this.config.debug) {
        console.log(`[CoherencePersistence] Coherence anchor removed: ${anchorId}`);
      }
    }
  }

  /**
   * Modify the coherence score
   * @param {number} amount - Amount to modify by
   * @param {boolean} absolute - Whether this is an absolute value or relative
   */
  modifyCoherenceScore(amount, absolute = false) {
    // Calculate new score
    const newScore = absolute
      ? amount
      : Math.max(0, Math.min(1, this.state.coherenceScore + amount));

    // Update score if changed
    if (newScore !== this.state.coherenceScore) {
      this.state.coherenceScore = newScore;

      // Queue for storage
      this.queueStateChange('coherenceScore', newScore);

      // Update quantum state if necessary
      this.updateQuantumState();
    }
  }

  /**
   * Update quantum state based on coherence score
   */
  updateQuantumState() {
    let newState = this.state.quantumState;

    // Determine state based on coherence score
    if (this.state.coherenceScore < 0.2) {
      newState = 'decoherent';
    } else if (this.state.coherenceScore < 0.4) {
      newState = 'collapsed';
    } else if (this.state.coherenceScore < 0.7) {
      newState = 'superposition';
    } else {
      newState = 'entangled';
    }

    // Update if changed
    if (newState !== this.state.quantumState) {
      const previousState = this.state.quantumState;
      this.state.quantumState = newState;

      // Queue for storage
      this.queueStateChange('quantumState', newState);

      // Publish quantum mutation event
      if (window.NeuralBus) {
        NeuralBus.publish('quantum:mutation', {
          timestamp: Date.now(),
          previousState,
          newState,
          cause: 'coherence-threshold',
          coherenceScore: this.state.coherenceScore,
        });
      }

      if (this.config.debug) {
        console.log(`[CoherencePersistence] Quantum state changed: ${previousState} → ${newState}`);
      }
    }
  }

  /**
   * Get the dominant trauma affinity
   * @returns {Object} Dominant trauma information
   */
  getDominantTrauma() {
    // Default if no affinities
    if (this.state.traumaAffinities.size === 0) {
      return { type: 'dissolution', intensity: 0.5 };
    }

    // Find highest intensity trauma
    let maxIntensity = 0;
    let dominantType = 'dissolution';

    this.state.traumaAffinities.forEach((data, type) => {
      if (data.intensity > maxIntensity) {
        maxIntensity = data.intensity;
        dominantType = type;
      }
    });

    return {
      type: dominantType,
      intensity: maxIntensity,
      data: this.state.traumaAffinities.get(dominantType),
    };
  }

  /**
   * Get a trauma affinity value
   * @param {string} traumaType - Type of trauma
   * @returns {number} Affinity value (0-1)
   */
  getTraumaAffinity(traumaType) {
    const affinity = this.state.traumaAffinities.get(traumaType);
    return affinity ? affinity.intensity : 0;
  }

  /**
   * Get current coherence score
   * @returns {number} Current coherence score (0-1)
   */
  getCoherenceScore() {
    return this.state.coherenceScore;
  }

  /**
   * Get current quantum state
   * @returns {string} Quantum state
   */
  getQuantumState() {
    return this.state.quantumState;
  }

  /**
   * Get all trauma affinities
   * @returns {Object} Map of trauma affinities
   */
  getAllTraumaAffinities() {
    // Convert Map to Object
    return Object.fromEntries(this.state.traumaAffinities);
  }

  /**
   * Get all active coherence anchors
   * @returns {Array} List of coherence anchors
   */
  getActiveAnchors() {
    return [...this.state.activeAnchors];
  }

  /**
   * Get all narrative fragments
   * @returns {Array} List of narrative fragments
   */
  getNarrativeFragments() {
    return [...this.state.narrativeFragments];
  }

  /**
   * Get last state snapshot
   * @returns {Object} Last state snapshot
   */
  getLastSnapshot() {
    return this.state.stateSnapshots[0] || null;
  }

  /**
   * Get all memory traces for a trauma type
   * @param {string} traumaType - Type of trauma
   * @returns {Array} Memory traces
   */
  getMemoryTraces(traumaType) {
    // Convert memory traces Map to Array
    const traces = Array.from(this.state.memoryTraces.values());

    // Filter by trauma type if provided
    return traumaType ? traces.filter((trace) => trace.traumaType === traumaType) : traces;
  }

  /**
   * Reconstruct state from past snapshot
   * @param {number} snapshotIndex - Index of snapshot to reconstruct from
   * @returns {boolean} Whether reconstruction was successful
   */
  reconstructFromSnapshot(snapshotIndex = 0) {
    // Ensure snapshot exists
    if (!this.state.stateSnapshots[snapshotIndex]) {
      return false;
    }

    // Get snapshot
    const snapshot = this.state.stateSnapshots[snapshotIndex];

    // Reconstruct core state
    this.state.coherenceScore = snapshot.coherenceScore;
    this.state.quantumState = snapshot.quantumState;

    // Queue for storage
    this.queueStateChange('coherenceScore', snapshot.coherenceScore);
    this.queueStateChange('quantumState', snapshot.quantumState);

    // Immediately persist
    this.persistState();

    // Publish reconstruction event
    if (window.NeuralBus) {
      NeuralBus.publish('coherence:reconstructed', {
        timestamp: Date.now(),
        snapshotTimestamp: snapshot.timestamp,
        coherenceScore: snapshot.coherenceScore,
        quantumState: snapshot.quantumState,
      });
    }

    if (this.config.debug) {
      console.log(`[CoherencePersistence] Reconstructed from snapshot: ${snapshot.timestamp}`);
    }

    return true;
  }

  /**
   * Clear all persistence data (factory reset)
   */
  async clearAllData() {
    try {
      // Clear localStorage
      if (window.localStorage) {
        localStorage.removeItem(this.config.storageKey);
      }

      // Clear IndexedDB
      if (window.indexedDB) {
        await new Promise((resolve) => {
          const request = indexedDB.deleteDatabase('VoidBloomPersistence');
          request.onsuccess = () => resolve();
          request.onerror = () => resolve();
        });
      }

      // Reset state
      this.state.memoryTraces = new Map();
      this.state.traumaAffinities = new Map();
      this.state.narrativeFragments = [];
      this.state.stateSnapshots = [];
      this.state.coherenceScore = 0.5;
      this.state.quantumState = 'superposition';
      this.state.activeAnchors = [];

      // Publish reset event
      if (window.NeuralBus) {
        NeuralBus.publish('coherence:reset', {
          timestamp: Date.now(),
        });
      }

      console.log('[CoherencePersistence] All data cleared');
      return true;
    } catch (error) {
      console.error('[CoherencePersistence] Error clearing data:', error);
      return false;
    }
  }

  /**
   * Handle trauma activation event from NeuralBus
   * @param {Object} data - Event data
   */
  handleTraumaActivation(data) {
    if (!data || !data.type) return;

    this.recordTraumaActivation(data.type, data.intensity || 0.5, data.source || 'neural-bus');
  }

  /**
   * Handle trauma observation event from NeuralBus
   * @param {Object} data - Event data
   */
  handleTraumaObservation(data) {
    if (!data || !data.traumaType) return;

    // Record as a memory trace
    this.recordMemoryTrace(data.traumaType, 'observation', {
      timestamp: data.timestamp || Date.now(),
      intensity: data.intensity || 0.5,
      observer: data.observer,
    });

    // Minor coherence boost from being observed
    this.modifyCoherenceScore(0.02);
  }

  /**
   * Handle trauma interaction event from NeuralBus
   * @param {Object} data - Event data
   */
  handleTraumaInteraction(data) {
    if (!data || !data.traumaType) return;

    // Record as a memory trace
    this.recordMemoryTrace(data.traumaType, 'interaction', {
      timestamp: data.timestamp || Date.now(),
      intensity: data.intensity || 0.5,
      nodeId: data.nodeId,
    });

    // Larger coherence boost from direct interaction
    this.modifyCoherenceScore(0.05);
  }

  /**
   * Handle narrative fragment event from NeuralBus
   * @param {Object} data - Event data
   */
  handleNarrativeFragment(data) {
    if (!data || !data.fragmentId || !data.text) return;

    this.recordNarrativeFragment(
      data.fragmentId,
      data.text,
      data.traumaType || 'unknown',
      data.source || 'neural-bus'
    );
  }

  /**
   * Handle observer effect event from NeuralBus
   * @param {Object} data - Event data
   */
  handleObserverEffect(data) {
    if (!data) return;

    // Small coherence decrease from observation
    if (data.effectType === 'quantum-dimming') {
      this.modifyCoherenceScore(-Math.min(0.05, data.magnitude || 0.01));
    }
  }

  /**
   * Handle ritual completion event from NeuralBus
   * @param {Object} data - Event data
   */
  handleRitualCompletion(data) {
    if (!data) return;

    // Add coherence anchors from ritual
    if (Array.isArray(data.coherenceAnchors)) {
      data.coherenceAnchors.forEach((anchor) => {
        this.addCoherenceAnchor(anchor);
      });
    }

    // Update trauma affinities from ritual profile
    if (data.traumaProfile) {
      Object.entries(data.traumaProfile).forEach(([type, value]) => {
        this.recordTraumaActivation(type, value, 'ritual-completion');
      });
    }

    // Major coherence boost from completing ritual
    this.modifyCoherenceScore(0.2);

    // Persist immediately
    this.persistState();
  }

  /**
   * Handle quantum mutation event from NeuralBus
   * @param {Object} data - Event data
   */
  handleQuantumMutation(data) {
    if (!data || !data.newState) return;

    // Only update if it wasn't triggered by us
    if (data.cause !== 'coherence-threshold') {
      this.state.quantumState = data.newState;
      this.queueStateChange('quantumState', data.newState);
    }

    // Take a snapshot after quantum mutation
    this.takeSnapshot();

    // Trigger persistence
    this.persistState();
  }
}

// Create global instance
window.CoherencePersistence = new CoherencePersistence();
export default CoherencePersistence;
