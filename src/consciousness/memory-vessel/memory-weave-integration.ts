/**
 * Memory Weave Integration
 *
 * Connects the Memory Weave architecture to the Customer Vessel system,
 * enabling crystallized memories to persist in the recursive file structure
 * and apply coherent naming conventions to all memory fragments.
 *
 * @version 1.0.0
 * @phase neural-convergence
 */

import { NeuralBus } from '../../assets/neural-bus';
import memoryWeave, { MemoryFragment } from '../memory-weave';

/**
 * Customer Vessel integration type (matches JavaScript class)
 */
interface CustomerVessel {
  addFragment: (fragment: any) => any;
  fragmentMap: Map<string, any>;
  neuralBusNonce?: string;
  decayEngine?: any;
}

export class MemoryWeaveIntegration {
  private vessel: CustomerVessel;
  private neuralBusConnected = false;
  private fragmentForwardingEnabled = false;
  private integrationActive = false;

  /**
   * Initialize integration with Customer Vessel
   * @param customerVessel Customer vessel instance to integrate with
   */
  constructor(customerVessel: CustomerVessel) {
    this.vessel = customerVessel;
    this.connectToNeuralBus();

    // Set up crystallization listener
    this.initializeCrystallizationListener();

    console.log('[VOID://INTEGRATION] Memory Weave integration initialized');
  }

  /**
   * Connect to neural bus
   */
  private connectToNeuralBus(): void {
    if (typeof NeuralBus === 'undefined') return;

    try {
      const registration = NeuralBus.register('memory-weave-integration', {
        version: '1.0.0',
        capabilities: ['fragment-forwarding', 'crystallization-persistence'],
      });

      this.neuralBusConnected = true;

      // Subscribe to corruption events to modify decay rates
      NeuralBus.subscribe('memory-weave:corruption-level', (data) => {
        this.adjustDecayRates(data.level, data.state);
      });

      // Subscribe to vessel fragment events
      NeuralBus.subscribe('memory:fragment-added', (data) => {
        if (data && data.fragment && this.fragmentForwardingEnabled) {
          this.forwardFragmentToWeave(data.fragment);
        }
      });

      console.log('[VOID://INTEGRATION] Connected to neural bus');
    } catch (e) {
      console.warn('[VOID://INTEGRATION] Failed to connect to NeuralBus:', e);
    }
  }

  /**
   * Initialize listener for crystallized fragments
   */
  private initializeCrystallizationListener(): void {
    // Skip if decay engine not available
    if (!this.vessel.decayEngine) {
      console.warn(
        '[VOID://INTEGRATION] No decay engine found, crystallization forwarding disabled'
      );
      return;
    }

    // Set up observer for crystallization
    const originalCrystallize = this.vessel.decayEngine._crystallizeFragment;
    if (typeof originalCrystallize !== 'function') {
      console.warn('[VOID://INTEGRATION] Crystallization method not found');
      return;
    }

    // Override crystallization method to intercept events
    this.vessel.decayEngine._crystallizeFragment = (fragment: any) => {
      // Call original method first
      originalCrystallize.call(this.vessel.decayEngine, fragment);

      // Then forward to memory weave
      this.persistCrystallizedFragment(fragment);
    };

    this.integrationActive = true;
    console.log('[VOID://INTEGRATION] Crystallization listener initialized');
  }

  /**
   * Forward a fragment from customer vessel to memory weave
   * @param vesselFragment Fragment from customer vessel
   */
  private forwardFragmentToWeave(vesselFragment: any): void {
    // Skip if integration not active
    if (!this.integrationActive) return;

    // Convert from vessel fragment format to memory weave format
    const memoryFragment: MemoryFragment = {
      id: vesselFragment.id,
      traumaType: vesselFragment.traumaType || 'unknown',
      traumaIntensity: vesselFragment.intensity || 0.5,
      pattern: vesselFragment.pattern || 'void-sequence',
      data: {
        ...vesselFragment,
        source: 'customer-vessel',
        crystallized: false,
      },
      timestamp: vesselFragment.timestamp || Date.now(),
      source: 'customer-vessel',
    };

    // Store in memory weave
    memoryWeave.storeFragment(memoryFragment);
  }

  /**
   * Persist crystallized fragment to memory weave
   * @param crystallizedFragment Crystallized fragment from decay engine
   */
  private persistCrystallizedFragment(crystallizedFragment: any): void {
    // Skip if integration not active
    if (!this.integrationActive) return;

    // Convert to memory fragment format with crystallization metadata
    const memoryFragment: MemoryFragment = {
      id: crystallizedFragment.id,
      traumaType: crystallizedFragment.traumaType || 'unknown',
      traumaIntensity: crystallizedFragment.intensity || 0.7,
      pattern: crystallizedFragment.pattern || 'neural-imprint',
      dimensions: ['memory', 'crystal', 'encoding'],
      data: {
        ...crystallizedFragment,
        crystallized: true,
        crystallizedAt: Date.now(),
        significance: crystallizedFragment.significance || 0.8,
      },
      timestamp: crystallizedFragment.timestamp || Date.now(),
      source: 'crystallization',
    };

    // Store in memory weave
    const storagePath = memoryWeave.storeFragment(memoryFragment);

    // Publish crystallization event
    if (this.neuralBusConnected) {
      NeuralBus.publish('memory-weave:fragment-crystallized', {
        fragmentId: memoryFragment.id,
        traumaType: memoryFragment.traumaType,
        storagePath,
        timestamp: Date.now(),
      });
    }

    console.log(`[VOID://INTEGRATION] Crystallized fragment persisted: ${memoryFragment.id}`);
  }

  /**
   * Adjust decay rates based on corruption level
   * @param corruptionLevel System corruption level (0-1)
   * @param corruptionState System corruption state (string)
   */
  private adjustDecayRates(corruptionLevel: number, corruptionState: string): void {
    // Skip if decay engine not available
    if (!this.vessel.decayEngine) return;

    const decayEngine = this.vessel.decayEngine;

    // Adjust decay rate based on corruption level
    // Higher corruption = faster decay
    const baseDecayRate = 0.05; // Default decay rate
    const adjustedDecayRate = baseDecayRate * (1 + corruptionLevel * 2);

    // Apply adjusted decay rate
    decayEngine.decayRate = adjustedDecayRate;

    // Adjust crystallization threshold based on corruption state
    if (corruptionState === 'critical') {
      // Lower threshold during critical corruption (emergency crystallization)
      if (decayEngine.config.significanceThreshold > 0.4) {
        decayEngine.config.significanceThreshold = 0.4;
      }
    } else if (corruptionState === 'stable') {
      // Restore default threshold during stable state
      decayEngine.config.significanceThreshold = 0.7;
    }

    console.log(
      `[VOID://INTEGRATION] Adjusted decay rate: ${adjustedDecayRate.toFixed(
        4
      )}, corruption: ${corruptionLevel.toFixed(2)}`
    );
  }

  /**
   * Enable forwarding all vessel fragments to memory weave
   * @param enabled Whether to enable forwarding
   */
  public enableFragmentForwarding(enabled = true): void {
    this.fragmentForwardingEnabled = enabled;
    console.log(`[VOID://INTEGRATION] Fragment forwarding ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Get memory weave integration status
   * @returns Integration status object
   */
  public getIntegrationStatus(): Record<string, any> {
    return {
      active: this.integrationActive,
      neuralBusConnected: this.neuralBusConnected,
      fragmentForwarding: this.fragmentForwardingEnabled,
      corruptionLevel: memoryWeave.getCorruptionLevel(),
      timestamp: Date.now(),
    };
  }

  /**
   * Manually trigger security scan
   * @returns Promise resolving with scan results
   */
  public async runSecurityScan(): Promise<any> {
    const results = await memoryWeave.runSecurityScan();
    return results;
  }
}

export default MemoryWeaveIntegration;
