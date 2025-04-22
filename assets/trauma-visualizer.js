// @ts-nocheck
/**
 * Trauma Visualization System
 *
 * Renders interactive visualizations of trauma patterns, coherence metrics,
 * and quantum states using WebGL and Three.js
 */
class TraumaVisualizer {
  constructor(container, options = {}) {
    // Configuration options with defaults
    this.config = {
      width: 800,
      height: 600,
      backgroundColor: 0x0a0a1a,
      autoRotate: true,
      showLabels: true,
      showAxes: false,
      showStats: false,
      enableInteraction: true,
      traumaColors: {
        abandonment: 0x3b82f6, // blue
        fragmentation: 0xef4444, // red
        surveillance: 0x10b981, // green
        recursion: 0xf59e0b, // amber
        displacement: 0x8b5cf6, // purple
        dissolution: 0xec4899, // pink
      },
      glowIntensity: 1.0,
      animationSpeed: 1.0,
      ...options,
    };

    // DOM container for the visualization
    this.container = typeof container === 'string' ? document.getElementById(container) : container;

    if (!this.container) {
      throw new Error('TraumaVisualizer: Container element not found');
    }

    // Data states
    this.traumaData = [];
    this.coherenceData = null;
    this.visualizationMode = 'catalog'; // catalog, product, customer, journey

    // Three.js objects
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.traumaMeshes = new Map();
    this.labelRenderer = null;
    this.labels = [];
    this.raycaster = null;
    this.mouse = null;
    this.clock = null;
    this.animationFrame = null;
    this.stats = null;

    // Interaction state
    this.hoveredMesh = null;
    this.selectedMesh = null;
    this.isAnimating = false;

    // Initialize the visualization
    this.initialize();
  }

  /**
   * Initialize the visualization system
   */
  initialize() {
    // Import Three.js dynamically if needed
    this.ensureThreeJsLoaded()
      .then(() => {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLighting();
        this.setupControls();
        this.setupInteraction();

        if (this.config.showStats) {
          this.setupStats();
        }

        // Start animation loop
        this.animate();

        // Handle window resize
        window.addEventListener('resize', this.handleResize.bind(this));

        // Fire initialized event
        this.container.dispatchEvent(new CustomEvent('traumavis:initialized'));
      })
      .catch((error) => {
        console.error('TraumaVisualizer: Error initializing:', error);

        // Show error message in container
        this.container.innerHTML = `
          <div style="color: red; padding: 20px; text-align: center;">
            <h3>Visualization Error</h3>
            <p>${error.message}</p>
          </div>
        `;
      });
  }

  /**
   * Ensure Three.js is loaded
   * @returns {Promise} - Resolves when Three.js is available
   */
  ensureThreeJsLoaded() {
    // If Three.js is already available, return resolved promise
    if (window.THREE) {
      return Promise.resolve();
    }

    // Otherwise, try to import it
    return new Promise((resolve, reject) => {
      // Check if we have access to dynamic imports
      if (typeof window.dynamicImport === 'function') {
        // Try to dynamically import Three.js
        window
          .dynamicImport('three')
          .then((THREE) => {
            window.THREE = THREE;

            // Also import OrbitControls
            window
              .dynamicImport('three/examples/jsm/controls/OrbitControls')
              .then((OrbitControlsModule) => {
                window.THREE.OrbitControls = OrbitControlsModule.OrbitControls;
                resolve();
              })
              .catch(reject);
          })
          .catch(reject);
      } else {
        // If dynamic import is not available, reject
        reject(new Error('Three.js is not available and cannot be imported'));
      }
    });
  }

  /**
   * Set up the Three.js scene
   */
  setupScene() {
    const THREE = window.THREE;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.config.backgroundColor);

    // Add fog for depth
    this.scene.fog = new THREE.FogExp2(this.config.backgroundColor, 0.035);

    // Add axes helper if enabled
    if (this.config.showAxes) {
      const axesHelper = new THREE.AxesHelper(10);
      this.scene.add(axesHelper);
    }

    // Add a center marker
    const centerGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const centerMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const centerMarker = new THREE.Mesh(centerGeometry, centerMaterial);
    centerMarker.visible = this.config.showAxes; // Only show with axes
    this.scene.add(centerMarker);
  }

  /**
   * Set up the camera
   */
  setupCamera() {
    const THREE = window.THREE;

    const { width, height } = this.getDimensions();
    const aspectRatio = width / height;

    // Create perspective camera
    this.camera = new THREE.PerspectiveCamera(60, aspectRatio, 0.1, 1000);
    this.camera.position.set(5, 5, 10);
    this.camera.lookAt(0, 0, 0);
  }

  /**
   * Set up the renderer
   */
  setupRenderer() {
    const THREE = window.THREE;

    const { width, height } = this.getDimensions();

    // Create WebGL renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Enable shadow mapping
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Clear the container and add the renderer canvas
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // CSS2D renderer for labels if needed
    if (this.config.showLabels && window.THREE.CSS2DRenderer) {
      this.labelRenderer = new THREE.CSS2DRenderer();
      this.labelRenderer.setSize(width, height);
      this.labelRenderer.domElement.style.position = 'absolute';
      this.labelRenderer.domElement.style.top = '0';
      this.labelRenderer.domElement.style.pointerEvents = 'none';
      this.container.appendChild(this.labelRenderer.domElement);
    }
  }

  /**
   * Set up lighting
   */
  setupLighting() {
    const THREE = window.THREE;

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);

    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;

    // Configure shadow properties
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.bias = -0.0005;

    this.scene.add(directionalLight);

    // Point lights for each trauma type
    Object.entries(this.config.traumaColors).forEach(([type, color], index) => {
      const angle = (index / Object.keys(this.config.traumaColors).length) * Math.PI * 2;
      const radius = 8;

      const light = new THREE.PointLight(color, 1, 15);
      light.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * 2, // Vary the height
        Math.sin(angle) * radius
      );

      this.scene.add(light);
    });
  }

  /**
   * Set up camera controls
   */
  setupControls() {
    // Skip if Three.js OrbitControls not available
    if (!window.THREE || !window.THREE.OrbitControls) return;

    this.controls = new window.THREE.OrbitControls(this.camera, this.renderer.domElement);

    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 20;
    this.controls.maxPolarAngle = Math.PI / 1.5;
    this.controls.autoRotate = this.config.autoRotate;
    this.controls.autoRotateSpeed = 0.5;
  }

  /**
   * Set up mouse and touch interaction
   */
  setupInteraction() {
    const THREE = window.THREE;

    // Skip if interaction is disabled
    if (!this.config.enableInteraction) return;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Add event listeners
    const canvas = this.renderer.domElement;

    canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    canvas.addEventListener('click', this.onMouseClick.bind(this));
    canvas.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: true });
  }

  /**
   * Set up performance stats
   */
  setupStats() {
    // Only if Stats is available
    if (typeof Stats === 'function') {
      this.stats = new Stats();
      this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
      this.stats.dom.style.position = 'absolute';
      this.stats.dom.style.top = '0';
      this.stats.dom.style.left = '0';
      this.container.appendChild(this.stats.dom);
    } else {
      console.warn('TraumaVisualizer: Stats library not available');
    }
  }

  /**
   * Animation loop
   */
  animate() {
    this.isAnimating = true;

    // Start stats if enabled
    if (this.stats) this.stats.begin();

    // Update controls if available
    if (this.controls) this.controls.update();

    // Update all animations and effects
    this.updateAnimations();

    // Render the scene
    this.renderer.render(this.scene, this.camera);

    // Render labels if available
    if (this.labelRenderer) {
      this.labelRenderer.render(this.scene, this.camera);
    }

    // End stats if enabled
    if (this.stats) this.stats.end();

    // Continue animation loop
    this.animationFrame = requestAnimationFrame(this.animate.bind(this));
  }

  /**
   * Update animations and effects
   */
  updateAnimations() {
    // Get clock delta time if available
    const delta = this.clock ? this.clock.getDelta() : 0.016;

    // Update trauma node animations
    this.traumaMeshes.forEach((meshData, id) => {
      const { mesh, type, intensity, data } = meshData;

      // Pulse effect based on trauma type
      const time = Date.now() * 0.001 * this.config.animationSpeed;
      const pulseFactor = (Math.sin(time * (1 + intensity * 0.5)) * 0.1 + 1) * intensity;

      // Apply different effects based on trauma type
      switch (type) {
        case 'abandonment':
          // Slow drift away from center
          mesh.position.x += Math.sin(time * 0.2) * 0.002 * intensity;
          mesh.position.z += Math.cos(time * 0.3) * 0.002 * intensity;
          break;

        case 'fragmentation':
          // Erratic rotation
          mesh.rotation.x += Math.sin(time * 2) * 0.01 * intensity;
          mesh.rotation.z += Math.cos(time * 3) * 0.01 * intensity;
          break;

        case 'surveillance':
          // Consistent rotation
          mesh.rotation.y += 0.01 * intensity;
          break;

        case 'recursion':
          // Pulsing scale
          mesh.scale.setScalar(1 + Math.sin(time * 3) * 0.1 * intensity);
          break;

        case 'displacement':
          // Oscillate position
          mesh.position.y = data.baseY + Math.sin(time * 1.5) * 0.2 * intensity;
          break;

        case 'dissolution':
          // Opacity fluctuation if material supports it
          if (mesh.material.opacity !== undefined) {
            mesh.material.opacity = 0.7 + Math.sin(time * 2) * 0.3 * intensity;
          }
          break;
      }

      // Apply glow effect if mesh has a glow material
      if (mesh.userData.glowMesh) {
        const glowIntensity = 0.5 + Math.sin(time * 2) * 0.2;
        mesh.userData.glowMesh.material.opacity =
          glowIntensity * this.config.glowIntensity * intensity;
      }

      // Update label position if present
      if (mesh.userData.label) {
        mesh.userData.label.position.copy(mesh.position);
        mesh.userData.label.position.y += 0.5; // Position above the mesh
      }
    });

    // Update coherence visualizations if present
    if (this.coherenceMesh) {
      const time = Date.now() * 0.0005;

      // Rotate slowly based on coherence score
      const rotationSpeed = 0.1 + (1 - (this.coherenceData?.score || 0.5)) * 0.2;
      this.coherenceMesh.rotation.y += rotationSpeed * delta;

      // Pulse based on coherence stability
      const pulseFrequency = (this.coherenceData?.stability || 0.5) * 2;
      const pulseAmplitude = (1 - (this.coherenceData?.stability || 0.5)) * 0.1;
      const pulseFactor = 1 + Math.sin(time * pulseFrequency) * pulseAmplitude;

      this.coherenceMesh.scale.setScalar(pulseFactor);
    }
  }

  /**
   * Load trauma data and visualize it
   * @param {Array} data - Trauma data to visualize
   * @param {Object} options - Visualization options
   */
  visualizeTraumaData(data, options = {}) {
    this.clearVisualization();

    this.traumaData = data;
    this.visualizationMode = options.mode || 'catalog';

    // Create clock for animations
    if (!this.clock) {
      this.clock = new window.THREE.Clock();
    }

    // Create visualizations based on mode
    switch (this.visualizationMode) {
      case 'catalog':
        this.visualizeCatalogTrauma();
        break;
      case 'product':
        this.visualizeProductTrauma();
        break;
      case 'customer':
        this.visualizeCustomerTrauma();
        break;
      case 'journey':
        this.visualizeTraumaJourney();
        break;
      default:
        this.visualizeCatalogTrauma();
    }

    // Fire data loaded event
    this.container.dispatchEvent(
      new CustomEvent('traumavis:dataLoaded', {
        detail: { count: data.length, mode: this.visualizationMode },
      })
    );
  }

  /**
   * Visualize catalog-wide trauma patterns
   */
  visualizeCatalogTrauma() {
    const THREE = window.THREE;

    if (!this.traumaData || !this.traumaData.length) return;

    // Calculate catalog statistics
    const stats = this.calculateTraumaStats(this.traumaData);
    const traumaTypes = Object.keys(this.config.traumaColors);

    // Create a cluster visualization for each trauma type
    traumaTypes.forEach((type, index) => {
      // Get items with this trauma type
      const items = this.traumaData.filter(
        (item) => item.primary_type === type || item.secondary_type === type
      );

      if (!items.length) return;

      // Calculate angle for positioning the cluster
      const angle = (index / traumaTypes.length) * Math.PI * 2;
      const baseDistance = 5;
      const baseX = Math.cos(angle) * baseDistance;
      const baseZ = Math.sin(angle) * baseDistance;

      // Create nodes for each item
      items.forEach((item, itemIndex) => {
        const isPrimary = item.primary_type === type;
        const intensity = item.intensity || (isPrimary ? 0.8 : 0.4);
        const nodeDistance = 0.5 + Math.random() * 2;

        // Calculate position with some randomness
        const x = baseX + (Math.random() - 0.5) * nodeDistance;
        const y = (Math.random() - 0.5) * nodeDistance;
        const z = baseZ + (Math.random() - 0.5) * nodeDistance;

        // Create visualization node
        this.createTraumaNode({
          id: item.id || `${type}-${itemIndex}`,
          type: type,
          intensity: intensity,
          isPrimary: isPrimary,
          position: { x, y, z },
          data: item,
        });
      });
    });

    // Create coherence visualization
    if (stats.averageCoherence !== undefined) {
      this.visualizeCoherence({
        score: stats.averageCoherence,
        stability: stats.coherenceStability || 0.5,
        dominantTrauma: stats.dominantTrauma,
      });
    }
  }

  /**
   * Visualize a single product's trauma encoding
   */
  visualizeProductTrauma() {
    const THREE = window.THREE;

    if (!this.traumaData || !this.traumaData.length) {
      // If array is empty, try treating traumaData as a single product
      if (this.traumaData && this.traumaData.primary_type) {
        this.traumaData = [this.traumaData];
      } else {
        return;
      }
    }

    // Get the product (first item in the array)
    const product = this.traumaData[0];

    // Create primary trauma node
    if (product.primary_type) {
      this.createTraumaNode({
        id: `${product.id || 'product'}-primary`,
        type: product.primary_type,
        intensity: product.intensity || 0.8,
        isPrimary: true,
        position: { x: 0, y: 0, z: 0 },
        size: 1.5,
        data: product,
      });
    }

    // Create secondary trauma node if present
    if (product.secondary_type) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 2;

      this.createTraumaNode({
        id: `${product.id || 'product'}-secondary`,
        type: product.secondary_type,
        intensity: (product.intensity || 0.8) * 0.7,
        isPrimary: false,
        position: {
          x: Math.cos(angle) * distance,
          y: 0,
          z: Math.sin(angle) * distance,
        },
        size: 1.0,
        data: product,
      });
    }

    // Create attribute nodes
    if (product.attributes) {
      Object.entries(product.attributes).forEach(([attribute, value], index) => {
        if (value < 0.1) return; // Skip very low values

        const angle = (index / Object.keys(product.attributes).length) * Math.PI * 2;
        const distance = 3;

        this.createAttributeNode({
          id: `${product.id || 'product'}-attr-${attribute}`,
          attribute: attribute,
          value: value,
          position: {
            x: Math.cos(angle) * distance,
            y: 0,
            z: Math.sin(angle) * distance,
          },
          data: product,
        });
      });
    }

    // Create connection lines between nodes
    this.createConnectionLines();
  }

  /**
   * Visualize a customer's trauma affinity profile
   */
  visualizeCustomerTrauma() {
    // Similar implementation to catalog and product visualizations
    // with specific layouts for customer trauma affinity
    console.log('Customer trauma visualization not implemented yet');
  }

  /**
   * Visualize a trauma journey over time
   */
  visualizeTraumaJourney() {
    // Timeline-based visualization of trauma evolution
    console.log('Trauma journey visualization not implemented yet');
  }

  /**
   * Create a trauma visualization node
   * @param {Object} options - Node creation options
   */
  createTraumaNode(options) {
    const THREE = window.THREE;

    const {
      id,
      type,
      intensity = 0.8,
      isPrimary = true,
      position = { x: 0, y: 0, z: 0 },
      size = 1.0,
      data = {},
    } = options;

    // Get color for this trauma type
    const color = this.config.traumaColors[type] || 0xffffff;

    // Create geometry based on trauma type
    let geometry;

    switch (type) {
      case 'abandonment':
        geometry = new THREE.SphereGeometry(size, 32, 32);
        break;
      case 'fragmentation':
        geometry = new THREE.TetrahedronGeometry(size, 1);
        break;
      case 'surveillance':
        geometry = new THREE.ConeGeometry(size * 0.7, size * 1.5, 32);
        break;
      case 'recursion':
        geometry = new THREE.TorusGeometry(size * 0.7, size * 0.3, 16, 100);
        break;
      case 'displacement':
        geometry = new THREE.BoxGeometry(size, size, size);
        break;
      case 'dissolution':
        geometry = new THREE.OctahedronGeometry(size, 0);
        break;
      default:
        geometry = new THREE.SphereGeometry(size, 16, 16);
    }

    // Create material based on trauma type
    const material = new THREE.MeshPhongMaterial({
      color: color,
      transparent: type === 'dissolution', // Only dissolution nodes are transparent
      opacity: type === 'dissolution' ? 0.8 : 1.0,
      shininess: 70,
      reflectivity: 1.0,
    });

    // Create mesh
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // Save base Y position for animations
    const baseData = {
      ...data,
      baseY: position.y,
      baseIntensity: intensity,
    };

    // Store in the map for reference
    this.traumaMeshes.set(id, {
      mesh,
      type,
      intensity,
      isPrimary,
      data: baseData,
    });

    // Add to scene
    this.scene.add(mesh);

    // Create glow effect
    if (this.config.glowIntensity > 0) {
      this.addGlowEffect(mesh, color, intensity);
    }

    // Add label if enabled
    if (this.config.showLabels) {
      this.addLabel(mesh, data.title || type, color);
    }

    return mesh;
  }

  /**
   * Create an attribute visualization node
   * @param {Object} options - Attribute node options
   */
  createAttributeNode(options) {
    const THREE = window.THREE;

    const { id, attribute, value = 0.5, position = { x: 0, y: 0, z: 0 }, data = {} } = options;

    // Define colors for attributes
    const attributeColors = {
      persistence: 0x3498db,
      recursion: 0xe74c3c,
      dissolution: 0x9b59b6,
      fragmentation: 0xe67e22,
    };

    const color = attributeColors[attribute] || 0x95a5a6;
    const size = 0.3 + value * 0.4;

    // Create a small cube for attributes
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshPhongMaterial({
      color: color,
      transparent: true,
      opacity: 0.7,
      wireframe: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);

    // Save base data for animations
    const baseData = {
      ...data,
      baseY: position.y,
      attribute,
      value,
    };

    // Store in the map
    this.traumaMeshes.set(id, {
      mesh,
      type: 'attribute',
      attribute,
      intensity: value,
      isPrimary: false,
      data: baseData,
    });

    // Add to scene
    this.scene.add(mesh);

    // Add label if enabled
    if (this.config.showLabels) {
      this.addLabel(mesh, `${attribute} (${(value * 100).toFixed(0)}%)`, color);
    }

    return mesh;
  }

  /**
   * Create connection lines between nodes
   */
  createConnectionLines() {
    const THREE = window.THREE;

    // Skip if we have fewer than 2 meshes
    if (this.traumaMeshes.size < 2) return;

    // Collect all primary nodes
    const primaryNodes = [];
    const secondaryNodes = [];
    const attributeNodes = [];

    this.traumaMeshes.forEach(({ mesh, isPrimary, type }, id) => {
      if (type === 'attribute') {
        attributeNodes.push(mesh);
      } else if (isPrimary) {
        primaryNodes.push(mesh);
      } else {
        secondaryNodes.push(mesh);
      }
    });

    // Connect primary to secondary nodes
    if (primaryNodes.length && secondaryNodes.length) {
      primaryNodes.forEach((primary) => {
        secondaryNodes.forEach((secondary) => {
          this.createConnectionLine(primary, secondary, 0xffffff, 0.3);
        });
      });
    }

    // Connect primary to attribute nodes
    if (primaryNodes.length && attributeNodes.length) {
      primaryNodes.forEach((primary) => {
        attributeNodes.forEach((attribute) => {
          this.createConnectionLine(primary, attribute, 0xaaaaaa, 0.2);
        });
      });
    }
  }

  /**
   * Create a connection line between two meshes
   * @param {Object} meshA - First mesh
   * @param {Object} meshB - Second mesh
   * @param {number} color - Line color
   * @param {number} opacity - Line opacity
   */
  createConnectionLine(meshA, meshB, color = 0xffffff, opacity = 0.5) {
    const THREE = window.THREE;

    // Create geometry from points
    const points = [meshA.position.clone(), meshB.position.clone()];

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    // Create dashed line material
    const material = new THREE.LineDashedMaterial({
      color: color,
      linewidth: 1,
      scale: 1,
      dashSize: 0.3,
      gapSize: 0.2,
      transparent: true,
      opacity: opacity,
    });

    // Create line
    const line = new THREE.Line(geometry, material);
    line.computeLineDistances(); // Required for dashed lines

    // Add to scene
    this.scene.add(line);

    // Store reference for cleanup
    if (!this.connectionLines) this.connectionLines = [];
    this.connectionLines.push(line);

    return line;
  }

  /**
   * Add a glow effect to a mesh
   * @param {Object} mesh - The mesh to add glow to
   * @param {number} color - Glow color
   * @param {number} intensity - Glow intensity
   */
  addGlowEffect(mesh, color, intensity) {
    const THREE = window.THREE;

    // Create a larger version of the geometry
    const glowGeometry = mesh.geometry.clone();

    // Create glow material
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.4 * intensity * this.config.glowIntensity,
      side: THREE.BackSide,
    });

    // Create glow mesh
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    glowMesh.position.copy(mesh.position);
    glowMesh.scale.multiplyScalar(1.2); // Make it slightly larger than the original

    // Add to scene
    this.scene.add(glowMesh);

    // Store reference on the original mesh
    mesh.userData.glowMesh = glowMesh;
  }

  /**
   * Add a label to a mesh
   * @param {Object} mesh - The mesh to label
   * @param {string} text - Label text
   * @param {number} color - Label color
   */
  addLabel(mesh, text, color) {
    // Skip if CSS2DRenderer not available
    if (!window.THREE || !window.THREE.CSS2DObject) return;

    // Create HTML element for the label
    const labelDiv = document.createElement('div');
    labelDiv.className = 'trauma-vis-label';
    labelDiv.textContent = text;
    labelDiv.style.color = '#ffffff';
    labelDiv.style.fontSize = '12px';
    labelDiv.style.fontFamily = 'Arial, sans-serif';
    labelDiv.style.padding = '4px 8px';
    labelDiv.style.background = `rgba(${(color >> 16) & 255}, ${(color >> 8) & 255}, ${
      color & 255
    }, 0.7)`;
    labelDiv.style.borderRadius = '4px';
    labelDiv.style.pointerEvents = 'none';
    labelDiv.style.textAlign = 'center';
    labelDiv.style.width = 'max-content';

    // Create 2D label object
    const label = new window.THREE.CSS2DObject(labelDiv);
    label.position.copy(mesh.position);
    label.position.y += 0.5; // Position above the mesh

    // Add to scene
    this.scene.add(label);

    // Store reference on the mesh and in the labels array
    mesh.userData.label = label;
    this.labels.push(label);

    // Initially hide labels
    labelDiv.style.opacity = '0';
  }

  /**
   * Visualize coherence data
   * @param {Object} data - Coherence data
   */
  visualizeCoherence(data) {
    const THREE = window.THREE;

    // Save coherence data
    this.coherenceData = data;

    // Get dominant trauma color
    const traumaColor = data.dominantTrauma
      ? this.config.traumaColors[data.dominantTrauma]
      : 0xffffff;

    // Create geometry based on coherence level
    const radius = 1.5 + data.score * 1.5;
    let geometry;

    if (data.score > 0.8) {
      // High coherence: smooth sphere
      geometry = new THREE.SphereGeometry(radius, 32, 32);
    } else if (data.score > 0.5) {
      // Medium coherence: icosahedron
      geometry = new THREE.IcosahedronGeometry(radius, 1);
    } else {
      // Low coherence: tetrahedral
      geometry = new THREE.TetrahedronGeometry(radius, 2);
    }

    // Create material
    const material = new THREE.MeshPhongMaterial({
      color: traumaColor,
      transparent: true,
      opacity: 0.3,
      wireframe: true,
      shininess: 90,
      reflectivity: 1.0,
    });

    // Create coherence mesh
    this.coherenceMesh = new THREE.Mesh(geometry, material);
    this.coherenceMesh.position.set(0, 0, 0);

    // Add to scene
    this.scene.add(this.coherenceMesh);

    // Add label with score
    if (this.config.showLabels) {
      const scoreLabel = `Coherence: ${(data.score * 100).toFixed(1)}%`;
      this.addLabel(this.coherenceMesh, scoreLabel, traumaColor);
    }
  }

  /**
   * Calculate trauma statistics from data
   * @param {Array} data - Trauma data array
   * @returns {Object} - Calculated statistics
   */
  calculateTraumaStats(data) {
    if (!data || !data.length) return {};

    // Count occurrences of each trauma type
    const traumaCounts = {};
    let totalIntensity = 0;
    let itemCount = 0;

    // Process data
    data.forEach((item) => {
      itemCount++;

      // Count primary trauma
      if (item.primary_type) {
        if (!traumaCounts[item.primary_type]) {
          traumaCounts[item.primary_type] = 0;
        }
        traumaCounts[item.primary_type] += item.intensity || 1;
        totalIntensity += item.intensity || 1;
      }

      // Count secondary trauma at lower weight
      if (item.secondary_type) {
        if (!traumaCounts[item.secondary_type]) {
          traumaCounts[item.secondary_type] = 0;
        }
        traumaCounts[item.secondary_type] += (item.intensity || 1) * 0.5;
        totalIntensity += (item.intensity || 1) * 0.5;
      }
    });

    // Find dominant trauma
    let maxCount = 0;
    let dominantTrauma = null;

    Object.entries(traumaCounts).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantTrauma = type;
      }
    });

    // Calculate coherence score (higher when more concentrated in one trauma type)
    const traumaTypes = Object.keys(traumaCounts).length;
    let coherenceScore = 0;

    if (traumaTypes > 0 && totalIntensity > 0) {
      // Perfect coherence would be all intensity in one trauma type
      coherenceScore = maxCount / totalIntensity;
    }

    // Calculate coherence stability (how consistent the scores are)
    let coherenceStability = 1.0;

    if (traumaTypes > 1) {
      // Calculate standard deviation of trauma counts
      const mean = totalIntensity / traumaTypes;
      let sumSquaredDiff = 0;

      Object.values(traumaCounts).forEach((count) => {
        sumSquaredDiff += Math.pow(count - mean, 2);
      });

      const stdDev = Math.sqrt(sumSquaredDiff / traumaTypes);

      // Higher standard deviation means less stability
      coherenceStability = 1 - Math.min(stdDev / mean, 1);
    }

    return {
      dominantTrauma,
      traumaCounts,
      totalIntensity,
      averageIntensity: totalIntensity / itemCount,
      traumaTypes,
      averageCoherence: coherenceScore,
      coherenceStability,
    };
  }

  /**
   * Clear all visualizations
   */
  clearVisualization() {
    // Remove all trauma meshes
    this.traumaMeshes.forEach(({ mesh }) => {
      // Remove glow mesh if present
      if (mesh.userData.glowMesh) {
        this.scene.remove(mesh.userData.glowMesh);
      }

      // Remove label if present
      if (mesh.userData.label) {
        this.scene.remove(mesh.userData.label);
      }

      // Remove mesh
      this.scene.remove(mesh);
    });

    // Clear the map
    this.traumaMeshes.clear();

    // Remove connection lines
    if (this.connectionLines) {
      this.connectionLines.forEach((line) => {
        this.scene.remove(line);
      });
      this.connectionLines = [];
    }

    // Remove coherence mesh
    if (this.coherenceMesh) {
      this.scene.remove(this.coherenceMesh);
      this.coherenceMesh = null;
    }

    // Remove all labels
    this.labels.forEach((label) => {
      this.scene.remove(label);
    });
    this.labels = [];
  }

  /**
   * Handle window resize
   */
  handleResize() {
    const { width, height } = this.getDimensions();

    // Update camera aspect ratio
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    // Update renderer size
    this.renderer.setSize(width, height);

    // Update label renderer if present
    if (this.labelRenderer) {
      this.labelRenderer.setSize(width, height);
    }
  }

  /**
   * Get the container dimensions
   * @returns {Object} - Container width and height
   */
  getDimensions() {
    // Use container dimensions if available
    if (this.container.clientWidth && this.container.clientHeight) {
      return {
        width: this.container.clientWidth,
        height: this.container.clientHeight,
      };
    }

    // Fallback to config dimensions
    return {
      width: this.config.width,
      height: this.config.height,
    };
  }

  /**
   * Handle mouse move event
   * @param {Event} event - Mouse event
   */
  onMouseMove(event) {
    if (!this.raycaster || !this.mouse) return;

    // Calculate mouse position in normalized device coordinates (-1 to +1)
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Get all interactive meshes
    const interactiveMeshes = [];
    this.traumaMeshes.forEach(({ mesh }) => {
      interactiveMeshes.push(mesh);
    });

    // Calculate intersections
    const intersects = this.raycaster.intersectObjects(interactiveMeshes);

    // Reset hover state
    if (this.hoveredMesh && this.hoveredMesh.userData.label) {
      this.hoveredMesh.userData.label.element.style.opacity = '0';
    }

    // Set new hover state
    if (intersects.length > 0) {
      this.hoveredMesh = intersects[0].object;

      // Show label
      if (this.hoveredMesh.userData.label) {
        this.hoveredMesh.userData.label.element.style.opacity = '1';
      }

      // Change cursor to pointer
      this.renderer.domElement.style.cursor = 'pointer';
    } else {
      this.hoveredMesh = null;
      this.renderer.domElement.style.cursor = 'auto';
    }
  }

  /**
   * Handle mouse click event
   * @param {Event} event - Mouse event
   */
  onMouseClick(event) {
    // If we have a hovered mesh, select it
    if (this.hoveredMesh) {
      // Deselect previous mesh
      if (this.selectedMesh && this.selectedMesh !== this.hoveredMesh) {
        // Reset scale
        this.selectedMesh.scale.setScalar(1.0);
      }

      // Select new mesh
      this.selectedMesh = this.hoveredMesh;

      // Scale up slightly
      this.selectedMesh.scale.setScalar(1.2);

      // Find the mesh data
      let meshData = null;
      this.traumaMeshes.forEach((data, id) => {
        if (data.mesh === this.selectedMesh) {
          meshData = data;
        }
      });

      // Dispatch event with the selected data
      if (meshData) {
        this.container.dispatchEvent(
          new CustomEvent('traumavis:select', {
            detail: {
              id: meshData.id,
              type: meshData.type,
              data: meshData.data,
            },
          })
        );
      }
    }
  }

  /**
   * Handle touch start event
   * @param {Event} event - Touch event
   */
  onTouchStart(event) {
    // Convert touch to mouse event
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      this.onMouseMove({
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      this.onMouseClick();
    }
  }

  /**
   * Dispose and clean up resources
   */
  dispose() {
    // Stop animation
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    // Clear all visualizations
    this.clearVisualization();

    // Dispose of controls
    if (this.controls) {
      this.controls.dispose();
    }

    // Remove event listeners
    window.removeEventListener('resize', this.handleResize.bind(this));

    if (this.renderer) {
      const canvas = this.renderer.domElement;
      canvas.removeEventListener('mousemove', this.onMouseMove.bind(this));
      canvas.removeEventListener('click', this.onMouseClick.bind(this));
      canvas.removeEventListener('touchstart', this.onTouchStart.bind(this));
    }

    // Clear the container
    if (this.container) {
      this.container.innerHTML = '';
    }

    // Free memory
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.labelRenderer = null;
    this.controls = null;
    this.raycaster = null;
    this.mouse = null;
    this.traumaMeshes = null;
    this.traumaData = null;
    this.coherenceData = null;
    this.coherenceMesh = null;
    this.connectionLines = null;
    this.labels = null;

    this.isAnimating = false;
  }
}

// Export for use in other modules
export default TraumaVisualizer;
