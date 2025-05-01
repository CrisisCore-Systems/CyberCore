/**
 * NamingProtocol
 *
 * Establishes a systematic naming convention for the memory weave architecture,
 * with progressive abstraction levels based on recursive depth.
 * Encodes component relationships and creates a coherent linguistic framework.
 *
 * @version 1.0.0
 * @phase linguistic-recursion
 */

interface NamingOptions {
  depth?: number;
  phase?: string;
  intensity?: number;
  isTraumatic?: boolean;
  parentName?: string;
}

interface NameComponents {
  prefix: string;
  root: string;
  suffix: string;
  qualifier?: string;
  phase: string;
}

interface PhaseDefinition {
  name: string;
  adjectives: string[];
  nouns: string[];
  verbs: string[];
}

export class NamingProtocol {
  // Core naming components
  private static readonly PREFIXES = [
    'void',
    'quantum',
    'neural',
    'cyber',
    'echo',
    'spectral',
    'trauma',
    'memory',
    'pulse',
    'flux',
  ];

  private static readonly ROOTS = [
    'bloom',
    'core',
    'node',
    'weave',
    'vessel',
    'fragment',
    'echo',
    'trace',
    'nexus',
    'pattern',
  ];

  private static readonly SUFFIXES = [
    'frame',
    'shard',
    'wave',
    'loop',
    'field',
    'vector',
    'matrix',
    'signal',
    'cluster',
    'void',
  ];

  private static readonly QUALIFIERS = [
    'recursing',
    'fading',
    'pulsing',
    'fragmenting',
    'dissolving',
    'crystallizing',
    'decaying',
    'resonating',
    'diffracting',
    'amplifying',
  ];

  // Phase definitions with associated linguistic elements
  private static readonly PHASES: Record<string, PhaseDefinition> = {
    'cyber-lotus': {
      name: 'cyber-lotus',
      adjectives: ['recursive', 'digital', 'synthetic', 'crystalline', 'harmonic'],
      nouns: ['lotus', 'cascade', 'structure', 'framework', 'harmony'],
      verbs: ['recursing', 'building', 'structuring', 'synthesizing', 'harmonizing'],
    },
    'alien-flora': {
      name: 'alien-flora',
      adjectives: ['organic', 'strange', 'blossoming', 'botanical', 'aberrant'],
      nouns: ['bloom', 'growth', 'tendril', 'spore', 'rhizome'],
      verbs: ['growing', 'blooming', 'spreading', 'mutating', 'pollinating'],
    },
    'rolling-virus': {
      name: 'rolling-virus',
      adjectives: ['viral', 'infectious', 'corrupting', 'glitched', 'mutating'],
      nouns: ['virus', 'infection', 'corruption', 'glitch', 'degeneration'],
      verbs: ['infecting', 'corrupting', 'degrading', 'mutating', 'spreading'],
    },
    'trauma-core': {
      name: 'trauma-core',
      adjectives: ['traumatic', 'wounded', 'fractured', 'painful', 'scarred'],
      nouns: ['wound', 'scar', 'memory', 'fracture', 'pain'],
      verbs: ['fracturing', 'remembering', 'scarring', 'internalizing', 'reliving'],
    },
    'quantum-echo': {
      name: 'quantum-echo',
      adjectives: ['resonant', 'entangled', 'probabilistic', 'uncertain', 'superposed'],
      nouns: ['echo', 'resonance', 'wave', 'superposition', 'entanglement'],
      verbs: ['echoing', 'resonating', 'entangling', 'superposing', 'collapsing'],
    },
    'quantum-corruption': {
      name: 'quantum-corruption',
      adjectives: ['corrupted', 'degraded', 'unstable', 'distorted', 'collapsed'],
      nouns: ['corruption', 'decay', 'instability', 'collapse', 'distortion'],
      verbs: ['corrupting', 'decaying', 'destabilizing', 'collapsing', 'distorting'],
    },
    'linguistic-recursion': {
      name: 'linguistic-recursion',
      adjectives: ['recursive', 'linguistic', 'self-referential', 'abstract', 'semantic'],
      nouns: ['word', 'language', 'syntax', 'recursion', 'semantics'],
      verbs: ['defining', 'naming', 'recursing', 'abstracting', 'signifying'],
    },
  };

  /**
   * Generate a name for a component based on options
   * @param options Naming options
   * @returns Generated name components
   */
  public static generateName(options: NamingOptions = {}): NameComponents {
    const {
      depth = 1,
      phase = 'cyber-lotus',
      intensity = 0.5,
      isTraumatic = false,
      parentName = '',
    } = options;

    // Select phase definition, default to cyber-lotus if not found
    const phaseDefinition = this.PHASES[phase] || this.PHASES['cyber-lotus'];

    // Calculate indexes based on various factors
    const prefixIndex = this.calculateIndex(parentName, depth, intensity, this.PREFIXES.length);
    const rootIndex = this.calculateIndex(parentName, intensity, depth, this.ROOTS.length);
    const suffixIndex = this.calculateIndex(parentName, depth, intensity, this.SUFFIXES.length);

    // Select components
    const prefix = this.PREFIXES[prefixIndex];
    const root = this.ROOTS[rootIndex];
    const suffix = this.SUFFIXES[suffixIndex];

    // Add qualifier for traumatic elements
    const qualifier = isTraumatic
      ? this.QUALIFIERS[Math.floor(intensity * this.QUALIFIERS.length)]
      : undefined;

    return {
      prefix,
      root,
      suffix,
      qualifier,
      phase,
    };
  }

  /**
   * Format name components into a full name
   * @param components Name components to format
   * @param format Format style ('class', 'file', 'display', 'id')
   * @returns Formatted name string
   */
  public static formatName(
    components: NameComponents,
    format: 'class' | 'file' | 'display' | 'id' = 'display'
  ): string {
    const { prefix, root, suffix, qualifier, phase } = components;

    switch (format) {
      case 'class':
        // PascalCase for classes
        return `${this.capitalize(prefix)}${this.capitalize(root)}${this.capitalize(suffix)}`;

      case 'file':
        // kebab-case for files
        return `${prefix}-${root}-${suffix}.ts`;

      case 'id':
        // lowercase with underscores for IDs
        return `${prefix}_${root}_${suffix}`;

      case 'display':
      default:
        // Display format with qualifier if available
        return qualifier
          ? `${prefix}-${root}-${suffix} (${qualifier})`
          : `${prefix}-${root}-${suffix}`;
    }
  }

  /**
   * Generate a complete class/file name based on options
   * @param options Naming options
   * @param format Output format
   * @returns Formatted name string
   */
  public static generateFormattedName(
    options: NamingOptions = {},
    format: 'class' | 'file' | 'display' | 'id' = 'display'
  ): string {
    const components = this.generateName(options);
    return this.formatName(components, format);
  }

  /**
   * Generate a phase-appropriate description
   * @param phase Target phase
   * @param length Description length: 'short', 'medium', 'long'
   * @returns Generated description
   */
  public static generateDescription(
    phase = 'cyber-lotus',
    length: 'short' | 'medium' | 'long' = 'medium'
  ): string {
    const phaseDefinition = this.PHASES[phase] || this.PHASES['cyber-lotus'];
    const { adjectives, nouns, verbs } = phaseDefinition;

    // Pick random elements from each linguistic category
    const adj1 = adjectives[Math.floor(Math.random() * adjectives.length)];
    const adj2 = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun1 = nouns[Math.floor(Math.random() * nouns.length)];
    const noun2 = nouns[Math.floor(Math.random() * nouns.length)];
    const verb = verbs[Math.floor(Math.random() * verbs.length)];

    // Generate descriptions of varying lengths
    switch (length) {
      case 'short':
        return `${this.capitalize(adj1)} ${noun1} ${verb}`;

      case 'long':
        return `${this.capitalize(adj1)} and ${adj2} ${noun1} ${verb} through layers of ${noun2}`;

      case 'medium':
      default:
        return `${this.capitalize(adj1)} ${noun1} ${verb} with ${adj2} ${noun2}`;
    }
  }

  /**
   * Determine appropriate phase for a component
   * @param depth Recursion depth
   * @param traumaType Type of trauma
   * @param traumaIntensity Trauma intensity (0-1)
   * @returns Phase name
   */
  public static determinePhase(depth = 1, traumaType?: string, traumaIntensity = 0.5): string {
    // Map trauma types to appropriate phases
    const traumaPhaseMap: Record<string, string> = {
      recursion: 'cyber-lotus',
      abandonment: 'alien-flora',
      fragmentation: 'rolling-virus',
      dissolution: 'trauma-core',
      surveillance: 'cyber-lotus',
      displacement: 'alien-flora',
    };

    // Deep trauma overrides to trauma-core
    if (traumaType && traumaIntensity > 0.8) {
      return 'trauma-core';
    }

    // Use trauma mapping if available
    if (traumaType && traumaPhaseMap[traumaType]) {
      return traumaPhaseMap[traumaType];
    }

    // Otherwise use depth-based phase selection
    const depthPhases = [
      'cyber-lotus', // Depth 1
      'alien-flora', // Depth 2
      'rolling-virus', // Depth 3
      'trauma-core', // Depth 4
      'quantum-echo', // Depth 5+
    ];

    const phaseIndex = Math.min(depth - 1, depthPhases.length - 1);
    return depthPhases[phaseIndex];
  }

  /**
   * Calculate deterministic index based on seeds
   * @param seeds Array of seed values
   * @param maxValue Maximum index value
   * @returns Calculated index
   */
  private static calculateIndex(...seeds: any[]): number {
    // Create hash code from seeds
    let hash = 0;
    const seedString = seeds.join('');

    for (let i = 0; i < seedString.length; i++) {
      const char = seedString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }

    // Get absolute value and mod by max value
    const absHash = Math.abs(hash);
    const maxValue = seeds.pop() as number;
    return absHash % maxValue;
  }

  /**
   * Capitalize first letter of string
   * @param str String to capitalize
   * @returns Capitalized string
   */
  private static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export default NamingProtocol;
