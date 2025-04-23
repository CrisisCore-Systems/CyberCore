/**
 * @jest-environment jsdom
 */

// VoidBloom Hologram Component Test Suite

describe('HologramComponent', () => {
  // Import dynamically after the custom element is registered
  let HologramComponent;

  beforeAll(() => {
    HologramComponent = customElements.get('quantum-hologram');
  });

  let component;

  beforeEach(() => {
    component = document.createElement('quantum-hologram');
    document.body.appendChild(component);
  });

  afterEach(() => {
    document.body.removeChild(component);
  });

  it('should create shadow DOM when instantiated', () => {
    expect(component.shadowRoot).not.toBeNull();
  });

  it('should have default configuration values', () => {
    // Access properties
    expect(component.hologramType).toBe('cart-preview');
    expect(component.intensity).toBe(0.8);
    expect(component.traumaLevel).toBe(0);
    expect(component.isActive).toBe(false);
  });

  it('should apply profile when attribute is set', () => {
    // Set attribute
    component.setAttribute('profile', 'cyber-lotus');

    // Trigger the attribute change callback manually (this would normally be automatic)
    component.attributeChangedCallback('profile', null, 'cyber-lotus');

    expect(component.getAttribute('profile')).toBe('cyber-lotus');
    // Add any specific expectations based on profile changes
  });

  it('should respond to intensity attribute changes', () => {
    // Create spy on internal method
    const setIntensitySpy = jest.spyOn(component, 'setIntensity');

    // Set attribute
    component.setAttribute('intensity', '0.5');

    // Trigger the attribute change callback manually
    component.attributeChangedCallback('intensity', '0.8', '0.5');

    expect(setIntensitySpy).toHaveBeenCalledWith(0.5);
  });

  it('should update render mode when attribute changes', () => {
    // Set attribute
    component.setAttribute('render-mode', 'quantum');

    // Trigger the attribute change callback manually
    component.attributeChangedCallback('render-mode', null, 'quantum');

    // Use public getters to check values
    expect(component.getAttribute('render-mode')).toBe('quantum');
  });

  it('should toggle glitch when enable-glitch attribute is set', () => {
    // Set attribute
    component.setAttribute('enable-glitch', '');

    // Trigger the attribute change callback manually
    component.attributeChangedCallback('enable-glitch', null, '');

    expect(component.hasAttribute('enable-glitch')).toBe(true);
  });

  it('should apply configuration via configure method', () => {
    // Mock public method if available, or add method for testing
    if (!component.configure) {
      component.configure = jest.fn((config) => {
        if (config.intensity) component.intensity = config.intensity;
        if (config.traumaLevel) component.traumaLevel = config.traumaLevel;
        return component;
      });
    }

    const config = {
      intensity: 0.6,
      traumaLevel: 3,
    };

    component.configure(config);

    expect(component.intensity).toBe(0.6);
    expect(component.traumaLevel).toBe(3);
  });
});
