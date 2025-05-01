/**
 * QUANTUM-EFFECTS-EXTENSION.TS
 * Quantum effects extension for the cart system
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * @Version: 2.0.0
 */

import { CartCore } from './cart-core';
import { CartExtension } from './cart-extension-interface';

// Define an extended interface for quantum effects options
interface QuantumEffectsConfig {
  useWorker: boolean;
  intensity: number;
  profiles: string[];
  traumaCodes: string[];
  activeProfile: string;
  debug: boolean;
}

/**
 * QuantumEffectsExtension
 * Adds quantum effects to the cart system
 */
export class QuantumEffectsExtension implements CartExtension {
  name = 'quantum-effects';
  version = '2.0.0';

  private quantumSupported = false;
  private worker: Worker | null = null;
  private neuralBusConnected = false;
  private config: QuantumEffectsConfig = {
    useWorker: true,
    intensity: 0.8,
    profiles: ['CyberLotus', 'ObsidianBloom', 'VoidBloom', 'NeonVortex'],
    traumaCodes: [],
    activeProfile: 'CyberLotus',
    debug: false,
  };

  /**
   * Initialize the quantum effects extension
   * @param cart The cart core instance
   */
  initialize(cart: typeof CartCore): void {
    // Merge configuration with available quantumEffectsOptions
    const cartConfig = cart.config as any;
    const options = cartConfig.quantumEffectsOptions || {};

    this.config = {
      ...this.config,
      ...options,
    };

    this.config.debug = cart.config.debug || this.config.debug;

    // Check for Worker API support
    this.checkWorkerSupport().then((supported) => {
      this.quantumSupported = supported;

      if (this.quantumSupported && this.config.useWorker) {
        this.initializeWorker();
        this.connectToNeuralBus();

        if (this.config.debug) {
          console.log('[QuantumEffectsExtension] Initialized with quantum support');
        }
      } else if (this.config.debug) {
        console.log(
          '[QuantumEffectsExtension] Initialized without quantum support (Web Workers not available)'
        );
      }
    });
  }

  /**
   * Check if the browser supports Web Workers
   * @returns Promise that resolves to true if workers are supported
   */
  private checkWorkerSupport(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      try {
        // Check if the browser supports Workers
        const supported = typeof Worker !== 'undefined';
        resolve(supported);
      } catch (error) {
        console.error('[QuantumEffectsExtension] Error checking Worker support:', error);
        resolve(false);
      }
    });
  }

  /**
   * Initialize quantum effects worker
   */
  private initializeWorker(): void {
    try {
      // Create a new Web Worker
      this.worker = new Worker('/assets/quantum-worker.js');

      // Set up message handling
      this.worker.onmessage = this.handleWorkerMessage.bind(this);
      this.worker.onerror = this.handleWorkerError.bind(this);

      // Initialize worker with config
      this.worker.postMessage({
        type: 'initialize',
        config: this.config,
      });

      if (this.config.debug) {
        console.log('[QuantumEffectsExtension] Quantum worker initialized');
      }
    } catch (error) {
      console.error('[QuantumEffectsExtension] Failed to initialize worker:', error);
      this.worker = null;
    }
  }

  /**
   * Connect to NeuralBus for cart event synchronization
   */
  private connectToNeuralBus(): void {
    try {
      if (typeof window.NeuralBus === 'undefined') {
        if (this.config.debug) {
          console.warn('[QuantumEffectsExtension] NeuralBus not available');
        }
        return;
      }

      // Register with NeuralBus
      window.NeuralBus.register('quantum-effects', { version: this.version });
      this.neuralBusConnected = true;

      // Listen for trauma events
      window.NeuralBus.subscribe('trauma:activated', this.handleTraumaEvent.bind(this));

      if (this.config.debug) {
        console.log('[QuantumEffectsExtension] Connected to NeuralBus');
      }
    } catch (error) {
      console.error('[QuantumEffectsExtension] Failed to connect to NeuralBus:', error);
    }
  }

  /**
   * Handle messages from the quantum worker
   * @param event MessageEvent from the worker
   */
  private handleWorkerMessage(event: MessageEvent): void {
    if (!event.data || !event.data.type) return;

    switch (event.data.type) {
      case 'effect-ready':
        // Worker has prepared an effect, apply it
        this.applyQuantumEffect(event.data.effect);
        break;
      case 'status':
        // Worker status update
        if (this.config.debug) {
          console.log(`[QuantumEffectsExtension] Worker status: ${event.data.status}`);
        }
        break;
      default:
        // Unknown message type
        if (this.config.debug) {
          console.warn('[QuantumEffectsExtension] Unknown worker message:', event.data);
        }
    }
  }

  /**
   * Handle errors from the quantum worker
   * @param event ErrorEvent from the worker
   */
  private handleWorkerError(event: ErrorEvent): void {
    console.error('[QuantumEffectsExtension] Worker error:', event);
    // Clean up failed worker
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }

  /**
   * Handle trauma events from NeuralBus
   * @param data Trauma event data
   */
  private handleTraumaEvent(data: any): void {
    if (!data || !data.type) return;

    // Add the trauma code to our list
    const traumaCode = `${data.type}-${data.intensity || 0.5}`;
    if (!this.config.traumaCodes.includes(traumaCode)) {
      this.config.traumaCodes.push(traumaCode);

      // Limit length of trauma codes
      if (this.config.traumaCodes.length > 10) {
        this.config.traumaCodes.shift(); // Remove oldest code
      }
    }

    // Send to worker to process
    if (this.worker) {
      this.worker.postMessage({
        type: 'process-trauma',
        traumaCode,
        intensity: data.intensity || 0.5,
        traumaType: data.type,
      });
    }
  }

  /**
   * Apply a quantum effect to the UI
   * @param effect Effect data from the worker
   */
  private applyQuantumEffect(effect: any): void {
    // Effect application would go here
    // This would typically involve DOM manipulation based on effect data
    if (this.config.debug) {
      console.log('[QuantumEffectsExtension] Applied effect:', effect);
    }
  }

  /**
   * Handle cart events
   * @param event The event name
   * @param data Event data
   */
  onEvent(event: string, data: any): void {
    if (!this.quantumSupported || !this.worker) return;

    switch (event) {
      case 'itemAdded':
        this.worker.postMessage({
          type: 'cart-event',
          event: 'item-added',
          data,
        });
        break;

      case 'itemRemoved':
        this.worker.postMessage({
          type: 'cart-event',
          event: 'item-removed',
          data,
        });
        break;

      case 'cartOpened':
        this.worker.postMessage({
          type: 'cart-event',
          event: 'cart-opened',
          data,
        });
        break;
    }
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }

    if (this.config.debug) {
      console.log('[QuantumEffectsExtension] Disposed');
    }
  }
}
