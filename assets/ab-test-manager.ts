/**
 * AB Testing System
 * Provides experiment management for cart and checkout flows
 *
 * @MutationCompatible: All Variants
 * @Version: 1.0.0
 */

import { NeuralBus } from './neural-bus.js';

export interface ExperimentVariant {
  id: string;
  name: string;
  weight: number;
  isControl?: boolean;
  config: Record<string, any>;
}

export interface Experiment {
  id: string;
  name: string;
  description?: string;
  variants: ExperimentVariant[];
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate?: number;
  endDate?: number;
}

export interface UserAssignment {
  experimentId: string;
  variantId: string;
  timestamp: number;
}

/**
 * ABTestManager class for experiment management
 */
export class ABTestManager {
  #experiments: Map<string, Experiment> = new Map();
  #userAssignments: Map<string, UserAssignment> = new Map();
  #persistenceKey = 'cybercore-ab-assignments';
  #neuralBusConnected = false;
  #isInitialized = false;
  #config = {
    debug: false,
    trackingEnabled: true,
    storageType: 'localStorage' as 'localStorage' | 'sessionStorage' | 'memory'
  };

  // Singleton implementation
  private static instance: ABTestManager | null = null;

  /**
   * Private constructor - use getInstance
   */
  private constructor(config: Partial<typeof ABTestManager.prototype.#config> = {}) {
    // Apply config
    Object.assign(this.#config, config);

    // Connect to NeuralBus
    this.#connectToNeuralBus();

    // Load persisted assignments
    this.#loadAssignments();

    // Mark as initialized
    this.#isInitialized = true;
  }

  /**
   * Get the ABTestManager instance (singleton pattern)
   */
  public static getInstance(config?: Partial<any>): ABTestManager {
    if (!ABTestManager.instance) {
      ABTestManager.instance = new ABTestManager(config);
    } else if (config) {
      // Update config
      Object.assign(ABTestManager.instance.#config, config);
    }

    return ABTestManager.instance;
  }

  /**
   * Connect to NeuralBus
   */
  #connectToNeuralBus(): void {
    if (typeof NeuralBus === 'undefined') return;

    try {
      NeuralBus.register('ab-test-manager', { version: '1.0.0' });
      this.#neuralBusConnected = true;

      // Subscribe to events
      NeuralBus.subscribe('experiment:register', (experiment: Experiment) => {
        this.registerExperiment(experiment);
      });

      NeuralBus.subscribe('experiment:activate', (id: string) => {
        this.activateExperiment(id);
      });

      NeuralBus.subscribe('experiment:pause', (id: string) => {
        this.pauseExperiment(id);
      });
    } catch (e) {
      console.warn('Failed to connect to NeuralBus:', e);
    }
  }

  /**
   * Load persisted assignments
   */
  #loadAssignments(): void {
    if (this.#config.storageType === 'memory') return;

    try {
      const storage = this.#config.storageType === 'sessionStorage'
        ? sessionStorage
        : localStorage;

      const stored = storage.getItem(this.#persistenceKey);
      if (stored) {
        const assignments = JSON.parse(stored);

        // Convert to Map
        Object.entries(assignments).forEach(([experimentId, assignment]) => {
          this.#userAssignments.set(experimentId, assignment as UserAssignment);
        });
      }
    } catch (e) {
      console.warn('Failed to load AB test assignments:', e);
    }
  }

  /**
   * Save assignments to storage
   */
  #saveAssignments(): void {
    if (this.#config.storageType === 'memory') return;

    try {
      const assignments: Record<string, UserAssignment> = {};
      this.#userAssignments.forEach((assignment, experimentId) => {
        assignments[experimentId] = assignment;
      });

      const storage = this.#config.storageType === 'sessionStorage'
        ? sessionStorage
        : localStorage;

      storage.setItem(this.#persistenceKey, JSON.stringify(assignments));
    } catch (e) {
      console.warn('Failed to save AB test assignments:', e);
    }
  }

  /**
   * Track event for an experiment
   */
  #trackEvent(experimentId: string, variantId: string, eventName: string, data?: any): void {
    if (!this.#config.trackingEnabled) return;

    // Log to console in debug mode
    if (this.#config.debug) {
      console.log(`[ABTest Event] ${experimentId}:${variantId} - ${eventName}`, data);
    }

    // Publish to NeuralBus
    if (this.#neuralBusConnected) {
      NeuralBus.publish('analytics:track', {
        category: 'experiment',
        action: eventName,
        label: `${experimentId}:${variantId}`,
        value: data
      });
    }

    // Could integrate with other analytics providers here
  }

  /**
   * Get variant for user based on experiment ID
   */
  public getVariant(experimentId: string): ExperimentVariant | null {
    const experiment = this.#experiments.get(experimentId);

    // Return null if experiment doesn't exist or isn't active
    if (!experiment || experiment.status !== 'active') {
      return null;
    }

    // Check if user is already assigned to a variant
    const existingAssignment = this.#userAssignments.get(experimentId);
    if (existingAssignment) {
      // Find the assigned variant
      const variant = experiment.variants.find(v => v.id === existingAssignment.variantId);
      return variant || null;
    }

    // If no assignment exists, assign randomly based on weights
    const variant = this.#assignRandomVariant(experiment);
    if (variant) {
      // Store assignment
      const assignment: UserAssignment = {
        experimentId,
        variantId: variant.id,
        timestamp: Date.now()
      };

      this.#userAssignments.set(experimentId, assignment);
      this.#saveAssignments();

      // Track assignment event
      this.#trackEvent(experimentId, variant.id, 'assigned');

      return variant;
    }

    return null;
  }

  /**
   * Assign random variant based on weights
   */
  #assignRandomVariant(experiment: Experiment): ExperimentVariant | null {
    if (!experiment.variants.length) return null;

    // Calculate total weight
    const totalWeight = experiment.variants.reduce((sum, variant) => sum + variant.weight, 0);

    // If totalWeight is 0, use equal distribution
    if (totalWeight === 0) {
      const randomIndex = Math.floor(Math.random() * experiment.variants.length);
      return experiment.variants[randomIndex];
    }

    // Get random point in weight distribution
    const randomPoint = Math.random() * totalWeight;

    // Find the variant at that point
    let cumulativeWeight = 0;
    for (const variant of experiment.variants) {
      cumulativeWeight += variant.weight;
      if (randomPoint <= cumulativeWeight) {
        return variant;
      }
    }

    // Fallback to first variant (shouldn't happen)
    return experiment.variants[0];
  }

  /**
   * Register a new experiment
   */
  public registerExperiment(experiment: Experiment): boolean {
    // Validate experiment
    if (!experiment.id || !experiment.name || !Array.isArray(experiment.variants) || experiment.variants.length === 0) {
      console.error('Invalid experiment configuration:', experiment);
      return false;
    }

    // Add default status if not provided
    if (!experiment.status) {
      experiment.status = 'draft';
    }

    // Add to registry
    this.#experiments.set(experiment.id, experiment);

    // Log debug info
    if (this.#config.debug) {
      console.log(`[ABTestManager] Registered experiment: ${experiment.id}`, experiment);
    }

    // Publish to NeuralBus
    if (this.#neuralBusConnected) {
      NeuralBus.publish('experiment:registered', {
        experimentId: experiment.id,
        status: experiment.status
      });
    }

    return true;
  }

  /**
   * Apply experiment variant to cart config
   */
  public applyToConfig(experimentId: string, baseConfig: Record<string, any>): Record<string, any> {
    const variant = this.getVariant(experimentId);

    if (!variant) {
      return baseConfig;
    }

    // Track application event
    this.#trackEvent(experimentId, variant.id, 'applied');

    // Create a deep copy of the base config
    const newConfig = JSON.parse(JSON.stringify(baseConfig));

    // Apply variant config as an overlay
    return this.#deepMerge(newConfig, variant.config);
  }

  /**
   * Deep merge of objects
   */
  #deepMerge(target: any, source: any): any {
    const output = { ...target };

    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach(key => {
        if (isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = this.#deepMerge(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }

    return output;

    function isObject(item: any): boolean {
      return item && typeof item === 'object' && !Array.isArray(item);
    }
  }

  /**
   * Track an event for the user's assigned variant
   */
  public trackEvent(experimentId: string, eventName: string, data?: any): void {
    const assignment = this.#userAssignments.get(experimentId);

    if (assignment) {
      this.#trackEvent(experimentId, assignment.variantId, eventName, data);
    }
  }

  /**
   * Activate an experiment
   */
  public activateExperiment(experimentId: string): boolean {
    const experiment = this.#experiments.get(experimentId);

    if (!experiment) {
      return false;
    }

    experiment.status = 'active';
    experiment.startDate = Date.now();

    // Publish to NeuralBus
    if (this.#neuralBusConnected) {
      NeuralBus.publish('experiment:activated', {
        experimentId
      });
    }

    return true;
  }

  /**
   * Pause an experiment
   */
  public pauseExperiment(experimentId: string): boolean {
    const experiment = this.#experiments.get(experimentId);

    if (!experiment) {
      return false;
    }

    experiment.status = 'paused';

    // Publish to NeuralBus
    if (this.#neuralBusConnected) {
      NeuralBus.publish('experiment:paused', {
        experimentId
      });
    }

    return true;
  }

  /**
   * Complete an experiment
   */
  public completeExperiment(experimentId: string, winningVariantId?: string): boolean {
    const experiment = this.#experiments.get(experimentId);

    if (!experiment) {
      return false;
    }

    experiment.status = 'completed';
    experiment.endDate = Date.now();

    // Publish to NeuralBus
    if (this.#neuralBusConnected) {
      NeuralBus.publish('experiment:completed', {
        experimentId,
        winningVariantId
      });
    }

    return true;
  }

  /**
   * Get all experiments
   */
  public getExperiments(): Experiment[] {
    return Array.from(this.#experiments.values());
  }

  /**
   * Get a specific experiment
   */
  public getExperiment(experimentId: string): Experiment | null {
    return this.#experiments.get(experimentId) || null;
  }

  /**
   * Get user's experiment assignments
   */
  public getUserAssignments(): Record<string, string> {
    const assignments: Record<string, string> = {};

    this.#userAssignments.forEach((assignment, experimentId) => {
      assignments[experimentId] = assignment.variantId;
    });

    return assignments;
  }
}

// Export singleton instance
export default ABTestManager.getInstance();
