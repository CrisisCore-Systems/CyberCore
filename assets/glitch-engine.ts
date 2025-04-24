/**
 * Enhanced GlitchEffect TypeScript Implementation
 * Provides high-quality visual glitch effects with configurable parameters
 * VERSION: 1.0.0
 */

export interface GlitchEffectOptions {
  intensity?: 'low' | 'medium' | 'high';
  frequency?: 'rare' | 'occasional' | 'frequent';
  duration?: 'short' | 'medium' | 'long';
  textOnly?: boolean;
  onGlitch?: () => void;
  onReset?: () => void;
}

class GlitchEffect {
  private element: HTMLElement;
  private options: GlitchEffectOptions;
  private isActive: boolean = false;
  private originalContent: string;
  private timeouts: number[] = [];
  private wrapper?: HTMLElement;
  private layers?: {
    before: HTMLElement;
    after: HTMLElement;
  };

  private readonly intensityMap = {
    low: { chars: 2, offset: 1, opacity: 0.9 },
    medium: { chars: 4, offset: 2, opacity: 0.8 },
    high: { chars: 7, offset: 3, opacity: 0.7 },
  };

  private readonly frequencyMap = {
    rare: { min: 5000, max: 12000 },
    occasional: { min: 2000, max: 7000 },
    frequent: { min: 800, max: 3000 },
  };

  private readonly durationMap = {
    short: { min: 50, max: 200 },
    medium: { min: 100, max: 400 },
    long: { min: 200, max: 800 },
  };

  private readonly glitchChars = '!<>-_\\|/*@#%&§$+?'.split('');

  constructor(element: HTMLElement, options: GlitchEffectOptions = {}) {
    this.element = element;
    this.options = {
      intensity: options.intensity || 'medium',
      frequency: options.frequency || 'occasional',
      duration: options.duration || 'short',
      textOnly: options.textOnly || false,
      onGlitch: options.onGlitch,
      onReset: options.onReset,
      ...options,
    };

    this.originalContent = this.element.innerHTML;

    this.init();
  }

  /**
   * Initialize the glitch effect
   */
  private init(): void {
    // Create wrapper if not text only
    if (!this.options.textOnly) {
      this.createGlitchLayers();
    }

    // Start the effect cycle
    this.scheduleNextGlitch();
  }

  /**
   * Create the layers needed for visual glitching
   */
  private createGlitchLayers(): void {
    const wrapper = document.createElement('div');
    wrapper.className = 'glitch-effect-wrapper';
    wrapper.style.position = 'relative';

    // Clone the element twice for glitch layers
    const before = this.element.cloneNode(true) as HTMLElement;
    const after = this.element.cloneNode(true) as HTMLElement;

    before.className = 'glitch-layer glitch-layer--before';
    after.className = 'glitch-layer glitch-layer--after';

    // Set styles for pseudo layers
    [before, after].forEach((layer) => {
      layer.style.position = 'absolute';
      layer.style.top = '0';
      layer.style.left = '0';
      layer.style.width = '100%';
      layer.style.height = '100%';
      layer.style.overflow = 'hidden';
      layer.style.pointerEvents = 'none';
      layer.setAttribute('aria-hidden', 'true');
    });

    // Insert into wrapper
    this.element.parentNode?.insertBefore(wrapper, this.element);
    wrapper.appendChild(this.element);
    wrapper.appendChild(before);
    wrapper.appendChild(after);

    this.wrapper = wrapper;
    this.layers = { before, after };
  }

  /**
   * Schedule the next glitch based on frequency settings
   */
  private scheduleNextGlitch(): void {
    const { min, max } =
      this.frequencyMap[this.options.frequency as keyof typeof this.frequencyMap];
    const delay = Math.random() * (max - min) + min;

    const timeout = window.setTimeout(() => {
      this.triggerGlitch();
      this.scheduleNextGlitch();
    }, delay);

    this.timeouts.push(timeout);
  }

  /**
   * Trigger a glitch effect
   */
  private triggerGlitch(): void {
    if (this.isActive) return;
    this.isActive = true;

    // Call onGlitch callback if defined
    if (typeof this.options.onGlitch === 'function') {
      this.options.onGlitch();
    }

    const glitchCount = Math.floor(Math.random() * 3) + 1;
    let currentGlitch = 0;

    const performGlitch = () => {
      const { min, max } = this.durationMap[this.options.duration as keyof typeof this.durationMap];
      const duration = Math.random() * (max - min) + min;

      // Apply text distortion
      if (Math.random() > 0.3) {
        this.distortText();
      }

      // Apply layer distortion if not text only
      if (!this.options.textOnly) {
        this.distortLayers();
      }

      // Schedule end of this glitch phase
      const timeout = window.setTimeout(() => {
        this.resetDistortion();

        currentGlitch++;
        if (currentGlitch < glitchCount) {
          // Small pause between glitches
          const pauseTimeout = window.setTimeout(performGlitch, Math.random() * 100 + 50);
          this.timeouts.push(pauseTimeout);
        } else {
          this.isActive = false;

          // Call onReset callback if defined
          if (typeof this.options.onReset === 'function') {
            this.options.onReset();
          }
        }
      }, duration);

      this.timeouts.push(timeout);
    };

    performGlitch();
  }

  /**
   * Distort text content
   */
  private distortText(): void {
    const text = this.originalContent;
    const intensity = this.intensityMap[this.options.intensity as keyof typeof this.intensityMap];

    // Only distort if we have text content
    if (typeof text !== 'string') return;

    let distortedText = text;

    // Replace random characters with glitch characters
    for (let i = 0; i < intensity.chars; i++) {
      const position = Math.floor(Math.random() * text.length);
      const glitchChar = this.glitchChars[Math.floor(Math.random() * this.glitchChars.length)];

      distortedText =
        distortedText.substring(0, position) + glitchChar + distortedText.substring(position + 1);
    }

    this.element.innerHTML = distortedText;
  }

  /**
   * Distort visual layers
   */
  private distortLayers(): void {
    if (!this.layers) return;

    const intensity = this.intensityMap[this.options.intensity as keyof typeof this.intensityMap];

    // Apply random transform and color filters to layers
    Object.values(this.layers).forEach((layer) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const xOffset = Math.random() * intensity.offset * direction;
      const yOffset = ((Math.random() * intensity.offset) / 2) * direction;
      const filterValue = Math.random() > 0.5 ? 'hue-rotate(90deg)' : 'hue-rotate(-90deg)';

      layer.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
      layer.style.filter = filterValue;
      layer.style.opacity = intensity.opacity.toString();
    });
  }

  /**
   * Reset all distortions
   */
  private resetDistortion(): void {
    // Reset text
    this.element.innerHTML = this.originalContent;

    // Reset layers if not text only
    if (!this.options.textOnly && this.layers) {
      Object.values(this.layers).forEach((layer) => {
        layer.style.transform = 'translate3d(0, 0, 0)';
        layer.style.filter = 'none';
        layer.style.opacity = '1';
      });
    }
  }

  /**
   * Manually trigger a glitch
   * @param customDuration Optional override for glitch duration
   * @returns Promise that resolves when the glitch ends
   */
  public async pulse(customDuration?: number): Promise<void> {
    if (this.isActive) return Promise.reject('Glitch already active');

    return new Promise<void>((resolve) => {
      this.isActive = true;

      // Call onGlitch callback if defined
      if (typeof this.options.onGlitch === 'function') {
        this.options.onGlitch();
      }

      // Apply effects
      this.distortText();
      if (!this.options.textOnly) {
        this.distortLayers();
      }

      // Use custom duration or random from settings
      const duration =
        customDuration ||
        (() => {
          const { min, max } =
            this.durationMap[this.options.duration as keyof typeof this.durationMap];
          return Math.random() * (max - min) + min;
        })();

      // Reset after duration
      const timeout = window.setTimeout(() => {
        this.resetDistortion();
        this.isActive = false;

        // Call onReset callback if defined
        if (typeof this.options.onReset === 'function') {
          this.options.onReset();
        }

        resolve();
      }, duration);

      this.timeouts.push(timeout);
    });
  }

  /**
   * Update effect options
   * @param options New options to apply
   */
  public updateOptions(options: Partial<GlitchEffectOptions>): void {
    this.options = {
      ...this.options,
      ...options,
    };
  }

  /**
   * Stop and clean up the effect
   */
  public destroy(): void {
    this.isActive = false;
    this.timeouts.forEach(window.clearTimeout);
    this.timeouts = [];

    if (!this.options.textOnly && this.wrapper) {
      // Unwrap the element
      const parent = this.wrapper.parentNode;
      if (parent) {
        parent.insertBefore(this.element, this.wrapper);
        parent.removeChild(this.wrapper);
      }
    }

    // Reset content
    this.element.innerHTML = this.originalContent;
  }
}

export default GlitchEffect;
