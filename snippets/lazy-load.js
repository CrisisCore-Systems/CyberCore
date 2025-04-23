/**
 * LAZY-LOAD.JS
 * Performance optimizations for non-critical assets
 * @Version: 1.0.0
 * @Optimized: April 2025
 */

// Intersection Observer configuration
const observerConfig = {
  rootMargin: '200px 0px',
  threshold: 0.01,
};

// Initialize the observer
const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const element = entry.target;

      // Handle different element types
      if (element.tagName === 'IMG') {
        loadImage(element);
      } else if (element.dataset.bgImage) {
        loadBackgroundImage(element);
      } else if (element.dataset.component) {
        loadComponent(element);
      } else if (element.dataset.vbAnimation) {
        applyAnimation(element);
      }

      // Stop observing the element
      observer.unobserve(element);
    }
  });
}, observerConfig);

// Helper function to load images
function loadImage(imageElement) {
  const src = imageElement.dataset.src;
  const srcset = imageElement.dataset.srcset;
  const sizes = imageElement.dataset.sizes;

  if (src) imageElement.src = src;
  if (srcset) imageElement.srcset = srcset;
  if (sizes) imageElement.sizes = sizes;

  imageElement.classList.add('loaded');

  // Load high-res version after the initial image is loaded
  if (imageElement.dataset.highRes) {
    const highResImage = new Image();
    highResImage.onload = () => {
      imageElement.src = highResImage.src;
      imageElement.classList.add('high-res-loaded');
    };
    highResImage.src = imageElement.dataset.highRes;
  }
}

// Helper function to load background images
function loadBackgroundImage(element) {
  element.style.backgroundImage = `url('${element.dataset.bgImage}')`;
  element.classList.add('bg-loaded');
}

// Helper function to load dynamic components
function loadComponent(element) {
  const componentName = element.dataset.component;

  // Use fetch to get the component HTML
  fetch(`/?sections=${componentName}`)
    .then((response) => response.text())
    .then((html) => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      // Replace the placeholder with actual content
      element.innerHTML = tempDiv.querySelector(`[data-section-id="${componentName}"]`).innerHTML;
      element.classList.add('component-loaded');

      // Initialize component scripts if needed
      if (window.CyberCore && window.CyberCore.initComponent) {
        window.CyberCore.initComponent(componentName, element);
      }
    })
    .catch((error) => {
      console.error(`Error loading component ${componentName}:`, error);
    });
}

// Helper function to apply animations
function applyAnimation(element) {
  const animation = element.dataset.vbAnimation;

  // Add animation class
  element.classList.add(`vb-animate-${animation}`);

  // If animation has a delay
  if (element.dataset.vbAnimationDelay) {
    element.classList.add(`vb-animation-delay-${element.dataset.vbAnimationDelay}`);
  }
}

// Initialize lazy loading for all marked elements
document.addEventListener('DOMContentLoaded', () => {
  // Defer this to improve critical rendering path
  setTimeout(() => {
    // Lazy load images
    document.querySelectorAll('img[data-src]').forEach((img) => {
      lazyLoadObserver.observe(img);
    });

    // Lazy load background images
    document.querySelectorAll('[data-bg-image]').forEach((element) => {
      lazyLoadObserver.observe(element);
    });

    // Lazy load components
    document.querySelectorAll('[data-component]').forEach((element) => {
      lazyLoadObserver.observe(element);
    });

    // Lazy load animations
    document.querySelectorAll('[data-vb-animation]').forEach((element) => {
      lazyLoadObserver.observe(element);
    });
  }, 0);
});

// Export the observer for other scripts
window.lazyLoadObserver = lazyLoadObserver;
