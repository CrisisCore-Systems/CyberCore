/**
 * Quantum WebGL TypeScript implementation
 * Provides 3D visualization capabilities using WebGL for quantum data structures
 */

// Import the original JavaScript file using ES module syntax
import { ConfigDomain, ConfigManager, ConfigPriority } from './config-manager.js';
import { ErrorCategory, ErrorHandler } from './error-handler.js';
import { NeuralBus } from './neural-bus.js';
import { OptimizationLevel, PerformanceMonitor } from './performance-monitor.js';
import * as QuantumWebGLJS from './quantum-webgl.js';

// Define mutation profile interface
export interface MutationProfile {
  intensity: number;
  pattern: string;
  colorShift?: number;
  warpFactor?: number;
  noiseLevel?: number;
  [key: string]: unknown;
}

// Define initialization options interface
export interface QuantumWebGLOptions {
  width?: number;
  height?: number;
  particleCount?: number;
  traumaFactor?: number;
  glitchIntensity?: number;
  renderMode?: string;
  errorHandling?: {
    recoveryEnabled?: boolean;
    errorHistoryLimit?: number;
  };
  performanceMonitoring?: {
    enabled?: boolean;
    autoOptimize?: boolean;
    notifyThreshold?: number;
  };
  [key: string]: unknown;
}

// Define recovery options interface
export interface RecoveryOptions {
  resetRendering?: boolean;
  recreateContext?: boolean;
  reinitializeShaders?: boolean;
  clearParticles?: boolean;
}

// Define event data interfaces
interface TraumaActivationData {
  intensity: number;
  type?: string;
  timestamp?: number;
  source?: string;
}

interface QuantumMutationData {
  profile: MutationProfile;
  timestamp?: number;
  source?: string;
}

interface CoherenceStateData {
  coherenceLevel: number;
  timestamp?: number;
  stable?: boolean;
}

interface OptimizationRequestData {
  level: number;
  target?: string;
  source?: string;
  timestamp?: number;
}

// Define TypeScript interface for the QuantumWebGLController
export interface QuantumWebGLControllerInterface {
  // Properties
  container: HTMLElement;
  width: number;
  height: number;
  particleCount: number;
  traumaFactor: number;
  glitchIntensity: number;
  isRunning: boolean;

  // Methods
  initialize(container: HTMLElement, options?: QuantumWebGLOptions): Promise<void>;
  start(): void;
  stop(): void;
  resize(width: number, height: number): void;
  setTraumaFactor(value: number): void;
  setGlitchIntensity(value: number): void;
  applyMutation(mutationProfile: MutationProfile): void;
  dispose(): void;
  recover(options?: RecoveryOptions): Promise<boolean>;
  getPerformanceMetrics(): Record<string, number>;
}

// Extended QuantumWebGLController with error handling, configuration, and performance monitoring
/**
 * Extended implementation of the QuantumWebGLController that provides:
 * - Error handling and recovery mechanisms
 * - Configuration management
 * - Performance monitoring and optimization
 * - Event system integration via NeuralBus
 *
 * This class wraps the original JS implementation and adds TypeScript type safety.
 */
export class QuantumWebGLController implements QuantumWebGLControllerInterface {
  // Original controller instance
  private controller: any;

  // Core dependencies
  private errorHandler: ErrorHandler;
  private configManager: ConfigManager;
  private performanceMonitor: PerformanceMonitor;
  private neuralBusNonce: string | null = null;

  // Properties
  private _isInitialized = false;
  private _isRunning = false;
  private _container: HTMLElement | null = null;
  private _width = 0;
  private _height = 0;
  private _particleCount = 2000;
  private _traumaFactor = 0;
  private _glitchIntensity = 0;
  private _renderMode = 'standard';
  private _renderStartTime = 0;
  private _frameTimes: number[] = [];
  private _frameTimesIndex = 0;
  private _frameTimesLength = 60;
  private _configObservers: Array<() => void> = [];

  /**
   * Creates a new QuantumWebGLController instance.
   * Initializes error handling, configuration, and performance monitoring systems.
   */
  constructor() {
    // Set up error handler
    this.errorHandler = new ErrorHandler({
      componentName: 'quantum-webgl',
      recoveryEnabled: true,
    });

    // Add recovery strategies
    this.registerRecoveryStrategies();

    // Set up config manager
    this.configManager = new ConfigManager();

    // Register configuration schema
    this.registerConfigurationSchema();

    // Set up performance monitor
    this.performanceMonitor = new PerformanceMonitor();

    // Create original controller instance
    this.controller = new QuantumWebGLJS.QuantumWebGLController();
  }

  /**
   * Initialize the quantum WebGL controller
   * @param container - DOM element to contain the renderer
   * @param options - Initialization options
   */
  async initialize(container: HTMLElement, options: QuantumWebGLOptions = {}): Promise<void> {
    try {
      this._container = container;

      // Initialize configuration
      this.configManager.setMultiple(
        ConfigDomain.VISUALIZATION,
        {
          width: options.width || container.clientWidth,
          height: options.height || container.clientHeight,
          particleCount: options.particleCount || 2000,
          traumaFactor: options.traumaFactor || 0,
          glitchIntensity: options.glitchIntensity || 0,
          renderMode: options.renderMode || 'standard',
          renderQuality: 1.0,
          shadowQuality: 'high',
          enableBloom: true,
          enableAberration: true,
          enableFilm: true,
          enableGlitch: true,
        },
        ConfigPriority.DEFAULT
      );

      // Initialize dimensions
      this._width = this.configManager.get(
        ConfigDomain.VISUALIZATION,
        'width',
        container.clientWidth
      );
      this._height = this.configManager.get(
        ConfigDomain.VISUALIZATION,
        'height',
        container.clientHeight
      );

      // Set up error handling
      if (options.errorHandling) {
        this.errorHandler.updateConfig({
          recoveryEnabled: options.errorHandling.recoveryEnabled !== false,
          errorHistoryLimit: options.errorHandling.errorHistoryLimit || 100,
        });
      }

      // Set up performance monitoring
      if (options.performanceMonitoring) {
        this.performanceMonitor.updateConfig({
          autoOptimize: options.performanceMonitoring.autoOptimize !== false,
          notifyThreshold:
            options.performanceMonitoring.notifyThreshold || OptimizationLevel.MEDIUM,
        });

        if (options.performanceMonitoring.enabled !== false) {
          this.performanceMonitor.start();
        }
      }

      // Connect to Neural Bus
      this.connectToNeuralBus();

      // Listen for config changes
      this.observeConfigChanges();

      // Start measuring initialization
      const initTransaction = this.performanceMonitor.startTransaction(
        'quantum-webgl-initialization'
      );

      // Initialize the original controller
      await this.controller.initialize(container, {
        width: this._width,
        height: this._height,
        particleCount: this.configManager.get(ConfigDomain.VISUALIZATION, 'particleCount', 2000),
        traumaFactor: this.configManager.get(ConfigDomain.VISUALIZATION, 'traumaFactor', 0),
        glitchIntensity: this.configManager.get(ConfigDomain.VISUALIZATION, 'glitchIntensity', 0),
        renderMode: this.configManager.get(ConfigDomain.VISUALIZATION, 'renderMode', 'standard'),
      });

      // End initialization transaction
      initTransaction();

      // Set up render frame hook
      this.setupFrameHook();

      this._isInitialized = true;
      this.errorHandler.logInfo('Quantum WebGL initialized successfully');

      // Publish initialization event
      if (typeof NeuralBus !== 'undefined') {
        NeuralBus.publish('quantum:visualization:initialized', {
          timestamp: Date.now(),
          width: this._width,
          height: this._height,
          traumaFactor: this._traumaFactor,
          glitchIntensity: this._glitchIntensity,
        });
      }
    } catch (error) {
      this.errorHandler.logError('Failed to initialize Quantum WebGL', {
        category: ErrorCategory.VISUALIZATION,
        code: 'QUANTUM_WEBGL_INIT_FAILED',
        error,
      });

      // Attempt recovery
      await this.recover({
        resetRendering: true,
        recreateContext: true,
      });

      throw error;
    }
  }

  /**
   * Start rendering
   */
  start(): void {
    if (!this._isInitialized) {
      this.errorHandler.logWarning('Cannot start before initialization', {
        category: ErrorCategory.VISUALIZATION,
        code: 'QUANTUM_WEBGL_NOT_INITIALIZED',
      });
      return;
    }

    try {
      this.controller.start();
      this._isRunning = true;
      this._renderStartTime = performance.now();

      this.errorHandler.logInfo('Quantum WebGL started');

      // Publish start event
      if (typeof NeuralBus !== 'undefined') {
        NeuralBus.publish('quantum:visualization:started', {
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      this.errorHandler.logError('Failed to start Quantum WebGL', {
        category: ErrorCategory.VISUALIZATION,
        code: 'QUANTUM_WEBGL_START_FAILED',
        error,
      });

      // Attempt recovery
      this.recover({
        resetRendering: true,
      });
    }
  }

  /**
   * Stop rendering
   */
  stop(): void {
    if (!this._isRunning) return;

    try {
      this.controller.stop();
      this._isRunning = false;

      this.errorHandler.logInfo('Quantum WebGL stopped');

      // Publish stop event
      if (typeof NeuralBus !== 'undefined') {
        NeuralBus.publish('quantum:visualization:stopped', {
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      this.errorHandler.logError('Failed to stop Quantum WebGL', {
        category: ErrorCategory.VISUALIZATION,
        code: 'QUANTUM_WEBGL_STOP_FAILED',
        error,
      });
    }
  }

  /**
   * Resize the renderer
   * @param width - New width
   * @param height - New height
   */
  resize(width: number, height: number): void {
    try {
      this._width = width;
      this._height = height;

      this.configManager.setMultiple(
        ConfigDomain.VISUALIZATION,
        {
          width,
          height,
        },
        ConfigPriority.OVERRIDE
      );

      this.controller.resize(width, height);

      this.errorHandler.logDebug(`Resized to ${width}x${height}`, {
        category: ErrorCategory.VISUALIZATION,
      });
    } catch (error) {
      this.errorHandler.logError('Failed to resize Quantum WebGL', {
        category: ErrorCategory.VISUALIZATION,
        code: 'QUANTUM_WEBGL_RESIZE_FAILED',
        error,
        width,
        height,
      });

      // Attempt recovery
      this.recover({
        resetRendering: true,
      });
    }
  }

  /**
   * Set trauma factor
   * @param value - Trauma factor value (0-1)
   */
  setTraumaFactor(value: number): void {
    try {
      this._traumaFactor = Math.max(0, Math.min(1, value));

      this.configManager.set(
        ConfigDomain.VISUALIZATION,
        'traumaFactor',
        this._traumaFactor,
        ConfigPriority.OVERRIDE
      );

      this.controller.setTraumaFactor(this._traumaFactor);
    } catch (error) {
      this.errorHandler.logError('Failed to set trauma factor', {
        category: ErrorCategory.VISUALIZATION,
        code: 'QUANTUM_WEBGL_SET_TRAUMA_FAILED',
        error,
        value,
      });
    }
  }

  /**
   * Set glitch intensity
   * @param value - Glitch intensity value (0-1)
   */
  setGlitchIntensity(value: number): void {
    try {
      this._glitchIntensity = Math.max(0, Math.min(1, value));

      this.configManager.set(
        ConfigDomain.VISUALIZATION,
        'glitchIntensity',
        this._glitchIntensity,
        ConfigPriority.OVERRIDE
      );

      this.controller.setGlitchIntensity(this._glitchIntensity);
    } catch (error) {
      this.errorHandler.logError('Failed to set glitch intensity', {
        category: ErrorCategory.VISUALIZATION,
        code: 'QUANTUM_WEBGL_SET_GLITCH_FAILED',
        error,
        value,
      });
    }
  }

  /**
   * Apply mutation profile to visualization
   * @param mutationProfile - Mutation profile to apply
   */
  applyMutation(mutationProfile: MutationProfile): void {
    try {
      // Track mutation application time
      const measureMutation = this.performanceMonitor.startMeasure(
        'quantum-webgl',
        'apply-mutation'
      );

      this.controller.applyMutation(mutationProfile);

      const duration = measureMutation();

      // Check if mutation was slow and we should apply performance optimizations
      if (duration > 20 && this._isRunning) {
        // Request performance optimization if mutations are slow
        this.requestPerformanceOptimization();
      }

      this.errorHandler.logDebug('Applied mutation profile', {
        category: ErrorCategory.VISUALIZATION,
        code: 'QUANTUM_WEBGL_MUTATION_APPLIED',
        mutationProfile,
        duration,
      });

      // Publish mutation event
      if (typeof NeuralBus !== 'undefined') {
        NeuralBus.publish('quantum:visualization:mutation', {
          timestamp: Date.now(),
          profile: {
            intensity: mutationProfile.intensity,
            pattern: mutationProfile.pattern,
          },
          duration,
        });
      }
    } catch (error) {
      this.errorHandler.logError('Failed to apply mutation profile', {
        category: ErrorCategory.VISUALIZATION,
        code: 'QUANTUM_WEBGL_MUTATION_FAILED',
        error,
        mutationProfile,
      });

      // Attempt recovery
      this.recover({
        resetRendering: true,
        clearParticles: true,
      });
    }
  }

  /**
   * Dispose of resources
   */
  dispose(): void {
    try {
      // Stop rendering
      if (this._isRunning) {
        this.stop();
      }

      // Remove config observers
      this._configObservers.forEach((removeObserver) => removeObserver());
      this._configObservers = [];

      // Disconnect from NeuralBus
      this.disconnectFromNeuralBus();

      // Dispose controller
      this.controller.dispose();

      this._isInitialized = false;
      this._container = null;

      this.errorHandler.logInfo('Quantum WebGL disposed');
    } catch (error) {
      this.errorHandler.logError('Failed to dispose Quantum WebGL', {
        category: ErrorCategory.VISUALIZATION,
        code: 'QUANTUM_WEBGL_DISPOSE_FAILED',
        error,
      });
    }
  }

  /**
   * Recover from error
   * @param options - Recovery options
   * @returns Whether recovery was successful
   */
  async recover(options: RecoveryOptions = {}): Promise<boolean> {
    try {
      this.errorHandler.logWarning('Attempting to recover Quantum WebGL', {
        category: ErrorCategory.VISUALIZATION,
        code: 'QUANTUM_WEBGL_RECOVERY_STARTED',
        options,
      });

      // Stop rendering
      const wasRunning = this._isRunning;
      if (this._isRunning) {
        this.stop();
      }

      // Reset rendering
      if (options.resetRendering) {
        try {
          this.controller.resetRenderer();
        } catch (e) {
          // Continue with recovery even if this step fails
          this.errorHandler.logWarning('Failed to reset renderer during recovery', {
            category: ErrorCategory.VISUALIZATION,
            code: 'QUANTUM_WEBGL_RESET_FAILED',
            error: e,
          });
        }
      }

      // Recreate WebGL context
      if (options.recreateContext && this._container) {
        try {
          await this.controller.recreateContext(this._container);
        } catch (e) {
          this.errorHandler.logError('Failed to recreate WebGL context during recovery', {
            category: ErrorCategory.VISUALIZATION,
            code: 'QUANTUM_WEBGL_CONTEXT_RECREATION_FAILED',
            error: e,
          });
          return false;
        }
      }

      // Reinitialize shaders
      if (options.reinitializeShaders) {
        try {
          this.controller.reinitializeShaders();
        } catch (e) {
          this.errorHandler.logError('Failed to reinitialize shaders during recovery', {
            category: ErrorCategory.VISUALIZATION,
            code: 'QUANTUM_WEBGL_SHADER_REINITIALIZATION_FAILED',
            error: e,
          });
          return false;
        }
      }

      // Clear particles
      if (options.clearParticles) {
        try {
          this.controller.clearParticles();
        } catch (e) {
          // Continue with recovery even if this step fails
          this.errorHandler.logWarning('Failed to clear particles during recovery', {
            category: ErrorCategory.VISUALIZATION,
            code: 'QUANTUM_WEBGL_CLEAR_PARTICLES_FAILED',
            error: e,
          });
        }
      }

      // Restart if it was running
      if (wasRunning) {
        this.start();
      }

      this.errorHandler.logInfo('Quantum WebGL recovered successfully', {
        category: ErrorCategory.VISUALIZATION,
        code: 'QUANTUM_WEBGL_RECOVERY_SUCCEEDED',
      });

      // Publish recovery event
      if (typeof NeuralBus !== 'undefined') {
        NeuralBus.publish('quantum:visualization:recovered', {
          timestamp: Date.now(),
          options,
        });
      }

      return true;
    } catch (error) {
      this.errorHandler.logError('Failed to recover Quantum WebGL', {
        category: ErrorCategory.VISUALIZATION,
        code: 'QUANTUM_WEBGL_RECOVERY_FAILED',
        error,
      });
      return false;
    }
  }

  /**
   * Get performance metrics for the visualization
   * @returns Performance metrics
   */
  getPerformanceMetrics(): Record<string, number> {
    try {
      // Get core metrics from performance monitor
      const coreMetrics = this.performanceMonitor.getMetrics();

      // Get WebGL-specific metrics from controller
      const webglMetrics = this.controller.getPerformanceMetrics
        ? this.controller.getPerformanceMetrics()
        : {};

      // Calculate average frame time
      let avgFrameTime = 0;
      let frameCount = 0;
      for (let i = 0; i < this._frameTimesLength; i++) {
        if (this._frameTimes[i]) {
          avgFrameTime += this._frameTimes[i];
          frameCount++;
        }
      }
      avgFrameTime = frameCount > 0 ? avgFrameTime / frameCount : 0;

      return {
        ...coreMetrics,
        ...webglMetrics,
        averageFrameTime: avgFrameTime,
        totalRenderTime: performance.now() - this._renderStartTime,
      };
    } catch (error) {
      this.errorHandler.logError('Failed to get performance metrics', {
        category: ErrorCategory.PERFORMANCE,
        code: 'QUANTUM_WEBGL_METRICS_FAILED',
        error,
      });
      return {};
    }
  }

  /**
   * Connect to the NeuralBus event system
   * @private
   */
  private connectToNeuralBus(): void {
    try {
      if (typeof NeuralBus !== 'undefined') {
        const registration = NeuralBus.register('quantum-webgl', {
          version: '1.0.0',
          capabilities: {
            visualization: true,
            particleSystem: true,
            traumaVisualization: true,
            glitchEffects: true,
          },
        });

        this.neuralBusNonce = registration.nonce;

        // Subscribe to relevant events
        NeuralBus.subscribe('trauma:activated', this.handleTraumaActivation.bind(this));
        NeuralBus.subscribe('quantum:mutation', this.handleQuantumMutation.bind(this));
        NeuralBus.subscribe('coherence:state:saved', this.handleCoherenceState.bind(this));
        NeuralBus.subscribe(
          'performance:optimize:request',
          this.handleOptimizationRequest.bind(this)
        );

        this.errorHandler.logInfo('Connected to Neural Bus');
      }
    } catch (error) {
      this.errorHandler.logError('Failed to connect to Neural Bus', {
        category: ErrorCategory.NEURAL_BUS,
        code: 'QUANTUM_WEBGL_NEURALBUS_CONNECT_FAILED',
        error,
      });
    }
  }

  /**
   * Disconnect from the NeuralBus event system
   * @private
   */
  private disconnectFromNeuralBus(): void {
    try {
      if (typeof NeuralBus !== 'undefined' && this.neuralBusNonce) {
        NeuralBus.deregister('quantum-webgl', this.neuralBusNonce);
        this.neuralBusNonce = null;

        this.errorHandler.logInfo('Disconnected from Neural Bus');
      }
    } catch (error) {
      this.errorHandler.logError('Failed to disconnect from Neural Bus', {
        category: ErrorCategory.NEURAL_BUS,
        code: 'QUANTUM_WEBGL_NEURALBUS_DISCONNECT_FAILED',
        error,
      });
    }
  }

  /**
   * Handle trauma activation events from NeuralBus
   * @private
   * @param data - Trauma activation data
   */
  private handleTraumaActivation(data: TraumaActivationData): void {
    if (!data || !data.intensity) return;

    try {
      // Set trauma factor based on intensity
      this.setTraumaFactor(data.intensity);

      this.errorHandler.logDebug('Handled trauma activation', {
        category: ErrorCategory.TRAUMA,
        code: 'QUANTUM_WEBGL_TRAUMA_HANDLED',
        intensity: data.intensity,
        traumaType: data.type,
      });
    } catch (error) {
      this.errorHandler.logError('Failed to handle trauma activation', {
        category: ErrorCategory.TRAUMA,
        code: 'QUANTUM_WEBGL_TRAUMA_HANDLER_FAILED',
        error,
      });
    }
  }

  /**
   * Handle quantum mutation events from NeuralBus
   * @private
   * @param data - Mutation data
   */
  private handleQuantumMutation(data: QuantumMutationData): void {
    if (!data || !data.profile) return;

    try {
      // Apply mutation profile
      this.applyMutation(data.profile);

      this.errorHandler.logDebug('Handled quantum mutation', {
        category: ErrorCategory.QUANTUM,
        code: 'QUANTUM_WEBGL_MUTATION_HANDLED',
        profile: data.profile,
      });
    } catch (error) {
      this.errorHandler.logError('Failed to handle quantum mutation', {
        category: ErrorCategory.QUANTUM,
        code: 'QUANTUM_WEBGL_MUTATION_HANDLER_FAILED',
        error,
      });
    }
  }

  /**
   * Handle coherence state events from NeuralBus
   * @private
   * @param data - Coherence state data
   */
  private handleCoherenceState(data: CoherenceStateData): void {
    if (!data) return;

    try {
      // Set glitch intensity based on coherence level
      if (data.coherenceLevel !== undefined) {
        // Invert coherence level for glitch intensity (lower coherence = more glitches)
        const glitchIntensity = Math.max(0, 1 - data.coherenceLevel);
        this.setGlitchIntensity(glitchIntensity);
      }

      this.errorHandler.logDebug('Handled coherence state', {
        category: ErrorCategory.COHERENCE,
        code: 'QUANTUM_WEBGL_COHERENCE_HANDLED',
        coherenceLevel: data.coherenceLevel,
      });
    } catch (error) {
      this.errorHandler.logError('Failed to handle coherence state', {
        category: ErrorCategory.COHERENCE,
        code: 'QUANTUM_WEBGL_COHERENCE_HANDLER_FAILED',
        error,
      });
    }
  }

  /**
   * Handle optimization request events from NeuralBus
   * @private
   * @param data - Optimization request data
   */
  private handleOptimizationRequest(data: OptimizationRequestData): void {
    if (!data) return;

    try {
      // Apply visualization-specific optimizations
      if (data.target === 'visualization' || !data.target) {
        // Adjust particle count based on optimization level
        if (data.level !== undefined && data.level > 0) {
          // Progressively reduce particle count with higher optimization levels
          const reductionFactor = 1 - data.level * 0.2;
          const originalParticleCount = this.configManager.get(
            ConfigDomain.VISUALIZATION,
            'particleCount',
            2000
          );

          const newParticleCount = Math.max(
            100,
            Math.floor(originalParticleCount * reductionFactor)
          );

          // Update particle count
          this.configManager.set(
            ConfigDomain.VISUALIZATION,
            'particleCount',
            newParticleCount,
            ConfigPriority.PERFORMANCE
          );

          this.controller.setParticleCount(newParticleCount);
        }

        this.errorHandler.logInfo('Applied visualization optimizations', {
          category: ErrorCategory.PERFORMANCE,
          code: 'QUANTUM_WEBGL_OPTIMIZATIONS_APPLIED',
          level: data.level,
        });
      }
    } catch (error) {
      this.errorHandler.logError('Failed to handle optimization request', {
        category: ErrorCategory.PERFORMANCE,
        code: 'QUANTUM_WEBGL_OPTIMIZATION_HANDLER_FAILED',
        error,
      });
    }
  }

  /**
   * Register recovery strategies with the error handler
   * @private
   */
  private registerRecoveryStrategies(): void {
    // Register recovery strategy for renderer initialization failure
    this.errorHandler.addRecoveryStrategy('QUANTUM_WEBGL_INIT_FAILED', () => {
      return this.recover({
        resetRendering: true,
        recreateContext: true,
      });
    });

    // Register recovery strategy for renderer start failure
    this.errorHandler.addRecoveryStrategy('QUANTUM_WEBGL_START_FAILED', () => {
      return this.recover({
        resetRendering: true,
      });
    });

    // Register recovery strategy for mutation application failure
    this.errorHandler.addRecoveryStrategy('QUANTUM_WEBGL_MUTATION_FAILED', () => {
      return this.recover({
        resetRendering: true,
        clearParticles: true,
      });
    });

    // Register recovery strategy for WebGL context loss
    this.errorHandler.addRecoveryStrategy('WEBGL_CONTEXT_LOST', (_error: any) => {
      if (this._container) {
        return this.recover({
          resetRendering: true,
          recreateContext: true,
          reinitializeShaders: true,
        });
      }
      return false;
    });
  }

  /**
   * Register configuration schema
   * @private
   */
  private registerConfigurationSchema(): void {
    this.configManager.registerSchema(
      ConfigDomain.VISUALIZATION,
      {
        type: 'object',
        properties: {
          width: { type: 'number', minimum: 1 },
          height: { type: 'number', minimum: 1 },
          particleCount: { type: 'number', minimum: 0 },
          traumaFactor: { type: 'number', minimum: 0, maximum: 1 },
          glitchIntensity: { type: 'number', minimum: 0, maximum: 1 },
          renderMode: { type: 'string', enum: ['standard', 'high-fidelity', 'performance'] },
          renderQuality: { type: 'number', minimum: 0, maximum: 1 },
          shadowQuality: { type: 'string', enum: ['off', 'low', 'medium', 'high'] },
          enableBloom: { type: 'boolean' },
          enableAberration: { type: 'boolean' },
          enableFilm: { type: 'boolean' },
          enableGlitch: { type: 'boolean' },
        },
        required: ['width', 'height'],
      },
      {
        width: 800,
        height: 600,
        particleCount: 2000,
        traumaFactor: 0,
        glitchIntensity: 0,
        renderMode: 'standard',
        renderQuality: 1.0,
        shadowQuality: 'high',
        enableBloom: true,
        enableAberration: true,
        enableFilm: true,
        enableGlitch: true,
      }
    );
  }

  /**
   * Observe configuration changes
   * @private
   */
  private observeConfigChanges(): void {
    // Observe particle count
    const removeParticleObserver = this.configManager.observe(
      ConfigDomain.VISUALIZATION,
      'particleCount',
      (value) => {
        if (this._isInitialized && value !== this._particleCount) {
          this._particleCount = value;
          if (this.controller.setParticleCount) {
            this.controller.setParticleCount(value);
          }
        }
      }
    );
    this._configObservers.push(removeParticleObserver);

    // Observe render quality
    const removeQualityObserver = this.configManager.observe(
      ConfigDomain.VISUALIZATION,
      'renderQuality',
      (value) => {
        if (this._isInitialized && this.controller.setRenderQuality) {
          this.controller.setRenderQuality(value);
        }
      }
    );
    this._configObservers.push(removeQualityObserver);

    // Observe shadow quality
    const removeShadowObserver = this.configManager.observe(
      ConfigDomain.VISUALIZATION,
      'shadowQuality',
      (value) => {
        if (this._isInitialized && this.controller.setShadowQuality) {
          this.controller.setShadowQuality(value);
        }
      }
    );
    this._configObservers.push(removeShadowObserver);

    // Observe post-processing effects
    const effectTypes = ['Bloom', 'Aberration', 'Film', 'Glitch'];
    effectTypes.forEach((effect) => {
      const removeEffectObserver = this.configManager.observe(
        ConfigDomain.VISUALIZATION,
        `enable${effect}`,
        (value) => {
          if (this._isInitialized && this.controller[`set${effect}Enabled`]) {
            this.controller[`set${effect}Enabled`](value);
          }
        }
      );
      this._configObservers.push(removeEffectObserver);
    });
  }

  /**
   * Set up frame hook to track render times
   * @private
   */
  private setupFrameHook(): void {
    // Initialize frame times array
    this._frameTimes = new Array(this._frameTimesLength).fill(0);
    this._frameTimesIndex = 0;

    if (this.controller.onBeforeRender) {
      const originalBeforeRender = this.controller.onBeforeRender;
      let lastFrameTime = performance.now();

      this.controller.onBeforeRender = () => {
        const now = performance.now();
        const frameTime = now - lastFrameTime;
        lastFrameTime = now;

        // Store frame time in circular buffer
        this._frameTimes[this._frameTimesIndex] = frameTime;
        this._frameTimesIndex = (this._frameTimesIndex + 1) % this._frameTimesLength;

        // Check if frame rate is low and should trigger optimization
        if (frameTime > 33) {
          // Less than 30 FPS
          this.requestPerformanceOptimization();
        }

        // Call original handler
        if (originalBeforeRender) {
          originalBeforeRender();
        }
      };
    }
  }

  /**
   * Request performance optimization
   * @private
   */
  private requestPerformanceOptimization(): void {
    if (typeof this.performanceMonitor !== 'undefined') {
      this.performanceMonitor.applyOptimizations(OptimizationLevel.LOW);
    }
  }

  // Getters to satisfy the interface
  /**
   *
   */
  get container(): HTMLElement {
    return this._container as HTMLElement;
  }

  /**
   *
   */
  get width(): number {
    return this._width;
  }

  /**
   *
   */
  get height(): number {
    return this._height;
  }

  /**
   *
   */
  get particleCount(): number {
    return this._particleCount;
  }

  /**
   *
   */
  get traumaFactor(): number {
    return this._traumaFactor;
  }

  /**
   *
   */
  get glitchIntensity(): number {
    return this._glitchIntensity;
  }

  /**
   *
   */
  get isRunning(): boolean {
    return this._isRunning;
  }

  // Static methods for singleton access
  static #instance: QuantumWebGLController | null = null;

  /**
   *
   */
  static getInstance(): QuantumWebGLController {
    if (!QuantumWebGLController.#instance) {
      QuantumWebGLController.#instance = new QuantumWebGLController();
    }
    return QuantumWebGLController.#instance;
  }
}

// Export the JavaScript component with TypeScript types
// Keep the original export for backwards compatibility
export { QuantumWebGLJS };

