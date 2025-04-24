/**
 * Memory Encoder System
 * Handles trauma-encoded memory operations for the cart system
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * @Version: 1.0.0
 */

import { NeuralBus } from './neural-bus';

/**
 * Trauma pattern interface
 */
export interface TraumaPattern {
  id: string;
  name: string;
  visualPattern: string;
  intensity: number;
  decayFactor: number;
  memoryErosion: number;
  timestamp: number;
}

/**
 * Trauma level definitions (1-5)
 */
export enum TraumaLevel {
  MINIMAL = 1,
  LOW = 2,
  MODERATE = 3,
  HIGH = 4,
  SEVERE = 5,
}

/**
 * Product interface
 */
export interface Product {
  id: number | string;
  title?: string;
  handle?: string;
  [key: string]: any;
}

/**
 * Encoded properties added to products
 */
export interface EncodedProperties {
  _trauma_level: number;
  _trauma_timestamp: number;
  _trauma_pattern: string;
  _memory_profile?: string;
  _instability_factor?: number;
  _quantum_signature?: string;
  [key: string]: any;
}

/**
 * Class to handle trauma-encoded memory operations
 */
export class MemoryEncoder {
  #traumaLevels: Map<string, number> = new Map();
  #traumaPatterns: Map<string, TraumaPattern> = new Map();
  #neuralBusConnected: boolean = false;
  #visualizationMode: 'minimal' | 'standard' | 'enhanced' = 'standard';
  #quantumEffectsEnabled: boolean = true;

  /**
   * Initialize the memory encoder
   */
  constructor(
    options: {
      visualizationMode?: 'minimal' | 'standard' | 'enhanced';
      quantumEffectsEnabled?: boolean;
    } = {}
  ) {
    // Initialize with options
    this.#visualizationMode = options.visualizationMode || 'standard';
    this.#quantumEffectsEnabled = options.quantumEffectsEnabled !== false;

    // Register default trauma patterns
    this.#registerDefaultPatterns();

    // Connect to NeuralBus if available
    this.#connectToNeuralBus();
  }

  /**
   * Connect to NeuralBus for event tracking
   */
  #connectToNeuralBus(): void {
    if (typeof NeuralBus === 'undefined') return;

    try {
      NeuralBus.register('memory-encoder', {
        version: '1.0.0',
        capabilities: ['trauma-encoding', 'memory-visualization'],
      });

      this.#neuralBusConnected = true;

      // Subscribe to relevant events
      NeuralBus.subscribe('trauma:level-changed', (data) => {
        if (data.productId && typeof data.level === 'number') {
          this.#traumaLevels.set(data.productId.toString(), data.level);
        }
      });
    } catch (e) {
      console.warn('Failed to connect memory-encoder to NeuralBus:', e);
    }
  }

  /**
   * Register default trauma patterns
   */
  #registerDefaultPatterns(): void {
    const defaultPatterns: TraumaPattern[] = [
      {
        id: 'void-sequence',
        name: 'Void Sequence',
        visualPattern: 'radial-gradient',
        intensity: 0.4,
        decayFactor: 0.02,
        memoryErosion: 0.1,
        timestamp: Date.now(),
      },
      {
        id: 'quantum-drift',
        name: 'Quantum Drift',
        visualPattern: 'linear-displacement',
        intensity: 0.6,
        decayFactor: 0.015,
        memoryErosion: 0.3,
        timestamp: Date.now(),
      },
      {
        id: 'temporal-echo',
        name: 'Temporal Echo',
        visualPattern: 'reverb-pattern',
        intensity: 0.7,
        decayFactor: 0.01,
        memoryErosion: 0.5,
        timestamp: Date.now(),
      },
      {
        id: 'neural-imprint',
        name: 'Neural Imprint',
        visualPattern: 'neural-noise',
        intensity: 0.8,
        decayFactor: 0.005,
        memoryErosion: 0.7,
        timestamp: Date.now(),
      },
      {
        id: 'memory-fracture',
        name: 'Memory Fracture',
        visualPattern: 'fractal-dispersion',
        intensity: 0.9,
        decayFactor: 0.001,
        memoryErosion: 0.9,
        timestamp: Date.now(),
      },
    ];

    // Add patterns to the registry
    defaultPatterns.forEach((pattern) => {
      this.#traumaPatterns.set(pattern.id, pattern);
    });
  }

  /**
   * Get pattern by trauma level
   */
  #getPatternByLevel(level: number): TraumaPattern {
    // Map level (1-5) to pattern index
    const patternId = this.#getPatternIdForLevel(level);
    return this.#traumaPatterns.get(patternId) || this.#traumaPatterns.get('void-sequence');
  }

  /**
   * Get pattern ID for a trauma level
   */
  #getPatternIdForLevel(level: number): string {
    const patterns = [
      'void-sequence',
      'quantum-drift',
      'temporal-echo',
      'neural-imprint',
      'memory-fracture',
    ];

    // Map level to pattern index (1-based)
    const index = Math.min(Math.max(Math.floor(level), 1), 5) - 1;
    return patterns[index];
  }

  /**
   * Generate a quantum signature for the encoded memory
   */
  #generateQuantumSignature(): string {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 24; i++) {
      // Add a dash every 8 characters
      if (i > 0 && i % 8 === 0) {
        result += '-';
      }
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Calculate instability factor based on trauma level
   */
  #calculateInstabilityFactor(level: number): number {
    // Base instability is 0.1 for level 1, increasing to 0.9 for level 5
    const baseInstability = 0.1 + (level - 1) * 0.2;

    // Add some randomness within ±15%
    const randomFactor = 1 + (Math.random() * 0.3 - 0.15);

    return Math.min(0.95, baseInstability * randomFactor);
  }

  /**
   * Encode trauma level into product properties
   * @param product The product to encode
   * @param traumaLevel Trauma level (1-5)
   * @returns Encoded properties object
   */
  public encodeTrauma(product: Product, traumaLevel: number): EncodedProperties {
    if (traumaLevel < 1 || traumaLevel > 5) {
      throw new Error(`Invalid trauma level: ${traumaLevel}. Must be between 1-5.`);
    }

    // Store trauma level for this product
    this.#traumaLevels.set(product.id.toString(), traumaLevel);

    // Get pattern for this trauma level
    const pattern = this.#getPatternByLevel(traumaLevel);

    // Create encoded properties
    const encodedProperties: EncodedProperties = {
      _trauma_level: traumaLevel,
      _trauma_timestamp: Date.now(),
      _trauma_pattern: pattern.id,
      _memory_profile: `memory-type-${Math.floor(Math.random() * 5) + 1}`,
      _instability_factor: this.#calculateInstabilityFactor(traumaLevel),
    };

    // Add quantum signature for higher trauma levels
    if (traumaLevel >= 3 && this.#quantumEffectsEnabled) {
      encodedProperties._quantum_signature = this.#generateQuantumSignature();
    }

    // Publish to NeuralBus if connected
    if (this.#neuralBusConnected) {
      NeuralBus.publish('trauma:encoded', {
        productId: product.id,
        traumaLevel,
        patternId: pattern.id,
        timestamp: encodedProperties._trauma_timestamp,
      });
    }

    return encodedProperties;
  }

  /**
   * Apply visual trauma pattern to cart item element
   * @param element The HTML element to apply trauma effects to
   * @param traumaLevel Trauma level (1-5)
   */
  public applyTraumaPattern(element: HTMLElement, traumaLevel: number): void {
    if (!element) return;

    // Validate trauma level
    if (traumaLevel < 1 || traumaLevel > 5) {
      console.warn(`Invalid trauma level: ${traumaLevel}. Must be between 1-5.`);
      return;
    }

    // Add trauma level data attribute
    element.dataset.traumaLevel = traumaLevel.toString();

    // Add CSS classes for trauma visualization
    element.classList.add('trauma-encoded');
    element.classList.add(`trauma-level-${traumaLevel}`);

    // Get pattern for this trauma level
    const pattern = this.#getPatternByLevel(traumaLevel);

    // Apply visualization based on mode
    switch (this.#visualizationMode) {
      case 'minimal':
        // Basic visual indicators only
        this.#applyMinimalVisualization(element, traumaLevel, pattern);
        break;

      case 'standard':
        // Add standard visual effects
        this.#applyStandardVisualization(element, traumaLevel, pattern);
        break;

      case 'enhanced':
        // Add enhanced visual and interactive effects
        this.#applyEnhancedVisualization(element, traumaLevel, pattern);
        break;
    }

    // Publish visualization event to NeuralBus if connected
    if (this.#neuralBusConnected) {
      NeuralBus.publish('trauma:visualized', {
        traumaLevel,
        patternId: pattern.id,
        visualizationMode: this.#visualizationMode,
        elementId: element.id || null,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Apply minimal trauma visualization
   */
  #applyMinimalVisualization(element: HTMLElement, level: number, pattern: TraumaPattern): void {
    // Set CSS variables for styling
    element.style.setProperty('--trauma-level', level.toString());
    element.style.setProperty('--trauma-intensity', pattern.intensity.toString());

    // Add subtle border for all trauma levels
    element.style.boxShadow = `0 0 ${level * 2}px rgba(255, 0, ${level * 50}, ${0.1 * level})`;
  }

  /**
   * Apply standard trauma visualization
   */
  #applyStandardVisualization(element: HTMLElement, level: number, pattern: TraumaPattern): void {
    // Apply minimal effects first
    this.#applyMinimalVisualization(element, level, pattern);

    // Additional effects for standard visualization
    if (level >= 2) {
      // Add a subtle animation
      element.style.animation = `trauma-pulse ${6 - level}s infinite`;
    }

    if (level >= 3) {
      element.classList.add('trauma-distortion');

      // Add a subtle glitch effect
      const glitchAmount = (level - 2) * 0.3;
      element.style.setProperty('--glitch-amount', glitchAmount.toString());
    }
  }

  /**
   * Apply enhanced trauma visualization with dynamic effects
   */
  #applyEnhancedVisualization(element: HTMLElement, level: number, pattern: TraumaPattern): void {
    // Apply standard effects first
    this.#applyStandardVisualization(element, level, pattern);

    // Additional enhanced effects
    if (level >= 3) {
      // Create and add a pulsing overlay element
      const pulseElement = document.createElement('div');
      pulseElement.className = 'trauma-pulse-overlay';
      pulseElement.style.opacity = `${0.2 * level}`;
      element.appendChild(pulseElement);

      // Set additional trauma properties
      element.style.setProperty('--trauma-erosion', pattern.memoryErosion.toString());
      element.style.setProperty('--trauma-decay', pattern.decayFactor.toString());

      // Add data attributes for JS interactions
      element.dataset.traumaPattern = pattern.id;
      element.dataset.traumaTimestamp = Date.now().toString();
    }

    if (level >= 4) {
      element.classList.add('quantum-unstable');

      // Add animated visual noise
      const noiseElement = document.createElement('div');
      noiseElement.className = 'quantum-noise';
      element.appendChild(noiseElement);

      // Generate glitch effect occasionally
      const glitchInterval = setInterval(() => {
        element.classList.add('glitching');
        setTimeout(() => {
          element.classList.remove('glitching');
        }, 200 + Math.random() * 300);
      }, 5000 + Math.random() * 10000);

      // Store interval ID for cleanup
      element.dataset.glitchIntervalId = glitchInterval.toString();
    }
  }

  /**
   * Clean up trauma visualization effects
   * @param element The HTML element to clean up
   */
  public cleanupTraumaEffects(element: HTMLElement): void {
    if (!element) return;

    // Remove trauma-related classes
    element.classList.remove('trauma-encoded');
    element.classList.remove('trauma-distortion');
    element.classList.remove('quantum-unstable');
    element.classList.remove('glitching');

    for (let i = 1; i <= 5; i++) {
      element.classList.remove(`trauma-level-${i}`);
    }

    // Remove added elements
    const pulseElement = element.querySelector('.trauma-pulse-overlay');
    if (pulseElement) pulseElement.remove();

    const noiseElement = element.querySelector('.quantum-noise');
    if (noiseElement) noiseElement.remove();

    // Clear any intervals
    if (element.dataset.glitchIntervalId) {
      clearInterval(parseInt(element.dataset.glitchIntervalId, 10));
    }

    // Clean up data attributes and styles
    delete element.dataset.traumaLevel;
    delete element.dataset.traumaPattern;
    delete element.dataset.traumaTimestamp;
    delete element.dataset.glitchIntervalId;

    // Reset styles
    element.style.removeProperty('--trauma-level');
    element.style.removeProperty('--trauma-intensity');
    element.style.removeProperty('--glitch-amount');
    element.style.removeProperty('--trauma-erosion');
    element.style.removeProperty('--trauma-decay');
    element.style.animation = '';
    element.style.boxShadow = '';
  }

  /**
   * Get trauma level for a product
   * @param productId Product ID to check
   * @returns Trauma level or 0 if not traumatized
   */
  public getTraumaLevel(productId: string | number): number {
    return this.#traumaLevels.get(productId.toString()) || 0;
  }

  /**
   * Register a custom trauma pattern
   * @param pattern The trauma pattern to register
   */
  public registerPattern(pattern: TraumaPattern): void {
    if (!pattern.id) {
      throw new Error('Trauma pattern must have an ID');
    }

    this.#traumaPatterns.set(pattern.id, {
      ...pattern,
      timestamp: Date.now(),
    });

    // Publish to NeuralBus if connected
    if (this.#neuralBusConnected) {
      NeuralBus.publish('trauma:pattern-registered', {
        patternId: pattern.id,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Set the visualization mode
   * @param mode Visualization mode to use
   */
  public setVisualizationMode(mode: 'minimal' | 'standard' | 'enhanced'): void {
    this.#visualizationMode = mode;

    // Publish to NeuralBus if connected
    if (this.#neuralBusConnected) {
      NeuralBus.publish('trauma:visualization-mode-changed', {
        mode,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Enable or disable quantum effects
   * @param enabled Whether quantum effects should be enabled
   */
  public setQuantumEffectsEnabled(enabled: boolean): void {
    this.#quantumEffectsEnabled = enabled;

    // Publish to NeuralBus if connected
    if (this.#neuralBusConnected) {
      NeuralBus.publish('quantum:effects-toggle', {
        enabled,
        component: 'memory-encoder',
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Get all registered trauma patterns
   * @returns Array of trauma patterns
   */
  public getPatterns(): TraumaPattern[] {
    return Array.from(this.#traumaPatterns.values());
  }
}

// Create and export a singleton instance
export const memoryEncoder = new MemoryEncoder();
export default memoryEncoder;
