/**
 * TraumaIndex
 * Core taxonomy system for VoidBloom's trauma classification
 * Version: 3.7.1
 */

class TraumaIndex {
  constructor() {
    this.traumaTypes = [
      'abandonment',
      'fragmentation',
      'recursion',
      'surveillance',
      'displacement',
      'dissolution'
    ];
    
    // Initialize relation matrix between trauma types
    this.relationMatrix = {
      'abandonment': {
        'fragmentation': 0.45,
        'recursion': 0.30,
        'surveillance': 0.25,
        'displacement': 0.70,
        'dissolution': 0.85
      },
      'fragmentation': {
        'abandonment': 0.45,
        'recursion': 0.60,
        'surveillance': 0.40,
        'displacement': 0.50,
        'dissolution': 0.75
      },
      'recursion': {
        'abandonment': 0.30,
        'fragmentation': 0.60,
        'surveillance': 0.55,
        'displacement': 0.35,
        'dissolution': 0.40
      },
      'surveillance': {
        'abandonment': 0.25,
        'fragmentation': 0.40,
        'recursion': 0.55,
        'displacement': 0.30,
        'dissolution': 0.20
      },
      'displacement': {
        'abandonment': 0.70,
        'fragmentation': 0.50,
        'recursion': 0.35,
        'surveillance': 0.30,
        'dissolution': 0.65
      },
      'dissolution': {
        'abandonment': 0.85,
        'fragmentation': 0.75,
        'recursion': 0.40,
        'surveillance': 0.20,
        'displacement': 0.65
      }
    };
    
    // Keywords associated with each trauma type for text analysis
    this.traumaKeywords = {
      'abandonment': [
        'absence', 'void', 'emptiness', 'hollow', 'forgotten', 
        'isolation', 'abandoned', 'alone', 'left', 'vanishing'
      ],
      'fragmentation': [
        'broken', 'shattered', 'pieces', 'split', 'fractured', 
        'divided', 'disjointed', 'scattered', 'segmented', 'cracked'
      ],
      'recursion': [
        'loop', 'cycle', 'repeat', 'pattern', 'endless', 
        'recursive', 'iteration', 'mirror', 'reflect', 'nested'
      ],
      'surveillance': [
        'watched', 'seen', 'observed', 'monitored', 'tracked', 
        'camera', 'gaze', 'visibility', 'exposed', 'transparent'
      ],
      'displacement': [
        'shifted', 'moved', 'relocated', 'drifting', 'uprooted', 
        'misplaced', 'transplanted', 'wandering', 'lost', 'unstable'
      ],
      'dissolution': [
        'decay', 'erosion', 'fading', 'dissolving', 'disintegration', 
        'entropy', 'melting', 'corruption', 'degradation', 'unraveling'
      ]
    };
  }
  
  /**
   * Get all trauma types in the taxonomy
   * @returns {string[]} Array of trauma type identifiers
   */
  getAllTypes() {
    return this.traumaTypes;
  }
  
  /**
   * Get relation score between two trauma types
   * @param {string} typeA - First trauma type
   * @param {string} typeB - Second trauma type
   * @returns {number} Relation score (0-1)
   */
  getRelationScore(typeA, typeB) {
    if (typeA === typeB) return 1.0;
    
    if (this.relationMatrix[typeA] && this.relationMatrix[typeA][typeB] !== undefined) {
      return this.relationMatrix[typeA][typeB];
    }
    
    return 0;
  }
  
  /**
   * Get related trauma types sorted by relation strength
   * @param {string} traumaType - Base trauma type
   * @param {number} threshold - Minimum relation score (0-1)
   * @returns {Array<{type: string, score: number}>} Related trauma types with scores
   */
  getRelatedTypes(traumaType, threshold = 0.3) {
    if (!this.relationMatrix[traumaType]) return [];
    
    return Object.entries(this.relationMatrix[traumaType])
      .map(([type, score]) => ({ type, score }))
      .filter(item => item.score >= threshold)
      .sort((a, b) => b.score - a.score);
  }
  
  /**
   * Find references to trauma types in text
   * @param {string} text - Text to analyze
   * @param {string} traumaType - Specific trauma type to check for, or null for all
   * @returns {Object|boolean} Object with found references or boolean if specific type
   */
  findReferenceInText(text, traumaType = null) {
    const lowercaseText = text.toLowerCase();
    
    if (traumaType) {
      // Check for specific trauma type
      if (!this.traumaKeywords[traumaType]) return false;
      
      return this.traumaKeywords[traumaType].some(keyword => 
        lowercaseText.includes(keyword)
      );
    } else {
      // Check for all trauma types
      const references = {};
      
      Object.entries(this.traumaKeywords).forEach(([type, keywords]) => {
        const foundKeywords = keywords.filter(keyword => 
          lowercaseText.includes(keyword)
        );
        
        if (foundKeywords.length > 0) {
          references[type] = {
            count: foundKeywords.length,
            keywords: foundKeywords
          };
        }
      });
      
      return references;
    }
  }
  
  /**
   * Calculate dominant trauma type in text
   * @param {string} text - Text to analyze
   * @returns {Object} Dominant trauma type with score
   */
  calculateDominantTrauma(text) {
    const references = this.findReferenceInText(text);
    let dominant = { type: null, score: 0 };
    
    Object.entries(references).forEach(([type, data]) => {
      const score = data.count / this.traumaKeywords[type].length;
      
      if (score > dominant.score) {
        dominant = { type, score };
      }
    });
    
    return dominant;
  }
  
  /**
   * Generate a JSON representation of the trauma vectors
   * @returns {Object} JSON serializable representation of trauma vectors
   */
  exportVectors() {
    return {
      types: this.traumaTypes,
      relations: this.relationMatrix,
      keywords: this.traumaKeywords,
      version: '3.7.1',
      timestamp: new Date().toISOString()
    };
  }
  
  /**
   * Import trauma vectors from JSON
   * @param {Object} vectorData - JSON representation of trauma vectors
   */
  importVectors(vectorData) {
    if (vectorData.types) this.traumaTypes = vectorData.types;
    if (vectorData.relations) this.relationMatrix = vectorData.relations;
    if (vectorData.keywords) this.traumaKeywords = vectorData.keywords;
  }
}

module.exports = TraumaIndex;