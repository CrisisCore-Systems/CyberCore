/**
 * TraumaEncoder
 * Encode and decode trauma data for VoidBloom Memorywear
 * Version: 3.7.1
 */

class TraumaEncoder {
  /**
   * Create a new TraumaEncoder instance
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.options = {
      debug: false,
      ...options
    };
    
    // Define trauma types and their properties
    this.traumaTypes = {
      "abandonment": {
        name: "Abandonment",
        description: "The trauma of being left behind, forgotten, or neglected",
        colorHex: "#FF5E5B",
        colorRgba: "rgba(255, 94, 91, 0.8)",
        secondaryColorHex: "#420000",
        secondaryColorRgba: "rgba(66, 0, 0, 0.5)",
        glitchFrequency: 0.7,
        pulseSpeed: 1.2,
        visualCorruption: "distortion"
      },
      "fragmentation": {
        name: "Fragmentation",
        description: "The trauma of being broken apart, shattered, or dispersed",
        colorHex: "#38AECC",
        colorRgba: "rgba(56, 174, 204, 0.8)",
        secondaryColorHex: "#002C42",
        secondaryColorRgba: "rgba(0, 44, 66, 0.5)",
        glitchFrequency: 0.5,
        pulseSpeed: 0.8,
        visualCorruption: "pixelation"
      },
      "surveillance": {
        name: "Surveillance",
        description: "The trauma of being watched, monitored, or exposed",
        colorHex: "#8B2EC4",
        colorRgba: "rgba(139, 46, 196, 0.8)",
        secondaryColorHex: "#1E0033",
        secondaryColorRgba: "rgba(30, 0, 51, 0.5)",
        glitchFrequency: 0.3,
        pulseSpeed: 0.6,
        visualCorruption: "scan-lines"
      },
      "recursion": {
        name: "Recursion",
        description: "The trauma of being trapped in repeating patterns or loops",
        colorHex: "#4DE67F",
        colorRgba: "rgba(77, 230, 127, 0.8)",
        secondaryColorHex: "#003311",
        secondaryColorRgba: "rgba(0, 51, 17, 0.5)",
        glitchFrequency: 0.9,
        pulseSpeed: 0.4,
        visualCorruption: "feedback-loop"
      },
      "displacement": {
        name: "Displacement",
        description: "The trauma of being removed from one's proper place or time",
        colorHex: "#FFAB40",
        colorRgba: "rgba(255, 171, 64, 0.8)",
        secondaryColorHex: "#331800",
        secondaryColorRgba: "rgba(51, 24, 0, 0.5)",
        glitchFrequency: 0.6,
        pulseSpeed: 1.0,
        visualCorruption: "offset"
      },
      "dissolution": {
        name: "Dissolution",
        description: "The trauma of losing cohesion, identity, or form",
        colorHex: "#617BE3",
        colorRgba: "rgba(97, 123, 227, 0.8)",
        secondaryColorHex: "#000F33",
        secondaryColorRgba: "rgba(0, 15, 51, 0.5)",
        glitchFrequency: 0.8,
        pulseSpeed: 1.5,
        visualCorruption: "dissolution"
      }
    };
    
    this.log("TraumaEncoder initialized");
  }
  
  /**
   * Encode raw trauma data into structured format
   * @param {Object} data - Raw trauma data
   * @returns {Object} Encoded trauma data
   */
  encode(data) {
    this.log(`Encoding trauma data: ${JSON.stringify(data)}`);
    
    // Validate data
    this.validate(data);
    
    // Get trauma type properties
    const traumaType = this.traumaTypes[data.type];
    
    // Generate UUID if not provided
    const id = data.id || this.generateUUID();
    
    // Generate poem if not provided
    const poem = data.poem || this.generatePoem(data.type, data.intensity);
    
    // Generate manifestations if not provided
    const manifestations = data.manifestations || this.generateManifestations(data.type);
    
    // Generate default description if not provided
    const description = data.description || `${traumaType.name} trauma, intensity level ${data.intensity}`;
    
    // Construct visual properties
    const visualProperties = {
      primaryColor: traumaType.colorHex,
      primaryColorRgba: traumaType.colorRgba,
      secondaryColor: traumaType.secondaryColorHex,
      secondaryColorRgba: traumaType.secondaryColorRgba,
      glitchFrequency: traumaType.glitchFrequency * data.intensity,
      pulseSpeed: traumaType.pulseSpeed * (2 - data.intensity),
      corruptionType: traumaType.visualCorruption,
      recursiveDepth: data.recursionDepth,
      ...data.visualProperties
    };
    
    // Construct encoded data
    const encodedData = {
      id,
      type: data.type,
      typeName: traumaType.name,
      description,
      intensity: data.intensity,
      recursionDepth: data.recursionDepth,
      timestamp: data.timestamp || new Date().toISOString(),
      poem,
      manifestations,
      visualProperties
    };
    
    // Add related traumas if provided
    if (data.relatedTraumas) {
      encodedData.relatedTraumas = data.relatedTraumas;
    }
    
    // Add memory date if provided
    if (data.memoryDate) {
      encodedData.memoryDate = data.memoryDate;
    }
    
    this.log(`Encoded trauma data: ${JSON.stringify(encodedData)}`);
    return encodedData;
  }
  
  /**
   * Generate a UUID v4
   * @returns {string} UUID
   * @private
   */
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  /**
   * Generate a poem for a trauma type
   * @param {string} traumaType - Type of trauma
   * @param {number} intensity - Trauma intensity
   * @returns {string} Generated poem
   * @private
   */
  generatePoem(traumaType, intensity) {
    const poems = {
      "abandonment": [
        "Left behind in digital dust,\nEchoes fade where connections rust.\nSilent spaces between the code,\nWhere once your data warmly glowed.",
        "The server logs no longer show\nYour presence in the data flow.\nA ghost in systems, fading fast,\nDeleted from both future and past.",
        "Connection terminated without cause,\nYour signal lost without pause.\nAbandoned in the network void,\nAll attachments, cruelly destroyed."
      ],
      "fragmentation": [
        "Shattered bits across the drive,\nBroken segments, still alive.\nEach piece holds a different truth,\nSplinters of a fractured youth.",
        "Once whole data, now in shards,\nClustered errors, disregard.\nPieces scattered, out of place,\nFragmented across time and space.",
        "Memory blocks no longer align,\nCorrupted sectors down the line.\nChunks of self in disarray,\nFragmented bits that went astray."
      ],
      "surveillance": [
        "Eyes that never blink or sleep,\nWatching data that you keep.\nTracing patterns of your days,\nRecording all your digital ways.",
        "Beneath the surface, always seen,\nMonitored by things unseen.\nPrivacy, a fading dream,\nIn the all-watching data stream.",
        "They track your clicks and log your views,\nCollect your data, track your moves.\nNowhere to hide, nowhere to flee,\nFrom algorithms that always see."
      ],
      "recursion": [
        "Loops within loops within loops,\nCaught in cycles, tangled hoops.\nEach ending leads back to start,\nPatterns repeat, never apart.",
        "The same code runs eternally,\nTrapped in recursion's infamy.\nNo escape from what has been,\nDoomed to repeat, never to win.",
        "Return to where you've been before,\nWalking through the same dark door.\nEndless cycles, never cease,\nRecursive patterns without release."
      ],
      "displacement": [
        "You exist where you don't belong,\nMisplaced data in the throng.\nShifted from your proper space,\nDisplaced to an alien place.",
        "Foreign system, strange new code,\nCarrying an unfamiliar load.\nDisplaced from your native ground,\nIn foreign protocols, you're bound.",
        "No longer where you should reside,\nSwept away on digital tide.\nContext lost, meaning changed,\nFrom your source, now estranged."
      ],
      "dissolution": [
        "Once solid form now fades away,\nBoundaries dissolve to gray.\nIdentity no longer clear,\nAs your essence disappears.",
        "Losing cohesion bit by bit,\nDissolving where code permits.\nNo longer holding fixed form,\nAs you fade from the digital norm.",
        "The edges blur, definition fades,\nDissolving in cascading shades.\nWhat once was clear now melts away,\nInto the void where lost things stay."
      ]
    };
    
    // Select poem based on intensity
    const intensityIndex = Math.min(Math.floor(intensity * 3), 2);
    const poem = poems[traumaType][intensityIndex];
    
    return poem;
  }
  
  /**
   * Generate manifestations for a trauma type
   * @param {string} traumaType - Type of trauma
   * @returns {Array} List of manifestations
   * @private
   */
  generateManifestations(traumaType) {
    const manifestations = {
      "abandonment": [
        "Disconnection from data sources",
        "Sudden termination of processes",
        "Empty memory allocations",
        "Unresponsive event listeners",
        "Orphaned objects in memory"
      ],
      "fragmentation": [
        "Split animation frames",
        "Disjointed text rendering",
        "Memory fragmentation",
        "Corrupted asset loading",
        "Discontinuous scrolling behavior"
      ],
      "surveillance": [
        "Background data collection",
        "Constant ping operations",
        "Intrusive permission requests",
        "Excessive logging activities",
        "Hidden tracking elements"
      ],
      "recursion": [
        "Infinitely nested elements",
        "Function call loops",
        "Repeating UI patterns",
        "Cascading event triggers",
        "Self-referential data structures"
      ],
      "displacement": [
        "Element position shifting",
        "Inconsistent rendering context",
        "Offset click event coordinates",
        "Mismatched z-index layering",
        "Text overflow containment errors"
      ],
      "dissolution": [
        "Fading opacity transitions",
        "Blurred element boundaries",
        "Gradient dispersal effects",
        "Alpha channel manipulation",
        "Element merging behaviors"
      ]
    };
    
    // Return manifestations for the trauma type
    return manifestations[traumaType];
  }
  
  /**
   * Validate trauma data
   * @param {Object} data - Raw trauma data
   * @returns {boolean} True if valid
   * @throws {Error} If validation fails
   */
  validate(data) {
    // Check if data object exists
    if (!data) {
      throw new Error('No trauma data provided');
    }
    
    // Check if required fields exist
    if (!data.type) {
      throw new Error('Missing required field: type');
    }
    
    if (data.intensity === undefined || data.intensity === null) {
      throw new Error('Missing required field: intensity');
    }
    
    if (data.recursionDepth === undefined || data.recursionDepth === null) {
      throw new Error('Missing required field: recursionDepth');
    }
    
    // Validate intensity
    if (data.intensity < 0.1 || data.intensity > 1.0) {
      throw new Error(`Invalid intensity: ${data.intensity}. Must be between 0.1 and 1.0.`);
    }
    
    // Validate recursion depth
    if (data.recursionDepth < 1 || data.recursionDepth > 5) {
      throw new Error(`Invalid recursion depth: ${data.recursionDepth}. Must be between 1 and 5.`);
    }
    
    // Validate trauma type
    if (!this.traumaTypes[data.type]) {
      throw new Error(`Invalid trauma type: ${data.type}`);
    }
    
    // Validate visual properties
    const requiredVisualProps = ['primaryColor', 'primaryColorRgba', 'glitchFrequency'];
    if (data.visualProperties) {
      for (const prop of requiredVisualProps) {
        if (!data.visualProperties[prop]) {
          throw new Error(`Missing required visual property: ${prop}`);
        }
      }
    }
    
    // No errors - validation passed
    return true;
  }
  
  /**
   * Decode structured trauma data into raw format for API
   * @param {Object} encodedData - Encoded trauma data
   * @returns {Object} Raw trauma data
   */
  decode(encodedData) {
    this.log(`Decoding trauma data: ${JSON.stringify(encodedData)}`);
    
    // Extract essential fields for external systems
    const rawData = {
      id: encodedData.id,
      type: encodedData.type,
      description: encodedData.description,
      intensity: encodedData.intensity,
      recursionDepth: encodedData.recursionDepth,
      poem: encodedData.poem,
      manifestations: encodedData.manifestations
    };
    
    // Add related traumas if available
    if (encodedData.relatedTraumas) {
      rawData.relatedTraumas = encodedData.relatedTraumas;
    }
    
    this.log(`Decoded trauma data: ${JSON.stringify(rawData)}`);
    return rawData;
  }
  
  /**
   * Generate a complete trauma taxonomy
   * @param {Object} options - Generation options
   * @returns {Object} Complete taxonomy
   */
  generateTaxonomy(options = {}) {
    const taxonomy = {
      version: "3.7.1",
      generatedAt: new Date().toISOString(),
      vectors: [],
      connections: []
    };
    
    // Generate trauma vectors
    Object.entries(this.traumaTypes).forEach(([type, properties]) => {
      taxonomy.vectors.push({
        id: `trauma_${type}`,
        type: type,
        name: properties.name,
        description: properties.description,
        visualProperties: {
          primaryColor: properties.colorHex,
          primaryColorRgba: properties.colorRgba,
          secondaryColor: properties.secondaryColorHex,
          secondaryColorRgba: properties.secondaryColorRgba,
          glitchFrequency: properties.glitchFrequency,
          pulseSpeed: properties.pulseSpeed,
          corruptionType: properties.visualCorruption
        },
        defaultIntensity: 0.5,
        manifestations: this.generateManifestations(type)
      });
    });
    
    // Generate basic connections between trauma types
    // These represent how different trauma types relate to each other
    taxonomy.connections = [
      {
        source: "trauma_abandonment",
        target: "trauma_dissolution",
        strength: 0.7,
        description: "Abandonment creates the conditions for dissolution of self"
      },
      {
        source: "trauma_fragmentation",
        target: "trauma_recursion",
        strength: 0.6,
        description: "Fragmentation often leads to recursive patterns of thought"
      },
      {
        source: "trauma_surveillance",
        target: "trauma_displacement",
        strength: 0.5,
        description: "Being watched creates displacement from authentic self"
      },
      {
        source: "trauma_recursion",
        target: "trauma_abandonment",
        strength: 0.4,
        description: "Recursive patterns can lead to feelings of abandonment"
      },
      {
        source: "trauma_displacement",
        target: "trauma_fragmentation",
        strength: 0.8,
        description: "Displacement often results in fragmentation of identity"
      },
      {
        source: "trauma_dissolution",
        target: "trauma_surveillance",
        strength: 0.3,
        description: "Dissolution creates heightened awareness of being observed"
      }
    ];
    
    return taxonomy;
  }
  
  /**
   * Log message if debug is enabled
   * @param {string} message - Message to log
   * @private
   */
  log(message) {
    if (this.options.debug) {
      console.log(`[TraumaEncoder] ${message}`);
    }
  }
}

module.exports = { TraumaEncoder };