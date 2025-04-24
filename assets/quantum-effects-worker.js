/**
 * Web Worker for processing quantum effects
 * Offloads complex calculations from the main thread
 *
 * @Version: 1.0.0
 */

// Self-contained worker - no external dependencies for maximum compatibility

/**
 * Process a quantum effect
 */
self.addEventListener('message', function (e) {
  const { type, elementId, properties } = e.data;

  // Determine which processing function to use
  let result;
  switch (type) {
    case 'process':
      // Determine which effect to process based on properties
      if (properties.glitchFactor) {
        result = processGlitch(elementId, properties);
      } else if (properties.traumaIndex) {
        result = processTrauma(elementId, properties);
      } else if (properties.mutationProfile) {
        result = processMutation(elementId, properties);
      }
      break;
    case 'glitch':
      result = processGlitch(elementId, properties);
      break;
    case 'trauma':
      result = processTrauma(elementId, properties);
      break;
    case 'mutation':
      result = processMutation(elementId, properties);
      break;
    case 'holographic':
      result = processHolographic(elementId, properties);
      break;
    default:
      result = { error: 'Unknown effect type' };
  }

  // Send the processed data back to main thread
  self.postMessage({
    type: type === 'process' ? detectEffectType(properties) : type,
    target: elementId,
    result,
  });
});

/**
 * Detect the primary effect type from properties
 */
function detectEffectType(properties) {
  if (properties.glitchFactor && properties.glitchFactor > 0.5) {
    return 'glitch';
  } else if (properties.traumaIndex && properties.traumaIndex >= 3) {
    return 'trauma';
  } else if (properties.mutationProfile) {
    return 'mutation';
  }
  return 'standard';
}

/**
 * Process glitch effect
 */
function processGlitch(elementId, properties) {
  const { glitchFactor = 0.5, interval = 5000, duration = 300 } = properties;

  // Calculate glitch parameters based on factor (0-1)
  const intensity = Math.min(1, Math.max(0, glitchFactor));

  // Calculate glitch visual transforms
  const transforms = [];
  const filters = [];

  // Create different transforms based on intensity
  for (let i = 0; i < Math.ceil(intensity * 5); i++) {
    const xOffset = (Math.random() - 0.5) * 10 * intensity;
    const yOffset = (Math.random() - 0.5) * 5 * intensity;
    const rotation = (Math.random() - 0.5) * 2 * intensity;

    transforms.push({
      transform: `translate(${xOffset}px, ${yOffset}px) rotate(${rotation}deg)`,
      offsetPercent: Math.random() * 100,
      duration: 50 + Math.random() * 100,
    });
  }

  // Create RGB split filter
  if (intensity > 0.3) {
    const rgbSplitAmount = intensity * 5;
    filters.push({
      filter: `
        contrast(1.2)
        brightness(1.${Math.floor(intensity * 5)})
        hue-rotate(${Math.floor(Math.random() * 360)}deg)
      `,
      offsetPercent: Math.random() * 100,
      duration: 50 + Math.random() * 150,
    });
  }

  // Timing parameters
  const timing = {
    interval: interval - intensity * 2000, // More frequent with higher intensity
    duration: duration + intensity * 300, // Longer duration with higher intensity
    baseDelay: 2000 + Math.random() * 5000, // Random base delay
  };

  return {
    transforms,
    filters,
    intensity,
    timing,
    css: generateGlitchCSS(elementId, intensity),
  };
}

/**
 * Process trauma effect
 */
function processTrauma(elementId, properties) {
  const { traumaIndex = 1, pulseFrequency = 0.5 } = properties;

  // Normalize trauma index to 1-5 range
  const level = Math.min(5, Math.max(1, Math.round(traumaIndex)));

  // Create effects based on trauma level
  const effects = {
    pulseOpacity: 0.1 + level * 0.05,
    pulseScale: 1 + level * 0.03,
    distortionAmount: level >= 3 ? (level - 2) * 0.05 : 0,
    blurAmount: level >= 4 ? (level - 3) * 1 : 0,
    hueRotate: level >= 3 ? level * 15 : 0,
  };

  // Generate pulse timing
  const timing = {
    pulseDuration: 2000 - level * 200,
    pulseDelay: 1000 + Math.random() * 2000,
  };

  return {
    level,
    effects,
    timing,
    css: generateTraumaCSS(elementId, level, effects),
  };
}

/**
 * Process mutation effect
 */
function processMutation(elementId, properties) {
  const { mutationProfile = 'standard', intensity = 0.5 } = properties;

  // Parse profile
  const profileType = mutationProfile.includes('trauma')
    ? 'trauma'
    : mutationProfile.includes('quantum')
    ? 'quantum'
    : 'standard';

  // Create different mutation effects based on profile
  let effects;

  switch (profileType) {
    case 'trauma':
      effects = {
        colorShift: `hsl(${280 + Math.random() * 60}, 100%, 50%)`,
        glowColor: `rgba(153, 0, 255, ${0.3 + intensity * 0.4})`,
        transformOrigin: Math.random() > 0.5 ? 'center left' : 'center right',
        skew: (Math.random() - 0.5) * 5 * intensity,
        perspective: 500 - intensity * 200,
      };
      break;
    case 'quantum':
      effects = {
        colorShift: `hsl(${180 + Math.random() * 60}, 100%, 50%)`,
        glowColor: `rgba(0, 255, 255, ${0.3 + intensity * 0.4})`,
        transformOrigin: 'center',
        blur: intensity * 2,
        opacity: 0.8 + intensity * 0.2,
      };
      break;
    default:
      effects = {
        colorShift: `hsl(${Math.random() * 360}, 80%, 60%)`,
        glowColor: `rgba(255, 255, 255, ${0.2 + intensity * 0.3})`,
        transformOrigin: 'center',
        scale: 1 + intensity * 0.1,
        rotate: (Math.random() - 0.5) * 2,
      };
  }

  // Generate timing and animation patterns
  const timing = {
    duration: 1000 + Math.random() * 1000,
    delay: Math.random() * 500,
    iterations: Math.random() > 0.7 ? 'infinite' : Math.ceil(1 + Math.random() * 3),
  };

  return {
    profileType,
    effects,
    timing,
    css: generateMutationCSS(elementId, profileType, effects, timing),
  };
}

/**
 * Process holographic effect
 */
function processHolographic(elementId, properties) {
  const { intensity = 0.5, color = '#00ffff', scanLines = true } = properties;

  // Create holographic parameters
  const effects = {
    baseColor: color,
    opacity: 0.7 + intensity * 0.3,
    scanLineOpacity: scanLines ? 0.2 + intensity * 0.3 : 0,
    glowIntensity: 0.2 + intensity * 0.6,
    flickerAmount: intensity * 0.1,
  };

  // Generate timing
  const timing = {
    scanDuration: 3000 - intensity * 1000,
    flickerFrequency: 200 + Math.random() * 300,
    fluctuationSpeed: 2000 + Math.random() * 1000,
  };

  return {
    effects,
    timing,
    css: generateHolographicCSS(elementId, effects, timing),
  };
}

/**
 * Generate CSS for glitch effect
 */
function generateGlitchCSS(elementId, intensity) {
  // This would generate actual CSS to be injected
  // Simplified for this example
  return `
    @keyframes glitch-${elementId} {
      0% { transform: translate(0); filter: none; }
      ${
        intensity > 0.3 ? '10% { transform: translate(-2px, 1px); filter: hue-rotate(90deg); }' : ''
      }
      ${intensity > 0.5 ? '20% { transform: translate(2px, -1px); filter: brightness(1.2); }' : ''}
      ${intensity > 0.7 ? '30% { transform: translate(-1px, -2px); filter: contrast(1.5); }' : ''}
      100% { transform: translate(0); filter: none; }
    }
  `;
}

/**
 * Generate CSS for trauma effect
 */
function generateTraumaCSS(elementId, level, effects) {
  return `
    @keyframes trauma-pulse-${elementId} {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: ${1 - effects.pulseOpacity}; transform: scale(${effects.pulseScale}); }
    }
    ${
      level >= 3
        ? `
    @keyframes trauma-distort-${elementId} {
      0%, 100% { filter: blur(0) hue-rotate(0); }
      33% { filter: blur(${effects.blurAmount}px) hue-rotate(${effects.hueRotate}deg); }
      66% { filter: blur(${effects.blurAmount / 2}px) hue-rotate(-${effects.hueRotate}deg); }
    }
    `
        : ''
    }
  `;
}

/**
 * Generate CSS for mutation effect
 */
function generateMutationCSS(elementId, profileType, effects, timing) {
  let keyframes = '';

  switch (profileType) {
    case 'trauma':
      keyframes = `
        @keyframes mutation-${elementId} {
          0% { transform: skew(0); box-shadow: 0 0 0 rgba(153, 0, 255, 0); }
          50% { transform: skew(${effects.skew}deg); box-shadow: 0 0 15px ${effects.glowColor}; }
          100% { transform: skew(0); box-shadow: 0 0 0 rgba(153, 0, 255, 0); }
        }
      `;
      break;
    case 'quantum':
      keyframes = `
        @keyframes mutation-${elementId} {
          0% { filter: blur(0) brightness(1); box-shadow: 0 0 0 rgba(0, 255, 255, 0); }
          50% { filter: blur(${effects.blur}px) brightness(1.2); box-shadow: 0 0 15px ${effects.glowColor}; }
          100% { filter: blur(0) brightness(1); box-shadow: 0 0 0 rgba(0, 255, 255, 0); }
        }
      `;
      break;
    default:
      keyframes = `
        @keyframes mutation-${elementId} {
          0% { transform: scale(1) rotate(0); box-shadow: 0 0 0 rgba(255, 255, 255, 0); }
          50% { transform: scale(${effects.scale}) rotate(${effects.rotate}deg); box-shadow: 0 0 10px ${effects.glowColor}; }
          100% { transform: scale(1) rotate(0); box-shadow: 0 0 0 rgba(255, 255, 255, 0); }
        }
      `;
  }

  return keyframes;
}

/**
 * Generate CSS for holographic effect
 */
function generateHolographicCSS(elementId, effects, timing) {
  return `
    @keyframes holo-scan-${elementId} {
      0% { top: -10%; }
      100% { top: 110%; }
    }

    @keyframes holo-flicker-${elementId} {
      0%, 100% { opacity: ${effects.opacity}; }
      50% { opacity: ${effects.opacity - effects.flickerAmount}; }
    }
  `;
}
