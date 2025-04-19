# CyberCore Documentation

## Overview

CyberCore is an advanced e-commerce enhancement framework with quantum-themed features. This documentation provides information about the architecture, components, and usage of the CyberCore system.

Version: 2.0.0
Last Updated: April 19, 2025

## Architecture

CyberCore follows a modular architecture designed for performance, extensibility, and maintainability. The core components are organized as follows:

```
CyberCore
├── Core Components
│   ├── HologramComponent (Web Component)
│   ├── EnhancedCart
│   ├── HologramRenderer (WebGL)
│   ├── NeuralBus (Event System)
│   └── Quantum Worker (Background Processing)
├── CSS System
│   └── Quantum CSS Variables
└── Build System
    ├── TypeScript Integration
    ├── Webpack Bundling
    └── Jest Testing Framework
```

### Key Architectural Features

1. **Web Components**: Custom Elements with Shadow DOM for encapsulation and reusability
2. **TypeScript Integration**: Type safety and better tooling
3. **Web Workers**: Offloaded computation for intensive operations
4. **WebGL Rendering**: Three.js for optimized 3D visualization
5. **CSS Custom Properties**: Theme system with profile support
6. **Event-Driven Communication**: Decoupled components via NeuralBus

## Installation

To install CyberCore, add the following to your package.json:

```json
{
  "dependencies": {
    "cyber-core": "^2.0.0",
    "three": "^0.162.0"
  }
}
```

Then run:

```bash
npm install
```

## Usage

### Basic Integration

Include the CyberCore bundle in your HTML:

```html
<script src="path/to/cyber-core.js"></script>
<link rel="stylesheet" href="path/to/quantum-featured.css" />

<!-- Add auto-initialization -->
<body data-cybercore-auto-init data-profile="CyberLotus">
  <!-- Your content here -->
</body>
```

### Manual Initialization

To manually initialize CyberCore:

```javascript
// Initialize with default settings
CyberCore.initialize();

// Or with custom configuration
CyberCore.initialize({
  profile: 'VoidBloom',
  intensity: 0.8,
  debug: true,
});
```

### Using Web Components

```html
<!-- Basic hologram component -->
<quantum-hologram profile="CyberLotus" intensity="1.0" render-mode="quantum" enable-glitch>
</quantum-hologram>
```

### Using the Enhanced Cart

```javascript
// Add product to cart with quantum effects
const product = {
  id: 'product-123',
  title: 'Quantum Artifact',
  price: 299.99,
};

EnhancedCart.addToCart(product, { quantity: 2 })
  .then((result) => {
    console.log('Product added:', result);
  })
  .catch((error) => {
    console.error('Error adding product:', error);
  });

// Apply different mutation profile
EnhancedCart.applyProfile('NeonVortex');

// Apply trauma effects
EnhancedCart.setTraumaCodes(['glitch-0.7', 'void-0.5']);
```

## Component Reference

### HologramComponent

The `HologramComponent` is a custom element (Web Component) for rendering holographic products.

**Attributes:**

- `profile` - Mutation profile (CyberLotus, ObsidianBloom, VoidBloom, NeonVortex)
- `intensity` - Effect intensity (0.0-1.0)
- `render-mode` - Rendering mode (standard, quantum)
- `enable-glitch` - Enable glitch effects (boolean attribute)

**Methods:**

- `configure(options)` - Configure the component
- `render()` - Re-render the component
- `applyQuantumEffects()` - Apply quantum visual effects
- `triggerGlitch(intensity, duration)` - Trigger a glitch effect

### HologramRenderer

The `HologramRenderer` provides WebGL-powered 3D visualization.

**Methods:**

- `initialize(options)` - Initialize the renderer
- `loadModel(model)` - Load a 3D model
- `applyQuantumEffects(options)` - Apply quantum effects
- `applyGlitch(intensity, duration)` - Apply glitch effect
- `setTraumaCodes(traumaCodes)` - Set active trauma codes
- `updateSize(width, height)` - Update renderer size
- `dispose()` - Clean up resources

### EnhancedCart

The `EnhancedCart` provides advanced cart functionality with holographic previews.

**Methods:**

- `initialize(config)` - Initialize the cart system
- `addToCart(product, options)` - Add product to cart with effects
- `applyProfile(profile)` - Apply mutation profile
- `setTraumaCodes(traumaCodes)` - Set active trauma codes

### NeuralBus

The `NeuralBus` is an event bus for communication between components.

**Methods:**

- `publish(event, data)` - Publish an event
- `subscribe(event, callback)` - Subscribe to an event
- `unsubscribe(event, callback)` - Unsubscribe from an event
- `register(name, metadata)` - Register a component

## CSS System

CyberCore uses CSS Custom Properties for theming. The main profiles are:

1. **CyberLotus** - Cyan/blue theme
2. **ObsidianBloom** - Magenta/purple theme
3. **VoidBloom** - Deep purple theme
4. **NeonVortex** - Green/teal theme

Apply profiles using the `profile-*` classes or data attributes:

```html
<div class="profile-cyberlotus">
  <!-- Content with CyberLotus theme -->
</div>

<div data-profile="neonvortex">
  <!-- Content with NeonVortex theme -->
</div>
```

## Build System

CyberCore uses a modern build system with TypeScript and Webpack.

### Scripts

- `npm run dev` - Start webpack dev server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues

## Browser Support

CyberCore supports all modern browsers with WebGL and Web Components capabilities:

- Chrome 80+
- Firefox 75+
- Safari 14+
- Edge 80+

## Performance Considerations

For optimal performance:

1. Use Web Workers for intensive calculations
2. Lazy-load 3D models
3. Set appropriate hologram intensity based on device capabilities
4. Use the `standard` render mode for lower-end devices

## Contributing

See the [CONTRIBUTING.md](./CONTRIBUTING.md) file for information on how to contribute to CyberCore.

## License

ISC License
