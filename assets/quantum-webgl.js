/**
 * QUANTUM-WEBGL.JS
 * WebGL visualization system for QEAR cognitive expressions
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: cognitive-entangled
 * @Version: 1.0.0
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
  };
  #debug = false;
  #sceneObjects = [];

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

    // Load shader programs
    this.loadShaders()
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
        this.enableFallbackMode();
      });
  }

  /**
   * Check if WebGL is supported
   * @returns {boolean} WebGL support status
   */
  isWebGLSupported() {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');

      return !!gl;
    } catch (e) {
      return false;
    }
  }

  /**
   * Enable CSS-only fallback mode when WebGL is not supported
   */
  enableFallbackMode() {
    // Mark fallback mode in document
    document.documentElement.classList.add('webgl-fallback');

    // Create CSS-only versions of key visual effects
    const style = document.createElement('style');
    style.textContent = `
      .webgl-fallback .trauma-layer {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: ${this.#config.zIndex};
        background: radial-gradient(circle at center, transparent 40%, var(--phase-primary) 100%);
        opacity: 0.1;
        mix-blend-mode: screen;
      }

      .webgl-fallback .cognitive-indicator {
        position: fixed;
        top: 10px;
        right: 10px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: var(--phase-primary);
        opacity: 0.7;
        z-index: ${this.#config.zIndex + 1};
        animation: pulse-fallback 2s infinite;
      }

      @keyframes pulse-fallback {
        0%, 100% { transform: scale(1); opacity: 0.7; }
        50% { transform: scale(1.2); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    // Create fallback DOM elements
    const traumaLayer = document.createElement('div');
    traumaLayer.className = 'trauma-layer';
    document.body.appendChild(traumaLayer);

    const cognitiveIndicator = document.createElement('div');
    cognitiveIndicator.className = 'cognitive-indicator';
    document.body.appendChild(cognitiveIndicator);

    this.#log('Fallback mode enabled');
  }

  /**
   * Create the Three.js scene
   */
  createScene() {
    this.scene = new THREE.Scene();

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // Add directional light for better 3D effects
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 1);
    this.scene.add(directionalLight);

    this.#log('Scene created');
  }

  /**
   * Create the Three.js camera
   */
  createCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.z = 5;

    this.#log('Camera created');
  }

  /**
   * Create the Three.js renderer
   */
  createRenderer() {
    // Create the renderer with appropriate settings
    this.renderer = new THREE.WebGLRenderer({
      antialias: this.#config.antialiasing,
      alpha: true,
      preserveDrawingBuffer: true,
    });

    // Set renderer properties
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(this.#config.pixelRatio);
    this.renderer.setClearColor(0x000000, 0); // Transparent background
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type =
      this.#config.shadowQuality === 'high' ? THREE.PCFSoftShadowMap : THREE.PCFShadowMap;

    // Configure canvas properties
    const canvas = this.renderer.domElement;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = this.#config.zIndex.toString();
    canvas.style.pointerEvents = 'none'; // Allow click-through
    canvas.id = 'quantum-webgl-canvas';

    // Add canvas to document
    this.#config.domElement.appendChild(canvas);

    // Mark WebGL as active in document
    document.documentElement.classList.add('webgl-active');

    this.#log('Renderer created');
  }

  /**
   * Load shader programs
   * @returns {Promise} Promise that resolves when shaders are loaded
   */
  loadShaders() {
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

        // Add trauma-specific shader files
        // In a real implementation, these would be loaded from external files

        setTimeout(() => {
          resolve(this.shaders);
          this.#log('Shader programs loaded');
        }, 100);
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
    } catch (error) {
      this.#log('Error creating particle system: ' + error.message, 'error');
    }
  }

  /**
   * Initialize stats monitoring for debugging
   */
  initializeStats() {
    if (typeof Stats !== 'undefined') {
      this.stats = new Stats();
      this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
      this.stats.dom.style.position = 'absolute';
      this.stats.dom.style.top = '0px';
      this.stats.dom.style.left = '0px';
      this.stats.dom.style.zIndex = this.#config.zIndex + 100;
      document.body.appendChild(this.stats.dom);
    }
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Handle window resize
    if (this.#config.autoResize) {
      window.addEventListener('resize', this.handleWindowResize);
    }

    // Handle WebGL context loss
    this.renderer.domElement.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      this.#log('WebGL context lost - attempting to recover', 'warn');
      this.stopRenderLoop();

      // Try to reinitialize after a delay
      setTimeout(() => {
        this.initialize();
      }, 2000);
    });

    // Handle mouse movement for interactive effects
    window.addEventListener('mousemove', this.handleMouseMove);

    // Handle DOM mutations to detect new target nodes
    const observer = new MutationObserver((mutations) => {
      let newNodesAdded = false;

      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          newNodesAdded = true;
        }
      });

      if (newNodesAdded) {
        // Scan for new target nodes
        this.scanForTargetNodes();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    this.#log('Event listeners set up');
  }

  /**
   * Handle window resize event
   */
  handleWindowResize() {
    if (!this.camera || !this.renderer || !this.composer) return;

    // Update camera
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    // Update renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Update composer
    this.composer.setSize(window.innerWidth, window.innerHeight);

    // Update bloom pass resolution
    if (this.effects.bloomPass) {
      this.effects.bloomPass.resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
    }

    this.#log('Resized WebGL view');
  }

  /**
   * Handle mouse movement
   * @param {Event} event - Mouse move event
   */
  handleMouseMove(event) {
    // Update mouse position for raycasting
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  /**
   * Connect to Neural Bus for communication with QEAR
   */
  connectToNeuralBus() {
    if (typeof NeuralBus !== 'undefined') {
      // Register with Neural Bus
      NeuralBus.subscribe('qear:state', this.handleQEARStateUpdate.bind(this));
      NeuralBus.subscribe('trauma:activated', this.handleTraumaEvent.bind(this));
      NeuralBus.subscribe('coherence:changed', this.handleCoherenceChange.bind(this));
      NeuralBus.subscribe('quantum:mutation', this.handleQuantumMutation.bind(this));

      this.#log('Connected to Neural Bus');

      // Announce our presence
      NeuralBus.publish('webgl:initialized', {
        maxParticles: this.#config.maxParticles,
        renderer: 'three.js',
        shaders: Object.keys(this.shaders),
        timestamp: Date.now(),
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
   * Handle QEAR state updates
   * @param {Object} data - QEAR state data
   */
  handleQEARStateUpdate(data) {
    if (!data) return;

    // Update our internal state with QEAR data
    if (data.emotionalState) {
      this.#state.qearState.emotionalState = data.emotionalState;
    }

    if (data.cognitiveState) {
      this.#state.qearState.cognitiveState = data.cognitiveState;
    }

    if (data.activeDecisions) {
      this.#state.qearState.activeDecisions = data.activeDecisions;
    }

    // Generate a cognitive flash effect if processing
    if (data.cognitiveState === 'processing') {
      this.createCognitiveFlash();
    }

    this.#log('QEAR state updated');
  }

  /**
   * Handle trauma events
   * @param {Object} data - Trauma event data
   */
  handleTraumaEvent(data) {
    if (!data || !data.type) return;

    // Update active trauma
    this.#state.activeTrauma = data.type;

    // Create transition effect
    this.createTraumaTransition(data.type);

    // Recreate particle system with new trauma settings
    setTimeout(() => {
      this.createParticleSystem();
    }, 1000);

    this.#log(`Trauma changed to: ${data.type}`);
  }

  /**
   * Handle coherence changes
   * @param {Object} data - Coherence data
   */
  handleCoherenceChange(data) {
    if (!data || data.coherence === undefined) return;

    const oldCoherence = this.#state.systemCoherence;
    this.#state.systemCoherence = data.coherence;

    // Create visual effect if change is significant
    if (Math.abs(oldCoherence - data.coherence) > 0.05) {
      this.createCoherenceFlash(oldCoherence > data.coherence);
    }

    this.#log(`Coherence changed to: ${data.coherence}`);
  }

  /**
   * Handle quantum mutation events
   * @param {Object} data - Mutation data
   */
  handleQuantumMutation(data) {
    if (!data) return;

    // Update phase if needed
    if (data.profile) {
      const phase = this.getPhaseFromProfile(data.profile);
      if (phase !== this.#state.currentPhase) {
        this.#state.currentPhase = phase;
        this.createPhaseTransition(phase);
      }
    }

    // Create mutation-specific visual effect
    this.createMutationEffect(data.targetId, data.type);

    this.#log(`Quantum mutation: ${data.type}`);
  }

  /**
   * Get phase from profile name
   * @param {string} profile - Profile name
   * @returns {string} Phase name
   */
  getPhaseFromProfile(profile) {
    switch (profile) {
    case 'CyberLotus':
      return 'cyber-lotus';
    case 'ObsidianBloom':
      return 'obsidian-bloom';
    case 'VoidBloom':
      return 'void-bloom';
    case 'NeonVortex':
      return 'neon-vortex';
    default:
      return 'cyber-lotus';
    }
  }

  /**
   * Get current phase colors
   * @returns {Object} Phase colors
   */
  getPhaseColors() {
    return (
      this.#config.phaseColors[this.#state.currentPhase] || this.#config.phaseColors['cyber-lotus']
    );
  }

  /**
   * Get trauma type index for shaders
   * @returns {number} Trauma type index
   */
  getTraumaTypeIndex() {
    const traumaTypeMap = {
      none: 0,
      abandonment: 1,
      fragmentation: 2,
      surveillance: 3,
      recursion: 4,
      displacement: 5,
      dissolution: 6,
    };

    return traumaTypeMap[this.#state.activeTrauma] || 0;
  }

  /**
   * Scan for target nodes that should receive shader effects
   */
  scanForTargetNodes() {
    // Find elements with webgl-target attribute
    const targets = document.querySelectorAll('[data-webgl-target]');

    // Clear our current list
    this.#state.targetNodes = [];

    // Process each target
    targets.forEach((element) => {
      const id = element.dataset.webglTarget;
      this.#state.targetNodes.push(id);

      // Set up shader for this target if needed
      this.applyShaderToNode(element);
    });

    this.#log(`Found ${this.#state.targetNodes.length} target nodes`);
  }

  /**
   * Apply shader to a target node
   * @param {Element} element - Target DOM element
   */
  applyShaderToNode(element) {
    // Placeholder - in a full implementation, this would create a
    // plane mesh with a shader that affects this DOM element

    const id = element.dataset.webglTarget;

    // Skip if already registered
    if (this.nodeRegistry.has(id)) return;

    // Register the node
    this.nodeRegistry.set(id, {
      element,
      rect: element.getBoundingClientRect(),
      traumaType: element.dataset.traumaType || this.#state.activeTrauma,
      intensity: parseFloat(element.dataset.traumaIntensity || '0.5'),
    });

    this.#log(`Registered node: ${id}`);
  }

  /**
   * Start the render loop
   */
  startRenderLoop() {
    if (this.#state.rendering) return;

    this.#state.rendering = true;
    this.#state.lastFrameTime = performance.now();
    this.#log('Starting render loop');

    // Create render loop using requestAnimationFrame
    const loop = () => {
      if (!this.#state.rendering) return;

      this.render();

      // Schedule next frame
      this.#state.renderLoopId = requestAnimationFrame(loop);
    };

    // Start the loop
    loop();
  }

  /**
   * Stop the render loop
   */
  stopRenderLoop() {
    this.#state.rendering = false;

    if (this.#state.renderLoopId) {
      cancelAnimationFrame(this.#state.renderLoopId);
      this.#state.renderLoopId = null;
    }

    this.#log('Stopped render loop');
  }

  /**
   * Render a frame
   */
  render() {
    // Skip if not initialized
    if (!this.#state.initialized) return;

    // Update stats if available
    if (this.stats) this.stats.begin();

    // Get delta time
    const elapsedTime = this.clock.getElapsedTime();
    const deltaTime = elapsedTime - this.#state.lastElapsedTime || 0;
    this.#state.lastElapsedTime = elapsedTime;

    // Update uniforms
    this.updateUniforms(elapsedTime);

    // Update particle system
    this.updateParticles(deltaTime);

    // Update node effects
    this.updateNodeEffects();

    // Render the scene via composer for post-processing
    this.composer.render();

    // End stats measurement
    if (this.stats) this.stats.end();
  }

  /**
   * Update shader uniforms
   * @param {number} time - Current time
   */
  updateUniforms(time) {
    // Update post-processing effects
    if (this.effects.traumaPass) {
      this.effects.traumaPass.uniforms.time.value = time;
      this.effects.traumaPass.uniforms.traumaType.value = this.getTraumaTypeIndex();
      this.effects.traumaPass.uniforms.traumaIntensity.value = 0.5; // Could be dynamic
      this.effects.traumaPass.uniforms.coherence.value = this.#state.systemCoherence;

      // Update colors based on phase
      const phaseColors = this.getPhaseColors();
      this.effects.traumaPass.uniforms.primaryColor.value = new THREE.Color(phaseColors.primary);
      this.effects.traumaPass.uniforms.secondaryColor.value = new THREE.Color(
        phaseColors.secondary
      );
    }

    // Update RGB shift based on system coherence
    if (this.effects.rgbShiftPass) {
      // More shift when coherence is low
      const shiftAmount = 0.0015 * (1 + (1 - this.#state.systemCoherence) * 3);
      this.effects.rgbShiftPass.uniforms.amount.value = shiftAmount;
      this.effects.rgbShiftPass.uniforms.angle.value = time * 0.1;
    }

    // Update bloom based on emotional state
    if (this.effects.bloomPass && this.#state.qearState.emotionalState) {
      const anxiety = this.#state.qearState.emotionalState.anxiety || 0.2;
      const intensity = 0.2 + anxiety * 0.3;
      this.effects.bloomPass.strength = intensity;
    }

    // Update glitch effect based on coherence
    if (this.effects.glitchPass) {
      // Only enable glitch at low coherence
      this.effects.glitchPass.enabled = this.#state.systemCoherence < 0.5;
    }
  }

  /**
   * Update particle system
   * @param {number} deltaTime - Time since last frame
   */
  updateParticles(deltaTime) {
    if (!this.#state.particleSystem) return;

    const { particles, geometry, material, config } = this.#state.particleSystem;
    const elapsedTime = this.clock.getElapsedTime();

    // Update material uniforms
    material.uniforms.time.value = elapsedTime;
    material.uniforms.coherence.value = this.#state.systemCoherence;
    material.uniforms.traumaType.value = this.getTraumaTypeIndex();

    // We would update particle positions based on trauma type here
    // This is a simplified version
    particles.rotation.y += deltaTime * 0.05;
    particles.rotation.x += deltaTime * 0.01;
  }

  /**
   * Update effects on DOM nodes
   */
  updateNodeEffects() {
    // Update effects on target nodes
    // This would check visibility, update positions, etc.
  }

  /**
   * Create a cognitive flash effect
   */
  createCognitiveFlash() {
    // Skip if not initialized
    if (!this.#state.initialized) return;

    // Simple flash effect using bloom
    if (this.effects.bloomPass) {
      const originalStrength = this.effects.bloomPass.strength;

      // Increase bloom strength temporarily
      this.effects.bloomPass.strength = originalStrength * 2;

      // Return to normal
      setTimeout(() => {
        this.effects.bloomPass.strength = originalStrength;
      }, 200);
    }
  }

  /**
   * Create a trauma transition effect
   * @param {string} traumaType - New trauma type
   */
  createTraumaTransition(traumaType) {
    // In a full implementation, this would create a dramatic
    // visual effect when trauma type changes

    // Increase trauma intensity momentarily
    if (this.effects.traumaPass) {
      const originalIntensity = this.effects.traumaPass.uniforms.traumaIntensity.value;
      this.effects.traumaPass.uniforms.traumaIntensity.value = 0.9;

      setTimeout(() => {
        this.effects.traumaPass.uniforms.traumaIntensity.value = originalIntensity;
      }, 1000);
    }
  }

  /**
   * Create a phase transition effect
   * @param {string} phase - New phase
   */
  createPhaseTransition(phase) {
    // In a full implementation, this would create a dramatic
    // visual effect when phase changes

    // Update phase colors
    if (this.effects.traumaPass) {
      const phaseColors = this.#config.phaseColors[phase];
      this.effects.traumaPass.uniforms.primaryColor.value = new THREE.Color(phaseColors.primary);
      this.effects.traumaPass.uniforms.secondaryColor.value = new THREE.Color(
        phaseColors.secondary
      );
    }
  }

  /**
   * Create a coherence flash effect
   * @param {boolean} decreasing - Whether coherence is decreasing
   */
  createCoherenceFlash(decreasing) {
    // Skip if not initialized
    if (!this.#state.initialized) return;

    // Flash with RGB shift
    if (this.effects.rgbShiftPass) {
      const originalAmount = this.effects.rgbShiftPass.uniforms.amount.value;
      this.effects.rgbShiftPass.uniforms.amount.value = originalAmount * 3;

      setTimeout(() => {
        this.effects.rgbShiftPass.uniforms.amount.value = originalAmount;
      }, 500);
    }
  }

  /**
   * Create a mutation effect
   * @param {string} targetId - Target node ID (if available)
   * @param {string} mutationType - Type of mutation
   */
  createMutationEffect(targetId, mutationType) {
    // Skip if not initialized
    if (!this.#state.initialized) return;

    // In a full implementation, this would create effects
    // specific to the mutation type on the target element

    // For now, just log
    this.#log(`Mutation effect: ${mutationType} on ${targetId || 'global'}`);
  }

  /**
   * Clean up and dispose of resources
   */
  dispose() {
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

export { QuantumWebGLController };
