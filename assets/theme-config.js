window.voidBloom = window.voidBloom || {};
window.voidBloom.config = {
  // Theme settings
  theme: {
    version: '1.0.0',
    traumaProfiles: ['void', 'glitch', 'quantum', 'memory'],
    defaultProfile: 'void',
    memoryPhases: ['alpha', 'beta', 'gamma', 'omega'],
    defaultPhase: 'alpha',
  },

  // Feature flags
  features: {
    quantumVisualizer: true,
    traumaEncoding: true,
    glitchEffects: true,
  },

  // Animation settings
  animations: {
    duration: 400,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },

  // API endpoints
  api: {
    traumaSync: '/api/trauma-sync',
    memoryPhaseUpdate: '/api/memory-phase',
  },
};

// Initialize theme configurations
document.addEventListener('DOMContentLoaded', function () {
  const body = document.body;
  const config = window.voidBloom.config;

  // Set data attributes for trauma profile and memory phase
  body.setAttribute('data-trauma-profile', config.theme.defaultProfile);
  body.setAttribute('data-memory-phase', config.theme.defaultPhase);

  // Add corresponding classes
  body.classList.add(`trauma-${config.theme.defaultProfile}`);
  body.classList.add(`phase-${config.theme.defaultPhase}`);
});
