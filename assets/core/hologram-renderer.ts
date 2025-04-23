/**
 * VoidBloom Hologram Renderer
 * Quantum-encoded visual system for trauma-responsive memory artifacts
 */

export interface HologramOptions {
  intensity?: number;
  traumaResponsive?: boolean;
  dimensions?: '2d' | '3d' | '4d';
  profile?: string;
  glitchFactor?: number;
  memoryFragmentation?: number;
}

export interface RenderTarget {
  element: HTMLElement;
  canvas?: HTMLCanvasElement;
  context?: WebGLRenderingContext | CanvasRenderingContext2D;
}

export class HologramRenderer {
  // Properties with proper TypeScript private fields
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
  
  constructor() {
    // Default options
    this.options = {
      intensity: 0.8,
      traumaResponsive: true,
      dimensions: '3d',
      profile: 'default',
      glitchFactor: 0.2,
      memoryFragmentation: 0
    };
  }
  
  /**
   * Initialize the hologram renderer
   * @param canvas - Canvas element to render on
   * @param options - Rendering options
   */
  public initialize(canvas: HTMLCanvasElement, options: Partial<HologramOptions> = {}): HologramRenderer {
    // Merge options
    this.options = {
      ...this.options,
      ...options
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
      antialias: true
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
    if (this.options.memoryFragmentation > 0 && this.model) {
      // Create glitch effect by randomly moving vertices
      const fragmentationFactor = this.options.memoryFragmentation;
      
      if (this.model.geometry) {
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
      canvas
    };
    
    this.targets.push(target);
    return target;
  }
  
  /**
   * Remove a render target
   * @param element - Target element
   */
  public removeTarget(element: HTMLElement): void {
    const targetIndex = this.targets.findIndex(target => target.element === element);
    
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
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
    
    // Clear scene
    if (this.scene) {
      this.scene.clear();
      this.scene = null;
    }
    
    // Clear camera
    this.camera = null;
    
    // Clear model
    this.model = null;
    
    // Clear targets
    this.targets.forEach(target => {
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

// Export singleton instance for global access
export const hologramRenderer = new HologramRenderer();
