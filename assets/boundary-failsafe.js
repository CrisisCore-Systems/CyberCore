/**
 * Boundary Failsafe Module
 *
 * Enhanced neural system repair with multi-dimensional memory protection
 * Emergency protection for critical phase transitions.
 * Prevents recursive collapse during system initialization
 * and handles orphaned phase states.
 *
 * @version 1.0.0
 * @phase meta-layer
 */
(function () {
  // Emergency settings
  const EMERGENCY_FALLBACK_PHASE = 'cyber-lotus';
  const CRITICAL_TRANSITION_PATHS = [
    ['rolling-virus', 'trauma-core'],
    ['trauma-core', 'rolling-virus'],
    ['trauma-core', 'trauma-core'], // Self-recursion protection
    ['void-bloom', 'trauma-core'], // VoidBloom specific protection
    ['void-bloom', 'void-bloom'] // VoidBloom self-recursion protection
  ];
  const MAX_TRAUMA_LEVEL = 7; // Cap trauma level during emergency
  const EMERGENCY_STABILIZATION_TIME = 5000; // ms
  const NEURAL_NETWORK_COHERENCE_THRESHOLD = 0.5;
  const VOID_BLOOM_PROFILE_NAME = 'VoidBloom';
  const MEMORY_CHECK_INTERVAL = 30000; // 30 seconds
  const MIME_TYPE_VALIDATION_ENABLED = true;

  // State tracking
  let emergencyMode = false;
  let lastPhase = null;
  let phaseTransitions = [];
  let emergencyStartTime = 0;
  let neuralNetworkCoherence = 0.9; // Start with high coherence
  let assetValidationResults = new Map();
  let memoryCheckIntervalId = null;
  let repairAttempts = 0;
  let voidBloomSpecificFixesApplied = false;

  // CoreProtection system for memory integrity
  const CoreProtection = {
    activeRepairs: new Set(),
    
    // Monitors for corrupted MIME types
    validateMIMEType: async function(assetPath, expectedType) {
      // Check cache first
      const cacheKey = `${assetPath}:${expectedType}`;
      if (assetValidationResults.has(cacheKey)) {
        return assetValidationResults.get(cacheKey);
      }
      
      try {
        // Use HologramMemoryIntegrity if available (preferred)
        if (window.HologramMemoryIntegrity && 
            typeof window.HologramMemoryIntegrity.validateAssetPath === 'function') {
          const result = await window.HologramMemoryIntegrity.validateAssetPath(assetPath, expectedType);
          assetValidationResults.set(cacheKey, result);
          return result;
        }
        
        // Fallback to direct fetch
        const response = await fetch(assetPath, { method: 'HEAD', cache: 'force-cache' });
        const contentType = response.headers.get('content-type');
        
        const result = {
          valid: response.ok && (!expectedType || contentType.includes(expectedType)),
          path: assetPath,
          mimeType: contentType,
          errorCode: response.ok ? null : response.status
        };
        
        assetValidationResults.set(cacheKey, result);
        return result;
      } catch (error) {
        console.warn(`[VOID://FAILSAFE] Asset validation error: ${error.message}`);
        return { valid: false, path: assetPath, mimeType: null, errorCode: 'ERROR' };
      }
    },
    
    // Fix neural path corruption
    repairNeuralPath: async function(assetPath, assetType) {
      // Skip if already repairing this path
      if (this.activeRepairs.has(assetPath)) return null;
      this.activeRepairs.add(assetPath);
      
      try {
        // Use HologramMemoryIntegrity if available (preferred)
        if (window.HologramMemoryIntegrity && 
            typeof window.HologramMemoryIntegrity.fixBrokenNeuralPath === 'function') {
          const fixedPath = await window.HologramMemoryIntegrity.fixBrokenNeuralPath(assetPath, assetType);
          if (fixedPath) {
            console.log(`[VOID://FAILSAFE] Neural path repaired: ${assetPath} -> ${fixedPath}`);
          }
          this.activeRepairs.delete(assetPath);
          return fixedPath;
        }
        
        // Fallback path repair logic
        const pathVariations = [
          assetPath,
          assetPath.replace('/assets/', '/assets/cdn/'),
          assetPath.replace('/assets/', '/cdn/shop/t/5/assets/'),
          window.themeAssetURL ? `${window.themeAssetURL}${assetPath.split('/').pop()}` : null
        ].filter(Boolean);
        
        for (const path of pathVariations) {
          try {
            const response = await fetch(path, { method: 'HEAD' });
            if (response.ok) {
              this.activeRepairs.delete(assetPath);
              return path;
            }
          } catch (e) {
            // Continue to next path
          }
        }
        
        // All attempts failed
        console.warn(`[VOID://FAILSAFE] Failed to repair neural path: ${assetPath}`);
        this.activeRepairs.delete(assetPath);
        return null;
      } catch (error) {
        console.error(`[VOID://FAILSAFE] Error repairing neural path: ${error.message}`);
        this.activeRepairs.delete(assetPath);
        return null;
      }
    },
    
    // Get memory usage statistics
    getMemoryStats: function() {
      let stats = {
        heapUsed: 0,
        heapTotal: 0,
        externalMemory: 0,
        gcCount: 0
      };
      
      // Try to use performance API
      if (window.performance && window.performance.memory) {
        stats.heapUsed = window.performance.memory.usedJSHeapSize;
        stats.heapTotal = window.performance.memory.totalJSHeapSize;
        stats.heapLimit = window.performance.memory.jsHeapSizeLimit;
      }
      
      // Count active objects in renderer if available
      if (window.quantumWebGL && 
          window.quantumWebGL.#state &&
          window.quantumWebGL.#state.memoryLeakMonitor) {
        stats.activeObjects = window.quantumWebGL.#state.memoryLeakMonitor.activeObjects.size;
        stats.disposedObjects = window.quantumWebGL.#state.memoryLeakMonitor.disposedObjects;
      }
      
      return stats;
    },
    
    // Check for memory leaks and corruptions
    runMemoryCheck: async function() {
      console.log('[VOID://FAILSAFE] Running memory integrity check...');
      
      // Check key assets needed for VoidBloom profile
      if (isVoidBloomActive()) {
        const criticalAssets = [
          { path: 'noise-pattern.png', type: 'image/png' },
          { path: 'neural-bus.js', type: 'application/javascript' },
          { path: 'glitch-engine.js', type: 'application/javascript' },
          { path: 'quantum-visualizer.js', type: 'application/javascript' }
        ];
        
        let failedAssets = 0;
        
        for (const asset of criticalAssets) {
          const validation = await this.validateMIMEType(asset.path, asset.type);
          if (!validation.valid) {
            failedAssets++;
            console.warn(`[VOID://FAILSAFE] Critical asset validation failed: ${asset.path}`);
            
            // Try to repair neural path
            const repairedPath = await this.repairNeuralPath(asset.path, asset.type);
            if (repairedPath) {
              console.log(`[VOID://FAILSAFE] Auto-repaired path: ${repairedPath}`);
            }
          }
        }
        
        // Update coherence based on asset validation
        if (criticalAssets.length > 0) {
          const assetCoherence = 1 - (failedAssets / criticalAssets.length);
          updateNeuralNetworkCoherence(assetCoherence, 'asset-validation');
        }
        
        // Apply specific fixes for VoidBloom if needed
        if (failedAssets > 0 && !voidBloomSpecificFixesApplied) {
          applyVoidBloomSpecificFixes();
        }
      }
      
      // Get memory stats
      const memoryStats = this.getMemoryStats();
      
      // Check for potential memory leaks
      if (memoryStats.heapTotal > 0 && 
          memoryStats.heapUsed / memoryStats.heapTotal > 0.9) {
        console.warn('[VOID://FAILSAFE] Potential memory leak detected!');
        triggerMemoryCleanup();
      }
    }
  };

  /**
   * Initialize enhanced failsafe
   */
  function initFailsafe() {
    console.log('[VOID://FAILSAFE] Boundary failsafe initialized with neural system repair.');

    // Get initial phase from HTML classes
    checkInitialPhase();

    // Monitor phase transitions
    monitorPhaseTransitions();

    // Add emergency controls
    addEmergencyControls();
    
    // Start memory integrity checks
    startMemoryIntegrityChecks();
    
    // Connect to neural bus if available
    connectToNeuralBus();
    
    // Register global error handler for asset loading issues
    registerAssetErrorHandlers();
  }

  /**
   * Check if VoidBloom is the active profile
   */
  function isVoidBloomActive() {
    if (document.body && document.body.getAttribute('data-mutation-profile') === VOID_BLOOM_PROFILE_NAME) {
      return true;
    }
    
    // Check localStorage for stored profile
    if (window.localStorage) {
      const storedProfile = localStorage.getItem('voidbloom_mutation_profile');
      if (storedProfile === VOID_BLOOM_PROFILE_NAME) {
        return true;
      }
    }
    
    // Check meta tag
    const metaProfile = document.querySelector('meta[name="mutation-profile"]');
    if (metaProfile && metaProfile.getAttribute('content') === VOID_BLOOM_PROFILE_NAME) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Apply VoidBloom specific fixes
   */
  function applyVoidBloomSpecificFixes() {
    console.log('[VOID://FAILSAFE] Applying VoidBloom specific fixes...');
    
    voidBloomSpecificFixesApplied = true;
    
    // 1. Inject truth node meta tag if not present
    if (!document.querySelector('meta[name="asset-path"]')) {
      const metaTag = document.createElement('meta');
      metaTag.setAttribute('name', 'asset-path');
      metaTag.setAttribute('content', window.themeAssetURL || '/assets/');
      document.head.appendChild(metaTag);
      console.log('[VOID://FAILSAFE] Injected asset-path meta tag');
    }
    
    // 2. Create backup noise pattern if needed
    if (!window.quantumVisualizer || !window.quantumVisualizer.noisePattern || 
        !window.quantumVisualizer.noisePattern.complete) {
      createBackupNoisePattern();
    }
    
    // 3. Force neural bus window exposure
    if (typeof window.NeuralBus === 'undefined' || !window.NeuralBus.publish) {
      createMinimalNeuralBus();
    }
    
    // 4. Notify other systems of the repair
    if (typeof window.NeuralBus !== 'undefined' && window.NeuralBus.publish) {
      window.NeuralBus.publish('repair:completed', {
        profile: VOID_BLOOM_PROFILE_NAME,
        timestamp: Date.now(),
        repairType: 'specific-fixes',
        coherence: neuralNetworkCoherence
      });
    }
  }
  
  /**
   * Start memory integrity checks
   */
  function startMemoryIntegrityChecks() {
    // Run initial check
    CoreProtection.runMemoryCheck();
    
    // Set up recurring check
    memoryCheckIntervalId = setInterval(() => {
      CoreProtection.runMemoryCheck();
    }, MEMORY_CHECK_INTERVAL);
    
    // One-time deep check after 5 seconds (allows page to fully load)
    setTimeout(() => {
      runDeepIntegrityCheck();
    }, 5000);
  }
  
  /**
   * Run deep integrity check
   */
  function runDeepIntegrityCheck() {
    console.log('[VOID://FAILSAFE] Running deep integrity check...');
    
    // Check for script errors
    if (window.quantumVisualizer && window.quantumWebGL) {
      console.log('[VOID://FAILSAFE] Core quantum systems loaded');
    } else {
      console.warn('[VOID://FAILSAFE] Core quantum systems missing, attempting recovery');
      recoverMissingCoreSystems();
    }
    
    // Check for critical coherence issues
    if (neuralNetworkCoherence < NEURAL_NETWORK_COHERENCE_THRESHOLD) {
      console.warn(`[VOID://FAILSAFE] Low neural network coherence: ${neuralNetworkCoherence}`);
      triggerEmergencyMode();
    }
  }
  
  /**
   * Recover missing core systems
   */
  function recoverMissingCoreSystems() {
    // Increment repair attempts
    repairAttempts++;
    
    if (repairAttempts > 3) {
      console.error('[VOID://FAILSAFE] Maximum repair attempts reached, triggering emergency mode');
      triggerEmergencyMode();
      return;
    }
    
    const missingScripts = [];
    
    // Check for core scripts and reload if missing
    if (typeof window.NeuralBus === 'undefined' || !window.NeuralBus.publish) {
      missingScripts.push('neural-bus.js');
    }
    
    if (!window.quantumVisualizer) {
      missingScripts.push('quantum-visualizer.js');
    }
    
    if (!window.quantumWebGL) {
      missingScripts.push('quantum-webgl.js');
    }
    
    // Inject missing scripts
    missingScripts.forEach(script => {
      console.log(`[VOID://FAILSAFE] Reloading missing script: ${script}`);
      const scriptEl = document.createElement('script');
      
      // Get path from truth node or use default
      const basePath = window.themeAssetURL || '/assets/';
      scriptEl.src = `${basePath}${script}`;
      scriptEl.async = true;
      
      // Inject to head
      document.head.appendChild(scriptEl);
    });
  }
  
  /**
   * Create backup noise pattern
   */
  function createBackupNoisePattern() {
    console.log('[VOID://FAILSAFE] Creating backup noise pattern');
    
    try {
      // Create canvas for procedural noise
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        console.error('[VOID://FAILSAFE] Failed to get canvas context');
        return;
      }
      
      // Fill with black base
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add noise
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const value = Math.floor(Math.random() * 255);
          ctx.fillStyle = `rgb(${value},${value},${value})`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
      
      // Create a backup Image
      const backupNoisePattern = new Image();
      backupNoisePattern.src = canvas.toDataURL();
      
      // Add to window for global access if visualizer doesn't exist
      if (!window.quantumVisualizer) {
        window.quantumVisualizer = {
          noisePattern: backupNoisePattern,
          ready: true,
          initialized: true
        };
        console.log('[VOID://FAILSAFE] Created minimal quantum visualizer with backup pattern');
      } else if (window.quantumVisualizer && !window.quantumVisualizer.noisePattern) {
        window.quantumVisualizer.noisePattern = backupNoisePattern;
        console.log('[VOID://FAILSAFE] Added backup pattern to existing quantum visualizer');
      }
    } catch (e) {
      console.error('[VOID://FAILSAFE] Failed to create backup noise pattern', e);
    }
  }
  
  /**
   * Create minimal neural bus
   */
  function createMinimalNeuralBus() {
    console.log('[VOID://FAILSAFE] Creating minimal neural bus implementation');
    
    window.NeuralBus = {
      systems: new Map(),
      events: [],
      subscribers: {},
      registerSystem: function(id, system) {
        this.systems.set(id, system);
        console.log(`[VOID://FAILSAFE] Registered system: ${id}`);
        return this;
      },
      subscribe: function(channel, callback) {
        if (!this.subscribers[channel]) {
          this.subscribers[channel] = [];
        }
        this.subscribers[channel].push(callback);
        
        return {
          unsubscribe: () => {
            const index = this.subscribers[channel].indexOf(callback);
            if (index !== -1) {
              this.subscribers[channel].splice(index, 1);
              return true;
            }
            return false;
          }
        };
      },
      publish: function(channel, data) {
        this.events.push({ channel, data, timestamp: Date.now() });
        
        if (this.subscribers[channel]) {
          this.subscribers[channel].forEach(callback => {
            try {
              callback(data);
            } catch (e) {
              console.error(`[VOID://FAILSAFE] Error in neural bus subscriber: ${e.message}`);
            }
          });
        }
        
        return data;
      }
    };
    
    // Announce the minimal implementation
    window.NeuralBus.publish('system:initialized', {
      type: 'minimal',
      timestamp: Date.now(),
      source: 'boundary-failsafe'
    });
  }
  
  /**
   * Connect to neural bus
   */
  function connectToNeuralBus() {
    if (typeof window.NeuralBus !== 'undefined') {
      // Subscribe to coherence updates
      try {
        window.NeuralBus.subscribe('coherence:changed', data => {
          if (data && typeof data.coherence === 'number') {
            updateNeuralNetworkCoherence(data.coherence, 'neural-bus');
          }
        });
        
        // Subscribe to trauma events
        window.NeuralBus.subscribe('trauma:activated', data => {
          if (data && data.type) {
            console.log(`[VOID://FAILSAFE] Trauma activated: ${data.type}`);
            checkTraumaLevel();
          }
        });
        
        // Announce failsafe presence
        window.NeuralBus.publish('failsafe:initialized', {
          version: '1.0.0',
          timestamp: Date.now(),
          mimeValidation: MIME_TYPE_VALIDATION_ENABLED,
          coherenceMonitoring: true
        });
        
        console.log('[VOID://FAILSAFE] Connected to neural bus');
      } catch (e) {
        console.error(`[VOID://FAILSAFE] Error connecting to neural bus: ${e.message}`);
      }
    } else {
      console.warn('[VOID://FAILSAFE] Neural bus not available, creating minimal implementation');
      createMinimalNeuralBus();
      connectToNeuralBus(); // Retry with our minimal implementation
    }
  }
  
  /**
   * Register asset error handlers
   */
  function registerAssetErrorHandlers() {
    // Monitor for image loading errors
    window.addEventListener('error', event => {
      const target = event.target;
      
      // Skip non-asset errors
      if (!target || !(target instanceof HTMLImageElement || target instanceof HTMLScriptElement)) {
        return;
      }
      
      // Get asset path from src
      const assetPath = target.src;
      if (!assetPath) return;
      
      console.warn(`[VOID://FAILSAFE] Asset loading error: ${assetPath}`);
      
      // Try to fix the path
      CoreProtection.repairNeuralPath(assetPath).then(fixedPath => {
        if (fixedPath && fixedPath !== assetPath) {
          console.log(`[VOID://FAILSAFE] Fixed asset path: ${fixedPath}`);
          target.src = fixedPath;
        }
      });
      
      // Update coherence
      updateNeuralNetworkCoherence(neuralNetworkCoherence - 0.05, 'asset-error');
    }, true);
  }
  
  /**
   * Update neural network coherence
   */
  function updateNeuralNetworkCoherence(newCoherence, source) {
    // Clamp between 0 and 1
    newCoherence = Math.max(0, Math.min(1, newCoherence));
    
    // Only update if significant change
    if (Math.abs(newCoherence - neuralNetworkCoherence) > 0.01) {
      const oldCoherence = neuralNetworkCoherence;
      neuralNetworkCoherence = newCoherence;
      
      console.log(`[VOID://FAILSAFE] Neural coherence updated: ${oldCoherence.toFixed(2)} -> ${newCoherence.toFixed(2)} (${source})`);
      
      // Check if we need to trigger emergency mode
      if (newCoherence < NEURAL_NETWORK_COHERENCE_THRESHOLD && oldCoherence >= NEURAL_NETWORK_COHERENCE_THRESHOLD) {
        console.warn('[VOID://FAILSAFE] Coherence dropped below threshold!');
        triggerEmergencyMode();
      }
      
      // Announce coherence change
      if (typeof window.NeuralBus !== 'undefined') {
        window.NeuralBus.publish('coherence:changed', {
          coherence: newCoherence,
          previous: oldCoherence,
          source: 'boundary-failsafe',
          timestamp: Date.now()
        });
      }
    }
  }
  
  /**
   * Trigger memory cleanup
   */
  function triggerMemoryCleanup() {
    console.log('[VOID://FAILSAFE] Triggering memory cleanup');
    
    // Try to dispose unused resources
    if (window.quantumWebGL && typeof window.quantumWebGL.dispose === 'function') {
      // Only dispose if we have multiple instances (a sign of memory leak)
      const instanceCount = document.querySelectorAll('#quantum-webgl-canvas').length;
      if (instanceCount > 1) {
        console.log(`[VOID://FAILSAFE] Disposing ${instanceCount - 1} redundant WebGL instances`);
        
        // Keep only the first canvas, remove others
        const canvases = document.querySelectorAll('#quantum-webgl-canvas');
        for (let i = 1; i < canvases.length; i++) {
          canvases[i].remove();
        }
      }
    }
    
    // Force garbage collection via neural bus
    if (typeof window.NeuralBus !== 'undefined') {
      window.NeuralBus.publish('memory:cleanup', {
        source: 'boundary-failsafe',
        timestamp: Date.now()
      });
    }
  }

  /**
   * Check initial phase from HTML classes
   */
  function checkInitialPhase() {
    const html = document.documentElement;

    if (html.classList.contains('phase-cyber-lotus')) {
      lastPhase = 'cyber-lotus';
    } else if (html.classList.contains('phase-alien-flora')) {
      lastPhase = 'alien-flora';
    } else if (html.classList.contains('phase-rolling-virus')) {
      lastPhase = 'rolling-virus';
    } else if (html.classList.contains('phase-trauma-core')) {
      lastPhase = 'trauma-core';
    } else if (html.classList.contains('phase-void-bloom')) {
      lastPhase = 'void-bloom';
    } else {
      lastPhase = EMERGENCY_FALLBACK_PHASE;
      applyEmergencyPhase();
    }
  }

  /**
   * Apply emergency phase
   */
  function applyEmergencyPhase() {
    const html = document.documentElement;
    
    // Remove all phase classes
    html.classList.remove('phase-cyber-lotus', 'phase-alien-flora', 'phase-rolling-virus', 'phase-trauma-core', 'phase-void-bloom');
    
    // Add emergency phase class
    html.classList.add(`phase-${EMERGENCY_FALLBACK_PHASE}`);
    
    console.warn(`[VOID://FAILSAFE] Emergency fallback phase applied: ${EMERGENCY_FALLBACK_PHASE}`);
  }
  
  /**
   * Check trauma level
   */
  function checkTraumaLevel() {
    // Check for trauma level in neural bus state
    if (typeof window.NeuralBus !== 'undefined' && window.NeuralBus.systemState) {
      const traumaLevel = window.NeuralBus.systemState.traumaLevel || 0;
      
      if (traumaLevel > MAX_TRAUMA_LEVEL) {
        console.warn(`[VOID://FAILSAFE] Trauma level exceeds maximum: ${traumaLevel} > ${MAX_TRAUMA_LEVEL}`);
        
        // Cap trauma level
        window.NeuralBus.systemState.traumaLevel = MAX_TRAUMA_LEVEL;
        
        // Announce capped trauma
        window.NeuralBus.publish('trauma:capped', {
          level: MAX_TRAUMA_LEVEL,
          original: traumaLevel,
          timestamp: Date.now()
        });
      }
    }
  }

  /**
   * Record phase transition
   */
  function recordTransition(fromPhase, toPhase) {
    phaseTransitions.push({ from: fromPhase, to: toPhase, timestamp: Date.now() });
    console.log(`[VOID://FAILSAFE] Phase transition recorded: ${fromPhase} -> ${toPhase}`);

    // Check for critical transitions
    if (isCriticalTransition(fromPhase, toPhase)) {
      triggerEmergencyMode();
    }
    
    // Update neural coherence based on transition
    if (toPhase === 'void-bloom') {
      // VoidBloom transitions require special handling
      updateNeuralNetworkCoherence(neuralNetworkCoherence - 0.1, 'void-bloom-transition');
      
      // Apply specific fixes if needed
      if (!voidBloomSpecificFixesApplied) {
        setTimeout(() => {
          applyVoidBloomSpecificFixes();
        }, 1000);
      }
    }
  }

  /**
   * Check if transition is critical
   */
  function isCriticalTransition(fromPhase, toPhase) {
    return CRITICAL_TRANSITION_PATHS.some((path) => path[0] === fromPhase && path[1] === toPhase);
  }

  /**
   * Trigger emergency mode
   */
  function triggerEmergencyMode() {
    if (emergencyMode) return;
    emergencyMode = true;
    emergencyStartTime = Date.now();
    console.error('[VOID://FAILSAFE] Emergency mode triggered!');

    // Apply emergency fallback phase
    applyEmergencyPhase();
    
    // Notify via neural bus
    if (typeof window.NeuralBus !== 'undefined') {
      window.NeuralBus.publish('emergency:activated', {
        source: 'boundary-failsafe',
        timestamp: Date.now(),
        coherence: neuralNetworkCoherence
      });
    }

    // Stabilize system
    setTimeout(() => {
      emergencyMode = false;
      console.log('[VOID://FAILSAFE] Emergency mode stabilized.');
      
      // Reset coherence
      updateNeuralNetworkCoherence(0.7, 'emergency-recovery');
      
      // Run deep integrity check
      runDeepIntegrityCheck();
      
      // Notify recovery via neural bus
      if (typeof window.NeuralBus !== 'undefined') {
        window.NeuralBus.publish('emergency:deactivated', {
          source: 'boundary-failsafe',
          timestamp: Date.now(),
          coherence: neuralNetworkCoherence
        });
      }
    }, EMERGENCY_STABILIZATION_TIME);
  }

  /**
   * Monitor phase transitions via class changes
   */
  function monitorPhaseTransitions() {
    // Create mutation observer for HTML classes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const html = document.documentElement;
          let currentPhase = null;

          // Determine current phase from classes
          if (html.classList.contains('phase-cyber-lotus')) {
            currentPhase = 'cyber-lotus';
          } else if (html.classList.contains('phase-alien-flora')) {
            currentPhase = 'alien-flora';
          } else if (html.classList.contains('phase-rolling-virus')) {
            currentPhase = 'rolling-virus';
          } else if (html.classList.contains('phase-trauma-core')) {
            currentPhase = 'trauma-core';
          } else if (html.classList.contains('phase-void-bloom')) {
            currentPhase = 'void-bloom';
          }

          // Skip if no change
          if (currentPhase === lastPhase || !currentPhase) return;

          // Record transition
          recordTransition(lastPhase, currentPhase);

          // Update last phase
          lastPhase = currentPhase;
        }
      });
    });

    // Observe HTML element for class changes
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }

  /**
   * Add emergency controls
   */
  function addEmergencyControls() {
    // Create hidden emergency control UI element
    const controlElement = document.createElement('div');
    controlElement.id = 'boundary-failsafe-control';
    controlElement.style.cssText = 'position:fixed;bottom:-1px;right:-1px;background:rgba(0,0,0,0.5);color:#0f0;font-family:monospace;font-size:10px;padding:2px 5px;z-index:99999;opacity:0.1;transition:opacity 0.3s;';
    controlElement.textContent = 'FAILSAFE';
    
    // Add hover effect
    controlElement.addEventListener('mouseenter', () => {
      controlElement.style.opacity = '1';
    });
    
    controlElement.addEventListener('mouseleave', () => {
      controlElement.style.opacity = '0.1';
    });
    
    // Add click handler to show status
    controlElement.addEventListener('click', () => {
      showFailsafeStatus();
    });
    
    // Add to document
    document.body.appendChild(controlElement);
    
    console.log('[VOID://FAILSAFE] Emergency controls added.');
  }
  
  /**
   * Show failsafe status
   */
  function showFailsafeStatus() {
    console.group('[VOID://FAILSAFE] System Status');
    console.log(`Current phase: ${lastPhase}`);
    console.log(`Neural coherence: ${neuralNetworkCoherence.toFixed(2)}`);
    console.log(`Emergency mode: ${emergencyMode}`);
    console.log(`VoidBloom active: ${isVoidBloomActive()}`);
    console.log(`Specific fixes applied: ${voidBloomSpecificFixesApplied}`);
    console.log(`Memory protection: ${MIME_TYPE_VALIDATION_ENABLED}`);
    console.log(`Last transition: ${phaseTransitions.length > 0 ? `${phaseTransitions[phaseTransitions.length - 1].from} -> ${phaseTransitions[phaseTransitions.length - 1].to}` : 'None'}`);
    console.groupEnd();
    
    // Create temporary status overlay
    const statusOverlay = document.createElement('div');
    statusOverlay.style.cssText = 'position:fixed;bottom:20px;right:20px;background:rgba(0,0,0,0.8);color:#0f0;font-family:monospace;font-size:12px;padding:10px;border:1px solid #0f0;z-index:99999;max-width:300px;';
    
    statusOverlay.innerHTML = `
      <div style="margin-bottom:5px;font-weight:bold;border-bottom:1px solid #0f0;">BOUNDARY FAILSAFE STATUS</div>
      <div>Phase: ${lastPhase}</div>
      <div>Coherence: ${neuralNetworkCoherence.toFixed(2)}</div>
      <div>Emergency: ${emergencyMode ? 'ACTIVE' : 'Inactive'}</div>
      <div>VoidBloom: ${isVoidBloomActive() ? 'ACTIVE' : 'Inactive'}</div>
      <div>Fixes: ${voidBloomSpecificFixesApplied ? 'Applied' : 'Not Applied'}</div>
      <div>Asset Protection: ${MIME_TYPE_VALIDATION_ENABLED ? 'Active' : 'Inactive'}</div>
    `;
    
    // Add close button
    const closeButton = document.createElement('div');
    closeButton.style.cssText = 'position:absolute;top:5px;right:5px;cursor:pointer;';
    closeButton.textContent = 'X';
    closeButton.addEventListener('click', () => {
      document.body.removeChild(statusOverlay);
    });
    
    statusOverlay.appendChild(closeButton);
    document.body.appendChild(statusOverlay);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (document.body.contains(statusOverlay)) {
        document.body.removeChild(statusOverlay);
      }
    }, 10000);
  }

  // Cleanup function to remove interval when page unloads
  function cleanup() {
    if (memoryCheckIntervalId) {
      clearInterval(memoryCheckIntervalId);
    }
    
    console.log('[VOID://FAILSAFE] Boundary failsafe cleaned up');
  }

  // Add cleanup handler
  window.addEventListener('beforeunload', cleanup);

  // Initialize failsafe on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFailsafe);
  } else {
    initFailsafe();
  }
})();
