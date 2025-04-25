/**
 * VoidBloom Hologram Renderer
 * Quantum-encoded visual system for trauma-responsive memory artifacts
 *
 * This is a unified implementation that combines functionality from
 * both the static and instance-based previous implementations.
 */

/**
 * Options for configuring the hologram renderer
 */
export interface HologramOptions {
  /** Container element to render in (static mode) */
  container?: HTMLElement;
  /** Canvas element to render on (instance mode) */
  canvas?: HTMLCanvasElement;
  /** Width of the renderer */
  width?: number;
  /** Height of the renderer */
  height?: number;
  /** Hologram brightness/intensity (0.0 - 1.0) */
  intensity?: number;
  /** CSS color string for the hologram overlay */
  color?: string;
  /** Whether to enable trauma-responsive rendering */
  traumaResponsive?: boolean;
  /** Type of dimensional rendering */
  dimensions?: '2d' | '3d' | '4d';
  /** Mutation profile name */
  profile?: string;
  /** Glitch effect intensity */
  glitchFactor?: number;
  /** Memory fragmentation level */
  memoryFragmentation?: number;
  /** Whether to fail if there's a performance issue */
  failIfMajorPerformanceCaveat?: boolean;
  /** Whether to enable glitch effects */
  enableGlitch?: boolean;
  /** Callback when renderer is ready */
  onReady?: () => void;
  /** Whether to enable debug mode */
  debug?: boolean;
}

/**
 * Render target information
 */
export interface RenderTarget {
  /** Target DOM element */
  element: HTMLElement;
  /** Canvas element for rendering */
  canvas?: HTMLCanvasElement;
  /** Rendering context */
  context?: WebGLRenderingContext | CanvasRenderingContext2D;
}

/**
 * Instance state for static renderer instances
 */
interface RendererInstance {
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  uIntensityLoc: WebGLUniformLocation;
  uColorLoc: WebGLUniformLocation;
  color: number[];
  intensity: number;
  _raf?: number;
}

/**
 * HologramRenderer
 * WebGL-powered renderer for holographic product previews
 *
 * Supports both static (class-based) and instance-based usage patterns.
 */
export class HologramRenderer {
  // Static properties for class-based usage
  private static instances = new WeakMap<HTMLElement, RendererInstance>();
  private static initialized = false;
  private static options: HologramOptions = {};
  private static container: HTMLElement | null = null;
  private static worker: Worker | null = null;
  private static scene: any = null;
  private static camera: any = null;
  private static renderer: any = null;
  private static model: any = null;
  private static clock: any = null;
  private static animationFrameId: number | null = null;
  private static quantumParticles: any[] = [];
  private static traumaEffects: any[] = [];
  private static ready = false;

  // Instance properties for object-based usage
  private options: HologramOptions;
  private canvas: HTMLCanvasElement | null = null;
  private gl: WebGLRenderingContext | null = null;
  private camera: any = null;
  private scene: any = null;
  private renderer: any = null;
  private model: any = null;
  private traumaLevel: number = 0;
  private intensityFactor: number = 1;
  private active: boolean = false;
  private animationFrame: number | null = null;
  private targets: RenderTarget[] = [];

  /**
   * Constructor for instance-based usage
   */
  constructor() {
    // Default options
    this.options = {
      intensity: 0.8,
      traumaResponsive: true,
      dimensions: '3d',
      profile: 'default',
      glitchFactor: 0.2,
      memoryFragmentation: 0,
    };
  }

  // ====================================================================================
  // STATIC API (class-based usage pattern, for backward compatibility)
  // ====================================================================================

  /**
   * Initialize the hologram renderer
   * @param options - Configuration options
   */
  public static initialize(options: HologramOptions): typeof HologramRenderer {
    // Only initialize once
    if (this.initialized) {
      return this;
    }

    this.options = {
      width: 300,
      height: 300,
      profile: 'CyberLotus',
      intensity: 1.0,
      enableGlitch: false,
      onReady: () => {},
      debug: false,
      ...options,
    };

    this.container = options.container || null;
    this.worker = null;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.model = null;
    this.clock = null;
    this.animationFrameId = null;
    this.quantumParticles = [];
    this.traumaEffects = [];
    this.ready = false;

    // Initialize WebGL renderer
    this._initWebGL();

    // Initialize quantum worker
    this._initQuantumWorker();

    this.initialized = true;

    return this;
  }

  /**
   * Initialize the hologram renderer on a container element.
   * @param container - The DOM element to attach the renderer to
   * @param options - Configuration options
   */
  public static init(container: HTMLElement, options: HologramOptions = {}): void {
    if (!container) return;

    // Avoid double-init
    if (HologramRenderer.instances.has(container)) return;

    // Create a canvas for WebGL
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    // Check for WebGL support and hardware acceleration
    const gl = HologramRenderer._createWebGLContext(canvas, options.failIfMajorPerformanceCaveat);

    if (!gl) {
      console.error('HologramRenderer: WebGL not supported');
      container.removeChild(canvas);
      HologramRenderer._showHardwareAccelerationWarning();
      return;
    }

    // Check for software rendering and show warning if detected
    if (!HologramRenderer._checkHardwareAcceleration(gl)) {
      HologramRenderer._showHardwareAccelerationWarning();
      // Continue anyway to provide the experience, just with a warning
    }

    // Basic scene setup (placeholder shaders)
    // Create a simple fragment shader that flashes color
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;
    const fragmentShaderSource = `
      precision mediump float;
      uniform float u_intensity;
      uniform vec3 u_color;
      void main() {
        gl_FragColor = vec4(u_color * u_intensity, 1.0);
      }
    `;
    // Compile shaders
    const vertexShader = HologramRenderer._compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = HologramRenderer._compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    if (!vertexShader || !fragmentShader) {
      console.error('HologramRenderer: Failed to compile shaders');
      container.removeChild(canvas);
      return;
    }

    // Create program
    const program = HologramRenderer._createProgram(gl, vertexShader, fragmentShader);

    if (!program) {
      console.error('HologramRenderer: Failed to create program');
      container.removeChild(canvas);
      return;
    }

    gl.useProgram(program);

    // Set up a square covering entire canvas
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uIntensityLoc = gl.getUniformLocation(program, 'u_intensity')!;
    const uColorLoc = gl.getUniformLocation(program, 'u_color')!;

    // Parse options
    const intensity = options.intensity ?? 0.5;
    const color = HologramRenderer._parseColor(options.color || '#00ffcc');

    // Store instance state
    const instance: RendererInstance = {
      container,
      canvas,
      gl,
      program,
      uIntensityLoc,
      uColorLoc,
      color,
      intensity,
    };

    HologramRenderer.instances.set(container, instance);

    // Start render loop
    const renderLoop = () => {
      HologramRenderer._drawFrame(instance);
      instance._raf = requestAnimationFrame(renderLoop);
    };
    renderLoop();
  }

  /**
   * Load 3D model (static version)
   * @param model - Model options
   */
  public static loadModel(model: any): Promise<void> {
    if (!this.scene) {
      return Promise.reject('Scene not initialized');
    }

    // Implementation will be added based on context
    return Promise.resolve();
  }

  /**
   * Apply quantum effects (static version)
   * @param options - Effect options
   */
  public static applyQuantumEffects(options: any): typeof HologramRenderer {
    // Implementation will be added based on context
    return this;
  }

  /**
   * Apply glitch effect (static version)
   * @param intensity - Glitch intensity
   * @param duration - Effect duration in ms
   */
  public static applyGlitchEffect(
    intensity: number,
    duration: number = 1000
  ): typeof HologramRenderer {
    // Implementation will be added based on context
    return this;
  }

  /**
   * Resize the renderer (static version)
   * @param width - New width
   * @param height - New height
   */
  public static resize(width: number, height: number): typeof HologramRenderer {
    // Implementation will be added based on context
    return this;
  }

  /**
   * Destroy the hologram renderer on a container.
   * @param container - The container element
   */
  public static destroy(container: HTMLElement): void {
    const instance = HologramRenderer.instances.get(container);
    if (!instance) return;

    if (instance._raf) {
      cancelAnimationFrame(instance._raf);
    }
    instance.gl.deleteProgram(instance.program);
    instance.container.removeChild(instance.canvas);
    HologramRenderer.instances.delete(container);
  }

  /**
   * Dispose of renderer resources (static version)
   */
  public static dispose(): void {
    if (!this.initialized) return;

    // Stop animation loop
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Terminate worker if exists
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }

    // Dispose renderer
    if (this.renderer && typeof this.renderer.dispose === 'function') {
      this.renderer.dispose();
    }

    // Clear properties
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.model = null;
    this.clock = null;
    this.quantumParticles = [];
    this.traumaEffects = [];
    this.initialized = false;
  }

  /**
   * Create an optimized WebGL context with feature detection
   * @param canvas - The canvas element
   * @param failIfMajorPerformanceCaveat - Whether to fail if there's a performance issue
   * @return - WebGL context or null if not supported
   */
  private static _createWebGLContext(
    canvas: HTMLCanvasElement,
    failIfMajorPerformanceCaveat = false
  ): WebGLRenderingContext | null {
    const contextAttributes: WebGLContextAttributes = {
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: failIfMajorPerformanceCaveat,
    };

    try {
      // Try WebGL2 first for better performance
      let gl = canvas.getContext('webgl2', contextAttributes) as WebGLRenderingContext;
      if (gl) {
        console.log('Using WebGL2 context');
        return gl;
      }

      // Fall back to WebGL1
      gl = canvas.getContext('webgl', contextAttributes) as WebGLRenderingContext;
      if (gl) {
        console.log('Using WebGL1 context');
        return gl;
      }

      // Last resort: experimental-webgl
      gl = canvas.getContext('experimental-webgl', contextAttributes) as WebGLRenderingContext;
      if (gl) {
        console.log('Using experimental-webgl context');
        return gl;
      }
    } catch (e) {
      console.error('Error creating WebGL context:', e);
    }

    return null;
  }

  /**
   * Check if hardware acceleration is available
   * @param gl - WebGL context
   * @return - True if hardware acceleration is available
   */
  private static _checkHardwareAcceleration(gl: WebGLRenderingContext): boolean {
    try {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        console.log(`WebGL using: ${vendor} - ${renderer}`);

        // Check for software renderers
        if (/(swiftshader|software|llvmpipe)/i.test(renderer as string)) {
          console.warn('WebGL is using software rendering, performance may be degraded');
          return false;
        }
      }
      return true;
    } catch (e) {
      // If we can't check, assume it's ok
      return true;
    }
  }

  /**
   * Show hardware acceleration warning to the user
   */
  private static _showHardwareAccelerationWarning(): void {
    // Check if warning already exists
    if (document.getElementById('webgl-acceleration-warning')) return;

    const warning = document.createElement('div');
    warning.id = 'webgl-acceleration-warning';
    warning.innerHTML = `
      <div style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
                  background: #ffeb3b; color: #333; padding: 15px; border-radius: 8px;
                  z-index: 10000; box-shadow: 0 2px 10px rgba(0,0,0,0.2); max-width: 80%;">
        ⚠️ <strong>Performance Notice:</strong> Please enable hardware acceleration in your browser settings for optimal hologram performance.
        <a href="https://enable-webgl.com" target="_blank" style="display: block; margin-top: 8px; color: #0066cc;">
          Learn how to enable WebGL
        </a>
        <button style="position: absolute; top: 5px; right: 5px; background: none; border: none;
                cursor: pointer; font-size: 16px;" onclick="this.parentNode.parentNode.remove()">×</button>
      </div>
    `;
    document.body.appendChild(warning);
  }

  /**
   * Initialize WebGL renderer (static version)
   * @private
   */
  private static _initWebGL(): void {
    // Implementation will be added based on context
  }

  /**
   * Initialize quantum worker (static version)
   * @private
   */
  private static _initQuantumWorker(): void {
    // Implementation will be added based on context
  }

  /**
   * Compile a shader from source
   * @param gl - WebGL context
   * @param type - Shader type
   * @param source - Shader source code
   * @return - Compiled shader or null if failed
   */
  private static _compileShader(
    gl: WebGLRenderingContext,
    type: number,
    source: string
  ): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('HologramRenderer shader error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  /**
   * Link shaders into a program
   * @param gl - WebGL context
   * @param vs - Vertex shader
   * @param fs - Fragment shader
   * @return - Linked program or null if failed
   */
  private static _createProgram(
    gl: WebGLRenderingContext,
    vs: WebGLShader,
    fs: WebGLShader
  ): WebGLProgram | null {
    const prog = gl.createProgram();
    if (!prog) return null;

    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('HologramRenderer program error:', gl.getProgramInfoLog(prog));
      gl.deleteProgram(prog);
      return null;
    }

    return prog;
  }

  /**
   * Draw a single frame
   * @param instance - Renderer instance
   */
  private static _drawFrame(instance: RendererInstance): void {
    const { gl, uIntensityLoc, uColorLoc, intensity, color } = instance;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform1f(uIntensityLoc, intensity);
    gl.uniform3fv(uColorLoc, color);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  /**
   * Parse CSS hex color to [r,g,b]
   * @param hex - Hex color string
   * @return - Normalized RGB array
   */
  private static _parseColor(hex: string): number[] {
    let c = hex.replace('#', '');
    if (c.length === 3)
      c = c
        .split('')
        .map((ch) => ch + ch)
        .join('');
    const intVal = parseInt(c, 16);
    const r = (intVal >> 16) & 255;
    const g = (intVal >> 8) & 255;
    const b = intVal & 255;
    return [r / 255, g / 255, b / 255];
  }

  // ====================================================================================
  // INSTANCE API (object-based usage pattern)
  // ====================================================================================

  /**
   * Initialize the hologram renderer
   * @param canvas - Canvas element to render on
   * @param options - Rendering options
   */
  public initialize(
    canvas: HTMLCanvasElement,
    options: Partial<HologramOptions> = {}
  ): HologramRenderer {
    // Merge options
    this.options = {
      ...this.options,
      ...options,
    };

    this.canvas = canvas;
    this.traumaLevel = 0;
    this.intensityFactor = options.intensity || 1;

    // Initialize WebGL
    this.initWebGL();

    return this;
  }

  /**
   * Initialize WebGL context and scene
   */
  private initWebGL(): void {
    try {
      // Get WebGL context
      this.gl = this.canvas?.getContext('webgl') || null;

      if (!this.gl || !this.canvas) {
        console.error('WebGL not supported');
        return;
      }

      // Initialize 3D scene
      this.initScene();

      // Start rendering
      this.active = true;
      this.render();
    } catch (error) {
      console.error('Error initializing WebGL:', error);
    }
  }

  /**
   * Initialize 3D scene
   */
  private initScene(): void {
    if (!window.THREE) {
      console.error('THREE.js not available');
      return;
    }

    // Create scene
    this.scene = new window.THREE.Scene();

    // Create camera
    this.camera = new window.THREE.PerspectiveCamera(
      75,
      this.canvas!.width / this.canvas!.height,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 5);
    this.camera.lookAt(0, 0, 0);

    // Create lighting
    const ambientLight = new window.THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);

    const directionalLight = new window.THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);

    // Create renderer
    this.renderer = new window.THREE.WebGLRenderer({
      canvas: this.canvas!,
      alpha: true,
      antialias: true,
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(this.canvas!.width, this.canvas!.height);
  }

  /**
   * Load 3D model
   * @param url - Model URL
   * @param callback - Callback function when model is loaded
   */
  public loadModel(url: string, callback?: (model: any) => void): Promise<void> {
    if (!window.THREE || !this.scene) {
      return Promise.reject('THREE.js not available');
    }

    return new Promise((resolve, reject) => {
      const loader = new window.THREE.GLTFLoader();

      loader.load(
        url,
        (gltf) => {
          this.model = gltf.scene;
          this.scene.add(this.model);

          // Apply trauma-responsive scaling
          this.model.scale.set(1, 1, 1);
          this.model.position.set(0, 0, 0);

          if (callback) {
            callback(this.model);
          }

          resolve();
        },
        undefined,
        (error) => {
          console.error('Error loading model:', error);
          reject(error);
        }
      );
    });
  }

  /**
   * Apply quantum effects to the hologram
   * @param intensity - Effect intensity (0-1)
   */
  public applyQuantumEffects(intensity: number): void {
    if (!this.renderer || !this.scene || !this.camera) {
      return;
    }

    // Apply quantum effects if THREE.EffectComposer is available
    if (window.THREE && window.THREE.EffectComposer) {
      const composer = new window.THREE.EffectComposer(this.renderer);

      // Add render pass
      const renderPass = new window.THREE.RenderPass(this.scene, this.camera);
      composer.addPass(renderPass);

      // Add bloom effect
      const bloomPass = new window.THREE.UnrealBloomPass(
        new window.THREE.Vector2(this.canvas!.width, this.canvas!.height),
        intensity * 1.5,
        0.4,
        0.85
      );
      composer.addPass(bloomPass);

      // Add glitch effect if intensity is high enough
      if (intensity > 0.6) {
        const glitchPass = new window.THREE.GlitchPass();
        glitchPass.goWild = intensity > 0.8;
        composer.addPass(glitchPass);
      }

      // Replace standard renderer with effect composer
      this.renderer = composer;
    }
  }

  /**
   * Apply glitch effect
   * @param intensity - Glitch intensity (0-1)
   */
  public applyGlitchEffect(intensity: number): void {
    if (!this.renderer || !window.THREE || !window.THREE.GlitchPass) {
      return;
    }

    // Create effect composer if not already using one
    if (!this.renderer.passes) {
      const composer = new window.THREE.EffectComposer(this.renderer);
      const renderPass = new window.THREE.RenderPass(this.scene, this.camera);
      composer.addPass(renderPass);
      this.renderer = composer;
    }

    // Add glitch pass
    const glitchPass = new window.THREE.GlitchPass();
    glitchPass.goWild = intensity > 0.8;
    this.renderer.addPass(glitchPass);
  }

  /**
   * Apply trauma encoding to the hologram
   * @param traumaLevel - Trauma level (0-10)
   */
  public applyTraumaEncoding(traumaLevel: number): void {
    if (!this.options.traumaResponsive) {
      return;
    }

    this.traumaLevel = traumaLevel;

    // Apply trauma-responsive effects
    if (traumaLevel > 3) {
      // Medium trauma: apply quantum effects
      this.applyQuantumEffects(traumaLevel / 10);
    }

    if (traumaLevel > 6) {
      // High trauma: apply glitch effects
      this.applyGlitchEffect((traumaLevel - 6) / 4);
    }

    if (traumaLevel > 8) {
      // Extreme trauma: apply memory fragmentation
      this.options.memoryFragmentation = (traumaLevel - 8) / 2;
    }
  }

  /**
   * Render the hologram
   */
  private render(): void {
    if (!this.active || !this.renderer || !this.scene || !this.camera) {
      return;
    }

    // Apply memory fragmentation if enabled
    if (this.options.memoryFragmentation && this.options.memoryFragmentation > 0 && this.model) {
      // Create glitch effect by randomly moving vertices
      const fragmentationFactor = this.options.memoryFragmentation;

      if (
        this.model.geometry &&
        this.model.geometry.attributes &&
        this.model.geometry.attributes.position
      ) {
        const positions = this.model.geometry.attributes.position.array;

        for (let i = 0; i < positions.length; i += 3) {
          if (Math.random() < fragmentationFactor * 0.1) {
            positions[i] += (Math.random() - 0.5) * fragmentationFactor;
            positions[i + 1] += (Math.random() - 0.5) * fragmentationFactor;
            positions[i + 2] += (Math.random() - 0.5) * fragmentationFactor;
          }
        }

        this.model.geometry.attributes.position.needsUpdate = true;
      }
    }

    // Render the scene
    this.renderer.render(this.scene, this.camera);

    // Continue animation loop
    this.animationFrame = requestAnimationFrame(this.render.bind(this));
  }

  /**
   * Resize the renderer
   * @param width - New width
   * @param height - New height
   */
  public resize(width: number, height: number): void {
    if (!this.renderer || !this.camera || !this.canvas) {
      return;
    }

    // Update canvas size
    this.canvas.width = width;
    this.canvas.height = height;

    // Update camera aspect ratio
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    // Update renderer size
    this.renderer.setSize(width, height);
  }

  /**
   * Add a render target
   * @param element - Target element
   */
  public addTarget(element: HTMLElement): RenderTarget {
    const canvas = document.createElement('canvas');
    canvas.width = element.clientWidth || 300;
    canvas.height = element.clientHeight || 300;

    element.appendChild(canvas);

    const target: RenderTarget = {
      element,
      canvas,
    };

    this.targets.push(target);
    return target;
  }

  /**
   * Remove a render target
   * @param element - Target element
   */
  public removeTarget(element: HTMLElement): void {
    const targetIndex = this.targets.findIndex((target) => target.element === element);

    if (targetIndex >= 0) {
      const target = this.targets[targetIndex];

      if (target.canvas && target.element.contains(target.canvas)) {
        target.element.removeChild(target.canvas);
      }

      this.targets.splice(targetIndex, 1);
    }
  }

  /**
   * Dispose of the renderer and release resources
   */
  public dispose(): void {
    // Stop animation loop
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    // Dispose of renderer
    if (this.renderer && this.renderer.dispose) {
      this.renderer.dispose();
      this.renderer = null;
    }

    // Clear scene
    if (this.scene && this.scene.clear) {
      this.scene.clear();
      this.scene = null;
    }

    // Clear camera
    this.camera = null;

    // Clear model
    this.model = null;

    // Clear targets
    this.targets.forEach((target) => {
      if (target.canvas && target.element.contains(target.canvas)) {
        target.element.removeChild(target.canvas);
      }
    });
    this.targets = [];

    // Reset state
    this.active = false;
    this.canvas = null;
    this.gl = null;
  }
}

// Define THREE.js typings for TypeScript compatibility
declare global {
  interface Window {
    THREE?: any;
    HologramRenderer?: typeof HologramRenderer;
  }
}

// Export singleton instance for global access
export const hologramRenderer = new HologramRenderer();

// Ensure HologramRenderer is globally accessible
if (typeof window !== 'undefined') {
  window.HologramRenderer = HologramRenderer;
  console.log('HologramRenderer registered globally');
}

