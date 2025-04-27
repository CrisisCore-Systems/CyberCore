/**
 * SCRIPT-CONTROLLER.JS
 * Advanced script loading management for third-party resources
 *
 * @Version: 1.0.0
 * @Date: April 27, 2025
 */

class ScriptController {
  constructor() {
    this.settings = {
      loadOnUserInteraction: true,
      loadNonCriticalAfterLoad: true,
      maxConcurrentLoads: 2,
      vendorLoadDelay: 3000,
      analyticsLoadDelay: 2000,
      prioritizeVisibleContent: true,
    };

    // Track scripts in different categories
    this.scripts = {
      critical: [], // Must load ASAP - core functionality
      functional: [], // Needed for features but can wait a bit
      marketing: [], // Marketing/analytics can be deferred
      nonEssential: [], // Visual enhancements, etc. can load last
    };

    // Track load state
    this.loadState = {
      userHasInteracted: false,
      pageHasLoaded: false,
      concurrentLoads: 0,
    };

    // Initialize
    this.init();
  }

  init() {
    // Set up load triggers
    this.setupLoadTriggers();

    // Register predefined scripts from data attributes
    this.registerPredefinedScripts();

    // Register global to make available to other scripts
    window.scriptController = this;

    // Log initialization
    console.log('[ScriptController] Initialized.');
  }

  /**
   * Set up load event triggers
   */
  setupLoadTriggers() {
    // Track when user interacts
    const interactionEvents = ['click', 'scroll', 'keydown', 'mousemove', 'touchstart'];
    const handleInteraction = () => {
      this.loadState.userHasInteracted = true;

      // If the setting is enabled, load deferred scripts on interaction
      if (this.settings.loadOnUserInteraction) {
        this.loadFunctionalScripts();
      }

      // Remove event listeners once interaction is detected
      interactionEvents.forEach((event) => {
        window.removeEventListener(event, handleInteraction, { passive: true });
      });
    };

    // Add interaction event listeners
    interactionEvents.forEach((event) => {
      window.addEventListener(event, handleInteraction, { passive: true });
    });

    // Track page load completion
    window.addEventListener('load', () => {
      this.loadState.pageHasLoaded = true;

      // Load functional scripts immediately after load
      this.loadFunctionalScripts();

      // Load marketing scripts after a delay
      setTimeout(() => {
        this.loadMarketingScripts();
      }, this.settings.analyticsLoadDelay);

      // Load non-essential scripts last
      setTimeout(() => {
        this.loadNonEssentialScripts();
      }, this.settings.vendorLoadDelay);
    });

    // Prioritize loading visible content
    if (this.settings.prioritizeVisibleContent && 'IntersectionObserver' in window) {
      this.setupVisibilityBasedLoading();
    }
  }

  /**
   * Set up loading based on element visibility
   */
  setupVisibilityBasedLoading() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const scriptId = entry.target.dataset.loadScript;
            if (scriptId) {
              this.loadScriptById(scriptId);
              observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        rootMargin: '200px 0px',
        threshold: 0.1,
      }
    );

    // Find elements that require scripts when visible
    document.querySelectorAll('[data-load-script]').forEach((element) => {
      observer.observe(element);
    });
  }

  /**
   * Register predefined scripts from data attributes
   */
  registerPredefinedScripts() {
    // Look for script definitions in the document
    document
      .querySelectorAll('script[type="application/json"][data-script-definition]')
      .forEach((definition) => {
        try {
          const scriptData = JSON.parse(definition.textContent);
          if (scriptData.id && scriptData.src && scriptData.category) {
            this.registerScript(
              scriptData.id,
              scriptData.src,
              scriptData.category,
              scriptData.attributes || {},
              scriptData.dependencies || []
            );
          }
        } catch (e) {
          console.error('[ScriptController] Error parsing script definition:', e);
        }
      });
  }

  /**
   * Register a script to be loaded
   * @param {string} id - Unique identifier for the script
   * @param {string} src - Script source URL
   * @param {string} category - Script category (critical, functional, marketing, nonEssential)
   * @param {Object} attributes - Additional attributes for the script tag
   * @param {Array} dependencies - Scripts that must be loaded before this one
   */
  registerScript(id, src, category = 'functional', attributes = {}, dependencies = []) {
    const scriptInfo = {
      id,
      src,
      loaded: false,
      loading: false,
      attributes,
      dependencies,
    };

    // Add to appropriate category
    if (this.scripts[category]) {
      this.scripts[category].push(scriptInfo);
      console.log(`[ScriptController] Registered ${category} script: ${id}`);

      // Load critical scripts immediately
      if (category === 'critical') {
        this.loadScript(scriptInfo);
      }
    } else {
      console.warn(`[ScriptController] Unknown script category: ${category}`);
    }

    return this;
  }

  /**
   * Load a specific script by ID
   * @param {string} id - Script ID to load
   */
  loadScriptById(id) {
    // Search in all categories
    for (const category in this.scripts) {
      const scriptInfo = this.scripts[category].find((script) => script.id === id);
      if (scriptInfo && !scriptInfo.loaded && !scriptInfo.loading) {
        this.loadScript(scriptInfo);
        return true;
      }
    }

    console.warn(`[ScriptController] Script not found: ${id}`);
    return false;
  }

  /**
   * Check if dependencies for a script are loaded
   * @param {Object} scriptInfo - Script info object
   * @returns {boolean} - Whether all dependencies are loaded
   */
  areDependenciesLoaded(scriptInfo) {
    if (!scriptInfo.dependencies || scriptInfo.dependencies.length === 0) {
      return true;
    }

    return scriptInfo.dependencies.every((depId) => {
      // Check all categories for the dependency
      for (const category in this.scripts) {
        const dependency = this.scripts[category].find((script) => script.id === depId);
        if (dependency) {
          return dependency.loaded;
        }
      }
      return false;
    });
  }

  /**
   * Load critical scripts
   */
  loadCriticalScripts() {
    this.scripts.critical.forEach((scriptInfo) => {
      if (!scriptInfo.loaded && !scriptInfo.loading) {
        this.loadScript(scriptInfo);
      }
    });
  }

  /**
   * Load functional scripts
   */
  loadFunctionalScripts() {
    this.scripts.functional.forEach((scriptInfo) => {
      if (!scriptInfo.loaded && !scriptInfo.loading && this.areDependenciesLoaded(scriptInfo)) {
        this.loadScript(scriptInfo);
      }
    });
  }

  /**
   * Load marketing scripts
   */
  loadMarketingScripts() {
    this.scripts.marketing.forEach((scriptInfo) => {
      if (!scriptInfo.loaded && !scriptInfo.loading && this.areDependenciesLoaded(scriptInfo)) {
        this.loadScript(scriptInfo);
      }
    });
  }

  /**
   * Load non-essential scripts
   */
  loadNonEssentialScripts() {
    this.scripts.nonEssential.forEach((scriptInfo) => {
      if (!scriptInfo.loaded && !scriptInfo.loading && this.areDependenciesLoaded(scriptInfo)) {
        this.loadScript(scriptInfo);
      }
    });
  }

  /**
   * Load a script
   * @param {Object} scriptInfo - Script info object
   */
  loadScript(scriptInfo) {
    // Skip if already loaded or loading
    if (scriptInfo.loaded || scriptInfo.loading) {
      return;
    }

    // Check if we've hit the concurrent load limit
    if (this.loadState.concurrentLoads >= this.settings.maxConcurrentLoads) {
      // Try again later
      setTimeout(() => {
        this.loadScript(scriptInfo);
      }, 500);
      return;
    }

    // Mark as loading and increment counter
    scriptInfo.loading = true;
    this.loadState.concurrentLoads++;

    // Create the script element
    const script = document.createElement('script');
    script.src = scriptInfo.src;
    script.id = `script-${scriptInfo.id}`;

    // Add any additional attributes
    if (scriptInfo.attributes) {
      for (const [key, value] of Object.entries(scriptInfo.attributes)) {
        script.setAttribute(key, value);
      }
    }

    // Set up load handler
    script.onload = () => {
      scriptInfo.loaded = true;
      scriptInfo.loading = false;
      this.loadState.concurrentLoads--;

      console.log(`[ScriptController] Loaded script: ${scriptInfo.id}`);

      // Check if this was a dependency for other scripts
      this.checkDependenciesAndLoadMore();

      // Dispatch event
      window.dispatchEvent(
        new CustomEvent('script:loaded', {
          detail: { id: scriptInfo.id },
        })
      );
    };

    // Set up error handler
    script.onerror = () => {
      scriptInfo.loading = false;
      this.loadState.concurrentLoads--;

      console.error(`[ScriptController] Failed to load script: ${scriptInfo.id}`);

      // Dispatch event
      window.dispatchEvent(
        new CustomEvent('script:error', {
          detail: { id: scriptInfo.id },
        })
      );
    };

    // Append the script to the document
    document.body.appendChild(script);
  }

  /**
   * Check for scripts that were waiting on dependencies and load them
   */
  checkDependenciesAndLoadMore() {
    // Check functional scripts
    this.scripts.functional.forEach((scriptInfo) => {
      if (!scriptInfo.loaded && !scriptInfo.loading && this.areDependenciesLoaded(scriptInfo)) {
        this.loadScript(scriptInfo);
      }
    });

    // Check marketing scripts if page has loaded
    if (this.loadState.pageHasLoaded) {
      this.scripts.marketing.forEach((scriptInfo) => {
        if (!scriptInfo.loaded && !scriptInfo.loading && this.areDependenciesLoaded(scriptInfo)) {
          this.loadScript(scriptInfo);
        }
      });
    }

    // Check non-essential scripts if page has loaded and user has interacted
    if (this.loadState.pageHasLoaded && this.loadState.userHasInteracted) {
      this.scripts.nonEssential.forEach((scriptInfo) => {
        if (!scriptInfo.loaded && !scriptInfo.loading && this.areDependenciesLoaded(scriptInfo)) {
          this.loadScript(scriptInfo);
        }
      });
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Delay slightly to prioritize rendering
  setTimeout(() => {
    window.scriptController = new ScriptController();
  }, 50);
});

// Export for module usage
export default ScriptController;
