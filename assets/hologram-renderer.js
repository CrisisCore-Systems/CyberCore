// hologram-renderer.js
// Provides HologramRenderer for creating 3D holographic effects in the HologramComponent

/**
 * HologramRenderer
 * Manages a WebGL-based holographic rendering context inside a given container.
 */
export class HologramRenderer {
  // Store references to renderer instances by container
  static _instances = new WeakMap();

  /**
   * Initialize the hologram renderer on a container element.
   * @param {HTMLElement} container - The DOM element to attach the renderer to
   * @param {Object} options - Configuration options
   * @param {number} options.intensity - Hologram brightness/intensity (0.0 - 1.0)
   * @param {string} options.color - CSS color string for the hologram overlay
   */
  static init(container, options = {}) {
    if (!container) return;
    // Avoid double-init
    if (HologramRenderer._instances.has(container)) return;

    // Create a canvas for WebGL
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    // Obtain WebGL context
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.error('HologramRenderer: WebGL not supported');
      return;
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
    const fragmentShader = HologramRenderer._compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // Create program
    const program = HologramRenderer._createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    // Set up a square covering entire canvas
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1,  1, -1,  -1, 1,  1, 1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uIntensityLoc = gl.getUniformLocation(program, 'u_intensity');
    const uColorLoc = gl.getUniformLocation(program, 'u_color');

    // Parse options
    const intensity = options.intensity ?? 0.5;
    const color = HologramRenderer._parseColor(options.color || '#00ffcc');

    // Store instance state
    const instance = { container, canvas, gl, program, uIntensityLoc, uColorLoc, color, intensity };
    HologramRenderer._instances.set(container, instance);

    // Start render loop
    const renderLoop = () => {
      HologramRenderer._drawFrame(instance);
      instance._raf = requestAnimationFrame(renderLoop);
    };
    renderLoop();
  }

  /**
   * Destroy the hologram renderer on a container.
   * @param {HTMLElement} container
   */
  static destroy(container) {
    const instance = HologramRenderer._instances.get(container);
    if (!instance) return;

    cancelAnimationFrame(instance._raf);
    instance.gl.deleteProgram(instance.program);
    instance.container.removeChild(instance.canvas);
    HologramRenderer._instances.delete(container);
  }

  // Internal: compile a shader from source
  static _compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('HologramRenderer shader error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  // Internal: link shaders into a program
  static _createProgram(gl, vs, fs) {
    const prog = gl.createProgram();
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

  // Internal: draw a single frame
  static _drawFrame(instance) {
    const { gl, uIntensityLoc, uColorLoc, intensity, color } = instance;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform1f(uIntensityLoc, intensity);
    gl.uniform3fv(uColorLoc, color);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  // Internal: parse CSS hex color to [r,g,b]
  static _parseColor(hex) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(ch => ch + ch).join('');
    const intVal = parseInt(c, 16);
    const r = (intVal >> 16) & 255;
    const g = (intVal >> 8) & 255;
    const b = intVal & 255;
    return [r / 255, g / 255, b / 255];
  }
}

// Expose globally for HologramComponent to use
window.HologramRenderer = HologramRenderer;