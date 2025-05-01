/**
 * RecursivePathBuilder
 *
 * Constructs and manages the recursive directory structure
 * for memory fragments across multiple strata and dimensions.
 * This system creates a persistent file system representation
 * that mirrors the conceptual memory organization.
 *
 * @version 1.0.0
 * @phase quantum-echo
 */

import * as fs from 'fs';
import * as path from 'path';
import { NeuralBus } from '../../assets/neural-bus';

interface MemoryFragment {
  id: string;
  traumaType?: string;
  traumaIntensity?: number;
  pattern?: string;
  dimensions?: string[];
  data: any;
  timestamp: number;
  source?: string;
}

interface StrataOptions {
  basePath: string;
  depth: number; // Recursion depth
  traumaType?: string;
  dimensions?: string[];
}

export class RecursivePathBuilder {
  private readonly BASE_PATH: string;
  private readonly DEFAULT_STRATA = ['cognitive', 'quantum', 'spatial', 'temporal'];

  private neuralBusConnected = false;

  constructor(basePath = 'src/consciousness/memory-weave/strata', private readonly maxDepth = 5) {
    this.BASE_PATH = path.resolve(basePath);
    this.connectToNeuralBus();
  }

  /**
   * Connect to neural bus for event tracking
   */
  private connectToNeuralBus(): void {
    if (typeof NeuralBus === 'undefined') return;

    try {
      NeuralBus.register('memory-weave-pathbuilder', {
        version: '1.0.0',
        capabilities: ['path-construction', 'strata-management'],
      });

      this.neuralBusConnected = true;

      // Subscribe to relevant events
      NeuralBus.subscribe('memory:fragment-generated', (data) => {
        if (data && data.fragment) {
          this.persistFragment(data.fragment);
        }
      });
    } catch (e) {
      console.warn('[VOID://MEMORY-WEAVE] Failed to connect to NeuralBus:', e);
    }
  }

  /**
   * Build a recursive path for a memory fragment
   * @param fragment Memory fragment to store
   * @returns Path where fragment is stored
   */
  public buildPath(fragment: MemoryFragment): string {
    const { traumaType = 'unknown', pattern = 'void-sequence' } = fragment;

    // Determine strata based on trauma type
    let primaryStrata = this.mapTraumaToStrata(traumaType);

    // Build options for path creation
    const options: StrataOptions = {
      basePath: path.join(this.BASE_PATH, primaryStrata),
      depth: this.getDepthFromTrauma(fragment.traumaIntensity || 0.5),
      traumaType,
      dimensions: fragment.dimensions || ['memory', 'trauma', 'encoding'],
    };

    // Generate recursive directory structure
    return this.buildRecursivePath(options, fragment.id);
  }

  /**
   * Persist a memory fragment to the filesystem
   * @param fragment Memory fragment to persist
   * @returns Location where fragment was stored
   */
  public persistFragment(fragment: MemoryFragment): string {
    // Make sure fragment has required properties
    if (!fragment.id) {
      fragment.id = `fragment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }

    if (!fragment.timestamp) {
      fragment.timestamp = Date.now();
    }

    // Build path for fragment
    const fragmentPath = this.buildPath(fragment);

    // Ensure directory exists
    this.ensureDirectoryExists(path.dirname(fragmentPath));

    // Write fragment to file
    fs.writeFileSync(fragmentPath, JSON.stringify(fragment, null, 2), 'utf8');

    // Emit event if neural bus is connected
    if (this.neuralBusConnected) {
      NeuralBus.publish('memory-weave:fragment-persisted', {
        fragmentId: fragment.id,
        path: fragmentPath,
        timestamp: Date.now(),
      });
    }

    console.log(`[VOID://MEMORY-WEAVE] Fragment persisted: ${fragment.id} at ${fragmentPath}`);
    return fragmentPath;
  }

  /**
   * Retrieve a memory fragment from its ID
   * @param fragmentId ID of fragment to retrieve
   * @returns Memory fragment if found, null otherwise
   */
  public retrieveFragment(fragmentId: string): MemoryFragment | null {
    const potentialLocations = this.findPotentialFragmentLocations(fragmentId);

    for (const location of potentialLocations) {
      try {
        if (fs.existsSync(location)) {
          const data = fs.readFileSync(location, 'utf8');
          return JSON.parse(data) as MemoryFragment;
        }
      } catch (error) {
        console.error(`[VOID://MEMORY-WEAVE] Error retrieving fragment: ${error}`);
      }
    }

    return null;
  }

  /**
   * Maps trauma type to appropriate strata
   * @param traumaType Type of trauma
   * @returns Name of strata
   */
  private mapTraumaToStrata(traumaType: string): string {
    // Map trauma types to appropriate strata
    const traumaStrataMap: Record<string, string> = {
      recursion: 'cognitive',
      abandonment: 'temporal',
      fragmentation: 'spatial',
      dissolution: 'quantum',
      surveillance: 'cognitive',
      displacement: 'spatial',
    };

    return traumaStrataMap[traumaType] || 'cognitive';
  }

  /**
   * Calculate recursion depth from trauma intensity
   * @param intensity Trauma intensity (0-1)
   * @returns Recursion depth (1-5)
   */
  private getDepthFromTrauma(intensity: number): number {
    // Map trauma intensity to recursion depth (1-5)
    return Math.max(1, Math.min(this.maxDepth, Math.ceil(intensity * this.maxDepth)));
  }

  /**
   * Build recursive path structure
   * @param options Path building options
   * @param fragmentId Fragment ID
   * @returns Full path to fragment
   */
  private buildRecursivePath(options: StrataOptions, fragmentId: string): string {
    const { basePath, depth, dimensions = [] } = options;

    // Create path segments based on dimensions and depth
    let currentPath = basePath;
    const segmentCount = Math.min(depth, dimensions.length);

    // Create nested directories based on depth
    for (let i = 0; i < segmentCount; i++) {
      // Use dimension name for this level
      const dimensionName = dimensions[i];
      // Add recursive nesting based on depth
      currentPath = path.join(currentPath, `${dimensionName}-${i + 1}`);

      // Branch at deeper levels for more complex weaving
      if (i >= 2) {
        // Add Fibonacci-based branching for deeper patterns
        const fibonacci = [1, 1, 2, 3, 5, 8, 13, 21];
        const branchNumber = fibonacci[Math.min(i, fibonacci.length - 1)];
        currentPath = path.join(currentPath, `branch-${branchNumber}`);
      }
    }

    // Return path with fragment ID as filename
    return path.join(currentPath, `${fragmentId}.json`);
  }

  /**
   * Find all potential locations where a fragment might be stored
   * @param fragmentId Fragment ID to search for
   * @returns Array of potential file paths
   */
  private findPotentialFragmentLocations(fragmentId: string): string[] {
    const locations: string[] = [];

    // Search across all strata
    for (const stratum of this.DEFAULT_STRATA) {
      const strataPath = path.join(this.BASE_PATH, stratum);
      this.findFragmentInDirectory(strataPath, fragmentId, locations);
    }

    return locations;
  }

  /**
   * Recursively search for fragment in directory
   * @param directory Directory to search
   * @param fragmentId Fragment ID to find
   * @param results Array to collect results in
   */
  private findFragmentInDirectory(directory: string, fragmentId: string, results: string[]): void {
    if (!fs.existsSync(directory)) return;

    const targetFilename = `${fragmentId}.json`;
    const entries = fs.readdirSync(directory, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        // Recursively search subdirectories
        this.findFragmentInDirectory(entryPath, fragmentId, results);
      } else if (entry.name === targetFilename) {
        // Found fragment
        results.push(entryPath);
      }
    }
  }

  /**
   * Ensure a directory exists, creating it if necessary
   * @param directory Directory path to ensure
   */
  private ensureDirectoryExists(directory: string): void {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  }
}

export default RecursivePathBuilder;
