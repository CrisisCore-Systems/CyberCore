const { createResonanceSystem } = require('../resonance');
const {
  ZCurveFunctions,
  StrengthModulators,
  CoherenceModulators,
} = require('../utils/ResonanceFunctions');

// Create resonance system
const resonanceSystem = createResonanceSystem({
  defaultPhase: 'cyber-lotus',
  defaultWaveform: 'sine',
});

// Example 1: Basic trauma resonance
console.log('\n--- Example 1: Basic Trauma Resonance ---');
const basicResonance = resonanceSystem.createResonanceField(
  0.7, // High trauma value
  'memory-vessel', // Target component
  { phase: 'cyber-lotus' }
);
console.log(JSON.stringify(basicResonance, null, 2));

// Example 2: Advanced trauma resonance with custom modulators
console.log('\n--- Example 2: Advanced Trauma Resonance ---');
const advancedResonance = resonanceSystem.createResonanceField(
  0.7, // Same trauma value
  'memory-vessel', // Same target
  {
    phase: 'trauma-core',
    waveform: 'triangle', // Sharp transitions
    phaseShift: Math.PI / 4, // 45° rotation
    customZCurve: ZCurveFunctions.sCurve, // S-curve for Z-dimension
    strengthModulator: StrengthModulators.pulsing, // Pulsing strength
    coherenceDrift: CoherenceModulators.traumaSensitive, // Trauma affects coherence
    pulseFrequency: 1000, // 1 second cycle for pulsing
    pulseAmplitude: 0.3, // 30% strength variation
  }
);
console.log(JSON.stringify(advancedResonance, null, 2));

// Example 3: Phase comparison
console.log('\n--- Example 3: Phase Comparison ---');
const phases = ['cyber-lotus', 'alien-flora', 'rolling-virus', 'trauma-core', 'transcendent'];
const phaseComparison = phases.map((phase) => {
  const resonance = resonanceSystem.createResonanceField(
    0.7, // Same trauma value
    'all', // Global targeting
    { phase }
  );

  return {
    phase,
    x: resonance.x,
    y: resonance.y,
    z: resonance.z,
    strength: resonance.strength,
    coherence: resonance.coherence,
  };
});

console.table(phaseComparison);

// Example 4: Waveform comparison
console.log('\n--- Example 4: Waveform Comparison ---');
const waveforms = ['sine', 'triangle', 'sawtooth', 'square', 'pulse', 'noise', 'elliptical'];
const waveformComparison = waveforms.map((waveform) => {
  const resonance = resonanceSystem.createResonanceField(
    0.7, // Same trauma value
    'prompt-engine', // Language system
    {
      phase: 'cyber-lotus',
      waveform,
    }
  );

  return {
    waveform,
    x: resonance.x,
    y: resonance.y,
    z: resonance.z,
    strength: resonance.strength,
    coherence: resonance.coherence,
  };
});

console.table(waveformComparison);

// Example 5: Apply resonance to data
console.log('\n--- Example 5: Apply Resonance to Data ---');

// Memory vessel data
const memoryData = {
  fragment: {
    id: 'mem-frag-2025-04-23-005',
    type: 'memory',
    crystallizationProbability: 0.65,
    stability: 0.9,
    content: 'Void whispers through digital synapses',
  },
};

// Neural system data
const neuralData = {
  neuralState: {
    processingSpeedModifier: 1.0,
    stabilityFactor: 1.0,
    mode: 'standard',
  },
};

// Create resonance fields
const memoryResonance = resonanceSystem.createResonanceField(0.8, 'memory-vessel', {
  phase: 'trauma-core',
  waveform: 'sawtooth',
});

const neuralResonance = resonanceSystem.createResonanceField(0.8, 'neural-architecture', {
  phase: 'trauma-core',
  waveform: 'triangle',
});

// Apply resonance
const enhancedMemory = resonanceSystem.applyResonanceToComponent(memoryResonance, memoryData);
const enhancedNeural = resonanceSystem.applyResonanceToComponent(neuralResonance, neuralData);

console.log('Enhanced Memory:', JSON.stringify(enhancedMemory, null, 2));
console.log('Enhanced Neural:', JSON.stringify(enhancedNeural, null, 2));

// Example 6: Benchmark different configurations
console.log('\n--- Example 6: Benchmark ---');
const benchmarkBasic = resonanceSystem.benchmarkResonanceVectors(1000);
console.log('Basic Benchmark:', benchmarkBasic);
