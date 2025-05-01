/**
 * HOLOGRAPHIC-EXTENSION.TS
 * Holographic preview extension for the cart system
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * @Version: 3.0.0
 */

import { CartCore } from './cart-core';
import { CartExtension } from './cart-extension-interface';
import { HologramOptions, HologramRenderer } from './hologram-renderer';

// Define an extended HologramOptions interface with additional options specific to this extension
interface HolographicExtensionConfig {
  containerSelector: string;
  useQuantumEffects: boolean;
  intensity: number;
  traumaCodes: string[];
  profile: string;
  debug: boolean;
}

// Extend CartCore config to include holographic options
declare module './cart-core' {
  interface CartConfig {
    holographicOptions?: Partial<HolographicExtensionConfig>;
    debug?: boolean;
  }
}

/**
 * HolographicExtension
 * Adds 3D holographic preview capability to the cart system
 */
export class HolographicExtension implements CartExtension {
  name = 'holographic';
  version = '3.0.0';

  private holographicSupported = false;
  private renderer?: typeof HologramRenderer;
  private container?: HTMLElement;
  private activeProduct?: any;
  private config: HolographicExtensionConfig = {
    containerSelector: '#cart-preview-container',
    useQuantumEffects: true,
    intensity: 1.0,
    traumaCodes: [],
    profile: 'CyberLotus',
    debug: false,
  };

  /**
   * Initialize the holographic extension
   * @param cart The cart core instance
   */
  initialize(cart: typeof CartCore): void {
    // Merge configuration using type assertion to avoid TypeScript errors
    const cartConfig = cart.config as any;
    const holographicOptions = cartConfig.holographicOptions || {};
    this.config = { ...this.config, ...holographicOptions };
    this.config.debug = cart.config.debug || this.config.debug;

    // Check for WebGL support
    this.checkHolographicSupport().then((supported) => {
      this.holographicSupported = supported;

      if (this.holographicSupported) {
        this.initializeRenderer();
        this.setupContainer();

        if (this.config.debug) {
          console.log('[HolographicExtension] Initialized with holographic support');
        }
      } else if (this.config.debug) {
        console.log(
          '[HolographicExtension] Initialized without holographic support (WebGL not available)'
        );
      }
    });
  }

  /**
   * Handle cart events
   * @param event The event name
   * @param data Event data
   */
  onEvent(event: string, data: any): void {
    if (!this.holographicSupported) return;

    switch (event) {
      case 'itemAdded':
        this.triggerEffect('add');
        break;

      case 'itemRemoved':
        this.triggerEffect('remove');
        break;

      case 'itemUpdated':
        this.triggerEffect('update');
        break;

      case 'cartOpened':
        this.updateHolographicPreview();
        break;

      case 'productSelected':
        if (data && data.product) {
          this.updateActiveProduct(data.product);
        }
        break;
    }
  }

  /**
   * Update the active product
   * @param product Product data
   */
  updateActiveProduct(product: any): void {
    this.activeProduct = product;
    this.updateHolographicPreview();

    if (this.config.debug) {
      console.log('[HolographicExtension] Active product updated:', product.title || product.id);
    }
  }

  /**
   * Set trauma codes for effects
   * @param traumaCodes Array of trauma codes
   */
  setTraumaCodes(traumaCodes: string[]): void {
    this.config.traumaCodes = traumaCodes || [];

    if (this.renderer?.initialized) {
      this.renderer.setTraumaCodes(this.config.traumaCodes);
    }
  }

  /**
   * Set the quantum profile
   * @param profile Profile name
   */
  setProfile(profile: string): void {
    this.config.profile = profile;

    if (this.renderer?.initialized) {
      this.renderer.applyQuantumEffects({
        profile: this.config.profile,
        intensity: this.config.intensity,
        traumaCodes: this.config.traumaCodes,
      });
    }
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    if (this.renderer?.dispose) {
      this.renderer.dispose();
    }

    if (this.config.debug) {
      console.log('[HolographicExtension] Disposed');
    }
  }

  /**
   * Check for holographic preview support (WebGL)
   */
  private async checkHolographicSupport(): Promise<boolean> {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch {
      return false;
    }
  }

  /**
   * Initialize the hologram renderer
   */
  private async initializeRenderer(): Promise<void> {
    try {
      // Import the renderer dynamically
      const module = await import('./hologram-renderer');
      this.renderer = module.HologramRenderer;

      if (this.renderer && !this.renderer.initialized) {
        // Create proper hologram options
        const options: HologramOptions = {
          intensity: this.config.intensity,
          profile: this.config.profile,
          debug: this.config.debug,
        };

        this.renderer.initialize(options);
      }

      if (this.config.debug) {
        console.log('[HolographicExtension] Renderer initialized');
      }
    } catch (error) {
      console.error('[HolographicExtension] Error initializing renderer:', error);
      this.holographicSupported = false;
    }
  }

  /**
   * Set up the container for holographic previews
   */
  private setupContainer(): void {
    this.container = document.querySelector(this.config.containerSelector) as HTMLElement;

    if (!this.container) {
      // Create container if it doesn't exist
      this.container = document.createElement('div');
      this.container.id = this.config.containerSelector.substring(1);
      this.container.classList.add('holographic-preview-container');
      document.body.appendChild(this.container);
    }

    // Set container for the renderer
    if (this.container && this.renderer) {
      // Since setContainer doesn't exist, use init method instead
      this.renderer.init(this.container, {
        intensity: this.config.intensity,
        profile: this.config.profile,
        debug: this.config.debug,
      });
    }
  }

  /**
   * Update the holographic preview
   */
  private updateHolographicPreview(): void {
    if (!this.holographicSupported || !this.renderer || !this.activeProduct) return;

    // Find product model URL
    const modelUrl = this.findProductModelUrl(this.activeProduct);

    if (modelUrl) {
      this.renderer
        .loadModel(modelUrl)
        .then(() => {
          this.renderer?.applyQuantumEffects({
            profile: this.config.profile,
            intensity: this.config.intensity,
            traumaCodes: this.config.traumaCodes,
          });

          if (this.config.debug) {
            console.log('[HolographicExtension] Updated preview with model:', modelUrl);
          }
        })
        .catch((error) => {
          console.error('[HolographicExtension] Error loading model:', error);
        });
    }
  }

  /**
   * Find 3D model URL in product data
   */
  private findProductModelUrl(product: any): string | null {
    if (!product) return null;

    // Check for model URL in product media
    if (product.media && Array.isArray(product.media)) {
      const modelMedia = product.media.find(
        (m: any) =>
          m.media_type === 'model' ||
          m.media_type === '3d' ||
          (m.alt && typeof m.alt === 'string' && m.alt.includes('3d-model'))
      );

      if (modelMedia) {
        if (modelMedia.sources) {
          const glbSource = modelMedia.sources.find(
            (s: any) => s.format === 'glb' || (s.url && s.url.endsWith('.glb'))
          );
          if (glbSource) return glbSource.url;

          const gltfSource = modelMedia.sources.find(
            (s: any) => s.format === 'gltf' || (s.url && s.url.endsWith('.gltf'))
          );
          if (gltfSource) return gltfSource.url;
        }

        if (modelMedia.src) return modelMedia.src;
      }
    }

    // Check for model URL in product metafields
    if (product.metafields) {
      const modelMetafield = product.metafields.find(
        (m: any) =>
          (m.namespace === 'product' && m.key === 'model') ||
          (m.namespace === '3d' && m.key === 'model') ||
          (m.namespace === 'model' && m.key === 'url')
      );

      if (modelMetafield && modelMetafield.value) {
        return modelMetafield.value;
      }
    }

    // Fallback: Check for data attributes on product elements
    const productElement = document.querySelector(
      `[data-product-id="${product.id}"]`
    ) as HTMLElement;
    if (productElement) {
      const modelUrl =
        productElement.dataset.modelUrl ||
        productElement.dataset.model ||
        productElement.getAttribute('data-3d-model');

      if (modelUrl) return modelUrl;
    }

    return null;
  }

  /**
   * Trigger a visual effect
   */
  private triggerEffect(effectType: 'add' | 'remove' | 'update'): void {
    if (!this.holographicSupported || !this.renderer) return;

    switch (effectType) {
      case 'add':
        // Use the static method for compatibility
        this.renderer.applyGlitchEffect?.(0.7, 300);
        break;

      case 'remove':
        this.renderer.applyGlitchEffect?.(0.5, 200);
        break;

      case 'update':
        this.renderer.applyGlitchEffect?.(0.3, 150);
        break;
    }
  }
}
