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
   * @param {boolean} options.failIfMajorPerformanceCaveat - Whether to fail if there is a major performance issue
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

    // Create program
    const program = HologramRenderer._createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    // Set up a square covering entire canvas
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
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
   * Create an optimized WebGL context with feature detection
   * @param {HTMLCanvasElement} canvas - The canvas element
   * @param {boolean} failIfMajorPerformanceCaveat - Whether to fail if there's a performance issue
   * @return {WebGLRenderingContext|null} - WebGL context or null if not supported
   */
  static _createWebGLContext(canvas, failIfMajorPerformanceCaveat = false) {
    const contextAttributes = {
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: failIfMajorPerformanceCaveat,
    };

    try {
      // Try WebGL2 first for better performance
      let gl = canvas.getContext('webgl2', contextAttributes);
      if (gl) {
        console.log('Using WebGL2 context');
        return gl;
      }

      // Fall back to WebGL1
      gl = canvas.getContext('webgl', contextAttributes);
      if (gl) {
        console.log('Using WebGL1 context');
        return gl;
      }

      // Last resort: experimental-webgl
      gl = canvas.getContext('experimental-webgl', contextAttributes);
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
   * @param {WebGLRenderingContext} gl - WebGL context
   * @return {boolean} - True if hardware acceleration is available
   */
  static _checkHardwareAcceleration(gl) {
    try {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        console.log(`WebGL using: ${vendor} - ${renderer}`);

        // Check for software renderers
        if (/(swiftshader|software|llvmpipe)/i.test(renderer)) {
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
  static _showHardwareAccelerationWarning() {
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
}

// Ensure HologramRenderer is globally accessible
if (typeof window !== 'undefined') {
  window.HologramRenderer = HologramRenderer;
  console.log('HologramRenderer registered globally');
}
