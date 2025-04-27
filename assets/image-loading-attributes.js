/**
 * IMAGE-LOADING-ATTRIBUTES.JS
 * Handles image loading strategy and dimension attributes
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * @Version: 1.0.0
 * @Date: April 26, 2025
 */

/**
 * ImageLoadingOptimizer provides methods for optimizing image loading
 * by applying proper loading attributes and ensuring dimensions are set
 */
class ImageLoadingOptimizer {
  constructor(options = {}) {
    this.options = {
      // Default options
      lazyLoadSelector: 'img:not([loading])',
      eagerLoadSelector:
        '.hero-section img, .featured-product__image img, .site-header__logo img, img[data-priority="high"]',
      rootMargin: '500px 0px',
      addMissingDimensions: true,
      ...options,
    };

    // Initialize
    this.init();
  }

  /**
   * Initialize optimizer
   */
  init() {
    // Apply eager loading to critical above-the-fold images
    this.applyEagerLoading();

    // Apply lazy loading to below-the-fold images
    this.applyLazyLoading();

    // Add missing dimensions to prevent layout shifts
    if (this.options.addMissingDimensions) {
      this.addMissingDimensions();
    }

    // Set up mutation observer to handle dynamically added images
    this.setupMutationObserver();
  }

  /**
   * Apply eager loading to critical above-the-fold images
   */
  applyEagerLoading() {
    const eagerImages = document.querySelectorAll(this.options.eagerLoadSelector);

    eagerImages.forEach((img) => {
      // Set loading attribute
      img.setAttribute('loading', 'eager');

      // Set fetchpriority attribute for even faster loading if it's a truly critical image
      if (img.closest('.hero-section') || img.dataset.priority === 'high') {
        img.setAttribute('fetchpriority', 'high');
      }

      // Remove any data-src attributes to ensure immediate loading
      if (img.dataset.src) {
        img.src = img.dataset.src;
        delete img.dataset.src;
      }

      // Remove any data-srcset attributes to ensure immediate loading
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
        delete img.dataset.srcset;
      }
    });
  }

  /**
   * Apply lazy loading to below-the-fold images
   */
  applyLazyLoading() {
    // Get all images without a loading attribute, except those that should be eager
    const lazyImages = document.querySelectorAll(
      `${this.options.lazyLoadSelector}:not(${this.options.eagerLoadSelector})`
    );

    lazyImages.forEach((img) => {
      // Set loading attribute
      img.setAttribute('loading', 'lazy');

      // For data-src patterns, keep them as they'll be handled by JavaScript lazy loading
      // This provides a fallback mechanism if native lazy loading isn't supported
    });
  }

  /**
   * Add missing width and height attributes to prevent layout shifts
   */
  addMissingDimensions() {
    const images = document.querySelectorAll('img:not([width]):not([height])');

    images.forEach((img) => {
      // For images already in the DOM with natural dimensions
      if (img.complete && img.naturalWidth > 0) {
        this.setDimensions(img);
      } else {
        // For images still loading
        img.addEventListener(
          'load',
          () => {
            this.setDimensions(img);
          },
          { once: true }
        );
      }
    });
  }

  /**
   * Set dimensions on an image element
   */
  setDimensions(img) {
    // Only set dimensions if they're not already present
    if (!img.hasAttribute('width') && !img.hasAttribute('height')) {
      // Check if image has loaded and has natural dimensions
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        img.setAttribute('width', img.naturalWidth);
        img.setAttribute('height', img.naturalHeight);
      }
    }
  }

  /**
   * Set up mutation observer to handle dynamically added images
   */
  setupMutationObserver() {
    // Skip if MutationObserver not supported
    if (!window.MutationObserver) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Check for newly added images
        mutation.addedNodes.forEach((node) => {
          // Handle direct image additions
          if (node.tagName === 'IMG') {
            this.processImage(node);
          }

          // Handle images added inside other elements
          if (node.querySelectorAll) {
            node.querySelectorAll('img').forEach((img) => {
              this.processImage(img);
            });
          }
        });
      });
    });

    // Start observing the document body
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  /**
   * Process a single image (apply loading attributes and set dimensions)
   */
  processImage(img) {
    // Skip if already processed
    if (img.hasAttribute('loading')) return;

    // Check if it should be eager loaded
    if (this.isEagerLoadImage(img)) {
      img.setAttribute('loading', 'eager');

      // Set high priority if it's a critical image
      if (this.isCriticalImage(img)) {
        img.setAttribute('fetchpriority', 'high');
      }
    } else {
      // Apply lazy loading
      img.setAttribute('loading', 'lazy');
    }

    // Set dimensions if missing
    if (
      this.options.addMissingDimensions &&
      !img.hasAttribute('width') &&
      !img.hasAttribute('height')
    ) {
      // For already loaded images
      if (img.complete && img.naturalWidth > 0) {
        this.setDimensions(img);
      } else {
        // For images still loading
        img.addEventListener(
          'load',
          () => {
            this.setDimensions(img);
          },
          { once: true }
        );
      }
    }
  }

  /**
   * Check if an image should be eager loaded
   */
  isEagerLoadImage(img) {
    // Check if it matches our eager loading criteria
    if (img.closest('.hero-section')) return true;
    if (img.closest('.featured-product__image')) return true;
    if (img.closest('.site-header__logo')) return true;
    if (img.dataset.priority === 'high') return true;

    return false;
  }

  /**
   * Check if an image is a critical LCP image
   */
  isCriticalImage(img) {
    // Hero images and featured product images are usually critical
    if (img.closest('.hero-section')) return true;
    if (img.closest('.featured-product__image')) return true;
    if (img.dataset.priority === 'high') return true;

    return false;
  }
}

/**
 * Initialize the image loading optimizer when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize with default options
  window.imageLoadingOptimizer = new ImageLoadingOptimizer();
});

// Make it available globally for custom configurations
window.ImageLoadingOptimizer = ImageLoadingOptimizer;
