/**
 * Type definitions for the QuantumWebGL rendering system
 */

interface QuantumWebGLConfig {
  container?: HTMLElement;
  width?: number;
  height?: number;
  profile?: string;
  intensity?: number;
  traumaCodes?: string[];
  enableGlitch?: boolean;
  enableBloom?: boolean;
  renderMode?: 'standard' | 'quantum';
  debug?: boolean;
  phaseColors?: {
    [phase: string]: {
      primary: string;
      secondary: string;
    };
  };
}

interface QuantumWebGLState {
  initialized: boolean;
  running: boolean;
  currentProfile: string;
  currentIntensity: number;
  currentTraumaCodes: string[];
  fps: number;
  renderTime: number;
  particleCount: number;
  glitchActive: boolean;
  stabilityFactor: number;
}

interface QuantumWebGLEffects {
  composer?: THREE.EffectComposer;
  renderPass?: THREE.RenderPass;
  bloomPass?: THREE.UnrealBloomPass;
  glitchPass?: THREE.GlitchPass;
  rgbShiftPass?: THREE.ShaderPass;
  traumaPass?: THREE.ShaderPass;
  [key: string]: any;
}

interface QuantumWebGLScene {
  scene?: THREE.Scene;
  camera?: THREE.PerspectiveCamera;
  renderer?: THREE.WebGLRenderer;
  lights?: {
    ambient?: THREE.AmbientLight;
    directional?: THREE.DirectionalLight;
    point?: THREE.PointLight;
  };
  particleSystem?: THREE.Group;
  traumaGroup?: THREE.Group;
  clock?: THREE.Clock;
}

interface QuantumWebGLCallbacks {
  onInitialized?: () => void;
  onRender?: (stats: any) => void;
  onProfileChange?: (profile: string) => void;
  onStabilityChange?: (stability: number) => void;
  onGlitchStart?: () => void;
  onGlitchEnd?: () => void;
  onTraumaCodesChange?: (traumaCodes: string[]) => void;
  onError?: (error: Error) => void;
}

interface QuantumWebGLController {
  initialize(config: QuantumWebGLConfig): Promise<void>;
  start(): void;
  stop(): void;
  applyProfile(profile: string): void;
  setIntensity(intensity: number): void;
  setTraumaCodes(traumaCodes: string[]): void;
  applyGlitch(intensity?: number, duration?: number): void;
  resize(width: number, height: number): void;
  updateSize(width: number, height: number): void;
  dispose(): void;
  getState(): QuantumWebGLState;
}
