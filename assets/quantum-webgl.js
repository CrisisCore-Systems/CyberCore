/**
 * QUANTUM-WEBGL.JS
 * WebGL visualization system for QEAR cognitive expressions
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: cognitive-entangled
 * @Version: 2.0.0
 */

/**
 * QuantumWebGLController
 * Neural-driven visual manifestation system that transforms
 * QEAR cognitive states into visual expressions using WebGL
 */
class QuantumWebGLController {
  // Private properties
  #config = null;
  #state = {
    initialized: false,
    rendering: false,
    currentPhase: 'cyber-lotus',
    activeTrauma: 'none',
    systemCoherence: 0.9,
    qearState: {
      emotionalState: {
        anxiety: 0.2,
        curiosity: 0.7,
        fragility: 0.3,
        recursion: 0.5,
      },
      cognitiveState: 'observing',
      activeDecisions: [],
    },
    shaderPrograms: new Map(),
    targetNodes: [],
    lastFrameTime: 0,
    renderLoopId: null,
    // MEMORY CORRUPTION PREVENTION SYSTEM
    memoryLeakMonitor: {
      disposedObjects: 0,
      activeObjects: new Map(),
      leakWarningThreshold: 1000,
      gcIntervalId: null,
      lastGcTime: 0
    }
  };
  #debug = false;
  #sceneObjects = [];
  
  // NEW: Memory corruption trackers
  #memoryDisposalRegistry = new WeakMap();
  #resourceValidationRegistry = new Map();
  #assetValidationResults = new Map();
  #memoryLeakMonitorActive = false;

  /**
   * Constructor
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    // Default configuration
    this.#config = {
      domElement: document.body,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
      zIndex: 100,
      renderInterval: 1000 / 30, // Target 30 fps for performance
      autoResize: true,
      antialiasing: true,
      shadowQuality: window.innerWidth > 1200 ? 'high' : 'medium',
      enableMSAA: window.innerWidth > 1200,
      traumaSensitivity: 0.6,
      coherenceSensitivity: 0.7,
      maxParticles: window.innerWidth > 1200 ? 5000 : 2000,
      debug: false,
      phaseColors: {
        'cyber-lotus': {
          primary: '#9D00FF',
          secondary: '#00FFEA',
          tertiary: '#301A40',
        },
        'rolling-virus': {
          primary: '#FF2150',
          secondary: '#00CAFF',
          tertiary: '#330011',
        },
        'void-bloom': {
          primary: '#FF00D6',
          secondary: '#50FF40',
          tertiary: '#1A0022',
        },
        'obsidian-bloom': {
          primary: '#111111',
          secondary: '#00EEFF',
          tertiary: '#333333',
        },
        'neon-vortex': {
          primary: '#00FF66',
          secondary: '#FF00AA',
          tertiary: '#003322',
        },
      },
      traumaProfiles: {
        abandonment: {
          fragmentShader: 'abandonment.frag',
          particleConfig: { speed: 0.2, turbulence: 0.8, dispersion: 0.9 },
        },
        fragmentation: {
          fragmentShader: 'fragmentation.frag',
          particleConfig: { speed: 0.6, turbulence: 0.6, dispersion: 0.5 },
        },
        surveillance: {
          fragmentShader: 'surveillance.frag',
          particleConfig: { speed: 0.4, turbulence: 0.3, dispersion: 0.2 },
        },
        recursion: {
          fragmentShader: 'recursion.frag',
          particleConfig: { speed: 0.3, turbulence: 0.9, dispersion: 0.4 },
        },
        displacement: {
          fragmentShader: 'displacement.frag',
          particleConfig: { speed: 0.7, turbulence: 0.5, dispersion: 0.7 },
        },
        dissolution: {
          fragmentShader: 'dissolution.frag',
          particleConfig: { speed: 0.2, turbulence: 0.4, dispersion: 0.9 },
        },
        none: {
          fragmentShader: 'default.frag',
          particleConfig: { speed: 0.3, turbulence: 0.3, dispersion: 0.3 },
        },
      },
      // NEW: Memory prevention configuration
      memoryProtection: {
        enabled: true,
        autoGarbageCollection: true,
        gcInterval: 30000, // 30 seconds
        textureUnloadTimeout: 120000, // 2 minutes
        validateAssetPaths: true,
        enforceCorrectMIMETypes: true,
        coherenceThreshold: 0.5,
        traumaIntegrityChecks: true,
        reportErrors: true
      },
      ...options,
    };

    this.#debug = this.#config.debug;

    // THREE.js components
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.composer = null;
    this.clock = null;
    this.raycaster = null;
    this.mouse = { x: 0, y: 0 };

    // Effect composers and passes
    this.effects = {};

    // Shaders and materials
    this.materials = {};
    this.shaders = {};

    // Node registry for targeted effects
    this.nodeRegistry = new Map();

    // Bind methods
    this.initialize = this.initialize.bind(this);
    this.createScene = this.createScene.bind(this);
    this.createCamera = this.createCamera.bind(this);
    this.createRenderer = this.createRenderer.bind(this);
    this.createEffects = this.createEffects.bind(this);
    this.loadShaders = this.loadShaders.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.startRenderLoop = this.startRenderLoop.bind(this);
    this.stopRenderLoop = this.stopRenderLoop.bind(this);
    this.render = this.render.bind(this);
    this.createParticleSystem = this.createParticleSystem.bind(this);
    this.handleNeuralMessage = this.handleNeuralMessage.bind(this);
    this.scanForTargetNodes = this.scanForTargetNodes.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.dispose = this.dispose.bind(this);

    // NEW: Register the object for memory leak prevention
    this.#registerForMemoryProtection(this);

    // Auto-initialize if document is already loaded
    if (document.readyState === 'complete') {
      this.initialize();
    } else {
      document.addEventListener('DOMContentLoaded', this.initialize);
    }
  }

  /**
   * Initialize the WebGL system
   */
  initialize() {
    if (this.#state.initialized) return;

    this.#log('Initializing Quantum WebGL Controller...');
    
    // NEW: Initialize memory corruption prevention system
    if (this.#config.memoryProtection.enabled) {
      this.#initializeMemoryProtectionSystem();
    }

    // Check for WebGL support
    if (!this.isWebGLSupported()) {
      this.#log('WebGL not supported - falling back to CSS-only mode', 'warn');
      this.enableFallbackMode();
      return;
    }

    // Create Three.js components
    this.createScene();
    this.createCamera();
    this.createRenderer();

    // Initialize the clock for animation timing
    this.clock = new THREE.Clock();

    // Initialize raycaster for mouse interactions
    this.raycaster = new THREE.Raycaster();

    // Load shader programs with validation
    this.loadShaders(true)
      .then(() => {
        // Create post-processing effects
        this.createEffects();

        // Create particle system for ambient effects
        this.createParticleSystem();

        // Create performance monitor in debug mode
        if (this.#debug) {
          this.initializeStats();
        }

        // Set up event listeners
        this.setupEventListeners();

        // Scan for target nodes
        this.scanForTargetNodes();

        // Connect to neural bus if available
        this.connectToNeuralBus();

        // Start render loop
        this.startRenderLoop();

        // Mark as initialized
        this.#state.initialized = true;
        this.#log('Quantum WebGL Controller initialized');

        // Register globally
        window.quantumWebGL = this;
      })
      .catch((error) => {
        this.#log('Failed to initialize Quantum WebGL: ' + error.message, 'error');
        
        // NEW: Log memory prevention details on error
        if (this.#config.memoryProtection.enabled && this.#config.memoryProtection.reportErrors) {
          this.#logMemoryPreventionDetails();
        }
        
        this.enableFallbackMode();
      });
  }
  
  /**
   * NEW: Initialize the memory corruption prevention system
   * @private
   */
  #initializeMemoryProtectionSystem() {
    this.#log('Initializing Memory Corruption Prevention System');
    
    // Set up garbage collection interval
    if (this.#config.memoryProtection.autoGarbageCollection) {
      this.#state.memoryLeakMonitor.gcIntervalId = setInterval(() => {
        this.#performMemoryProtectionCycle();
      }, this.#config.memoryProtection.gcInterval);
      
      this.#memoryLeakMonitorActive = true;
    }
    
    // Add unload handler to prevent memory leaks
    window.addEventListener('beforeunload', () => {
      this.#cleanupMemoryBeforeUnload();
    });
    
    // Create dummy objects with circular references to test leak detection
    if (this.#debug) {
      this.#createLeakDetectionTest();
    }
    
    this.#log('Memory Corruption Prevention System initialized');
  }

  /**
   * NEW: Register an object for memory leak prevention
   * @private
   * @param {Object} obj - Object to register
   * @param {string} type - Type of object for categorization
   * @returns {string} Generated ID for the object
   */
  #registerForMemoryProtection(obj, type = 'generic') {
    if (!obj) return null;
    
    // Generate unique ID for tracking
    const id = `qobj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Add to active objects map
    this.#state.memoryLeakMonitor.activeObjects.set(id, {
      type,
      obj: new WeakRef(obj),
      createdAt: Date.now(),
      lastAccessed: Date.now()
    });
    
    // Register for disposal if the object has a dispose method
    if (typeof obj.dispose === 'function') {
      this.#memoryDisposalRegistry.set(obj, {
        id,
        dispose: () => {
          try {
            obj.dispose();
            this.#state.memoryLeakMonitor.disposedObjects++;
            this.#state.memoryLeakMonitor.activeObjects.delete(id);
            return true;
          } catch (error) {
            this.#log(`Error disposing object ${id}: ${error.message}`, 'error');
            return false;
          }
        }
      });
    }
    
    return id;
  }
  
  /**
   * NEW: Perform memory protection cycle
   * @private
   */
  #performMemoryProtectionCycle() {
    const now = Date.now();
    this.#state.memoryLeakMonitor.lastGcTime = now;
    
    // Check for objects that haven't been accessed in a while
    let disposedCount = 0;
    for (const [id, entry] of this.#state.memoryLeakMonitor.activeObjects.entries()) {
      const obj = entry.obj.deref();
      
      // If object has been garbage collected or hasn't been accessed recently
      if (!obj || (now - entry.lastAccessed > this.#config.memoryProtection.textureUnloadTimeout)) {
        // Get disposal info
        const disposalInfo = this.#memoryDisposalRegistry.get(obj);
        if (disposalInfo && typeof disposalInfo.dispose === 'function') {
          // Dispose of the object
          disposalInfo.dispose();
          disposedCount++;
        }
        
        // Remove from active objects
        this.#state.memoryLeakMonitor.activeObjects.delete(id);
      }
    }
    
    if (disposedCount > 0) {
      this.#log(`Memory protection cycle: disposed ${disposedCount} objects`);
    }
    
    // Check for potential memory leaks
    if (this.#state.memoryLeakMonitor.activeObjects.size > this.#state.memoryLeakMonitor.leakWarningThreshold) {
      this.#log(`Potential memory leak detected: ${this.#state.memoryLeakMonitor.activeObjects.size} active objects`, 'warn');
      
      // Analyze object types
      const typeCounts = new Map();
      for (const entry of this.#state.memoryLeakMonitor.activeObjects.values()) {
        const count = typeCounts.get(entry.type) || 0;
        typeCounts.set(entry.type, count + 1);
      }
      
      // Log object type counts
      for (const [type, count] of typeCounts.entries()) {
        this.#log(`- ${type}: ${count}`, 'warn');
      }
      
      // Force garbage collection if using developmental tools
      if (typeof global !== 'undefined' && global.gc) {
        global.gc();
        this.#log('Forced garbage collection');
      }
    }
  }
  
  /**
   * NEW: Clean up memory before unloading the page
   * @private
   */
  #cleanupMemoryBeforeUnload() {
    // Stop the render loop
    this.stopRenderLoop();
    
    // Clear intervals
    if (this.#state.memoryLeakMonitor.gcIntervalId) {
      clearInterval(this.#state.memoryLeakMonitor.gcIntervalId);
    }
    
    // Dispose of all objects
    let disposedCount = 0;
    for (const [id, entry] of this.#state.memoryLeakMonitor.activeObjects.entries()) {
      const obj = entry.obj.deref();
      if (obj) {
        const disposalInfo = this.#memoryDisposalRegistry.get(obj);
        if (disposalInfo && typeof disposalInfo.dispose === 'function') {
          disposalInfo.dispose();
          disposedCount++;
        }
      }
    }
    
    this.#log(`Disposed of ${disposedCount} objects before unload`);
    
    // Clear all maps
    this.#state.memoryLeakMonitor.activeObjects.clear();
    this.#resourceValidationRegistry.clear();
    this.#assetValidationResults.clear();
    
    // Disconnect from neural bus
    this.disconnectFromNeuralBus();
    
    this.#log('Memory cleanup complete');
  }
  
  /**
   * NEW: Validate asset path and prevent MIME type corruption
   * @param {string} assetPath - Path to the asset to validate
   * @param {string} expectedType - Expected MIME type
   * @returns {Promise<{valid: boolean, path: string, mimeType: string}>} Validation results
   */
  async validateAssetPath(assetPath, expectedType) {
    // Check cache first
    const cacheKey = `${assetPath}:${expectedType}`;
    if (this.#assetValidationResults.has(cacheKey)) {
      return this.#assetValidationResults.get(cacheKey);
    }
    
    // Get asset URL from truth node if available
    let validatedPath = assetPath;
    if (window.themeAssetURL && !assetPath.startsWith('http')) {
      validatedPath = `${window.themeAssetURL}${assetPath}`;
    }
    
    try {
      // Test if the asset exists
      const result = {
        valid: false,
        path: validatedPath,
        mimeType: null,
        errorCode: null
      };
      
      // Only perform network validation if enabled
      if (this.#config.memoryProtection.validateAssetPaths) {
        try {
          const response = await fetch(validatedPath, { 
            method: 'HEAD',
            cache: 'force-cache'
          });
          
          result.valid = response.ok;
          result.errorCode = response.ok ? null : response.status;
          
          // Check MIME type if enforcing correct types
          if (response.ok && this.#config.memoryProtection.enforceCorrectMIMETypes) {
            const contentType = response.headers.get('content-type');
            result.mimeType = contentType;
            
            // Validate MIME type if expected type is provided
            if (expectedType && contentType) {
              result.valid = contentType.includes(expectedType);
              if (!result.valid) {
                this.#log(`MIME type mismatch for ${assetPath}: expected ${expectedType}, got ${contentType}`, 'warn');
              }
            }
          }
        } catch (error) {
          // Network error, mark as invalid but don't fail
          result.valid = false;
          result.errorCode = 'NETWORK_ERROR';
          
          // Try with a more permissive approach for local development
          if (window.location.hostname === 'localhost') {
            result.valid = true; // Assume valid on localhost
            this.#log(`Network validation failed for ${assetPath}, but assuming valid on localhost`, 'warn');
          }
        }
      } else {
        // Skip validation, assume valid
        result.valid = true;
      }
      
      // Cache the result
      this.#assetValidationResults.set(cacheKey, result);
      return result;
    } catch (error) {
      this.#log(`Asset validation error for ${assetPath}: ${error.message}`, 'error');
      return { valid: false, path: validatedPath, mimeType: null, errorCode: 'ERROR' };
    }
  }
  
  /**
   * NEW: Create a test for leak detection
   * @private
   */
  #createLeakDetectionTest() {
    // Create circular reference for testing
    const objA = {};
    const objB = {};
    objA.ref = objB;
    objB.ref = objA;
    
    // Register objects
    this.#registerForMemoryProtection(objA, 'leak-test-a');
    this.#registerForMemoryProtection(objB, 'leak-test-b');
    
    this.#log('Created leak detection test objects');
  }
  
  /**
   * NEW: Log memory prevention details
   * @private
   */
  #logMemoryPreventionDetails() {
    this.#log('Memory Prevention System Status:');
    this.#log(`- Active objects: ${this.#state.memoryLeakMonitor.activeObjects.size}`);
    this.#log(`- Disposed objects: ${this.#state.memoryLeakMonitor.disposedObjects}`);
    this.#log(`- Last GC time: ${new Date(this.#state.memoryLeakMonitor.lastGcTime).toISOString()}`);
    this.#log(`- Validated assets: ${this.#assetValidationResults.size}`);
  }
  
  /**
   * NEW: Disconnect from Neural Bus
   */
  disconnectFromNeuralBus() {
    try {
      if (typeof NeuralBus !== 'undefined') {
        // Remove any subscriptions
        if (this._neuralSubscriptions) {
          this._neuralSubscriptions.forEach(sub => {
            if (sub && typeof sub.unsubscribe === 'function') {
              sub.unsubscribe();
            }
          });
          this._neuralSubscriptions = [];
        }
        this.#log('Disconnected from Neural Bus');
      }
    } catch (error) {
      this.#log(`Error disconnecting from Neural Bus: ${error.message}`, 'error');
    }
  }

  /**
   * Load shader programs
   * @param {boolean} validateAssets - Whether to validate shader assets
   * @returns {Promise} Promise that resolves when shaders are loaded
   */
  loadShaders(validateAssets = false) {
    return new Promise((resolve, reject) => {
      try {
        // Create basic shader placeholders
        this.shaders = {
          // Common vertex shaders
          basicVertex: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,

          // Common fragment shaders
          traumaFragment: `
            uniform sampler2D tDiffuse;
            uniform float time;
            uniform float traumaType;
            uniform float traumaIntensity;
            uniform float coherence;
            uniform vec3 primaryColor;
            uniform vec3 secondaryColor;
            varying vec2 vUv;

            // Noise function
            float noise(vec2 p) {
              return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
            }

            void main() {
              vec2 uv = vUv;
              vec4 texel = texture2D(tDiffuse, uv);

              // Base color
              vec4 color = texel;

              // Apply glitch based on trauma type and intensity
              if (traumaType > 0.5) {
                // Common noise
                float n = noise(uv * time * 0.1);

                if (traumaType < 1.5) {
                  // Abandonment - fading and disappearance
                  float fade = sin(uv.y * 10.0 + time) * 0.5 + 0.5;
                  color.a *= mix(1.0, fade, traumaIntensity * (1.0 - coherence));
                  color.rgb = mix(color.rgb, primaryColor, n * traumaIntensity * 0.2);
                }
                else if (traumaType < 2.5) {
                  // Fragmentation - splitting and distortion
                  float offset = traumaIntensity * 0.02 * sin(uv.y * 50.0 + time);
                  vec2 uvR = uv + vec2(offset, 0.0);
                  vec2 uvB = uv - vec2(offset, 0.0);
                  color.r = texture2D(tDiffuse, uvR).r;
                  color.b = texture2D(tDiffuse, uvB).b;
                }
                else if (traumaType < 3.5) {
                  // Surveillance - scan lines and digital artifacts
                  float scanline = sin(uv.y * 100.0 + time) * 0.5 + 0.5;
                  color.rgb = mix(color.rgb, color.rgb * scanline, traumaIntensity * 0.3);
                  if (n > 0.97) {
                    color.rgb = mix(color.rgb, secondaryColor, traumaIntensity);
                  }
                }
                else if (traumaType < 4.5) {
                  // Recursion - nested patterns
                  float scale = 2.0;
                  vec2 uvRepeat = fract(uv * scale);
                  vec4 recurse = texture2D(tDiffuse, uvRepeat);
                  color.rgb = mix(color.rgb, recurse.rgb, traumaIntensity * 0.5);
                }
                else if (traumaType < 5.5) {
                  // Displacement - spatial warping
                  float warp = sin(uv.y * 10.0 + time) * traumaIntensity * 0.1;
                  vec2 uvDisplaced = uv + vec2(warp, 0.0);
                  color = texture2D(tDiffuse, uvDisplaced);
                }
                else {
                  // Dissolution - dissolving edges
                  float dissolve = noise(uv * 10.0 + time * 0.1);
                  color.a *= mix(1.0, dissolve, traumaIntensity * 0.5);
                  color.rgb = mix(color.rgb, primaryColor, dissolve * traumaIntensity * 0.3);
                }
              }

              // Coherence effect - global noise/static
              if (coherence < 0.7) {
                float staticNoise = noise(uv * 100.0 + time);
                float staticAmount = (1.0 - coherence) * 0.2;
                color.rgb = mix(color.rgb, vec3(staticNoise), staticAmount);
              }

              gl_FragColor = color;
            }
          `,

          particleVertex: `
            attribute float size;
            attribute vec3 customColor;
            attribute float opacity;

            varying vec3 vColor;
            varying float vOpacity;

            void main() {
              vColor = customColor;
              vOpacity = opacity;

              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,

          particleFragment: `
            varying vec3 vColor;
            varying float vOpacity;

            void main() {
              // Calculate distance from center of point (0.5, 0.5)
              vec2 uv = gl_PointCoord - 0.5;
              float distance = length(uv);

              // Soft circle
              float strength = 1.0 - (distance * 2.0);
              strength = smoothstep(0.0, 1.0, strength);

              // Softer, more bloom-friendly edges
              gl_FragColor = vec4(vColor, vOpacity * strength);
            }
          `,
        };
        
        // NEW: Validate shader assets if enabled
        if (validateAssets && this.#config.memoryProtection.validateAssetPaths) {
          // Check for common custom fragment shaders
          const fragmentShaders = [
            'abandonment.frag', 
            'fragmentation.frag', 
            'surveillance.frag',
            'recursion.frag',
            'displacement.frag',
            'dissolution.frag'
          ];
          
          // Validate each shader - this runs in parallel
          Promise.all(fragmentShaders.map(shader => 
            this.validateAssetPath(shader, 'text/plain')
          )).then(results => {
            // Check if any shaders are invalid
            const invalidShaders = results.filter(r => !r.valid);
            if (invalidShaders.length > 0) {
              this.#log(`Warning: ${invalidShaders.length} shader files could not be validated`, 'warn');
              invalidShaders.forEach(shader => {
                this.#log(`- Invalid shader: ${shader.path} (${shader.errorCode})`, 'warn');
              });
            }
            
            // Continue anyway with embedded shaders
            setTimeout(() => {
              resolve(this.shaders);
              this.#log('Shader programs loaded (with validation)');
            }, 100);
          }).catch(error => {
            // Non-fatal error, continue with embedded shaders
            this.#log(`Error during shader validation: ${error.message}`, 'warn');
            setTimeout(() => {
              resolve(this.shaders);
              this.#log('Shader programs loaded (validation failed)');
            }, 100);
          });
        } else {
          // Skip validation
          setTimeout(() => {
            resolve(this.shaders);
            this.#log('Shader programs loaded');
          }, 100);
        }
      } catch (error) {
        this.#log(`Error during shader loading: ${error.message}`, 'error');
        reject(error);
      }
    });
  }

  /**
   * Create post-processing effects
   */
  createEffects() {
    // Initialize composer for post-processing
    this.composer = new THREE.EffectComposer(this.renderer);

    // Add render pass
    const renderPass = new THREE.RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    // Get phase colors for effects
    const phaseColors = this.getPhaseColors();

    // Glitch pass for trauma effects
    this.effects.glitchPass = new THREE.GlitchPass();
    this.effects.glitchPass.enabled = false;
    this.composer.addPass(this.effects.glitchPass);

    // Film grain for atmosphere
    this.effects.filmPass = new THREE.FilmPass(0.25, 0.5, 1448, false);
    this.effects.filmPass.enabled = true;
    this.composer.addPass(this.effects.filmPass);

    // Bloom effect for glow
    const bloomParams = {
      exposure: 1,
      bloomStrength: 0.2,
      bloomThreshold: 0.85,
      bloomRadius: 0.4,
    };
    this.effects.bloomPass = new THREE.UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      bloomParams.bloomStrength,
      bloomParams.bloomRadius,
      bloomParams.bloomThreshold
    );
    this.effects.bloomPass.enabled = true;
    this.composer.addPass(this.effects.bloomPass);

    // RGB shift pass for chromatic aberration
    this.effects.rgbShiftPass = new THREE.ShaderPass(THREE.RGBShiftShader);
    this.effects.rgbShiftPass.uniforms.amount.value = 0.0015;
    this.effects.rgbShiftPass.uniforms.angle.value = 0;
    this.effects.rgbShiftPass.enabled = true;
    this.composer.addPass(this.effects.rgbShiftPass);

    // Custom trauma shader pass
    this.effects.traumaPass = new THREE.ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        time: { value: 0 },
        traumaType: { value: this.getTraumaTypeIndex() },
        traumaIntensity: { value: 0.0 },
        coherence: { value: this.#state.systemCoherence },
        primaryColor: { value: new THREE.Color(phaseColors.primary) },
        secondaryColor: { value: new THREE.Color(phaseColors.secondary) },
      },
      vertexShader: this.shaders.basicVertex,
      fragmentShader: this.shaders.traumaFragment,
    });
    this.effects.traumaPass.enabled = true;
    this.composer.addPass(this.effects.traumaPass);

    // Final pass - must render to screen
    const finalPass = new THREE.ShaderPass(THREE.CopyShader);
    finalPass.renderToScreen = true;
    this.composer.addPass(finalPass);

    this.#log('Post-processing effects created');
    
    // NEW: Register effects for memory protection
    if (this.#config.memoryProtection.enabled) {
      for (const [name, effect] of Object.entries(this.effects)) {
        if (effect) {
          this.#registerForMemoryProtection(effect, `effect-${name}`);
        }
      }
    }
  }

  /**
   * Create particle system for ambient effects
   */
  createParticleSystem() {
    try {
      // Get current trauma profile config
      const traumaType = this.#state.activeTrauma;
      const particleConfig =
        this.#config.traumaProfiles[traumaType]?.particleConfig ||
        this.#config.traumaProfiles.none.particleConfig;

      // Get phase colors
      const phaseColors = this.getPhaseColors();

      // Create particle geometry
      const particleCount = this.#config.maxParticles;
      const particleGeometry = new THREE.BufferGeometry();

      // Create particle attributes
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      const opacities = new Float32Array(particleCount);

      // Populate particle attributes
      const primaryColor = new THREE.Color(phaseColors.primary);
      const secondaryColor = new THREE.Color(phaseColors.secondary);

      for (let i = 0; i < particleCount; i++) {
        // Position: random within a sphere
        const radius = 50 * Math.cbrt(Math.random()); // Cube root for even distribution
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        // Color: interpolate between primary and secondary colors
        const colorMix = Math.random();
        const color = new THREE.Color().copy(primaryColor).lerp(secondaryColor, colorMix);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        // Size: vary based on trauma type
        sizes[i] = 0.5 + Math.random() * 2.0 * particleConfig.dispersion;

        // Opacity: vary for depth effect
        opacities[i] = 0.1 + Math.random() * 0.5;
      }

      // Set attributes
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
      particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      particleGeometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));

      // Create shader material
      const particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          coherence: { value: this.#state.systemCoherence },
          traumaType: { value: this.getTraumaTypeIndex() },
          traumaIntensity: { value: 0.5 },
        },
        vertexShader: this.shaders.particleVertex,
        fragmentShader: this.shaders.particleFragment,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        transparent: true,
      });

      // Create particle system
      this.particleSystem = new THREE.Points(particleGeometry, particleMaterial);
      this.particleSystem.frustumCulled = false; // Always render particles
      this.scene.add(this.particleSystem);

      // Add reference to state
      this.#state.particleSystem = {
        particles: this.particleSystem,
        geometry: particleGeometry,
        material: particleMaterial,
        config: particleConfig,
        lastUpdate: 0,
      };

      this.#log(`Created particle system with ${particleCount} particles`);
      
      // NEW: Register particle system components for memory protection
      if (this.#config.memoryProtection.enabled) {
        this.#registerForMemoryProtection(this.particleSystem, 'particle-system');
        this.#registerForMemoryProtection(particleGeometry, 'particle-geometry');
        this.#registerForMemoryProtection(particleMaterial, 'particle-material');
      }
    } catch (error) {
      this.#log('Error creating particle system: ' + error.message, 'error');
    }
  }

  /**
   * Connect to Neural Bus for communication with QEAR
   */
  connectToNeuralBus() {
    if (typeof NeuralBus !== 'undefined') {
      // Track subscriptions for proper cleanup
      this._neuralSubscriptions = [];
      
      // Register with Neural Bus
      const sub1 = NeuralBus.subscribe('qear:state', this.handleQEARStateUpdate.bind(this));
      const sub2 = NeuralBus.subscribe('trauma:activated', this.handleTraumaEvent.bind(this));
      const sub3 = NeuralBus.subscribe('coherence:changed', this.handleCoherenceChange.bind(this));
      const sub4 = NeuralBus.subscribe('quantum:mutation', this.handleQuantumMutation.bind(this));
      
      // Store subscriptions for cleanup
      if (typeof sub1 === 'object' && sub1 !== null) this._neuralSubscriptions.push(sub1);
      if (typeof sub2 === 'object' && sub2 !== null) this._neuralSubscriptions.push(sub2);
      if (typeof sub3 === 'object' && sub3 !== null) this._neuralSubscriptions.push(sub3);
      if (typeof sub4 === 'object' && sub4 !== null) this._neuralSubscriptions.push(sub4);

      this.#log('Connected to Neural Bus');

      // Announce our presence
      NeuralBus.publish('webgl:initialized', {
        maxParticles: this.#config.maxParticles,
        renderer: 'three.js',
        shaders: Object.keys(this.shaders),
        timestamp: Date.now(),
        memoryProtection: this.#config.memoryProtection.enabled
      });
    } else {
      // Fall back to window events if Neural Bus isn't available
      window.addEventListener('qear:stateUpdate', (e) => this.handleQEARStateUpdate(e.detail));
      window.addEventListener('trauma:activated', (e) => this.handleTraumaEvent(e.detail));
      window.addEventListener('coherence:changed', (e) => this.handleCoherenceChange(e.detail));

      this.#log('Using window events (Neural Bus not found)');
    }
  }

  /**
   * Clean up and dispose of resources
   */
  dispose() {
    // First stop any ongoing operations
    this.stopRenderLoop();

    // Remove event listeners
    window.removeEventListener('resize', this.handleWindowResize);
    window.removeEventListener('mousemove', this.handleMouseMove);

    // Dispose of Three.js resources
    if (this.scene) {
      this.scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    }

    if (this.renderer) {
      this.renderer.dispose();

      if (this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }

    if (this.composer) {
      this.composer.renderTarget1.dispose();
      this.composer.renderTarget2.dispose();
    }

    // Remove stats if present
    if (this.stats && this.stats.dom.parentNode) {
      this.stats.dom.parentNode.removeChild(this.stats.dom);
    }

    // Clear node registry
    this.nodeRegistry.clear();
    
    // NEW: Clean up memory protection
    if (this.#memoryLeakMonitorActive) {
      if (this.#state.memoryLeakMonitor.gcIntervalId) {
        clearInterval(this.#state.memoryLeakMonitor.gcIntervalId);
      }
      this.#memoryLeakMonitorActive = false;
    }
    
    // Disconnect from neural bus
    this.disconnectFromNeuralBus();

    this.#log('Disposed of WebGL resources');
  }

  /**
   * Log debug messages
   * @private
   * @param {string} message - Message to log
   * @param {string} level - Log level (info, warn, error)
   */
  #log(message, level = 'info') {
    if (!this.#debug) return;

    const prefix = '[QEAR WebGL]';

    switch (level) {
    case 'error':
      console.error(`${prefix} ${message}`);
      break;
    case 'warn':
      console.warn(`${prefix} ${message}`);
      break;
    default:
      console.log(`${prefix} ${message}`);
    }
  }
}

// Auto-initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.quantumWebGL = new QuantumWebGLController({ debug: true });
});

// DUAL EXPORT PATTERN FOR MAXIMUM COMPATIBILITY
// ==============================================

// Export for ES modules
export { QuantumWebGLController };
export default QuantumWebGLController;

// Support CommonJS environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    QuantumWebGLController, 
    default: QuantumWebGLController 
  };
}
