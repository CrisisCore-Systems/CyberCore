/**
 * EVENT-UTILS.JS
 * Performance optimizations for DOM events
 * @Version: 1.0.0
 * @Optimized: April 2025
 */

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {boolean} immediate - Whether to invoke the function immediately
 * @returns {Function} The debounced function
 */
function debounce(func, wait = 100, immediate = false) {
  let timeout;

  return function executedFunction(...args) {
    const context = this;

    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}

/**
 * Creates a throttled function that only invokes func at most once per wait milliseconds.
 *
 * @param {Function} func - The function to throttle
 * @param {number} wait - The number of milliseconds to throttle invocations to
 * @returns {Function} The throttled function
 */
function throttle(func, wait = 100) {
  let timeout = null;
  let lastCall = 0;

  return function executedFunction(...args) {
    const context = this;
    const now = Date.now();
    const remaining = wait - (now - lastCall);

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      lastCall = now;
      func.apply(context, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        lastCall = Date.now();
        timeout = null;
        func.apply(context, args);
      }, remaining);
    }
  };
}

/**
 * Adds an event listener with automatic debouncing for certain event types
 *
 * @param {Element} element - The DOM element to attach the listener to
 * @param {string} eventType - The event type to listen for
 * @param {Function} callback - The callback function
 * @param {Object} options - Additional options (debounceTime, throttleTime, passive, once, etc.)
 * @returns {Function} A function to remove the event listener
 */
function addOptimizedEventListener(element, eventType, callback, options = {}) {
  const {
    debounceTime = 100,
    throttleTime = 100,
    useDebounce = false,
    useThrottle = false,
    ...listenerOptions
  } = options;

  // Events that should be automatically optimized if not specified
  const scrollEvents = ['scroll', 'touchmove', 'wheel'];
  const resizeEvents = ['resize'];
  const mouseEvents = ['mousemove', 'pointermove'];

  // Determine if this event type should be debounced or throttled by default
  const shouldDebounce =
    useDebounce ||
    (options.debounceTime !== undefined && !useThrottle) ||
    (scrollEvents.includes(eventType) &&
      options.debounceTime === undefined &&
      options.throttleTime === undefined);

  const shouldThrottle =
    useThrottle ||
    (options.throttleTime !== undefined && !useDebounce) ||
    (mouseEvents.includes(eventType) &&
      options.debounceTime === undefined &&
      options.throttleTime === undefined) ||
    (resizeEvents.includes(eventType) &&
      options.debounceTime === undefined &&
      options.throttleTime === undefined);

  // Create optimized handler based on event type
  let optimizedCallback = callback;

  if (shouldDebounce) {
    optimizedCallback = debounce(callback, debounceTime);
  } else if (shouldThrottle) {
    optimizedCallback = throttle(callback, throttleTime);
  }

  // Apply passive option by default for known events that benefit from it
  if (scrollEvents.includes(eventType) && listenerOptions.passive === undefined) {
    listenerOptions.passive = true;
  }

  // Add the event listener
  element.addEventListener(eventType, optimizedCallback, listenerOptions);

  // Return a function to remove the listener
  return () => {
    element.removeEventListener(eventType, optimizedCallback, listenerOptions);
  };
}

// Expose utilities globally
window.VoidBloomEvents = {
  debounce,
  throttle,
  addOptimizedEventListener,
};
