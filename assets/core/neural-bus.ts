/**
 * Neural Bus
 * Quantum-entangled communication system for trauma-encoded component interaction
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * @Version: 3.1.0
 */

/**
 * Interface for event callback functions
 * @template T The type of data passed to the callback
 */
export interface EventCallback<T = unknown> {
  (data: T, eventObj?: NeuralEvent): void;
}

/**
 * Neural Bus component registration information
 */
export interface ComponentRegistration {
  /** Component's version */
  version: string;
  /** Component capabilities/features map */
  capabilities?: Record<string, boolean>;
  /** Event channels the component listens to */
  channels?: string[];
  /** Whether the component responds to trauma encoding */
  traumaResponse?: boolean;
}

/**
 * Neural event data structure
 */
export interface NeuralEvent {
  /** Unique event ID */
  id: string;
  /** Topic/channel name */
  topic: string;
  /** Event payload data */
  data: any;
  /** Event timestamp */
  timestamp: number;
  /** Event source component */
  source: string;
  /** Current trauma level (0-10) */
  traumaLevel?: number;
  /** Current memory phase */
  memoryPhase?: string;
  /** Event sequence number */
  sequence: number;
}

/**
 * Subscription information
 */
export interface NeuralSubscription {
  /** Subscription ID */
  id: string;
  /** Topic/channel name */
  topic: string;
  /** Callback function */
  callback: EventCallback<any>;
  /** Optional filter function */
  filter?: (data: any, event: NeuralEvent) => boolean;
  /** Priority (higher numbers execute first) */
  priority: number;
}

/**
 * Configuration for the Neural Bus
 */
export interface NeuralBusConfig {
  /** Whether to enable debug logging */
  debug?: boolean;
  /** Whether to enable trauma-responsive encoding */
  traumaResponsive?: boolean;
  /** Maximum number of events to keep in history */
  maxEventHistory?: number;
  /** Whether to enable persistence of state to localStorage */
  persistenceEnabled?: boolean;
  /** Key to use for localStorage */
  persistenceKey?: string;
  /** Whether to automatically connect on initialization */
  autoConnect?: boolean;
  /** Version information */
  version?: string;
}

/**
 * Primary interface for the NeuralBus system
 */
export interface NeuralBusInterface {
  // Core Methods
  /**
   * Initializes the NeuralBus system with configuration
   * @param config Configuration options
   * @returns The NeuralBus instance for method chaining
   */
  initialize(config?: NeuralBusConfig): NeuralBusInterface;

  /**
   * Registers a component with the NeuralBus
   * @param componentName Unique identifier for the component
   * @param metadata Registration information and capabilities
   * @returns An object containing the registration nonce for security
   */
  register(componentName: string, metadata?: ComponentRegistration): { nonce: string };

  /**
   * Unregisters a component from the NeuralBus
   * @param componentName Name of the component to unregister
   * @param nonce Security token from registration
   */
  unregister(componentName: string, nonce: string): boolean;

  /**
   * Subscribes to an event on the NeuralBus
   * @param eventName Name of the event to subscribe to
   * @param callback Function to call when event is published
   * @param options Subscription options
   * @returns Function to unsubscribe from the event
   */
  subscribe(
    eventName: string,
    callback: EventCallback<unknown>,
    options?: { componentId?: string; filter?: any; priority?: number }
  ): string;

  /**
   * Unsubscribes from an event
   * @param subscriptionId ID of the subscription to remove
   */
  unsubscribe(subscriptionId: string): boolean;

  /**
   * Publishes an event to all subscribers
   * @param eventName Name of the event to publish
   * @param data Data to pass to subscribers
   * @param options Publishing options
   */
  publish(eventName: string, data?: unknown, options?: { source?: string }): void;

  /**
   * Gets event history
   * @param limit Maximum number of events to return
   */
  getEventHistory(limit?: number): NeuralEvent[];

  /**
   * Sets the trauma level
   * @param level Trauma level (0-10)
   */
  setTraumaLevel(level: number): void;

  /**
   * Gets the current trauma level
   */
  getTraumaLevel(): number;

  /**
   * Sets the memory phase
   * @param phase Memory phase identifier
   */
  setMemoryPhase(phase: string): void;

  /**
   * Gets the current memory phase
   */
  getMemoryPhase(): string;
}

/**
 * Implementation of the NeuralBus interface
 * Provides communication channels between disparate components
 */
class NeuralBusImplementation implements NeuralBusInterface {
  // Internal state
  private static instance: NeuralBusImplementation;
  private config: NeuralBusConfig;
  private components: Map<string, any> = new Map();
  private subscriptions: Map<string, NeuralSubscription[]> = new Map();
  private events: Record<string, Array<EventCallback<any>>> = {}; // Legacy format
  private eventHistory: NeuralEvent[] = [];
  private eventSequence: number = 0;
  private traumaLevel: number = 0;
  private memoryPhase: string = 'cyber-lotus';
  private initialized: boolean = false;

  /**
   * Private constructor - use getInstance()
   */
  private constructor() {
    this.config = {
      debug: false,
      traumaResponsive: true,
      maxEventHistory: 100,
      persistenceEnabled: true,
      persistenceKey: 'voidbloom_neural_bus_state',
      autoConnect: true,
      version: '3.1.0',
    };
  }

  /**
   * Gets the singleton instance
   */
  public static getInstance(): NeuralBusImplementation {
    if (!NeuralBusImplementation.instance) {
      NeuralBusImplementation.instance = new NeuralBusImplementation();
    }
    return NeuralBusImplementation.instance;
  }

  /**
   * Initializes the NeuralBus system
   * @param config Configuration options
   * @returns The NeuralBus instance for method chaining
   */
  initialize(config: NeuralBusConfig = {}): NeuralBusInterface {
    if (this.initialized) {
      this.log('NeuralBus already initialized', 'warn');
      return this;
    }

    this.config = {
      ...this.config,
      ...config,
    };

    this.loadPersistentState();
    this.initialized = true;
    this.log(`NeuralBus initialized with config:`, 'log');
    this.log(this.config, 'log');

    return this;
  }

  /**
   * Registers a component with the NeuralBus
   * @param componentName Unique identifier for the component
   * @param metadata Registration information and capabilities
   * @returns An object containing the registration nonce
   */
  register(
    componentName: string,
    metadata: ComponentRegistration = { version: '1.0.0' }
  ): { nonce: string } {
    const nonce = this.generateNonce();

    const registration = {
      id: componentName,
      nonce,
      timestamp: Date.now(),
      version: metadata.version,
      capabilities: metadata.capabilities || {},
      channels: metadata.channels || [],
      traumaResponse: metadata.traumaResponse || false,
    };

    this.components.set(componentName, registration);

    // Broadcast component registration
    this.publish(
      'system:component-registered',
      {
        componentId: componentName,
        capabilities: registration.capabilities,
        traumaResponse: registration.traumaResponse,
      },
      { source: 'neural-bus' }
    );

    // Send current trauma level if component is trauma responsive
    if (registration.traumaResponse && this.config.traumaResponsive) {
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

    this.log(`Component registered: ${componentName}`);
    return { nonce };
  }

  /**
   * Unregisters a component from the NeuralBus
   * @param componentName Name of the component to unregister
   * @param nonce Security token from registration
   */
  unregister(componentName: string, nonce: string): boolean {
    const registration = this.components.get(componentName);

    if (!registration || registration.nonce !== nonce) {
      this.log(`Unregister failed: Invalid nonce for ${componentName}`, 'error');
      return false;
    }

    this.components.delete(componentName);

    // Remove all subscriptions from this component
    for (const [topic, subs] of this.subscriptions.entries()) {
      this.subscriptions.set(
        topic,
        subs.filter((sub) => !sub.id.startsWith(`${componentName}:`))
      );
    }

    // Broadcast component unregistration
    this.publish(
      'system:component-unregistered',
      {
        componentId: componentName,
      },
      { source: 'neural-bus' }
    );

    this.log(`Component unregistered: ${componentName}`);
    return true;
  }

  /**
   * Subscribes to an event on the NeuralBus
   * @param eventName Name of the event to subscribe to
   * @param callback Function to call when event is published
   * @param options Subscription options
   * @returns Subscription ID that can be used to unsubscribe
   */
  subscribe(
    eventName: string,
    callback: EventCallback<unknown>,
    options: { componentId?: string; filter?: any; priority?: number } = {}
  ): string {
    // Support for both new and legacy subscription patterns
    const subscriptionId = `${options.componentId || 'anonymous'}:${this.generateId()}`;

    const subscription: NeuralSubscription = {
      id: subscriptionId,
      topic: eventName,
      callback,
      filter: options.filter,
      priority: options.priority || 0,
    };

    // Store in new format
    if (!this.subscriptions.has(eventName)) {
      this.subscriptions.set(eventName, []);
    }

    const topicSubscriptions = this.subscriptions.get(eventName)!;
    topicSubscriptions.push(subscription);

    // Sort by priority (higher first)
    topicSubscriptions.sort((a, b) => b.priority - a.priority);

    // Also store in legacy format for backwards compatibility
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);

    this.log(`Subscription added: ${subscriptionId} to ${eventName}`);

    // Return the subscription ID for later unsubscription
    return subscriptionId;
  }

  /**
   * Unsubscribes from an event
   * @param subscriptionId ID of the subscription to remove
   */
  unsubscribe(subscriptionId: string): boolean {
    for (const [topic, subs] of this.subscriptions.entries()) {
      const index = subs.findIndex((sub) => sub.id === subscriptionId);

      if (index !== -1) {
        const subscription = subs[index];

        // Remove from new format
        subs.splice(index, 1);

        // Try to remove from legacy format
        if (this.events[topic]) {
          const legacyIndex = this.events[topic].indexOf(subscription.callback);
          if (legacyIndex !== -1) {
            this.events[topic].splice(legacyIndex, 1);
          }
        }

        this.log(`Unsubscribed: ${subscriptionId} from ${topic}`);
        return true;
      }
    }

    this.log(`Unsubscribe failed: ID not found ${subscriptionId}`, 'warn');
    return false;
  }

  /**
   * Legacy unsubscribe method (for direct callback reference)
   * @param eventName Event name
   * @param callback Callback to remove
   */
  unsubscribeCallback(eventName: string, callback: EventCallback<unknown>): void {
    if (!this.events[eventName]) return;
    this.events[eventName] = this.events[eventName].filter((cb) => cb !== callback);

    // Also clean up from new format
    if (this.subscriptions.has(eventName)) {
      const subs = this.subscriptions.get(eventName)!;
      const filteredSubs = subs.filter((sub) => sub.callback !== callback);
      this.subscriptions.set(eventName, filteredSubs);
    }
  }

  /**
   * Publishes an event to all subscribers
   * @param eventName Name of the event to publish
   * @param data Data to pass to subscribers
   * @param options Publishing options
   */
  publish(eventName: string, data: unknown = {}, options: { source?: string } = {}): void {
    const event: NeuralEvent = {
      id: this.generateId(),
      topic: eventName,
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

    // Update trauma level or memory phase if appropriate
    if (eventName === 'system:trauma' || eventName === 'system:memory-phase') {
      if (eventName === 'system:trauma' && typeof (data as any).level === 'number') {
        this.traumaLevel = (data as any).level;
      }

      if (eventName === 'system:memory-phase' && (data as any).phase) {
        this.memoryPhase = (data as any).phase;
      }

      this.savePersistentState();
    }

    // Notify subscribers (new format first)
    const directSubscribers = this.subscriptions.get(eventName) || [];
    const wildcardSubscribers = this.subscriptions.get('*') || [];
    const allSubscribers = [...directSubscribers, ...wildcardSubscribers];

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

    // Notify legacy subscribers
    if (this.events[eventName]) {
      this.events[eventName].forEach((callback) => {
        try {
          callback(data, event);
        } catch (error) {
          this.log('Error in legacy subscriber callback', 'error');
          console.error(error);
        }
      });
    }

    this.log(`Event published: ${eventName}`, 'debug');
  }

  /**
   * Gets event history
   * @param limit Maximum number of events to return
   */
  getEventHistory(limit: number = 10): NeuralEvent[] {
    return this.eventHistory.slice(-limit);
  }

  /**
   * Sets the trauma level (0-10)
   * @param level Trauma level
   */
  setTraumaLevel(level: number): void {
    if (!this.config.traumaResponsive) {
      return;
    }

    // Clamp trauma level to 0-10
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
   * Gets the current trauma level
   */
  getTraumaLevel(): number {
    return this.traumaLevel;
  }

  /**
   * Sets the memory phase
   * @param phase Memory phase identifier
   */
  setMemoryPhase(phase: string): void {
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
   * Gets the current memory phase
   */
  getMemoryPhase(): string {
    return this.memoryPhase;
  }

  /**
   * Generate a unique ID
   * @private
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  }

  /**
   * Generate a secure nonce
   * @private
   */
  private generateNonce(): string {
    return Array.from({ length: 4 })
      .map(() => Math.random().toString(36).substring(2, 11))
      .join('-');
  }

  /**
   * Log a message if debug is enabled
   * @param message Message to log
   * @param level Log level
   * @private
   */
  private log(message: string | object, level: 'log' | 'debug' | 'warn' | 'error' = 'log'): void {
    if (!this.config.debug && level === 'debug') {
      return;
    }

    const timestamp = new Date().toISOString();

    if (typeof message === 'object') {
      console[level](`[NeuralBus ${timestamp}]`, message);
      return;
    }

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
   * @private
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
   * @private
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

// Create singleton instance
const singleton = NeuralBusImplementation.getInstance();

// Export interface type
export type NeuralBus = NeuralBusInterface;

// Export singleton instance as default
export default singleton;

// Expose to window for global access (for backward compatibility)
if (typeof window !== 'undefined') {
  window.NeuralBus = singleton as any;

  // Initialize with default configuration if autoConnect is true
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        singleton.initialize({
          traumaResponsive: true,
          debug: false,
          autoConnect: true,
          version: '3.1.0',
        });
      });
    } else {
      singleton.initialize({
        traumaResponsive: true,
        debug: false,
        autoConnect: true,
        version: '3.1.0',
      });
    }
  }
}

// Add type to window for TypeScript compatibility
declare global {
  interface Window {
    NeuralBus: NeuralBusInterface;
  }
}

