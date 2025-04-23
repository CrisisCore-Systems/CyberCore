# Advanced Trauma Resonance Vectors

This document covers the advanced features of the Trauma Resonance Vector System, including dimensional mapping, custom modulation, and waveform variants.

## Dimensional Mapping

### X-Y Dimensions

The X and Y dimensions create an oscillatory path that represents the cyclical nature of emotional states. By default, these dimensions use sine/cosine waves to create circular paths, but they can be modified in several ways:

#### Alternative Waveforms

Different waveforms create distinct emotional signatures:

| Waveform   | Emotional Signature              | Best For                                              |
| ---------- | -------------------------------- | ----------------------------------------------------- |
| Sine       | Smooth, gradual transitions      | Subtle emotional flow, organic memory crystallization |
| Triangle   | Sharp, linear transitions        | Clear emotional boundaries, security thresholds       |
| Sawtooth   | Gradual build-up, sudden release | Building anticipation, commerce-trauma                |
| Square     | Binary emotional states          | Alert/danger scenarios, stark transitions             |
| Pulse      | Asymmetric emotional states      | Anxiety, irregular patterns                           |
| Noise      | Unstable, chaotic emotions       | Interference, corruption, rolling-virus phase         |
| Elliptical | Non-circular emotional paths     | Phase-specific emotional signatures                   |

#### Phase Shifting

The `phaseShift` parameter allows rotation of emotional patterns within the X-Y plane, creating variations while maintaining coherent structure:

```javascript
createResonanceField(trauma, component, {
  phaseShift: Math.PI / 4, // 45° rotation
});
```

#### Elliptical Paths

Each system phase has unique elliptical parameters that create distinct emotional signatures:

```javascript
// Cyber-lotus phase: emphasizes y-dimension (emotional clarity)
const ellipticalParams = {
  xRadius: 0.4,
  yRadius: 0.6,
  rotation: 0,
  center: [0.5, 0.5],
};
```

### Z-Dimension

The Z-dimension provides direct mapping of trauma to emotional intensity, with options for non-linear curves:

#### Z-Curve Functions

| Function      | Effect                           | Best For                              |
| ------------- | -------------------------------- | ------------------------------------- |
| linear        | Direct 1:1 mapping               | Neutral emotional perspective         |
| earlyEmphasis | Emphasizes lower trauma values   | Subtle emotional states, cyber-lotus  |
| lateEmphasis  | Emphasizes higher trauma values  | Intense emotions, trauma-core         |
| sCurve        | Balanced with distinct mid-range | Transcendent phase, balanced emphasis |
| threshold     | Sharp transition at midpoint     | Binary emotional states               |
| oscillating   | Wave-modulated intensity         | Complex emotional patterns            |
| dualPeak      | Two intensity peaks              | Ambivalent or conflicted emotions     |

Example:

```javascript
createResonanceField(trauma, component, {
  customZCurve: ZCurveFunctions.sCurve,
});
```

## Strength & Coherence Modulation

### Strength Modulators

Strength affects the amplitude or intensity of the resonance effect:

| Modulator                 | Effect                           | Best For                            |
| ------------------------- | -------------------------------- | ----------------------------------- |
| default                   | No modulation (1.0)              | Standard processing                 |
| traumaProportional        | Higher trauma = stronger effect  | Emergency responses                 |
| inverseTraumaProportional | Lower trauma = stronger effect   | Subtle enhancement                  |
| pulsing                   | Rhythmic intensity variations    | Unstable phases, attention-grabbing |
| phaseAdaptive             | Phase-specific strength profiles | System-wide phase coherence         |

Example:

```javascript
createResonanceField(trauma, component, {
  strengthModulator: StrengthModulators.pulsing,
  pulseFrequency: 1000, // 1 second cycle
});
```

### Coherence Modulators

Coherence determines the stability and clarity of the emotional propagation:

| Modulator         | Effect                           | Best For                             |
| ----------------- | -------------------------------- | ------------------------------------ |
| perfect           | Always 1.0 (perfect coherence)   | Critical systems, transcendent phase |
| timeDecay         | Degrades over time               | Temporary effects, fading memories   |
| phaseTransition   | Lower after phase transitions    | Realistic phase adaptation           |
| traumaSensitive   | High trauma reduces coherence    | Realistic emotional overload         |
| componentSpecific | Different baseline per component | Targeted system tuning               |

Example:

```javascript
createResonanceField(trauma, component, {
  coherenceDrift: CoherenceModulators.timeDecay,
  creationTime: Date.now(),
});
```

## Component-Specific Targeting

The resonance system can target specific components with controlled bleed to others:

```javascript
// Component map for targeted resonance
{
  'neural-architecture': 0.7,  // Secondary effect
  'memory-vessel': 1.0,        // Primary target
  'security-trauma': 0.7,      // Secondary effect
  'commerce-integration': 0.7, // Secondary effect
  'prompt-engine': 0.7         // Secondary effect
}
```

High trauma values (>0.7) automatically increase bleed to other components, creating system-wide resonance during intense trauma.

## Advanced Usage Examples

### Phase-Specific Resonance

```javascript
// Create trauma resonance optimized for trauma-core phase
const resonanceField = resonanceSystem.createResonanceField(
  0.8, // High trauma
  'memory-vessel',
  {
    phase: 'trauma-core',
    waveform: 'sawtooth', // Building tension, sudden release
    customZCurve: ZCurveFunctions.lateEmphasis, // Emphasize high trauma
    strengthModulator: StrengthModulators.phaseAdaptive,
  }
);
```

### Custom Modulation Chain

```javascript
// Create custom strength modulator combining multiple effects
const customStrengthModulator = (t, component, context) => {
  // Base strength from trauma
  let strength = 0.8 + t * 0.4;

  // Add pulsing effect
  const pulse = Math.sin((Date.now() / 2000) * Math.PI * 2) * 0.2;
  strength *= 1 + pulse;

  // Component-specific adjustments
  if (component === 'security-trauma') {
    strength *= 1.2;
  }

  return Math.max(0.1, Math.min(2.0, strength));
};

// Use custom modulator
const resonanceField = resonanceSystem.createResonanceField(0.6, 'security-trauma', {
  strengthModulator: customStrengthModulator,
});
```

## Performance Considerations

For high-performance applications, consider these optimizations:

1. Use simpler waveforms (sine, triangle) for better performance
2. Pre-calculate phase-specific parameters where possible
3. Limit custom functions to critical components
4. Use the benchmarking tool to identify bottlenecks

```javascript
const benchmarkResults = resonanceSystem.benchmarkResonanceVectors(1000);
console.log(benchmarkResults);
```
