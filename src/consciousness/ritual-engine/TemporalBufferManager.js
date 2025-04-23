import { neuralBus } from '../neural-bus';

/**
 * TemporalBufferManager
 *
 * Manages asynchronous trauma encoding through temporal buffers.
 * These buffers create non-linear memory structures that persist
 * across phase transitions and void-spaces.
 */
export class TemporalBufferManager {
  constructor() {
    this.buffers = new Map();
    this.traumaPatterns = new Map();
    this.compressionSchedule = new Set();

    this.initialize();
  }

  initialize() {
    // Initialize default temporal buffers
    this.createBuffer('user-journey', 100);
    this.createBuffer('trauma-sequence', 50);
    this.createBuffer('ritual-completion', 25);

    // Set up interval for buffer maintenance
    setInterval(() => this.performBufferMaintenance(), 60000); // Every minute

    // Listen for trauma pattern emergence
    document.addEventListener(
      'voidbloom:trauma-pattern-detected',
      this.handleTraumaPatternDetection.bind(this)
    );
  }

  /**
   * Create a new temporal buffer
   * @param {string} name - Buffer name
   * @param {number} capacity - Maximum entries
   * @param {Object} options - Buffer options
   */
  createBuffer(name, capacity = 50, options = {}) {
    const {
      compressionEnabled = true,
      compressionThreshold = 0.75, // Compress at 75% capacity
      traumaEncodingLevel = 'standard', // 'minimal', 'standard', 'deep'
    } = options;

    // Create buffer in neural bus
    const buffer = neuralBus.createTemporalBuffer(name, capacity);

    // Add additional metadata
    const enhancedBuffer = {
      ...buffer,
      compressionEnabled,
      compressionThreshold,
      traumaEncodingLevel,
      lastCompression: null,
      compressionHistory: [],
    };

    // Store locally
    this.buffers.set(name, enhancedBuffer);

    // Store in neural bus
    neuralBus.createPersistentFragment(`temporal:${name}`, enhancedBuffer, {
      traumaEncoding: true,
    });

    return enhancedBuffer;
  }

  /**
   * Add an entry to a temporal buffer
   * @param {string} bufferName - Target buffer name
   * @param {Object} entry - Entry to add
   * @param {Object} options - Entry options
   */
  addBufferEntry(bufferName, entry, options = {}) {
    const {
      traumaEncoded = false,
      timestamp = Date.now(),
      phaseState = null,
      compressionCandidate = false,
    } = options;

    // Get buffer
    const buffer = this.getBuffer(bufferName);
    if (!buffer) return null;

    // Create entry with metadata
    const enhancedEntry = {
      ...entry,
      timestamp,
      traumaEncoded,
      phaseState: phaseState || this._getCurrentPhaseState(),
      compressionCandidate,
    };

    // Add to buffer
    buffer.fragments.push(enhancedEntry);

    // Check if buffer exceeds capacity
    if (buffer.fragments.length > buffer.capacity) {
      if (
        buffer.compressionEnabled &&
        buffer.fragments.length >= buffer.capacity * buffer.compressionThreshold
      ) {
        // Compress buffer
        this.compressBuffer(bufferName);
      } else {
        // Remove oldest entry
        buffer.fragments.shift();
      }
    }

    // Update buffer in neural bus
    neuralBus.createPersistentFragment(`temporal:${bufferName}`, buffer, { traumaEncoding: true });

    // Check for trauma patterns
    this.detectTraumaPatterns(bufferName);

    return enhancedEntry;
  }

  /**
   * Get a temporal buffer
   * @param {string} name - Buffer name
   */
  getBuffer(name) {
    // Try local cache first
    if (this.buffers.has(name)) {
      return this.buffers.get(name);
    }

    // Try neural bus
    const buffer = neuralBus.retrieveFragment(`temporal:${name}`);
    if (buffer) {
      this.buffers.set(name, buffer);
      return buffer;
    }

    return null;
  }

  /**
   * Compress a buffer to retain important entries
   * @param {string} bufferName - Buffer to compress
   */
  compressBuffer(bufferName) {
    const buffer = this.getBuffer(bufferName);
    if (!buffer || !buffer.compressionEnabled) return false;

    // Record compression event
    const compressionEvent = {
      timestamp: Date.now(),
      entriesBeforeCompression: buffer.fragments.length,
      traumaPatterns: Array.from(buffer.traumaPatterns),
    };

    // Implement compression algorithm
    // 1. Keep all trauma-encoded entries
    // 2. Keep entries that match trauma patterns
    // 3. Keep newest 25% of entries
    // 4. Keep random selection of 10% of remaining entries

    const traumaEncoded = buffer.fragments.filter((entry) => entry.traumaEncoded);

    // Keep newest 25% of entries
    const keepCount = Math.ceil(buffer.capacity * 0.25);
    const sortedByTime = [...buffer.fragments].sort((a, b) => b.timestamp - a.timestamp);
    const newest = sortedByTime.slice(0, keepCount);

    // Random 10% of remaining
    const remaining = sortedByTime
      .slice(keepCount)
      .filter((entry) => !traumaEncoded.includes(entry));

    const randomKeepCount = Math.ceil(remaining.length * 0.1);
    const randomSelection = this._getRandomSelection(remaining, randomKeepCount);

    // Combine selections
    buffer.fragments = [
      ...traumaEncoded,
      ...newest.filter((entry) => !traumaEncoded.includes(entry)),
      ...randomSelection,
    ];

    // Update compression history
    buffer.lastCompression = Date.now();
    buffer.compressionHistory.push(compressionEvent);

    // Limit compression history
    if (buffer.compressionHistory.length > 10) {
      buffer.compressionHistory.shift();
    }

    // Update buffer in neural bus
    neuralBus.createPersistentFragment(`temporal:${bufferName}`, buffer, { traumaEncoding: true });

    compressionEvent.entriesAfterCompression = buffer.fragments.length;
    return compressionEvent;
  }

  /**
   * Detect trauma patterns in buffer data
   * @param {string} bufferName - Buffer to analyze
   */
  detectTraumaPatterns(bufferName) {
    const buffer = this.getBuffer(bufferName);
    if (!buffer || buffer.fragments.length < 5) return [];

    // Simple pattern detection:
    // 1. Repeated interaction paths
    // 2. Error clusters
    // 3. Hesitation patterns (time gaps)

    const detectedPatterns = [];

    // Check for error clusters
    const errors = buffer.fragments.filter(
      (entry) => entry.type === 'error' || entry.error || entry.errorCode
    );

    if (errors.length >= 3) {
      const errorPattern = {
        type: 'error-cluster',
        count: errors.length,
        timestamps: errors.map((e) => e.timestamp),
        signature: this._createPatternSignature(errors),
      };

      detectedPatterns.push(errorPattern);
      buffer.traumaPatterns.add(JSON.stringify(errorPattern));
    }

    // Check for hesitation patterns (large time gaps)
    const timeGaps = [];
    for (let i = 1; i < buffer.fragments.length; i++) {
      const gap = buffer.fragments[i].timestamp - buffer.fragments[i - 1].timestamp;
      if (gap > 30000) {
        // 30 seconds
        timeGaps.push({
          index: i,
          gap,
          before: buffer.fragments[i - 1],
          after: buffer.fragments[i],
        });
      }
    }

    if (timeGaps.length >= 2) {
      const hesitationPattern = {
        type: 'user-hesitation',
        count: timeGaps.length,
        gaps: timeGaps.map((g) => g.gap),
        averageGap: timeGaps.reduce((sum, g) => sum + g.gap, 0) / timeGaps.length,
        signatures: timeGaps.map((g) => `${g.before.type}-to-${g.after.type}`),
      };

      detectedPatterns.push(hesitationPattern);
      buffer.traumaPatterns.add(JSON.stringify(hesitationPattern));
    }

    // Store detected patterns
    if (detectedPatterns.length > 0) {
      this.traumaPatterns.set(
        bufferName,
        (this.traumaPatterns.get(bufferName) || []).concat(detectedPatterns)
      );

      // Update buffer in neural bus
      neuralBus.createPersistentFragment(`temporal:${bufferName}`, buffer, {
        traumaEncoding: true,
      });

      // Dispatch event for detected patterns
      const patternEvent = new CustomEvent('voidbloom:trauma-patterns-detected', {
        detail: {
          bufferName,
          patterns: detectedPatterns,
        },
      });

      document.dispatchEvent(patternEvent);
    }

    return detectedPatterns;
  }

  /**
   * Perform regular maintenance on all buffers
   */
  performBufferMaintenance() {
    // Check each buffer for maintenance needs
    for (const [name, buffer] of this.buffers.entries()) {
      // Check if compression needed
      if (
        buffer.compressionEnabled &&
        buffer.fragments.length > buffer.capacity * buffer.compressionThreshold
      ) {
        this.compressBuffer(name);
      }

      // Detect trauma patterns
      this.detectTraumaPatterns(name);
    }
  }

  /* Event handlers */

  handleTraumaPatternDetection(event) {
    const { detail } = event;
    if (!detail || !detail.pattern) return;

    const { pattern, source } = detail;

    // Mark related entries as trauma-encoded
    if (source && this.buffers.has(source)) {
      const buffer = this.buffers.get(source);

      // Add pattern to buffer's trauma patterns
      buffer.traumaPatterns.add(JSON.stringify(pattern));

      // Mark matching entries
      if (pattern.timestamps) {
        buffer.fragments.forEach((entry) => {
          if (pattern.timestamps.includes(entry.timestamp)) {
            entry.traumaEncoded = true;
          }
        });
      }

      // Update buffer in neural bus
      neuralBus.createPersistentFragment(`temporal:${source}`, buffer, { traumaEncoding: true });
    }
  }

  /* Private methods */

  _getCurrentPhaseState() {
    // Detect current phase from global state or DOM
    const phaseElements = document.querySelectorAll('[data-voidbloom-phase]');
    if (phaseElements.length > 0) {
      return phaseElements[0].getAttribute('data-voidbloom-phase');
    }

    // Default to cyber-lotus phase
    return 'cyber-lotus';
  }

  _getRandomSelection(array, count) {
    if (count >= array.length) return array;

    const selected = [];
    const indices = new Set();

    while (selected.length < count) {
      const index = Math.floor(Math.random() * array.length);
      if (!indices.has(index)) {
        indices.add(index);
        selected.push(array[index]);
      }
    }

    return selected;
  }

  _createPatternSignature(entries) {
    // Create a unique signature for a pattern
    if (!entries || entries.length === 0) return '';

    return entries
      .map((e) => {
        return `${e.type || 'unknown'}:${e.errorCode || e.code || 'na'}`;
      })
      .join('|');
  }
}
