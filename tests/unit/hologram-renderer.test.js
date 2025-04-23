// Quantum-entangled Hologram Renderer Test Suite

describe('HologramRenderer', () => {
  let HologramRenderer;

  // Mock THREE.js
  beforeAll(() => {
    // Import the module after mocking THREE global
    HologramRenderer = require('../../assets/hologram-renderer').HologramRenderer;
  });

  // Create a fresh renderer for each test
  let renderer;
  let testCanvas;

  beforeEach(() => {
    testCanvas = document.createElement('canvas');
    document.body.appendChild(testCanvas);

    // Allow access to private properties for testing
    renderer = HologramRenderer;
    renderer.canvas = testCanvas;
    renderer.camera = {
      position: { set: jest.fn() },
      lookAt: jest.fn(),
      aspect: 1,
      updateProjectionMatrix: jest.fn(),
    };

    // Mock the WebGL initialization
    renderer._initWebGL = jest.fn(() => true);
  });

  afterEach(() => {
    document.body.removeChild(testCanvas);
    jest.clearAllMocks();
  });

  it('should initialize with default options', () => {
    const options = {};
    renderer.initialize(testCanvas, options);

    expect(renderer._initWebGL).toHaveBeenCalled();
    expect(renderer.traumaLevel).toBe(0);
    expect(renderer.intensityFactor).toBe(1);
  });

  it('should load 3D model', () => {
    const modelUrl = 'https://voidbloom.com/models/cyber-artifact-1.glb';
    const loadModelSpy = jest.spyOn(renderer, 'loadModel').mockImplementation((url, callback) => {
      callback({ scene: { scale: { set: jest.fn() }, position: { set: jest.fn() } } });
      return Promise.resolve();
    });

    renderer.initialize(testCanvas);
    renderer.loadModel(modelUrl);

    expect(loadModelSpy).toHaveBeenCalledWith(modelUrl, expect.any(Function));
  });

  it('should apply quantum effects', () => {
    const applyEffectsSpy = jest
      .spyOn(renderer, 'applyQuantumEffects')
      .mockImplementation(() => {});

    renderer.initialize(testCanvas);
    renderer.applyQuantumEffects(0.5);

    expect(applyEffectsSpy).toHaveBeenCalledWith(0.5);
  });

  it('should apply glitch effect', () => {
    const applyGlitchSpy = jest.spyOn(renderer, 'applyGlitchEffect').mockImplementation(() => {});

    renderer.initialize(testCanvas);
    renderer.applyGlitchEffect(0.7);

    expect(applyGlitchSpy).toHaveBeenCalledWith(0.7);
  });

  it('should update size of renderer', () => {
    const resizeSpy = jest.spyOn(renderer, 'resize').mockImplementation(() => {});

    renderer.initialize(testCanvas);
    renderer.resize(800, 600);

    expect(resizeSpy).toHaveBeenCalledWith(800, 600);
  });

  it('should clean up resources when disposed', () => {
    const disposeSpy = jest.spyOn(renderer, 'dispose').mockImplementation(() => {});

    renderer.initialize(testCanvas);
    renderer.dispose();

    expect(disposeSpy).toHaveBeenCalled();
  });
});
