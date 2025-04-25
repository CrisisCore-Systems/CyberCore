/**
 * QUANTUM-EFFECTS-EXTENSION.TS
 * Quantum effects for cart UI elements
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * @Version: 3.0.0
 */

import { CartCore } from './cart-core';
import { CartExtension } from './cart-extension-interface';
import { NeuralBus } from './neural-bus';

/**
 * QuantumEffectsExtension
 * Adds quantum visual effects to the cart UI
 */
export class QuantumEffectsExtension implements CartExtension {
  name = 'quantum-effects';
  version = '3.0.0';

  private worker: Worker | null = null;
  private config = {
    useWorker: true,
    profile: 'CyberLotus',
    intensity: 1.0,
    traumaCodes: [],
    debug: false,
  };

  /**
   * Initialize the quantum effects extension
   * @param cart The cart core instance
   */
  initialize(cart: typeof CartCore): void {
    // Merge configuration
    Object.assign(this.config, cart.config.quantumEffectsOptions || {});
    this.config.debug = cart.config.debug || this.config.debug;

    // Initialize worker if enabled
    if (this.config.useWorker) {
      this.initWorker();
    }

    // Apply current profile to the document
    this.applyProfile(this.config.profile);

    // Connect to NeuralBus
    this.connectNeuralBus();

    if (this.config.debug) {
      console.log('[QuantumEffectsExtension] Initialized', this.config);
    }
  }

  /**
   * Handle cart events
   * @param event The event name
   * @param data Event data
   */
  onEvent(event: string, data: any): void {
    switch (event) {
      case 'itemAdded':
        this.triggerEffect('add', data);
        break;

      case 'itemRemoved':
        this.triggerEffect('remove', data);
        break;

      case 'itemUpdated':
        this.triggerEffect('update', data);
        break;
    }
  }

  /**
   * Apply a mutation profile to the cart and UI
   * @param profile Profile name
   */
  applyProfile(profile: string): void {
    if (!profile) return;

    this.config.profile = profile;

    // Apply profile to document
    document.documentElement.classList.remove(
      'profile-cyberlotus',
      'profile-obsidianbloom',
      'profile-voidbloom',
      'profile-neonvortex'
    );
    document.documentElement.classList.add(`profile-${profile.toLowerCase()}`);
    document.documentElement.dataset.profile = profile.toLowerCase();

    // Request mutation profile from worker
    if (this.worker) {
      this.worker.postMessage({
        type: 'process-mutation-profile',
        data: {
          profile: this.config.profile,
          intensity: this.config.intensity,
        },
      });
    }

    // Notify via NeuralBus
    NeuralBus.publish('quantum-effects:profile-changed', {
      profile,
      timestamp: Date.now(),
    });

    if (this.config.debug) {
      console.log(`[QuantumEffectsExtension] Applied profile: ${profile}`);
    }
  }

  /**
   * Set active trauma codes
   * @param traumaCodes Trauma effect codes
   */
  setTraumaCodes(traumaCodes: string[]): void {
    this.config.traumaCodes = traumaCodes || [];

    // Apply trauma classes to document
    document.documentElement.classList.remove(
      'trauma-state-glitch',
      'trauma-state-void',
      'trauma-state-echo',
      'trauma-state-fracture'
    );

    // Add trauma classes based on codes
    this.config.traumaCodes.forEach((code) => {
      const traumaType = code.split('-')[0];
      document.documentElement.classList.add(`trauma-state-${traumaType}`);
      document.documentElement.dataset.trauma = traumaType;
    });

    // Process trauma patterns in worker
    if (this.worker) {
      this.worker.postMessage({
        type: 'process-trauma-patterns',
        data: {
          traumaCodes: this.config.traumaCodes,
          intensity: this.config.intensity,
        },
      });
    }

    // Notify via NeuralBus
    NeuralBus.publish('quantum-effects:trauma-codes-changed', {
      traumaCodes: this.config.traumaCodes,
      timestamp: Date.now(),
    });
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }

    // Remove classes
    document.documentElement.classList.remove(
      'profile-cyberlotus',
      'profile-obsidianbloom',
      'profile-voidbloom',
      'profile-neonvortex',
      'trauma-state-glitch',
      'trauma-state-void',
      'trauma-state-echo',
      'trauma-state-fracture'
    );

    if (this.config.debug) {
      console.log('[QuantumEffectsExtension] Disposed');
    }
  }

  /**
   * Initialize Web Worker
   */
  private initWorker(): void {
    try {
      this.worker = new Worker('/assets/quantum-worker.js');

      this.worker.addEventListener('message', (event) => {
        const { type, result, error } = event.data;

        if (error) {
          console.error('[QuantumEffectsExtension] Worker error:', error);
          return;
        }

        switch (type) {
          case 'quantum-state-result':
            this.applyQuantumState(result);
            break;

          case 'trauma-patterns-result':
            this.applyTraumaPatterns(result);
            break;

          case 'mutation-profile-result':
            this.applyMutationProfile(result);
            break;
        }
      });

      if (this.config.debug) {
        console.log('[QuantumEffectsExtension] Worker initialized');
      }
    } catch (error) {
      console.warn('[QuantumEffectsExtension] Web Worker initialization failed:', error);
      this.config.useWorker = false;
    }
  }

  /**
   * Connect to NeuralBus
   */
  private connectNeuralBus(): void {
    NeuralBus.subscribe('quantum:mutation', (data) => {
      if (data && data.profile) {
        this.applyProfile(data.profile);
      }

      if (data && data.traumaCodes) {
        this.setTraumaCodes(data.traumaCodes);
      }
    });

    // Register with NeuralBus
    NeuralBus.register('quantum-effects', {
      version: '3.0.0',
      capabilities: {
        workers: this.config.useWorker,
        profiles: ['CyberLotus', 'ObsidianBloom', 'VoidBloom', 'NeonVortex'],
      },
    });
  }

  /**
   * Trigger a quantum effect
   */
  private triggerEffect(effectType: string, data: any): void {
    // Add dynamic pulse class to cart elements
    const cartIcon = document.querySelector('#cart-icon-bubble');
    if (cartIcon) {
      cartIcon.classList.add('quantum-pulse');
      setTimeout(() => {
        cartIcon.classList.remove('quantum-pulse');
      }, 1000);
    }

    // Add effect class to body
    document.body.classList.add(`quantum-effect-${effectType}`);
    setTimeout(() => {
      document.body.classList.remove(`quantum-effect-${effectType}`);
    }, 1000);

    // Request quantum state from worker
    if (this.worker) {
      this.worker.postMessage({
        type: 'process-quantum-state',
        data: {
          effectType,
          intensity: this.config.intensity,
          profile: this.config.profile,
        },
      });
    }

    // Publish event to NeuralBus
    NeuralBus.publish('quantum-effects:effect-triggered', {
      type: effectType,
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Apply quantum state from worker
   */
  private applyQuantumState(state: any): void {
    // Apply to CSS variables
    if (state && state.particles) {
      document.documentElement.style.setProperty(
        '--quantum-stability',
        state.stabilityFactor.toFixed(2)
      );
    }

    // Publish to NeuralBus
    NeuralBus.publish('quantum-effects:quantum-state-updated', {
      state,
      timestamp: Date.now(),
    });
  }

  /**
   * Apply trauma patterns from worker
   */
  private applyTraumaPatterns(patterns: any): void {
    // Apply to CSS variables
    if (patterns && patterns.stabilityIndex) {
      document.documentElement.style.setProperty(
        '--trauma-intensity',
        patterns.stabilityIndex.toFixed(2)
      );
    }

    // Publish to NeuralBus
    NeuralBus.publish('quantum-effects:trauma-patterns-updated', {
      patterns,
      timestamp: Date.now(),
    });
  }

  /**
   * Apply mutation profile from worker
   */
  private applyMutationProfile(profile: any): void {
    if (!profile) return;

    // Apply CSS custom properties
    if (profile.colors) {
      Object.entries(profile.colors).forEach(([name, value]) => {
        document.documentElement.style.setProperty(`--color-${name}`, value as string);
      });
    }

    // Apply CSS animations
    if (profile.animations) {
      Object.entries(profile.animations).forEach(([name, value]) => {
        document.documentElement.style.setProperty(`--animation-${name}`, value as string);
      });
    }

    // Publish to NeuralBus
    NeuralBus.publish('quantum-effects:profile-applied', {
      profile,
      timestamp: Date.now(),
    });
  }
}
