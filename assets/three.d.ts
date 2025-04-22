/**
 * Three.js type definitions for CyberCore
 * This file provides type declarations for Three.js used in the project
 */

declare namespace THREE {
  /**
   *
   */
  class WebGLRenderer {
    /**
     *
     */
    constructor(options?: any);
    /**
     *
     */
    setSize(width: number, height: number): void;
    /**
     *
     */
    setPixelRatio(ratio: number): void;
    /**
     *
     */
    render(scene: Scene, camera: Camera): void;
    /**
     *
     */
    dispose(): void;
    domElement: HTMLCanvasElement;
    outputEncoding: any;
    toneMapping: any;
    shadowMap: {
      enabled: boolean;
      type: any;
    };
  }

  /**
   *
   */
  class Scene {
    /**
     *
     */
    add(object: Object3D): void;
    /**
     *
     */
    remove(object: Object3D): void;
    /**
     *
     */
    traverse(callback: (object: any) => void): void;
  }

  /**
   *
   */
  class PerspectiveCamera {
    /**
     *
     */
    constructor(fov: number, aspect: number, near: number, far: number);
    position: Vector3;
    /**
     *
     */
    lookAt(target: Vector3 | Vector3Tuple): void;
    aspect: number;
    /**
     *
     */
    updateProjectionMatrix(): void;
  }

  /**
   *
   */
  class Camera {
    position: Vector3;
    /**
     *
     */
    lookAt(target: Vector3 | Vector3Tuple): void;
  }

  /**
   *
   */
  class Vector3 {
    /**
     *
     */
    constructor(x?: number, y?: number, z?: number);
    /**
     *
     */
    set(x: number, y: number, z: number): Vector3;
    x: number;
    y: number;
    z: number;
  }

  type Vector3Tuple = [number, number, number];

  /**
   *
   */
  class Color {
    /**
     *
     */
    constructor(color: string | number);
    /**
     *
     */
    set(color: string | number): Color;
  }

  /**
   *
   */
  class AmbientLight {
    /**
     *
     */
    constructor(color?: string | number, intensity?: number);
  }

  /**
   *
   */
  class DirectionalLight {
    /**
     *
     */
    constructor(color?: string | number, intensity?: number);
    position: Vector3;
  }

  /**
   *
   */
  class PointLight {
    /**
     *
     */
    constructor(color?: string | number, intensity?: number, distance?: number, decay?: number);
    position: Vector3;
  }

  /**
   *
   */
  class Group extends Object3D {
    rotation: {
      x: number;
      y: number;
      z: number;
    };
  }

  /**
   *
   */
  class Object3D {
    position: Vector3;
    rotation: {
      x: number;
      y: number;
      z: number;
    };
    scale: Vector3;
    visible: boolean;
    /**
     *
     */
    add(object: Object3D): this;
    /**
     *
     */
    remove(object: Object3D): this;
    /**
     *
     */
    traverse(callback: (object: any) => void): void;
    geometry?: BufferGeometry;
    material?: Material | Material[];
  }

  /**
   *
   */
  class BufferGeometry {
    /**
     *
     */
    dispose(): void;
  }

  /**
   *
   */
  class Material {
    /**
     *
     */
    dispose(): void;
    map?: any;
    uniforms?: {
      [key: string]: {
        value: any;
      };
    };
  }

  /**
   *
   */
  class Clock {
    /**
     *
     */
    constructor();
    /**
     *
     */
    getDelta(): number;
    /**
     *
     */
    getElapsedTime(): number;
  }

  // Post-processing classes
  /**
   *
   */
  class EffectComposer {
    /**
     *
     */
    constructor(renderer: WebGLRenderer);
    /**
     *
     */
    addPass(pass: Pass): void;
    /**
     *
     */
    render(delta?: number): void;
    /**
     *
     */
    dispose(): void;
  }

  /**
   *
   */
  class Pass {
    enabled: boolean;
    renderToScreen: boolean;
  }

  /**
   *
   */
  class ShaderPass extends Pass {
    /**
     *
     */
    constructor(shader: any);
    uniforms: {
      [key: string]: {
        value: any;
      };
    };
  }

  /**
   *
   */
  class RenderPass extends Pass {
    /**
     *
     */
    constructor(scene: Scene, camera: Camera);
  }

  // Trauma-specific effects
  /**
   *
   */
  class GlitchPass extends Pass {
    uniforms: {
      amount: {
        value: number;
      };
      [key: string]: {
        value: any;
      };
    };
  }

  /**
   *
   */
  class UnrealBloomPass extends Pass {
    /**
     *
     */
    constructor(resolution: Vector2, strength: number, radius: number, threshold: number);
    strength: number;
    radius: number;
    threshold: number;
  }

  /**
   *
   */
  class Vector2 {
    /**
     *
     */
    constructor(x?: number, y?: number);
    x: number;
    y: number;
  }

  // Constants
  const sRGBEncoding: any;
  const ACESFilmicToneMapping: any;
}

// Three.js module augmentation
declare module 'three' {
  export = THREE;
}

// Global augmentations
interface Window {
  quantumWebGL?: any;
}
