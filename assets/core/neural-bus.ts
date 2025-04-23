/**
 * VoidBloom Neural Bus
 * Trauma-encoded event bus for cross-component communication
 */

export interface NeuralRegistration {
  id: string;
  nonce: string;
  timestamp: number;
  capabilities: Record<string, boolean>;
}

export interface NeuralEvent {
  id: string;
  topic: string;
  data: any;
  timestamp: number;
  source: string;
  traumaLevel?: number;
  memoryPhase?: string;
  sequence: number;
}

export interface NeuralSubscription {
  id: string;
  topic: string;
  callback: (data: any, event: NeuralEvent) => void;
  filter?: (data: any, event: NeuralEvent) => boolean;
  priority: number;
}

export interface NeuralBusConfig {
  debug?: boolean;
  traumaResponsive?: boolean;
  maxEventHistory?: number;
  persistenceEnabled?: boolean;
  persistenceKey?: string;
}

export class NeuralBus {
  private static instance: NeuralBus;
  private config: NeuralBusConfig;
  private components: Map<string, NeuralRegistration> = new Map();
  private subscriptions: Map<string, NeuralSubscription[]> = new Map();
  private eventHistory: NeuralEvent[] = [];
  private eventSequence: number = 0;
  private traumaLevel: number = 0;
  private memoryPhase: string = 'cyber-lotus';

  private constructor(config: NeuralBusConfig = {}) {
    this.config = {
      debug: false,
      traumaResponsive: true,
      maxEventHistory: 100,
      persistenceEnabled: true,
      persistenceKey: 'voidbloom_neural_bus_state',
      ...config,
    };

    this.loadPersistentState();
    this.log('Neural Bus initialized');
  }

  /**
   * Get the Neural Bus instance (singleton)
   */
  public static getInstance(config?: NeuralBusConfig): NeuralBus {
    if (!NeuralBus.instance) {
      NeuralBus.instance = new NeuralBus(config);
    }
    return NeuralBus.instance;
  }

  /**
   * Register a component with the Neural Bus
   * @param componentId Component identifier
   * @param metadata Component metadata
   */
  public register(componentId: string, metadata: any = {}): NeuralRegistration {
    const nonce = this.generateNonce();
    const registration: NeuralRegistration = {
      id: componentId,
      nonce,
      timestamp: Date.now(),
      capabilities: metadata.capabilities || {},
    };

    this.components.set(componentId, registration);

    // Broadcast component registration
    this.publish(
      'system:component-registered',
      {
        componentId,
        capabilities: registration.capabilities,
        traumaResponse: metadata.traumaResponse || false,
      },
      { source: 'neural-bus' }
    );

    // Send current trauma level if component is trauma responsive
    if (metadata.traumaResponse && this.config.traumaResponsive) {
      setTimeout(() => {
        this.publish(
          'system:trauma',
          {
            level: this.traumaLevel,
          },
          { source: 'neural-bus' }
        );
      }, 0);

      setTimeout(() => {
        this.publish(
          'system:memory-phase',
          {
            phase: this.memoryPhase,
          },
          { source: 'neural-bus' }
        );
      }, 0);
    }

    this.log(`Component registered: ${componentId}`);
    return registration;
  }

  /**
   * Unregister a component from the Neural Bus
   * @param componentId Component identifier
   * @param nonce Security nonce
   */
  public unregister(componentId: string, nonce: string): boolean {
    const registration = this.components.get(componentId);

    if (!registration || registration.nonce !== nonce) {
      this.log(`Unregister failed: Invalid nonce for ${componentId}`, 'error');
      return false;
    }

    this.components.delete(componentId);

    // Remove all subscriptions from this component
    for (const [topic, subs] of this.subscriptions.entries()) {
      this.subscriptions.set(
        topic,
        subs.filter((sub) => !sub.id.startsWith(`${componentId}:`))
      );
    }

    // Broadcast component unregistration
    this.publish(
      'system:component-unregistered',
      {
        componentId,
      },
      { source: 'neural-bus' }
    );

    this.log(`Component unregistered: ${componentId}`);
    return true;
  }

  /**
   * Subscribe to a topic
   * @param topic Topic to subscribe to
   * @param callback Callback function
   * @param options Subscription options
   */
  public subscribe(
    topic: string,
    callback: (data: any, event?: NeuralEvent) => void,
    options: any = {}
  ): string {
    const subscriptionId = `${options.componentId || 'anonymous'}:${this.generateId()}`;

    const subscription: NeuralSubscription = {
      id: subscriptionId,
      topic,
      callback,
      filter: options.filter,
      priority: options.priority || 0,
    };

    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, []);
    }

    const topicSubscriptions = this.subscriptions.get(topic)!;
    topicSubscriptions.push(subscription);

    // Sort by priority (higher first)
    topicSubscriptions.sort((a, b) => b.priority - a.priority);

    this.log(`Subscription added: ${subscriptionId} to ${topic}`);
    return subscriptionId;
  }

  /**
   * Unsubscribe from a topic
   * @param subscriptionId Subscription ID
   */
  public unsubscribe(subscriptionId: string): boolean {
    for (const [topic, subs] of this.subscriptions.entries()) {
      const index = subs.findIndex((sub) => sub.id === subscriptionId);

      if (index !== -1) {
        subs.splice(index, 1);
        this.log(`Unsubscribed: ${subscriptionId} from ${topic}`);
        return true;
      }
    }

    this.log(`Unsubscribe failed: ID not found ${subscriptionId}`, 'warn');
    return false;
  }

  /**
   * Publish an event to a topic
   * @param topic Topic to publish to
   * @param data Event data
   * @param options Publishing options
   */
  public publish(topic: string, data: any, options: any = {}): void {
    const event: NeuralEvent = {
      id: this.generateId(),
      topic,
      data,
      timestamp: Date.now(),
      source: options.source || 'unknown',
      traumaLevel: this.config.traumaResponsive ? this.traumaLevel : undefined,
      memoryPhase: this.config.traumaResponsive ? this.memoryPhase : undefined,
      sequence: this.eventSequence++,
    };

    // Add to history
    this.eventHistory.push(event);
    if (this.eventHistory.length > (this.config.maxEventHistory || 100)) {
      this.eventHistory.shift();
    }

    // Save state if trauma level or memory phase changes
    if (topic === 'system:trauma' || topic === 'system:memory-phase') {
      if (topic === 'system:trauma' && typeof data.level === 'number') {
        this.traumaLevel = data.level;
      }

      if (topic === 'system:memory-phase' && data.phase) {
        this.memoryPhase = data.phase;
      }

      this.savePersistentState();
    }

    // Find subscribers
    const directSubscribers = this.subscriptions.get(topic) || [];
    const wildcardSubscribers = this.subscriptions.get('*') || [];
    const allSubscribers = [...directSubscribers, ...wildcardSubscribers];

    // Notify subscribers
    for (const subscription of allSubscribers) {
      try {
        // Apply filter if provided
        if (subscription.filter && !subscription.filter(data, event)) {
          continue;
        }

        // Execute callback
        subscription.callback(data, event);
      } catch (error) {
        this.log(`Error in subscriber callback: ${subscription.id}`, 'error');
        console.error(error);
      }
    }

    this.log(`Event published: ${topic}`, 'debug');
  }

  /**
   * Get the event history
   * @param limit Maximum number of events to return
   */
  public getEventHistory(limit: number = 10): NeuralEvent[] {
    return this.eventHistory.slice(-limit);
  }

  /**
   * Set the trauma level
   * @param level New trauma level (0-10)
   */
  public setTraumaLevel(level: number): void {
    if (!this.config.traumaResponsive) {
      return;
    }

    // Clamp trauma level
    const newLevel = Math.max(0, Math.min(10, level));
    if (newLevel !== this.traumaLevel) {
      this.traumaLevel = newLevel;

      // Broadcast trauma level change
      this.publish(
        'system:trauma',
        {
          level: this.traumaLevel,
        },
        { source: 'neural-bus' }
      );

      this.savePersistentState();
    }
  }

  /**
   * Set the memory phase
   * @param phase New memory phase
   */
  public setMemoryPhase(phase: string): void {
    if (!this.config.traumaResponsive) {
      return;
    }

    const validPhases = ['cyber-lotus', 'alien-flora', 'rolling-virus', 'trauma-core'];
    if (validPhases.includes(phase) && phase !== this.memoryPhase) {
      this.memoryPhase = phase;

      // Broadcast memory phase change
      this.publish(
        'system:memory-phase',
        {
          phase: this.memoryPhase,
        },
        { source: 'neural-bus' }
      );

      this.savePersistentState();
    }
  }

  /**
   * Get the current trauma level
   */
  public getTraumaLevel(): number {
    return this.traumaLevel;
  }

  /**
   * Get the current memory phase
   */
  public getMemoryPhase(): string {
    return this.memoryPhase;
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  }

  /**
   * Generate a security nonce
   */
  private generateNonce(): string {
    return Array.from({ length: 4 })
      .map(() => Math.random().toString(36).substring(2, 11))
      .join('-');
  }

  /**
   * Log a message
   * @param message Message to log
   * @param level Log level
   */
  private log(message: string, level: 'log' | 'debug' | 'warn' | 'error' = 'log'): void {
    if (!this.config.debug && level === 'debug') {
      return;
    }

    const timestamp = new Date().toISOString();
    const logMessage = `[NeuralBus ${timestamp}] ${message}`;

    switch (level) {
      case 'debug':
        console.debug(logMessage);
        break;
      case 'warn':
        console.warn(logMessage);
        break;
      case 'error':
        console.error(logMessage);
        break;
      default:
        console.log(logMessage);
    }
  }

  /**
   * Save the current state to localStorage
   */
  private savePersistentState(): void {
    if (!this.config.persistenceEnabled || typeof localStorage === 'undefined') {
      return;
    }

    try {
      const state = {
        traumaLevel: this.traumaLevel,
        memoryPhase: this.memoryPhase,
        timestamp: Date.now(),
      };

      localStorage.setItem(
        this.config.persistenceKey || 'voidbloom_neural_bus_state',
        JSON.stringify(state)
      );

      this.log('State persisted to localStorage', 'debug');
    } catch (error) {
      this.log('Failed to persist state', 'error');
      console.error(error);
    }
  }

  /**
   * Load state from localStorage
   */
  private loadPersistentState(): void {
    if (!this.config.persistenceEnabled || typeof localStorage === 'undefined') {
      return;
    }

    try {
      const storedState = localStorage.getItem(
        this.config.persistenceKey || 'voidbloom_neural_bus_state'
      );

      if (storedState) {
        const state = JSON.parse(storedState);

        if (typeof state.traumaLevel === 'number') {
          this.traumaLevel = state.traumaLevel;
        }

        if (state.memoryPhase) {
          this.memoryPhase = state.memoryPhase;
        }

        this.log('State loaded from localStorage', 'debug');
      }
    } catch (error) {
      this.log('Failed to load persisted state', 'error');
      console.error(error);
    }
  }
}

// Expose to window
if (typeof window !== 'undefined') {
  window.NeuralBus = NeuralBus.getInstance();
}

// Add type to window
declare global {
  interface Window {
    NeuralBus: NeuralBus;
  }
}

// Export singleton instance
export default NeuralBus.getInstance();

