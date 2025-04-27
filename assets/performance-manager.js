/**
 * VoidBloom Performance Manager v1.2.1
 * Implements lazy loading and adaptive performance for WebGL trauma visualizations
 */

class PerformanceManager {
  constructor() {
    this.settings = {
      enabled: true,
      lowPerformanceMode: false,
      lazyLoadThreshold: 200, // px before element is in viewport
      devicePerformanceTier: 'high', // 'low', 'medium', 'high'
      particleMultiplier: 1,
      effectQuality: 'high', // 'low', 'medium', 'high'
      disableEffectsOnLowFPS: true,
      fpsThreshold: 30,
      adaptiveQuality: true,
      // New settings for better performance handling
      criticalFpsThreshold: 15, // Critical threshold where we take more drastic measures
      minFramesBetweenAdaptations: 60, // Wait 60 frames between adaptations to prevent thrashing
      maxWebGLInstances: 3, // Maximum WebGL contexts to have active at once
      activeWebGLContexts: 0, // Track active contexts
      deferNonEssentialScripts: true,
      longTaskThreshold: 50, // ms - tasks longer than this are considered problematic
    };

    this.metrics = {
      fps: 60,
      lastFrameTime: 0,
      frameCount: 0,
      adaptationInterval: null,
      observer: null,
      // New metrics for better monitoring
      framesUntilNextAdaptation: 0,
      longTaskCount: 0,
      heaviestTaskTime: 0,
      totalTaskTime: 0,
      lastPerformanceEntryIndex: 0,
      activeEffects: new Set(),
    };

    this.initialize();
  }

  /**
   * Initialize the performance manager
   */
  initialize() {
    // Monitor long tasks using PerformanceObserver if available
    this.setupPerformanceObserver();
    this.detectPerformanceCapabilities();
    this.setupIntersectionObserver();
    this.setupAdaptiveQuality();
    this.setupLocalStorage();

    // Add performance controls to window object for debugging
    window.performanceManager = this;

    console.log(
      `[Performance] Initialized: Device tier ${this.settings.devicePerformanceTier}, Quality: ${this.settings.effectQuality}`
    );

    // Check for previously saved low performance mode
    if (this.settings.lowPerformanceMode) {
      // Apply immediately to prevent initial heavy rendering
      this.applyLowPerformanceMode();
    }

    // If we're on a low-tier device, force low performance mode immediately
    if (this.settings.devicePerformanceTier === 'low') {
      this.enableLowPerformanceMode(true);
    }
  }

  /**
   * Set up performance observer to monitor long tasks
   */
  setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      try {
        // Track long tasks
        const longTaskObserver = new PerformanceObserver((entries) => {
          entries.getEntries().forEach((entry) => {
            if (entry.duration > this.settings.longTaskThreshold) {
              this.metrics.longTaskCount++;
              this.metrics.totalTaskTime += entry.duration;
              this.metrics.heaviestTaskTime = Math.max(
                this.metrics.heaviestTaskTime,
                entry.duration
              );

              // If we detect extremely long tasks, take immediate action
              if (entry.duration > 500 && !this.settings.lowPerformanceMode) {
                console.warn(
                  `[Performance] Critical long task detected: ${entry.duration.toFixed(2)}ms`
                );
                this.enableLowPerformanceMode(true);
              }
            }
          });
        });

        longTaskObserver.observe({ entryTypes: ['longtask'] });

        // Monitor resource timing for heavy asset loads
        const resourceObserver = new PerformanceObserver((entries) => {
          entries.getEntries().forEach((entry) => {
            // Look for large JS or WebGL related assets that take time to process
            if (
              (entry.initiatorType === 'script' ||
                entry.name.includes('quantum') ||
                entry.name.includes('webgl') ||
                entry.name.includes('hologram')) &&
              entry.duration > 300
            ) {
              console.warn(
                `[Performance] Heavy resource load: ${entry.name} (${entry.duration.toFixed(2)}ms)`
              );
            }
          });
        });

        resourceObserver.observe({ entryTypes: ['resource'] });
      } catch (e) {
        console.error('[Performance] Error setting up PerformanceObserver:', e);
      }
    }
  }

  /**
   * Detect device performance capabilities
   */
  detectPerformanceCapabilities() {
    // Simple detection based on platform and memory
    const memoryInfo = performance?.memory;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    const hasPoorGPU = this.detectPoorGPU();

    // Combined device capability evaluation
    if (isMobile || hasPoorGPU) {
      this.settings.devicePerformanceTier = 'low';
      this.settings.effectQuality = 'low';
      this.settings.particleMultiplier = 0.3;
      this.settings.maxWebGLInstances = 1; // Only allow one WebGL context on mobile
    } else if (memoryInfo && memoryInfo.jsHeapSizeLimit) {
      const memoryGB = memoryInfo.jsHeapSizeLimit / 1073741824; // Convert to GB
      if (memoryGB < 2) {
        this.settings.devicePerformanceTier = 'low';
        this.settings.effectQuality = 'low';
        this.settings.particleMultiplier = 0.5;
        this.settings.maxWebGLInstances = 2;
      } else if (memoryGB < 4) {
        this.settings.devicePerformanceTier = 'medium';
        this.settings.effectQuality = 'medium';
        this.settings.particleMultiplier = 0.7;
      }
    }

    // Set data attribute on body for CSS targeting
    document.body.setAttribute('data-performance-tier', this.settings.devicePerformanceTier);

    // Check if the browser is using hardware acceleration
    if (this.isUsingSwRendering()) {
      console.warn('[Performance] Browser appears to be using software rendering');
      this.settings.devicePerformanceTier = 'low';
      this.settings.effectQuality = 'low';
      this.settings.maxWebGLInstances = 1;
    }
  }

  /**
   * Detect if the browser is likely using software rendering
   */
  isUsingSwRendering() {
    // Create a test canvas and check WebGL capabilities
    const canvas = document.createElement('canvas');
    let gl;
    try {
      gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return true;

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
        // Check for software renderers like SwiftShader, ANGLE, Basic Renderer, etc.
        return (
          renderer.includes('swiftshader') ||
          renderer.includes('llvmpipe') ||
          renderer.includes('software') ||
          (renderer.includes('mesa') && !renderer.includes('intel'))
        );
      }
    } catch (e) {
      return true; // Assume software rendering if we can't determine
    } finally {
      if (gl) {
        const loseContext = gl.getExtension('WEBGL_lose_context');
        if (loseContext) loseContext.loseContext();
      }
    }
    return false;
  }

  /**
   * Detect if the device likely has a poor GPU
   */
  detectPoorGPU() {
    const canvas = document.createElement('canvas');
    let gl;
    try {
      gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return true;

      // Run a simple benchmark by creating a large number of vertices
      const startTime = performance.now();
      const vertices = new Float32Array(100000);
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
      const endTime = performance.now();

      // If this simple operation takes more than 50ms, it's likely a poor GPU
      return endTime - startTime > 50;
    } catch (e) {
      return true; // Assume poor GPU if we encounter an error
    } finally {
      if (gl) {
        const loseContext = gl.getExtension('WEBGL_lose_context');
        if (loseContext) loseContext.loseContext();
      }
    }
  }

  /**
   * Set up intersection observer for lazy loading effects
   */
  setupIntersectionObserver() {
    // Only observe effects if performance mode allows it
    if (
      !this.settings.enabled ||
      (this.settings.lowPerformanceMode && !this.settings.deferNonEssentialScripts)
    ) {
      return;
    }

    const options = {
      root: null,
      rootMargin: `${this.settings.lazyLoadThreshold}px`,
      threshold: 0.01,
    };

    this.metrics.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Check if we can safely add another WebGL context
          if (this.canAddWebGLContext()) {
            this.activateEffect(entry.target);
          } else {
            // Store for later - will be activated when another context is removed
            entry.target.setAttribute('data-queued-effect', 'true');
          }
          // Stop observing after activation decision
          this.metrics.observer.unobserve(entry.target);
        }
      });
    }, options);

    // Start observing all trauma effect elements
    document.querySelectorAll('[data-trauma-type]').forEach((el) => {
      if (!el.hasAttribute('data-effects-active')) {
        el.setAttribute('data-effects-active', 'false');
        this.metrics.observer.observe(el);
      }
    });
  }

  /**
   * Check if we can safely add another WebGL context
   */
  canAddWebGLContext() {
    return this.settings.activeWebGLContexts < this.settings.maxWebGLInstances;
  }

  /**
   * Activate WebGL effect on an element
   */
  activateEffect(element) {
    if (
      !this.settings.enabled ||
      (this.settings.lowPerformanceMode && !element.hasAttribute('data-priority-effect'))
    ) {
      return;
    }

    // Track this context
    this.settings.activeWebGLContexts++;
    this.metrics.activeEffects.add(element);

    element.setAttribute('data-effects-active', 'true');

    // Initialize QEARWebGLBridge for this element with performance-adjusted settings
    if (window.QEARWebGLBridge) {
      const traumaType = element.getAttribute('data-trauma-type') || 'recursion';
      const intensity = parseFloat(element.getAttribute('data-intensity') || 0.7);

      // Calculate particle count based on performance tier
      const baseParticleCount = this.getParticleCountForElement(element);
      const particleCount = Math.floor(baseParticleCount * this.settings.particleMultiplier);

      // Initialize effect with adjusted settings
      const bridge = new window.QEARWebGLBridge({
        targetElement: element,
        traumaType: traumaType,
        intensity: intensity,
        particleCount: particleCount,
        qualityLevel: this.settings.effectQuality,
        disablePreciseCollisions: this.settings.devicePerformanceTier === 'low',
        useSimplifiedShaders: this.settings.devicePerformanceTier !== 'high',
        onContextLost: () => {
          // Handle WebGL context loss by removing this effect from active count
          this.onEffectDestroyed(element);
        },
      });

      // Store the bridge reference for later cleanup
      element._webglBridge = bridge;

      console.log(
        `[Performance] Activated ${traumaType} effect on element with ${particleCount} particles`
      );
    }
  }

  /**
   * Handle effect destruction and resource cleanup
   */
  onEffectDestroyed(element) {
    if (this.metrics.activeEffects.has(element)) {
      this.metrics.activeEffects.delete(element);
      this.settings.activeWebGLContexts = Math.max(0, this.settings.activeWebGLContexts - 1);

      // Check if we can activate a queued effect
      const queuedEffects = document.querySelectorAll('[data-queued-effect="true"]');
      if (queuedEffects.length > 0 && this.canAddWebGLContext()) {
        const nextEffect = queuedEffects[0];
        nextEffect.removeAttribute('data-queued-effect');
        this.activateEffect(nextEffect);
      }
    }
  }

  /**
   * Get base particle count for an element based on its type and size
   */
  getParticleCountForElement(element) {
    const traumaType = element.getAttribute('data-trauma-type') || 'recursion';
    const elementSize = element.offsetWidth * element.offsetHeight;
    const viewportSize = window.innerWidth * window.innerHeight;
    const sizeRatio = Math.min(1, elementSize / (viewportSize * 0.5));

    // Base particle counts by trauma type
    const baseParticleCounts = {
      recursion: 2000,
      glitch: 1500,
      quantum: 3000,
      holographic: 2500,
      displace: 1000,
      default: 1000,
    };

    // Get base count for this type, or use default
    const baseCount = baseParticleCounts[traumaType] || baseParticleCounts.default;

    // Scale by element size
    return Math.round(baseCount * sizeRatio);
  }

  /**
   * Set up adaptive quality system that monitors FPS
   */
  setupAdaptiveQuality() {
    if (!this.settings.adaptiveQuality) return;

    // Set up FPS monitoring
    let lastFrameTime = performance.now();
    let frameCount = 0;

    const measureFPS = () => {
      const now = performance.now();
      frameCount++;

      if (now - lastFrameTime >= 1000) {
        this.metrics.fps = frameCount;
        frameCount = 0;
        lastFrameTime = now;

        // Decrement frames until next adaptation if we're waiting
        if (this.metrics.framesUntilNextAdaptation > 0) {
          this.metrics.framesUntilNextAdaptation--;
        }

        // Check if we need to adapt based on FPS
        if (this.metrics.framesUntilNextAdaptation === 0) {
          // If FPS drops below critical threshold, take more aggressive action
          if (this.metrics.fps < this.settings.criticalFpsThreshold) {
            console.warn(`[Performance] Critical FPS drop: ${this.metrics.fps}`);
            this.enableLowPerformanceMode(true);
          }
          // If FPS drops below threshold but is not critical, apply normal optimizations
          else if (
            this.metrics.fps < this.settings.fpsThreshold &&
            !this.settings.lowPerformanceMode
          ) {
            console.warn(`[Performance] FPS drop detected: ${this.metrics.fps}`);
            this.enableLowPerformanceMode();
          }

          // Reset the adaptation counter
          this.metrics.framesUntilNextAdaptation = this.settings.minFramesBetweenAdaptations;
        }

        // Track performance for monitoring (create a point every 5 seconds)
        if (frameCount % 5 === 0) {
          this.trackPerformancePoint();
        }
      }

      requestAnimationFrame(measureFPS);
    };

    // Start monitoring FPS
    requestAnimationFrame(measureFPS);
  }

  /**
   * Track a performance data point for analysis
   */
  trackPerformancePoint() {
    // Store performance data for later analysis
    if (!window._vbPerformanceHistory) {
      window._vbPerformanceHistory = [];
    }

    window._vbPerformanceHistory.push({
      timestamp: Date.now(),
      fps: this.metrics.fps,
      longTaskCount: this.metrics.longTaskCount,
      heaviestTaskTime: this.metrics.heaviestTaskTime,
      totalTaskTime: this.metrics.totalTaskTime,
      memoryUsage: performance.memory ? performance.memory.usedJSHeapSize : null,
      activeWebGLContexts: this.settings.activeWebGLContexts,
    });

    // Keep history to a reasonable size
    if (window._vbPerformanceHistory.length > 100) {
      window._vbPerformanceHistory.shift();
    }
  }

  /**
   * Apply low performance mode immediately
   */
  applyLowPerformanceMode() {
    // Mark body for CSS adaptations
    document.body.setAttribute('data-low-performance', 'true');

    // Reduce active WebGL contexts
    this.reduceActiveWebGLContexts();

    // Apply low quality to all active effects
    document.querySelectorAll('[data-effects-active="true"]').forEach((el) => {
      if (!el.hasAttribute('data-priority-effect')) {
        this.disableEffect(el);
      } else if (el._webglBridge && typeof el._webglBridge.setQuality === 'function') {
        el._webglBridge.setQuality('low');
      }
    });
  }

  /**
   * Reduce the number of active WebGL contexts
   */
  reduceActiveWebGLContexts() {
    // If we have too many active contexts, remove the least important ones
    const activeElements = Array.from(this.metrics.activeEffects);
    if (activeElements.length > 1) {
      // Sort by priority (keep priority effects)
      activeElements.sort((a, b) => {
        const aPriority = a.hasAttribute('data-priority-effect') ? 1 : 0;
        const bPriority = b.hasAttribute('data-priority-effect') ? 1 : 0;
        return bPriority - aPriority;
      });

      // Keep only max 1 context in low performance mode, or max 2 in medium
      const maxToKeep = this.settings.devicePerformanceTier === 'low' ? 1 : 2;

      // Remove excess contexts
      activeElements.slice(maxToKeep).forEach((element) => {
        this.disableEffect(element);
      });
    }
  }

  /**
   * Disable a WebGL effect and clean up resources
   */
  disableEffect(element) {
    if (element._webglBridge) {
      if (typeof element._webglBridge.destroy === 'function') {
        element._webglBridge.destroy();
      }
      delete element._webglBridge;
    }

    // Remove any canvas elements
    const canvases = element.querySelectorAll('canvas');
    canvases.forEach((canvas) => canvas.remove());

    // Update tracking
    element.setAttribute('data-effects-active', 'false');
    this.onEffectDestroyed(element);
  }

  /**
   * Enable low performance mode
   */
  enableLowPerformanceMode(critical = false) {
    if (this.settings.lowPerformanceMode) return;

    const fpsDescription = critical
      ? 'critical performance issues'
      : `low FPS (${this.metrics.fps})`;

    console.log(`[Performance] Enabling low performance mode due to ${fpsDescription}`);

    this.settings.lowPerformanceMode = true;
    this.settings.particleMultiplier = 0.3;
    this.settings.effectQuality = 'low';
    this.settings.maxWebGLInstances = this.settings.devicePerformanceTier === 'low' ? 1 : 2;

    // Apply the mode
    this.applyLowPerformanceMode();

    // Store setting in local storage
    if (window.localStorage) {
      window.localStorage.setItem('voidbloom_low_performance_mode', 'true');
    }

    // Dispatch event for other components to respond
    window.dispatchEvent(
      new CustomEvent('voidbloom:performancechanged', {
        detail: { lowPerformanceMode: true },
      })
    );
  }

  /**
   * Set up local storage for persisting performance settings
   */
  setupLocalStorage() {
    if (!window.localStorage) return;

    // Check if user previously enabled low performance mode
    const savedLowPerformanceMode = window.localStorage.getItem('voidbloom_low_performance_mode');
    if (savedLowPerformanceMode === 'true') {
      this.settings.lowPerformanceMode = true;
      document.body.setAttribute('data-low-performance', 'true');
    }

    // Check if user manually set quality level
    const savedQualityLevel = window.localStorage.getItem('voidbloom_quality_level');
    if (savedQualityLevel) {
      this.settings.effectQuality = savedQualityLevel;
    }
  }

  /**
   * Set effect quality (for user preference controls)
   */
  setQuality(quality) {
    if (!['low', 'medium', 'high'].includes(quality)) return;

    this.settings.effectQuality = quality;

    // Store in local storage
    if (window.localStorage) {
      window.localStorage.setItem('voidbloom_quality_level', quality);
    }

    // Apply immediately to active effects
    this.applyQualityToActiveEffects();

    console.log(`[Performance] Quality set to ${quality}`);

    // Dispatch event
    window.dispatchEvent(
      new CustomEvent('voidbloom:qualitychanged', {
        detail: { quality: quality },
      })
    );

    return true;
  }

  /**
   * Apply current quality settings to active effects
   */
  applyQualityToActiveEffects() {
    // Simplified - in real impl would communicate with active WebGL instances
    document.querySelectorAll('[data-effects-active="true"]').forEach((el) => {
      // Signal quality change to existing effects
      el.setAttribute('data-effect-quality', this.settings.effectQuality);

      // If this element has a WebGL bridge, update it directly
      if (el._webglBridge && typeof el._webglBridge.setQuality === 'function') {
        el._webglBridge.setQuality(this.settings.effectQuality);
      }
    });
  }
}

// Initialize performance manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Use setTimeout to ensure this doesn't block the initial render
  setTimeout(() => {
    window.voidbloomPerformance = new PerformanceManager();
  }, 100);
});

// Export the class for module use
export default PerformanceManager;
