/**
 * Setup file for Quantum-related tests
 * This file is loaded by Jest before running the quantum tests
 */

// Import base setup
require('./setup.js');

// Mock the Web Worker
class MockWorker {
  constructor(stringUrl) {
    this.url = stringUrl;
    this.onmessage = null;
  }

  postMessage(msg) {
    // Simulate response in next event loop
    setTimeout(() => {
      if (this.onmessage) {
        let response;
        switch (msg.type) {
          case 'calculateQuantumState':
            response = {
              type: 'quantumStateResult',
              result: {
                particles: Array(10)
                  .fill(0)
                  .map(() => ({
                    x: Math.random(),
                    y: Math.random(),
                    z: Math.random(),
                    size: 1.0,
                    speed: 1.0,
                  })),
                stabilityFactor: 0.75,
                coherence: 0.8,
                phaseAlignment: 0.9,
              },
            };
            break;
          case 'processTraumaPatterns':
            response = {
              type: 'traumaPatternsResult',
              result: {
                patterns: [
                  { type: 'glitch', intensity: msg.data.intensity || 0.5, pattern: [] },
                  { type: 'void', intensity: msg.data.intensity || 0.3, pattern: [] },
                ],
              },
            };
            break;
          case 'generateMutationProfile':
            response = {
              type: 'mutationProfileResult',
              result: {
                colors: {
                  primary: '#00ffff',
                  secondary: '#008080',
                  accent: '#ff00ff',
                  background: '#000000',
                },
                animations: {
                  duration: 1000,
                  easing: 'ease-in-out',
                  delay: 0,
                  transformations: [],
                },
                particleSystem: {
                  count: 50,
                  size: 2,
                  speed: 1,
                  distribution: 'sphere',
                  coherence: 0.7,
                },
                stabilityFactor: 0.8,
              },
            };
            break;
          default:
            response = {
              type: 'error',
              error: 'Unknown command',
            };
        }
        this.onmessage({ data: response });
      }
    }, 10);
  }

  terminate() {
    // Do nothing in the mock
  }
}

// Mock for THREE.js
global.THREE = {
  WebGLRenderer: jest.fn().mockImplementation(() => ({
    setSize: jest.fn(),
    setPixelRatio: jest.fn(),
    render: jest.fn(),
    dispose: jest.fn(),
    domElement: document.createElement('canvas'),
  })),
  Scene: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    remove: jest.fn(),
    traverse: jest.fn((cb) => cb({ geometry: null, material: null })),
  })),
  PerspectiveCamera: jest.fn().mockImplementation(() => ({
    position: { x: 0, y: 0, z: 0 },
    lookAt: jest.fn(),
    aspect: 1,
    updateProjectionMatrix: jest.fn(),
  })),
  Vector3: jest.fn().mockImplementation((x, y, z) => ({ x, y, z, set: jest.fn() })),
  Color: jest.fn().mockImplementation(() => ({ set: jest.fn() })),
  AmbientLight: jest.fn(),
  DirectionalLight: jest.fn().mockImplementation(() => ({ position: { x: 0, y: 0, z: 0 } })),
  PointLight: jest.fn().mockImplementation(() => ({ position: { x: 0, y: 0, z: 0 } })),
  Group: jest.fn().mockImplementation(() => ({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    add: jest.fn(),
    remove: jest.fn(),
    traverse: jest.fn(),
  })),
  Clock: jest.fn().mockImplementation(() => ({
    getDelta: jest.fn().mockReturnValue(0.016),
    getElapsedTime: jest.fn().mockReturnValue(10),
  })),
  EffectComposer: jest.fn().mockImplementation(() => ({
    addPass: jest.fn(),
    render: jest.fn(),
    dispose: jest.fn(),
  })),
  ShaderPass: jest.fn().mockImplementation(() => ({
    uniforms: {},
  })),
  RenderPass: jest.fn(),
  GlitchPass: jest.fn().mockImplementation(() => ({
    uniforms: { amount: { value: 0 } },
  })),
  UnrealBloomPass: jest.fn().mockImplementation(() => ({
    strength: 0,
    radius: 0,
    threshold: 0,
  })),
  Vector2: jest.fn().mockImplementation((x, y) => ({ x, y })),
  sRGBEncoding: 'sRGBEncoding',
  ACESFilmicToneMapping: 'ACESFilmicToneMapping',
};

// Mock the Worker constructor
global.Worker = MockWorker;

// Mock HTML elements for testing
global.HTMLElement.prototype.getBoundingClientRect = jest.fn().mockReturnValue({
  width: 500,
  height: 500,
  top: 0,
  left: 0,
  bottom: 500,
  right: 500,
});

// Logging setup for quantum tests
console.log('Quantum test setup complete');
