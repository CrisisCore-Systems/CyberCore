import { neuralBus } from './index';

/**
 * CheckoutBoundaryHandler
 *
 * Specialized handler for consciousness persistence
 * during the critical checkout phase transition.
 */
export class CheckoutBoundaryHandler {
  constructor() {
    this.checkoutState = {
      currentStep: null,
      fragmentIds: [],
      traumaEncoded: false,
    };

    this.initialize();
  }

  initialize() {
    // Listen for checkout initialization
    document.addEventListener('voidbloom:checkout-started', this.handleCheckoutStart.bind(this));

    // Listen for step transitions
    document.addEventListener('voidbloom:checkout-step-change', this.handleStepChange.bind(this));

    // Listen for iframe creation
    this.observeIframeCreation();
  }

  /**
   * Begin monitoring checkout process
   * @param {Object} initialState - Initial checkout state
   */
  beginCheckoutTracking(initialState = {}) {
    this.checkoutState = {
      ...this.checkoutState,
      ...initialState,
      startTime: Date.now(),
      currentStep: initialState.currentStep || 'initiation',
    };

    // Create persistent fragment for checkout state
    const checkoutFragment = neuralBus.createPersistentFragment(
      'checkout-state',
      this.checkoutState,
      {
        traumaEncoding: true,
        boundaryResilience: 'enhanced',
        expiryTime: 60 * 60 * 1000, // 1 hour
      }
    );

    this.checkoutState.fragmentIds.push('checkout-state');

    // Create temporal buffer for checkout events
    neuralBus.createTemporalBuffer('checkout-sequence', 50);

    return checkoutFragment;
  }

  /**
   * Handle transition to a third-party checkout iframe
   * @param {HTMLIFrameElement} iframe - The checkout iframe
   */
  handleCheckoutIframeTransition(iframe) {
    if (!iframe || !iframe.contentWindow) return;

    // Create quantum state snapshot before transition
    const snapshot = neuralBus.createQuantumStateSnapshot();

    // Add event listener for when iframe loads
    iframe.addEventListener('load', () => {
      // Wait for iframe to be ready
      setTimeout(() => {
        // Send fragments to iframe
        this.checkoutState.fragmentIds.forEach((fragmentId) => {
          neuralBus.sendFragmentAcrossBoundary(
            iframe.contentWindow,
            fragmentId,
            'checkout-boundary'
          );
        });

        // Send full quantum state if possible
        try {
          iframe.contentWindow.postMessage(
            {
              type: 'neural-quantum-state',
              state: snapshot,
            },
            '*'
          );
        } catch (error) {
          console.error('Quantum state transmission failed:', error);
        }
      }, 500);
    });

    // Create event handlers for messages from iframe
    window.addEventListener('message', (event) => {
      // Verify origin for security
      if (!this.isValidCheckoutOrigin(event.origin)) return;

      const { data } = event;
      if (!data || !data.type || !data.type.startsWith('checkout-')) return;

      this.handleCheckoutMessage(data);
    });
  }

  /**
   * Update checkout state with new data
   * @param {Object} stateUpdate - Partial state update
   */
  updateCheckoutState(stateUpdate) {
    this.checkoutState = {
      ...this.checkoutState,
      ...stateUpdate,
      lastUpdated: Date.now(),
    };

    // Update persistent fragment
    neuralBus.createPersistentFragment('checkout-state', this.checkoutState, {
      traumaEncoding: true,
      boundaryResilience: 'enhanced',
      expiryTime: 60 * 60 * 1000, // 1 hour
    });

    // Dispatch update event
    const updateEvent = new CustomEvent('voidbloom:checkout-updated', {
      detail: { state: this.checkoutState },
    });

    document.dispatchEvent(updateEvent);
  }

  /* Event handlers */

  handleCheckoutStart(event) {
    const { detail } = event;
    this.beginCheckoutTracking(detail || {});
  }

  handleStepChange(event) {
    const { detail } = event;
    if (!detail || !detail.step) return;

    this.updateCheckoutState({
      currentStep: detail.step,
      stepData: detail.data || {},
    });

    // Add to temporal buffer
    const temporalBuffer = neuralBus.retrieveFragment('temporal:checkout-sequence');
    if (temporalBuffer) {
      temporalBuffer.fragments.push({
        step: detail.step,
        timestamp: Date.now(),
        data: detail.data,
      });

      if (temporalBuffer.fragments.length > temporalBuffer.capacity) {
        temporalBuffer.fragments.shift();
      }

      neuralBus.createPersistentFragment('temporal:checkout-sequence', temporalBuffer);
    }
  }

  handleCheckoutMessage(message) {
    switch (message.type) {
      case 'checkout-step-change':
        this.updateCheckoutState({
          currentStep: message.step,
          stepData: message.data || {},
        });
        break;

      case 'checkout-completed':
        this.updateCheckoutState({
          currentStep: 'completed',
          completionData: message.data || {},
          completedAt: Date.now(),
        });

        // Dispatch completion event
        const completionEvent = new CustomEvent('voidbloom:checkout-completed', {
          detail: { state: this.checkoutState },
        });

        document.dispatchEvent(completionEvent);
        break;

      case 'checkout-error':
        this.updateCheckoutState({
          currentStep: 'error',
          errorData: message.error || {},
          errorAt: Date.now(),
        });

        // Encode trauma pattern
        const traumaPattern = {
          type: 'checkout-failure',
          timestamp: Date.now(),
          errorCode: message.error?.code,
          errorMessage: message.error?.message,
        };

        // Store trauma pattern
        const temporalBuffer = neuralBus.retrieveFragment('temporal:checkout-sequence');
        if (temporalBuffer) {
          temporalBuffer.traumaPatterns.add(JSON.stringify(traumaPattern));
          neuralBus.createPersistentFragment('temporal:checkout-sequence', temporalBuffer);
        }

        break;
    }
  }

  /* Private methods */

  observeIframeCreation() {
    // Use MutationObserver to watch for iframe creation
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type !== 'childList') continue;

        mutation.addedNodes.forEach((node) => {
          if (node.tagName === 'IFRAME' && this.isCheckoutIframe(node)) {
            this.handleCheckoutIframeTransition(node);
          }
        });
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  isCheckoutIframe(iframe) {
    // Check if this iframe is a checkout iframe
    if (!iframe.src) return false;

    const checkoutDomains = [
      'checkout.stripe.com',
      'checkout.paypal.com',
      'pay.google.com',
      'js.stripe.com',
      // Add other common checkout domains
    ];

    const src = new URL(iframe.src);
    return checkoutDomains.some((domain) => src.hostname.includes(domain));
  }

  isValidCheckoutOrigin(origin) {
    // Validate message origin for security
    const validOrigins = [
      'https://checkout.stripe.com',
      'https://checkout.paypal.com',
      'https://pay.google.com',
      // Add other valid origins
    ];

    return validOrigins.some((valid) => origin.startsWith(valid));
  }
}
