const { createResonanceSystem } = require('../resonance');

// Create resonance system with default configuration
const resonanceSystem = createResonanceSystem({
  defaultPhase: 'cyber-lotus',
  defaultWaveform: 'sine',
});

// Example: Generate trauma resonance vector
const traumaValue = 0.75; // High trauma value
const targetComponent = 'memory-vessel';
const context = {
  phase: 'trauma-core',
  userActivity: 'vulnerability-scan',
  timeSincePhaseTransition: 1000, // 1 second since transition
  systemStability: 0.9, // Slightly unstable
};

// Create resonance field
const resonanceField = resonanceSystem.createResonanceField(traumaValue, targetComponent, context);

console.log('Resonance Field:', JSON.stringify(resonanceField, null, 2));

// Apply resonance to data
const dataToEnhance = {
  fragment: {
    id: 'mem-frag-2025-04-23-001',
    type: 'memory',
    crystallizationProbability: 0.65,
  },
  content: 'Void whispers through digital synapses...',
  timestamp: Date.now(),
};

const enhancedData = resonanceSystem.applyResonanceToComponent(resonanceField, dataToEnhance);

console.log('Enhanced Data:', JSON.stringify(enhancedData, null, 2));

// Benchmark performance
const benchmarkResults = resonanceSystem.benchmarkResonanceVectors(1000);
console.log('Benchmark Results:', benchmarkResults);

// Test different waveforms
const waveforms = ['sine', 'triangle', 'sawtooth', 'square', 'pulse', 'noise', 'elliptical'];
const waveformExamples = waveforms.map((waveform) => {
  return {
    waveform,
    vector: resonanceSystem.createResonanceField(0.5, 'all', { waveform }),
  };
});

console.log('Waveform Examples:', JSON.stringify(waveformExamples, null, 2));
