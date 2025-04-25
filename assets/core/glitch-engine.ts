/**
 * Unified Glitch Engine
 * Quantum-entangled visual glitch effects system with WebGL support
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * @Version: 3.0.0
 */

/**
 * Configuration options for GlitchEngine
 */
export interface GlitchEngineOptions {
  /** Base intensity of glitch effects (0.0-1.0) */
  intensity?: number;
  /** CSS selector for target elements */
  targetSelector?: string | HTMLElement | HTMLElement[];
  /** Whether to automatically start the effect */
  autoStart?: boolean;
  /** Whether to use WebGL for enhanced effects */
  useWebGL?: boolean;
  /** Performance limit in frames per second */
  fpsLimit?: number;
  /** Default glitch effect mode */
  glitchMode?: GlitchMode;
  /** Number of distortion layers */
  layerCount?: number;
  /** Enabled glitch effect types */
  glitchTypes?: GlitchMode[];
  /** Whether to apply text glitch effects */
  textGlitch?: boolean;
  /** Whether to sync with the Neural Bus */
  neuralSynced?: boolean;
  /** Whether to enable debug logging */
  debug?: boolean;
  /** Whether to respond to trauma levels */
  traumaResponsive?: boolean;
  /** Interval between automatic pulses (0 = disabled) */
  pulseInterval?: number;
  /** Trauma level impact multiplier */
  traumaModifier?: number;
  /** Whether to respond to memory phase changes */
  memoryPhaseResponsive?: boolean;
}

/**
 * Glitch effect modes
 */
export type GlitchMode =
  | 'rgb-shift'
  | 'noise'
  | 'scanlines'
  | 'jitter'
  | 'displacement'
  | 'chromatic'
  | 'flicker'
  | 'corruption';

/**
 * Glitch pulse configuration
 */
export interface GlitchPulseOptions {
  /** Intensity of the pulse effect (0.0-1.0) */
  intensity?: number;
  /** Duration of the pulse in milliseconds */
  duration?: number;
  /** Glitch mode to use for the pulse */
  mode?: GlitchMode;
  /** Specific effect types to enable for this pulse */
  effectTypes?: GlitchMode[];
}

/**
 * Internal target state structure
 */
interface GlitchTarget {
  /** DOM element being affected */
  element: HTMLElement;
  /** Original content of the element */
  originalContent: string;
  /** Whether the effect is active */
  active: boolean;
  /** Current effect intensity */
  intensity: number;
  /** Timestamp of last pulse */
  lastPulse: number;
  /** Active timeout IDs */
  timeouts: number[];
  /** WebGL context if enabled */
  gl?: WebGLRenderingContext | WebGL2RenderingContext;
  /** Canvas element if using WebGL */
  canvas?: HTMLCanvasElement;
  /** WebGL shader program */
  program?: WebGLProgram;
  /** WebGL uniform locations */
  uniforms?: Record<string, WebGLUniformLocation | null>;
  /** Active effect types */
  activeEffects: Set<GlitchMode>;
  /** Effect-specific state data */
  effectState: Record<string, any>;
}

/**
 * Primary Glitch Engine class
 * Provides visual glitch effects with multiple rendering strategies
 */
class GlitchEngineImplementation {
  // Static instance for singleton
  private static instance: GlitchEngineImplementation;

  // Configuration
  private config: Required<GlitchEngineOptions>;

  // State management
  private targets: Map<HTMLElement, GlitchTarget> = new Map();
  private running: boolean = false;
  private webglSupported: boolean = false;
  private styleSheet: CSSStyleSheet | null = null;
  private rafId: number | null = null;
  private lastFrameTime: number = 0;
  private frameInterval: number = 0;
  private eventSequence: number = 0;
  private glitchCharacters: string = '!<>-_\\/[]{}—=+*^?#________';

  // Neural bus integration
  private neuralBusConnected: boolean = false;
  private neuralNonce: string | null = null;
  private traumaLevel: number = 0;
  private memoryPhase: string = 'cyber-lotus';

  /**
   * Private constructor for singleton pattern
   * @param options Configuration options
   */
  private constructor(options: GlitchEngineOptions = {}) {
    // Default configuration
    this.config = {
      intensity: options.intensity ?? 0.5,
      targetSelector: options.targetSelector ?? '[data-glitch]',
      autoStart: options.autoStart ?? false,
      useWebGL: options.useWebGL ?? true,
      fpsLimit: options.fpsLimit ?? 30,
      glitchMode: options.glitchMode ?? 'rgb-shift',
      layerCount: options.layerCount ?? 2,
      glitchTypes: options.glitchTypes ?? [
        'rgb-shift',
        'noise',
        'scanlines',
        'jitter',
        'displacement',
        'flicker',
      ],
      textGlitch: options.textGlitch ?? true,
      neuralSynced: options.neuralSynced ?? true,
      debug: options.debug ?? false,
      traumaResponsive: options.traumaResponsive ?? true,
      pulseInterval: options.pulseInterval ?? 0,
      traumaModifier: options.traumaModifier ?? 0.1,
      memoryPhaseResponsive: options.memoryPhaseResponsive ?? true,
    };

    // Performance timing
    this.frameInterval = 1000 / this.config.fpsLimit;

    // Check WebGL support
    this.webglSupported = this._checkWebGLSupport();

    // Initialize
    this._init();

    // Auto-start if configured
    if (this.config.autoStart) {
      this.start();
    }
  }

  /**
   * Get the Glitch Engine instance (singleton)
   * @param options Configuration options (only used on first instantiation)
   */
  public static getInstance(options: GlitchEngineOptions = {}): GlitchEngineImplementation {
    if (!GlitchEngineImplementation.instance) {
      GlitchEngineImplementation.instance = new GlitchEngineImplementation(options);
    }
    return GlitchEngineImplementation.instance;
  }

  /**
   * Initialize the glitch engine
   * @private
   */
  private _init(): void {
    // Initialize stylesheet
    this._initializeStyleSheet();

    // Find targets in the DOM
    this._findTargets();

    // Connect to Neural Bus if available
    if (this.config.neuralSynced) {
      this._connectToNeuralBus();
    }

    // Store original content for targets
    this._storeOriginalContent();

    // Add resize handler
    window.addEventListener('resize', this._handleResize.bind(this));

    // Log debug information
    if (this.config.debug) {
      this._logDebug('GlitchEngine initialized', {
        targets: this.targets.size,
        webGL: this.webglSupported,
        neuralConnected: this.neuralBusConnected,
      });
    }
  }

  /**
   * Initialize CSS stylesheet for glitch effects
   * @private
   */
  private _initializeStyleSheet(): void {
    const style = document.createElement('style');
    style.id = 'voidbloom-glitch-engine-styles';
    style.textContent = `
      .glitch-container {
        position: relative;
        z-index: 1;
      }

      .glitch-active {
        will-change: transform, opacity, filter;
      }

      .glitch-displacement {
        position: relative;
        display: inline-block;
      }

      .glitch-displacement::before,
      .glitch-displacement::after {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.8;
        pointer-events: none;
        transform: translate(
          var(--glitch-before-x, -3px),
          var(--glitch-before-y, -1px)
        );
      }

      .glitch-displacement::before {
        color: var(--glitch-color-1, #0ee7ff);
        transform: translate(
          var(--glitch-before-x, -3px),
          var(--glitch-before-y, -1px)
        );
      }

      .glitch-displacement::after {
        color: var(--glitch-color-2, #d721b8);
        transform: translate(
          var(--glitch-after-x, 3px),
          var(--glitch-after-y, 1px)
        );
      }

      .glitch-scanlines::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: repeating-linear-gradient(
          to bottom,
          transparent 0%,
          rgba(10, 10, 15, 0.1) 0.5%,
          transparent 1%
        );
        pointer-events: none;
        z-index: 10;
        mix-blend-mode: overlay;
      }

      .glitch-noise::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAAgMAAADXB5lNAAAACVBMVEUAAAAAAAD///+D3c/SAAAAAXRSTlMAQObYZgAAAAlwSFlzAAAOxAAADsQBlSsOGwAAALlJREFUOI1jYKACYBw1gBLA8vHqIVjKEYZS8pB5LAtYrsFNZTvNdgos5c/AumTKRrBU8EOWTzs3M4ClPtixfCs9vQAs9YPl2sT//wwMYKmPLN9+/v/37z9Y6jfLh///WBhBUv9Zvvz/x8AIlvrF8vf/XwaQ1D8ENUxgqd8svBKTJkKkPrJ8/f+f6SVE6hvLt69XnzLUQaQ+sXz//+8/4x+I1GeWb///MQIJ/YdIfeaCkWJAUQcAvIhR0eydQfIAAAAASUVORK5CYII=');
        background-repeat: repeat;
        opacity: 0.15;
        mix-blend-mode: overlay;
        pointer-events: none;
        z-index: 10;
      }

      .glitch-flicker {
        animation: glitch-flicker 0.2s infinite alternate-reverse;
      }

      @keyframes glitch-flicker {
        0% {
          opacity: 1;
        }
        25% {
          opacity: 0.8;
        }
        50% {
          opacity: 1;
        }
        75% {
          opacity: 0.9;
        }
        100% {
          opacity: 1;
        }
      }

      /* Memory phase specific styles */
      .memory-phase-cyber-lotus .glitch-displacement::before {
        color: #0ee7ff;
      }

      .memory-phase-cyber-lotus .glitch-displacement::after {
        color: #00aeff;
      }

      .memory-phase-alien-flora .glitch-displacement::before {
        color: #04ff59;
      }

      .memory-phase-alien-flora .glitch-displacement::after {
        color: #00c050;
      }

      .memory-phase-rolling-virus .glitch-displacement::before {
        color: #ffbb38;
      }

      .memory-phase-rolling-virus .glitch-displacement::after {
        color: #ff9500;
      }

      .memory-phase-trauma-core .glitch-displacement::before {
        color: #d721b8;
      }

      .memory-phase-trauma-core .glitch-displacement::after {
        color: #b80d98;
      }
    `;

    document.head.appendChild(style);
    this.styleSheet = style.sheet;
  }

  /**
   * Check if WebGL is supported
   * @private
   * @returns Whether WebGL is supported
   */
  private _checkWebGLSupport(): boolean {
    try {
      const canvas = document.createElement('canvas');
      // Try WebGL2 first
      let gl: WebGLRenderingContext | WebGL2RenderingContext | null = canvas.getContext(
        'webgl2'
      ) as WebGL2RenderingContext | null;

      if (!gl) {
        // Fall back to WebGL1 with optimized parameters
        gl =
          (canvas.getContext('webgl', {
            alpha: false,
            antialias: false,
            powerPreference: 'high-performance',
          }) as WebGLRenderingContext | null) ||
          (canvas.getContext('experimental-webgl', {
            alpha: false,
            antialias: false,
            powerPreference: 'high-performance',
          }) as WebGLRenderingContext | null);
      }

      // Check if hardware acceleration is available
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
          // Check if we're using a software renderer like SwiftShader
          if (
            renderer.includes('swiftshader') ||
            renderer.includes('software') ||
            renderer.includes('llvmpipe')
          ) {
            console.warn('Hardware acceleration may not be available. Using software renderer.');
            this._showHardwareAccelerationWarning();
          }
        }
      }

      return !!gl;
    } catch (e) {
      return false;
    }
  }

  /**
   * Show hardware acceleration warning to the user
   * @private
   */
  private _showHardwareAccelerationWarning(): void {
    // Check if warning already exists
    if (document.getElementById('webgl-acceleration-warning')) return;

    const warning = document.createElement('div');
    warning.id = 'webgl-acceleration-warning';
    warning.innerHTML = `
      <div style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
                  background: #ffeb3b; color: #333; padding: 15px; border-radius: 8px;
                  z-index: 10000; box-shadow: 0 2px 10px rgba(0,0,0,0.2); max-width: 80%;">
        ⚠️ <strong>Performance Notice:</strong> Please enable hardware acceleration in your browser settings for optimal visual effects.
        <a href="https://enable-webgl.com" target="_blank" style="display: block; margin-top: 8px; color: #0066cc;">
          Learn how to enable WebGL
        </a>
        <button style="position: absolute; top: 5px; right: 5px; background: none; border: none;
                cursor: pointer; font-size: 16px;" onclick="this.parentNode.parentNode.remove()">×</button>
      </div>
    `;
    document.body.appendChild(warning);
  }

  /**
   * Find all target elements based on selector
   * @private
   */
  private _findTargets(): void {
    if (typeof this.config.targetSelector === 'string') {
      // Find elements matching selector
      const elements = document.querySelectorAll(this.config.targetSelector);
      for (const element of Array.from(elements)) {
        this.addTarget(element as HTMLElement);
      }
    } else if (Array.isArray(this.config.targetSelector)) {
      // Use array of elements directly
      for (const element of this.config.targetSelector) {
        if (element instanceof HTMLElement) {
          this.addTarget(element);
        }
      }
    } else if (this.config.targetSelector instanceof HTMLElement) {
      // Use single element
      this.addTarget(this.config.targetSelector);
    }
  }

  /**
   * Store original content of target elements
   * @private
   */
  private _storeOriginalContent(): void {
    for (const target of this.targets.values()) {
      if (!target.originalContent && target.element.textContent) {
        target.originalContent = target.element.textContent;

        // Also set data-text attribute for CSS-based displacement effect
        target.element.dataset.text = target.originalContent;
      }
    }
  }

  /**
   * Connect to Neural Bus for event-driven effects
   * @private
   */
  private _connectToNeuralBus(): void {
    try {
      // Check if NeuralBus is available in window
      if (typeof window !== 'undefined' && window.NeuralBus) {
        // Register with Neural Bus
        const registration = window.NeuralBus.register('glitch-engine', {
          version: '3.0.0',
          capabilities: {
            webgl: this.webglSupported,
            textGlitch: this.config.textGlitch,
            modes: this.config.glitchTypes,
          },
          traumaResponse: this.config.traumaResponsive,
        });

        this.neuralBusConnected = true;
        this.neuralNonce = registration.nonce;

        // Subscribe to relevant events
        window.NeuralBus.subscribe('glitch:trigger', this._handleGlitchTrigger.bind(this));
        window.NeuralBus.subscribe('quantum:mutation', this._handleQuantumMutation.bind(this));
        window.NeuralBus.subscribe('theme:changed', this._handleThemeChange.bind(this));

        // Subscribe to trauma level changes
        window.NeuralBus.subscribe('system:trauma', (data: any) => {
          if (data && typeof data.level === 'number') {
            this.setTraumaLevel(data.level);
          }
        });

        // Subscribe to memory phase changes
        window.NeuralBus.subscribe('system:memory-phase', (data: any) => {
          if (data && data.phase) {
            this.setMemoryPhase(data.phase);
          }
        });

        if (this.config.debug) {
          this._logDebug('Connected to Neural Bus');
        }
      }
    } catch (error) {
      console.warn('Failed to connect to Neural Bus:', error);
      this.neuralBusConnected = false;
    }
  }

  /**
   * Handle glitch trigger events from Neural Bus
   * @private
   * @param data Event data
   */
  private _handleGlitchTrigger(data: any): void {
    // Handle immediate glitch pulse request
    if (data && typeof data === 'object') {
      this.pulse({
        intensity: data.intensity || 1.0,
        duration: data.duration || 500,
        mode: data.mode || this.config.glitchMode,
      });
    }
  }

  /**
   * Handle quantum mutation events from Neural Bus
   * @private
   * @param data Event data
   */
  private _handleQuantumMutation(data: any): void {
    if (data && data.profile) {
      // Adjust glitch properties based on mutation profile
      switch (data.profile) {
        case 'CyberLotus':
          this.setMode('rgb-shift');
          break;
        case 'ObsidianBloom':
          this.setMode('noise');
          break;
        case 'VoidBloom':
          this.setMode('jitter');
          break;
        case 'NeonVortex':
          this.setMode('scanlines');
          break;
      }

      // Apply a pulse effect to visualize the change
      this.pulse({
        intensity: 0.8,
        duration: 800,
      });
    }
  }

  /**
   * Handle theme change events from Neural Bus
   * @private
   * @param data Event data
   */
  private _handleThemeChange(data: any): void {
    if (data && data.glitchIntensity !== undefined) {
      this.setIntensity(data.glitchIntensity);
    }

    if (data && data.glitchMode) {
      this.setMode(data.glitchMode);
    }
  }

  /**
   * Log debug information
   * @private
   * @param message Debug message
   * @param data Additional data
   */
  private _logDebug(message: string, data?: any): void {
    if (!this.config.debug) return;

    console.log(`[GlitchEngine] ${message}`, data || '');
  }

  /**
   * Start the glitch animation
   * @param options Optional runtime options
   * @returns The glitch engine instance for chaining
   */
  public start(options: Partial<GlitchEngineOptions> = {}): GlitchEngineImplementation {
    if (this.running) return this;

    // Apply runtime options
    if (options.intensity !== undefined) {
      this.config.intensity = options.intensity;
    }

    if (options.glitchMode) {
      this.config.glitchMode = options.glitchMode;
    }

    // Start animation loop
    this.running = true;
    this.lastFrameTime = performance.now();
    this._tick();

    // Notify neural bus if connected
    if (this.neuralBusConnected && window.NeuralBus) {
      window.NeuralBus.publish('glitch:started', {
        intensity: this.config.intensity,
        mode: this.config.glitchMode,
        targetCount: this.targets.size,
      });
    }

    // Activate all targets
    for (const target of this.targets.values()) {
      if (!target.active) {
        this._activateTarget(target);
      }
    }

    return this;
  }

  /**
   * Stop the glitch animation
   * @returns The glitch engine instance for chaining
   */
  public stop(): GlitchEngineImplementation {
    if (!this.running) return this;

    // Stop animation loop
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    // Reset targets to original state
    this._resetTargets();

    // Notify neural bus if connected
    if (this.neuralBusConnected && window.NeuralBus) {
      window.NeuralBus.publish('glitch:stopped', {
        timestamp: Date.now(),
      });
    }

    return this;
  }

  /**
   * Reset targets to original state
   * @private
   */
  private _resetTargets(): void {
    for (const target of this.targets.values()) {
      // Deactivate the target
      this._deactivateTarget(target);

      // Clear any remaining timeouts
      for (const timeout of target.timeouts) {
        clearTimeout(timeout);
      }
      target.timeouts = [];
    }
  }

  /**
   * Trigger a momentary glitch pulse
   * @param options Pulse options
   * @returns Promise that resolves when pulse completes
   */
  public pulse(options: GlitchPulseOptions = {}): Promise<void> {
    const intensity = options.intensity || 1.0;
    const duration = options.duration || 500;
    const mode = options.mode || this.config.glitchMode;

    // Store original settings
    const originalIntensity = this.config.intensity;
    const originalMode = this.config.glitchMode;
    const wasRunning = this.running;

    // Apply pulse settings
    this.config.intensity = intensity;
    this.config.glitchMode = mode;

    if (!wasRunning) {
      this.start();
    }

    // Create promise to track completion
    return new Promise((resolve) => {
      setTimeout(() => {
        // Restore original settings
        this.config.intensity = originalIntensity;
        this.config.glitchMode = originalMode;

        if (!wasRunning) {
          this.stop();
        }

        resolve();
      }, duration);
    });
  }

  /**
   * Set the glitch intensity
   * @param intensity New intensity value (0-1)
   * @returns The glitch engine instance for chaining
   */
  public setIntensity(intensity: number): GlitchEngineImplementation {
    this.config.intensity = Math.max(0, Math.min(1, intensity));

    // Update all targets with new intensity
    for (const target of this.targets.values()) {
      target.intensity = this.config.intensity;

      // Apply trauma modifier if responsive
      if (this.config.traumaResponsive) {
        target.intensity += this.traumaLevel * this.config.traumaModifier;
      }
    }

    return this;
  }

  /**
   * Set the glitch mode
   * @param mode Glitch effect mode
   * @returns The glitch engine instance for chaining
   */
  public setMode(mode: GlitchMode): GlitchEngineImplementation {
    if (this.config.glitchTypes.includes(mode)) {
      this.config.glitchMode = mode;

      // Update all targets with new mode
      for (const target of this.targets.values()) {
        if (target.active) {
          // Reset active effects
          this._deactivateTarget(target);
          this._activateTarget(target);
        }
      }
    } else {
      console.warn(`Glitch mode "${mode}" not supported. Using default.`);
      this.config.glitchMode = 'rgb-shift';
    }
    return this;
  }

  /**
   * Set the trauma level
   * @param level Trauma level (0-10)
   * @returns The glitch engine instance for chaining
   */
  public setTraumaLevel(level: number): GlitchEngineImplementation {
    this.traumaLevel = Math.max(0, Math.min(10, level));

    // Update all trauma-responsive targets
    if (this.config.traumaResponsive) {
      for (const target of this.targets.values()) {
        // Update intensity based on trauma level
        target.intensity = this.config.intensity + this.traumaLevel * this.config.traumaModifier;

        // Automatically activate targets at high trauma levels
        if (this.traumaLevel >= 7 && !target.active && this.running) {
          this._activateTarget(target);
        } else if (this.traumaLevel <= 2 && target.active && this.running) {
          this._deactivateTarget(target);
        }
      }
    }

    return this;
  }

  /**
   * Set the memory phase
   * @param phase Memory phase
   * @returns The glitch engine instance for chaining
   */
  public setMemoryPhase(phase: string): GlitchEngineImplementation {
    this.memoryPhase = phase;

    // Update phase-responsive targets
    if (this.config.memoryPhaseResponsive) {
      for (const target of this.targets.values()) {
        // Apply phase-specific styles via class name
        const phaseClasses = [
          'memory-phase-cyber-lotus',
          'memory-phase-alien-flora',
          'memory-phase-rolling-virus',
          'memory-phase-trauma-core',
        ];

        for (const cls of phaseClasses) {
          target.element.classList.remove(cls);
        }

        target.element.classList.add(`memory-phase-${this.memoryPhase}`);
      }
    }

    return this;
  }

  /**
   * Add a new target element to the engine
   * @param element Element to add
   * @param config Optional target-specific configuration
   * @returns The glitch engine instance for chaining
   */
  public addTarget(
    element: HTMLElement,
    config?: Partial<GlitchEngineOptions>
  ): GlitchEngineImplementation {
    if (this.targets.has(element)) {
      return this;
    }

    // Prepare element
    element.classList.add('glitch-container');

    // Apply memory phase if responsive
    if (this.config.memoryPhaseResponsive) {
      element.classList.add(`memory-phase-${this.memoryPhase}`);
    }

    // Create target object
    const target: GlitchTarget = {
      element,
      originalContent: element.textContent || '',
      active: false,
      intensity: this.config.intensity,
      lastPulse: 0,
      timeouts: [],
      activeEffects: new Set(),
      effectState: {},
    };

    // Apply trauma responsiveness
    if (this.config.traumaResponsive) {
      target.intensity += this.traumaLevel * this.config.traumaModifier;
    }

    // Save data-text attribute for displacement effect
    if (element.textContent) {
      element.dataset.text = element.textContent;
    }

    // Initialize WebGL if using WebGL and supported
    if (this.config.useWebGL && this.webglSupported && config?.useWebGL !== false) {
      this._setupWebGLForElement(target);
    }

    // Store target
    this.targets.set(element, target);

    // Activate if engine is running
    if (this.running) {
      this._activateTarget(target);
    }

    return this;
  }

  /**
   * Remove a target element from the engine
   * @param element Element to remove
   * @returns The glitch engine instance for chaining
   */
  public removeTarget(element: HTMLElement): GlitchEngineImplementation {
    const target = this.targets.get(element);
    if (!target) return this;

    // Deactivate and clean up
    if (target.active) {
      this._deactivateTarget(target);
    }

    // Clear any remaining timeouts
    for (const timeout of target.timeouts) {
      clearTimeout(timeout);
    }

    // Cleanup WebGL resources
    if (target.canvas && target.canvas.parentNode) {
      target.canvas.parentNode.removeChild(target.canvas);
    }

    // Remove class names
    element.classList.remove('glitch-container');
    element.classList.remove('glitch-active');
    element.classList.remove('glitch-displacement');
    element.classList.remove('glitch-scanlines');
    element.classList.remove('glitch-noise');
    element.classList.remove('glitch-flicker');

    // Remove memory phase classes
    const phaseClasses = [
      'memory-phase-cyber-lotus',
      'memory-phase-alien-flora',
      'memory-phase-rolling-virus',
      'memory-phase-trauma-core',
    ];

    for (const cls of phaseClasses) {
      element.classList.remove(cls);
    }

    // Remove data attributes
    delete element.dataset.text;

    // Restore original content
    element.textContent = target.originalContent;

    // Remove from targets map
    this.targets.delete(element);

    return this;
  }

  /**
   * Activate a target's glitch effects
   * @private
   * @param target Target to activate
   */
  private _activateTarget(target: GlitchTarget): void {
    if (target.active) return;

    target.active = true;
    target.element.classList.add('glitch-active');

    // Determine which effects to activate based on current mode and configuration
    let effectsToActivate: GlitchMode[] = [];

    // Add the primary glitch mode
    effectsToActivate.push(this.config.glitchMode);

    // Add additional effects based on glitch mode
    switch (this.config.glitchMode) {
      case 'rgb-shift':
        effectsToActivate.push('chromatic');
        break;
      case 'jitter':
        effectsToActivate.push('displacement');
        break;
      case 'noise':
        effectsToActivate.push('noise');
        break;
      case 'scanlines':
        effectsToActivate.push('scanlines');
        break;
    }

    // Filter to ensure we only use supported effects
    effectsToActivate = effectsToActivate.filter((effect) =>
      this.config.glitchTypes.includes(effect)
    );

    // Activate each effect
    for (const effect of effectsToActivate) {
      target.activeEffects.add(effect);

      switch (effect) {
        case 'displacement':
          target.element.classList.add('glitch-displacement');
          break;
        case 'scanlines':
          target.element.classList.add('glitch-scanlines');
          break;
        case 'noise':
          target.element.classList.add('glitch-noise');
          break;
        case 'flicker':
          target.element.classList.add('glitch-flicker');
          break;
      }
    }
  }

  /**
   * Deactivate a target's glitch effects
   * @private
   * @param target Target to deactivate
   */
  private _deactivateTarget(target: GlitchTarget): void {
    if (!target.active) return;

    target.active = false;
    target.element.classList.remove('glitch-active');

    // Remove all effect classes
    target.element.classList.remove('glitch-displacement');
    target.element.classList.remove('glitch-scanlines');
    target.element.classList.remove('glitch-noise');
    target.element.classList.remove('glitch-flicker');

    // Reset CSS properties
    target.element.style.transform = '';
    target.element.style.filter = '';

    // Reset text content
    if (this.config.textGlitch && target.originalContent) {
      target.element.textContent = target.originalContent;
    }

    // Clear effect state
    target.activeEffects.clear();
    target.effectState = {};
  }

  /**
   * Setup WebGL for a specific element
   * @private
   * @param target Target element
   */
  private _setupWebGLForElement(target: GlitchTarget): void {
    const element = target.element;

    // Create a canvas element for the target
    const canvas = document.createElement('canvas');
    const rect = element.getBoundingClientRect();

    // Set canvas size to match element
    canvas.width = rect.width || 300;
    canvas.height = rect.height || 150;

    // Position canvas absolutely to overlay the target
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';

    // Create a relative container if needed
    if (getComputedStyle(element).position === 'static') {
      element.style.position = 'relative';
    }

    // Append canvas to container
    element.appendChild(canvas);

    // Initialize WebGL context with optimized settings
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    try {
      // Try WebGL2 first for better performance
      gl = canvas.getContext('webgl2') as WebGL2RenderingContext | null;

      if (!gl) {
        // Fall back to WebGL1 with optimized parameters
        gl = canvas.getContext('webgl', {
          alpha: true,
          antialias: false,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false,
        }) as WebGLRenderingContext | null;

        if (!gl) {
          gl = canvas.getContext('experimental-webgl', {
            alpha: true,
            antialias: false,
            powerPreference: 'high-performance',
            preserveDrawingBuffer: false,
          }) as WebGLRenderingContext | null;
        }
      }
    } catch (e) {
      console.error('Error creating WebGL context:', e);
    }

    if (!gl) {
      console.warn('WebGL not supported in this browser');
      element.removeChild(canvas);
      return;
    }

    // Create shader program
    const program = this._createShaderProgram(gl);

    if (!program) {
      console.warn('Failed to create shader program');
      element.removeChild(canvas);
      return;
    }

    // Setup geometry (a simple quad)
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // Quad vertices (two triangles)
    const vertices = [-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Setup attributes
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Setup uniforms
    const uniforms: Record<string, WebGLUniformLocation | null> = {
      u_intensity: gl.getUniformLocation(program, 'u_intensity'),
      u_time: gl.getUniformLocation(program, 'u_time'),
      u_rgbShift: gl.getUniformLocation(program, 'u_rgbShift'),
      u_noiseAmount: gl.getUniformLocation(program, 'u_noiseAmount'),
      u_scanlineAmount: gl.getUniformLocation(program, 'u_scanlineAmount'),
      u_jitter: gl.getUniformLocation(program, 'u_jitter'),
      u_resolution: gl.getUniformLocation(program, 'u_resolution'),
    };

    // Set resolution uniform
    gl.uniform2f(uniforms.u_resolution!, canvas.width, canvas.height);

    // Store WebGL resources in target
    target.canvas = canvas;
    target.gl = gl;
    target.program = program;
    target.uniforms = uniforms;
  }

  /**
   * Create WebGL shader program
   * @private
   * @param gl WebGL rendering context
   * @returns Shader program
   */
  private _createShaderProgram(
    gl: WebGLRenderingContext | WebGL2RenderingContext
  ): WebGLProgram | null {
    // Vertex shader source
    const vertexShaderSource = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;

      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_position * 0.5 + 0.5;
      }
    `;

    // Fragment shader source
    const fragmentShaderSource = `
      precision mediump float;

      varying vec2 v_texCoord;

      uniform float u_intensity;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform float u_rgbShift;
      uniform float u_noiseAmount;
      uniform float u_scanlineAmount;
      uniform vec2 u_jitter;

      // Pseudo-random function
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      // Noise function
      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        vec2 u = f * f * (3.0 - 2.0 * f);

        return mix(a, b, u.x) +
              (c - a) * u.y * (1.0 - u.x) +
              (d - b) * u.x * u.y;
      }

      void main() {
        // Apply jitter displacement
        vec2 texCoord = v_texCoord + u_jitter;

        // Base color (dark blue-gray)
        vec3 color = vec3(0.1, 0.1, 0.12);

        // Apply noise
        if (u_noiseAmount > 0.0) {
          float noiseValue = noise(texCoord * 100.0 + u_time);
          color = mix(color, vec3(noiseValue), u_noiseAmount * u_intensity);
        }

        // Apply scanlines
        if (u_scanlineAmount > 0.0) {
          float scanline = sin(texCoord.y * u_resolution.y * 0.5 - u_time * 10.0) * 0.5 + 0.5;
          color = mix(color, color * scanline, u_scanlineAmount * u_intensity);
        }

        // Random glitch blocks
        if (u_intensity > 0.3) {
          float blockNoise = random(floor(texCoord * 10.0) + floor(u_time * 0.1));
          if (blockNoise > 0.95) {
            texCoord.y = fract(texCoord.y + blockNoise * 0.1);
          }
        }

        // Random vertical glitch lines
        if (u_intensity > 0.5) {
          float lineNoise = random(vec2(floor(u_time * 10.0), floor(texCoord.y * 20.0)));
          if (lineNoise > 0.5) {
            texCoord.x = fract(texCoord.x + lineNoise * 0.1);
          }
        }

        // RGB shift effect (chromatic aberration)
        if (u_rgbShift > 0.0) {
          float r = noise(texCoord + vec2(u_time * 0.1, 0.0));
          float g = noise(texCoord + vec2(0.0, u_time * 0.1));
          float b = noise(texCoord - vec2(u_time * 0.1, 0.0));

          color = mix(color, vec3(r, g, b), u_rgbShift * u_intensity);
        }

        // Output final color with intensity modulation
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Create shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertexShader) {
      console.error('Failed to create vertex shader');
      return null;
    }

    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    // Check for compilation errors
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error('Vertex shader compilation failed:', gl.getShaderInfoLog(vertexShader));
      gl.deleteShader(vertexShader);
      return null;
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShader) {
      console.error('Failed to create fragment shader');
      gl.deleteShader(vertexShader);
      return null;
    }

    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    // Check for compilation errors
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error('Fragment shader compilation failed:', gl.getShaderInfoLog(fragmentShader));
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return null;
    }

    // Create program and link shaders
    const program = gl.createProgram();
    if (!program) {
      console.error('Failed to create shader program');
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return null;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    // Check for linking errors
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking failed:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return null;
    }

    // Use the program
    gl.useProgram(program);

    return program;
  }

  /**
   * Main animation tick function
   * @private
   */
  private _tick(): void {
    if (!this.running) return;

    const now = performance.now();
    const elapsed = now - this.lastFrameTime;

    if (elapsed >= this.frameInterval) {
      // Update last frame time with adjustment to prevent drift
      this.lastFrameTime = now - (elapsed % this.frameInterval);

      // Apply glitch effects
      this._applyGlitchEffects();
    }

    // Schedule next frame
    this.rafId = requestAnimationFrame(this._tick.bind(this));
  }

  /**
   * Apply glitch effects to all targets
   * @private
   */
  private _applyGlitchEffects(): void {
    // Skip if no intensity or no targets
    if (this.config.intensity <= 0 || this.targets.size === 0) return;

    for (const target of this.targets.values()) {
      if (!target.active) continue;

      // Apply different effects based on mode and available features
      if (
        this.config.useWebGL &&
        this.webglSupported &&
        target.gl &&
        target.program &&
        target.uniforms
      ) {
        this._applyWebGLEffects(target);
      }

      // Apply text glitch if enabled
      if (this.config.textGlitch) {
        this._applyTextGlitch(target);
      }

      // Apply CSS glitch effects
      this._applyCSSGlitch(target);

      // Apply CSS-based displacement effect
      if (target.activeEffects.has('displacement')) {
        this._applyDisplacementEffect(target);
      }
    }
  }

  /**
   * Apply WebGL-based effects to a target
   * @private
   * @param target Target to apply effects to
   */
  private _applyWebGLEffects(target: GlitchTarget): void {
    if (!target.gl || !target.program || !target.uniforms || !target.canvas) return;

    const gl = target.gl;
    const uniforms = target.uniforms;

    // Set viewport and clear
    gl.viewport(0, 0, target.canvas.width, target.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set uniforms based on current mode and state
    if (uniforms.u_intensity) gl.uniform1f(uniforms.u_intensity, target.intensity);
    if (uniforms.u_time) gl.uniform1f(uniforms.u_time, performance.now() / 1000.0);

    // Set effect-specific uniforms
    switch (this.config.glitchMode) {
      case 'rgb-shift':
        if (uniforms.u_rgbShift) gl.uniform1f(uniforms.u_rgbShift, 0.5);
        if (uniforms.u_noiseAmount) gl.uniform1f(uniforms.u_noiseAmount, 0.2);
        if (uniforms.u_scanlineAmount) gl.uniform1f(uniforms.u_scanlineAmount, 0.0);
        if (uniforms.u_jitter) gl.uniform2f(uniforms.u_jitter, 0.0, 0.0);
        break;
      case 'noise':
        if (uniforms.u_rgbShift) gl.uniform1f(uniforms.u_rgbShift, 0.1);
        if (uniforms.u_noiseAmount) gl.uniform1f(uniforms.u_noiseAmount, 0.8);
        if (uniforms.u_scanlineAmount) gl.uniform1f(uniforms.u_scanlineAmount, 0.0);
        if (uniforms.u_jitter) gl.uniform2f(uniforms.u_jitter, 0.0, 0.0);
        break;
      case 'scanlines':
        if (uniforms.u_rgbShift) gl.uniform1f(uniforms.u_rgbShift, 0.0);
        if (uniforms.u_noiseAmount) gl.uniform1f(uniforms.u_noiseAmount, 0.1);
        if (uniforms.u_scanlineAmount) gl.uniform1f(uniforms.u_scanlineAmount, 0.5);
        if (uniforms.u_jitter) gl.uniform2f(uniforms.u_jitter, 0.0, 0.0);
        break;
      case 'jitter':
        if (uniforms.u_rgbShift) gl.uniform1f(uniforms.u_rgbShift, 0.2);
        if (uniforms.u_noiseAmount) gl.uniform1f(uniforms.u_noiseAmount, 0.3);
        if (uniforms.u_scanlineAmount) gl.uniform1f(uniforms.u_scanlineAmount, 0.1);

        // Random jitter amount based on intensity
        const jitterX = (Math.random() - 0.5) * target.intensity * 0.1;
        const jitterY = (Math.random() - 0.5) * target.intensity * 0.1;
        if (uniforms.u_jitter) gl.uniform2f(uniforms.u_jitter, jitterX, jitterY);
        break;
      default:
        if (uniforms.u_rgbShift) gl.uniform1f(uniforms.u_rgbShift, 0.2);
        if (uniforms.u_noiseAmount) gl.uniform1f(uniforms.u_noiseAmount, 0.2);
        if (uniforms.u_scanlineAmount) gl.uniform1f(uniforms.u_scanlineAmount, 0.1);
        if (uniforms.u_jitter) gl.uniform2f(uniforms.u_jitter, 0.0, 0.0);
    }

    // Draw quad
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  /**
   * Apply text-based glitch effects
   * @private
   * @param target Target to apply effects to
   */
  private _applyTextGlitch(target: GlitchTarget): void {
    // Skip if no original content
    if (!target.originalContent) return;

    // Determine if we should glitch this frame based on intensity
    const shouldGlitch = Math.random() < target.intensity * 0.2;

    if (shouldGlitch) {
      let glitched = '';

      // Apply character-level glitches
      for (let i = 0; i < target.originalContent.length; i++) {
        // Random chance to replace character based on intensity
        if (Math.random() < target.intensity * 0.3) {
          // Replace with random glitch character
          const glitchChar = this.glitchCharacters.charAt(
            Math.floor(Math.random() * this.glitchCharacters.length)
          );
          glitched += glitchChar;
        } else {
          glitched += target.originalContent.charAt(i);
        }
      }

      target.element.textContent = glitched;

      // Schedule reset after short delay for flicker effect
      const timeout = window.setTimeout(() => {
        if (this.running && target.active) {
          target.element.textContent = target.originalContent;
        }
      }, Math.random() * 50 + 50);

      target.timeouts.push(timeout);
    }
  }

  /**
   * Apply CSS-based transform glitches
   * @private
   * @param target Target to apply effects to
   */
  private _applyCSSGlitch(target: GlitchTarget): void {
    // Skip if target is a canvas (we're already applying WebGL effects)
    if (target.element.tagName === 'CANVAS') return;

    // Determine if we should glitch this frame based on intensity
    const shouldGlitch = Math.random() < target.intensity * 0.15;

    if (shouldGlitch) {
      // Apply random transform based on intensity and mode
      const translateX = (Math.random() - 0.5) * target.intensity * 10;
      const translateY = (Math.random() - 0.5) * target.intensity * 5;
      const skewX = (Math.random() - 0.5) * target.intensity * 5;

      let transform = '';
      let filter = '';

      // Mode-specific effects
      switch (this.config.glitchMode) {
        case 'rgb-shift':
          filter = `hue-rotate(${Math.random() * 360}deg) saturate(${1 + target.intensity * 5})`;
          transform = `translate(${translateX}px, ${translateY}px)`;
          break;
        case 'noise':
          // Noise is primarily handled by WebGL, so just add subtle transform
          transform = `translate(${translateX}px, ${translateY}px)`;
          break;
        case 'scanlines':
          // Scanlines effect is primarily handled by WebGL
          transform = `translateY(${translateY}px)`;
          break;
        case 'jitter':
          transform = `translate(${translateX}px, ${translateY}px) skew(${skewX}deg, 0deg)`;
          break;
        default:
          transform = `translate(${translateX}px, ${translateY}px)`;
      }

      // Apply effects
      target.element.style.transform = transform;
      if (filter) {
        target.element.style.filter = filter;
      }

      // Schedule reset after short delay for flicker effect
      const timeout = window.setTimeout(() => {
        if (this.running && target.active) {
          target.element.style.transform = '';
          if (filter) {
            target.element.style.filter = '';
          }
        }
      }, Math.random() * 100 + 50);

      target.timeouts.push(timeout);
    }
  }

  /**
   * Apply CSS-based displacement glitch effect
   * @private
   * @param target Target to apply effects to
   */
  private _applyDisplacementEffect(target: GlitchTarget): void {
    // Calculate displacements based on intensity
    const beforeX = (Math.random() - 0.5) * target.intensity * 8;
    const beforeY = (Math.random() - 0.5) * target.intensity * 3;
    const afterX = (Math.random() - 0.5) * target.intensity * 8;
    const afterY = (Math.random() - 0.5) * target.intensity * 3;

    // Apply via CSS custom properties
    target.element.style.setProperty('--glitch-before-x', `${beforeX}px`);
    target.element.style.setProperty('--glitch-before-y', `${beforeY}px`);
    target.element.style.setProperty('--glitch-after-x', `${afterX}px`);
    target.element.style.setProperty('--glitch-after-y', `${afterY}px`);
  }

  /**
   * Handle window resize events
   * @private
   */
  private _handleResize(): void {
    // Update WebGL canvases if using WebGL
    if (this.config.useWebGL && this.webglSupported) {
      for (const target of this.targets.values()) {
        if (target.canvas && target.gl && target.uniforms) {
          const rect = target.element.getBoundingClientRect();

          // Update canvas size
          target.canvas.width = rect.width || 300;
          target.canvas.height = rect.height || 150;

          // Update GL viewport and uniforms
          target.gl.viewport(0, 0, target.canvas.width, target.canvas.height);

          if (target.uniforms.u_resolution) {
            target.gl.uniform2f(
              target.uniforms.u_resolution,
              target.canvas.width,
              target.canvas.height
            );
          }
        }
      }
    }
  }

  /**
   * Dispose of all resources
   */
  public dispose(): void {
    // Stop animation
    this.stop();

    // Clean up all targets
    for (const element of this.targets.keys()) {
      this.removeTarget(element);
    }

    // Disconnect from neural bus
    if (this.neuralBusConnected && window.NeuralBus && this.neuralNonce) {
      window.NeuralBus.unregister('glitch-engine', this.neuralNonce);
      this.neuralBusConnected = false;
    }

    // Remove stylesheet
    if (this.styleSheet) {
      const styleElement = document.getElementById('voidbloom-glitch-engine-styles');
      if (styleElement) {
        styleElement.remove();
      }
    }

    // Remove resize listener
    window.removeEventListener('resize', this._handleResize.bind(this));
  }
}

// Create singleton instance
const singleton = GlitchEngineImplementation.getInstance();

// Export type alias
export type GlitchEngine = GlitchEngineImplementation;

// Export singleton instance as default
export default singleton;

// Add to global scope for backwards compatibility
if (typeof window !== 'undefined') {
  window.GlitchEngine = singleton as any;
}

// Add type to window for TypeScript compatibility
declare global {
  interface Window {
    GlitchEngine: GlitchEngine;
    NeuralBus?: any;
  }
}
