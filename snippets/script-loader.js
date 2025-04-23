/**
 * SCRIPT-LOADER.JS
 * Optimized script loading for improved performance
 * @Version: 1.0.0
 * @Optimized: April 2025
 */

// Script loading priority levels
const PRIORITY = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  IDLE: 'idle',
};

// Script registry
const scriptRegistry = {
  critical: [],
  high: [],
  medium: [],
  low: [],
  idle: [],
};

// Queue a script to be loaded
function queueScript(src, priority = PRIORITY.MEDIUM, options = {}) {
  const script = {
    src,
    loaded: false,
    options,
  };

  scriptRegistry[priority].push(script);
  return script;
}

// Preload a script (fetch only, don't execute)
function preloadScript(src) {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'script';
  link.href = src;
  document.head.appendChild(link);
}

// Load a script dynamically
function loadScript(script) {
  return new Promise((resolve, reject) => {
    const scriptElement = document.createElement('script');
    scriptElement.src = script.src;

    // Apply options
    if (script.options.async) scriptElement.async = true;
    if (script.options.defer) scriptElement.defer = true;
    if (script.options.module) scriptElement.type = 'module';
    if (script.options.nomodule) scriptElement.nomodule = true;
    if (script.options.integrity) scriptElement.integrity = script.options.integrity;
    if (script.options.crossOrigin) scriptElement.crossOrigin = script.options.crossOrigin;

    scriptElement.onload = () => {
      script.loaded = true;
      resolve(script);
    };

    scriptElement.onerror = (error) => {
      console.error(`Error loading script ${script.src}:`, error);
      reject(error);
    };

    document.head.appendChild(scriptElement);
  });
}

// Load scripts by priority
async function loadScriptsByPriority(priority) {
  const scripts = scriptRegistry[priority];

  // Load scripts in parallel
  const promises = scripts.filter((script) => !script.loaded).map((script) => loadScript(script));

  return Promise.all(promises);
}

// Initialize script loading
function initScriptLoader() {
  // Load critical scripts immediately
  loadScriptsByPriority(PRIORITY.CRITICAL);

  // Load high priority scripts after DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    loadScriptsByPriority(PRIORITY.HIGH);

    // Load medium priority scripts after a short delay
    setTimeout(() => {
      loadScriptsByPriority(PRIORITY.MEDIUM);
    }, 500);
  });

  // Load low priority scripts after page load
  window.addEventListener('load', () => {
    loadScriptsByPriority(PRIORITY.LOW);
  });

  // Load idle priority scripts when browser is idle
  if ('requestIdleCallback' in window) {
    requestIdleCallback(
      () => {
        loadScriptsByPriority(PRIORITY.IDLE);
      },
      { timeout: 5000 }
    );
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      loadScriptsByPriority(PRIORITY.IDLE);
    }, 3000);
  }
}

// Exposed API
window.VoidBloomScriptLoader = {
  PRIORITY,
  queueScript,
  preloadScript,
  loadScript,
};

// Auto-initialize
initScriptLoader();
