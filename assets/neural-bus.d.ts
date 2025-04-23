/**
 * TypeScript definition file for Neural Bus
 * Provides type safety for the NeuralBus communication system
 */

export interface NeuralBusInterface {
  /**
   * Initialize the Neural Bus
   * @param options - Configuration options
   */
  initialize(options?: { debug?: boolean }): NeuralBusInterface;

  /**
   * Register a component in the Neural Bus
   * @param id - Unique component identifier
   * @param component - Component instance or configuration
   * @returns Registration info with security nonce
   */
  register(id: string, component: any): { nonce: string };

  /**
   * Deregister a component from the Neural Bus (alias for unregister)
   * @param id - Component identifier
   * @param nonce - Security nonce
   */
  deregister(id: string, nonce: string): void;

  /**
   * Check if a component is registered
   * @param id - Component identifier
   * @returns True if component is registered
   */
  isRegistered(id: string): boolean;

  /**
   * Subscribe to an event
   * @param event - Event name to subscribe to
   * @param callback - Function to call when event is triggered
   * @param options - Subscription options
   * @returns Subscription object with unsubscribe method
   */
  subscribe(
    event: string,
    callback: Function,
    options?: any
  ): { id: string; unsubscribe: () => void };

  /**
   * Unsubscribe from an event
   * @param event - Event name
   * @param id - Subscription identifier
   */
  unsubscribe(event: string, id: string): void;

  /**
   * Publish an event to subscribers
   * @param event - Event name
   * @param data - Event data
   * @param options - Publishing options
   * @returns Number of subscribers notified
   */
  publish(event: string, data: any, options?: any): number;

  /**
   * Apply a quantum mutation to a DOM element
   * @param element - Element to mutate
   * @param mutation - Mutation details
   * @returns Success status
   */
  applyMutation(element: HTMLElement, mutation: any): boolean;

  /**
   * Query the DOM for elements and apply mutations
   * @param selector - CSS selector
   * @param mutation - Mutation details
   * @returns Number of elements mutated
   */
  queryAndMutate(selector: string, mutation: any): number;

  /**
   * Get information about registered components
   * @returns Array of component information
   */
  getRegisteredComponents(): Array<{ id: string; registered: number }>;

  /**
   * Get information about event subscriptions
   * @returns Map of events and subscriber counts
   */
  getSubscriptionInfo(): Record<string, number>;

  /**
   * Check if Neural Bus is in debug mode
   * @returns Debug mode state
   */
  isDebugMode(): boolean;

  /**
   * Set debug mode state
   * @param enabled - Whether debug mode should be enabled
   */
  setDebugMode(enabled: boolean): void;

  /**
   * Get version information
   * @returns Version string
   */
  getVersion(): string;

  /**
   * Check if the bus is securely entangled
   * @returns Entanglement status
   */
  isEntangled(): boolean;
}
