/**
 * VoidBloom Quantum Effects System
 * Trauma-responsive visual glitch effects for memory encoding
 */

class GlitchEngine {
  constructor() {
    this.targets = new Map();
    this.traumaLevel = 0;
    this.systemPhase = 'trauma-core';
  }

  /**
   * Start the glitch engine
   */
  start() {
    console.log('GlitchEngine started');
  }

  /**
   * Calculate effective trauma based on intensity
   * @param {number} intensity - Intensity level
   * @returns {number} Effective trauma
   */
  calculateEffectiveTrauma(intensity) {
    return Math.min(10, intensity * this.traumaLevel);
  }

  /**
   * Add a target element for glitch effects
   * @param {Element} element - Target DOM element
   * @param {Object} config - Configuration for the target
   */
  addTarget(element, config) {
    this.targets.set(element, {
      intensity: config.intensity || 1.0,
      pulseInterval: config.pulseInterval || 0,
      variationSpeed: config.variationSpeed || 1.0,
      lastGlitchTime: 0,
      effectiveTrauma: this.calculateEffectiveTrauma(config.intensity || 1.0),
      ...config,
    });
  }

  /**
   * Set trauma level
   * @param {number} level - Trauma level (0-10)
   */
  setTraumaLevel(level) {
    this.traumaLevel = Math.max(0, Math.min(10, level));
  }

  /**
   * Apply glitch effect to a target element
   * @param {Element} element - Target DOM element
   * @param {Object} config - Effect configuration
   */
  applyGlitchEffect(element, config) {
    const effectiveTrauma = config.effectiveTrauma;
    const intensity = Math.min(1, effectiveTrauma / 10);

    // Mark element as glitching
    element.setAttribute('data-glitch-active', 'true');

    // Apply different effects based on config
    if (config.effectTypes.includes('transform') && effectiveTrauma > 1) {
      // Apply transform glitch (displacement)
      const translateX = (Math.random() - 0.5) * effectiveTrauma * 3;
      const translateY = (Math.random() - 0.5) * effectiveTrauma * 1.5;
      const skewX = (Math.random() - 0.5) * effectiveTrauma * 1;

      element.style.transform = `translate(${translateX}px, ${translateY}px) skew(${skewX}deg)`;

      // Reset after a short duration
      setTimeout(() => {
        element.style.transform = '';
        element.removeAttribute('data-glitch-active');
      }, 50 + Math.random() * 150);
    }

    if (config.effectTypes.includes('text') && effectiveTrauma > 2) {
      // Apply text shadow glitch
      let shadowColor;

      // Use colors appropriate to the memory phase
      switch (this.systemPhase) {
        case 'cyber-lotus':
          shadowColor = '#0ee7ff';
          break;
        case 'alien-flora':
          shadowColor = '#04ff59';
          break;
        case 'rolling-virus':
          shadowColor = '#ffbb38';
          break;
        case 'trauma-core':
          shadowColor = '#d721b8';
          break;
        default:
          shadowColor = '#d721b8';
      }

      const offsetX = (Math.random() - 0.5) * effectiveTrauma * 2;
      const offsetY = (Math.random() - 0.5) * effectiveTrauma * 1;

      element.style.textShadow = `${offsetX}px ${offsetY}px ${
        effectiveTrauma * 0.5
      }px ${shadowColor}`;

      // Reset after a short duration
      setTimeout(() => {
        element.style.textShadow = '';
      }, 100 + Math.random() * 200);
    }

    if (config.effectTypes.includes('filter') && effectiveTrauma > 3) {
      // Apply filter glitch (hue-rotate, blur, contrast)
      const hueRotate = Math.random() * 360;
      const blur = Math.random() * effectiveTrauma * 0.2;
      const contrast = 100 + Math.random() * effectiveTrauma * 10;

      element.style.filter = `hue-rotate(${hueRotate}deg) blur(${blur}px) contrast(${contrast}%)`;

      // Reset after a short duration
      setTimeout(() => {
        element.style.filter = '';
      }, 50 + Math.random() * 100);
    }
  }

  /**
   * Apply ambient system-wide glitch
   */
  applyAmbientGlitch() {
    // Create a full-screen overlay for momentary glitch
    let overlay = document.querySelector('.quantum-ambient-overlay');

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'quantum-ambient-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        transition: opacity 100ms linear;
      `;
      document.body.appendChild(overlay);
    }

    // Apply effect based on trauma level
    const effect = Math.floor(Math.random() * 4);

    switch (effect) {
      case 0:
        // Screen shift
        overlay.style.backgroundColor = 'transparent';
        overlay.style.boxShadow = 'none';
        document.body.style.transform = `translate(${(Math.random() - 0.5) * 10}px, ${
          (Math.random() - 0.5) * 10
        }px)`;
        setTimeout(() => (document.body.style.transform = ''), 100);
        break;

      case 1:
        // Flash
        let flashColor;
        switch (this.systemPhase) {
          case 'cyber-lotus':
            flashColor = 'rgba(14, 231, 255, 0.1)';
            break;
          case 'alien-flora':
            flashColor = 'rgba(4, 255, 89, 0.1)';
            break;
          case 'rolling-virus':
            flashColor = 'rgba(255, 187, 56, 0.1)';
            break;
          case 'trauma-core':
            flashColor = 'rgba(215, 33, 184, 0.1)';
            break;
          default:
            flashColor = 'rgba(215, 33, 184, 0.1)';
        }

        overlay.style.backgroundColor = flashColor;
        overlay.style.opacity = '1';
        setTimeout(() => (overlay.style.opacity = '0'), 100);
        break;

      case 2:
        // Scanlines
        overlay.style.backgroundColor = 'transparent';
        overlay.style.backgroundImage =
          'repeating-linear-gradient(0deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)';
        overlay.style.opacity = '1';
        setTimeout(() => {
          overlay.style.opacity = '0';
          overlay.style.backgroundImage = 'none';
        }, 200);
        break;

      case 3:
        // Color shift
        document.body.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
        setTimeout(() => (document.body.style.filter = ''), 150);
        break;
    }

    // Notify Alpine.js store of glitch activation
    if (window.Alpine) {
      window.Alpine.store('trauma').activeGlitch = true;
      setTimeout(() => {
        window.Alpine.store('trauma').activeGlitch = false;
      }, 200);
    }

    // Broadcast glitch event through neural bus
    if (window.NeuralBus) {
      window.NeuralBus.publish('glitch:ambient', {
        traumaLevel: this.traumaLevel,
        memoryPhase: this.systemPhase,
        intensity: this.traumaLevel / 10,
        duration: 200,
      });
    }
  }

  /**
   * Create a pulse effect on a specific element
   * @param {Element|string} target - Element or selector to pulse
   * @param {Object} options - Pulse configuration
   */
  pulse(target, options = {}) {
    // Default options
    const config = {
      intensity: 1.0,
      duration: 500,
      effectTypes: ['transform', 'text', 'color', 'filter'],
      ...options,
    };

    // Find the target element
    let element;
    if (typeof target === 'string') {
      element = document.querySelector(target);
    } else if (target instanceof Element) {
      element = target;
    } else {
      console.warn('Invalid pulse target:', target);
      return this;
    }

    if (!element) {
      console.warn('Pulse target not found:', target);
      return this;
    }

    // Check if element is already in targets
    let targetConfig;
    if (this.targets.has(element)) {
      targetConfig = this.targets.get(element);
    } else {
      // Add as temporary target
      targetConfig = {
        intensity: config.intensity,
        effectTypes: config.effectTypes,
        pulseInterval: 0,
        variationSpeed: 1.0,
        lastGlitchTime: 0,
        effectiveTrauma: this.calculateEffectiveTrauma(config.intensity),
      };
      this.targets.set(element, targetConfig);
    }

    // Store original config to restore later
    const originalConfig = { ...targetConfig };

    // Override with pulse config
    targetConfig.intensity = config.intensity;
    targetConfig.effectTypes = config.effectTypes;
    targetConfig.effectiveTrauma = this.calculateEffectiveTrauma(config.intensity);

    // Apply glitch effect
    this.applyGlitchEffect(element, targetConfig);

    // Schedule follow-up glitches for the duration
    const startTime = Date.now();
    const endTime = startTime + config.duration;
    const glitchInterval = Math.min(100, config.duration / 4);

    const applyPulseGlitches = () => {
      const now = Date.now();
      if (now < endTime) {
        // Apply another glitch
        this.applyGlitchEffect(element, targetConfig);

        // Schedule next glitch
        setTimeout(applyPulseGlitches, glitchInterval);
      } else {
        // Restore original config when done
        if (this.targets.has(element)) {
          this.targets.set(element, originalConfig);
        }
      }
    };

    // Start the pulse sequence
    setTimeout(applyPulseGlitches, glitchInterval);

    return this;
  }

  /**
   * Set trauma level for the entire page
   * @param {number} level - Trauma level (0-10)
   */
  setTraumaIndex(level) {
    this.setTraumaLevel(level);

    // Also update system trauma level through neural bus if available
    if (window.NeuralBus) {
      window.NeuralBus.publish('system:trauma', { level });
    }

    return this;
  }
}

// Initialize and expose to window
if (typeof window !== 'undefined') {
  window.GlitchEngine = window.GlitchEngine || new GlitchEngine();

  // Initialize on page load
  document.addEventListener('DOMContentLoaded', () => {
    window.GlitchEngine.start();

    // Set up event listeners
    document.addEventListener('product:added', () => {
      window.GlitchEngine.pulse(document.body, {
        intensity: 1.5,
        duration: 1000,
      });
    });

    document.addEventListener('cart:updated', () => {
      window.GlitchEngine.pulse('.cart-count', {
        intensity: 1.0,
        duration: 500,
      });
    });

    // Set up trauma-responsive elements
    document.querySelectorAll('.glitch-text').forEach((element) => {
      window.GlitchEngine.addTarget(element, {
        intensity: 0.5,
        pulseInterval: 3000 + Math.random() * 3000,
      });
    });

    document.querySelectorAll('.trauma-responsive').forEach((element) => {
      window.GlitchEngine.addTarget(element, {
        intensity: 0.8,
        pulseInterval: 4000 + Math.random() * 4000,
      });
    });
  });
}
