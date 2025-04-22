/**
 * QUANTUM-WORKER.JS
 * Web Worker for handling intensive quantum calculations
 *
 * @Version: 1.0.0
 */

// Handle intensive quantum calculations without blocking the main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data;

  switch (type) {
  case 'calculate-quantum-state':
    const result = calculateQuantumState(data);
    self.postMessage({ type: 'quantum-state-result', result });
    break;

  case 'process-trauma-patterns':
    const traumaResults = processTraumaPatterns(data);
    self.postMessage({ type: 'trauma-patterns-result', traumaResults });
    break;

  case 'generate-mutation-profile':
    const mutationProfile = generateMutationProfile(data);
    self.postMessage({ type: 'mutation-profile-result', mutationProfile });
    break;

  default:
    self.postMessage({
      type: 'error',
      error: `Unknown operation type: ${type}`,
    });
  }
});

/**
 * Calculate quantum state for product visualization
 * @param {Object} data - Input data for calculation
 * @returns {Object} Calculated quantum state
 */
function calculateQuantumState(data) {
  const { intensity, profile, traumaCodes } = data;

  // Simulate intensive calculation
  const particles = [];
  const particleCount = Math.floor(intensity * 50) + 20;

  // Generate quantum particles
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = (Math.random() * 0.5 + 0.5) * intensity * 30;

    particles.push({
      id: `particle-${i}`,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      z: (Math.random() - 0.5) * intensity * 20,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 0.5 + 0.5,
      phase: Math.random() * Math.PI * 2,
    });
  }

  // Apply trauma modifications if present
  if (traumaCodes && traumaCodes.length > 0) {
    applyTraumaEffects(particles, traumaCodes);
  }

  // Apply profile-specific modifications
  applyProfileEffects(particles, profile);

  return {
    particles,
    timestamp: Date.now(),
    stabilityFactor: calculateStabilityFactor(particles, profile),
  };
}

/**
 * Process trauma patterns
 * @param {Object} data - Trauma data
 * @returns {Object} Processed trauma patterns
 */
function processTraumaPatterns(data) {
  const { traumaCodes, intensity } = data;

  const patterns = traumaCodes.map((code) => {
    // Extract trauma type and intensity
    const traumaType = code.split('-')[0];
    const traumaIntensity = parseFloat(code.split('-')[1] || intensity || 0.5);

    // Process based on trauma type
    switch (traumaType) {
    case 'glitch':
      return generateGlitchPattern(traumaIntensity);
    case 'void':
      return generateVoidPattern(traumaIntensity);
    case 'echo':
      return generateEchoPattern(traumaIntensity);
    case 'fracture':
      return generateFracturePattern(traumaIntensity);
    default:
      return generateDefaultPattern(traumaIntensity);
    }
  });

  return {
    patterns,
    combinedEffect: combinePatterns(patterns),
    stabilityIndex: calculateStabilityIndex(patterns),
  };
}

/**
 * Generate mutation profile
 * @param {Object} data - Base data for mutation
 * @returns {Object} Generated mutation profile
 */
function generateMutationProfile(data) {
  const { baseProfile, intensity, traumaInfluence } = data;

  // Generate profile-specific parameters
  const colors = generateProfileColors(baseProfile, intensity);
  const animations = generateProfileAnimations(baseProfile, intensity);
  const particleSystem = generateParticleSystem(baseProfile, intensity);

  // Apply trauma influence if present
  if (traumaInfluence && traumaInfluence.length > 0) {
    applyTraumaInfluence(colors, traumaInfluence);
    applyTraumaInfluence(animations, traumaInfluence);
    applyTraumaInfluence(particleSystem, traumaInfluence);
  }

  return {
    name: baseProfile,
    timestamp: Date.now(),
    colors,
    animations,
    particleSystem,
    cssMutations: generateCSS(colors, animations),
    stability: calculateProfileStability(baseProfile, intensity, traumaInfluence),
  };
}

/**
 * Apply trauma effects to particles
 * @private
 */
function applyTraumaEffects(particles, traumaCodes) {
  traumaCodes.forEach((code) => {
    const traumaType = code.split('-')[0];
    const traumaIntensity = parseFloat(code.split('-')[1] || 0.5);

    particles.forEach((particle) => {
      switch (traumaType) {
      case 'glitch':
        particle.glitchFactor = traumaIntensity;
        break;
      case 'void':
        particle.opacity *= 1 - traumaIntensity * 0.5;
        break;
      case 'echo':
        particle.echo = traumaIntensity > 0.5;
        break;
      case 'fracture':
        particle.fractured = traumaIntensity > 0.7;
        break;
      }
    });
  });
}

/**
 * Apply profile effects to particles
 * @private
 */
function applyProfileEffects(particles, profile) {
  const profileEffects = {
    CyberLotus: {
      colorShift: [0, 1, 1], // Cyan
      sizeMultiplier: 1.0,
      speedMultiplier: 1.0,
    },
    ObsidianBloom: {
      colorShift: [0.85, 1, 1], // Magenta
      sizeMultiplier: 1.2,
      speedMultiplier: 0.8,
    },
    VoidBloom: {
      colorShift: [0.75, 1, 1], // Purple
      sizeMultiplier: 0.9,
      speedMultiplier: 1.2,
    },
    NeonVortex: {
      colorShift: [0.3, 1, 1], // Green
      sizeMultiplier: 1.1,
      speedMultiplier: 1.5,
    },
  };

  const effect = profileEffects[profile] || profileEffects.CyberLotus;

  particles.forEach((particle) => {
    particle.colorShift = effect.colorShift;
    particle.size *= effect.sizeMultiplier;
    particle.speed *= effect.speedMultiplier;
  });
}

/**
 * Calculate stability factor based on particle system
 * @private
 */
function calculateStabilityFactor(particles, profile) {
  let stabilitySum = 0;

  particles.forEach((particle) => {
    const distanceFromCenter = Math.sqrt(
      particle.x * particle.x + particle.y * particle.y + particle.z * particle.z
    );

    stabilitySum += (1 / (distanceFromCenter + 1)) * particle.opacity;
  });

  const baseStability = stabilitySum / particles.length;

  // Apply profile-specific stability modifiers
  const profileModifiers = {
    CyberLotus: 1.0,
    ObsidianBloom: 0.8,
    VoidBloom: 0.7,
    NeonVortex: 1.2,
  };

  return baseStability * (profileModifiers[profile] || 1.0);
}

/**
 * Generate glitch pattern based on intensity
 * @param {number} intensity - Effect intensity (0-1)
 * @returns {Object} Glitch pattern data
 */
function generateGlitchPattern(intensity) {
  const pattern = [];
  const glitchCount = Math.floor(intensity * 20) + 5;

  for (let i = 0; i < glitchCount; i++) {
    pattern.push({
      offset: Math.random() * 2 - 1,
      duration: (Math.random() * 0.3 + 0.1) * intensity,
      amplitude: Math.random() * intensity * 0.3,
      frequency: Math.random() * 10 + 5,
      rgbSplit: Math.random() * intensity * 0.05,
      probability: Math.random() * 0.6 + 0.2,
    });
  }

  return {
    type: 'glitch',
    intensity,
    pattern,
    shaderUniforms: {
      rgbShift: intensity * 0.03,
      blockProbability: intensity * 0.15,
      lineShift: intensity * 0.1,
      noiseIntensity: intensity * 0.5,
    },
  };
}

/**
 * Generate void pattern based on intensity
 * @param {number} intensity - Effect intensity (0-1)
 * @returns {Object} Void pattern data
 */
function generateVoidPattern(intensity) {
  const voidPoints = [];
  const pointCount = Math.floor(intensity * 8) + 2;

  for (let i = 0; i < pointCount; i++) {
    voidPoints.push({
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      z: Math.random() * 2 - 1,
      radius: (Math.random() * 0.3 + 0.1) * intensity,
      density: Math.random() * 0.8 + 0.2,
      pulseRate: Math.random() * 2 + 0.5,
    });
  }

  return {
    type: 'void',
    intensity,
    pattern: voidPoints,
    shaderUniforms: {
      voidColor: [0.2, 0.05, 0.3], // Dark purple
      absorptionRate: intensity * 0.6,
      distortionStrength: intensity * 0.4,
      pulseFrequency: 0.5 + intensity,
      voidEdgeSharpness: 3.0 + intensity * 5.0,
    },
  };
}

/**
 * Generate echo pattern based on intensity
 * @param {number} intensity - Effect intensity (0-1)
 * @returns {Object} Echo pattern data
 */
function generateEchoPattern(intensity) {
  const echoLayers = [];
  const layerCount = Math.floor(intensity * 5) + 2;

  for (let i = 0; i < layerCount; i++) {
    const delay = i * (0.2 + intensity * 0.3);
    const opacity = (1 - i / layerCount) * intensity * 0.7;

    echoLayers.push({
      delay,
      opacity,
      scale: 1 + i * 0.05 * intensity,
      colorShift: i * 0.05 * intensity,
      distortion: i * 0.01 * intensity,
    });
  }

  return {
    type: 'echo',
    intensity,
    pattern: echoLayers,
    shaderUniforms: {
      echoCount: layerCount,
      echoStrength: intensity * 0.7,
      echoDelay: 0.15 + intensity * 0.1,
      echoFade: 0.85,
      echoDistortion: intensity * 0.2,
    },
  };
}

/**
 * Generate fracture pattern based on intensity
 * @param {number} intensity - Effect intensity (0-1)
 * @returns {Object} Fracture pattern data
 */
function generateFracturePattern(intensity) {
  const fractureLines = [];
  const lineCount = Math.floor(intensity * 15) + 5;

  for (let i = 0; i < lineCount; i++) {
    // Generate random line in 3D space
    const start = {
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      z: Math.random() * 2 - 1,
    };

    // Random angle for line direction
    const angleXY = Math.random() * Math.PI * 2;
    const angleZ = Math.random() * Math.PI - Math.PI / 2;
    const length = Math.random() * 0.5 + 0.5;

    const end = {
      x: start.x + Math.cos(angleXY) * Math.cos(angleZ) * length,
      y: start.y + Math.sin(angleXY) * Math.cos(angleZ) * length,
      z: start.z + Math.sin(angleZ) * length,
    };

    fractureLines.push({
      start,
      end,
      width: Math.random() * 0.02 + 0.005,
      glow: Math.random() * intensity * 0.8,
      color: [Math.random(), Math.random(), Math.random()],
      speed: Math.random() * 0.5 + 0.5,
    });
  }

  return {
    type: 'fracture',
    intensity,
    pattern: fractureLines,
    shaderUniforms: {
      fractureCount: lineCount,
      fractureWidth: 0.01 + intensity * 0.02,
      fractureGlow: intensity * 0.5,
      fractureDepth: intensity * 0.3,
      fractureSpeed: 0.5 + intensity,
    },
  };
}

/**
 * Generate default pattern when no specific type is provided
 * @param {number} intensity - Effect intensity (0-1)
 * @returns {Object} Default pattern data
 */
function generateDefaultPattern(intensity) {
  // Combine aspects of other patterns for generic effect
  const particles = [];
  const count = Math.floor(intensity * 30) + 10;

  for (let i = 0; i < count; i++) {
    particles.push({
      position: [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1],
      size: Math.random() * 0.1 + 0.05,
      color: [Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5],
      speed: Math.random() * intensity,
      life: Math.random() * 2 + 1,
    });
  }

  return {
    type: 'default',
    intensity,
    pattern: particles,
    shaderUniforms: {
      particleCount: count,
      effectStrength: intensity * 0.6,
      colorIntensity: 0.7 + intensity * 0.3,
      noiseScale: 1.0 + intensity,
    },
  };
}

/**
 * Combine multiple patterns into a single effect
 * @param {Array} patterns - Array of pattern objects
 * @returns {Object} Combined pattern data
 */
function combinePatterns(patterns) {
  if (!patterns || patterns.length === 0) {
    return {
      combined: true,
      patterns: [],
      strength: 0,
      shaderUniforms: {},
    };
  }

  // Start with empty uniforms to merge
  const combinedUniforms = {};
  let totalStrength = 0;

  // Combine patterns and normalize
  patterns.forEach((pattern) => {
    totalStrength += pattern.intensity;

    // Merge shader uniforms
    if (pattern.shaderUniforms) {
      Object.entries(pattern.shaderUniforms).forEach(([key, value]) => {
        if (typeof value === 'number') {
          // Average numeric values
          combinedUniforms[key] = (combinedUniforms[key] || 0) + value * pattern.intensity;
        } else if (Array.isArray(value)) {
          // Average array values (usually colors)
          if (!combinedUniforms[key]) {
            combinedUniforms[key] = Array(value.length).fill(0);
          }

          for (let i = 0; i < value.length; i++) {
            combinedUniforms[key][i] += value[i] * pattern.intensity;
          }
        } else {
          // For other types, just use the strongest pattern's value
          if (
            !combinedUniforms[key] ||
            pattern.intensity > (combinedUniforms[`${key}_strength`] || 0)
          ) {
            combinedUniforms[key] = value;
            combinedUniforms[`${key}_strength`] = pattern.intensity;
          }
        }
      });
    }
  });

  // Normalize numeric and array values
  if (totalStrength > 0) {
    Object.entries(combinedUniforms).forEach(([key, value]) => {
      if (!key.endsWith('_strength')) {
        if (typeof value === 'number') {
          combinedUniforms[key] = value / totalStrength;
        } else if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            value[i] = value[i] / totalStrength;
          }
        }
      }
    });
  }

  // Add additional combined effects
  const averageIntensity = totalStrength / patterns.length;

  return {
    combined: true,
    patterns,
    strength: averageIntensity,
    patternCount: patterns.length,
    shaderUniforms: combinedUniforms,
    // Add combined effects that only emerge from multiple patterns
    emergentEffects:
      patterns.length > 1
        ? {
          interference: Math.min(patterns.length * 0.2, 0.8) * averageIntensity,
          resonance: patterns.length >= 3 ? 0.5 * averageIntensity : 0,
          patternEntanglement: averageIntensity > 0.7 && patterns.length >= 2,
        }
        : null,
  };
}

/**
 * Calculate stability index based on patterns
 * @param {Array} patterns - Array of pattern objects
 * @returns {number} Stability index (0-1)
 */
function calculateStabilityIndex(patterns) {
  if (!patterns || patterns.length === 0) {
    return 1.0; // Perfectly stable when no patterns
  }

  // Different pattern types affect stability differently
  const typeWeights = {
    glitch: 0.4, // Glitches reduce stability significantly
    void: 0.3, // Voids reduce stability moderately
    echo: 0.7, // Echoes are relatively stable
    fracture: 0.2, // Fractures reduce stability substantially
    default: 0.6, // Default patterns are moderately stable
  };

  let stabilityScore = 0;
  let totalWeight = 0;

  patterns.forEach((pattern) => {
    const weight = pattern.intensity;
    const typeModifier = typeWeights[pattern.type] || 0.5;

    stabilityScore += typeModifier * weight;
    totalWeight += weight;
  });

  // Normalize to 0-1 range
  const baseStability = totalWeight > 0 ? stabilityScore / totalWeight : 1.0;

  // Multiple patterns interact and further reduce stability
  const patternCountModifier = 1.0 - (patterns.length - 1) * 0.05;

  // Calculate final stability, ensuring it stays in 0-1 range
  return Math.max(0.1, Math.min(1.0, baseStability * patternCountModifier));
}

/**
 * Apply trauma influence to target object
 * @param {Object} target - Target object to modify
 * @param {Array} traumaInfluence - Array of trauma codes
 */
function applyTraumaInfluence(target, traumaInfluence) {
  if (!target || !traumaInfluence || traumaInfluence.length === 0) {
    return;
  }

  traumaInfluence.forEach((trauma) => {
    // Parse trauma code
    const [type, intensityStr] = trauma.split('-');
    const intensity = parseFloat(intensityStr || '0.5');

    // Apply different modifications based on trauma type
    switch (type) {
    case 'glitch':
      // Apply color distortion
      if (target.colors) {
        // Slightly shift colors toward cyan/magenta for glitches
        shiftColorTowards(target.colors.primary, '#00FFFF', intensity * 0.3);
        shiftColorTowards(target.colors.secondary, '#FF00FF', intensity * 0.3);
      }

      // Add glitch to animations
      if (target.animations) {
        target.animations.glitchProbability =
            (target.animations.glitchProbability || 0) + intensity * 0.2;
        target.animations.duration *= 1 - intensity * 0.1; // Speed up animations slightly
      }

      // Affect particle system
      if (target.count) {
        target.count = Math.max(5, Math.floor(target.count * (1 + intensity * 0.3)));
        target.turbulence = (target.turbulence || 0) + intensity * 0.3;
      }
      break;

    case 'void':
      // Darken colors
      if (target.colors) {
        darkenColor(target.colors.primary, intensity * 0.4);
        darkenColor(target.colors.secondary, intensity * 0.4);
        darkenColor(target.colors.background, intensity * 0.5);
      }

      // Slow down animations
      if (target.animations) {
        target.animations.duration *= 1 + intensity * 0.5;
        target.animations.voidEffects = true;
      }

      // Reduce particle count but increase size
      if (target.count) {
        target.count = Math.max(3, Math.floor(target.count * (1 - intensity * 0.4)));
        target.size = (target.size || 1) * (1 + intensity * 0.6);
        target.speed *= 0.7;
      }
      break;

    case 'echo':
      // Add afterimages to animations
      if (target.animations) {
        target.animations.echo = (target.animations.echo || 0) + intensity;
        target.animations.trailLength =
            (target.animations.trailLength || 0) + Math.floor(intensity * 5);
      }

      // Create echo effect in particles
      if (target.count) {
        target.echo = true;
        target.echoCount = Math.floor(intensity * 3) + 1;
        target.echoOpacity = 0.7 * intensity;
      }
      break;

    case 'fracture':
      // Add fracture lines to animations
      if (target.animations) {
        target.animations.fractureLines =
            (target.animations.fractureLines || 0) + Math.floor(intensity * 10);
        target.animations.shatterOnExit = intensity > 0.7;
      }

      // Fragment particles
      if (target.count) {
        target.count = Math.max(5, Math.floor(target.count * (1 + intensity * 0.6)));
        target.size *= 0.7; // Smaller particles
        target.fractured = true;
        target.lineCount = Math.floor(intensity * 10) + 2;
      }
      break;
    }
  });
}

/**
 * Generate CSS strings based on colors and animations
 * @param {Object} colors - Color scheme
 * @param {Object} animations - Animation parameters
 * @returns {string} CSS string
 */
function generateCSS(colors, animations) {
  // Build CSS custom properties
  let css = ':root {\n';

  // Add color properties
  if (colors) {
    Object.entries(colors).forEach(([name, value]) => {
      css += `  --quantum-${name}: ${value};\n`;
    });
  }

  // Add animation properties
  if (animations) {
    const { duration, easing } = animations;
    css += `  --quantum-animation-duration: ${duration}ms;\n`;
    css += `  --quantum-animation-easing: ${easing};\n`;
    css += `  --quantum-animation-glow: ${animations.glow ? '1' : '0'};\n`;
  }

  css += '}\n\n';

  // Add class-based styles
  css += `.quantum-effect {\n`;
  css += `  transition: all var(--quantum-animation-duration) var(--quantum-animation-easing);\n`;

  if (animations && animations.glow) {
    css += `  box-shadow: 0 0 15px var(--quantum-primary);\n`;
    css += `  text-shadow: 0 0 5px var(--quantum-primary);\n`;
  }

  css += `}\n\n`;

  // Add particle styles
  if (animations && animations.particles) {
    css += `.quantum-particles {\n`;
    css += `  position: absolute;\n`;
    css += `  top: 0;\n`;
    css += `  left: 0;\n`;
    css += `  width: 100%;\n`;
    css += `  height: 100%;\n`;
    css += `  pointer-events: none;\n`;
    css += `  z-index: 10;\n`;
    css += `}\n`;
  }

  // Add specific profile styles
  if (colors.primary.includes('#00ff')) {
    // Cyan/blue profile (CyberLotus)
    css += `.quantum-cyberlotus {\n`;
    css += `  --quantum-glow-color: rgba(0, 255, 255, 0.7);\n`;
    css += `  --quantum-highlight: linear-gradient(45deg, var(--quantum-primary), var(--quantum-secondary));\n`;
    css += `}\n`;
  } else if (colors.primary.includes('#ff00ff')) {
    // Magenta profile (ObsidianBloom)
    css += `.quantum-obsidianbloom {\n`;
    css += `  --quantum-glow-color: rgba(255, 0, 255, 0.7);\n`;
    css += `  --quantum-highlight: linear-gradient(45deg, var(--quantum-primary), var(--quantum-secondary));\n`;
    css += `}\n`;
  } else if (colors.primary.includes('#9900ff')) {
    // Purple profile (VoidBloom)
    css += `.quantum-voidbloom {\n`;
    css += `  --quantum-glow-color: rgba(153, 0, 255, 0.7);\n`;
    css += `  --quantum-highlight: linear-gradient(45deg, var(--quantum-primary), var(--quantum-secondary));\n`;
    css += `}\n`;
  } else if (colors.primary.includes('#00ff66')) {
    // Green profile (NeonVortex)
    css += `.quantum-neonvortex {\n`;
    css += `  --quantum-glow-color: rgba(0, 255, 102, 0.7);\n`;
    css += `  --quantum-highlight: linear-gradient(45deg, var(--quantum-primary), var(--quantum-secondary));\n`;
    css += `}\n`;
  }

  return css;
}

/**
 * Calculate profile stability based on parameters
 * @param {string} profile - Profile name
 * @param {number} intensity - Effect intensity (0-1)
 * @param {Array} traumaInfluence - Array of trauma codes
 * @returns {number} Stability value (0-1)
 */
function calculateProfileStability(profile, intensity, traumaInfluence) {
  // Base stability values for different profiles
  const baseStability =
    {
      CyberLotus: 0.9, // Most stable profile
      ObsidianBloom: 0.7,
      VoidBloom: 0.5, // Moderately unstable
      NeonVortex: 0.8,
    }[profile] || 0.75;

  // Intensity reduces stability
  const intensityFactor = 1 - intensity * 0.5;

  // Trauma influence further reduces stability
  let traumaFactor = 1.0;

  if (traumaInfluence && traumaInfluence.length > 0) {
    traumaInfluence.forEach((trauma) => {
      const [type, intensityStr] = trauma.split('-');
      const traumaIntensity = parseFloat(intensityStr || '0.5');

      // Different trauma types have different stability impacts
      const traumaImpact =
        {
          glitch: 0.15,
          void: 0.25,
          echo: 0.1,
          fracture: 0.3,
        }[type] || 0.1;

      traumaFactor -= traumaImpact * traumaIntensity;
    });

    // Ensure trauma factor doesn't go below 0.2
    traumaFactor = Math.max(0.2, traumaFactor);
  }

  return baseStability * intensityFactor * traumaFactor;
}

// Helper color functions
/**
 *
 */
function shiftColorTowards(color, targetColor, amount) {
  if (!color) return;

  // Simple implementation for demo purposes
  // Would actually parse colors and calculate proper RGB shift
}

/**
 *
 */
function darkenColor(color, amount) {
  if (!color) return;

  // Simple implementation for demo purposes
  // Would actually parse colors and adjust luminance
}
