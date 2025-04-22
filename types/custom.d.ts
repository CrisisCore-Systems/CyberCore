// This file contains declarations to suppress TypeScript errors for problematic JavaScript files

// Handle private class fields in cart-system.js
/**
 *
 */
declare class CartSystem {
  /**
   *
   */
  static initialize(options?: any): any;
  /**
   *
   */
  static getCart(): Promise<any>;
  /**
   *
   */
  static addToCart(variantId: any, quantity?: number, properties?: any): Promise<any>;
  /**
   *
   */
  static updateItemQuantity(key: string, quantity: number): Promise<any>;
  /**
   *
   */
  static removeItem(key: string): Promise<any>;
  /**
   *
   */
  static clearCart(): Promise<any>;
  /**
   *
   */
  static openCartDrawer(): void;
  /**
   *
   */
  static closeCartDrawer(): void;
  /**
   *
   */
  static toggleCartDrawer(): void;
  /**
   *
   */
  static setActiveProduct(product: any): void;
  /**
   *
   */
  static isCartDrawerOpen(): boolean;
}

// Handle trauma-visualizer.js class method syntax
/**
 *
 */
declare class TraumaVisualizer {
  /**
   *
   */
  constructor(container: any, options?: any);
  /**
   *
   */
  initialize(): void;
  /**
   *
   */
  ensureThreeJsLoaded(): Promise<void>;
  /**
   *
   */
  setupScene(): void;
  /**
   *
   */
  setupCamera(): void;
  /**
   *
   */
  setupRenderer(): void;
  /**
   *
   */
  setupLighting(): void;
  /**
   *
   */
  setupControls(): void;
  /**
   *
   */
  setupInteraction(): void;
  /**
   *
   */
  setupStats(): void;
  /**
   *
   */
  animate(): void;
  /**
   *
   */
  updateAnimations(): void;
  /**
   *
   */
  visualizeTraumaData(data: any, options?: any): void;
  /**
   *
   */
  visualizeCatalogTrauma(): void;
  /**
   *
   */
  visualizeProductTrauma(): void;
  /**
   *
   */
  visualizeCustomerTrauma(): void;
  /**
   *
   */
  visualizeTraumaJourney(): void;
  /**
   *
   */
  createTraumaNode(options: any): any;
  /**
   *
   */
  createAttributeNode(options: any): any;
  /**
   *
   */
  createConnectionLines(): void;
  /**
   *
   */
  createConnectionLine(meshA: any, meshB: any, color?: any, opacity?: any): any;
  /**
   *
   */
  addGlowEffect(mesh: any, color: any, intensity: any): void;
  /**
   *
   */
  addLabel(mesh: any, text: any, color: any): void;
  /**
   *
   */
  visualizeCoherence(data: any): void;
  /**
   *
   */
  calculateTraumaStats(data: any): any;
  /**
   *
   */
  clearVisualization(): void;
  /**
   *
   */
  handleResize(): void;
  /**
   *
   */
  getDimensions(): any;
  /**
   *
   */
  onMouseMove(event: any): void;
  /**
   *
   */
  onMouseClick(event: any): void;
  /**
   *
   */
  onTouchStart(event: any): void;
  /**
   *
   */
  dispose(): void;
}

// Suppress errors from trauma-assessment and narrative-assessment files with string literal issues
declare module '*/ritual-engine/core/trauma-assessment.js' {
  /**
   *
   */
  export class TraumaAssessment {
    /**
     *
     */
    constructor();
    /**
     *
     */
    initialize(): this;
    /**
     *
     */
    registerWithNeuralBus(): void;
    /**
     *
     */
    loadStoredTraumaAffinities(): void;
    /**
     *
     */
    handleVectorResponse(data: any): void;
    /**
     *
     */
    processVectorResponses(vector: string, responses: any[]): any;
    /**
     *
     */
    allVectorsProcessed(): boolean;
    /**
     *
     */
    finalizeAssessment(): void;
    /**
     *
     */
    setTraumaAffinities(affinities: any): string;
    /**
     *
     */
    getTraumaDescriptor(traumaType: string): any;
    /**
     *
     */
    calculateTraumaMatchScore(content: any): number;
  }
}

declare module '*/ritual-engine/vectors/narrative-assessment.js' {
  /**
   *
   */
  export class NarrativeAssessmentVector {
    /**
     *
     */
    constructor();
    /**
     *
     */
    initialize(): this;
    /**
     *
     */
    registerWithNeuralBus(): void;
    /**
     *
     */
    renderAssessment(container: HTMLElement): void;
    /**
     *
     */
    renderCurrentItem(): void;
    /**
     *
     */
    completeAssessment(): any;
    /**
     *
     */
    processResponses(): any;
    /**
     *
     */
    getCompletionPercentage(): number;
    /**
     *
     */
    getPrimaryTraumaType(): string | null;
    /**
     *
     */
    reset(): void;
  }
}
