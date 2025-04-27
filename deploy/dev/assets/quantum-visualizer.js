// quantum-visualizer.js
// Provides QuantumVisualizer for rendering dynamic quantum grid and noise effects

/**
 * QuantumVisualizer
 * Manages a Canvas2D-based visualization overlay (grid scan, noise, particles) on a target container.
 */
(function (window) {
  'use strict';

  // QuantumVisualizer constructor
  function QuantumVisualizer() {
    // This is a static class with no instances
  }

  // Store instances keyed by container
  QuantumVisualizer._instances = new WeakMap();

  /**
   * Initialize the quantum visualizer on a container element.
   * @param {HTMLElement} container - The DOM element to overlay the canvas on
   * @param {Object} options - Config options
   * @param {string} options.backgroundColor - CSS color for background overlay
   * @param {string} options.gridColor - CSS color for grid lines
   * @param {boolean} options.showNoise - Whether to overlay noise static
   */
  QuantumVisualizer.init = function (container, options = {}) {
    if (!container || QuantumVisualizer._instances.has(container)) return;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = options.zIndex || '9000';
    container.appendChild(canvas);

    // Use willReadFrequently hint for performance optimization when getting image data
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const state = { container, canvas, ctx, options };
    QuantumVisualizer._instances.set(container, state);

    // Resize to match
    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    state._resizeHandler = resize;

    // Start animation
    const animate = () => {
      QuantumVisualizer._drawFrame(state);
      state._raf = requestAnimationFrame(animate);
    };
    animate();
  };

  /**
   * Destroy the visualizer instance on a container.
   * @param {HTMLElement} container
   */
  QuantumVisualizer.destroy = function (container) {
    const state = QuantumVisualizer._instances.get(container);
    if (!state) return;
    cancelAnimationFrame(state._raf);
    window.removeEventListener('resize', state._resizeHandler);
    state.container.removeChild(state.canvas);
    QuantumVisualizer._instances.delete(container);
  };

  // Internal: draw a single frame
  QuantumVisualizer._drawFrame = function (state) {
    const { ctx, canvas, options } = state;
    const w = canvas.width;
    const h = canvas.height;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Background tint
    if (options.backgroundColor) {
      ctx.fillStyle = options.backgroundColor;
      ctx.fillRect(0, 0, w, h);
    }

    // Grid scanning effect
    const gridSize = options.gridSize || 50;
    ctx.strokeStyle = options.gridColor || 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= w; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = 0; y <= h; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();

    // Noise overlay
    if (options.showNoise) {
      // Reduce the size of the area we process to improve performance
      const downsampleFactor = 2; // Process 1/4 of the pixels
      const processWidth = Math.max(1, Math.floor(w / downsampleFactor));
      const processHeight = Math.max(1, Math.floor(h / downsampleFactor));

      // Only read a smaller portion of the canvas to prevent GPU stalls
      const imageData = ctx.getImageData(0, 0, processWidth, processHeight);
      const data = imageData.data;

      // Apply noise effect to the data
      for (let i = 0; i < data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        data[i] = data[i] ^ v;
        data[i + 1] = data[i + 1] ^ v;
        data[i + 2] = data[i + 2] ^ v;
      }

      // Put the modified data back
      ctx.putImageData(imageData, 0, 0);

      // Scale the modified area to fill the canvas
      // This avoids having to read/modify every pixel
      if (w > processWidth || h > processHeight) {
        ctx.globalAlpha = 0.7; // Reduce intensity of the stretched noise
        ctx.drawImage(canvas, 0, 0, processWidth, processHeight, 0, 0, w, h);
        ctx.globalAlpha = 1.0;
      }
    }
  };

  // Expose globally
  window.QuantumVisualizer = QuantumVisualizer;
})(typeof window !== 'undefined' ? window : this);
