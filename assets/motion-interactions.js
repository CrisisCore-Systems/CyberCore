/**
 * CyberCore Motion
 * Utility for adding microinteractions to UI elements
 * VERSION: 1.0.0
 */

class Motion {
  constructor() {
    this.registeredEffects = new Map();
  }

  /**
   * Create a hover effect for an element
   * @param {HTMLElement} element - The target element
   * @param {Object} options - Configuration options
   * @returns {Object} Control object with remove method
   */
  hover(element, options = {}) {
    if (!element) return;

    const config = {
      scale: options.scale || 1.05,
      translateY: options.translateY || -2,
      rotation: options.rotation || 0,
      duration: options.duration || 300,
      easing: options.easing || 'cubic-bezier(0.17, 0.67, 0.83, 0.67)',
      glow: options.glow || false,
      glowColor: options.glowColor || '#9900ff',
      glowIntensity: options.glowIntensity || 0.7,
      ...options,
    };

    // Store original styles
    const originalTransform = element.style.transform || '';
    const originalTransition = element.style.transition || '';
    const originalBoxShadow = element.style.boxShadow || '';

    // Prepare transition property
    element.style.transition = `transform ${config.duration}ms ${config.easing}, box-shadow ${config.duration}ms ${config.easing}`;

    // Add event listeners
    const mouseEnter = () => {
      let transform = `scale(${config.scale})`;

      if (config.translateY) {
        transform += ` translateY(${config.translateY}px)`;
      }

      if (config.rotation) {
        transform += ` rotate(${config.rotation}deg)`;
      }

      element.style.transform = transform;

      if (config.glow) {
        const rgba = this._hexToRgba(config.glowColor, config.glowIntensity);
        element.style.boxShadow = `0 0 8px ${rgba}, 0 0 16px ${this._hexToRgba(
          config.glowColor,
          config.glowIntensity / 2
        )}`;
      }
    };

    const mouseLeave = () => {
      element.style.transform = originalTransform;
      element.style.boxShadow = originalBoxShadow;
    };

    element.addEventListener('mouseenter', mouseEnter);
    element.addEventListener('mouseleave', mouseLeave);

    // Store effect info for potential cleanup
    this.registeredEffects.set(element, {
      type: 'hover',
      cleanup: () => {
        element.removeEventListener('mouseenter', mouseEnter);
        element.removeEventListener('mouseleave', mouseLeave);
        element.style.transition = originalTransition;
        element.style.transform = originalTransform;
        element.style.boxShadow = originalBoxShadow;
      },
    });

    return {
      remove: () => this.remove(element),
    };
  }

  /**
   * Add click ripple effect to an element
   * @param {HTMLElement} element - The target element
   * @param {Object} options - Configuration options
   * @returns {Object} Control object with remove method
   */
  ripple(element, options = {}) {
    if (!element) return;

    const config = {
      color: options.color || '#9900ff',
      duration: options.duration || 600,
      size: options.size || 'auto', // auto or number in pixels
      ...options,
    };

    // Ensure element has position
    const computedStyle = window.getComputedStyle(element);
    if (computedStyle.position === 'static') {
      element.style.position = 'relative';
    }

    // Ensure element has overflow hidden
    element.style.overflow = 'hidden';

    const clickHandler = (e) => {
      // Create ripple element
      const ripple = document.createElement('span');
      ripple.classList.add('motion-ripple');

      // Position the ripple where clicked
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate size
      const size = config.size === 'auto' ? Math.max(rect.width, rect.height) * 2 : config.size;

      // Set ripple styles
      ripple.style.position = 'absolute';
      ripple.style.top = `${y - size / 2}px`;
      ripple.style.left = `${x - size / 2}px`;
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.borderRadius = '50%';
      ripple.style.backgroundColor = config.color;
      ripple.style.pointerEvents = 'none';
      ripple.style.opacity = '0.4';
      ripple.style.transform = 'scale(0)';
      ripple.style.transition = `transform ${config.duration}ms ease-out, opacity ${config.duration}ms ease-out`;

      // Add ripple to element
      element.appendChild(ripple);

      // Trigger animation
      setTimeout(() => {
        ripple.style.transform = 'scale(1)';
        ripple.style.opacity = '0';
      }, 10);

      // Remove ripple after animation
      setTimeout(() => {
        ripple.remove();
      }, config.duration);
    };

    element.addEventListener('click', clickHandler);

    // Store effect info for potential cleanup
    this.registeredEffects.set(element, {
      type: 'ripple',
      cleanup: () => {
        element.removeEventListener('click', clickHandler);
        const ripples = element.querySelectorAll('.motion-ripple');
        ripples.forEach((ripple) => ripple.remove());
      },
    });

    return {
      remove: () => this.remove(element),
    };
  }

  /**
   * Add typing effect to text element
   * @param {HTMLElement} element - The target element
   * @param {string} text - Text to type
   * @param {Object} options - Configuration options
   * @returns {Object} Control object with remove and complete methods
   */
  typeText(element, text, options = {}) {
    if (!element) return;

    const config = {
      speed: options.speed || 50, // ms per character
      delay: options.delay || 0,
      cursor: options.cursor !== undefined ? options.cursor : true,
      cursorChar: options.cursorChar || '|',
      cursorBlink: options.cursorBlink !== undefined ? options.cursorBlink : true,
      onComplete: options.onComplete || (() => {}),
      ...options,
    };

    // Store original content
    const originalContent = element.innerHTML;

    // Clear content
    element.textContent = '';

    // Add cursor element if enabled
    let cursorElement;
    if (config.cursor) {
      cursorElement = document.createElement('span');
      cursorElement.classList.add('typing-cursor');
      cursorElement.textContent = config.cursorChar;
      cursorElement.style.display = 'inline-block';

      if (config.cursorBlink) {
        cursorElement.style.animation = 'cursor-blink 1s step-end infinite';

        // Add style if not already present
        if (!document.querySelector('style#motion-typing-style')) {
          const style = document.createElement('style');
          style.id = 'motion-typing-style';
          style.textContent = `
            @keyframes cursor-blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
            }
          `;
          document.head.appendChild(style);
        }
      }

      element.appendChild(cursorElement);
    }

    let isRunning = true;
    let charIndex = 0;
    let typingTimeout;

    const type = () => {
      if (!isRunning) return;

      if (charIndex < text.length) {
        // Create text node and insert before cursor
        const char = document.createTextNode(text[charIndex]);
        if (cursorElement) {
          element.insertBefore(char, cursorElement);
        } else {
          element.appendChild(char);
        }

        charIndex++;
        typingTimeout = setTimeout(type, config.speed);
      } else {
        config.onComplete();
      }
    };

    // Start typing after delay
    setTimeout(type, config.delay);

    // Store effect info for potential cleanup
    this.registeredEffects.set(element, {
      type: 'typeText',
      cleanup: () => {
        isRunning = false;
        if (typingTimeout) clearTimeout(typingTimeout);
        element.innerHTML = originalContent;
      },
    });

    return {
      remove: () => this.remove(element),
      complete: () => {
        isRunning = false;
        if (typingTimeout) clearTimeout(typingTimeout);
        element.textContent = text;
        if (cursorElement) {
          element.appendChild(cursorElement);
        }
        config.onComplete();
      },
    };
  }

  /**
   * Creates a scanning effect on an element
   * @param {HTMLElement} element - The target element
   * @param {Object} options - Configuration options
   * @returns {Object} Control object with remove method
   */
  scanEffect(element, options = {}) {
    if (!element) return;

    const config = {
      color: options.color || '#00ffff',
      duration: options.duration || 2000,
      lineHeight: options.lineHeight || 2,
      opacity: options.opacity || 0.6,
      ...options,
    };

    // Ensure element has position
    const computedStyle = window.getComputedStyle(element);
    if (computedStyle.position === 'static') {
      element.style.position = 'relative';
    }

    // Create scan line
    const scanLine = document.createElement('div');
    scanLine.className = 'cyber-scan-line';
    scanLine.style.position = 'absolute';
    scanLine.style.left = '0';
    scanLine.style.right = '0';
    scanLine.style.height = `${config.lineHeight}px`;
    scanLine.style.background = `linear-gradient(to right,
      transparent,
      ${config.color} 20%,
      ${config.color} 80%,
      transparent
    )`;
    scanLine.style.opacity = config.opacity.toString();
    scanLine.style.pointerEvents = 'none';
    scanLine.style.zIndex = '2';
    scanLine.style.animation = `cyber-scan-line ${config.duration}ms linear infinite`;

    // Add scan animation style if not present
    if (!document.querySelector('style#motion-scan-style')) {
      const style = document.createElement('style');
      style.id = 'motion-scan-style';
      style.textContent = `
        @keyframes cyber-scan-line {
          0% { top: -5px; }
          100% { top: 100%; }
        }
      `;
      document.head.appendChild(style);
    }

    // Add scan line to element
    element.appendChild(scanLine);

    // Store effect info for potential cleanup
    this.registeredEffects.set(element, {
      type: 'scanEffect',
      cleanup: () => {
        scanLine.remove();
      },
    });

    return {
      remove: () => this.remove(element),
    };
  }

  /**
   * Creates a glitch slice effect on text
   * @param {HTMLElement} element - The target element
   * @param {Object} options - Configuration options
   * @returns {Object} Control object with methods
   */
  glitchText(element, options = {}) {
    if (!element) return;

    const config = {
      active: options.active !== undefined ? options.active : true,
      intensity: options.intensity || 'medium',
      layers: options.layers || 2,
      colors: options.colors || ['#9900ff', '#00ffff'],
      ...options,
    };

    // Store original content and styles
    const originalContent = element.textContent;
    const originalPosition = element.style.position;

    // Set required styles
    element.style.position = originalPosition === 'static' ? 'relative' : originalPosition;

    // Create glitch layers
    const layers = [];
    for (let i = 0; i < config.layers; i++) {
      const layer = document.createElement('div');
      layer.className = `glitch-layer glitch-layer-${i + 1}`;
      layer.textContent = originalContent;
      layer.style.position = 'absolute';
      layer.style.top = '0';
      layer.style.left = '0';
      layer.style.width = '100%';
      layer.style.height = '100%';
      layer.style.color = config.colors[i % config.colors.length];
      layer.style.zIndex = '-1';
      layer.style.opacity = '0';
      layer.style.pointerEvents = 'none';
      element.appendChild(layer);
      layers.push(layer);
    }

    // Add glitch style if not present
    const styleId = 'motion-glitch-text-style';
    if (!document.querySelector(`style#${styleId}`)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .glitch-active .glitch-layer-1 {
          animation: glitch-text-1 3.5s infinite linear alternate-reverse;
          clip-path: inset(0 0 0 0);
        }
        .glitch-active .glitch-layer-2 {
          animation: glitch-text-2 2.5s infinite linear alternate-reverse;
          clip-path: inset(0 0 0 0);
        }
        @keyframes glitch-text-1 {
          0% {
            opacity: 0;
            transform: translateX(-2px);
            clip-path: inset(0 0 0 0);
          }
          20% {
            opacity: 0.2;
            transform: translateX(2px);
            clip-path: inset(20% 0 20% 0);
          }
          40% {
            opacity: 0.2;
            transform: translateX(-2px);
            clip-path: inset(60% 0 1% 0);
          }
          60% {
            opacity: 0;
            transform: translateX(0);
            clip-path: inset(0 0 0 0);
          }
          80% {
            opacity: 0.2;
            transform: translateX(4px);
            clip-path: inset(10% 0 40% 0);
          }
          100% {
            opacity: 0;
            transform: translateX(-3px);
            clip-path: inset(80% 0 5% 0);
          }
        }
        @keyframes glitch-text-2 {
          0% {
            opacity: 0;
            transform: translateX(3px);
            clip-path: inset(50% 0 0 0);
          }
          25% {
            opacity: 0.1;
            transform: translateX(-4px);
            clip-path: inset(0 0 40% 0);
          }
          50% {
            opacity: 0.1;
            transform: translateX(3px);
            clip-path: inset(30% 0 20% 0);
          }
          75% {
            opacity: 0;
            transform: translateX(-2px);
            clip-path: inset(60% 0 30% 0);
          }
          100% {
            opacity: 0.1;
            transform: translateX(0);
            clip-path: inset(20% 0 60% 0);
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Set active state
    const setActive = (active) => {
      if (active) {
        element.classList.add('glitch-active');
      } else {
        element.classList.remove('glitch-active');
      }
    };

    // Initial state
    setActive(config.active);

    // Store effect info for potential cleanup
    this.registeredEffects.set(element, {
      type: 'glitchText',
      cleanup: () => {
        // Remove added elements
        layers.forEach((layer) => layer.remove());
        element.classList.remove('glitch-active');
        element.style.position = originalPosition;
      },
    });

    return {
      remove: () => this.remove(element),
      setActive: setActive,
    };
  }

  /**
   * Create a cyber pulse effect (expanding glow)
   * @param {HTMLElement} element - The target element
   * @param {Object} options - Configuration options
   * @returns {Object} Control object with methods
   */
  pulse(element, options = {}) {
    if (!element) return;

    const config = {
      color: options.color || '#9900ff',
      duration: options.duration || 2000,
      size: options.size || 1.15,
      glow: options.glow !== undefined ? options.glow : true,
      glowColor: options.glowColor || options.color || '#9900ff',
      glowIntensity: options.glowIntensity || 0.7,
      continuous: options.continuous !== undefined ? options.continuous : true,
      ...options,
    };

    // Store original styles
    const originalTransition = element.style.transition;
    const originalTransform = element.style.transform;
    const originalBoxShadow = element.style.boxShadow;

    // Set up animation style
    if (config.continuous) {
      // Add pulse style if not present
      const styleId = 'motion-pulse-style';
      if (!document.querySelector(`style#${styleId}`)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          @keyframes cyber-pulse {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 0 0 rgba(153, 0, 255, 0);
            }
            50% {
              transform: scale(${config.size});
              box-shadow: 0 0 20px rgba(153, 0, 255, ${config.glowIntensity});
            }
          }
          .cyber-pulse-active {
            animation: cyber-pulse ${config.duration}ms cubic-bezier(0.33, 0, 0.67, 1) infinite;
          }
        `;
        document.head.appendChild(style);
      }

      // Apply animation
      element.classList.add('cyber-pulse-active');

      // Update animation for specific color
      const computedStyle = window.getComputedStyle(element);
      const keyframes = [
        { transform: 'scale(1)', boxShadow: '0 0 0 rgba(153, 0, 255, 0)' },
        {
          transform: `scale(${config.size})`,
          boxShadow: `0 0 20px ${this._hexToRgba(config.glowColor, config.glowIntensity)}`,
        },
        { transform: 'scale(1)', boxShadow: '0 0 0 rgba(153, 0, 255, 0)' },
      ];

      element.animate(keyframes, {
        duration: config.duration,
        iterations: Infinity,
        easing: 'cubic-bezier(0.33, 0, 0.67, 1)',
      });
    }

    // Store effect info for potential cleanup
    this.registeredEffects.set(element, {
      type: 'pulse',
      cleanup: () => {
        element.classList.remove('cyber-pulse-active');
        element.style.transition = originalTransition;
        element.style.transform = originalTransform;
        element.style.boxShadow = originalBoxShadow;

        // Stop any running animations
        element.getAnimations().forEach((animation) => animation.cancel());
      },
    });

    // Function to trigger a single pulse
    const triggerPulse = () => {
      if (config.continuous) return Promise.resolve(); // No need for single pulse

      return new Promise((resolve) => {
        // Apply transition
        element.style.transition = `transform ${
          config.duration / 2
        }ms cubic-bezier(0.33, 0, 0.67, 1),
                                  box-shadow ${
                                    config.duration / 2
                                  }ms cubic-bezier(0.33, 0, 0.67, 1)`;

        // Pulse out
        element.style.transform = `scale(${config.size})`;
        if (config.glow) {
          element.style.boxShadow = `0 0 20px ${this._hexToRgba(
            config.glowColor,
            config.glowIntensity
          )}`;
        }

        // Pulse in after half duration
        setTimeout(() => {
          element.style.transform = originalTransform || 'scale(1)';
          element.style.boxShadow = originalBoxShadow || 'none';

          // Resolve after full duration
          setTimeout(() => {
            resolve();
          }, config.duration / 2);
        }, config.duration / 2);
      });
    };

    return {
      remove: () => this.remove(element),
      triggerPulse,
    };
  }

  /**
   * Remove effect from element
   * @param {HTMLElement} element - The element to remove effects from
   */
  remove(element) {
    if (this.registeredEffects.has(element)) {
      const effect = this.registeredEffects.get(element);
      effect.cleanup();
      this.registeredEffects.delete(element);
    }
  }

  /**
   * Convert hex color to rgba
   * @private
   * @param {string} hex - Hex color code
   * @param {number} alpha - Alpha transparency value
   * @returns {string} RGBA color string
   */
  _hexToRgba(hex, alpha = 1) {
    // Handle shorthand hex
    if (hex.length === 4) {
      hex = hex.replace(/([0-9a-f])/gi, '$1$1');
    }

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}

export default new Motion();
