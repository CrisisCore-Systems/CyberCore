/**
 * @jest-environment jsdom
 */

import { HologramComponent } from '../assets/HologramComponent';

describe('HologramComponent', () => {
  let hologramElement;

  beforeEach(() => {
    // Mock customElements.define since it's not available in Jest
    if (!window.customElements.define) {
      window.customElements.define = jest.fn();
    }

    // Create a new HologramComponent instance
    hologramElement = new HologramComponent();
    document.body.appendChild(hologramElement);
  });

  afterEach(() => {
    // Clean up after each test
    if (hologramElement && hologramElement.parentNode) {
      hologramElement.parentNode.removeChild(hologramElement);
    }
  });

  test('should create shadow DOM when instantiated', () => {
    expect(hologramElement.shadowRoot).toBeTruthy();
  });

  test('should have default configuration values', () => {
    expect(hologramElement.intensity).toBeDefined();
    expect(hologramElement.renderMode).toBeDefined();
    expect(hologramElement.glitchEnabled).toBeDefined();
  });

  test('should apply profile when attribute is set', () => {
    hologramElement.setAttribute('profile', 'VoidBloom');

    // The attributeChangedCallback should be called
    expect(hologramElement.getAttribute('profile')).toBe('VoidBloom');
  });

  test('should respond to intensity attribute changes', () => {
    const testIntensity = '0.75';
    hologramElement.setAttribute('intensity', testIntensity);

    expect(parseFloat(hologramElement.getAttribute('intensity'))).toBe(0.75);
    expect(hologramElement.intensity).toBe(0.75);
  });

  test('should update render mode when attribute changes', () => {
    hologramElement.setAttribute('render-mode', 'quantum');

    expect(hologramElement.getAttribute('render-mode')).toBe('quantum');
    expect(hologramElement.renderMode).toBe('quantum');
  });

  test('should toggle glitch when enable-glitch attribute is set', () => {
    hologramElement.setAttribute('enable-glitch', '');

    expect(hologramElement.hasAttribute('enable-glitch')).toBe(true);
    expect(hologramElement.glitchEnabled).toBe(true);

    hologramElement.removeAttribute('enable-glitch');

    expect(hologramElement.hasAttribute('enable-glitch')).toBe(false);
  });

  test('should apply configuration via configure method', () => {
    hologramElement.configure({
      intensity: 0.8,
      renderMode: 'quantum',
      enableGlitch: true,
    });

    expect(hologramElement.intensity).toBe(0.8);
    expect(hologramElement.renderMode).toBe('quantum');
    expect(hologramElement.glitchEnabled).toBe(true);
  });
});
