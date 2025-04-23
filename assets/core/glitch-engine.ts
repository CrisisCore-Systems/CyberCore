/**
 * VoidBloom Glitch Engine
 * Trauma-responsive visual glitch effects system
 */

export interface GlitchTarget {
  element: HTMLElement;
  config: GlitchConfig;
  state: GlitchState;
}

export interface GlitchConfig {
  intensity: number;
  traumaResponsive?: boolean;
  pulseInterval?: number;
  traumaModifier?: number;
  autoInit?: boolean;
  effectTypes?: GlitchEffectType[];
  memoryPhaseResponsive?: boolean;
}

export interface GlitchState {
  active: boolean;
  intensity: number;
  lastPulse: number;
  pulseTimeout?: number;
  effects: {
    [key in GlitchEffectType]?: any;
  };
}

export type GlitchEffectType =
  | 'displacement'
  | 'chromatic'
  | 'scanlines'
  | 'noise'
  | 'flicker'
  | 'corruption';

export interface PulseOptions {
  intensity?: number;
  duration?: number;
  effectTypes?: GlitchEffectType[];
}

export class GlitchEngine {
  private static instance: GlitchEngine;
  private targets: Map<HTMLElement, GlitchTarget> = new Map();
  private traumaLevel: number = 0;
  private memoryPhase: string = 'cyber-lotus';
  private animationFrameId: number | null = null;
  private styleSheet: CSSStyleSheet | null = null;
  private initialized: boolean = false;

  private constructor() {
    this.initializeStyleSheet();
    this.connectToNeuralBus();
    this.startRenderLoop();
  }

  /**
   * Get the Glitch Engine instance (singleton)
   */
  public static getInstance(): GlitchEngine {
    if (!GlitchEngine.instance) {
      GlitchEngine.instance = new GlitchEngine();
    }
    return GlitchEngine.instance;
  }

  /**
   * Initialize the style sheet for glitch effects
   */
  private initializeStyleSheet(): void {
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
      }

      .glitch-displacement::before {
        color: #0ee7ff;
      }

      .glitch-displacement::after {
        color: #d721b8;
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
    this.initialized = true;
  }

  /**
   * Connect to the Neural Bus for trauma responsiveness
   */
  private connectToNeuralBus(): void {
    if (typeof window !== 'undefined' && window.NeuralBus) {
      // Register component
      window.NeuralBus.register('glitch-engine', {
        version: '1.0.0',
        traumaResponse: true,
        capabilities: {
          visualEffects: true,
          traumaVisualization: true,
        },
      });

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
    }
  }

  /**
   * Start the render loop for animated effects
   */
  private startRenderLoop(): void {
    const renderLoop = () => {
      this.updateEffects();
      this.animationFrameId = requestAnimationFrame(renderLoop);
    };

    this.animationFrameId = requestAnimationFrame(renderLoop);
  }

  /**
   * Stop the render loop
   */
  public stopRenderLoop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Update all active glitch effects
   */
  private updateEffects(): void {
    const now = Date.now();

    for (const target of this.targets.values()) {
      if (!target.state.active) continue;

      // Check if we should pulse based on interval
      if (
        target.config.pulseInterval &&
        target.state.lastPulse + target.config.pulseInterval < now
      ) {
        this.pulseTarget(target, { duration: 500 });
        target.state.lastPulse = now;
      }

      // Apply displacement effect if active
      if (
        target.state.effects.displacement &&
        target.element.classList.contains('glitch-displacement')
      ) {
        const effect = target.state.effects.displacement;

        // Calculate transforms based on intensity and randomness
        const intensityX = Math.random() * 8 * target.state.intensity;
        const intensityY = Math.random() * 3 * target.state.intensity;

        // Apply to before/after elements via CSS variables
        target.element.style.setProperty('--glitch-before-x', `${-intensityX}px`);
        target.element.style.setProperty('--glitch-before-y', `${-intensityY}px`);
        target.element.style.setProperty('--glitch-after-x', `${intensityX}px`);
        target.element.style.setProperty('--glitch-after-y', `${intensityY}px`);
      }

      // Update other dynamic effects here
    }
  }

  /**
   * Set the global trauma level
   * @param level Trauma level (0-10)
   */
  public setTraumaLevel(level: number): void {
    this.traumaLevel = Math.max(0, Math.min(10, level));

    // Update all trauma-responsive targets
    for (const target of this.targets.values()) {
      if (target.config.traumaResponsive) {
        const traumaModifier = target.config.traumaModifier || 0.1;
        target.state.intensity = target.config.intensity + this.traumaLevel * traumaModifier;

        // Automatically activate targets at high trauma levels
        if (this.traumaLevel >= 7 && !target.state.active) {
          this.activateTarget(target);
        } else if (this.traumaLevel <= 2 && target.state.active) {
          this.deactivateTarget(target);
        }
      }
    }
  }

  /**
   * Set the global memory phase
   * @param phase Memory phase
   */
  public setMemoryPhase(phase: string): void {
    this.memoryPhase = phase;

    // Update phase-responsive targets
    for (const target of this.targets.values()) {
      if (target.config.memoryPhaseResponsive) {
        // Apply phase-specific styles via class name
        const phaseClasses = [
          'memory-phase-cyber-lotus',
          'memory-phase-alien-flora',
          'memory-phase-rolling-virus',
          'memory-phase-trauma-core',
        ];

        phaseClasses.forEach((cls) => {
          target.element.classList.remove(cls);
        });

        target.element.classList.add(`memory-phase-${this.memoryPhase}`);
      }
    }
  }

  /**
   * Add a target element for glitch effects
   * @param element Target DOM element
   * @param config Glitch configuration
   */
  public addTarget(element: HTMLElement, config: Partial<GlitchConfig> = {}): void {
    if (!this.initialized || this.targets.has(element)) {
      return;
    }

    // Default configuration
    const defaultConfig: GlitchConfig = {
      intensity: 0.5,
      traumaResponsive: true,
      pulseInterval: 0, // 0 = no automatic pulsing
      traumaModifier: 0.1,
      autoInit: true,
      effectTypes: ['displacement', 'scanlines', 'noise'],
      memoryPhaseResponsive: true,
    };

    const finalConfig: GlitchConfig = {
      ...defaultConfig,
      ...config,
    };

    // Prepare element
    element.classList.add('glitch-container');

    // Apply memory phase if responsive
    if (finalConfig.memoryPhaseResponsive) {
      element.classList.add(`memory-phase-${this.memoryPhase}`);
    }

    // Apply trauma responsiveness
    let intensity = finalConfig.intensity;
    if (finalConfig.traumaResponsive) {
      intensity += this.traumaLevel * (finalConfig.traumaModifier || 0.1);
    }

    // Create target state
    const target: GlitchTarget = {
      element,
      config: finalConfig,
      state: {
        active: false,
        intensity,
        lastPulse: 0,
        effects: {},
      },
    };

    // Initialize effects state
    if (finalConfig.effectTypes?.includes('displacement')) {
      // Save original text content for displacement effect
      element.dataset.text = element.textContent || '';
      target.state.effects.displacement = { active: false };
    }

    // Register target
    this.targets.set(element, target);

    // Auto-initialize if configured
    if (finalConfig.autoInit) {
      this.activateTarget(target);
    }
  }

  /**
   * Remove a target element
   * @param element Target DOM element
   */
  public removeTarget(element: HTMLElement): void {
    const target = this.targets.get(element);

    if (target) {
      // Clean up
      this.deactivateTarget(target);
      element.classList.remove('glitch-container');
      element.classList.remove('glitch-active');

      // Remove memory phase classes
      const phaseClasses = [
        'memory-phase-cyber-lotus',
        'memory-phase-alien-flora',
        'memory-phase-rolling-virus',
        'memory-phase-trauma-core',
      ];
      phaseClasses.forEach((cls) => {
        element.classList.remove(cls);
      });

      // Remove data attributes
      delete element.dataset.text;

      // Remove target from registry
      this.targets.delete(element);
    }
  }

  /**
   * Activate a target's glitch effects
   * @param target Target to activate
   */
  private activateTarget(target: GlitchTarget): void {
    if (target.state.active) return;

    target.state.active = true;
    target.element.classList.add('glitch-active');

    // Activate configured effect types
    if (target.config.effectTypes?.includes('displacement')) {
      target.element.classList.add('glitch-displacement');
      target.state.effects.displacement = { active: true };
    }

    if (target.config.effectTypes?.includes('scanlines')) {
      target.element.classList.add('glitch-scanlines');
      target.state.effects.scanlines = { active: true };
    }

    if (target.config.effectTypes?.includes('noise')) {
      target.element.classList.add('glitch-noise');
      target.state.effects.noise = { active: true };
    }

    if (target.config.effectTypes?.includes('flicker')) {
      target.element.classList.add('glitch-flicker');
      target.state.effects.flicker = { active: true };
    }
  }

  /**
   * Deactivate a target's glitch effects
   * @param target Target to deactivate
   */
  private deactivateTarget(target: GlitchTarget): void {
    if (!target.state.active) return;

    target.state.active = false;
    target.element.classList.remove('glitch-active');

    // Deactivate all effect types
    target.element.classList.remove('glitch-displacement');
    target.element.classList.remove('glitch-scanlines');
    target.element.classList.remove('glitch-noise');
    target.element.classList.remove('glitch-flicker');

    // Clear any pulse timeouts
    if (target.state.pulseTimeout) {
      clearTimeout(target.state.pulseTimeout);
      target.state.pulseTimeout = undefined;
    }

    // Reset effect states
    target.state.effects = {};
  }

  /**
   * Pulse a glitch effect temporarily
   * @param target Target to pulse
   * @param options Pulse options
   */
  private pulseTarget(target: GlitchTarget | HTMLElement, options: PulseOptions = {}): void {
    const glitchTarget = target instanceof HTMLElement ? this.targets.get(target) : target;

    if (!glitchTarget) return;

    // Save original state
    const originalActive = glitchTarget.state.active;
    const originalIntensity = glitchTarget.state.intensity;

    // Apply pulse
    glitchTarget.state.intensity = options.intensity || originalIntensity * 2;

    if (!originalActive) {
      this.activateTarget(glitchTarget);
    }

    // Revert after duration
    const duration = options.duration || 1000;
    if (glitchTarget.state.pulseTimeout) {
      clearTimeout(glitchTarget.state.pulseTimeout);
    }

    glitchTarget.state.pulseTimeout = window.setTimeout(() => {
      glitchTarget.state.intensity = originalIntensity;

      if (!originalActive) {
        this.deactivateTarget(glitchTarget);
      }

      glitchTarget.state.pulseTimeout = undefined;
    }, duration);
  }

  /**
   * Pulse an element with glitch effects
   * @param element Element to pulse
   * @param options Pulse options
   */
  public pulse(element: HTMLElement | PulseOptions, options?: PulseOptions): void {
    // Handle case where first argument is options object (global pulse)
    if (!(element instanceof HTMLElement)) {
      options = element;

      // Pulse all targets
      for (const target of this.targets.values()) {
        this.pulseTarget(target, options);
      }

      return;
    }

    // Handle case where first argument is HTML element
    const target = this.targets.get(element);

    if (target) {
      this.pulseTarget(target, options);
    } else {
      // Auto-add target if it doesn't exist
      this.addTarget(element, {
        intensity: (options?.intensity || 0.5) / 2,
        autoInit: false,
      });

      const newTarget = this.targets.get(element);
      if (newTarget) {
        this.pulseTarget(newTarget, options);
      }
    }
  }
}

// Expose to window
if (typeof window !== 'undefined') {
  window.GlitchEngine = GlitchEngine.getInstance();
}

// Add type to window
declare global {
  interface Window {
    GlitchEngine: GlitchEngine;
  }
}

// Export singleton instance
export default GlitchEngine.getInstance();
