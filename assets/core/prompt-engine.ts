/**
 * NeuralBus: A component for managing neural interactions and data flow
 */
class NeuralBus {
  private listeners: Record<string, Function[]> = {};

  /**
   * Register a listener for a specific event
   * @param event - The event name
   * @param callback - The callback function
   */
  public on(event: string, callback: Function): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  /**
   * Emit an event to all registered listeners
   * @param event - The event name
   * @param data - The data to pass to the listeners
   */
  public emit(event: string, data: any): void {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(data));
    }
  }

  /**
   * Remove a listener for a specific event
   * @param event - The event name
   * @param callback - The callback function
   */
  public off(event: string, callback: Function): void {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      this.listeners[event] = eventListeners.filter((listener) => listener !== callback);
    }
  }

  /**
   * Clear all listeners for a specific event
   * @param event - The event name
   */
  public clear(event: string): void {
    if (this.listeners[event]) {
      delete this.listeners[event];
    }
  }
}

// Add NeuralBus to window
declare global {
  interface Window {
    NeuralBus?: NeuralBus;
  }
}

// Export default instance
const neuralBusInstance = new NeuralBus();
window.NeuralBus = neuralBusInstance;
export default neuralBusInstance;
