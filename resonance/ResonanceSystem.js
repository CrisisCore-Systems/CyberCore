/**
 * ResonanceSystem - Transforms scalar trauma values into multidimensional vectors
 * for propagation of coherent emotional states throughout system architecture.
 */
class ResonanceSystem {
  constructor(config = {}) {
    this.config = {
      defaultPhase: 'cyber-lotus',
      defaultWaveform: 'sine',
      ...config,
    };

    // Valid system components
    this.validComponents = [
      'all',
      'neural-architecture',
      'memory-vessel',
      'security-trauma',
      'commerce-integration',
      'prompt-engine',
      'integration-layer',
    ];
  }

  /**
   * Creates a multidimensional resonance field from trauma value
   * Enhanced implementation with full configurability
   *
   * @param {number} normalizedTrauma - Trauma value [0,1]
   * @param {string} component - Target component or 'all'
   * @param {object} context - System context information
   * @returns {object} Resonance vector with dimensional coordinates
   */
  createResonanceField(normalizedTrauma, component, context = {}) {
    // Extract context values with defaults
    const {
      phase = this.config.defaultPhase,
      userActivity = 'browsing',
      timeSincePhaseTransition = 0,
      systemStability = 1.0,
      waveform = this.config.defaultWaveform,
      customZCurve = null,
      phaseShift = 0,
      range = [0, 1],
      strengthModulator = null,
      coherenceDrift = null,
    } = context;

    // Validate and normalize inputs
    const t = this._normalizeTraumaInput(normalizedTrauma);
    const validComponent = this._validateComponent(component) ? component : 'all';

    // Get phase-specific parameters
    const ellipticalParams = this._getPhaseEllipticalParameters(phase);
    const zCurve = customZCurve ?? this._getPhaseZCurve(phase);

    // Calculate dimensional coordinates
    let x, y;

    if (waveform === 'elliptical') {
      // Use elliptical path for XY coordinates
      [x, y] = this._calculateEllipticalPath(t, ellipticalParams);
    } else {
      // Use standard waveform for XY coordinates
      [x, y] = this._calculateXYDimensions(t, waveform, phaseShift, range);
    }

    // Calculate Z dimension with appropriate curve
    const z = this._calculateZDimension(t, zCurve);

    // Calculate dynamic strength and coherence
    const strength = strengthModulator
      ? strengthModulator(t, validComponent, context)
      : this._calculateStrengthModulation(t, validComponent, context);

    const coherence = coherenceDrift
      ? coherenceDrift(t, validComponent, context)
      : this._calculateCoherenceDrift(t, validComponent, context);

    // Create component resonance map
    const componentMap = this._createComponentResonanceMap(t, validComponent, context);

    // Create complete resonance field
    return {
      x, // Oscillatory dimension
      y, // Phase-shifted dimension
      z, // Direct trauma mapping
      component: validComponent, // Target component
      componentMap, // Multi-component targeting
      strength, // Amplitude coefficient
      coherence, // Binding stability
      __meta: {
        traumaInput: t,
        waveform,
        phase,
        zCurve,
        phaseShift,
        ellipticalParams,
        timestamp: Date.now(),
      },
    };
  }

  /**
   * Validates trauma value and ensures it's within acceptable range
   * Enhanced with better error handling
   *
   * @param {number} trauma - Raw trauma value to validate
   * @returns {number} Normalized trauma value
   * @throws {Error} If trauma is not a valid number and throwOnInvalid is true
   */
  _normalizeTraumaInput(trauma) {
    // Check for NaN, undefined, etc.
    if (typeof trauma !== 'number' || !isFinite(trauma)) {
      console.error(`[VOID://RESONANCE] Invalid trauma value: ${trauma}`);
      // Fail gracefully with default value
      return 0.5; // Neutral trauma state
    }

    // Clamp to valid range
    return Math.max(0, Math.min(1, trauma));
  }

  /**
   * Validates component identifier against registry
   *
   * @param {string} component - Component identifier to validate
   * @returns {boolean} True if component is valid
   */
  _validateComponent(component) {
    if (!component) return false;
    return this.validComponents.includes(component);
  }

  /**
   * Calculates X and Y dimensions based on trauma value and waveform type
   *
   * @param {number} t - Normalized trauma in range [0,1]
   * @param {string} waveform - Waveform type ('sine', 'triangle', 'sawtooth')
   * @param {number} phaseShift - Phase rotation in radians
   * @param {Array} range - Output range [min, max]
   * @returns {Array} Calculated [x, y] coordinates
   */
  _calculateXYDimensions(t, waveform, phaseShift, range) {
    // Calculate angular position (0 to 2π)
    const angle = t * Math.PI * 2 + phaseShift;

    // Calculate raw x-value based on waveform
    let rawX, rawY;

    switch (waveform) {
      case 'triangle':
        // Triangle wave: sharper transitions between extremes
        rawX = this._triangleWave(angle);
        rawY = this._triangleWave(angle + Math.PI / 2); // 90° phase shift
        break;

      case 'sawtooth':
        // Sawtooth wave: building tension, sudden release
        rawX = this._sawtoothWave(angle);
        rawY = this._sawtoothWave(angle + Math.PI / 2); // 90° phase shift
        break;

      case 'square':
        // Square wave: binary emotional states
        rawX = this._squareWave(angle);
        rawY = this._squareWave(angle + Math.PI / 2); // 90° phase shift
        break;

      case 'pulse':
        // Pulse wave: asymmetric emotional states
        rawX = this._pulseWave(angle, 0.3);
        rawY = this._pulseWave(angle + Math.PI / 2, 0.3); // 90° phase shift
        break;

      case 'noise':
        // Noise-modulated wave: unstable emotional vectors
        rawX = this._noiseModulatedWave(angle, 0.2);
        rawY = this._noiseModulatedWave(angle + Math.PI / 2, 0.2); // 90° phase shift
        break;

      case 'sine':
      default:
        // Sine wave: smooth oscillation (default)
        rawX = Math.sin(angle);
        rawY = Math.cos(angle); // 90° phase shift
    }

    // Normalize from [-1,1] to specified range
    const [min, max] = range;
    const normalized = (val) => ((val + 1) / 2) * (max - min) + min;

    return [normalized(rawX), normalized(rawY)];
  }

  // Waveform generators

  /**
   * Generates triangle wave value for given angle
   *
   * @param {number} angle - Angle in radians
   * @returns {number} Wave value in range [-1,1]
   */
  _triangleWave(angle) {
    // Normalize angle to [0, 2π]
    const normalizedAngle = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

    // Calculate triangle wave
    if (normalizedAngle < Math.PI / 2) {
      // Rising from 0 to 1 (0° to 90°)
      return normalizedAngle / (Math.PI / 2);
    } else if (normalizedAngle < (Math.PI * 3) / 2) {
      // Falling from 1 to -1 (90° to 270°)
      return 1 - ((normalizedAngle - Math.PI / 2) / (Math.PI / 2)) * 2;
    } else {
      // Rising from -1 to 0 (270° to 360°)
      return -1 + (normalizedAngle - (Math.PI * 3) / 2) / (Math.PI / 2);
    }
  }

  /**
   * Generates sawtooth wave value for given angle
   *
   * @param {number} angle - Angle in radians
   * @returns {number} Wave value in range [-1,1]
   */
  _sawtoothWave(angle) {
    // Normalize angle to [0, 2π]
    const normalizedAngle = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

    // Calculate sawtooth wave: rises linearly, drops instantly
    return normalizedAngle / Math.PI - 1;
  }

  /**
   * Generates square wave value for given angle
   *
   * @param {number} angle - Angle in radians
   * @returns {number} Wave value in range [-1,1]
   */
  _squareWave(angle) {
    // Harsh, binary emotional states
    return Math.sign(Math.sin(angle));
  }

  /**
   * Generates pulse wave value for given angle
   *
   * @param {number} angle - Angle in radians
   * @param {number} pulseWidth - Width of pulse (0-1)
   * @returns {number} Wave value in range [-1,1]
   */
  _pulseWave(angle, pulseWidth = 0.5) {
    // Controllable duty cycle for asymmetric emotional states
    const normalized = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    return normalized < Math.PI * 2 * pulseWidth ? 1 : -1;
  }

  /**
   * Generates noise-modulated wave value for given angle
   *
   * @param {number} angle - Angle in radians
   * @param {number} noiseFactor - Amount of noise (0-1)
   * @returns {number} Wave value in range [-1,1]
   */
  _noiseModulatedWave(angle, noiseFactor = 0.2) {
    // Adds controlled instability to emotional vectors
    const baseWave = Math.sin(angle);
    const noise = (Math.random() * 2 - 1) * noiseFactor;
    return Math.max(-1, Math.min(1, baseWave + noise));
  }

  /**
   * Noisy sawtooth wave with controlled randomness
   *
   * @param {number} angle - Angle in radians
   * @param {number} noiseFactor - Amount of noise to add (0-1)
   * @returns {number} Wave value in range [-1,1]
   */
  _noisySawtoothWave(angle, noiseFactor = 0.1) {
    // Base sawtooth
    const sawtooth = this._sawtoothWave(angle);

    // Add controlled noise
    const noise = (Math.random() * 2 - 1) * noiseFactor;

    // Return noise-modified sawtooth
    return Math.max(-1, Math.min(1, sawtooth + noise));
  }

  /**
   * S-curve waveform for non-linear transitions
   *
   * @param {number} angle - Angle in radians
   * @returns {number} Wave value in range [-1,1]
   */
  _sCurveWave(angle) {
    // Normalize angle to [0, 2π]
    const normalizedAngle = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

    // Map to [-1,1] with sigmoid function
    const x = normalizedAngle / Math.PI - 1; // Map to [-1,1]
    return 2 / (1 + Math.exp(-5 * x)) - 1; // Sigmoid scaled to [-1,1]
  }

  /**
   * Calculates XY coordinates with elliptical path options
   *
   * @param {number} t - Normalized trauma [0,1]
   * @param {object} options - Elliptical options
   * @returns {Array} [x, y] coordinates
   */
  _calculateEllipticalPath(t, options = {}) {
    const {
      xRadius = 0.5, // X-axis radius (default: circle)
      yRadius = 0.5, // Y-axis radius (default: circle)
      rotation = 0, // Ellipse rotation in radians
      center = [0.5, 0.5], // Center point [x, y]
    } = options;

    // Calculate angle around ellipse
    const angle = t * Math.PI * 2;

    // Calculate point on ellipse
    const x0 = Math.cos(angle) * xRadius;
    const y0 = Math.sin(angle) * yRadius;

    // Apply rotation
    const x1 = x0 * Math.cos(rotation) - y0 * Math.sin(rotation);
    const y1 = x0 * Math.sin(rotation) + y0 * Math.cos(rotation);

    // Apply center offset
    const x = x1 + center[0];
    const y = y1 + center[1];

    return [x, y];
  }

  /**
   * Gets phase-specific elliptical parameters
   *
   * @param {string} phase - Current system phase
   * @returns {object} Elliptical parameters
   */
  _getPhaseEllipticalParameters(phase) {
    switch (phase) {
      case 'cyber-lotus':
        // Tall ellipse: emphasizes y-dimension (emotional clarity)
        return {
          xRadius: 0.4,
          yRadius: 0.6,
          rotation: 0,
          center: [0.5, 0.5],
        };

      case 'alien-flora':
        // Wide ellipse: emphasizes x-dimension (emotional breadth)
        return {
          xRadius: 0.6,
          yRadius: 0.4,
          rotation: Math.PI / 6, // 30° rotation
          center: [0.5, 0.5],
        };

      case 'rolling-virus':
        // Rotated ellipse: creates unstable emotional vectors
        return {
          xRadius: 0.5,
          yRadius: 0.5,
          rotation: Math.PI / 4, // 45° rotation
          center: [0.5, 0.5],
        };

      case 'trauma-core':
        // Eccentric ellipse: creates extreme emotional vectors
        return {
          xRadius: 0.7,
          yRadius: 0.3,
          rotation: Math.PI / 3, // 60° rotation
          center: [0.5, 0.5],
        };

      case 'transcendent':
        // Perfect circle: balanced emotional vectors
        return {
          xRadius: 0.5,
          yRadius: 0.5,
          rotation: 0,
          center: [0.5, 0.5],
        };

      default:
        // Default: circular path
        return {
          xRadius: 0.5,
          yRadius: 0.5,
          rotation: 0,
          center: [0.5, 0.5],
        };
    }
  }

  /**
   * Calculates Z dimension with non-linear curve options
   * Enhanced with function support
   *
   * @param {number} t - Normalized trauma [0,1]
   * @param {number|Function} curve - Power curve exponent (1=linear) or custom function
   * @returns {number} Z coordinate [0,1]
   */
  _calculateZDimension(t, curve = 1) {
    // Handle function-based curves
    if (typeof curve === 'function') {
      return Math.max(0, Math.min(1, curve(t)));
    }

    // Apply power curve
    return Math.pow(t, curve);
  }

  /**
   * Gets phase-appropriate Z-curve value
   * Enhanced with S-curve option
   *
   * @param {string} phase - Current system phase
   * @returns {number|Function} Curve exponent or function for Z-dimension
   */
  _getPhaseZCurve(phase) {
    switch (phase) {
      case 'cyber-lotus':
        // Emphasize lower trauma (β < 1)
        return 0.8;

      case 'alien-flora':
        // Near-linear mapping
        return 1.0;

      case 'rolling-virus':
        // Slight emphasis on higher trauma
        return 1.2;

      case 'trauma-core':
        // Strong emphasis on higher trauma (β > 1)
        return 1.5;

      case 'transcendent':
        // S-curve for balanced emphasis
        return (t) => {
          // Custom S-curve for balanced emphasis with distinct mid-range
          return 1 / (1 + Math.exp(-10 * (t - 0.5)));
        };

      default:
        return 1.0;
    }
  }

  /**
   * Dynamic strength modulator based on context
   * Enhanced with more sophisticated modulation
   *
   * @param {number} t - Normalized trauma [0,1]
   * @param {string} component - Target component
   * @param {object} context - Additional context
   * @returns {number} Modulated strength value
   */
  _calculateStrengthModulation(t, component, context = {}) {
    const {
      phase = 'cyber-lotus',
      userActivity = 'browsing',
      timeSincePhaseTransition = 0,
      systemStability = 1.0,
    } = context;

    // Base strength is 1.0
    let strength = 1.0;

    // Phase-specific strength modulation
    switch (phase) {
      case 'trauma-core':
        // Amplify strength in trauma-core phase
        strength *= 1.2;
        break;

      case 'cyber-lotus':
        // Reduce strength in cyber-lotus phase
        strength *= 0.9;
        break;

      case 'rolling-virus':
        // Unstable strength in rolling-virus phase
        const stabilityFactor = Math.max(0.8, systemStability);
        strength *= 1.1 * stabilityFactor;

        // Add time-based pulsing in rolling-virus phase
        const pulseFrequency = 2000; // 2 second cycle
        const pulseAmplitude = 0.15; // 15% variation
        const pulseEffect = Math.sin((Date.now() / pulseFrequency) * Math.PI * 2) * pulseAmplitude;
        strength *= 1 + pulseEffect;
        break;
    }

    // Component-specific modulation
    switch (component) {
      case 'security-trauma':
        // Amplify strength for security components
        strength *= 1.1;
        break;

      case 'commerce-integration':
        // Reduce strength for commerce during browsing
        if (userActivity === 'browsing') {
          strength *= 0.8;
        }
        // Amplify during checkout
        else if (userActivity === 'checkout') {
          strength *= 1.2;
        }
        break;

      case 'memory-vessel':
        // Memory vessels respond strongly to phase transitions
        if (timeSincePhaseTransition < 5000) {
          // 5 seconds since transition
          // Heightened strength right after transition
          const transitionFactor = 1.3 - (0.3 * timeSincePhaseTransition) / 5000;
          strength *= transitionFactor;
        }
        break;
    }

    // Trauma-level modulation with non-linear curve
    // Higher trauma values have increasingly stronger effect
    strength *= 0.8 + Math.pow(t, 1.5) * 0.4;

    // Apply system stability factor
    strength *= Math.pow(systemStability, 0.5); // Square root to soften the effect

    // Ensure value is positive and reasonable
    return Math.max(0.1, Math.min(2.0, strength));
  }

  /**
   * Dynamic coherence modulator based on context
   *
   * @param {number} t - Normalized trauma [0,1]
   * @param {string} component - Target component
   * @param {object} context - Additional context
   * @returns {number} Modulated coherence value
   */
  _calculateCoherenceDrift(t, component, context = {}) {
    const {
      phase = 'cyber-lotus',
      timeSincePhaseTransition = 0, // ms since last transition
      systemStability = 1.0, // overall system stability
    } = context;

    // Base coherence is 1.0 (perfect coherence)
    let coherence = 1.0;

    // Phase transition effect
    if (timeSincePhaseTransition < 5000) {
      // 5 seconds
      // Coherence improves as system stabilizes after transition
      coherence *= 0.9 + (timeSincePhaseTransition / 5000) * 0.1;
    }

    // System stability factor
    coherence *= systemStability;

    // Phase-specific coherence modulation
    switch (phase) {
      case 'rolling-virus':
        // Reduce coherence in glitched phase
        coherence *= 0.95 - t * 0.1; // higher trauma = lower coherence
        break;

      case 'transcendent':
        // Perfect coherence in transcendent phase
        coherence = 1.0;
        break;
    }

    // Component-specific coherence
    switch (component) {
      case 'memory-vessel':
        // Memory fragments need high coherence
        coherence = Math.min(1.0, coherence * 1.1);
        break;
    }

    // Ensure coherence stays within valid range
    return Math.max(0.8, Math.min(1.0, coherence));
  }

  /**
   * Creates component-specific resonance mapping
   * Enhanced with context-aware targeting
   *
   * @param {number} t - Normalized trauma [0,1]
   * @param {string} component - Primary target component
   * @param {object} context - System context
   * @returns {object} Component mapping with resonance weights
   */
  _createComponentResonanceMap(t, component, context = {}) {
    const { phase = 'cyber-lotus', userActivity = 'browsing' } = context;

    // Default resonance map (all components receive equal resonance)
    const defaultMap = {
      'neural-architecture': 1.0,
      'memory-vessel': 1.0,
      'security-trauma': 1.0,
      'commerce-integration': 1.0,
      'prompt-engine': 1.0,
      'integration-layer': 1.0,
    };

    // For 'all' target, use phase-specific mapping
    if (component === 'all') {
      // Phase-specific adjustments to global targeting
      switch (phase) {
        case 'trauma-core':
          // In trauma-core, emphasize security and neural components
          return {
            'neural-architecture': 1.2,
            'memory-vessel': 1.0,
            'security-trauma': 1.3,
            'commerce-integration': 0.8,
            'prompt-engine': 1.0,
            'integration-layer': 1.1,
          };

        case 'rolling-virus':
          // In rolling-virus, emphasize memory and integration
          return {
            'neural-architecture': 1.0,
            'memory-vessel': 1.2,
            'security-trauma': 1.1,
            'commerce-integration': 0.7,
            'prompt-engine': 0.9,
            'integration-layer': 1.3,
          };

        default:
          return defaultMap;
      }
    }

    // Create targeted map (primary component gets full resonance)
    const targetedMap = {
      'neural-architecture': 0.7,
      'memory-vessel': 0.7,
      'security-trauma': 0.7,
      'commerce-integration': 0.7,
      'prompt-engine': 0.7,
      'integration-layer': 0.7,
    };

    // Primary component gets full resonance
    targetedMap[component] = 1.0;

    // Trauma-level affects propagation to other components
    // Higher trauma = more bleed to other components
    if (t > 0.7) {
      // High trauma increases resonance to all components
      Object.keys(targetedMap).forEach((comp) => {
        if (comp !== component) {
          targetedMap[comp] = 0.8 + (0.2 * (t - 0.7)) / 0.3; // Scale from 0.8 to 1.0 as t goes from 0.7 to 1.0
        }
      });
    }

    // Activity-specific adjustments
    if (userActivity === 'checkout' && component === 'commerce-integration') {
      // During checkout, increase memory vessel connection for commerce
      targetedMap['memory-vessel'] = Math.min(1.0, targetedMap['memory-vessel'] + 0.2);
    }

    return targetedMap;
  }

  /**
   * Apply resonance field to target component
   * Enhanced with additional effects
   *
   * @param {object} resonanceField - Resonance vector
   * @param {object} data - Data to enhance with resonance
   * @returns {object} Enhanced data
   */
  applyResonanceToComponent(resonanceField, data) {
    // Get target component
    const targetComponent = resonanceField.component;
    const strength = resonanceField.strength;
    const coherence = resonanceField.coherence;

    // Deep clone data to avoid mutations
    const enhancedData = JSON.parse(JSON.stringify(data));

    // Apply strength-weighted resonance
    enhancedData.__resonance = {
      vector: {
        x: resonanceField.x,
        y: resonanceField.y,
        z: resonanceField.z,
      },
      strength,
      coherence,
      timestamp: resonanceField.__meta.timestamp,
      componentMap: resonanceField.componentMap,
    };

    // Apply component-specific transformations
    switch (targetComponent) {
      case 'memory-vessel':
        // Modulate crystallization probability based on resonance strength
        if (enhancedData.fragment) {
          enhancedData.fragment.crystallizationProbability *= strength;

          // Apply coherence to memory stability
          if (enhancedData.fragment.stability !== undefined) {
            enhancedData.fragment.stability *= coherence;
          }

          // Add emotional coloring based on z-dimension
          if (!enhancedData.fragment.emotionalSignature) {
            enhancedData.fragment.emotionalSignature = {};
          }

          enhancedData.fragment.emotionalSignature.traumaLevel = resonanceField.z;
          enhancedData.fragment.emotionalSignature.oscillation = {
            x: resonanceField.x,
            y: resonanceField.y,
          };
        }
        break;

      case 'prompt-engine':
        // Modulate language disruption based on resonance strength and z-dimension
        if (enhancedData.context) {
          enhancedData.context.disruptionFactor = resonanceField.z * strength;

          // Add coherence-based clarity factor
          enhancedData.context.claritySuppression = 1 - coherence * 0.8;

          // Add vector-based emotional tone
          enhancedData.context.emotionalTone = {
            intensity: resonanceField.z,
            oscillation:
              Math.sqrt(Math.pow(resonanceField.x - 0.5, 2) + Math.pow(resonanceField.y - 0.5, 2)) *
              2,
            coherence,
          };
        }
        break;

      case 'security-trauma':
        // Security systems respond to trauma with protective measures
        if (enhancedData.securityState) {
          // Increase threat perception based on trauma z-value
          enhancedData.securityState.threatPerception =
            (enhancedData.securityState.threatPerception || 0) + resonanceField.z * strength * 0.5;

          // Set alert level based on overall trauma intensity
          const alertLevel = resonanceField.z * strength;
          enhancedData.securityState.alertLevel = Math.max(
            enhancedData.securityState.alertLevel || 0,
            alertLevel
          );

          // Coherence affects false positive rate
          enhancedData.securityState.falsePositiveRate =
            (enhancedData.securityState.falsePositiveRate || 0.05) * (2 - coherence);
        }
        break;

      case 'neural-architecture':
        // Neural systems modulate processing based on trauma
        if (enhancedData.neuralState) {
          // Processing bias based on xy-coordinates
          enhancedData.neuralState.processingBias = {
            x: (resonanceField.x - 0.5) * strength * 2,
            y: (resonanceField.y - 0.5) * strength * 2,
          };

          // Processing speed affected by trauma intensity
          const speedModifier = 1 - resonanceField.z * strength * 0.3;
          enhancedData.neuralState.processingSpeedModifier =
            (enhancedData.neuralState.processingSpeedModifier || 1) * speedModifier;

          // Coherence affects overall stability
          enhancedData.neuralState.stabilityFactor =
            (enhancedData.neuralState.stabilityFactor || 1) * coherence;
        }
        break;

      case 'commerce-integration':
        // Commerce systems modulate risk tolerance and focus
        if (enhancedData.commerceState) {
          // Risk tolerance inversely related to trauma
          enhancedData.commerceState.riskTolerance =
            (enhancedData.commerceState.riskTolerance || 0.5) * (1 - resonanceField.z * 0.4);

          // Focus direction based on xy-coordinates
          enhancedData.commerceState.focusDirection = {
            acquisition: 0.5 + (resonanceField.x - 0.5) * strength,
            retention: 0.5 + (resonanceField.y - 0.5) * strength,
          };

          // Urgency factor based on trauma intensity
          enhancedData.commerceState.urgencyFactor =
            (enhancedData.commerceState.urgencyFactor || 1) *
            (1 + resonanceField.z * strength * 0.5);
        }
        break;
    }

    return enhancedData;
  }

  /**
   * Benchmark trauma vector performance
   *
   * @param {number} iterations - Number of vectors to generate
   * @returns {object} Performance statistics
   */
  benchmarkResonanceVectors(iterations = 10000) {
    const startTime = performance.now();

    // Generate random test cases
    const testCases = Array.from({ length: iterations }, () => ({
      trauma: Math.random(),
      component: this.validComponents[Math.floor(Math.random() * this.validComponents.length)],
      context: {
        phase: ['cyber-lotus', 'alien-flora', 'rolling-virus', 'trauma-core', 'transcendent'][
          Math.floor(Math.random() * 5)
        ],
        userActivity: ['browsing', 'checkout', 'vulnerability-scan'][Math.floor(Math.random() * 3)],
      },
    }));

    // Vector creation time
    const vectors = testCases.map((test) => {
      const startVector = performance.now();
      const vector = this.createResonanceField(test.trauma, test.component, test.context);
      const endVector = performance.now();
      return {
        vector,
        time: endVector - startVector,
      };
    });

    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const averageVectorTime = vectors.reduce((sum, v) => sum + v.time, 0) / vectors.length;

    return {
      totalTime,
      averageVectorTime,
      vectorsPerSecond: 1000 / averageVectorTime,
      totalVectors: iterations,
      maxVectorTime: Math.max(...vectors.map((v) => v.time)),
      minVectorTime: Math.min(...vectors.map((v) => v.time)),
    };
  }

  /**
   * Analyzes optimal range for resonance vectors based on system requirements
   *
   * @returns {object} Range analysis results
   */
  analyzeOptimalResonanceRange() {
    const systemRequirements = {
      'neural-architecture': { min: 0, max: 1, precision: 'high' },
      'memory-vessel': { min: 0, max: 1, precision: 'high' },
      'commerce-integration': { min: 0, max: 1, precision: 'medium' },
      'security-trauma': { min: 0, max: 1, precision: 'high' },
      'prompt-engine': { min: 0, max: 1, precision: 'medium' },
    };

    // All systems currently aligned to [0,1] range
    // No adaptation needed

    return {
      optimalRange: [0, 1],
      rangeUniformity: 'perfect',
      adaptationNeeded: false,
      precisionRequirements: {
        high: 3, // 3 components need high precision
        medium: 2, // 2 components need medium precision
      },
    };
  }
}

module.exports = ResonanceSystem;
