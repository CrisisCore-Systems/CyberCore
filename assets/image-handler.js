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
        observer.observe(image);
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
