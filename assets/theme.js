(function () {
  'use strict';

  // DOM elements cache
  const selectors = {
    searchToggle: '[data-action="toggle-search"]',
    searchForm: '#SearchForm',
    mobileMenuToggle: '[data-action="toggle-mobile-menu"]',
    mobileMenu: '#MobileMenu',
  };

  // Initialize all components
  function init() {
    initSearchToggle();
    initMobileMenu();
    initAccessibility();
    initLazyLoading();
  }

  // Search toggle functionality
  function initSearchToggle() {
    const toggleBtn = document.querySelector(selectors.searchToggle);
    const searchForm = document.querySelector(selectors.searchForm);

    if (!toggleBtn || !searchForm) return;

    toggleBtn.addEventListener('click', function () {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      searchForm.classList.toggle('is-active');

      if (!isExpanded) {
        // Focus the search input when opened
        setTimeout(() => {
          searchForm.querySelector('input[type="search"]').focus();
        }, 100);
      }
    });
  }

  // Mobile menu functionality
  function initMobileMenu() {
    const toggleBtn = document.querySelector(selectors.mobileMenuToggle);
    const mobileMenu = document.querySelector(selectors.mobileMenu);

    if (!toggleBtn || !mobileMenu) return;

    toggleBtn.addEventListener('click', function () {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('is-active');
      document.body.classList.toggle('mobile-menu-open');
    });
  }

  // Accessibility enhancements
  function initAccessibility() {
    // Add focus states for keyboard navigation
    document.addEventListener('keyup', function (event) {
      if (event.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
      }
    });

    // Mouse users don't need focus outlines
    document.addEventListener('mousedown', function () {
      document.body.classList.remove('user-is-tabbing');
    });
  }

  // Native lazy loading with fallback
  function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports native lazy loading
      const lazyImages = document.querySelectorAll('img[loading="lazy"]');
      lazyImages.forEach((img) => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
      });
    } else {
      // Fallback for browsers that don't support native lazy loading
      // Load a lazy loading library here if needed
      console.log('This browser does not support native lazy loading');
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
