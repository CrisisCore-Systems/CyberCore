/**
 * Image Handler for CyberCore
 * Manages responsive images and handles dynamic loading
 */
class ImageHandler {
  constructor() {
    this.images = document.querySelectorAll('.responsive-image');
    this.initialize();
  }

  initialize() {
    // Verify all images have proper srcset
    this.validateImages();

    // Set up intersection observer for lazy loading
    this.setupIntersectionObserver();

    // Apply appropriate loading attributes to images
    this.applyLoadingAttributes();

    // Listen for resize events to adjust image sizes
    window.addEventListener('resize', this.debounce(this.updateImageSizes.bind(this), 200));
  }

  validateImages() {
    this.images.forEach((image) => {
      if (!image.srcset && image.dataset.srcset) {
        image.srcset = image.dataset.srcset;
      }

      // Add error handling in case image fails to load
      image.addEventListener('error', this.handleImageError.bind(this, image));
    });
  }

  setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const image = entry.target;
              if (image.dataset.src) {
                image.src = image.dataset.src;
                delete image.dataset.src;
              }
              observer.unobserve(image);
            }
          });
        },
        {
          rootMargin: '200px',
        }
      );

      this.images.forEach((image) => {
        // Only observe images that don't have loading="eager"
        if (!image.loading || image.loading !== 'eager') {
          observer.observe(image);
        }
      });
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      this.images.forEach((image) => {
        if (image.dataset.src) {
          image.src = image.dataset.src;
          delete image.dataset.src;
        }
      });
    }
  }

  applyLoadingAttributes() {
    this.images.forEach((image) => {
      // Skip images that already have loading attributes
      if (image.hasAttribute('loading')) return;

      // Check if it's a critical above-the-fold image
      const isAboveTheFold = this.isAboveTheFoldImage(image);

      if (isAboveTheFold) {
        // Add eager loading for critical LCP images
        image.setAttribute('loading', 'eager');

        // Add additional priority hint for truly critical images
        if (this.isCriticalImage(image)) {
          image.setAttribute('fetchpriority', 'high');
        }
      } else {
        // Add lazy loading for below-the-fold images
        image.setAttribute('loading', 'lazy');
      }

      // Ensure width and height are set to prevent layout shifts
      this.ensureDimensions(image);
    });
  }

  isAboveTheFoldImage(image) {
    // Check if image is likely to be above the fold
    return (
      image.closest('.hero-section') ||
      image.closest('.featured-product__image') ||
      image.closest('.site-header__logo') ||
      image.hasAttribute('data-priority') ||
      image.dataset.priority === 'high'
    );
  }

  isCriticalImage(image) {
    // Hero images and featured product images are usually critical
    return (
      image.closest('.hero-section') ||
      image.closest('.featured-product__image') ||
      image.dataset.priority === 'high'
    );
  }

  ensureDimensions(image) {
    // Only set dimensions if they're not already present
    if (!image.hasAttribute('width') && !image.hasAttribute('height')) {
      // For already loaded images
      if (image.complete && image.naturalWidth > 0) {
        image.setAttribute('width', image.naturalWidth);
        image.setAttribute('height', image.naturalHeight);
      } else {
        // For images still loading
        image.addEventListener(
          'load',
          () => {
            if (image.naturalWidth > 0 && image.naturalHeight > 0) {
              image.setAttribute('width', image.naturalWidth);
              image.setAttribute('height', image.naturalHeight);
            }
          },
          { once: true }
        );
      }
    }
  }

  updateImageSizes() {
    this.images.forEach((image) => {
      // Handle dynamic size adjustments if needed
    });
  }

  handleImageError(image) {
    console.warn('Image failed to load:', image.src);

    // Replace with placeholder if available
    if (image.dataset.placeholder) {
      image.src = image.dataset.placeholder;
    } else {
      // Add default fallback styles
      image.classList.add('image-load-error');
    }
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Initialize the image handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ImageHandler();
});
