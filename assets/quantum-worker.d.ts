/**
 * Type definitions for the Quantum Worker system
 */

interface QuantumWorkerData {
  intensity?: number;
  profile?: string;
  traumaCodes?: string[];
  baseProfile?: string;
  traumaInfluence?: number;
}

interface QuantumParticle {
  x: number;
  y: number;
  z: number;
  size: number;
  speed: number;
  glitchFactor?: number;
  voidFactor?: number;
  echoFactor?: number;
  fractureFactor?: number;
  colorShift?: number[];
}

interface QuantumStateResult {
  particles: QuantumParticle[];
  stabilityFactor: number;
  coherence: number;
  phaseAlignment: number;
  traumaPatterns?: TraumaPatternResult[];
}

interface TraumaPatternResult {
  type: string;
  intensity: number;
  pattern: any[];
}

interface ProfileColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

interface ProfileAnimations {
  duration: number;
  easing: string;
  delay: number;
  transformations: string[];
}

interface ParticleSystemConfig {
  count: number;
  size: number;
  speed: number;
  distribution: string;
  coherence: number;
}

interface MutationProfileResult {
  colors: ProfileColors;
  animations: ProfileAnimations;
  particleSystem: ParticleSystemConfig;
  stabilityFactor: number;
  css?: string;
}

// Augment the Worker interface for our specific use case
interface QuantumWorker extends Worker {
  postMessage(message: { type: string; data: QuantumWorkerData }): void;
}

// Message event for our worker
interface QuantumWorkerMessageEvent extends MessageEvent {
  data: {
    type: string;
    result?: any;
    error?: string;
  };
}
