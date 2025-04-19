/**
 * @jest-environment jsdom
 */

import HologramRenderer from '../../assets/hologram-renderer';

// Mock Three.js and WebGL support
jest.mock('three', () => {
  return {
    WebGLRenderer: jest.fn().mockImplementation(() => ({
      setSize: jest.fn(),
      setPixelRatio: jest.fn(),
      render: jest.fn(),
      dispose: jest.fn(),
    })),
    Scene: jest.fn().mockImplementation(() => ({
      add: jest.fn(),
    })),
    PerspectiveCamera: jest.fn().mockImplementation(() => ({
      position: { set: jest.fn() },
      lookAt: jest.fn(),
      aspect: 1,
      updateProjectionMatrix: jest.fn(),
    })),
    AmbientLight: jest.fn().mockImplementation(() => ({})),
    DirectionalLight: jest.fn().mockImplementation(() => ({
      position: { set: jest.fn() },
    })),
    Clock: jest.fn().mockImplementation(() => ({
      getDelta: jest.fn().mockReturnValue(0.016),
    })),
    Group: jest.fn().mockImplementation(() => ({
      rotation: { x: 0, y: 0, z: 0 },
    })),
    sRGBEncoding: 'sRGBEncoding',
    ACESFilmicToneMapping: 'ACESFilmicToneMapping',
  };
});

describe('HologramRenderer', () => {
  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <div id="hologram-container" style="width: 300px; height: 300px;"></div>
    `;

    // Mock canvas and WebGL support
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
      // Mock WebGL context methods
    }));

    // Mock Worker
    global.Worker = class MockWorker {
      constructor() {
        this.addEventListener = jest.fn();
        this.postMessage = jest.fn();
        this.terminate = jest.fn();
      }
    };

    // Mock requestAnimationFrame
    global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 0));
    global.cancelAnimationFrame = jest.fn();

    // Clear any previous initialization
    HologramRenderer.initialized = false;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  test('should initialize with default options', () => {
    const container = document.getElementById('hologram-container');

    HologramRenderer.initialize({ container });

    expect(HologramRenderer.initialized).toBe(true);
    expect(HologramRenderer.options.width).toBe(300);
    expect(HologramRenderer.options.height).toBe(300);
  });

  test('should load 3D model', async () => {
    const container = document.getElementById('hologram-container');

    // Initialize renderer
    HologramRenderer.initialize({ container });

    // Create spy for _setupModel method
    const setupModelSpy = jest.spyOn(HologramRenderer, '_setupModel');

    // Load a model
    const modelPromise = HologramRenderer.loadModel('test-model.glb');

    // Since we're using setTimeout to simulate async loader in our mock
    await modelPromise;

    expect(setupModelSpy).toHaveBeenCalled();
  });

  test('should apply quantum effects', () => {
    const container = document.getElementById('hologram-container');

    // Initialize renderer
    HologramRenderer.initialize({ container });

    // Mock the worker for testing
    const postMessageSpy = jest.spyOn(HologramRenderer.worker, 'postMessage');

    // Apply effects
    HologramRenderer.applyQuantumEffects({
      profile: 'VoidBloom',
      intensity: 0.8,
      traumaCodes: ['glitch-0.5'],
    });

    expect(postMessageSpy).toHaveBeenCalledWith({
      type: 'calculate-quantum-state',
      data: expect.objectContaining({
        profile: 'VoidBloom',
        intensity: 0.8,
        traumaCodes: ['glitch-0.5'],
      }),
    });
  });

  test('should apply glitch effect', () => {
    const container = document.getElementById('hologram-container');

    // Initialize renderer
    HologramRenderer.initialize({ container });

    // Create spy for _setupGlitchEffect method
    const setupGlitchSpy = jest.spyOn(HologramRenderer, '_setupGlitchEffect');

    // Apply glitch effect
    HologramRenderer.applyGlitch(0.7, 200);

    expect(setupGlitchSpy).toHaveBeenCalledWith(0.7);

    // Fast-forward timers to check cleanup
    jest.advanceTimersByTime(300);

    // Should have cleaned up
    expect(HologramRenderer._removeGlitchEffect).toHaveBeenCalled();
  });

  test('should update size of renderer', () => {
    const container = document.getElementById('hologram-container');

    // Initialize renderer
    HologramRenderer.initialize({ container });

    // Update size
    HologramRenderer.updateSize(500, 400);

    expect(HologramRenderer.options.width).toBe(500);
    expect(HologramRenderer.options.height).toBe(400);
    expect(HologramRenderer.renderer.setSize).toHaveBeenCalledWith(500, 400);
  });

  test('should clean up resources when disposed', () => {
    const container = document.getElementById('hologram-container');

    // Initialize renderer
    HologramRenderer.initialize({ container });

    // Dispose
    HologramRenderer.dispose();

    expect(HologramRenderer.initialized).toBe(false);
    expect(global.cancelAnimationFrame).toHaveBeenCalled();
    expect(HologramRenderer.renderer.dispose).toHaveBeenCalled();

    if (HologramRenderer.worker) {
      expect(HologramRenderer.worker.terminate).toHaveBeenCalled();
    }
  });
});
