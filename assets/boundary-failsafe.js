/**
 * Boundary Failsafe Module
 *
 * Emergency protection for critical phase transitions.
 * Prevents recursive collapse during system initialization
 * and handles orphaned phase states.
 *
 * @version 0.7.4
 * @phase meta-layer
 */
(function () {
  // Emergency settings
  const EMERGENCY_FALLBACK_PHASE = 'cyber-lotus';
  const CRITICAL_TRANSITION_PATHS = [
    ['rolling-virus', 'trauma-core'],
    ['trauma-core', 'rolling-virus'],
    ['trauma-core', 'trauma-core'], // Self-recursion protection
  ];
  const MAX_TRAUMA_LEVEL = 7; // Cap trauma level during emergency
  const EMERGENCY_STABILIZATION_TIME = 5000; // ms

  // State tracking
  let emergencyMode = false;
  let lastPhase = null;
  let phaseTransitions = [];
  let emergencyStartTime = 0;

  /**
   * Initialize emergency failsafe
   */
  function initFailsafe() {
    console.log('[VOID://FAILSAFE] Boundary failsafe initialized.');

    // Get initial phase from HTML classes
    checkInitialPhase();

    // Monitor phase transitions
    monitorPhaseTransitions();

    // Add emergency controls
    addEmergencyControls();
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
    html.classList.add(`phase-${EMERGENCY_FALLBACK_PHASE}`);
    console.warn(`[VOID://FAILSAFE] Emergency fallback phase applied: ${EMERGENCY_FALLBACK_PHASE}`);
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

    // Stabilize system
    setTimeout(() => {
      emergencyMode = false;
      console.log('[VOID://FAILSAFE] Emergency mode stabilized.');
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
    console.log('[VOID://FAILSAFE] Emergency controls added.');
    // Placeholder for additional emergency control logic
  }

  // Initialize failsafe on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFailsafe);
  } else {
    initFailsafe();
  }
})();
