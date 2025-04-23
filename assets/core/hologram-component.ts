/**
 * VoidBloom Hologram Component
 * Custom element for quantum-holographic memory visualization
 */

export interface HologramComponentOptions {
  renderMode?: 'standard' | 'quantum' | 'trauma';
  profile?: string;
  intensity?: number;
  traumaLevel?: number;
  dataSource?: string;
  interactive?: boolean;
  onInteraction?: (event: CustomEvent) => void;
}

export class HologramComponent extends HTMLElement {
  // Public properties for interface implementation
  public hologramType: string = 'cart-preview';
  public intensity: number = 0.8;
  public traumaLevel: number = 0;
  public isActive: boolean = false;
  public dataSource: string | null = null;
  
  // Private properties
  private canvas: HTMLCanvasElement | null = null;
  private renderer: any = null;
  private options: HologramComponentOptions = {};
  private observers: Array<MutationObserver> = [];
  private eventListeners: Record<string, EventListener> = {};
  
  // Define observed attributes
  static get observedAttributes() {
    return ['intensity', 'trauma-level', 'profile', 'render-mode', 'enable-glitch'];
  }
  
  /**
   * Constructor - called when element is created
   */
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  
  /**
   * Connected callback - called when element is added to DOM
   */
  connectedCallback() {
    this.initialize();
  }
  
  /**
   * Disconnected callback - called when element is removed from DOM
   */
  disconnectedCallback() {
    this.disconnect();
  }
  
  /**
   * Attribute changed callback - called when an attribute is changed
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    
    switch (name) {
      case 'intensity':
        this.setIntensity(parseFloat(newValue || '0.8'));
        break;
        
      case 'trauma-level':
        this.applyTraumaEncoding(parseInt(newValue || '0', 10));
        break;
        
      case 'profile':
        this.applyProfile(newValue || 'default');
        break;
        
      case 'render-mode':
        this.options.renderMode = newValue as any || 'standard';
        this.render();
        break;
        
      case 'enable-glitch':
        this.applyGlitchEffect(newValue !== null);
        break;
    }
  }
  
  /**
   * Initialize the component
   * @param options - Configuration options
   */
  public initialize(options?: HologramComponentOptions): void {
    this.options = {
      ...this.options,
      ...options
    };
    
    // Create canvas
    this.setupCanvas();
    
    // Set initial state
    this.isActive = true;
    this.intensity = this.options.intensity || 0.8;
    this.traumaLevel = this.options.traumaLevel || 0;
    
    // Apply initial profile if specified
    if (this.options.profile) {
      this.applyProfile(this.options.profile);
    }
    
    // Connect data source if specified
    if (this.options.dataSource) {
      this.connectDataSource(this.options.dataSource);
    }
    
    // Initialize resize observer
    this.initResizeObserver();
    
    // Initialize interaction events if interactive
    if (this.options.interactive) {
      this.initInteractionEvents();
    }
    
    // Initial render
    this.render();
  }
  
  /**
   * Set up the canvas element
   */
  private setupCanvas(): void {
    // Create canvas element
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.clientWidth || 300;
    this.canvas.height = this.clientHeight || 300;
    this.canvas.className = 'hologram-canvas';
    
    // Create container for canvas
    const container = document.createElement('div');
    container.className = 'hologram-container';
    container.appendChild(this.canvas);
    
    // Add default styles
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      
      .hologram-container {
        position: relative;
        width: 100%;
        height: 100%;
      }
      
      .hologram-canvas {
        display: block;
        width: 100%;
        height: 100%;
        transition: filter 0.3s ease;
      }
      
      :host([enable-glitch]) .hologram-canvas {
        filter: url(#hologram-glitch);
      }
      
      .hologram-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        background: radial-gradient(circle, rgba(0,255,255,0.1) 0%, rgba(0,0,0,0) 70%);
        mix-blend-mode: screen;
      }
    `;
    
    // Add glitch filter SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.width = '0';
    svg.style.height = '0';
    svg.innerHTML = `
      <defs>
        <filter id="hologram-glitch">
          <feFlood flood-color="#00ffff" flood-opacity="0.3" result="flood"></feFlood>
          <feComposite in="flood" in2="SourceGraphic" operator="in" result="mask"></feComposite>
          <feMorphology in="mask" operator="dilate" radius="1" result="dilated"></feMorphology>
          <feOffset in="dilated" dx="-2" dy="0" result="offset1"></feOffset>
          <feOffset in="dilated" dx="2" dy="0" result="offset2"></feOffset>
          <feOffset in="dilated" dx="0" dy="0" result="offset3"></feOffset>
          <feComposite in="offset1" in2="offset2" operator="arithmetic" k1="0.5" k2="0.5" result="merge"></feComposite>
          <feComposite in="merge" in2="offset3" operator="arithmetic" k1="0.5" k2="0.5" result="merged"></feComposite>
          <feDisplacementMap in="SourceGraphic" in2="merged" scale="10" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
        </filter>
      </defs>
    `;
    
    // Add overlay element
    const overlay = document.createElement('div');
    overlay.className = 'hologram-overlay';
    
    // Add everything to shadow DOM
    this.shadowRoot?.appendChild(style);
    this.shadowRoot?.appendChild(svg);
    this.shadowRoot?.appendChild(container);
    container.appendChild(overlay);
  }
  
  /**
   * Initialize resize observer
   */
  private initResizeObserver(): void {
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(entries => {
        for (const entry of entries) {
          if (entry.target === this && this.canvas) {
            // Update canvas size
            this.canvas.width = entry.contentRect.width;
            this.canvas.height = entry.contentRect.height;
            
            // Update renderer if available
            if (this.renderer && this.renderer.resize) {
              this.renderer.resize(this.canvas.width, this.canvas.height);
            }
          }
        }
      });
      
      observer.observe(this);
      this.observers.push(observer);
    }
  }
  
  /**
   * Initialize interaction events
   */
  private initInteractionEvents(): void {
    const interactionHandler = (event: MouseEvent) => {
      if (!this.isActive) return;
      
      // Calculate relative position
      const rect = this.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      
      // Create custom event
      const customEvent = new CustomEvent('hologram-interaction', {
        bubbles: true,
        composed: true,
        detail: {
          x,
          y,
          type: event.type,
          originalEvent: event
        }
      });
      
      // Dispatch event
      this.dispatchEvent(customEvent);
      
      // Call callback if provided
      if (this.options.onInteraction) {
        this.options.onInteraction(customEvent);
      }
    };
    
    // Add event listeners
    this.addEventListener('mousemove', interactionHandler);
    this.addEventListener('click', interactionHandler);
    
    // Store for cleanup
    this.eventListeners.interaction = interactionHandler;
  }
  
  /**
   * Render the hologram
   */
  public render(): void {
    if (!this.isActive || !this.canvas) return;
    
    // Initialize renderer if not already
    if (!this.renderer) {
      this.initializeRenderer();
    }
    
    // Apply trauma encoding if trauma level is set
    if (this.traumaLevel > 0) {
      this.applyTraumaEncoding(this.traumaLevel);
    }
  }
  
  /**
   * Initialize renderer
   */
  private initializeRenderer(): void {
    // Try to use WebGL renderer if available
    try {
      // Check if HologramRenderer is available in window
      if (window.HologramRenderer) {
        this.renderer = window.HologramRenderer;
        this.renderer.initialize(this.canvas!, {
          intensity: this.intensity,
          traumaResponsive: true
        });
      } else {
        // Fallback to 2D canvas
        this.initializeCanvas2D();
      }
    } catch (error) {
      console.error('Error initializing renderer:', error);
      
      // Fallback to 2D canvas
      this.initializeCanvas2D();
    }
  }
  
  /**
   * Initialize 2D canvas as fallback
   */
  private initializeCanvas2D(): void {
    if (!this.canvas) return;
    
    const ctx = this.canvas.getContext('2d');
    
    if (!ctx) {
      console.error('Could not get 2D context');
      return;
    }
    
    // Simple 2D renderer
    this.renderer = {
      render: () => {
        if (!ctx || !this.canvas) return;
        
        // Clear canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw hologram effect
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(this.canvas.width, this.canvas.height) * 0.4;
        
        // Create gradient
        const gradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, radius
        );
        
        gradient.addColorStop(0, 'rgba(0, 255, 255, 0.6)');
        gradient.addColorStop(0.7, 'rgba(0, 64, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 0, 64, 0)');
        
        // Draw circle
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Apply glitch effect if trauma level is high enough
        if (this.traumaLevel > 5) {
          this.apply2DGlitchEffect(ctx);
        }
      },
      
      resize: (width: number, height: number) => {
        if (!this.canvas) return;
        
        this.canvas.width = width;
        this.canvas.height = height;
      }
    };
    
    // Start animation loop
    const animate = () => {
      if (!this.isActive) return;
      
      this.renderer.render();
      requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  /**
   * Apply 2D glitch effect
   * @param ctx - 2D rendering context
   */
  private apply2DGlitchEffect(ctx: CanvasRenderingContext2D): void {
    if (!this.canvas) return;
    
    // Save current image data
    const imageData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    
    // Apply glitch effect - displace random horizontal slices
    const sliceHeight = 10;
    const numSlices = Math.floor(this.canvas.height / sliceHeight);
    const glitchIntensity = this.traumaLevel / 10;
    
    for (let i = 0; i < numSlices; i++) {
      if (Math.random() < glitchIntensity * 0.3) {
        const y = i * sliceHeight;
        const displacement = Math.floor(Math.random() * 20 * glitchIntensity) - 10 * glitchIntensity;
        
        if (displacement !== 0) {
          // Copy and displace slice
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = this.canvas.width;
          tempCanvas.height = sliceHeight;
          
          const tempCtx = tempCanvas.getContext('2d');
          if (!tempCtx) continue;
          
          tempCtx.drawImage(
            this.canvas,
            0, y, this.canvas.width, sliceHeight,
            0, 0, this.canvas.width, sliceHeight
          );
          
          // Clear original slice
          ctx.clearRect(0, y, this.canvas.width, sliceHeight);
          
          // Draw displaced slice
          ctx.drawImage(
            tempCanvas,
            0, 0, this.canvas.width, sliceHeight,
            displacement, y, this.canvas.width, sliceHeight
          );
        }
      }
    }
    
    // Color channel shifting for high trauma levels
    if (this.traumaLevel > 7) {
      const imageData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        // Shift red channel
        if (i + 4 < data.length) {
          data[i] = data[i + 4];
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
    }
  }
  
  /**
   * Set hologram intensity
   * @param value - Intensity value (0-1)
   */
  public setIntensity(value: number): void {
    this.intensity = Math.max(0, Math.min(1, value));
    
    // Update renderer if available
    if (this.renderer && typeof this.renderer.setIntensity === 'function') {
      this.renderer.setIntensity(this.intensity);
    }
    
    // Update attribute
    this.setAttribute('intensity', String(this.intensity));
    
    // Trigger render
    this.render();
  }
  
  /**
   * Apply trauma encoding to the hologram
   * @param level - Trauma level (0-10)
   */
  public applyTraumaEncoding(level: number): void {
    this.traumaLevel = Math.max(0, Math.min(10, level));
    
    // Update renderer if available
    if (this.renderer && typeof this.renderer.applyTraumaEncoding === 'function') {
      this.renderer.applyTraumaEncoding(this.traumaLevel);
    }
    
    // Update attribute
    this.setAttribute('trauma-level', String(this.traumaLevel));
    
    // Update host element
    if (this.traumaLevel > 5) {
      this.setAttribute('enable-glitch', '');
    } else {
      this.removeAttribute('enable-glitch');
    }
    
    // Apply CSS class based on trauma level
    this.classList.remove('trauma-low', 'trauma-medium', 'trauma-high', 'trauma-extreme');
    
    if (this.traumaLevel > 0) {
      if (this.traumaLevel <= 3) {
        this.classList.add('trauma-low');
      } else if (this.traumaLevel <= 6) {
        this.classList.add('trauma-medium');
      } else if (this.traumaLevel <= 8) {
        this.classList.add('trauma-high');
      } else {
        this.classList.add('trauma-extreme');
      }
    }
    
    // Trigger render
    this.render();
  }
  
  /**
   * Apply glitch effect to the hologram
   * @param enable - Whether to enable glitch effect
   */
  public applyGlitchEffect(enable: boolean): void {
    if (enable) {
      this.setAttribute('enable-glitch', '');
    } else {
      this.removeAttribute('enable-glitch');
    }
    
    // Trigger render
    this.render();
  }
  
  /**
   * Apply profile to the hologram
   * @param profileName - Profile name
   */
  public applyProfile(profileName: string): void {
    // Store profile name
    this.options.profile = profileName;
    
    // Update attribute
    this.setAttribute('profile', profileName);
    
    // Update host element
    this.classList.remove('profile-default', 'profile-cyber', 'profile-void', 'profile-trauma');
    this.classList.add(`profile-${profileName}`);
    
    // Trigger render
    this.render();
  }
  
  /**
   * Connect to external data source
   * @param source - Data source URL or identifier
   */
  public connectDataSource(source: string): void {
    this.dataSource = source;
    
    // Update attribute
    this.setAttribute('data-source', source);
    
    // TODO: Implement data source connection
    
    // Trigger render
    this.render();
  }
  
  /**
   * Disconnect and release resources
   */
  public disconnect(): void {
    // Stop active state
    this.isActive = false;
    
    // Clean up observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    
    // Remove event listeners
    Object.entries(this.eventListeners).forEach(([name, listener]) => {
      this.removeEventListener(name, listener);
    });
    this.eventListeners = {};
    
    // Release renderer
    if (this.renderer && typeof this.renderer.dispose === 'function') {
      this.renderer.dispose();
    }
    this.renderer = null;
    
    // Release canvas
    this.canvas = null;
  }
  
  /**
   * Configure hologram with options
   * @param options - Configuration options
   * @returns this for method chaining
   */
  public configure(options: HologramComponentOptions): HologramComponent {
    this.options = {
      ...this.options,
      ...options
    };
    
    // Apply options
    if (options.intensity !== undefined) {
      this.setIntensity(options.intensity);
    }
    
    if (options.traumaLevel !== undefined) {
      this.applyTraumaEncoding(options.traumaLevel);
    }
    
    if (options.profile) {
      this.applyProfile(options.profile);
    }
    
    if (options.dataSource) {
      this.connectDataSource(options.dataSource);
    }
    
    // Trigger render
    this.render();
    
    return this;
  }
}

// Define window type extension for HologramRenderer
declare global {
  interface Window {
    HologramRenderer?: any;
  }
}

// Export the class for registration
export const CartPreviewHologram = HologramComponent;
