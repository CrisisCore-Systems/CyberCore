// ar-bridge.js
// ARBridge: Simplified wrapper for WebXR-based AR sessions and model anchoring

/**
 * ARBridge
 * Provides utilities to initialize a WebXR AR session, load 3D models, and anchor them in the real world.
 */
export class ARBridge {
  // Indicates whether AR is supported
  static isSupported = false;
  // Active XRSession
  static _session = null;
  // Reference to XRRenderer (e.g., three.js renderer) if used
  static _renderer = null;

  /**
   * Checks for WebXR AR support and sets isSupported flag
   * @returns {Promise<boolean>}
   */
  static async checkSupport() {
    if (navigator.xr && navigator.xr.isSessionSupported) {
      try {
        ARBridge.isSupported = await navigator.xr.isSessionSupported('immersive-ar');
      } catch (err) {
        console.warn('ARBridge: support check failed', err);
        ARBridge.isSupported = false;
      }
    }
    return ARBridge.isSupported;
  }

  /**
   * Start an AR session and attach a rendering loop
   * @param {Object} options
   * @param {HTMLElement} options.domElement - DOM element to attach AR canvas
   * @param {Function} options.onFrame - Callback invoked each frame with WebXRFrame and reference space
   */
  static async startSession({ domElement, onFrame }) {
    if (!await ARBridge.checkSupport()) {
      console.error('ARBridge: WebXR immersive-ar not supported');
      return null;
    }

    try {
      const session = await navigator.xr.requestSession('immersive-ar', { requiredFeatures: ['local-floor'] });
      ARBridge._session = session;

      // Create WebGL canvas if not present
      const canvas = document.createElement('canvas');
      domElement.appendChild(canvas);
      const gl = canvas.getContext('webgl', { xrCompatible: true });

      // Initialize XRWebGLLayer
      await gl.makeXRCompatible();
      session.updateRenderState({ baseLayer: new XRWebGLLayer(session, gl) });

      // Reference space
      const refSpace = await session.requestReferenceSpace('local-floor');

      // Animation loop
      const onXRFrame = (time, frame) => {
        session.requestAnimationFrame(onXRFrame);
        const pose = frame.getViewerPose(refSpace);
        if (pose) {
          onFrame(frame, pose);
        }
      };
      session.requestAnimationFrame(onXRFrame);

      return session;
    } catch (err) {
      console.error('ARBridge: failed to start AR session', err);
      return null;
    }
  }

  /**
   * Ends the active AR session
   */
  static async endSession() {
    if (ARBridge._session) {
      await ARBridge._session.end();
      ARBridge._session = null;
    }
  }
}

// Expose on window for global access
window.ARBridge = ARBridge;