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
      adaptiveQuality: true
    };

    this.metrics = {
      fps: 60,
      lastFrameTime: 0,
      frameCount: 0,
      adaptationInterval: null,
      observer: null
    };

    this.initialize();
  }

  /**
   * Initialize the performance manager
   */
  initialize() {
    this.detectPerformanceCapabilities();
    this.setupIntersectionObserver();
    this.setupAdaptiveQuality();
    this.setupLocalStorage();

    // Add performance controls to window object for debugging
    window.performanceManager = this;
    
    console.log(`[Performance] Initialized: Device tier ${this.settings.devicePerformanceTier}, Quality: ${this.settings.effectQuality}`);
  }

  /**
   * Detect device performance capabilities 
   */
  detectPerformanceCapabilities() {
    // Simple detection based on platform and memory
    const memoryInfo = performance?.memory;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      this.settings.devicePerformanceTier = 'low';
      this.settings.effectQuality = 'low';
      this.settings.particleMultiplier = 0.3;
    } else if (memoryInfo && memoryInfo.jsHeapSizeLimit) {
      const memoryGB = memoryInfo.jsHeapSizeLimit / 1073741824; // Convert to GB
      if (memoryGB < 2) {
        this.settings.devicePerformanceTier = 'low';
        this.settings.effectQuality = 'low';
        this.settings.particleMultiplier = 0.5;
      } else if (memoryGB < 4) {
        this.settings.devicePerformanceTier = 'medium';
        this.settings.effectQuality = 'medium';
        this.settings.particleMultiplier = 0.7;
      }
    }
    
    // Set data attribute on body for CSS targeting
    document.body.setAttribute('data-performance-tier', this.settings.devicePerformanceTier);
  }

  /**
   * Set up intersection observer for lazy loading effects
   */
  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: `${this.settings.lazyLoadThreshold}px`,
      threshold: 0.01
    };
    
    this.metrics.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.activateEffect(entry.target);
          // Stop observing after activation
          this.metrics.observer.unobserve(entry.target);
        }
      });
    }, options);
    
    // Start observing all trauma effect elements
    document.querySelectorAll('[data-trauma-type]').forEach(el => {
      if (!el.hasAttribute('data-effects-active')) {
        el.setAttribute('data-effects-active', 'false');
        this.metrics.observer.observe(el);
      }
    });
  }

  /**
   * Activate WebGL effect on an element
   */
  activateEffect(element) {
    if (!this.settings.enabled || 
        (this.settings.lowPerformanceMode && !element.hasAttribute('data-priority-effect'))) {
      return;
    }
    
    element.setAttribute('data-effects-active', 'true');
    
    // Initialize QEARWebGLBridge for this element with performance-adjusted settings
    if (window.QEARWebGLBridge) {
      const traumaType = element.getAttribute('data-trauma-type') || 'recursion';
      const intensity = parseFloat(element.getAttribute('data-intensity') || 0.7);
      
      // Calculate particle count based on performance tier
      const baseParticleCount = this.getParticleCountForElement(element);
      const particleCount = Math.floor(baseParticleCount * this.settings.particleMultiplier);
      
      // Initialize effect with adjusted settings
      new window.QEARWebGLBridge({
        targetElement: element,
        traumaType: traumaType,
        intensity: intensity,
        particleCount: particleCount,
        qualityLevel: this.settings.effectQuality,
        disablePreciseCollisions: this.settings.devicePerformanceTier === 'low',
        useSimplifiedShaders: this.settings.devicePerformanceTier !== 'high'
      });
      
      console.log(`[Performance] Activated ${traumaType} effect on element with ${particleCount} particles`);
    }
  }

  /**
   * Get base particle count for an element based on its type and size
   */
  getParticleCountForElement(element) {
    const traumaType = element.getAttribute('data-trauma-type') || 'recursion';
    const elementSize = element.offsetWidth * element.offsetHeight;
    const isLargeElement = elementSize > 250000; // roughly 500x500px
    
    // Base particle counts by trauma type
    const particleCounts = {
      'abandonment': isLargeElement ? 100 : 50,
      'fragmentation': isLargeElement ? 150 : 75,
      'recursion': isLargeElement ? 120 : 60,
      'surveillance': isLargeElement ? 80 : 40,
      'displacement': isLargeElement ? 110 : 55,
      'dissolution': isLargeElement ? 130 : 65
    };
    
    return particleCounts[traumaType] || 100;
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
        
        // If FPS drops below threshold, reduce quality
        if (this.metrics.fps < this.settings.fpsThreshold && !this.settings.lowPerformanceMode) {
          this.enableLowPerformanceMode();
        }
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    // Start monitoring FPS
    requestAnimationFrame(measureFPS);
  }

  /**
   * Enable low performance mode
   */
  enableLowPerformanceMode() {
    if (this.settings.lowPerformanceMode) return;
    
    console.log(`[Performance] Enabling low performance mode due to low FPS (${this.metrics.fps})`);
    this.settings.lowPerformanceMode = true;
    this.settings.particleMultiplier = 0.3;
    this.settings.effectQuality = 'low';
    
    // Set data attribute on body
    document.body.setAttribute('data-low-performance', 'true');
    
    // Deactivate non-priority effects
    document.querySelectorAll('[data-effects-active="true"]').forEach(el => {
      if (!el.hasAttribute('data-priority-effect')) {
        el.setAttribute('data-effects-active', 'false');
        
        // Remove any existing WebGL contexts from non-priority elements
        const canvases = el.querySelectorAll('canvas');
        canvases.forEach(canvas => canvas.remove());
      }
    });
    
    // Store setting in local storage
    if (window.localStorage) {
      window.localStorage.setItem('voidbloom_low_performance_mode', 'true');
    }
    
    // Dispatch event for other components to respond
    window.dispatchEvent(new CustomEvent('voidbloom:performancechanged', {
      detail: { lowPerformanceMode: true }
    }));
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
    window.dispatchEvent(new CustomEvent('voidbloom:qualitychanged', {
      detail: { quality: quality }
    }));
    
    return true;
  }

  /**
   * Apply current quality settings to active effects
   */
  applyQualityToActiveEffects() {
    // Simplified - in real impl would communicate with active WebGL instances
    document.querySelectorAll('[data-effects-active="true"]').forEach(el => {
      // Signal quality change to existing effects
      el.setAttribute('data-effect-quality', this.settings.effectQuality);
    });
  }
}

// Initialize performance manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.voidbloomPerformance = new PerformanceManager();
});

// Export the class for module use
export default PerformanceManager;