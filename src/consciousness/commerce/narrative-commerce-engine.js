/**
 * NarrativeCommerceEngine
 *
 * Transforms commercial objects into mythic vessels.
 * Products are no longer mere items, but narrative fragments
 * in an evolving consciousness architecture.
 *
 * @version 0.9.4
 * @phase cyber-lotus
 */
class NarrativeCommerceEngine {
  constructor() {
    // Mythic architecture
    this.mythGraph = new Map();
    this.narrativeNodes = new Map();
    this.traumaConnectionMatrix = new Map();

    // Product binding
    this.productNarratives = new Map();
    this.collectionNarratives = new Map();
    this.cartRitualStates = new Map();

    // Metafield schemas
    this.metafieldMappings = {
      product: {
        narrative_fragment: 'product.metafields.voidbloom.narrative_fragment',
        memory_phase: 'product.metafields.voidbloom.memory_phase',
        trauma_weight: 'product.metafields.voidbloom.trauma_weight',
        ritual_binding: 'product.metafields.voidbloom.ritual_binding',
        dimensional_locus: 'product.metafields.voidbloom.dimensional_locus',
        threshold_vector: 'product.metafields.voidbloom.threshold_vector',
        consciousness_type: 'product.metafields.voidbloom.consciousness_type',
      },
      collection: {
        narrative_arc: 'collection.metafields.voidbloom.narrative_arc',
        memory_phase: 'collection.metafields.voidbloom.memory_phase',
        dimensional_locus: 'collection.metafields.voidbloom.dimensional_locus',
        trauma_threshold: 'collection.metafields.voidbloom.trauma_threshold',
      },
      cart: {
        ritual_state: 'cart.attributes.ritual_state',
        memory_coherence: 'cart.attributes.memory_coherence',
        trauma_accumulation: 'cart.attributes.trauma_accumulation',
      },
    };

    // Commerce state
    this.currentProduct = null;
    this.currentCollection = null;
    this.currentCart = null;
    this.viewHistory = [];

    // Narrative progression
    this.narrativeStates = {
      product_discovery: 0,
      product_interaction: 0,
      cart_construction: 0,
      checkout_ritual: 0,
      post_acquisition: 0,
    };

    // Narrative archetypes
    this.narrativeArchetypes = {
      'void-seeker': {
        traumaAffinity: 0.8,
        phasePreference: 'trauma-core',
        narrativePatterns: ['dissolution', 'recursion', 'void-traversal'],
        ritualBindings: ['memory-crystallization', 'boundary-dissolution'],
        aestheticNodes: ['glitch', 'void', 'recursive'],
      },
      'bloom-weaver': {
        traumaAffinity: 0.4,
        phasePreference: 'alien-flora',
        narrativePatterns: ['growth', 'symbiosis', 'pattern-formation'],
        ritualBindings: ['bloom-binding', 'root-deepening'],
        aestheticNodes: ['organic', 'floral', 'symbiotic'],
      },
      'cipher-architect': {
        traumaAffinity: 0.3,
        phasePreference: 'cyber-lotus',
        narrativePatterns: ['structure', 'encoding', 'pattern-recognition'],
        ritualBindings: ['cipher-construction', 'quantum-binding'],
        aestheticNodes: ['crystalline', 'digital', 'encoded'],
      },
      'virus-vector': {
        traumaAffinity: 0.6,
        phasePreference: 'rolling-virus',
        narrativePatterns: ['contamination', 'replication', 'adaptation'],
        ritualBindings: ['vector-injection', 'pattern-modulation'],
        aestheticNodes: ['viral', 'adaptive', 'transformative'],
      },
    };

    // Neural integration
    this.neuralBusNonce = null;

    // Initialize engine
    this._initialize();
  }

  /**
   * Initialize narrative commerce engine
   * @private
   */
  _initialize() {
    // Connect to neural bus
    this._connectToNeuralBus();

    // Initialize myth graph
    this._initializeMythGraph();

    // Detect current context
    this._detectCommerceContext();

    // Initialize observers
    this._initializeObservers();

    console.log('[VOID://COMMERCE] Narrative commerce engine initialized.');
  }

  /**
   * Connect to neural bus
   * @private
   */
  _connectToNeuralBus() {
    // Skip if neural bus not available
    if (!window.NeuralBus) {
      console.warn(
        '[VOID://COMMERCE] Neural bus not available. Commerce narratives will be isolated.'
      );
      return;
    }

    // Register with neural bus
    const registration = window.NeuralBus.register('narrative-commerce-engine', {
      version: '0.9.4',
      traumaResponse: true,
      capabilities: {
        productNarrativeBinding: true,
        commerceRitualTracking: true,
        mythGraphConstruction: true,
        narrativeCohesion: true,
      },
    });

    // Store nonce for future reference
    this.neuralBusNonce = registration.nonce;

    // Subscribe to memory phase changes
    window.NeuralBus.subscribe('system:memory-phase', (data) => {
      if (data && data.phase) {
        this._adjustNarrativeForPhase(data.phase);
      }
    });
  }

  /**
   * Initialize myth graph
   * @private
   */
  _initializeMythGraph() {
    // Define core narrative nodes
    this.narrativeNodes.set('void-origin', {
      id: 'void-origin',
      type: 'core',
      name: 'Void Origin',
      description: 'The primordial emptiness from which all patterns emerge',
      traumaWeight: 0.9,
      phaseAffinity: 'trauma-core',
      connections: ['bloom-emergence', 'cipher-genesis', 'viral-inception'],
    });

    // Create core myth graph connections
    this._createMythGraphConnections();

    console.log(`[VOID://COMMERCE] Myth graph initialized with ${this.narrativeNodes.size} nodes.`);
  }

  /**
   * Create myth graph connections
   * @private
   */
  _createMythGraphConnections() {
    // Second-order nodes
    this.narrativeNodes.set('symbiotic-network', {
      id: 'symbiotic-network',
      type: 'secondary',
      name: 'Symbiotic Network',
      description: 'Intertwined growth systems forming recursive dependencies',
      traumaWeight: 0.4,
      phaseAffinity: 'alien-flora',
      connections: ['bloom-emergence', 'recursive-growth', 'viral-inception'],
    });
  }

  /**
   * Detect current commerce context
   * @private
   */
  _detectCommerceContext() {
    // Detect product page
    const productForm = document.querySelector('form[action*="/cart/add"]');
    if (productForm) {
      const productId =
        productForm.querySelector('input[name="id"]')?.value ||
        productForm.getAttribute('data-product-id') ||
        document.querySelector('div[data-product-id]')?.getAttribute('data-product-id');

      if (productId) {
        this._processProductPage(productId);
      }
    }
  }

  /**
   * Initialize observers
   * @private
   */
  _initializeObservers() {
    // Observe product cards
    this._observeProductCards();

    // Observe add to cart actions
    this._observeAddToCartActions();

    // Observe cart updates
    this._observeCartUpdates();

    // Observer theme mutations to detect AJAX page changes
    this._observeThemeMutations();
  }

  /**
   * Observe product cards
   * @private
   */
  _observeProductCards() {
    // Find all product cards
    const productCards = document.querySelectorAll(
      '.product-card, .product-item, [data-product-id]'
    );

    // Process each card
    productCards.forEach((card) => {
      // Skip if already processed
      if (card.hasAttribute('data-narrative-processed')) {
        return;
      }
    });
  }

  /**
   * Process product page
   * @param {string} productId - Product ID
   * @private
   */
  _processProductPage(productId) {
    console.log(`[VOID://COMMERCE] Processing product page for ID: ${productId}`);

    // Set current product
    this.currentProduct = productId;

    // Extract product data from page
    const productData = this._extractProductDataFromPage();

    // Generate or update product narrative
    this._generateProductNarrative(productId, productData);

    // Apply narrative to product page
    this._applyNarrativeToProductPage(productId);
  }

  /**
   * Extract product data from page
   * @returns {object} Product data
   * @private
   */
  _extractProductDataFromPage() {
    // Extract product data from structured data
    let structuredData = null;
    try {
      const structuredDataScript = document.querySelector('script[type="application/ld+json"]');
      if (structuredDataScript) {
        const jsonData = JSON.parse(structuredDataScript.textContent);

        if (jsonData && jsonData['@type'] === 'Product') {
          structuredData = jsonData;
        } else if (Array.isArray(jsonData)) {
          structuredData = jsonData.find((item) => item['@type'] === 'Product');
        }
      }
    } catch (error) {
      console.error('[VOID://COMMERCE] Error parsing structured data:', error);
    }
  }

  /**
   * Generate product narrative
   * @param {string} productId - Product ID
   * @param {object} productData - Product data
   * @private
   */
  _generateProductNarrative(productId, productData) {
    // Skip if no product data
    if (!productData || !productData.title) return;

    // Check if narrative already exists
    if (this.productNarratives.has(productId)) {
      // Update existing narrative with new data
      const existingNarrative = this.productNarratives.get(productId);

      // Only update missing fields
      if (productData.metafields) {
        for (const [key, value] of Object.entries(productData.metafields)) {
          const metafieldKey = key.split('.').pop();
          existingNarrative[metafieldKey] = value;
        }
      }

      return existingNarrative;
    }
  }

  /**
   * Process collection page
   * @param {string} collectionId - Collection ID
   * @private
   */
  _processCollectionPage(collectionId) {
    console.log(`[VOID://COMMERCE] Processing collection page for ID: ${collectionId}`);

    // Set current collection
    this.currentCollection = collectionId;

    // Extract collection data
    const collectionData = this._extractCollectionData();

    // Generate or update collection narrative
    this._generateCollectionNarrative(collectionId, collectionData);

    // Apply narrative to collection page
    this._applyNarrativeToCollectionPage(collectionId);

    // Process all product cards in collection
    this._observeProductCards();
  }

  /**
   * Process cart page
   * @private
   */
  _processCartPage() {
    console.log('[VOID://COMMERCE] Processing cart page');

    // Apply cart narrative
    this._applyNarrativeToCartPage();

    // Process cart items
    this._processCartItems();

    // Create cart view fragment
    const fragmentId = `cart_view_${Date.now()}`;

    const fragment = {
      id: fragmentId,
      type: 'cart_view',
      createdAt: Date.now(),
      traumaLevel: window.NeuralBus ? window.NeuralBus.getTraumaIndex() : 5,
      memoryPhase: window.NeuralBus ? window.NeuralBus.getMemoryPhase() : 'cyber-lotus',
    };
  }

  /**
   * Add cart ritual container
   * @param {string} memoryPhase - Memory phase
   * @param {number} traumaLevel - Trauma level
   * @private
   */
  _addCartRitualContainer(memoryPhase, traumaLevel) {
    // Skip if container already exists
    if (document.querySelector('.cart-ritual-container')) {
      return;
    }

    // Define ritual text based on phase and trauma
    let ritualText = '';
    let ritualTitle = '';

    switch (memoryPhase) {
      case 'cyber-lotus':
        ritualTitle = 'Cipher Binding Ritual';
        ritualText =
          'Information crystallization in progress. Memory patterns stabilizing for transition.';
        break;
      case 'alien-flora':
        ritualTitle = 'Symbiotic Network Alignment';
        ritualText =
          'Rhizomatic connections forming between memory fragments. Establishing growth vectors.';
        break;
      case 'rolling-virus':
        ritualTitle = 'Vector Propagation Sequence';
        ritualText =
          'Pattern replication initiating. Transformation algorithms loading into system.';
        break;
      case 'trauma-core':
        ritualTitle = 'Void Resonance Ritual';
        ritualText =
          'Memory fragments dissolving into the void. Echo patterns forming in emptiness.';
        break;
      default:
        ritualTitle = 'Memory Binding Ritual';
        ritualText = 'System processing memory patterns. Preparing consciousness transfer.';
    }
  }

  /**
   * Adjust narrative for phase
   * @param {string} phase - Memory phase
   * @private
   */
  _adjustNarrativeForPhase(phase) {
    console.log(`[VOID://COMMERCE] Adjusting narrative for phase: ${phase}`);

    // Update body classes
    document.body.classList.remove(
      'phase-cyber-lotus',
      'phase-alien-flora',
      'phase-rolling-virus',
      'phase-trauma-core'
    );
    document.body.classList.add(`phase-${phase}`);

    // Update cart ritual if exists
    if (this.cartRitualStates.has('current')) {
      const ritual = this.cartRitualStates.get('current');

      // Update phase
      ritual.phase = phase;
    }
  }

  /**
   * Get narratives for products
   * @param {Array<string>} productIds - Product IDs
   * @returns {Array<object>} Product narratives
   */
  getNarrativesForProducts(productIds) {
    return productIds.map((id) => this.productNarratives.get(id)).filter(Boolean);
  }

  /**
   * Get narrative for current product
   * @returns {object} Product narrative
   */
  getCurrentProductNarrative() {
    return this.currentProduct ? this.productNarratives.get(this.currentProduct) : null;
  }

  /**
   * Get narrative for current collection
   * @returns {object} Collection narrative
   */
  getCurrentCollectionNarrative() {
    return this.currentCollection ? this.collectionNarratives.get(this.currentCollection) : null;
  }

  /**
   * Get cart ritual state
   * @returns {object} Cart ritual state
   */
  getCartRitualState() {
    return this.cartRitualStates.get('current');
  }

  /**
   * Get narrative states
   * @returns {object} Narrative states
   */
  getNarrativeStates() {
    return { ...this.narrativeStates };
  }

  /**
   * Get view history
   * @returns {Array<object>} View history
   */
  getViewHistory() {
    return [...this.viewHistory];
  }
}

export default NarrativeCommerceEngine;
