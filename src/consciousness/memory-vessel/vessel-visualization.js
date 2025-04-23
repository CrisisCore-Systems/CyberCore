/**
 * VesselVisualization
 *
 * Visual representation of the memory vessel's state.
 * Renders memory fragments, decay patterns, and crystallization
 * in an immersive UI representation.
 *
 * @version 0.8.4
 * @phase alien-flora
 */
class VesselVisualization {
  constructor(customerVessel) {
    // Core elements
    this.vessel = customerVessel;
    this.containerElement = null;
    this.fragmentElements = new Map();

    // Visualization state
    this.activeFragments = [];
    this.crystallizedFragments = [];
    this.compressedArchives = [];

    // Animation state
    this.isAnimating = false;
    this.animationFrame = null;

    // Configuration
    this.config = {
      maxVisibleFragments: 50,
      renderCrystallized: true,
      renderCompressed: true,
      decayAnimation: true,
      traumaColoring: true,
      autoUpdate: true,
      updateInterval: 2000, // 2 seconds
    };

    // Neural integration
    this.neuralBusNonce = null;

    // Initialize visualization
    this._initialize();
  }

  /**
   * Initialize visualization
   * @private
   */
  _initialize() {
    // Create container element
    this._createContainer();

    // Connect to neural bus
    this._connectToNeuralBus();

    // Set up auto-update interval
    if (this.config.autoUpdate) {
      setInterval(() => {
        this.updateVisualization();
      }, this.config.updateInterval);
    }

    console.log('[VOID://VISUAL] Vessel visualization initialized.');
  }

  /**
   * Create container element
   * @private
   */
  _createContainer() {
    // Check if container already exists
    if (document.getElementById('voidbloom-vessel-visualization')) {
      this.containerElement = document.getElementById('voidbloom-vessel-visualization');
      return;
    }

    // Create container
    this.containerElement = document.createElement('div');
    this.containerElement.id = 'voidbloom-vessel-visualization';
    this.containerElement.className = 'vessel-visualization';

    // Create fragments container
    const fragmentsContainer = document.createElement('div');
    fragmentsContainer.className = 'fragments-container';
    this.containerElement.appendChild(fragmentsContainer);

    // Create crystallized container
    const crystallizedContainer = document.createElement('div');
    crystallizedContainer.className = 'crystallized-container';
    this.containerElement.appendChild(crystallizedContainer);

    // Create compressed container
    const compressedContainer = document.createElement('div');
    compressedContainer.className = 'compressed-container';
    this.containerElement.appendChild(compressedContainer);

    // Create metrics display
    const metricsDisplay = document.createElement('div');
    metricsDisplay.className = 'metrics-display';
    this.containerElement.appendChild(metricsDisplay);

    // Create styles
    this._createStyles();

    // Add to document
    document.body.appendChild(this.containerElement);
  }

  /**
   * Create styles for visualization
   * @private
   */
  _createStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .vessel-visualization {
        position: fixed;
        top: 0;
        right: 0;
        width: 300px;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        overflow-y: auto;
        z-index: 1000;
      }
      .fragments-container, .crystallized-container, .compressed-container {
        margin: 10px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.1);
      }
      .metrics-display {
        margin: 10px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.1);
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Connect to neural bus
   * @private
   */
  _connectToNeuralBus() {
    // Simulate neural bus connection
    this.neuralBusNonce = Math.random().toString(36).substring(2);
    console.log(`[VOID://NEURAL] Connected to neural bus with nonce: ${this.neuralBusNonce}`);
  }

  /**
   * Update fragment visualization
   */
  updateVisualization() {
    // Skip if vessel or container not available
    if (!this.vessel || !this.containerElement) return;

    // Get current fragments
    const fragments = this.vessel.getAllFragments();

    // Update fragment arrays
    this.activeFragments = fragments.active || [];
    this.crystallizedFragments = fragments.crystallized || [];
    this.compressedArchives = fragments.compressed || [];

    // Update metrics
    const metrics = this.vessel.getStabilityMetrics();
    this._updateMetricsDisplay(metrics);

    // Update active fragments
    this._updateActiveFragments();

    // Update crystallized fragments
    if (this.config.renderCrystallized) {
      this._updateCrystallizedFragments();
    }

    // Update compressed archives
    if (this.config.renderCompressed) {
      this._updateCompressedArchives();
    }
  }

  /**
   * Update metrics display
   * @private
   * @param {Object} metrics
   */
  _updateMetricsDisplay(metrics) {
    const metricsDisplay = this.containerElement.querySelector('.metrics-display');
    metricsDisplay.innerHTML = `
      <p>Stability: ${metrics.stability}</p>
      <p>Fragment Count: ${metrics.fragmentCount}</p>
      <p>Crystallized Count: ${metrics.crystallizedCount}</p>
      <p>Compressed Count: ${metrics.compressedCount}</p>
    `;
  }

  /**
   * Update active fragments
   * @private
   */
  _updateActiveFragments() {
    const fragmentsContainer = this.containerElement.querySelector('.fragments-container');
    fragmentsContainer.innerHTML = '';
    this.activeFragments.forEach((fragment) => {
      const fragmentElement = document.createElement('div');
      fragmentElement.className = 'fragment';
      fragmentElement.textContent = fragment.id;
      fragmentsContainer.appendChild(fragmentElement);
    });
  }

  /**
   * Update crystallized fragments
   * @private
   */
  _updateCrystallizedFragments() {
    const crystallizedContainer = this.containerElement.querySelector('.crystallized-container');
    crystallizedContainer.innerHTML = '';
    this.crystallizedFragments.forEach((fragment) => {
      const fragmentElement = document.createElement('div');
      fragmentElement.className = 'crystallized-fragment';
      fragmentElement.textContent = fragment.id;
      crystallizedContainer.appendChild(fragmentElement);
    });
  }

  /**
   * Update compressed archives
   * @private
   */
  _updateCompressedArchives() {
    const compressedContainer = this.containerElement.querySelector('.compressed-container');
    compressedContainer.innerHTML = '';
    this.compressedArchives.forEach((archive) => {
      const archiveElement = document.createElement('div');
      archiveElement.className = 'compressed-archive';
      archiveElement.textContent = archive.id;
      compressedContainer.appendChild(archiveElement);
    });
  }
}

export default VesselVisualization;
