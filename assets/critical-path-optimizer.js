/**
 * CRITICAL-PATH-OPTIMIZER.JS
 * Manages resource loading to optimize the critical rendering path
 *
 * @Version: 1.0.0
 * @Date: April 27, 2025
 */

class CriticalPathOptimizer {
  constructor() {
    this.initialized = false;
    this.settings = {
      deferThirdPartyScripts: true,
      prioritizeLCP: true,
      monitorLongTasks: true,
      preconnectThreshold: 2, // Minimum number of resources from same origin to trigger preconnect
      maxConcurrentScripts: 3, // Maximum number of scripts to load concurrently
      longTaskThreshold: 50, // ms
    };

    // Store origins we've seen to optimize preconnecting
    this.origins = new Map();

    // Queue for scripts to be loaded with controlled concurrency
    this.scriptQueue = [];
    this.loadingScripts = 0;

    // Track script execution times
    this.scriptTiming = new Map();

    // Initialize
    this.init();
  }

  init() {
    if (this.initialized) return;

    // Set up performance observers
    this.setupPerformanceObservers();

    // Add preconnects for critical domains
    this.addCriticalPreconnects();

    // Defer third-party scripts
    if (this.settings.deferThirdPartyScripts) {
      this.deferThirdPartyScripts();
    }

    // Optimize resource hints
    this.optimizeResourceHints();

    // Monitor web vitals
    this.monitorWebVitals();

    this.initialized = true;

    // Log initialization
    console.log('[Critical Path] Optimizer initialized');
  }

  /**
   * Set up performance observers to monitor resource loading and execution
   */
  setupPerformanceObservers() {
    if (!('PerformanceObserver' in window)) return;

    // Monitor resource timing
    try {
      const resourceObserver = new PerformanceObserver((entries) => {
        entries.getEntries().forEach((entry) => {
          // Track script execution times
          if (entry.initiatorType === 'script') {
            this.scriptTiming.set(entry.name, {
              fetchTime: entry.duration,
              startTime: entry.startTime,
            });

            // Track origins to potentially optimize with preconnect
            const url = new URL(entry.name);
            const origin = url.origin;

            if (!this.origins.has(origin)) {
              this.origins.set(origin, 1);
            } else {
              this.origins.set(origin, this.origins.get(origin) + 1);

              // If we've loaded multiple resources from this origin, add preconnect
              if (this.origins.get(origin) === this.settings.preconnectThreshold) {
                this.addPreconnect(origin);
              }
            }
          }
        });
      });
      resourceObserver.observe({ entryTypes: ['resource'] });

      // Monitor long tasks if enabled
      if (this.settings.monitorLongTasks) {
        const longTaskObserver = new PerformanceObserver((entries) => {
          entries.getEntries().forEach((entry) => {
            if (entry.duration > this.settings.longTaskThreshold) {
              console.warn(
                `[Critical Path] Long task detected: ${entry.duration.toFixed(2)}ms`,
                entry
              );

              // If there's attribution data, log it
              if (entry.attribution && entry.attribution.length > 0) {
                const scriptName =
                  entry.attribution[0].containerName || entry.attribution[0].containerSrc;
                if (scriptName) {
                  console.warn(`[Critical Path] Long task attributed to: ${scriptName}`);
                }
              }
            }
          });
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      }
    } catch (e) {
      console.error('[Critical Path] Error setting up PerformanceObserver:', e);
    }
  }

  /**
   * Add preconnect for critical domains
   */
  addCriticalPreconnects() {
    // Common domains that most Shopify sites use
    const criticalDomains = ['https://cdn.shopify.com', 'https://shopify.com'];

    criticalDomains.forEach((domain) => {
      this.addPreconnect(domain);
    });
  }

  /**
   * Add preconnect hint for an origin
   */
  addPreconnect(origin) {
    // Check if this preconnect already exists
    if (document.querySelector(`link[rel="preconnect"][href="${origin}"]`)) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';

    document.head.appendChild(link);
    console.log(`[Critical Path] Added preconnect for: ${origin}`);
  }

  /**
   * Defer loading of third-party scripts
   */
  deferThirdPartyScripts() {
    // Capture scripts to defer
    const scripts = Array.from(document.querySelectorAll('script[src]'));

    scripts.forEach((script) => {
      const src = script.getAttribute('src');
      const currentHost = window.location.host;

      // Skip if this is a first-party script
      if (src.startsWith('/') || src.includes(currentHost)) {
        return;
      }

      // Skip if this is a critical script
      if (script.hasAttribute('data-critical') || script.hasAttribute('data-priority')) {
        return;
      }

      // Queue third-party script for controlled loading
      this.queueScriptLoad(src, {
        async: script.async,
        defer: script.defer,
        type: script.type,
        id: script.id,
        dataset: script.dataset,
      });

      // Remove the original script
      script.parentNode.removeChild(script);
    });

    // Begin loading scripts with controlled concurrency
    this.processScriptQueue();
  }

  /**
   * Queue a script to be loaded with controlled concurrency
   */
  queueScriptLoad(src, attributes = {}) {
    this.scriptQueue.push({ src, attributes });
  }

  /**
   * Process the script queue with controlled concurrency
   */
  processScriptQueue() {
    // If queue is empty or we're at max concurrent loads, do nothing
    if (
      this.scriptQueue.length === 0 ||
      this.loadingScripts >= this.settings.maxConcurrentScripts
    ) {
      return;
    }

    // Get next script to load
    const scriptInfo = this.scriptQueue.shift();
    this.loadingScripts++;

    // Create and load the script
    const script = document.createElement('script');
    script.src = scriptInfo.src;

    // Apply attributes
    if (scriptInfo.attributes) {
      if (scriptInfo.attributes.async) script.async = true;
      if (scriptInfo.attributes.defer) script.defer = true;
      if (scriptInfo.attributes.type) script.type = scriptInfo.attributes.type;
      if (scriptInfo.attributes.id) script.id = scriptInfo.attributes.id;

      // Copy dataset attributes
      if (scriptInfo.attributes.dataset) {
        Object.keys(scriptInfo.attributes.dataset).forEach((key) => {
          script.dataset[key] = scriptInfo.attributes.dataset[key];
        });
      }
    }

    // When script loads or errors, load next one
    const loadNextScript = () => {
      this.loadingScripts--;
      this.processScriptQueue();
    };

    script.onload = loadNextScript;
    script.onerror = loadNextScript;

    // Append to document
    document.body.appendChild(script);

    // Process more scripts if possible
    this.processScriptQueue();
  }

  /**
   * Optimize resource hints (preload, prefetch, etc.)
   */
  optimizeResourceHints() {
    // Remove duplicate resource hints
    const resourceHints = document.querySelectorAll('link[rel^="pre"]');
    const seenHrefs = new Set();

    resourceHints.forEach((hint) => {
      const href = hint.getAttribute('href');
      if (seenHrefs.has(href)) {
        // Remove duplicate
        hint.parentNode.removeChild(hint);
      } else {
        seenHrefs.add(href);
      }
    });

    // Ensure critical resources are preloaded
    if (this.settings.prioritizeLCP) {
      this.preloadLCPCandidates();
    }
  }

  /**
   * Preload potential LCP image candidates
   */
  preloadLCPCandidates() {
    // Find hero images or large images that might be LCP candidates
    const images = Array.from(document.querySelectorAll('img'));

    // Sort by size (width * height) descending
    images.sort((a, b) => {
      const aSize = (a.width || 0) * (a.height || 0);
      const bSize = (b.width || 0) * (b.height || 0);
      return bSize - aSize;
    });

    // Preload the largest image if it's not already being preloaded
    if (images.length > 0) {
      const largestImage = images[0];
      const src = largestImage.currentSrc || largestImage.src;

      if (src && !document.querySelector(`link[rel="preload"][href="${src}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = src;
        link.as = 'image';

        document.head.appendChild(link);
        console.log(`[Critical Path] Added preload for potential LCP image: ${src}`);
      }
    }
  }

  /**
   * Monitor Web Vitals metrics
   */
  monitorWebVitals() {
    // This implementation requires the web-vitals library
    // If not available, a simple fallback approach is used
    if (typeof webVitals !== 'undefined') {
      webVitals.onLCP((metric) => {
        console.log('[Web Vitals] LCP:', metric.value);
        window.lcpValue = metric.value;
      });

      webVitals.onFID((metric) => {
        console.log('[Web Vitals] FID:', metric.value);
      });

      webVitals.onCLS((metric) => {
        console.log('[Web Vitals] CLS:', metric.value);
      });

      webVitals.onTTFB((metric) => {
        console.log('[Web Vitals] TTFB:', metric.value);
      });
    } else {
      // Fallback monitoring for LCP
      this.monitorLCP();
    }
  }

  /**
   * Fallback method to approximately monitor LCP without web-vitals library
   */
  monitorLCP() {
    if (!('PerformanceObserver' in window)) return;

    try {
      let lcpValue = 0;
      const lcpObserver = new PerformanceObserver((entries) => {
        const lastEntry = entries.getEntries().pop();
        lcpValue = lastEntry.startTime + lastEntry.duration;
        window.lcpValue = lcpValue;
      });

      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // Report LCP after page load
      window.addEventListener('load', () => {
        // Wait a bit after load to capture final LCP
        setTimeout(() => {
          console.log('[Critical Path] Approximate LCP:', lcpValue);
        }, 1000);
      });
    } catch (e) {
      console.error('[Critical Path] Error monitoring LCP:', e);
    }
  }
}

// Initialize the optimizer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Delay slightly to prioritize rendering critical content first
  setTimeout(() => {
    window.criticalPathOptimizer = new CriticalPathOptimizer();
  }, 50);
});

// Export the class for module usage
export default CriticalPathOptimizer;
