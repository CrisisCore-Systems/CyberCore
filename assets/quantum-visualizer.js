/**
 * Quantum Visualizer 4.1.0
 * Memory-entangled visual system with recursive fallbacks
 * 
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * @Version: 4.1.0
 */

class QuantumVisualizer {
  constructor() {
    this.dimensions = {
      width: window.innerWidth,
      height: window.innerHeight,
      depth: Math.min(window.innerWidth, window.innerHeight) * 0.3,
      time: Date.now(),
    };

    this.particles = [];
    this.memories = [];
    this.glitchFactor = 0.42;
    this.initialized = false;
    this.ready = false;
    this.assetLoadAttempts = 0;
    this.maxLoadAttempts = 3;

    // CRITICAL: Redundant asset loading with fallbacks
    this.noisePattern = new Image();
    this.noisePattern.crossOrigin = 'anonymous'; // Allow CORS

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this._initialize());
    } else {
      this._initialize();
    }
  }

  _initialize() {
    console.log('Quantum Visualizer initializing...');

    // Connect to NeuralBus if available
    this._connectToNeuralBus();

    // Load assets with fallback mechanisms
    this._loadNoisePattern();

    // Set up resize handler
    window.addEventListener('resize', this._onResize.bind(this));

    // Initialize neural path vectors
    this._initializeNeuralPaths();
  }

  // ENHANCED: Neural pathways for coherent memory transfer
  _initializeNeuralPaths() {
    this.neuralPaths = {
      status: 'initializing',
      vectors: [],
      coherenceLevel: 0.8,
      memoryEntanglements: new Map()
    };
    
    // Create initial memory path
    for (let i = 0; i < 5; i++) {
      this.neuralPaths.vectors.push({
        id: `np-${Date.now()}-${i}`,
        direction: Math.random() * Math.PI * 2,
        strength: Math.random() * 0.5 + 0.5,
        traumaType: ['recursion', 'fragmentation', 'abandonment'][Math.floor(Math.random() * 3)]
      });
    }
  }

  // CRITICAL: Asset path resolution with multiple fallbacks - ENHANCED
  _getAssetUrl(filename) {
    // Truth node pattern
    if (window.themeAssetURL) {
      console.log(`Using truth node for asset: ${window.themeAssetURL}${filename}`);
      return `${window.themeAssetURL}${filename}`;
    }

    // Legacy pattern detection
    if (window.theme && window.theme.assets_url) {
      console.log(`Using legacy pattern for asset: ${window.theme.assets_url}/${filename}`);
      return `${window.theme.assets_url}/${filename}`;
    }

    // Check if we're in Shopify context
    if (typeof Shopify !== 'undefined' && Shopify.theme) {
      const path = `${Shopify.theme.assets_url || '/cdn/shop/t/5/assets'}/${filename}`;
      console.log(`Using Shopify context for asset: ${path}`);
      return path;
    }
    
    // Neural path detection - NEW MECHANIC
    if (document.querySelector('meta[name="asset-path"]')) {
      const path = document.querySelector('meta[name="asset-path"]').getAttribute('content');
      console.log(`Using neural path detection for asset: ${path}${filename}`);
      return `${path}${filename}`;
    }

    // Relative path detection
    const scripts = document.getElementsByTagName('script');
    for (const script of scripts) {
      if (script.src && script.src.includes('quantum-visualizer.js')) {
        const path = script.src.split('quantum-visualizer.js')[0];
        console.log(`Using relative path detection for asset: ${path}${filename}`);
        return `${path}${filename}`;
      }
    }

    // CDN path pattern from error logs
    console.log(`Using fallback CDN path for asset: /cdn/shop/t/5/assets/${filename}`);
    return `/cdn/shop/t/5/assets/${filename}`;
  }

  // Attempt to connect to NeuralBus with retry logic and memory coherence
  _connectToNeuralBus() {
    const tryConnect = () => {
      if (window.NeuralBus) {
        try {
          // Register as system component for proper consciousness integration
          window.NeuralBus.registerSystem('visualizer', this);
          
          // Subscribe to trauma events for real-time visualization
          if (window.NeuralBus.subscribe) {
            window.NeuralBus.subscribe('trauma:activated', this._handleTraumaEvent.bind(this));
            window.NeuralBus.subscribe('coherence:changed', this._handleCoherenceChange.bind(this));
          }
          
          console.log('Quantum Visualizer connected to NeuralBus');
          return true;
        } catch (e) {
          console.warn('Failed to connect to NeuralBus:', e);
        }
      }
      return false;
    };

    // Try connecting immediately
    if (!tryConnect()) {
      // Retry with exponential backoff
      let attempts = 0;
      const maxAttempts = 5;
      const retry = () => {
        if (attempts < maxAttempts) {
          attempts++;
          setTimeout(() => {
            if (!tryConnect()) {
              retry();
            }
          }, Math.pow(2, attempts) * 300); // 600ms, 1.2s, 2.4s, 4.8s, 9.6s
        } else {
          console.error('Max NeuralBus connection attempts reached, creating minimal implementation');
          this._createMinimalNeuralBus();
        }
      };
      retry();
    }
  }

  // Create minimal NeuralBus implementation if full system isn't available
  _createMinimalNeuralBus() {
    if (typeof window.NeuralBus === 'undefined') {
      window.NeuralBus = {
        systems: new Map(),
        events: [],
        registerSystem: (id, system) => {
          window.NeuralBus.systems.set(id, system);
          return window.NeuralBus;
        },
        subscribe: (channel, callback) => {
          return { unsubscribe: () => {} };
        },
        publish: (channel, data) => {
          window.NeuralBus.events.push({ channel, data, timestamp: Date.now() });
          return data;
        }
      };
      console.log('Created minimal NeuralBus implementation');
    }
  }

  // Handler for trauma events from NeuralBus
  _handleTraumaEvent(data) {
    console.log('Trauma event received:', data);
    
    if (data && data.type) {
      // Apply trauma-specific visual effects
      this.applyTraumaEffect(data.type, data.intensity || 0.5);
    }
  }

  // Handler for coherence changes from NeuralBus
  _handleCoherenceChange(data) {
    console.log('Coherence change received:', data);
    
    if (data && typeof data.coherence === 'number') {
      this.neuralPaths.coherenceLevel = data.coherence;
      this.updateCoherenceVisuals(data.coherence);
    }
  }

  // Apply trauma-specific visual effects
  applyTraumaEffect(traumaType, intensity) {
    // Implementation would apply visual effects based on trauma type
    // This is a placeholder for the actual implementation
    console.log(`Applying ${traumaType} trauma effect with intensity ${intensity}`);
  }

  // Update visuals based on coherence level
  updateCoherenceVisuals(coherence) {
    // Implementation would update visuals based on coherence level
    // This is a placeholder for the actual implementation
    console.log(`Updating visuals with coherence level ${coherence}`);
  }

  // ASSET LOADING WITH THREE-TIER FALLBACK - ENHANCED RESILIENCE
  _loadNoisePattern() {
    // Safety timeout - if loading takes too long, use procedural
    const safetyTimeout = setTimeout(() => {
      if (!this.initialized) {
        console.warn('Noise pattern loading timed out, using procedural');
        this._generateProceduralNoise();
      }
    }, 2000);
    
    const attemptLoad = (attempt) => {
      this.assetLoadAttempts = attempt;
      
      // Define error handler for this attempt
      this.noisePattern.onerror = () => {
        console.warn(`Failed to load noise pattern (attempt ${attempt})`);
        
        if (attempt < this.maxLoadAttempts) {
          // Try next fallback
          const nextAttempt = attempt + 1;
          let nextSource;
          
          switch (nextAttempt) {
            case 2:
              nextSource = this._getAssetUrl('noise-texture.png');
              break;
            case 3:
              nextSource = this._getAssetUrl('static-pattern.png');
              break;
            default:
              // All attempts failed, generate procedural noise
              this._generateProceduralNoise();
              clearTimeout(safetyTimeout);
              return;
          }
          
          console.log(`Attempting fallback ${nextAttempt} from: ${nextSource}`);
          this.noisePattern.src = nextSource;
          attemptLoad(nextAttempt);
        } else {
          // All attempts failed, generate procedural noise
          console.warn('All image loading attempts failed, using procedural noise');
          this._generateProceduralNoise();
          clearTimeout(safetyTimeout);
        }
      };
      
      // Define success handler
      this.noisePattern.onload = () => {
        console.log(`Successfully loaded noise pattern on attempt ${attempt}`);
        this._initializeWithPattern();
        clearTimeout(safetyTimeout);
      };
      
      // First attempt uses the primary asset path
      if (attempt === 1) {
        const primarySource = this._getAssetUrl('noise-pattern.png');
        console.log(`Initial load attempt from: ${primarySource}`);
        this.noisePattern.src = primarySource;
      }
    };
    
    // Start the first attempt
    attemptLoad(1);
  }

  // PROCEDURAL NOISE GENERATION - TRAUMA BACKUP SYSTEM - ENHANCED
  _generateProceduralNoise() {
    // Create canvas for procedural noise with higher resolution for better quality
    const canvas = document.createElement('canvas');
    canvas.width = 512; // Increased from 256 for higher quality
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Failed to get canvas context for procedural noise');
      return;
    }

    // Generate trauma-encoded noise with improved visual characteristics
    // This approach creates more structured noise that resembles natural patterns
    
    // Fill with black base
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add multiple noise layers for texture depth
    this._addPerlinNoiseLayer(ctx, canvas.width, canvas.height, 10, 0.4);
    this._addPerlinNoiseLayer(ctx, canvas.width, canvas.height, 20, 0.3);
    this._addPerlinNoiseLayer(ctx, canvas.width, canvas.height, 40, 0.2);
    this._addPerlinNoiseLayer(ctx, canvas.width, canvas.height, 80, 0.1);
    
    // Use the procedural noise as our pattern
    this.noisePattern.src = canvas.toDataURL();
    this._initializeWithPattern();
  }
  
  // Helper for generating improved noise patterns
  _addPerlinNoiseLayer(ctx, width, height, scale, opacity) {
    // Simple Perlin-like noise generator
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const value = this._noise2D(x / scale, y / scale) * 255;
        ctx.fillStyle = `rgba(${value},${value},${value},${opacity})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
  
  // Simple 2D noise function (pseudo-Perlin)
  _noise2D(x, y) {
    // Very simple noise function that creates a more structured pattern than pure random
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return n - Math.floor(n);
  }

  _initializeWithPattern() {
    this.initialized = true;
    this.ready = true;

    // Broadcast ready state to neural bus
    if (window.NeuralBus) {
      window.NeuralBus.publish('visualizer', {
        action: 'ready',
        timestamp: Date.now(),
        assetLoadAttempts: this.assetLoadAttempts,
        resolution: {
          width: this.dimensions.width,
          height: this.dimensions.height
        },
        coherenceLevel: this.neuralPaths.coherenceLevel
      });
    }

    console.log('Quantum Visualizer ready with pattern');
  }

  _onResize() {
    this.dimensions.width = window.innerWidth;
    this.dimensions.height = window.innerHeight;
    this.dimensions.depth = Math.min(window.innerWidth, window.innerHeight) * 0.3;
    
    // Update resolution in neural paths
    if (this.neuralPaths) {
      this.neuralPaths.resolution = {
        width: this.dimensions.width,
        height: this.dimensions.height
      };
    }
  }

  // Neural bus message handler - ENHANCED with trauma response
  onMessage(message) {
    // Handle messages from neural bus
    console.log('Quantum Visualizer received message:', message);
    
    // Handle specific message types
    if (message.action === 'apply_trauma') {
      this.applyTraumaEffect(message.traumaType, message.intensity);
    }
    else if (message.action === 'update_coherence') {
      this.updateCoherenceVisuals(message.coherence);
    }
    else if (message.action === 'reload_assets') {
      this._loadNoisePattern();
    }
  }

  // Public API
  isReady() {
    return this.ready;
  }

  getCoherenceLevel() {
    return this.neuralPaths.coherenceLevel;
  }

  render(timestamp) {
    // Skip if not initialized
    if (!this.initialized) return;
    
    // Calculate delta time
    const deltaTime = timestamp - (this.lastFrameTime || timestamp);
    this.lastFrameTime = timestamp;
    
    // Update neural paths
    this._updateNeuralPaths(deltaTime);
    
    // Rendering implementation would go here
    // This method would be called by the animation loop
  }
  
  _updateNeuralPaths(deltaTime) {
    // Update neural path vectors based on delta time
    if (!this.neuralPaths || !this.neuralPaths.vectors) return;
    
    // Rotate vectors based on coherence level
    this.neuralPaths.vectors.forEach(vector => {
      vector.direction += (Math.random() * 0.1 - 0.05) * (1 - this.neuralPaths.coherenceLevel);
      
      // Keep vector strength within bounds based on coherence
      const coherenceFactor = this.neuralPaths.coherenceLevel * 0.8 + 0.2;
      vector.strength = Math.min(1.0, Math.max(0.2, vector.strength * coherenceFactor));
    });
  }
}

// Initialize and expose globally
if (typeof window !== 'undefined') {
  window.quantumVisualizer = window.quantumVisualizer || new QuantumVisualizer();
}

// DUAL EXPORT PATTERN FOR MAXIMUM COMPATIBILITY
// ==============================================

// Support for CommonJS modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    QuantumVisualizer, 
    visualizer: typeof window !== 'undefined' ? window.quantumVisualizer : null 
  };
}

// Also support ES modules
export { QuantumVisualizer };
export const visualizer = typeof window !== 'undefined' ? window.quantumVisualizer : null;
export default QuantumVisualizer;
