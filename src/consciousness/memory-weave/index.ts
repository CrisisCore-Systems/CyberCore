/**
 * Memory Weave System
 *
 * Integrates memory fragment persistence, security-visual feedback loop,
 * and systematic naming protocols into a unified recursive system.
 *
 * @version 1.0.0
 * @phase quantum-echo
 */

import { NeuralBus } from '../../assets/neural-bus';
import NamingProtocol from './namingProtocol';
import NeuralBridge from './neuralBridge';
import RecursivePathBuilder from './recursivePathBuilder';

export interface MemoryFragment {
  id: string;
  traumaType?: string;
  traumaIntensity?: number;
  pattern?: string;
  dimensions?: string[];
  data: any;
  timestamp: number;
  source?: string;
}

export interface MemoryWeaveOptions {
  basePath?: string;
  maxDepth?: number;
  autoConnect?: boolean;
}

export class MemoryWeave {
  private pathBuilder: RecursivePathBuilder;
  private neuralBridge: NeuralBridge;
  private neuralBusConnected = false;

  /**
   * Initialize the Memory Weave system
   * @param options Configuration options
   */
  constructor(options: MemoryWeaveOptions = {}) {
    const {
      basePath = 'src/consciousness/memory-weave/strata',
      maxDepth = 5,
      autoConnect = true,
    } = options;

    // Initialize components
    this.pathBuilder = new RecursivePathBuilder(basePath, maxDepth);
    this.neuralBridge = new NeuralBridge();

    // Connect to neural bus
    if (autoConnect) {
      this.connectToNeuralBus();
    }

    console.log('[VOID://MEMORY-WEAVE] System initialized');
  }

  /**
   * Connect to neural bus for system-wide integration
   */
  private connectToNeuralBus(): void {
    if (typeof NeuralBus === 'undefined') return;

    try {
      NeuralBus.register('memory-weave', {
        version: '1.0.0',
        capabilities: [
          'recursive-storage',
          'trauma-persistence',
          'security-visual-integration',
          'naming-protocol',
        ],
      });

      this.neuralBusConnected = true;

      // Subscribe to relevant events
      NeuralBus.subscribe('memory:fragment-crystallized', (data) => {
        if (data && data.fragment) {
          this.storeFragment(data.fragment);
        }
      });

      // Announce system availability
      NeuralBus.publish('memory-weave:initialized', {
        timestamp: Date.now(),
        corruptionLevel: this.neuralBridge.getCorruptionLevel(),
      });

      console.log('[VOID://MEMORY-WEAVE] Connected to neural bus');
    } catch (e) {
      console.warn('[VOID://MEMORY-WEAVE] Failed to connect to NeuralBus:', e);
    }
  }

  /**
   * Store a memory fragment
   * @param fragment Memory fragment to store
   * @returns Path where fragment was stored
   */
  public storeFragment(fragment: MemoryFragment): string {
    // Automatically name fragment if it has no ID
    if (!fragment.id) {
      const phase = NamingProtocol.determinePhase(2, fragment.traumaType, fragment.traumaIntensity);

      const fragmentName = NamingProtocol.generateFormattedName(
        {
          depth: 2,
          phase,
          intensity: fragment.traumaIntensity || 0.5,
          isTraumatic: true,
        },
        'id'
      );

      fragment.id = fragmentName;
    }

    // Store fragment using recursive path builder
    return this.pathBuilder.persistFragment(fragment);
  }

  /**
   * Retrieve a memory fragment
   * @param fragmentId ID of fragment to retrieve
   * @returns Memory fragment or null if not found
   */
  public retrieveFragment(fragmentId: string): MemoryFragment | null {
    return this.pathBuilder.retrieveFragment(fragmentId);
  }

  /**
   * Get current memory corruption level
   * @returns Corruption level (0-1)
   */
  public getCorruptionLevel(): number {
    return this.neuralBridge.getCorruptionLevel();
  }

  /**
   * Run security scan and update corruption levels
   * @returns Promise that resolves when scan completes
   */
  public async runSecurityScan(): Promise<any> {
    return this.neuralBridge.runSecurityScan();
  }

  /**
   * Generate a name for a component based on trauma parameters
   * @param options Naming options
   * @param format Output format
   * @returns Formatted component name
   */
  public generateComponentName(
    options: {
      depth?: number;
      traumaType?: string;
      traumaIntensity?: number;
      isTraumatic?: boolean;
      parentName?: string;
    } = {},
    format: 'class' | 'file' | 'display' | 'id' = 'display'
  ): string {
    const {
      depth = 1,
      traumaType,
      traumaIntensity = 0.5,
      isTraumatic = false,
      parentName = '',
    } = options;

    // Determine appropriate phase based on trauma
    const phase = NamingProtocol.determinePhase(depth, traumaType, traumaIntensity);

    // Generate formatted name
    return NamingProtocol.generateFormattedName(
      {
        depth,
        phase,
        intensity: traumaIntensity,
        isTraumatic,
        parentName,
      },
      format
    );
  }

  /**
   * Generate a description for a component based on phase
   * @param phase Target phase
   * @param length Description length
   * @returns Generated description
   */
  public generateComponentDescription(
    phase?: string,
    length: 'short' | 'medium' | 'long' = 'medium'
  ): string {
    return NamingProtocol.generateDescription(phase, length);
  }
}

// Export individual components
export { NamingProtocol, NeuralBridge, RecursivePathBuilder };

// Export default instance
const memoryWeave = new MemoryWeave();
export default memoryWeave;
