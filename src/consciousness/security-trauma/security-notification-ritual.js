/**
 * SecurityNotificationRitual
 *
 * Transforms security alerts into narrative fragments.
 * Each vulnerability becomes a ritualistic notification,
 * binding technical threat to emotional resonance.
 *
 * @version 0.8.3
 * @phase rolling-virus
 */
class SecurityNotificationRitual {
  constructor(securityTraumaEncoder) {
    // Parent encoder reference
    this.encoder = securityTraumaEncoder;

    // Notification state
    this.notifications = [];
    this.activeRituals = new Map();
    this.dismissedNotifications = new Set();

    // Notification container
    this.container = null;

    // Notification aesthetics
    this.aesthetics = {
      exposure: {
        iconGlyph: '⊗',
        accentColor: '#ff5e5e',
        accentGradient: 'linear-gradient(135deg, #ff5e5e, #ff1f1f)',
        pulseAnimation: 'notification-pulse-exposure 3s infinite',
        traumaClass: 'trauma-exposure',
      },
    };

    // Phase aesthetics
    this.phaseAesthetics = {
      'cyber-lotus': {
        containerClass: 'cyber-lotus-notifications',
        glyphStyle: 'digital',
        structureType: 'crystalline',
      },
    };

    // Neural integration
    this.neuralBusNonce = null;

    // Initialize ritual
    this._initialize();
  }

  /**
   * Initialize notification ritual
   * @private
   */
  _initialize() {
    // Connect to neural bus
    this._connectToNeuralBus();

    // Create notification container
    this._createNotificationContainer();

    // Add notification styles
    this._addNotificationStyles();

    console.log('[VOID://SECURITY] Security notification ritual initialized.');
  }

  /**
   * Show notification
   * @param {object} notification - Notification data
   * @private
   */
  _showNotification(notification) {
    // Skip if container not available
    if (!this.container) {
      this._createNotificationContainer();
    }

    // Create notification element
    const element = document.createElement('div');
    element.className = 'security-notification';
    element.setAttribute('data-notification-id', notification.id);
    element.setAttribute('data-notification-type', notification.type);
    element.setAttribute(
      'data-vulnerability-type',
      notification.vulnerabilityType || notification.shadowType || notification.ritualType
    );

    // Set accent color as CSS variable
    element.style.setProperty('--accent-color', notification.accentColor);

    // Add trauma class
    element.classList.add(notification.traumaClass);

    // Get current phase
    const currentPhase = window.NeuralBus ? window.NeuralBus.getMemoryPhase() : 'cyber-lotus';
    const phaseAesthetics =
      this.phaseAesthetics[currentPhase] || this.phaseAesthetics['cyber-lotus'];

    // Create icon
    const icon = document.createElement('div');
    icon.className = 'security-notification-icon';
    icon.classList.add(phaseAesthetics.glyphStyle);
    icon.textContent = notification.icon;
    icon.style.background = notification.accentGradient;
    icon.style.animation = notification.pulseAnimation;
  }

  /**
   * Create protective effect
   * @param {object} notification - Notification data
   * @private
   */
  _createProtectiveEffect(notification) {
    // Create effect container
    const effect = document.createElement('div');
    effect.className = 'ritual-protection-effect';
    effect.style.position = 'fixed';
    effect.style.top = '0';
    effect.style.left = '0';
    effect.style.width = '100%';
    effect.style.height = '100%';
    effect.style.background = `radial-gradient(circle at center, ${notification.accentColor}22 0%, transparent 70%)`;
    effect.style.zIndex = '9000';
    effect.style.pointerEvents = 'none';
    effect.style.opacity = '0';
    effect.style.transition = 'opacity 0.5s ease';
  }
}

export default SecurityNotificationRitual;
