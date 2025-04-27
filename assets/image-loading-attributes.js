/**
 * IMAGE-LOADING-ATTRIBUTES.JS
 * Handles image loading strategy and dimension attributes
 *
 * @MutationCompatible: All Variants
 * @StrategyProfile: quantum-entangled
 * @Version: 1.0.0
 * @Date: April 27, 2025
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
      prioritizeAboveTheFold: true,
      saveDataMode: false, // Will be set based on user's connection or preference
      preventLazyLCP: true, // Ensure LCP candidates are eager loaded
      ...options,
    };

    // Check for connection speed and implement data-saving measures
    this.detectConnectionSpeed();

    // Initialize
    this.init();
  }

  /**
   * Detect connection speed and adjust image loading strategy
   */
  detectConnectionSpeed() {
    // Check if user has 'Save-Data' header (indicates user prefers reduced data usage)
    if (navigator.connection && navigator.connection.saveData) {
      this.options.saveDataMode = true;
    }

    // Check if user is on a slow connection
    if (
      navigator.connection &&
      (navigator.connection.effectiveType === 'slow-2g' ||
        navigator.connection.effectiveType === '2g' ||
        navigator.connection.effectiveType === '3g')
    ) {
      this.options.saveDataMode = true;
    }

    // Also listen for connection changes
    if (navigator.connection && navigator.connection.addEventListener) {
      navigator.connection.addEventListener('change', () => {
        const previousMode = this.options.saveDataMode;
        this.options.saveDataMode =
          navigator.connection.saveData ||
          ['slow-2g', '2g', '3g'].includes(navigator.connection.effectiveType);

        // If save data mode changed, we might want to adjust loaded images
        if (previousMode !== this.options.saveDataMode) {
          this.applySaveDataAttributes();
        }
      });
    }
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

    // Apply save-data attributes if needed
    if (this.options.saveDataMode) {
      this.applySaveDataAttributes();
    }

    // Set up mutation observer to handle dynamically added images
    this.setupMutationObserver();

    // Monitor layout shifts to detect problematic images
    this.monitorLayoutShifts();
  }

  /**
   * Apply eager loading to critical above-the-fold images
   */
  applyEagerLoading() {
    const eagerImages = document.querySelectorAll(this.options.eagerLoadSelector);

    eagerImages.forEach((img) => {
      // Skip if already processed
      if (img.hasAttribute('data-vb-optimized')) return;

      // Set loading attribute
      img.setAttribute('loading', 'eager');

      // Set fetchpriority attribute for even faster loading if it's a truly critical image
      if (this.isCriticalImage(img)) {
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

      // Add decoding attribute - use sync for critical images, async for others
      img.setAttribute('decoding', this.isCriticalImage(img) ? 'sync' : 'async');

      // Mark as optimized
      img.setAttribute('data-vb-optimized', 'true');
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
      // Skip if already processed
      if (img.hasAttribute('data-vb-optimized')) return;

      // If this is potentially an LCP candidate, don't lazy load if preventLazyLCP is true
      if (this.options.preventLazyLCP && this.couldBeLCPCandidate(img)) {
        img.setAttribute('loading', 'eager');
        img.setAttribute('decoding', 'async');
      } else {
        // Set loading attribute
        img.setAttribute('loading', 'lazy');
        img.setAttribute('decoding', 'async');
      }

      // Mark as optimized
      img.setAttribute('data-vb-optimized', 'true');
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
   * Apply data-saving attributes to images in save-data mode
   */
  applySaveDataAttributes() {
    if (!this.options.saveDataMode) return;

    // Apply to all images except critical ones
    document.querySelectorAll('img:not([data-priority="high"])').forEach((img) => {
      if (this.isCriticalImage(img)) return;

      // Add loading=lazy regardless of position for non-critical images
      img.setAttribute('loading', 'lazy');

      // If the image has srcset, we'll modify to prefer smaller images
      if (img.srcset) {
        const srcsetParts = img.srcset.split(',').map((part) => part.trim());
        // Filter to keep only smaller image versions
        const filteredSrcset = srcsetParts
          .filter((part) => {
            const match = part.match(/(\d+)w$/);
            // Keep only images smaller than 800px wide
            return !match || parseInt(match[1], 10) < 800;
          })
          .join(', ');

        if (filteredSrcset) {
          img.srcset = filteredSrcset;
        }
      }
    });
  }

  /**
   * Set dimensions on an image element
   */
  setDimensions(img) {
    // Only add missing attributes if the image has loaded
    if (img.complete && img.naturalWidth > 0) {
      // Add width attribute if missing
      if (!img.hasAttribute('width')) {
        img.setAttribute('width', img.naturalWidth);
      }

      // Add height attribute if missing
      if (!img.hasAttribute('height')) {
        img.setAttribute('height', img.naturalHeight);
      }

      // Calculate and store aspect ratio for responsive sizing
      if (!img.hasAttribute('data-aspect-ratio')) {
        const aspectRatio = (img.naturalHeight / img.naturalWidth).toFixed(4);
        img.setAttribute('data-aspect-ratio', aspectRatio);
      }
    }
  }

  /**
   * Monitor cumulative layout shifts to detect problem images
   */
  monitorLayoutShifts() {
    if (!('PerformanceObserver' in window)) return;

    try {
      // Track layout shifts
      const layoutShiftObserver = new PerformanceObserver((entries) => {
        entries.getEntries().forEach((entry) => {
          // Check if we have significant layout shift
          if (entry.value > 0.05) {
            // Try to find the nodes that contributed to this shift
            if (entry.sources && entry.sources.length) {
              entry.sources.forEach((source) => {
                if (source.node && source.node.tagName === 'IMG') {
                  const img = source.node;
                  console.warn('[ImageLoading] Layout shift detected from image:', img);

                  // Fix the image immediately by setting dimensions
                  if (img.complete && img.naturalWidth > 0) {
                    this.setDimensions(img);
                  }

                  // Mark for future reference
                  img.setAttribute('data-layout-shift-detected', 'true');
                }
              });
            }
          }
        });
      });

      layoutShiftObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.error('[ImageLoading] Error setting up PerformanceObserver:', e);
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
    if (img.hasAttribute('data-vb-optimized')) return;

    // Check if it should be eager loaded
    if (this.isEagerLoadImage(img)) {
      img.setAttribute('loading', 'eager');

      // Set high priority if it's a critical image
      if (this.isCriticalImage(img)) {
        img.setAttribute('fetchpriority', 'high');
        img.setAttribute('decoding', 'sync');
      } else {
        img.setAttribute('decoding', 'async');
      }
    } else {
      // Apply lazy loading
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
    }

    // Set dimensions if missing
    if (
      this.options.addMissingDimensions &&
      (!img.hasAttribute('width') || !img.hasAttribute('height'))
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

    // Mark as optimized
    img.setAttribute('data-vb-optimized', 'true');
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

    // Check if it's likely to be above the fold
    if (this.options.prioritizeAboveTheFold && this.isLikelyAboveTheFold(img)) {
      return true;
    }

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

    // Also check by size - large images are often LCP candidates
    const width = img.width || img.getAttribute('width');
    const height = img.height || img.getAttribute('height');
    if (width && height && width >= 300 && height >= 200) {
      // Check if visible in the viewport on load
      if (this.isInInitialViewport(img)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if element is likely above the fold
   * (approximate since we don't know final layout yet)
   */
  isLikelyAboveTheFold(img) {
    const rect = img.getBoundingClientRect();
    // Consider images in the top 120% of the viewport likely above the fold
    // (extra 20% for margins of error in initial layout)
    return rect.top < window.innerHeight * 1.2;
  }

  /**
   * Check if element is in the initial viewport
   */
  isInInitialViewport(img) {
    const rect = img.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );
  }

  /**
   * Check if an image could be an LCP candidate
   * Uses heuristics to determine if an image might be the largest contentful paint
   */
  couldBeLCPCandidate(img) {
    // If already marked as high priority
    if (this.isCriticalImage(img)) return true;

    // Check placement in document
    if (img.closest('header, .main-content, main, [role="main"]')) {
      // Check size - larger images are more likely to be LCP candidates
      const width = img.getAttribute('width') || img.width;
      const height = img.getAttribute('height') || img.height;

      // If we can determine size and it's large enough
      if (width && height && width * height > 40000) {
        // 200x200 or equivalent
        return true;
      }

      // Check by class/ID patterns that might indicate hero images
      if (img.id && /hero|banner|main|feature/i.test(img.id)) return true;
      if (img.className && /hero|banner|main|feature|carousel/i.test(img.className)) return true;
    }

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
