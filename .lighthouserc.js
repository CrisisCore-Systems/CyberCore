// .lighthouserc.js
/**
 * Lighthouse CI configuration for VoidBloom Theme Audit
 * Used with npm run lhci:assert command
 */

module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:8080/',
        'http://localhost:8080/collections',
        'http://localhost:8080/products/sample-product',
        'http://localhost:8080/cart',
      ],
      numberOfRuns: 3,
      // Use desktop as default as Shopify themes tend to be viewed more on desktop
      settings: {
        preset: 'desktop',
      },
      // Chrome flags to simulate production-like environment
      chromeFlags: '--no-sandbox --headless',
    },
    upload: {
      target: 'temporary-public-storage',
    },
    assert: {
      // Assertions based on Shopify's best practices and VoidBloom Theme Audit requirements
      preset: 'lighthouse:recommended',
      assertions: {
        // Performance assertions
        'first-contentful-paint': ['warn', { maxNumericValue: 1500 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        'server-response-time': ['error', { maxNumericValue: 600 }],
        'unused-javascript': ['warn', { maxNumericValue: 1 }],

        // Accessibility assertions (complementing our Axe testing)
        'aria-allowed-attr': ['error'],
        'aria-hidden-body': ['error'],
        'aria-hidden-focus': ['error'],
        'aria-required-attr': ['error'],
        'aria-roles': ['error'],
        'aria-valid-attr-value': ['error'],
        'aria-valid-attr': ['error'],
        'button-name': ['error'],
        'color-contrast': ['warn'],
        'document-title': ['error'],
        'duplicate-id-aria': ['error'],
        'form-field-multiple-labels': ['error'],
        'heading-order': ['warn'],
        'html-has-lang': ['error'],
        'image-alt': ['error'],
        'input-image-alt': ['error'],
        label: ['error'],
        'link-name': ['error'],
        list: ['error'],
        listitem: ['error'],
        'meta-viewport': ['error'],

        // Best practices assertions
        doctype: ['error'],
        charset: ['error'],
        'dom-size': ['warn', { maxNumericValue: 1500 }],
        'no-document-write': ['error'],
        'no-vulnerable-libraries': ['error'],
        'js-libraries': ['off'], // We handle this in our npm audit

        // SEO assertions
        'meta-description': ['error'],
        'link-text': ['warn'],
        hreflang: ['warn'],
        canonical: ['error'],
        'robots-txt': ['warn'],
        'tap-targets': ['warn', { minValue: 0.9 }],

        // PWA assertions - not a focus for Shopify themes, so mostly warnings
        'installable-manifest': ['off'],
        'service-worker': ['off'],
        'splash-screen': ['off'],
        'themed-omnibox': ['off'],
        'content-width': ['warn'],
        viewport: ['error'],

        // Overrides for items that might not apply to our specific implementation
        'uses-rel-preconnect': ['off'],
        'uses-responsive-images': ['warn'],
        'offscreen-images': ['warn'],
      },
    },
  },
};
